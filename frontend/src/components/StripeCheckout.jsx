import React, { useState } from 'react';
import axios from 'axios';

const StripeCheckout = ({ userId, email, priceId }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCheckout = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await axios.post(
        `${API_URL}/api/payment/create-checkout-session`,
        { userId, email, priceId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Redirect to Stripe Checkout page
      if (response.data && response.data.url) {
        window.location.href = response.data.url;
      } else {
        setError('Failed to initiate checkout. Please try again.');
      }
    } catch (err) {
      console.error('Stripe Checkout Error:', err);
      setError(err.response?.data?.message || 'Checkout failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {error && (
        <p style={{ color: '#ff4757', fontSize: '12px', marginBottom: '8px' }}>
          {error}
        </p>
      )}
      <button
        onClick={handleCheckout}
        disabled={loading}
        style={{
          width: '100%',
          padding: '10px 16px',
          background: loading ? '#aaa' : '#635bff',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: loading ? 'not-allowed' : 'pointer',
          fontWeight: '600',
          fontSize: '14px',
          transition: 'background 0.2s',
        }}
      >
        {loading ? 'Redirecting...' : '⚡ Upgrade to Pro'}
      </button>
    </div>
  );
};

export default StripeCheckout;
