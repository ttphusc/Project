import { useState, useEffect } from 'react';
import socket from '../../config/socket';

const Chat = ({ currentUser, receiverId }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // Join chat room khi component mount
    socket.emit('join_chat', currentUser._id);

    // Lắng nghe tin nhắn đến
    socket.on('receive_message', (data) => {
      setMessages(prev => [...prev, data]);
    });

    return () => {
      socket.off('receive_message');
    };
  }, [currentUser._id]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      // Gửi tin nhắn qua socket
      socket.emit('send_message', {
        senderId: currentUser._id,
        receiverId: receiverId,
        message: message
      });

      // Thêm tin nhắn vào state local
      setMessages(prev => [...prev, {
        senderId: currentUser._id,
        message: message,
        timestamp: new Date()
      }]);

      setMessage('');
    }
  };

  return (
    <div className="flex flex-col h-[500px] w-full max-w-md mx-auto border rounded-lg">
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`mb-2 ${
              msg.senderId === currentUser._id
                ? 'text-right'
                : 'text-left'
            }`}
          >
            <div
              className={`inline-block p-2 rounded-lg ${
                msg.senderId === currentUser._id
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200'
              }`}
            >
              {msg.message}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {new Date(msg.timestamp).toLocaleTimeString()}
            </div>
          </div>
        ))}
      </div>
      
      <form onSubmit={sendMessage} className="border-t p-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-1 border rounded-lg px-3 py-2"
            placeholder="Nhập tin nhắn..."
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-lg"
          >
            Gửi
          </button>
        </div>
      </form>
    </div>
  );
};

export default Chat;