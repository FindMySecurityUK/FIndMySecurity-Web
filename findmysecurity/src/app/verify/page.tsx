'use client';
import axios, { AxiosResponse } from 'axios';
import React, { useState } from 'react'
import toast from 'react-hot-toast';
import { useRouter } from "next/navigation";
import { Dialog } from "@headlessui/react";
import { API_URL } from '@/utils/path';

const page = () => {
    const [showVerificationModal, setShowVerificationModal] = useState(true);
    const [verificationCode, setVerificationCode] =useState("");
    // You may also need to import/use `Dialog` and `router` if not already present
  const router = useRouter();
  return (
    <div>
   <Dialog
        open={showVerificationModal}
        onClose={() => setShowVerificationModal(false)}
        className="fixed z-50 inset-0 overflow-y-auto bg-blue-500 bg-opacity-50 backdrop-blur-sm"
      >
        <div className="flex items-center justify-center min-h-screen px-4">
          <Dialog.Panel className="mx-auto w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <Dialog.Title className="text-lg font-bold text-center mb-4">
              Enter Verification Code
            </Dialog.Title>
            <input
              type="text"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded mb-4 text-black"
              placeholder="Enter the code sent to your email"
            />
            <div className="flex justify-between">
              {/* <button
                onClick={() => {
                  localStorage.removeItem("loginData");
                  localStorage.removeItem("profileData");
                  setShowVerificationModal(false);
                  router.push("/signin");
                }}
                className="px-4 py-2 text-sm bg-gray-300 rounded hover:bg-gray-400"
              >
                Skip
              </button> */}
              <button
                onClick={async () => {
                  try {
                    const loginData = JSON.parse(localStorage.getItem("email") || localStorage.getItem("loginData")||"{}");
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
                className="px-4 py-2 text-sm bg-black text-white rounded hover:bg-gray-800"
              >
                Verify
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  )
}

export default page
