import React, { useState } from 'react';
import Header from './Header';
import './chatbot.css';

function Chatbot() {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hi! What can I help you with?' }
  ]);
  const [input, setInput] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('en-US');
  const [listening, setListening] = useState(false);

  const handleSend = (message = input) => {
    if (!message.trim()) return;

    setMessages([...messages, { sender: 'user', text: message }]);
    setInput('');

    setTimeout(() => {
      setMessages(prev => [...prev, { sender: 'bot', text: 'This is a response.' }]);
    }, 1000);
  };

  const startVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Your browser does not support voice input.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = selectedLanguage;
    recognition.start();

    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      handleSend(transcript);
    };

    recognition.onerror = (e) => {
      console.error("Speech recognition error:", e.error);
    };
  };

  // 📸 Image upload handler
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setMessages(prev => [...prev, { sender: 'user', image: reader.result }]);

        // Simulate bot response
        setTimeout(() => {
          setMessages(prev => [...prev, { sender: 'bot', text: 'Nice picture!' }]);
        }, 1000);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="chat-container">
      <Header title="Pocket Doctor" />

      <div className="chat-box">
        {messages.map((msg, i) => (
          <div key={i} className={`chat-message ${msg.sender}`}>
            {msg.text && <div>{msg.text}</div>}
            {msg.image && (
              <img
                src={msg.image}
                alt="Uploaded"
                style={{ maxWidth: '200px', borderRadius: '8px', marginTop: '5px' }}
              />
            )}
          </div>
        ))}
      </div>

      <div className="chat-input-container">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Type a message..."
        />
        <button onClick={() => handleSend()}>➤</button>
        <button onClick={startVoiceInput}>🎤</button>

        {/* Camera / file upload */}
        <label htmlFor="imageUpload" className="upload-label">📷</label>
<input
  id="imageUpload"
  type="file"
  accept="image/*"
  capture="environment"
  onChange={handleImageUpload}
  className="upload-input"
/>

      </div>

      <div className="language-selector">
        <label htmlFor="language">Language: </label>
        <select
          id="language"
          value={selectedLanguage}
          onChange={(e) => setSelectedLanguage(e.target.value)}
        >
          <option value="en-US">English</option>
          <option value="zu-ZA">isiZulu</option>
          <option value="fr-FR">French</option>
          <option value="es-ES">Spanish</option>
        </select>
      </div>
    </div>
  );
}

export default Chatbot;
