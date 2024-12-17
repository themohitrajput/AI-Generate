import React, { useState, useRef, useEffect } from 'react';
import { Button, Form, InputGroup } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { SendFill } from 'react-bootstrap-icons';

export default function ChatInterface() {
  const [conversations, setConversations] = useState([
    { id: 1, title: "React Hooks" },
    { id: 2, title: "CSS Grid Layout" },
    { id: 3, title: "JavaScript Promises" },
  ]);
  const [messages, setMessages] = useState([
    { id: 1, content: "How can I help you today?", sender: "ai" },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState(false);

  const messagesEndRef = useRef(null); // Reference for the messages container
  const textareaRef = useRef(null); // Reference for textarea

  // Function to handle sending a message
  const handleSendMessage = () => {
    if (inputMessage.trim() !== "") {
      handleGenerateContent();
      setMessages((prev) => [
        ...prev,
        { id: prev.length + 1, content: inputMessage, sender: "user" },
      ]);
      setInputMessage("");
    }
  };

  // Adjust the textarea height dynamically based on content
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"; // Reset height to auto before adjusting
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [inputMessage]);

  // Function to generate content from the API
  const handleGenerateContent = () => {
    fetch('http://localhost:3001/generate-content', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt: inputMessage }),
    }).then((response) => response.json())
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

  // Scroll to the bottom whenever messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      handleSendMessage(); // Send message when Enter is pressed without Shift
    }
    if (e.key === "Enter" && e.shiftKey) {
      // Let the textarea grow when Shift + Enter is pressed
      e.preventDefault(); // Prevents the default action of adding a new line
      setInputMessage(inputMessage + '\n'); // Add a newline in the input message
    }
  };

  return (
    <div className="d-flex vh-100 bg-light">
      <div className="bg-dark text-white p-3" style={{ width: "250px" }}>
        <Button variant="outline-light" className="mb-4 w-100">
          New chat
        </Button>
        <div>
          {conversations.map((conv) => (
            <div
              key={conv.id}
              className="py-2 px-3 rounded mb-2"
              style={{ cursor: "pointer", backgroundColor: "#2e2e2e" }}
            >
              {conv.title}
            </div>
          ))}
        </div>
      </div>

      <div className="flex-grow-1 d-flex flex-column" style={{ width: "min-content", padding: "30px 370px" }}>
        <div
          className="flex-grow-1"
          style={{
            overflowY: "auto",
            backgroundColor: "#f7f8fa",
            flexDirection: "column-reverse",
            scrollbarWidth: "none",
          }}>
          {messages.map((message) => (
            <div
              key={message.id}
              className={`d-flex mb-3 ${
                message.sender === "user" ? "justify-content-end" : "justify-content-start"
              }`}
            >
              <div
                className={`d-flex align-items-center ${
                  message.sender === "user" ? "flex-row-reverse" : ""
                }`}
              >
                <img
                  src={
                    message.sender === "user"
                      ? "https://w7.pngwing.com/pngs/857/213/png-transparent-man-avatar-user-business-avatar-icon-thumbnail.png"
                      : "https://www.pngarts.com/files/5/Cartoon-Avatar-PNG-Photo.png"
                  }
                  alt={message.sender}
                  className="rounded-circle"
                  width="40"
                  style={{
                    margin: message.sender === "user" ? "0 0 0 10px" : "0 10px 0 0",
                  }}
                />
                <div
                  className={`p-3 rounded Larger shadow ${
                    message.sender === "user" ? "bg-light text-black" : "bg-white text-dark"
                  }`}
                  style={{
                    maxWidth: "90%",
                    wordBreak: "break-word",
                    backgroundColor: message.sender === "user" ? "#f1f1f1" : "#e9ecef",
                    color: message.sender === "user" ? "#000" : "#343a40",
                  }}
                >
                  {message.content}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} /> {/* Reference point for scrolling */}
        </div>
        <div
          className="p-3 rounded-pill Larger shadow bg-white"
          style={{
            position: "sticky",
            bottom: 0,
            zIndex: 10,
          }}>
          <InputGroup>
            <Form.Control
              as="textarea"
              ref={textareaRef}
              rows={1}
              placeholder="Type your message..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleKeyPress} // Use onKeyDown instead of onKeyPress
              style={{
                borderRadius: "20px 0 0 20px",
                resize: "none", // Disable resizing
                overflow: "hidden",
                minHeight: "40px", // Minimum height for the textarea
              }}
            />
            <Button
              variant="primary"
              onClick={handleSendMessage}
              style={{ borderRadius: "0 20px 20px 0" }}
            >
              <SendFill />
            </Button>
          </InputGroup>
        </div>
      </div>
    </div>
  );
}
