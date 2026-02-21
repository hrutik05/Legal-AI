
import { useState, useRef, useEffect } from 'react';
import {
  Send,
  Plus,
  MessageSquare,
  Trash2,
  X,
  Menu,
  User,
  Bot,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Settings,
  Copy,
  Link2,
  Check,
} from 'lucide-react';
import { Message, Conversation, ChatHistoryItem, BotResponse } from '../types';
import { apiClient } from '../utils/apiClient';
import { useToast } from '../contexts/ToastContext';
import { useVoiceInput } from '../hooks/useVoiceInput';
import { useVoiceOutput } from '../hooks/useVoiceOutput';
import { formatTextForSpeech, truncateForSpeech, cleanResponseText } from '../utils/voiceUtils';
import { copyToClipboard, formatTextForCopy } from '../utils/copyUtils';
import { VoiceSettings } from './VoiceSettings';
import { ReferenceModal } from './ReferenceModal';

function ChatInterface() {
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: '1',
      title: 'New Conversation',
      messages: [],
      createdAt: new Date(),
    },
  ]);
  const [activeConversationId, setActiveConversationId] = useState('1');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [history, setHistory] = useState<ChatHistoryItem[]>([]);
  const [voiceSettingsOpen, setVoiceSettingsOpen] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { showError, showSuccess } = useToast();

  // Voice input and output hooks
  const {
    isListening,
    transcript,
    startListening,
    stopListening,
    resetTranscript,
    isBrowserSupported: isVoiceInputSupported,
    error: voiceInputError,
  } = useVoiceInput();

  const {
    isSpeaking,
    speak,
    stop: stopSpeaking,
    isBrowserSupported: isVoiceOutputSupported,
    voices,
    setVoiceRate,
    setVoiceVolume,
    setVoice,
  } = useVoiceOutput();

  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const [referenceModalOpen, setReferenceModalOpen] = useState(false);
  const [selectedMessageForReference, setSelectedMessageForReference] = useState<Message | null>(null);

  const activeConversation = conversations.find((c) => c.id === activeConversationId);

  // Fetch chat history from backend
  const fetchHistory = async () => {
    try {
      const user = localStorage.getItem('user');
      if (!user) return;
      const parsed = JSON.parse(user);
      const userId = parsed.id || parsed._id;
      if (!userId) return;

      const resp = await apiClient.get(`/auth/chat-history/${userId}`);
      if (resp && resp.success) {
        // resp.data can be either the array directly or an object like { success:true, data: [...] }
        const raw = resp.data as unknown;
        const payload: ChatHistoryItem[] = Array.isArray(raw)
          ? (raw as ChatHistoryItem[])
          : (typeof raw === 'object' && raw !== null && Array.isArray((raw as Record<string, unknown>)['data']))
          ? ((raw as Record<string, unknown>)['data'] as ChatHistoryItem[])
          : [];
        setHistory(payload);
      }
    } catch (err) {
      console.error('Failed to fetch chat history:', err);
    }
  };

  const deleteHistoryItem = async (idx: number) => {
    const item = history[idx];
    if (!item) return;

    // Optimistically remove item from UI first
    setHistory((prev) => prev.filter((_, i) => i !== idx));
    
    try {
      const user = localStorage.getItem('user');
      if (!user) return;
      const parsed = JSON.parse(user);
      const userId = parsed.id || parsed._id;

      const resp = await apiClient.delete(
        `/auth/chat-history/${userId}?query=${encodeURIComponent(item.query)}`
      );
      if (resp && resp.success) {
        showSuccess('Deleted', 'Chat history item removed');
      } else {
        // Revert the deletion if API call fails
        setHistory((prev) => {
          const newHistory = [...prev];
          newHistory.splice(idx, 0, item);
          return newHistory;
        });
        showError('Delete failed', 'Unable to remove history');
      }
    } catch (err) {
      // Revert the deletion on error
      setHistory((prev) => {
        const newHistory = [...prev];
        newHistory.splice(idx, 0, item);
        return newHistory;
      });
      console.error('Error deleting history item:', err);
      showError('Delete failed', 'Network or server error');
    }
  };

  const loadHistoryItem = (idx: number) => {
    const item = history[idx];
    if (!item) return;
    const userMsg: Message = {
      id: `hist-user-${idx}-${Date.now()}`,
      role: 'user',
      content: item.query,
      timestamp: new Date(),
    };
    const botMsg: Message = {
      id: `hist-bot-${idx}-${Date.now()}`,
      role: 'assistant',
      content: item.response,
      timestamp: new Date(),
    };
    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === activeConversationId
          ? { ...conv, messages: [userMsg, botMsg], title: item.query.slice(0, 30) + '...' }
          : conv
      )
    );
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  useEffect(scrollToBottom, [activeConversation?.messages]);

  // Handle voice input error
  useEffect(() => {
    if (voiceInputError) {
      showError('Voice Error', voiceInputError);
    }
  }, [voiceInputError, showError]);

  // Handle voice input results
  useEffect(() => {
    if (!isListening && transcript.trim()) {
      setInput(transcript.trim());
    }
  }, [isListening, transcript]);

  // Clear speaking message ID when speech ends
  useEffect(() => {
    if (!isSpeaking && speakingMessageId) {
      setSpeakingMessageId(null);
    }
  }, [isSpeaking, speakingMessageId]);

  

  const handleSendMessage = async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      role: 'user',
      timestamp: new Date(),
    };

    // Add user message to UI immediately
    setConversations((prev) =>
      prev.map((conv) => {
        if (conv.id === activeConversationId) {
          const updatedMessages = [...conv.messages, userMessage];
          return {
            ...conv,
            messages: updatedMessages,
            title:
              conv.messages.length === 0 ? content.slice(0, 30) + '...' : conv.title,
          };
        }
        return conv;
      })
    );

    setIsTyping(true);

    try {
      // Forward the query to Node backend which proxies to Python service
      // append a hint so the model answers using Indian laws only
      const queryToSend = `${content} (please answer using Indian laws only)`;
      const resp = await apiClient.post<BotResponse>('/auth/chatbot/query', { query: queryToSend });

      // resp.data should contain { answer, citations, disclaimer } (see Python service)
      let botContent = 'Query is outside supported legal domains. This chatbot answers only legal (law-related) queries.';
      if (resp && resp.success) {
        // Normalize several possible shapes coming from backend/proxy:
        // 1) resp.data = { answer: '...' , citations: [...] }
        // 2) resp.data = { data: { answer: '...', ... } }
        // 3) resp.data = 'plain string'
        const body = resp.data as unknown;
        let inner: unknown = body;
        if (typeof body === 'object' && body !== null && (body as Record<string, unknown>)['data']) {
          inner = (body as Record<string, unknown>)['data'];
        }

        if (typeof inner === 'object' && inner !== null && typeof (inner as {answer?: string}).answer === 'string') {
          botContent = (inner as {answer: string}).answer;
        } else if (typeof body === 'string') {
          botContent = body;
        } else {
          // Fallback: stringify minimal piece to avoid showing entire wrapper
          try {
            botContent = JSON.stringify(inner).slice(0, 200);
          } catch {
            botContent = 'Sorry, the assistant returned an unexpected response.';
          }
        }
      }

      // Clean and format the bot response for better readability
      const cleanedContent = cleanResponseText(botContent);

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: cleanedContent,
        role: 'assistant',
        timestamp: new Date(),
      };

      // Append bot message to conversation
      setConversations((prev) =>
        prev.map((conv) => {
          if (conv.id === activeConversationId) {
            return {
              ...conv,
              messages: [...conv.messages, botMessage],
            };
          }
          return conv;
        })
      );

      // Persist Q/A to backend chat history (if user logged in)
      (async () => {
        try {
          const user = localStorage.getItem('user');
          if (!user) return;
          const parsed = JSON.parse(user);
          const userId = parsed.id || parsed._id;
          if (!userId) return;

          // Save only the answer text to history, not the full JSON wrapper
          const payload = { userId, query: content, response: botMessage.content };
          const saveResp = await apiClient.post('/auth/chat-history', payload);
          if (saveResp && saveResp.success) {
            // Prepend to local history so sidebar updates immediately
            setHistory((prev) => [
              { query: content, response: botMessage.content, timestamp: new Date() },
              ...prev,
            ]);
            showSuccess('Saved', 'Conversation saved to history');
          }
        } catch (err) {
          console.error('Failed to save chat history:', err);
        }
      })();
    } catch (err) {
      console.error('Error calling chatbot endpoint:', err);
      const botMessage: Message = {
        id: (Date.now() + 2).toString(),
        content: 'Sorry — the assistant is unavailable right now. Please try again later.',
        role: 'assistant',
        timestamp: new Date(),
      };

      setConversations((prev) =>
        prev.map((conv) => {
          if (conv.id === activeConversationId) {
            return {
              ...conv,
              messages: [...conv.messages, botMessage],
            };
          }
          return conv;
        })
      );
    } finally {
      setIsTyping(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      handleSendMessage(input.trim());
      setInput('');
      resetTranscript(); // Clear transcript to prevent duplication
      if (inputRef.current) inputRef.current.style.height = 'auto';
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = Math.min(e.target.scrollHeight, 200) + 'px';
  };

  const handleNewConversation = () => {
    const newConv: Conversation = {
      id: Date.now().toString(),
      title: 'New Conversation',
      messages: [],
      createdAt: new Date(),
    };
    setConversations((prev) => [newConv, ...prev]);
    setActiveConversationId(newConv.id);
  };

  const handleDeleteConversation = (id: string) => {
    setConversations((prev) => prev.filter((c) => c.id !== id));
  };

  const handleVoiceInput = () => {
    if (isListening) {
      stopListening();
    } else {
      if (!isVoiceInputSupported) {
        showError('Not Supported', 'Your browser doesn\'t support voice input');
        return;
      }
      resetTranscript();
      startListening();
    }
  };

  const handleSpeakMessage = (messageId: string, content: string) => {
    if (speakingMessageId === messageId) {
      // If already speaking this message, stop it
      stopSpeaking();
      setSpeakingMessageId(null);
    } else {
      // Speak the message
      if (!isVoiceOutputSupported) {
        showError('Not Supported', 'Your browser doesn\'t support voice output');
        return;
      }
      setSpeakingMessageId(messageId);
      
      // Format text for speech: remove markdown, HTML tags, and truncate
      const cleanedText = formatTextForSpeech(content);
      const finalText = truncateForSpeech(cleanedText, 1500);
      
      speak(finalText);
    }
  };

  const handleCopyMessage = async (messageId: string, content: string) => {
    const cleanedText = formatTextForCopy(cleanAndParseText(content));
    const success = await copyToClipboard(cleanedText);
    
    if (success) {
      setCopiedMessageId(messageId);
      showSuccess('Copied!', 'Answer copied to clipboard');
      setTimeout(() => setCopiedMessageId(null), 2000);
    } else {
      showError('Copy Failed', 'Unable to copy to clipboard');
    }
  };

  const handleOpenReference = (message: Message) => {
    setSelectedMessageForReference(message);
    setReferenceModalOpen(true);
  };

  const cleanAndParseText = (text: string) => {
    // First, clean up raw text
    let cleaned = text;
    
    // Remove standalone asterisks at line start
    cleaned = cleaned.replace(/^\s*\*\s*/gm, '• ');
    
    // Convert markdown bold and italic to HTML
    cleaned = cleaned.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-gray-900">$1</strong>');
    cleaned = cleaned.replace(/__(.*?)__/g, '<strong class="font-bold text-gray-900">$1</strong>');
    cleaned = cleaned.replace(/\*(.*?)\*/g, '<em class="italic text-gray-900">$1</em>');
    cleaned = cleaned.replace(/_(.*?)_/g, '<em class="italic text-gray-900">$1</em>');
    
    // Handle numbered and bullet lists
    const lines = cleaned.split('\n');
    let html = '';
    let inParagraph = false;
    
    for (let line of lines) {
      line = line.trim();
      
      if (line === '') {
        if (inParagraph) {
          html += '</p>';
          inParagraph = false;
        }
      } else if (/^(\d+)\.|\s*•/.test(line)) {
        if (inParagraph) {
          html += '</p>';
          inParagraph = false;
        }
        html += '<div style="margin: 0.5em 0 0.5em 2em; line-height: 1.6; color: #000;">' + line + '</div>';
      } else if (/^#+\s+/.test(line)) {
        if (inParagraph) {
          html += '</p>';
          inParagraph = false;
        }
        const level = line.match(/^#+/)?.[0].length || 1;
        const title = line.replace(/^#+\s+/, '');
        html += `<h${level} style="font-weight: bold; margin: 1em 0 0.5em 0; font-size: ${2 - level * 0.2}em; color: #000;">${title}</h${level}>`;
      } else {
        if (!inParagraph) {
          html += '<p style="margin: 0.5em 0; line-height: 1.6; color: #000;">';
          inParagraph = true;
        }
        html += line + ' ';
      }
    }
    
    if (inParagraph) {
      html += '</p>';
    }
    
    // Handle inline code
    html = html.replace(/`([^`]+)`/g, '<code class="bg-gray-100 px-2 py-1 rounded text-sm font-mono text-gray-900">$1</code>');
    
    // Clean up extra spacing
    html = html.replace(/<p>\s*<\/p>/g, '');
    html = html.replace(/\s+<\/p>/g, '</p>');
    
    return html;
  };

  const formatDate = (date: string | Date) =>
    new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <>
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        <aside
          className={`fixed lg:relative inset-y-0 left-0 z-50 w-64 bg-gray-900 text-white flex flex-col transition-transform duration-300 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
        >
          <div className="p-4 border-b border-gray-800">
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden absolute top-4 right-4 p-1 hover:bg-gray-800 rounded"
            >
              <X className="w-5 h-5" />
            </button>

            <button
              onClick={handleNewConversation}
              className="w-full flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg transition-all"
            >
              <Plus className="w-5 h-5" />
              <span className="font-medium">New Chat</span>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto py-4 px-2">
            <h3 className="text-xs uppercase tracking-wider text-gray-400 mb-2">
              Conversations
            </h3>
            {conversations.map((conv) => (
              <div
                key={conv.id}
                className={`group relative mb-1 rounded-lg transition-all ${
                  conv.id === activeConversationId
                    ? 'bg-gray-800'
                    : 'hover:bg-gray-800'
                }`}
              >
                <button
                  onClick={() => setActiveConversationId(conv.id)}
                  className="w-full text-left px-3 py-3 pr-10"
                >
                  <div className="flex items-start gap-2">
                    <MessageSquare className="w-4 h-4 mt-0.5 text-gray-400" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate text-gray-200">
                        {conv.title}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {formatDate(conv.createdAt)}
                      </p>
                    </div>
                  </div>
                </button>
                <button
                  onClick={() => handleDeleteConversation(conv.id)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}

            {/* History Section */}
            <div className="mt-5 border-t border-gray-700 pt-4">
              <h3 className="text-xs uppercase tracking-wider text-gray-400 mb-2">
                Saved History
              </h3>
              {history.length === 0 ? (
                <p className="text-gray-500 text-sm px-2">No saved history</p>
              ) : (
                history.map((item, idx) => (
                  <div
                    key={idx}
                    className="group relative mb-2 rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    <button
                      onClick={() => loadHistoryItem(idx)}
                      className="w-full text-left px-3 py-2"
                    >
                      <p className="text-sm text-gray-200 truncate">{item.query}</p>
                    </button>
                    <button
                      onClick={() => deleteHistoryItem(idx)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-red-400"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </aside>
      </>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col h-screen">
        <header className="border-b border-gray-200 bg-white">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 hover:bg-gray-100 rounded-lg lg:hidden"
              >
                <Menu className="w-5 h-5 text-gray-600" />
              </button>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                ChatBot-AI Legal Assistant
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setVoiceSettingsOpen(true)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors group"
                title="Voice settings"
              >
                <Settings className="w-5 h-5 text-gray-600 group-hover:text-blue-500" />
              </button>
              <button
                onClick={() =>
                  setConversations((prev) =>
                    prev.map((c) =>
                      c.id === activeConversationId
                        ? { ...c, messages: [], title: 'New Conversation' }
                        : c
                    )
                  )
                }
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors group"
                title="Clear conversation"
              >
                <Trash2 className="w-5 h-5 text-gray-600 group-hover:text-red-500" />
              </button>
            </div>
          </div>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-4 py-8">
            {!activeConversation?.messages.length ? (
              <div className="text-center text-gray-600 py-20">
                <p>Start a conversation by typing below</p>
              </div>
            ) : (
              activeConversation.messages.map((msg: Message) => (
                <div
                  key={msg.id}
                  className={`flex gap-3 mb-6 ${
                    msg.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {msg.role === 'assistant' && (
                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                      <Bot className="w-5 h-5 text-white" />
                    </div>
                  )}
                  <div className="flex flex-col gap-2">
                    <div
                      className={`max-w-[80%] px-4 py-3 rounded-2xl ${
                        msg.role === 'user'
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                          : 'bg-white border'
                      }`}
                    >
                      {msg.role === 'assistant' ? (
                        <div
                          dangerouslySetInnerHTML={{ __html: cleanAndParseText(msg.content) }}
                        />
                      ) : (
                        <p>{msg.content}</p>
                      )}
                    </div>
                    {msg.role === 'assistant' && (
                      <div className="flex flex-wrap gap-2 self-start ml-2">
                        {/* Voice Button */}
                        <button
                          onClick={() => handleSpeakMessage(msg.id, msg.content)}
                          title={speakingMessageId === msg.id ? 'Stop speaking' : 'Speak message'}
                          className={`p-2 rounded-lg transition-all ${
                            speakingMessageId === msg.id
                              ? 'bg-blue-500 text-white'
                              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          }`}
                        >
                          {speakingMessageId === msg.id ? (
                            <VolumeX className="w-4 h-4" />
                          ) : (
                            <Volume2 className="w-4 h-4" />
                          )}
                        </button>

                        {/* Stop Button - explicit stop control to avoid toggle issues */}
                        <button
                          onClick={() => {
                            try {
                              stopSpeaking();
                            } catch (e) {
                              console.error('Error stopping speech:', e);
                            }
                            setSpeakingMessageId(null);
                          }}
                          title="Stop speaking immediately"
                          className={`p-2 rounded-lg transition-all ${
                            copiedMessageId === msg.id
                              ? ' text-white'
                              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          }`}
                        >
                          <X className="w-4 h-4" />
                        </button>

                        {/* Copy Button */}
                        <button
                          onClick={() => handleCopyMessage(msg.id, msg.content)}
                          title="Copy answer"
                          className={`p-2 rounded-lg transition-all ${
                            copiedMessageId === msg.id
                              ? 'bg-green-500 text-white'
                              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          }`}
                        >
                          {copiedMessageId === msg.id ? (
                            <Check className="w-4 h-4" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>

                        {/* Reference Button */}
                        <button
                          onClick={() => handleOpenReference(msg)}
                          title="View references"
                          className="p-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition-all"
                        >
                          <Link2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                  {msg.role === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center flex-shrink-0">
                      <User className="w-5 h-5 text-white" />
                    </div>
                  )}
                </div>
              ))
            )}
            {isTyping && (
              <div className="flex gap-3 mb-6">
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div className="bg-white border rounded-2xl px-4 py-3">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: '150ms' }}
                    />
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: '300ms' }}
                    />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Box */}
        <div className="border-t border-gray-200 bg-white">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <form onSubmit={handleSubmit} className="relative">
              <textarea
                ref={inputRef}
                value={input}
                onChange={handleInputChange}
                placeholder={isListening ? 'Listening...' : 'Type your message...'}
                className={`w-full resize-none rounded-2xl border px-4 py-3 pr-24 focus:outline-none focus:ring-2 ${
                  isListening
                    ? 'border-red-400 bg-red-50 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
              />
              
              {/* Microphone Button */}
              <button
                type="button"
                onClick={handleVoiceInput}
                title={isListening ? 'Stop listening' : 'Start voice input'}
                className={`absolute right-14 bottom-2 p-2 rounded-xl transition-all ${
                  isListening
                    ? 'bg-red-500 text-white hover:bg-red-600'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {isListening ? (
                  <MicOff className="w-5 h-5" />
                ) : (
                  <Mic className="w-5 h-5" />
                )}
              </button>

              {/* Send Button */}
              <button
                type="submit"
                disabled={!input.trim()}
                className="absolute right-2 bottom-2 p-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 disabled:opacity-50"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Voice Settings Modal */}
      <VoiceSettings
        isOpen={voiceSettingsOpen}
        onClose={() => setVoiceSettingsOpen(false)}
        onRateChange={setVoiceRate}
        onVolumeChange={setVoiceVolume}
        voices={voices}
        onVoiceChange={setVoice}
      />

      {/* Reference Modal */}
      <ReferenceModal
        isOpen={referenceModalOpen}
        onClose={() => setReferenceModalOpen(false)}
        domain={selectedMessageForReference?.domain}
        source={selectedMessageForReference?.source}
        citations={selectedMessageForReference?.citations}
        messageContent={selectedMessageForReference?.content}
      />
    </div>
  );
}

export default ChatInterface;
