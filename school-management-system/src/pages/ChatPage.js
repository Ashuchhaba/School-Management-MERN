import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../api';
import io from 'socket.io-client';
import StudentLayout from '../components/StudentLayout';
import StaffLayout from '../components/StaffLayout';
import './ChatPage.css';

const SOCKET_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

function ChatPage() {
  const { user } = useAuth();
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [otherUserTyping, setOtherUserTyping] = useState(false);
  const [activeChat, setActiveChat] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editingMessage, setEditingMessage] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  
  const socket = useRef();
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const Layout = user?.role === 'staff' ? StaffLayout : StudentLayout;

  const fetchContacts = async () => {
    setLoading(true);
    try {
      if (user.role === 'student') {
        const res = await api.get('/api/chat/staff-list');
        // We'll also fetch existing chats for students to get unread counts from staff
        const chatsRes = await api.get('/api/chat');
        
        const initialized = res.data.map(staff => {
            const chat = chatsRes.data.find(c => c.participants.some(p => p._id.toString() === staff._id.toString()));
            return {
                ...staff,
                chatId: chat?._id,
                lastMessage: chat?.lastMessage,
                unreadCount: chat?.unreadCount || 0
            };
        });
        setContacts(initialized);
      } else {
        const res = await api.get('/api/chat');
        const formattedContacts = res.data.map(chat => {
            const otherUser = chat.participants.find(p => p._id.toString() !== user._id.toString());
            return {
                ...otherUser,
                chatId: chat._id,
                lastMessage: chat.lastMessage,
                unreadCount: chat.unreadCount || 0,
                hasNewMessage: (chat.unreadCount || 0) > 0
            };
        });
        setContacts(formattedContacts);
      }
    } catch (err) {
      console.error('Error fetching contacts:', err);
    } finally {
      setLoading(false);
    }
  };

  // 1. Socket Initialization
  useEffect(() => {
    if (!user?._id) return;
    socket.current = io(SOCKET_URL, { withCredentials: true });

    socket.current.on('connect', () => {
      socket.current.emit('join', user._id);
    });

    return () => {
      if (socket.current) socket.current.disconnect();
    };
  }, [user?._id]);

  // 2. Global Listeners
  useEffect(() => {
    if (!socket.current) return;

    const onReceiveMessage = (message) => {
      const isChatActive = activeChat?._id && message.chatId.toString() === activeChat._id.toString();

      if (isChatActive) {
          setMessages((prev) => {
              if (prev.find(m => m._id === message._id)) return prev;
              return [...prev, message];
          });
          // If active, mark as read on backend too (silently)
          api.put(`/api/chat/read/${message.chatId}`).catch(console.error);
      }

      setContacts((prevContacts) => {
          const contactIndex = prevContacts.findIndex(c => 
            (c.chatId && c.chatId.toString() === message.chatId.toString()) || 
            (c._id && c._id.toString() === message.senderId.toString() && user.role === 'staff')
          );
          
          if (contactIndex !== -1) {
              const updatedContacts = [...prevContacts];
              const contact = updatedContacts[contactIndex];
              
              updatedContacts[contactIndex] = {
                  ...contact,
                  chatId: message.chatId,
                  lastMessage: message,
                  unreadCount: isChatActive ? 0 : (contact.unreadCount || 0) + 1,
                  hasNewMessage: !isChatActive
              };
              const [movedItem] = updatedContacts.splice(contactIndex, 1);
              return [movedItem, ...updatedContacts];
          } else {
              if (user.role === 'staff') fetchContacts(); 
              return prevContacts;
          }
      });
    };

    const onDisplayTyping = (data) => {
      if (selectedContact?._id === data.senderId) {
        setOtherUserTyping(data.isTyping);
      }
    };

    const onMessageEdited = (data) => {
        if (data.chatId === activeChat?._id) {
            setMessages(prev => prev.map(m => 
                m._id === data.messageId ? { ...m, text: data.newText, isEdited: true } : m
            ));
        }
    };

    const onMessageDeleted = (data) => {
        if (data.chatId === activeChat?._id) {
            setMessages(prev => prev.map(m => 
                m._id === data.messageId ? { ...m, text: 'This message was deleted', isDeleted: true } : m
            ));
        }
    };

    socket.current.on('receiveMessage', onReceiveMessage);
    socket.current.on('displayTyping', onDisplayTyping);
    socket.current.on('messageEdited', onMessageEdited);
    socket.current.on('messageDeleted', onMessageDeleted);

    return () => {
      socket.current.off('receiveMessage', onReceiveMessage);
      socket.current.off('displayTyping', onDisplayTyping);
      socket.current.off('messageEdited', onMessageEdited);
      socket.current.off('messageDeleted', onMessageDeleted);
    };
  }, [user, activeChat?._id, selectedContact?._id]);

  // Initial Fetch
  useEffect(() => {
    if (user) fetchContacts();
  }, [user]);

  // Fetch Messages when chat selected
  useEffect(() => {
    if (activeChat) {
      const fetchMessages = async () => {
        try {
          const res = await api.get(`/api/chat/messages/${activeChat._id}`);
          setMessages(res.data);
          // Mark as read in DB
          await api.put(`/api/chat/read/${activeChat._id}`);
        } catch (err) {
          console.error('Error fetching messages:', err);
        }
      };
      fetchMessages();
    }
  }, [activeChat]);

  // Auto Scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSelectContact = async (contact) => {
    setSelectedContact(contact);
    setOtherUserTyping(false);
    
    // Hide sidebar on mobile when contact selected
    const sidebar = document.querySelector('.chat-sidebar');
    if (sidebar) sidebar.classList.add('hidden');
    
    setContacts(prev => prev.map(c => 
        c._id === contact._id ? { ...c, hasNewMessage: false, unreadCount: 0 } : c
    ));

    try {
      const res = await api.post('/api/chat/get-or-create', { userId: contact._id });
      setActiveChat(res.data);
    } catch (err) {
      console.error('Error getting chat:', err);
    }
  };

  const handleBackToContacts = () => {
    const sidebar = document.querySelector('.chat-sidebar');
    if (sidebar) sidebar.classList.remove('hidden');
    setSelectedContact(null);
    setActiveChat(null);
  };

  const handleEditClick = (msg) => {
    setIsEditMode(true);
    setEditingMessage(msg);
    setInputText(msg.text);
  };

  const handleDeleteMessage = async (msgId) => {
    if (!window.confirm('Delete this message for everyone?')) return;
    try {
        await api.delete(`/api/chat/message/${msgId}`);
        // Emit to socket
        socket.current.emit('deleteMessage', {
            chatId: activeChat._id,
            messageId: msgId,
            senderId: user._id,
            receiverId: selectedContact._id
        });
    } catch (err) {
        console.error('Error deleting message:', err);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputText.trim() || !activeChat) return;

    if (isEditMode && editingMessage) {
        try {
            await api.put(`/api/chat/message/${editingMessage._id}`, { text: inputText });
            // Emit to socket
            socket.current.emit('editMessage', {
                chatId: activeChat._id,
                messageId: editingMessage._id,
                senderId: user._id,
                receiverId: selectedContact._id,
                newText: inputText
            });
            setIsEditMode(false);
            setEditingMessage(null);
            setInputText('');
        } catch (err) {
            console.error('Error editing message:', err);
        }
        return;
    }

    const messageData = {
      chatId: activeChat._id,
      senderId: user._id,
      receiverId: selectedContact._id,
      text: inputText
    };

    socket.current.emit('sendMessage', messageData);
    setInputText('');
    
    // Stop typing indicator
    socket.current.emit('typing', {
        senderId: user._id,
        receiverId: selectedContact._id,
        isTyping: false
    });
  };

  const handleTyping = (e) => {
    setInputText(e.target.value);

    if (!isTyping) {
      setIsTyping(true);
      socket.current.emit('typing', {
        senderId: user._id,
        receiverId: selectedContact?._id,
        isTyping: true
      });
    }

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      socket.current.emit('typing', {
        senderId: user._id,
        receiverId: selectedContact?._id,
        isTyping: false
      });
    }, 3000);
  };

  const filteredContacts = contacts.filter(c => 
    c.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.subjects?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Layout>
      <div className="chat-page-wrapper">
        <div className="chat-container">
          {/* Contacts Sidebar */}
          <div className="chat-sidebar">
            <div className="chat-sidebar-header">
              <input 
                type="text" 
                className="chat-search" 
                placeholder="Search staff or subject..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="user-list">
              {loading ? (
                <div className="text-center p-4">Loading...</div>
              ) : filteredContacts.length > 0 ? (
                filteredContacts.map(contact => (
                  <div 
                    key={contact._id} 
                    className={`user-item ${selectedContact?._id === contact._id ? 'active' : ''}`}
                    onClick={() => handleSelectContact(contact)}
                  >
                    <div className="user-avatar-small">
                      {contact.name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="user-info-small">
                      <div className="d-flex justify-content-between align-items-center">
                        <div className="user-name-small">{contact.name}</div>
                        {contact.unreadCount > 0 && <span className="unread-badge">{contact.unreadCount}</span>}
                      </div>
                      <div className="user-meta-small">
                        {contact.lastMessage ? (
                            <span className="text-truncate d-inline-block" style={{maxWidth: '150px'}}>
                                {contact.lastMessage.senderId === user._id ? 'You: ' : ''}{contact.lastMessage.text}
                            </span>
                        ) : (
                            contact.designation || contact.role
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center p-4 text-muted">No contacts found</div>
              )}
            </div>
          </div>

          {/* Chat Window */}
          <div className="chat-main">
            {selectedContact ? (
              <>
                <div className="chat-header">
                  <button className="back-btn-chat" onClick={handleBackToContacts}>
                    <i className="fas fa-arrow-left"></i>
                  </button>
                  <div className="user-avatar-small" style={{ width: '35px', height: '35px', fontSize: '1rem' }}>
                    {selectedContact.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="fw-bold">{selectedContact.name}</div>
                    <small className="text-muted">
                        {otherUserTyping ? 'typing...' : (selectedContact.designation || 'Staff')}
                    </small>
                  </div>
                </div>

                <div className="messages-area">
                  {messages.map((msg) => (
                    <div 
                      key={msg._id} 
                      className={`message-bubble ${msg.senderId === user._id ? 'message-sent' : 'message-received'}`}
                    >
                      <div className="msg-bubble-content">
                        <div className="d-flex justify-content-between align-items-start">
                          <div className={`message-text ${msg.isDeleted ? 'text-muted fst-italic' : ''}`}>{msg.text}</div>
                          {msg.senderId === user._id && !msg.isDeleted && (
                              <div className="message-actions ms-2 opacity-0 hover-opacity-100 transition-opacity">
                                  <i className="fas fa-pen fa-xs text-muted me-2 cursor-pointer" onClick={() => handleEditClick(msg)}></i>
                                  <i className="fas fa-trash fa-xs text-danger cursor-pointer" onClick={() => handleDeleteMessage(msg._id)}></i>
                              </div>
                          )}
                        </div>
                        <div className="message-time">
                          {msg.isEdited && <span className="me-1 fst-italic">(edited)</span>}
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                <form className="chat-input-area" onSubmit={handleSendMessage}>
                  {isEditMode && (
                      <div className="edit-indicator position-absolute bg-white border p-1 rounded" style={{marginTop: '-60px'}}>
                          <small className="text-primary me-2">Editing message...</small>
                          <i className="fas fa-times cursor-pointer text-danger" onClick={() => { setIsEditMode(false); setInputText(''); setEditingMessage(null); }}></i>
                      </div>
                  )}
                  <input 
                    type="text" 
                    className="chat-input" 
                    placeholder="Type a message..." 
                    value={inputText}
                    onChange={handleTyping}
                  />
                  <button type="submit" className="send-btn" disabled={!inputText.trim()}>
                    <i className="fas fa-paper-plane"></i>
                  </button>
                </form>
              </>
            ) : (
              <div className="no-chat-selected">
                <i className="fas fa-comments"></i>
                <h4>Doubt Solving Portal</h4>
                <p>Select a {user?.role === 'staff' ? 'student' : 'staff member'} to start chatting</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default ChatPage;
