import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';

// Replace with your Stripe Publishable Key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_placeholder');

/**
 * StripeCheckout Component
 * @param {string} userId - Current user ID
 * @param {string} email - Current user email
 * @param {string} priceId - Stripe price ID for the Pro plan
 */
const StripeCheckout = ({ userId, email, priceId }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCheckout = async () => {
    if (!userId || !email || !priceId) {
      setError('Missing required checkout information');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 1. Create checkout session on backend
      const response = await axios.post('/api/payments/create-checkout-session', {
        userId,
        email,
        priceId
      });

      const { url } = response.data;

      if (url) {
        // 2. Redirect to Stripe Checkout page
        window.location.href = url;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (err) {
      console.error('Stripe Checkout Error:', err);
      setError(err.response?.data?.error || 'Failed to initiate checkout. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="stripe-checkout-container">
      <button 
        onClick={handleCheckout} 
        disabled={loading}
        className={`checkout-btn ${loading ? 'loading' : ''}`}
      >
        {loading ? 'Processing...' : 'Upgrade to Pro'}
      </button>
      
      {error && <p className="error-message">{error}</p>}

      <style jsx>{`
        .stripe-checkout-container {
          margin-top: 20px;
        }

        .checkout-btn {
          padding: 12px 24px;
          background-color: #6772e5; /* Stripe's brand color */
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 16px;
          font-weight: 600;
          transition: background-color 0.15s ease;
          box-shadow: 0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08);
        }

        .checkout-btn:hover:not(:disabled) {
          background-color: #7795f8;
          transform: translateY(-1px);
        }

        .checkout-btn:disabled {
          background-color: #aab7c4;
          cursor: not-allowed;
        }

        .error-message {
          color: #e25950;
          font-size: 14px;
          margin-top: 10px;
        }
      `}</style>
    </div>
  );
};

export default StripeCheckout;
