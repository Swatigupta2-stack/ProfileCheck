import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { selectCurrentUser, logout } from '../store/authSlice';
import PDFDownloadButton from '../components/PDFDownloadButton';
import StripeCheckout from '../components/StripeCheckout';

const Dashboard = () => {
  const user = useSelector(selectCurrentUser);
  const dispatch = useDispatch();
  const [resumes, setResumes] = useState([]);
  const [coverLetters, setCoverLetters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = {
          headers: { Authorization: `Bearer ${token}` }
        };

        const [resumesRes, coverLettersRes] = await Promise.all([
          axios.get(`http://localhost:5000/api/users/${user.userId}/resumes`, config),
          axios.get(`http://localhost:5000/api/users/${user.userId}/cover-letters`, config)
        ]);

        setResumes(resumesRes.data.data);
        setCoverLetters(coverLettersRes.data.data);
      } catch (err) {
        console.error('Fetch Dashboard Data Error:', err);
        setError('Failed to load dashboard data.');
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchData();
  }, [user]);

  const handleDeleteResume = async (id) => {
    if (!window.confirm('Are you sure you want to delete this resume?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/resume/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setResumes(resumes.filter(r => r._id !== id));
    } catch (err) {
      alert('Failed to delete resume');
    }
  };

  const handleDeleteCoverLetter = async (id) => {
    if (!window.confirm('Are you sure you want to delete this cover letter?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/cover-letter/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCoverLetters(coverLetters.filter(c => c._id !== id));
    } catch (err) {
      alert('Failed to delete cover letter');
    }
  };

  if (loading) return <div className="dashboard-loading">Loading Dashboard...</div>;

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <div className="profile-section">
          <div className="avatar">{user.email[0].toUpperCase()}</div>
          <h3>{user.userId}</h3>
          <p>{user.email}</p>
          <span className={`badge ${user.subscriptionTier}`}>
            {user.subscriptionTier.toUpperCase()}
          </span>
        </div>
        
        {user.subscriptionTier === 'free' && (
          <div className="upgrade-card">
            <h4>Go Pro!</h4>
            <p>Unlock premium templates and AI features.</p>
            <StripeCheckout 
              userId={user.userId} 
              email={user.email} 
              priceId="price_H5ggY9H3a9aA9" // Example Price ID
            />
          </div>
        )}

        <button className="logout-btn" onClick={() => dispatch(logout())}>
          Logout
        </button>
      </aside>

      <main className="content">
        <header className="content-header">
          <h1>Dashboard</h1>
          <div className="stats">
            <div className="stat-item">
              <strong>{resumes.length}</strong> Resumes
            </div>
            <div className="stat-item">
              <strong>{coverLetters.length}</strong> Cover Letters
            </div>
          </div>
        </header>

        {error && <div className="error-alert">{error}</div>}

        <section className="dashboard-section">
          <h2>My Resumes</h2>
          {resumes.length === 0 ? (
            <p className="empty-state">No resumes found. Start building one!</p>
          ) : (
            <div className="grid">
              {resumes.map(resume => (
                <div key={resume._id} className="card">
                  <div className="card-body">
                    <h3>{resume.personal?.title || 'Untitled Resume'}</h3>
                    <p>Last updated: {new Date(resume.updatedAt).toLocaleDateString()}</p>
                  </div>
                  <div className="card-actions">
                    <PDFDownloadButton resumeData={resume} />
                    <button 
                      className="delete-btn" 
                      onClick={() => handleDeleteResume(resume._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="dashboard-section">
          <h2>My Cover Letters</h2>
          {coverLetters.length === 0 ? (
            <p className="empty-state">No cover letters found.</p>
          ) : (
            <div className="grid">
              {coverLetters.map(letter => (
                <div key={letter._id} className="card">
                  <div className="card-body">
                    <h3>{letter.companyName}</h3>
                    <p>{letter.jobDescription?.substring(0, 50)}...</p>
                  </div>
                  <div className="card-actions">
                    <button className="view-btn">View</button>
                    <button 
                      className="delete-btn" 
                      onClick={() => handleDeleteCoverLetter(letter._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      <style jsx>{`
        .dashboard-container {
          display: flex;
          min-height: 100vh;
          background-color: #f0f2f5;
        }

        .sidebar {
          width: 280px;
          background: white;
          padding: 30px;
          box-shadow: 2px 0 5px rgba(0,0,0,0.05);
          display: flex;
          flex-direction: column;
        }

        .profile-section {
          text-align: center;
          margin-bottom: 30px;
        }

        .avatar {
          width: 80px;
          height: 80px;
          background: #3498db;
          color: white;
          font-size: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          margin: 0 auto 15px;
        }

        .badge {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 700;
          margin-top: 8px;
        }

        .badge.free { background: #e9ecef; color: #495057; }
        .badge.pro { background: #ffd700; color: #856404; }

        .upgrade-card {
          background: #f8f9fa;
          padding: 15px;
          border-radius: 8px;
          margin-bottom: 20px;
          border: 1px solid #dee2e6;
        }

        .logout-btn {
          margin-top: auto;
          padding: 10px;
          background: #ff4757;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }

        .content {
          flex: 1;
          padding: 40px;
        }

        .content-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 40px;
        }

        .stats { display: flex; gap: 20px; }
        .stat-item { background: white; padding: 10px 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); }

        .dashboard-section { margin-bottom: 40px; }
        .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px; }

        .card { background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05); transition: transform 0.2s; }
        .card:hover { transform: translateY(-5px); }
        .card-body { padding: 20px; }
        .card-actions { padding: 15px 20px; background: #fafafa; border-top: 1px solid #eee; display: flex; justify-content: space-between; align-items: center; }

        .delete-btn { color: #ff4757; background: none; border: none; cursor: pointer; font-size: 14px; }
        .view-btn { color: #3498db; background: none; border: none; cursor: pointer; font-size: 14px; }

        .empty-state { color: #6c757d; font-style: italic; }
      `}</style>
    </div>
  );
};

export default Dashboard;
