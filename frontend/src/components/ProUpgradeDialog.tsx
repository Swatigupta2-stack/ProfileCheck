import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Loader2, CheckCircle, XCircle, Smartphone, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:9000';

interface ProUpgradeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reason?: string; 
}

export function ProUpgradeDialog({ open, onOpenChange, reason }: ProUpgradeDialogProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentError, setPaymentError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (paymentSuccess) {
      const timer = setTimeout(() => {
        window.location.reload();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [paymentSuccess]);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleRazorpayPayment = async () => {
    if (!user) {
      toast.error('Please sign in to upgrade to Pro!');
      return;
    }
    setLoading(true);
    setPaymentError(false);
    setErrorMessage('');

    try {
      const res = await loadRazorpayScript();
      if (!res) {
        throw new Error('Failed to load Razorpay SDK');
      }

      const userId = (user as any).id || (user as any).userId;
      const orderResponse = await fetch(`${BACKEND_URL}/api/payments/create-razorpay-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: userId,
          email: user.email,
        }),
      });

      const orderData = await orderResponse.json();
      if (!orderData.success) {
        throw new Error(orderData.error || 'Failed to create order');
      }

      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Zaalima Pro',
        description: reason || '30 days of unlimited resumes and all templates',
        order_id: orderData.orderId,
        handler: async function (response: any) {
          try {
            const verifyResponse = await fetch(`${BACKEND_URL}/api/payments/verify-razorpay`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                orderId: response.razorpay_order_id,
                paymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature,
              }),
            });

            const verifyData = await verifyResponse.json();
            if (verifyData.success) {
              setPaymentSuccess(true);
              toast.success('Subscription upgraded successfully!');
            } else {
              throw new Error(verifyData.error || 'Payment verification failed');
            }
          } catch (error: any) {
            setPaymentError(true);
            setErrorMessage(error.message);
          }
        },
        prefill: {
          name: user.email?.split('@')[0] || 'User',
          email: user.email || '',
        },
        theme: {
          color: '#3b82f6',
        },
      };

      const paymentObject = (window as any).Razorpay ? new (window as any).Razorpay(options) : null;
      if (paymentObject) {
        paymentObject.on('payment.failed', function (response: any) {
          setPaymentError(true);
          setErrorMessage(response.error.description || 'Payment failed');
        });
        paymentObject.open();
      } else {
        throw new Error('Razorpay object not loaded');
      }
    } catch (error: any) {
      setPaymentError(true);
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card border-border/80">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-amber-500" />
            Upgrade to Zaalima Pro
          </DialogTitle>
          <DialogDescription>
            {reason || 'Get unlimited resumes and access to all premium templates for 30 days!'}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {paymentSuccess ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <CheckCircle className="h-16 w-16 text-green-500 mb-4 animate-bounce" />
              <h3 className="text-xl font-semibold text-green-700 dark:text-green-400">Payment Successful!</h3>
              <p className="text-gray-600 dark:text-gray-400 mt-2">Refreshing page to activate Pro features...</p>
            </div>
          ) : paymentError ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <XCircle className="h-16 w-16 text-red-500 mb-4" />
              <h3 className="text-xl font-semibold text-red-700 dark:text-red-400">Payment Failed</h3>
              <p className="text-gray-600 dark:text-gray-400 mt-2">{errorMessage}</p>
              <Button
                onClick={() => {
                  setPaymentError(false);
                  setErrorMessage('');
                }}
                className="mt-4 bg-primary text-primary-foreground"
              >
                Try Again
              </Button>
            </div>
          ) : (
            <>
              <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 p-6 rounded-xl border border-blue-500/20 text-center">
                <span className="text-4xl font-extrabold text-foreground">₹100</span>
                <span className="text-muted-foreground ml-2 text-lg">/ month</span>
                <p className="text-xs text-muted-foreground mt-2">Includes domestic cards, Netbanking, UPI, PhonePe, Paytm, and Google Pay</p>
              </div>

              <Button
                onClick={handleRazorpayPayment}
                disabled={loading}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-6 text-base"
              >
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin mr-2" />
                ) : (
                  <Smartphone className="h-5 w-5 mr-2 animate-pulse" />
                )}
                Pay with UPI/Cards/Netbanking
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
