import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  processUserMessage,
  ChatMessage,
  Language,
  detectEmergency,
} from '../../services/aiChatService';
import {
  ChatbotBookingFlow,
  ManageAppointmentsWidget,
  DoctorPrescriptionDraftWidget,
  HumanSupportHandoffWidget,
} from './ChatbotWidgets';
import '../../styles/chatbot.css';

const QUICK_ACTIONS = [
  { id: 'book', label: '📅 Book an Appointment', prompt: 'I want to book an appointment with a doctor' },
  { id: 'find_doctor', label: '👨‍⚕️ Find a Doctor', prompt: 'Show me available doctors and their fees' },
  { id: 'my_appointments', label: '🎫 Check My Appointment', prompt: 'Check my upcoming appointments and token' },
  { id: 'reports', label: '🔬 View Medical Reports', prompt: 'Explain my latest lab reports' },
  { id: 'prescriptions', label: '💊 Understand My Prescription', prompt: 'Explain my prescription and medicine dosages' },
  { id: 'services', label: '🏥 Hospital Services', prompt: 'What services, facilities, and timings does MediCare 360 offer?' },
  { id: 'billing', label: '🛡️ Billing & Insurance', prompt: 'Check my billing invoice and cashless insurance status' },
  { id: 'support', label: '💬 Talk to Hospital Support', prompt: 'I would like to speak with hospital support or reception' },
];

