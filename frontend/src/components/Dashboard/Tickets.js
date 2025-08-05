// Archivo: pages/Support.js
import React, { useEffect, useState } from 'react';
import api from '../../services/Api';
import { Link, useParams } from 'react-router-dom';

const Support = () => {
  const { id } = useParams();
  const [conversations, setConversations] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [conversation, setConversation] = useState(null);
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState('');

  const fetchConversations = async () => {
    try {
      const res = await api.get('/support/my-conversations', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setConversations(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Error loading conversations');
    }
  };

  const fetchConversationWithComments = async () => {
    if (!id) return;
    try {
      const res = await api.get(`/support/conversation/${id}/comments`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setConversation(res.data.conversation);
      setComments(res.data.comments);
    } catch (err) {
      setError(err.response?.data?.error || 'Error loading conversation');
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      await api.post(
        '/support/conversation',
        { title, content },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );
      setTitle('');
      setContent('');
      await fetchConversations();
    } catch (err) {
      setError(err.response?.data?.error || 'Error creating conversation');
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      await api.post(
        `/support/conversation/${id}/comment`,
        { comment },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );
      setComment('');
      await fetchConversationWithComments();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to post comment');
    }
  };

  useEffect(() => {
    fetchConversations();
    fetchConversationWithComments();
  }, [id]);

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-dark text-white">
      <div className="bg-secondary p-5 rounded shadow text-center" style={{ maxWidth: '600px', width: '100%' }}>
        <h3 className="mb-4">Support Chat</h3>

        {message && <div className="alert alert-success">{message}</div>}
        {error && <div className="alert alert-danger">{error}</div>}

        {!id && (
          <>
            <form onSubmit={handleCreate}>
              <div className="mb-3 text-start">
                <label className="form-label">Title</label>
                <input
                  type="text"
                  className="form-control"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4 text-start">
                <label className="form-label">Message</label>
                <textarea
                  className="form-control"
                  rows={3}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="btn btn-light w-100 mb-4">
                Send
              </button>
            </form>

            <h5 className="text-start mt-3 mb-2">My Conversations</h5>
            <ul className="list-group text-start mb-3">
              {conversations.map((c) => (
                <li key={c.id} className="list-group-item bg-light mb-2">
                  <strong>{c.title}</strong>
                  <p className="mb-1">{c.content}</p>
                  <Link to={`/tickets/${c.id}`} className="btn btn-sm btn-outline-dark">
                    View
                  </Link>
                </li>
              ))}
            </ul>
          </>
        )}

        {id && conversation && (
          <>
            <h5 className="text-white text-start">{conversation.title}</h5>
            <p className="text-start">{conversation.content}</p>
            <hr />
            <h6 className="text-start">Comments</h6>
            <ul className="list-group mb-3 text-start">
              {comments.map((c) => (
                <li key={c.id} className="list-group-item bg-light text-dark">
                  {c.comment}
                </li>
              ))}
            </ul>

            <form onSubmit={handleComment}>
              <div className="mb-3">
                <textarea
                  className="form-control"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Add a comment"
                  required
                />
              </div>
              <button type="submit" className="btn btn-light w-100">Comment</button>
            </form>

            <Link to="/tickets" className="btn btn-light mt-3 w-100">
              <i className="bi bi-arrow-left-circle me-2"></i>Back Conversations
            </Link>
          </>
        )}

        <Link to="/main" className="btn btn-light mt-3 w-100">
          <i className="bi bi-arrow-left-circle me-2"></i>Back to Main Page
        </Link>
      </div>
    </div>
  );
};

export default Support;
