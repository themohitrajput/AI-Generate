import { useState } from 'react';
import { Button, Form, InputGroup } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { User, SendFill } from 'react-bootstrap-icons'; // Importing user and send icons

export default function ChatInterface() {
  // State for conversations, messages, input message, prompt, content, and error
  const [conversations, setConversations] = useState([
    { id: 1, title: "React Hooks" },
    { id: 2, title: "CSS Grid Layout" },
    { id: 3, title: "JavaScript Promises" },
  ]);
  const [messages, setMessages] = useState([
    { id: 1, content: "How can I help you today?", sender: "ai" },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [prompt, setPrompt] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState(false);

  // Function to handle sending a message
  const handleSendMessage = () => {
    if (inputMessage.trim() !== "") {
      // Generate content based on the prompt before sending the message
      handleGenerateContent();
      setMessages((prev) => [
        ...prev,
        { id: prev.length + 1, content: inputMessage, sender: "user" },
      ]);
      setInputMessage("");
    }
  };

  // Function to generate content from the API
  const handleGenerateContent = () => {
    fetch('http://localhost:3001/generate-content', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    })
      .then((response) => response.json())
      .then((data) => {
        const generatedText = data?.response?.response?.candidates[0]?.content?.parts[0]?.text;
        setContent(generatedText);
        if (generatedText) {
          setMessages((prev) => [
            ...prev,
            { id: prev.length + 1, content: generatedText, sender: "ai" },
          ]);
        }
      })
      .catch((err) => {
        console.error('Error fetching data:', err);
        setError(true);
      });
  };

  return (
    <div className="d-flex h-100 bg-light" style={{ minHeight: "935px" ,minHeight: "935px"}}>
      {/* Left Sidebar */}
      <div className="bg-dark text-white p-3" style={{ width: '250px' }}>
        <Button variant="outline-light" className="mb-4">
          New chat
        </Button>
        <div>
          {conversations.map((conv) => (
            <div key={conv.id} className="py-2 px-3 rounded bg-dark mb-1 cursor-pointer">
              {conv.title}
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-grow-1 d-flex flex-column">
        <div className="container flex-grow-1 p-4" style={{width:"80%"}}>
          {messages.map((message) => (
            <div key={message.id} style={{ overflowY: 'auto'}} className={`d-flex mb-3 ${message.sender === 'user' ? 'justify-content-end' : 'justify-content-start'}` }>
              <div className={`d-flex align-items-start ${message.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className="avatar">
                  <img src="/ai-avatar.png" alt={message.sender} className="rounded-circle" width="30" />
                </div>
                <div className={`mx-2 p-2 rounded ${message.sender === 'user' ? 'bg-primary text-white' : 'bg-light'}`}>
                  {message.content}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Input area */}
        <div className="p-3 border-top">
          <InputGroup className="mb-3">
            <Form.Control
              type="text"
              placeholder="Type your message..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <Button variant="primary" onClick={handleSendMessage}>
              <SendFill />
            </Button>
          </InputGroup>
        </div>
      </div>
    </div>
  );
}