export default function MediBot() {
  const { user, role, isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // State
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [language, setLanguage] = useState<Language>('en');
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isTtsEnabled, setIsTtsEnabled] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [unreadCount, setUnreadCount] = useState(1);
  const [hasOpenedBefore, setHasOpenedBefore] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  // Initial welcome message
  useEffect(() => {
    const saved = localStorage.getItem(`medicare360_chat_history_${user?.id || 'guest'}`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed);
          return;
        }
      } catch { /* ignore */ }
    }

    // Default localized welcome
    const welcomeText = language === 'ta'
      ? 'வணக்கம்! மெடிகேர் 360-க்கு வரவேற்கிறோம். நான் மெடிபாட் (MediBot), உங்கள் மெய்நிகர் சுகாதார உதவியாளர். இன்று நான் உங்களுக்கு எவ்வாறு உதவ முடியும்?'
      : language === 'hi'
      ? 'नमस्ते! मेदिकेयर 360 में आपका स्वागत है। मैं मेडीबॉट (MediBot) हूँ, आपका वर्चुअल हेल्थ असिस्टेंट। आज मैं आपकी क्या सहायता कर सकता हूँ?'
      : "Hello! Welcome to MediCare 360. I'm MediBot, your virtual health assistant. How can I help you today?";

    const initialMsg: ChatMessage = {
      id: 'welcome-001',
      sender: 'bot',
      text: welcomeText,
      timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      language,
      quickReplies: ['Book an Appointment', 'Find a Doctor', 'Explain My Prescription', 'Hospital Services'],
    };

    setMessages([initialMsg]);
  }, [user?.id]);

  // Save chat history to localStorage
  useEffect(() => {
    if (messages.length > 0) {
      try {
        localStorage.setItem(`medicare360_chat_history_${user?.id || 'guest'}`, JSON.stringify(messages.slice(-30)));
      } catch { /* ignore */ }
    }
  }, [messages, user?.id]);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (isOpen && !isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isTyping, isMinimized]);

  // Keyboard accessibility: Escape closes chatbot
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Setup Web Speech Recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = language === 'ta' ? 'ta-IN' : language === 'hi' ? 'hi-IN' : 'en-IN';

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setInputMessage(transcript);
          setIsListening(false);
        };

        recognition.onerror = () => setIsListening(false);
        recognition.onend = () => setIsListening(false);
        recognitionRef.current = recognition;
      }
    }
  }, [language]);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.');
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setIsListening(true);
      recognitionRef.current.lang = language === 'ta' ? 'ta-IN' : language === 'hi' ? 'hi-IN' : 'en-IN';
      recognitionRef.current.start();
    }
  };

  // Text to Speech
  const speakText = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      // Remove markdown chars
      const cleanText = text.replace(/[*_#`~[\]]/g, '').slice(0, 300);
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = language === 'ta' ? 'ta-IN' : language === 'hi' ? 'hi-IN' : 'en-IN';
      utterance.rate = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text) return;

    setInputMessage('');
    const time = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: time,
      language,
    };

    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    try {
      const response = await processUserMessage(
        text,
        {
          currentUser: user,
          role,
          currentPath: location.pathname,
          preferredLanguage: language,
        },
        messages
      );

      setIsTyping(false);
      setMessages(prev => [...prev, response]);

      if (isTtsEnabled) {
        speakText(response.text);
      }
    } catch (err) {
      console.error(err);
      setIsTyping(false);
      const fallbackMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'bot',
        text: 'I apologize, but I encountered a momentary connection glitch. How else may I assist you with MediCare 360?',
        timestamp: time,
        language,
      };
      setMessages(prev => [...prev, fallbackMsg]);
    }
  };

  const handleLanguageChange = (newLang: Language) => {
    setLanguage(newLang);
    let switchNotice = '';
    if (newLang === 'ta') {
      switchNotice = 'மொழி **தமிழ்**க்கு மாற்றப்பட்டது. நான் உங்களுக்கு எவ்வாறு உதவ முடியும்?';
    } else if (newLang === 'hi') {
      switchNotice = 'भाषा **हिन्दी** में बदल दी गई है। मैं आपकी क्या मदद कर सकता हूँ?';
    } else {
      switchNotice = 'Language switched to **English**. How can I help you today?';
    }

    const noticeMsg: ChatMessage = {
      id: `lang-${Date.now()}`,
      sender: 'bot',
      text: switchNotice,
      timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      language: newLang,
      quickReplies: ['Book an Appointment', 'Find a Doctor', 'Explain My Prescription'],
    };
    setMessages(prev => [...prev, noticeMsg]);
  };

  const clearChat = () => {
    if (window.confirm('Clear your conversation history with MediBot?')) {
      localStorage.removeItem(`medicare360_chat_history_${user?.id || 'guest'}`);
      const welcome: ChatMessage = {
        id: `fresh-${Date.now()}`,
        sender: 'bot',
        text: "Conversation cleared. Hello! I'm MediBot. How can I assist your health and hospital needs today?",
        timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
        language,
      };
      setMessages([welcome]);
    }
  };

  const downloadChat = () => {
    const transcript = messages.map(m => `[${m.timestamp}] ${m.sender.toUpperCase()}:\n${m.text}\n`).join('\n---\n\n');
    const blob = new Blob([
      `# MediCare 360 — MediBot Consultation Summary\nDate: ${new Date().toLocaleDateString()}\nPatient/User: ${user?.name || 'Guest'}\n\n${transcript}`
    ], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `MediCare360_Chat_${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const openChat = () => {
    setIsOpen(true);
    setIsMinimized(false);
    setUnreadCount(0);
    setHasOpenedBefore(true);
    setTimeout(() => inputRef.current?.focus(), 200);
  };

  return (
    <>
      {/* ─── Floating Trigger Button ────────────────────────────────────────── */}
      {!isOpen && (
        <div className="medibot-trigger-container">
          {!hasOpenedBefore && (
            <div className="medibot-tooltip">
              <span className="medibot-tooltip-wave">👋</span> Need medical help or doctor booking?
            </div>
          )}

          <button
            onClick={openChat}
            className="medibot-trigger-btn"
            aria-label="Open MediBot AI Health Assistant"
            title="Open MediBot AI Health Assistant"
          >
            <div className="medibot-pulse-ring" />
            <div className="medibot-pulse-ring delay" />
            <div className="medibot-icon-wrapper">
              {/* Medical Pulse Heartbeat AI Icon */}
              <svg className="medibot-heartbeat-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
              </svg>
            </div>
            {unreadCount > 0 && <span className="medibot-badge">{unreadCount}</span>}
          </button>
        </div>
      )}

      {/* ─── Chat Window Modal ─────────────────────────────────────────────── */}
      {isOpen && (
        <div className={`medibot-window ${isMaximized ? 'maximized' : ''} ${isMinimized ? 'minimized' : ''}`}>
          {/* Header */}
          <div className="medibot-header">
            <div className="medibot-header-info">
              <div className="medibot-avatar">
                <span>🤖</span>
                <span className="medibot-status-dot" />
              </div>
              <div>
                <div className="medibot-title">
                  MediBot <span className="medibot-tag">AI Assistant</span>
                </div>
                <div className="medibot-subtitle">
                  {isAuthenticated ? (
                    <span>👤 {user?.name} · {role?.toUpperCase()}</span>
                  ) : (
                    <span>Online 24/7 · Verified Medical AI</span>
                  )}
                </div>
              </div>
            </div>

            {/* Header Controls */}
            <div className="medibot-header-actions">
              {/* Language Switcher */}
              <div className="medibot-lang-group">
                <button
                  className={`medibot-lang-btn ${language === 'en' ? 'active' : ''}`}
                  onClick={() => handleLanguageChange('en')}
                  title="English"
                >
                  EN
                </button>
                <button
                  className={`medibot-lang-btn ${language === 'ta' ? 'active' : ''}`}
                  onClick={() => handleLanguageChange('ta')}
                  title="தமிழ்"
                >
                  தமிழ்
                </button>
                <button
                  className={`medibot-lang-btn ${language === 'hi' ? 'active' : ''}`}
                  onClick={() => handleLanguageChange('hi')}
                  title="हिन्दी"
                >
                  हिन्दी
                </button>
              </div>

              {/* TTS Read-aloud Toggle */}
              <button
                className={`medibot-tool-btn ${isTtsEnabled ? 'active' : ''}`}
                onClick={() => setIsTtsEnabled(!isTtsEnabled)}
                title={isTtsEnabled ? 'Voice read-out: ON' : 'Voice read-out: OFF'}
              >
                {isTtsEnabled ? '🔊' : '🔇'}
              </button>

              {/* Minimize */}
              <button
                className="medibot-tool-btn"
                onClick={() => setIsMinimized(!isMinimized)}
                title={isMinimized ? 'Expand' : 'Minimize'}
              >
                {isMinimized ? '▲' : '—'}
              </button>

              {/* Maximize */}
              <button
                className="medibot-tool-btn desktop-only"
                onClick={() => setIsMaximized(!isMaximized)}
                title={isMaximized ? 'Restore size' : 'Maximize'}
              >
                {isMaximized ? '❐' : '⛶'}
              </button>

              {/* Close */}
              <button
                className="medibot-tool-btn close"
                onClick={() => setIsOpen(false)}
                title="Close chat"
              >
                ✕
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Emergency Banner Alert */}
              <div className="medibot-emergency-strip">
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span className="medibot-emergency-pulse">🚨</span>
                  <span><strong>Emergency?</strong> Call <strong>108</strong> immediately.</span>
                </div>
                <a href="tel:108" className="medibot-sos-btn">
                  SOS 108
                </a>
              </div>

              {/* Medical AI Disclaimer Pill */}
              <div className="medibot-disclaimer-pill">
                ℹ️ MediBot is an AI assistant, not a doctor. In acute emergencies, visit our 24/7 ER.
              </div>

              {/* Messages Body */}
              <div className="medibot-messages">
                {messages.map(msg => (
                  <div key={msg.id} className={`medibot-message-row ${msg.sender}`}>
                    {msg.sender === 'bot' && (
                      <div className="medibot-bot-avatar">🩺</div>
                    )}

                    <div className={`medibot-bubble ${msg.isEmergency ? 'emergency-bubble' : ''}`}>
                      <div className="medibot-message-text" style={{ whiteSpace: 'pre-line' }}>
                        {msg.text}
                      </div>

                      {/* Interactive Widgets */}
                      {msg.widgetType === 'appointment_flow' && (
                        <div style={{ marginTop: '8px' }}>
                          {msg.widgetData?.step === 'manage_appointments' ? (
                            <ManageAppointmentsWidget
                              appointments={msg.widgetData.appointments}
                              onActionComplete={text => handleSendMessage(text)}
                            />
                          ) : (
                            <ChatbotBookingFlow
                              initialStep={msg.widgetData?.step}
                              currentUser={user}
                              language={language}
                              onComplete={summary => handleSendMessage(`Appointment booked: ${summary}`)}
                            />
                          )}
                        </div>
                      )}

                      {msg.widgetType === 'prescription_draft' && (
                        <div style={{ marginTop: '8px' }}>
                          <DoctorPrescriptionDraftWidget
                            widgetData={msg.widgetData}
                            onComplete={text => handleSendMessage(text)}
                          />
                        </div>
                      )}

                      {msg.widgetType === 'support_handoff' && (
                        <div style={{ marginTop: '8px' }}>
                          <HumanSupportHandoffWidget
                            currentUser={user}
                            onComplete={text => handleSendMessage(text)}
                          />
                        </div>
                      )}

                      {/* Bubble Footer with Timestamp & Speak Button */}
                      <div className="medibot-bubble-meta">
                        <span>{msg.timestamp}</span>
                        {msg.sender === 'bot' && (
                          <button
                            onClick={() => speakText(msg.text)}
                            className="medibot-speak-bubble-btn"
                            title="Listen to response"
                          >
                            🔊
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {/* Typing Indicator */}
                {isTyping && (
                  <div className="medibot-message-row bot">
                    <div className="medibot-bot-avatar">🩺</div>
                    <div className="medibot-bubble medibot-typing-bubble">
                      <span className="typing-dot" />
                      <span className="typing-dot" />
                      <span className="typing-dot" />
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Quick Actions Tray */}
              <div className="medibot-quick-actions-bar">
                {QUICK_ACTIONS.map(action => (
                  <button
                    key={action.id}
                    onClick={() => handleSendMessage(action.prompt)}
                    className="medibot-quick-chip"
                  >
                    {action.label}
                  </button>
                ))}
              </div>

              {/* Input Area */}
              <div className="medibot-input-container">
                {/* Voice Input Button */}
                <button
                  type="button"
                  onClick={toggleListening}
                  className={`medibot-mic-btn ${isListening ? 'listening' : ''}`}
                  title={isListening ? 'Listening… click to stop' : 'Speak using microphone'}
                >
                  {isListening ? '🔴' : '🎙️'}
                </button>

                <input
                  ref={inputRef}
                  type="text"
                  placeholder={
                    isListening
                      ? 'Listening to your voice…'
                      : language === 'ta'
                      ? 'மெடிபாட்டிடம் உங்கள் கேள்வியை கேட்கவும்…'
                      : language === 'hi'
                      ? 'मेडीबॉट से अपना सवाल पूछें…'
                      : 'Ask MediBot about health, doctors, appointments…'
                  }
                  value={inputMessage}
                  onChange={e => setInputMessage(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  className="medibot-text-input"
                />

                <button
                  type="button"
                  onClick={() => handleSendMessage()}
                  disabled={!inputMessage.trim() || isTyping}
                  className="medibot-send-btn"
                  title="Send message"
                >
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13" />
                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                </button>
              </div>

              {/* Footer Utilities */}
              <div className="medibot-bottom-bar">
                <button onClick={downloadChat} className="medibot-link-action" title="Download chat as Markdown summary">
                  📥 Download Chat
                </button>
                <span>·</span>
                <button onClick={clearChat} className="medibot-link-action" title="Clear conversation history">
                  🗑️ Clear
                </button>
                <span>·</span>
                <button onClick={() => handleSendMessage('I want to speak with human support')} className="medibot-link-action" title="Escalate to human care desk">
                  📞 Human Desk
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}
