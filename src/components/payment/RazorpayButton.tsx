"use client";

import React, { useState } from "react";

interface RazorpayButtonProps {
  amount: number;
  planType: string;
  onSuccess: (secretUrl: string) => void;
}

export default function RazorpayButton({ amount, planType, onSuccess }: RazorpayButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handlePayment = async () => {
    setIsLoading(true);
    try {
      // 1. Create order
      const res = await fetch("/api/payment/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, planType, customerName: "Guest", customerEmail: "guest@example.com" }),
      });
      const data = await res.json();

      if (data.error) throw new Error(data.error);

      // 2. Initialize Razorpay options
      const options = {
        key: data.key,
        amount: data.amount,
        currency: data.currency,
        name: "ProposeIt 💝",
        description: `Upgrading to ${planType} plan`,
        order_id: data.orderId,
        handler: async function (response: any) {
          try {
            // 3. Verify payment
            const verifyRes = await fetch("/api/payment/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ ...response, planType }),
            });
            
            const verifyData = await verifyRes.json();
            
            if (verifyData.success) {
              onSuccess(verifyData.secretUrl);
            } else {
              alert("Payment verification failed");
            }
          } catch (err) {
            console.error("Verification error", err);
            alert("Error verifying payment");
          }
        },
        prefill: {
          name: "Guest User",
          email: "guest@example.com",
          contact: "9999999999"
        },
        theme: {
          color: "#ec4899"
        }
      };

      const _window = window as any;
      if (!_window.Razorpay) {
         // Fallback if script not loaded 
         const script = document.createElement("script");
         script.src = "https://checkout.razorpay.com/v1/checkout.js";
         script.async = true;
         document.body.appendChild(script);
         script.onload = () => {
           const rzp = new _window.Razorpay(options);
           rzp.open();
         };
      } else {
         const rzp = new _window.Razorpay(options);
         rzp.open();
      }
      
    } catch (error) {
      console.error("Checkout error", error);
      alert("Failed to initiate payment");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handlePayment}
      disabled={isLoading}
      className="w-full bg-pink-500 text-white font-bold py-3 px-6 rounded-xl hover:bg-pink-600 transition-colors shadow-lg active:scale-95 disabled:opacity-70 flex justify-center items-center"
    >
      {isLoading ? (
        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : `Pay ₹${amount} with Razorpay`}
    </button>
  );
}
