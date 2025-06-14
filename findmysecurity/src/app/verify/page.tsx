'use client';
import axios, { AxiosResponse } from 'axios';
import React, { useState, useEffect } from 'react'
import toast from 'react-hot-toast';
import { useRouter } from "next/navigation";
import { Dialog } from "@headlessui/react";
import { API_URL } from '@/utils/path';

const page = () => {
  const [showVerificationModal, setShowVerificationModal] = useState(true);
  const [verificationCode, setVerificationCode] = useState("");
  const [isResendLoading, setIsResendLoading] = useState(false);
  const [cooldownTime, setCooldownTime] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const lastResendTime = localStorage.getItem('lastResendTime');
    if (lastResendTime) {
      const timeLeft = 120000 - (Date.now() - parseInt(lastResendTime));
      if (timeLeft > 0) {
        setCooldownTime(Math.ceil(timeLeft / 1000));
      }
    }
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (cooldownTime > 0) {
      timer = setInterval(() => {
        setCooldownTime(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [cooldownTime]);

  const handleResendOTP = async () => {
    try {
      setIsResendLoading(true);
      const email = localStorage.getItem("email")?.replace(/^"|"/g, "");
      
      if (!email) {
        toast.error("Email not found. Please try registering again.");
        return;
      }

      await axios.post(`${API_URL}/auth/resend-otp`, { email });
      
      localStorage.setItem('lastResendTime', Date.now().toString());
      setCooldownTime(120);
      toast.success("OTP has been resent to your email.");
    } catch (err) {
      toast.error("Failed to resend OTP. Please try again later.");
    } finally {
      setIsResendLoading(false);
    }
  };
  return (
    <div>
      <Dialog
        open={showVerificationModal}
        onClose={() => {}}
        className="fixed z-50 inset-0 overflow-y-auto bg-blue-500 bg-opacity-50 backdrop-blur-sm"
      >
        <div className="flex items-center justify-center min-h-screen px-4">
          <Dialog.Panel className="mx-auto w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <Dialog.Title className="text-lg font-bold text-center mb-4">
              Enter Verification Code
            </Dialog.Title>
            <p className="text-sm text-gray-600 mb-4 italic text-center px-4">
              Note: If you don't see this email in your inbox, please check your Spam, Junk, or Promotions folder.
            </p>
            <input
              type="text"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded mb-4 text-black"
              placeholder="Enter the code sent to your email"
            />
            <div className="flex flex-col gap-3">
              <button
                onClick={async () => {
                  try {
                    const loginData = localStorage.getItem("email")?.replace(/^"|"/g, "");
                    
                    const email = loginData;
                    if (!email) {
                      toast.error("Email not found. Please try registering again.");
                      return;
                    }

                    const response: AxiosResponse<any> = await axios.post(
                      `${API_URL}/auth/login/verify`,
                      {
                        email,
                        code: verificationCode,
                      }
                    );

                    toast.success("Email verified successfully.");
                    localStorage.removeItem("loginData");
                    localStorage.removeItem("profileData");
                    setShowVerificationModal(false);
                    router.push("/signin");
                  } catch (err) {
                    toast.error("Verification failed. Please check the code and try again.");
                    console.error(err);
                  }
                }}
                className="w-full px-4 py-2 text-sm bg-black text-white rounded hover:bg-gray-800"
              >
                Verify
              </button>
              <button
                onClick={handleResendOTP}
                disabled={isResendLoading || cooldownTime > 0}
                className={`w-full px-4 py-2 text-sm rounded ${cooldownTime > 0 || isResendLoading ? 'bg-gray-300 cursor-not-allowed' : 'bg-gray-500 hover:bg-gray-600 text-white'}`}
              >
                {isResendLoading ? 'Sending...' : cooldownTime > 0 ? `Resend OTP (${Math.floor(cooldownTime / 60)}m ${cooldownTime % 60}s)` : 'Resend OTP'}
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  )
}

export default page
