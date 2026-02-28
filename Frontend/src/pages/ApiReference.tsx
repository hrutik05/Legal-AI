import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Search, Code, Database, Shield, Key, Clock, ExternalLink, Copy, CheckCircle } from 'lucide-react';
import Breadcrumbs from '../components/Breadcrumbs';
import ContextualLinks from '../components/ContextualLinks';

export default function ApiReference() {
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedEndpoint, setCopiedEndpoint] = useState<string | null>(null);

  const endpoints = [
    {
      method: 'POST',
      path: '/api/auth/signup',
      description: 'Register a new user account',
      parameters: [
        { name: 'fullName', type: 'string', required: true, description: 'User full name' },
        { name: 'email', type: 'string', required: true, description: 'User email address' },
        { name: 'phone', type: 'string', required: true, description: 'User phone number' },
        { name: 'password', type: 'string', required: true, description: 'User password' }
      ],
      response: {
        user: { id: 'string', fullName: 'string', email: 'string', phone: 'string' },
        token: 'string'
      }
    },
    {
      method: 'POST',
      path: '/api/auth/login',
      description: 'Authenticate user with email and password',
      parameters: [
        { name: 'email', type: 'string', required: true, description: 'User email address' },
        { name: 'password', type: 'string', required: true, description: 'User password' }
      ],
      response: {
        user: { id: 'string', fullName: 'string', email: 'string', phone: 'string' },
        token: 'string'
      }
    },
    {
      method: 'POST',
      path: '/api/chat/saveChatHistory',
      description: 'Save user chat query and response to history',
      parameters: [
        { name: 'userId', type: 'string', required: true, description: 'User ID' },
        { name: 'query', type: 'string', required: true, description: 'Legal query text' },
        { name: 'response', type: 'string', required: true, description: 'AI response (JSON string)' }
      ],
      response: {
        success: 'boolean',
        message: 'string'
      }
    },
    {
      method: 'GET',
      path: '/api/chat/getChatHistory',
      description: 'Retrieve user chat history',
      parameters: [
        { name: 'userId', type: 'string', required: true, description: 'User ID (query parameter)' }
      ],
      response: {
        success: 'boolean',
        data: 'array of messages'
      }
    },
    {
      method: 'POST',
      path: '/api/auth/forgotPassword',
      description: 'Request password reset email',
      parameters: [
        { name: 'email', type: 'string', required: true, description: 'User email address' }
      ],
      response: {
        message: 'string'
      }
    },
    {
      method: 'POST',
      path: '/api/auth/resetPassword',
      description: 'Reset password with token',
      parameters: [
        { name: 'token', type: 'string', required: true, description: 'Password reset token' },
        { name: 'password', type: 'string', required: true, description: 'New password' },
        { name: 'passwordConfirm', type: 'string', required: true, description: 'Password confirmation' }
      ],
      response: {
        message: 'string'
      }
    }
  ];

  const copyToClipboard = (text: string, endpoint: string) => {
    navigator.clipboard.writeText(text);
    setCopiedEndpoint(endpoint);
    setTimeout(() => setCopiedEndpoint(null), 2000);
  };

  const filteredEndpoints = endpoints.filter(endpoint =>
    endpoint.path.toLowerCase().includes(searchTerm.toLowerCase()) ||
    endpoint.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Header */}
      <Breadcrumbs />
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">API Reference</h1>
            <p className="text-xl text-gray-600 dark:text-gray-400">LegalAI REST API Documentation</p>
            <div className="mt-4 flex justify-center space-x-4">
              <Link to="/user-guide" className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium">
                User Guide →
              </Link>
              <Link to="/support" className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium">
                Get Support →
              </Link>
              <Link to="/faq" className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium">
                FAQ →
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Table of Contents */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Table of Contents</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <a href="#overview" className="flex items-center space-x-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors">
              <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
              <span>API Overview</span>
            </a>
            <a href="#authentication" className="flex items-center space-x-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors">
              <span className="w-2 h-2 bg-green-600 rounded-full"></span>
              <span>Authentication</span>
            </a>
            <a href="#endpoints" className="flex items-center space-x-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors">
              <span className="w-2 h-2 bg-purple-600 rounded-full"></span>
              <span>API Endpoints</span>
            </a>
            <a href="#database" className="flex items-center space-x-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors">
              <span className="w-2 h-2 bg-orange-600 rounded-full"></span>
              <span>Database Schema</span>
            </a>
            <a href="#legal-data-sources" className="flex items-center space-x-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors">
              <span className="w-2 h-2 bg-indigo-600 rounded-full"></span>
              <span>Legal Data Sources</span>
            </a>
            <a href="#external-apis" className="flex items-center space-x-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors">
              <span className="w-2 h-2 bg-amber-600 rounded-full"></span>
              <span>External APIs</span>
            </a>
          </div>
        </div>

        {/* API Overview */}
        <section id="overview" className="mb-16">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-lg">
                <Code className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">API Overview</h2>
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Base URL</h3>
                <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg font-mono text-sm">
                  https://api.legalai.com/v1
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Content Type</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  All API requests and responses use JSON format. Include the following header in all requests:
                </p>
                <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg font-mono text-sm">
                  Content-Type: application/json
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-blue-50 dark:bg-blue-900/30 p-6 rounded-lg border border-blue-200 dark:border-blue-700">
                  <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">RESTful Design</h4>
                  <p className="text-blue-700 dark:text-blue-300 text-sm">Standard HTTP methods and status codes</p>
                </div>
                <div className="bg-green-50 dark:bg-green-900/30 p-6 rounded-lg border border-green-200 dark:border-green-700">
                  <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2">JSON Responses</h4>
                  <p className="text-green-700 dark:text-green-300 text-sm">Consistent JSON structure for all endpoints</p>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/30 p-6 rounded-lg border border-purple-200 dark:border-purple-700">
                  <h4 className="font-semibold text-purple-900 dark:text-purple-100 mb-2">Versioned API</h4>
                  <p className="text-purple-700 dark:text-purple-300 text-sm">Version control for backward compatibility</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Authentication */}
        <section id="authentication" className="mb-16">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-gradient-to-r from-green-600 to-teal-600 p-3 rounded-lg">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Authentication</h2>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">API Key Authentication</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Include your API key in the Authorization header of all requests:
                </p>
                <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg font-mono text-sm">
                  Authorization: Bearer YOUR_API_KEY
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">JWT Token Authentication</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Upon successful login or signup, you receive a JWT token. Include this in the Authorization header:
                </p>
                <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg font-mono text-sm mb-4">
                  Authorization: Bearer YOUR_JWT_TOKEN
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Token expires as configured via JWT_EXPIRES_IN environment variable. Store securely in localStorage or session storage.
                </p>
              </div>

              <div className="bg-yellow-50 dark:bg-yellow-900/30 p-6 rounded-lg border border-yellow-200 dark:border-yellow-700">
                <div className="flex items-center space-x-2 mb-2">
                  <Key className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                  <h4 className="font-semibold text-yellow-900 dark:text-yellow-100">Security Best Practices</h4>
                </div>
                <ul className="text-yellow-800 dark:text-yellow-300 text-sm space-y-1">
                  <li>• Never expose API keys in client-side code</li>
                  <li>• Use environment variables to store keys</li>
                  <li>• Rotate keys regularly</li>
                  <li>• Monitor API usage for unusual activity</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* API Endpoints */}
        <section id="endpoints" className="mb-16">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-3 rounded-lg">
                  <Database className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">API Endpoints</h2>
              </div>
              
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search endpoints..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="space-y-6">
              {filteredEndpoints.map((endpoint, index) => (
                <div key={index} className="border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden">
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 border-b border-gray-200 dark:border-gray-600">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          endpoint.method === 'GET' ? 'bg-green-100 text-green-800' :
                          endpoint.method === 'POST' ? 'bg-blue-100 text-blue-800' :
                          'bg-orange-100 text-orange-800'
                        }`}>
                          {endpoint.method}
                        </span>
                        <code className="font-mono text-sm text-gray-900 dark:text-gray-100">
                          {endpoint.path}
                        </code>
                      </div>
                      <button
                        onClick={() => copyToClipboard(endpoint.path, endpoint.path)}
                        className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                      >
                        {copiedEndpoint === endpoint.path ? (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 mt-2">{endpoint.description}</p>
                  </div>
                  
                  <div className="p-4">
                    {endpoint.parameters.length > 0 && (
                      <div className="mb-4">
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Parameters</h4>
                        <div className="overflow-x-auto">
                          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
                            <thead className="bg-gray-50 dark:bg-gray-700">
                              <tr>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Name</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Type</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Required</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Description</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                              {endpoint.parameters.map((param, paramIndex) => (
                                <tr key={paramIndex}>
                                  <td className="px-4 py-2 text-sm font-mono text-gray-900 dark:text-gray-100">{param.name}</td>
                                  <td className="px-4 py-2 text-sm text-gray-600 dark:text-gray-300">{param.type}</td>
                                  <td className="px-4 py-2 text-sm">
                                    <span className={`px-2 py-1 rounded-full text-xs ${
                                      param.required ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                                    }`}>
                                      {param.required ? 'Required' : 'Optional'}
                                    </span>
                                  </td>
                                  <td className="px-4 py-2 text-sm text-gray-600 dark:text-gray-300">{param.description}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                    
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Response Format</h4>
                      <pre className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg text-sm overflow-x-auto">
                        <code className="text-gray-900 dark:text-gray-100">
                          {JSON.stringify(endpoint.response, null, 2)}
                        </code>
                      </pre>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Database Schema */}
        <section id="database" className="mb-16">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-gradient-to-r from-orange-600 to-red-600 p-3 rounded-lg">
                <Database className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Database Schema</h2>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Users Collection</h3>
                  <pre className="text-sm text-gray-700 dark:text-gray-300 overflow-x-auto">
{`{
  "_id": "ObjectId",
  "fullName": "string",
  "email": "string (unique)",
  "phone": "string",
  "password": "string (hashed)",
  "createdAt": "Date",
  "__v": "number"
}`}
                  </pre>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Legal Queries Collection</h3>
                  <pre className="text-sm text-gray-700 dark:text-gray-300 overflow-x-auto">
{`{
  "_id": "ObjectId",
  "userId": "ObjectId",
  "messages": [
    {
      "query": "string",
      "response": "string (JSON)",
      "timestamp": "Date",
      "_id": "ObjectId"
    }
  ],
  "createdAt": "Date",
  "updatedAt": "Date",
  "__v": "number"
}`}
                  </pre>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Relationships</h3>
                <div className="bg-blue-50 dark:bg-blue-900/30 p-6 rounded-lg border border-blue-200 dark:border-blue-700">
                  <ul className="space-y-2 text-blue-800 dark:text-blue-200">
                    <li>• Users → Legal Queries (One-to-Many via userId)</li>
                    <li>• Legal Queries → Messages (One-to-Many nested array)</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Legal Data Sources */}
        <section id="legal-data-sources" className="mb-16">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-gradient-to-r from-indigo-600 to-blue-600 p-3 rounded-lg">
                <Database className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Legal Data Sources</h2>
            </div>

            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Official Government Resources</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Name</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Type</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Description</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                      <tr>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">India Code Portal</td>
                        <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">Government API</td>
                        <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">Official repository of all Central Acts in structured format. Ideal for building legal knowledge base.</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">eCourts API</td>
                        <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">Government API</td>
                        <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">Judicial case status data from district & sessions courts. Useful for case-related queries.</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">Ministry of Law & Justice</td>
                        <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">Government Resource</td>
                        <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">Draft bills, notifications, constitutional amendments, and legislative updates.</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Legal Reference & Explanation Platforms</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Platform</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Website</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Use Case</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                      <tr>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">LawRato Legal Directory</td>
                        <td className="px-4 py-3 text-sm"><a href="https://lawrato.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">lawrato.com</a></td>
                        <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">Legal FAQ, explanations, categorized legal queries</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">IndianKanoon</td>
                        <td className="px-4 py-3 text-sm"><a href="https://indiankanoon.org/" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">indiankanoon.org</a></td>
                        <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">Searchable database of legal documents and case law</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">CaseMine</td>
                        <td className="px-4 py-3 text-sm"><a href="https://www.casemine.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">casemine.com</a></td>
                        <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">Case law database with India-focused judgment data</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">Bare Acts Info</td>
                        <td className="px-4 py-3 text-sm"><a href="https://www.bareactslive.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">bareactslive.com</a></td>
                        <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">Structured statute texts and act information</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">JSON & Structured Datasets</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Dataset</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Link</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Notes</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                      <tr>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">India Code JSON Extracts</td>
                        <td className="px-4 py-3 text-sm"><a href="https://www.indiacode.nic.in/" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">indiacode.nic.in</a></td>
                        <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">Request structured API data or scrape with permission</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">Open Government Data (OGD) Platform</td>
                        <td className="px-4 py-3 text-sm"><a href="https://data.gov.in/" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">data.gov.in</a></td>
                        <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">Statutory texts and related government datasets</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">LexML Law Datasets</td>
                        <td className="px-4 py-3 text-sm"><a href="https://lexml.gov.in/" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">lexml.gov.in</a></td>
                        <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">Unified legal document metadata</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">Legal-BERT Datasets</td>
                        <td className="px-4 py-3 text-sm"><a href="https://huggingface.co/datasets" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">huggingface.co</a></td>
                        <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">Legal datasets for classification and NER tasks</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* External APIs */}
        <section id="external-apis" className="mb-16">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-gradient-to-r from-amber-600 to-orange-600 p-3 rounded-lg">
                <Code className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">External APIs & Tools</h2>
            </div>

            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">NLP & Language Support</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">Google Translate API</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">Translation between languages for multilingual support</p>
                    <a href="https://cloud.google.com/translate" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline text-sm flex items-center space-x-1">
                      <span>Visit</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">IndicNLP Library</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">NLP support for Indian languages (tokenization, transliteration)</p>
                    <a href="https://github.com/AI4Bharat/indic_nlp_library" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline text-sm flex items-center space-x-1">
                      <span>Visit</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">Microsoft Translator API</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">High-quality translation with multi-language support</p>
                    <a href="https://azure.microsoft.com/en-us/services/cognitive-services/translator/" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline text-sm flex items-center space-x-1">
                      <span>Visit</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">Spacy NLP</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">Language processing for tokenization and entity recognition</p>
                    <a href="https://spacy.io/" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline text-sm flex items-center space-x-1">
                      <span>Visit</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Machine Learning & AI Models</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">Google Gemini API</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">Powerful generative AI for natural conversation and legal reasoning</p>
                    <a href="https://developers.generativeai.google/" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline text-sm flex items-center space-x-1">
                      <span>Visit</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">OpenAI GPT-4</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">General LLM for fine-tuning and legal query generation</p>
                    <a href="https://openai.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline text-sm flex items-center space-x-1">
                      <span>Visit</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">HuggingFace Transformers</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">BERT, Legal-BERT, and other NLP models for legal tasks</p>
                    <a href="https://huggingface.co/" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline text-sm flex items-center space-x-1">
                      <span>Visit</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">Sentence-Transformers</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">Semantic similarity models for legal text retrieval</p>
                    <a href="https://www.sbert.net/" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline text-sm flex items-center space-x-1">
                      <span>Visit</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Vector Search & Knowledge Retrieval</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">Pinecone</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">Vector database for semantic search and RAG implementation</p>
                    <a href="https://www.pinecone.io/" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline text-sm flex items-center space-x-1">
                      <span>Visit</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">Weaviate</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">Open-source vector search engine for semantic retrieval</p>
                    <a href="https://weaviate.io/" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline text-sm flex items-center space-x-1">
                      <span>Visit</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">FAISS</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">Local vector index for embeddings and similarity search</p>
                    <a href="https://github.com/facebookresearch/faiss" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline text-sm flex items-center space-x-1">
                      <span>Visit</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">Milvus</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">Scalable vector database for large-scale retrieval</p>
                    <a href="https://milvus.io/" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline text-sm flex items-center space-x-1">
                      <span>Visit</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Deployment & DevOps</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">FastAPI</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">Modern backend framework for REST API development</p>
                    <a href="https://fastapi.tiangolo.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline text-sm flex items-center space-x-1">
                      <span>Visit</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">GitHub Actions</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">CI/CD automation for deployment pipelines</p>
                    <a href="https://github.com/features/actions" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline text-sm flex items-center space-x-1">
                      <span>Visit</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">Render & Vercel</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">Cloud hosting for backend and frontend deployment</p>
                    <a href="https://render.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline text-sm flex items-center space-x-1">
                      <span>Visit</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">Docker</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">Containerization for application deployment</p>
                    <a href="https://www.docker.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline text-sm flex items-center space-x-1">
                      <span>Visit</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Response Formats & Error Handling */}
        <section className="mb-16">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Response Formats & Error Handling</h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Success Response (2xx)</h3>
                <pre className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg text-sm overflow-x-auto">
                  <code className="text-gray-900 dark:text-gray-100">
{`{
  "success": true,
  "data": { /* response data */ },
  "message": "Operation successful"
}`}
                  </code>
                </pre>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Error Response (4xx/5xx)</h3>
                <pre className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg text-sm overflow-x-auto">
                  <code className="text-gray-900 dark:text-gray-100">
{`{
  "success": false,
  "error": "Error message",
  "message": "Descriptive error details"
}`}
                  </code>
                </pre>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Common HTTP Status Codes</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-lg border border-green-200 dark:border-green-700">
                    <div className="font-semibold text-green-900 dark:text-green-100 mb-1">200 OK</div>
                    <p className="text-sm text-green-800 dark:text-green-300">Successful request</p>
                  </div>
                  <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg border border-blue-200 dark:border-blue-700">
                    <div className="font-semibold text-blue-900 dark:text-blue-100 mb-1">201 Created</div>
                    <p className="text-sm text-blue-800 dark:text-blue-300">Resource created successfully</p>
                  </div>
                  <div className="bg-yellow-50 dark:bg-yellow-900/30 p-4 rounded-lg border border-yellow-200 dark:border-yellow-700">
                    <div className="font-semibold text-yellow-900 dark:text-yellow-100 mb-1">400 Bad Request</div>
                    <p className="text-sm text-yellow-800 dark:text-yellow-300">Invalid request parameters</p>
                  </div>
                  <div className="bg-orange-50 dark:bg-orange-900/30 p-4 rounded-lg border border-orange-200 dark:border-orange-700">
                    <div className="font-semibold text-orange-900 dark:text-orange-100 mb-1">401 Unauthorized</div>
                    <p className="text-sm text-orange-800 dark:text-orange-300">Authentication required or failed</p>
                  </div>
                  <div className="bg-red-50 dark:bg-red-900/30 p-4 rounded-lg border border-red-200 dark:border-red-700">
                    <div className="font-semibold text-red-900 dark:text-red-100 mb-1">409 Conflict</div>
                    <p className="text-sm text-red-800 dark:text-red-300">Resource already exists</p>
                  </div>
                  <div className="bg-red-50 dark:bg-red-900/30 p-4 rounded-lg border border-red-200 dark:border-red-700">
                    <div className="font-semibold text-red-900 dark:text-red-100 mb-1">500 Server Error</div>
                    <p className="text-sm text-red-800 dark:text-red-300">Internal server error</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Help Section */}
        <div className="mt-16">
          <ContextualLinks context="documentation" />
        </div>
      </div>
    </div>
  );
}