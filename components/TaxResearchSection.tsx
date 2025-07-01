
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Spinner } from './Spinner';
import { streamGeminiChat } from '../services/geminiService';
import { ChatMessage } from '../types';
import { ResearchIcon, SendIcon, UserIcon, SparklesIcon } from './icons';
import { SimpleMarkdown } from './SimpleMarkdown';


export const TaxResearchSection: React.FC = () => {
  const [query, setQuery] = useState<string>('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [useSearch, setUseSearch] = useState<boolean>(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const apiKeyMissing = !process.env.API_KEY;

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const handleSubmitQuery = useCallback(async () => {
    if (!query.trim() || apiKeyMissing) {
      if(apiKeyMissing && !error) setError("Gemini API key is not configured. Please set the process.env.API_KEY environment variable.");
      return;
    }

    const userMessage: ChatMessage = {
      id: Date.now().toString() + 'u',
      sender: 'user',
      text: query,
      timestamp: new Date(),
    };
    setChatHistory(prev => [...prev, userMessage]);
    setQuery('');
    setIsLoading(true);
    setError(null);

    const aiMessageId = Date.now().toString() + 'ai';
    setChatHistory(prev => [...prev, { id: aiMessageId, sender: 'ai', text: '', timestamp: new Date() }]);

    // Prepare history for Gemini, excluding the latest empty AI message placeholder
    const geminiHistoryPayload = chatHistory.filter(msg => msg.id !== aiMessageId).map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }]
    }));
    geminiHistoryPayload.push({ role: 'user', parts: [{ text: userMessage.text }] });


    streamGeminiChat(
      userMessage.text,
      geminiHistoryPayload, 
      (chunkText, isFinal, references) => {
        setChatHistory(prev => prev.map(msg => 
            msg.id === aiMessageId 
            ? { ...msg, text: msg.text + chunkText, references: references || msg.references } 
            : msg
        ));
        if (isFinal) {
          setIsLoading(false);
        }
      },
      (errorMessage) => {
        setError(errorMessage);
        setChatHistory(prev => prev.filter(msg => msg.id !== aiMessageId)); 
        setIsLoading(false);
      },
      true, // useDefaultSystemInstruction
      useSearch,
      undefined // customSystemInstruction (ensures default is used)
    );

  }, [query, chatHistory, apiKeyMissing, error, useSearch]);
  
  const handleKeyPress = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSubmitQuery();
    }
  };


  return (
    <div className="flex flex-col h-[calc(100vh-250px)] max-h-[700px]">
      <div className="flex items-center space-x-3 mb-4">
        <ResearchIcon className="w-8 h-8 text-[rgb(var(--text-accent))]" />
        <h2 className="text-3xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[rgb(var(--text-accent))] to-[rgb(var(--text-highlight))]">AI Tax Research</h2>
      </div>
      <p className="text-[rgb(var(--text-secondary))] mb-1 text-sm">
        Ask tax-related questions. The AI will use its knowledge base and optionally Google Search for up-to-date information.
      </p>
      <div className="mb-4">
        <label className="flex items-center text-[rgb(var(--text-secondary))] text-sm cursor-pointer">
          <input 
            type="checkbox" 
            checked={useSearch} 
            onChange={(e) => setUseSearch(e.target.checked)}
            className="mr-2 h-4 w-4 rounded border-[rgb(var(--border-secondary))] text-[rgb(var(--text-accent))] focus:ring-[rgb(var(--text-accent))]"
            aria-label="Enable Google Search"
          />
          Enable Google Search for recent information (slower, may find web sources)
        </label>
      </div>


      <div ref={chatContainerRef} className="flex-grow bg-[rgba(var(--bg-tertiary),0.5)] p-4 rounded-lg overflow-y-auto mb-4 space-y-4 custom-scrollbar">
        {chatHistory.length === 0 && !isLoading && (
          <p className="text-[rgb(var(--text-secondary))] text-center py-8">Ask a question to start your research...</p>
        )}
        {chatHistory.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xl p-3 rounded-xl shadow ${
                msg.sender === 'user' 
                ? 'bg-[rgb(var(--text-accent))] text-[rgb(var(--text-on-accent))] rounded-br-none' 
                : 'bg-[rgb(var(--bg-interactive))] text-[rgb(var(--text-primary))] rounded-bl-none'
            }`}>
              <div className="flex items-start space-x-2 mb-1">
                {msg.sender === 'user' ? <UserIcon className="w-5 h-5 opacity-80" /> : <SparklesIcon className="w-5 h-5 text-[rgb(var(--text-highlight))]" />}
                <span className="text-xs font-semibold">{msg.sender === 'user' ? 'You' : 'Tax AI Assistant'}</span>
              </div>
               {msg.text ? <SimpleMarkdown text={msg.text} className={msg.sender === 'user' ? '!text-[rgb(var(--text-on-accent))]' : '!text-[rgb(var(--text-primary))]'} /> : (msg.sender === 'ai' && isLoading && <Spinner size="sm" color="text-[rgb(var(--text-secondary))]"/>) }
               {msg.references && msg.references.length > 0 && (
                 <div className="mt-3 pt-2 border-t border-[rgba(var(--border-secondary),0.5)]">
                    <p className="text-xs font-semibold opacity-80 mb-1">Sources:</p>
                    <ul className="space-y-1">
                        {msg.references.map((ref, index) => (
                            <li key={index} className="text-xs">
                                <a href={ref.uri} target="_blank" rel="noopener noreferrer" className="opacity-90 hover:opacity-100 hover:underline truncate block">
                                    {index+1}. {ref.title || ref.uri}
                                </a>
                            </li>
                        ))}
                    </ul>
                 </div>
               )}
              <p className="text-xs text-right mt-1 opacity-70">
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
        {isLoading && chatHistory.length > 0 && chatHistory[chatHistory.length - 1].sender === 'user' && (
             <div className="flex justify-start">
                <div className="max-w-xl p-3 rounded-lg shadow bg-[rgb(var(--bg-interactive))] text-[rgb(var(--text-primary))] rounded-bl-none">
                    <div className="flex items-start space-x-2 mb-1">
                         <SparklesIcon className="w-5 h-5 text-[rgb(var(--text-highlight))]" />
                         <span className="text-xs font-semibold">Tax AI Assistant</span>
                    </div>
                    <Spinner size="sm" color="text-[rgb(var(--text-secondary))]"/>
                </div>
            </div>
        )}
      </div>

      {apiKeyMissing && (
         <p className="text-[rgb(var(--text-error))] bg-[rgba(var(--text-error),0.1)] p-3 rounded-lg mb-4 text-sm">
           <strong>API Key Error:</strong> The Gemini API key is not configured. This feature requires <code>process.env.API_KEY</code> to be set in your environment.
         </p>
      )}
      {error && !apiKeyMissing && <p className="text-[rgb(var(--text-error))] bg-[rgba(var(--text-error),0.1)] p-3 rounded-lg mb-4 text-sm">{error}</p>}
      
      <div className="flex items-center space-x-2 border-t border-[rgb(var(--border-primary))] pt-4">
        <textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={apiKeyMissing ? "API Key not configured. Feature disabled." : "Ask your tax question..."}
          rows={2}
          className="flex-grow p-3 bg-[rgb(var(--bg-interactive))] border border-[rgb(var(--border-secondary))] rounded-lg focus:ring-2 focus:ring-[rgb(var(--border-focus))] focus:border-[rgb(var(--border-focus))] text-[rgb(var(--text-primary))] placeholder-[rgb(var(--text-secondary))] transition-colors resize-none disabled:opacity-50"
          aria-label="Your tax question"
          disabled={isLoading || apiKeyMissing}
        />
        <button
          onClick={handleSubmitQuery}
          disabled={isLoading || !query.trim() || apiKeyMissing}
          className="p-3 bg-gradient-to-r from-[rgb(var(--text-accent))] to-cyan-600 hover:from-[rgb(var(--text-accent-hover))] hover:to-cyan-700 text-white dark:text-[rgb(var(--text-on-accent))] font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Send question"
        >
          <SendIcon className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};
