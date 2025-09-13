import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Bot, User, Lightbulb } from 'lucide-react';
import './AIChatBot.css';

const AIChatBot = ({ isOpen, onClose, userData, userInfo }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: `Hello ${userInfo?.name}! I'm your AI Performance Assistant. I can help you understand your QA scores, identify areas for improvement, and answer questions about your performance data.`,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getAIResponse = (userMessage) => {
    const message = userMessage.toLowerCase();
    const { qaData, kpiData } = userData;
    const latestQA = qaData && qaData.length > 0 ? qaData[qaData.length - 1] : null;
    const latestKPI = kpiData && kpiData.length > 0 ? kpiData[kpiData.length - 1] : null;

    // Performance-related queries
    if (message.includes('score') || message.includes('performance')) {
      if (latestQA) {
        return `Your current overall QA score is ${latestQA.overallScore.toFixed(1)}%, which is ${latestQA.overallScore >= 95 ? 'excellent' : latestQA.overallScore >= 85 ? 'good' : 'needs improvement'}! 

Here's the breakdown:
• New Tags: ${latestQA.newTagsScore.toFixed(1)}/20 points
• Collisions: ${latestQA.collisionScore.toFixed(1)}/30 points  
• Other Tags: ${latestQA.otherTagsScore.toFixed(1)}/50 points

${latestQA.overallScore < 95 ? 'Would you like specific recommendations to improve your score?' : 'Keep up the excellent work!'}`;
      }
      return "I don't have recent performance data available. Please make sure your data is loaded.";
    }

    // Improvement suggestions
    if (message.includes('improve') || message.includes('better') || message.includes('help')) {
      if (latestQA) {
        const suggestions = [];
        if (latestQA.newTagsScore < 18) suggestions.push('Focus on New Tags accuracy - review RRL, FCW, and Lane Cutoff guidelines');
        if (latestQA.collisionScore < 27) suggestions.push('Improve Collision detection - practice with C/PC and NC examples');
        if (latestQA.otherTagsScore < 45) suggestions.push('Strengthen Other Tags performance - review Distraction, ULC, and Cellphone criteria');
        
        if (suggestions.length > 0) {
          return `Here are personalized improvement suggestions:\n\n${suggestions.map((s, i) => `${i + 1}. ${s}`).join('\n')}\n\nWould you like detailed guidance on any specific tag?`;
        }
        return "Your performance is excellent across all categories! Continue maintaining your high standards.";
      }
      return "I need your performance data to provide personalized improvement suggestions.";
    }

    // KPI queries
    if (message.includes('kpi') || message.includes('punctuality') || message.includes('target')) {
      if (latestKPI) {
        return `Your latest KPI performance:
• Punctuality: ${latestKPI.punctuality}% (Grade ${latestKPI.punctualityGrade}/5)
• Download Time: ${latestKPI.downloadTime}s
• Target Achievement: ${latestKPI.targetAchievement.toFixed(1)}%
• Time on VA: ${latestKPI.timeOnVA}%

${latestKPI.qaCategory === 'Outstanding' ? 'Outstanding performance!' : 'Good work, keep improving!'}`;
      }
      return "KPI data is not available at the moment.";
    }

    // Specific tag queries
    if (message.includes('rrl') || message.includes('red light')) {
      return "Running Red Light (RRL) tips:\n• Vehicle must completely cross stop line after signal turns red\n• Check timestamp carefully against signal change\n• Consider intersection type and visibility\n• Review traffic flow context";
    }

    if (message.includes('fcw') || message.includes('forward collision')) {
      return "Forward Collision Warning (FCW) guidelines:\n• Verify genuine collision threat exists\n• Check vehicle closing speed and distance\n• Consider driver reaction time available\n• Assess road and weather conditions";
    }

    if (message.includes('smoking')) {
      return "Smoking Detection tips:\n• Look for cigarette, vaping device, or visible smoke\n• Check for smoking gestures and posture\n• Verify visibility and image quality\n• Consider lighting conditions";
    }

    // Trend analysis
    if (message.includes('trend') || message.includes('progress')) {
      if (qaData && qaData.length > 1) {
        const recent = qaData[qaData.length - 1];
        const previous = qaData[qaData.length - 2];
        const change = recent.overallScore - previous.overallScore;
        
        return `Your performance trend:\nCurrent: ${recent.overallScore.toFixed(1)}%\nPrevious: ${previous.overallScore.toFixed(1)}%\nChange: ${change > 0 ? '+' : ''}${change.toFixed(1)}%\n\n${change > 0 ? 'Great improvement! 📈' : change < 0 ? 'Let\'s work on getting back on track 💪' : 'Consistent performance 👍'}`;
      }
      return "I need more historical data to analyze trends.";
    }

    // Default responses
    const responses = [
      "I'm here to help with your QA performance! You can ask me about your scores, improvement tips, or specific tag guidelines.",
      "Try asking me about your current scores, KPI performance, or how to improve specific tags like RRL, FCW, or Smoking detection.",
      "I can help analyze your performance trends, provide improvement suggestions, or explain evaluation criteria for different tags."
    ];

    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI processing delay
    setTimeout(() => {
        const aiResponse = {
          id: Date.now() + 1,
          type: 'bot',
          content: getAIResponse(inputMessage),
          timestamp: new Date()
        };
  
        setMessages(prev => [...prev, aiResponse]);
        setIsTyping(false);
      }, 1000 + Math.random() * 2000);
    };
  
    const handleKeyPress = (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage();
      }
    };
  
    const suggestedQuestions = [
      "What's my current QA score?",
      "How can I improve my performance?",
      "Show me my KPI metrics",
      "What are my performance trends?"
    ];
  
    if (!isOpen) return null;
  
    return (
      <div className="chatbot-overlay">
        <div className="chatbot-container">
          <div className="chatbot-header">
            <div className="header-left">
              <Bot className="bot-icon" />
              <div>
                <h3>AI Performance Assistant</h3>
                <span className="status">Online</span>
              </div>
            </div>
            <button className="close-button" onClick={onClose}>
              <X size={20} />
            </button>
          </div>
  
          <div className="chatbot-messages">
            {messages.map((message) => (
              <div key={message.id} className={`message ${message.type}`}>
                <div className="message-avatar">
                  {message.type === 'bot' ? <Bot size={20} /> : <User size={20} />}
                </div>
                <div className="message-content">
                  <div className="message-text">{message.content}</div>
                  <div className="message-timestamp">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}
  
            {isTyping && (
              <div className="message bot typing">
                <div className="message-avatar">
                  <Bot size={20} />
                </div>
                <div className="message-content">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
  
          {messages.length === 1 && (
            <div className="suggested-questions">
              <p>Try asking:</p>
              <div className="suggestions">
                {suggestedQuestions.map((question, index) => (
                  <button
                    key={index}
                    className="suggestion-chip"
                    onClick={() => setInputMessage(question)}
                  >
                    <Lightbulb size={16} />
                    {question}
                  </button>
                ))}
              </div>
            </div>
          )}
  
          <div className="chatbot-input">
            <input
              type="text"
              placeholder="Ask me about your performance..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isTyping}
            />
            <button 
              className="send-button"
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isTyping}
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  export default AIChatBot;
  