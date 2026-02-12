import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PdfUploader from '../components/PdfUploader.tsx';
import PdfViewer from '../components/PdfViewer.tsx';
import QuestionBox from '../components/QuestionBox.tsx';
import AnswerBox from '../components/AnswerBox.tsx';

export default function PDFVisualizer() {
  const [pdfFile, setPdfFile] = useState<string | null>(null);
  const [pdfText, setPdfText] = useState<string>('');
  const [answer, setAnswer] = useState<string>('');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <Header onChatToggle={() => {}} />
      
      <main id="main-content" className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="text-center mb-12 mt-8">
            <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-cyan-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent mb-3">
              ⚖️ Legal DOC Analyzer
            </h1>
            <p className="text-gray-700 dark:text-gray-300 text-lg font-light">
              AI-Powered Legal Document Analysis & Intelligent Q&A System
            </p>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Left Column - Upload and Viewer */}
            <div className="space-y-6">
              <PdfUploader
                setPdfFile={setPdfFile}
                setPdfText={setPdfText}
              />
              {pdfFile && <PdfViewer file={pdfFile} />}
            </div>

            {/* Right Column - Questions and Answers */}
            <div className="space-y-6">
              {pdfText && (
                <QuestionBox
                  pdfText={pdfText}
                  setAnswer={setAnswer}
                />
              )}

              {answer && <AnswerBox answer={answer} />}

              {!pdfFile && (
                <div className="rounded-2xl border border-blue-200 dark:border-cyan-500/30 bg-gradient-to-br from-blue-50 dark:from-cyan-500/10 to-purple-50 dark:to-purple-500/10 backdrop-blur-xl p-8 text-center shadow-lg dark:shadow-cyan-500/10">
                  <div className="text-5xl mb-4">🚀</div>
                  <h3 className="text-gray-900 dark:text-white font-semibold text-lg mb-2">Get Started</h3>
                  <p className="text-gray-700 dark:text-gray-400">
                    Upload a PDF document to begin analyzing legal content with AI
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}