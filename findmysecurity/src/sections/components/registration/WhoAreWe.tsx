"use client";

import { useState } from "react";
import {
  ShieldCheck,
  User,
  Building,
  BookOpen,
  Briefcase,
  ArrowLeft,
} from "lucide-react";
import { useRouter } from "next/navigation";
import ClientGeneralForm from "./ClientRegistrationForm";
import SecurityCompanyForm from "./SecurityCompanyRegForm";
import BusinessForm from "./CorporateForm";
import axios, { AxiosResponse } from "axios";
import { Dialog } from "@headlessui/react";
import toast from "react-hot-toast";

interface RegistrationResponse {
  message?: string;
  error?: string;
  token?: string;
  [key: string]: any;
}

const options = [
  {
    id: 4,
    title: "Looking for Security Professional",
    icon: ShieldCheck,
    description:
      "Find trained and verified security professionals for your needs.",
  },
  {
    id: 3,
    title: "Security Professionals",
    icon: User,
    description:
      "Register yourself as a security professional and find opportunities.",
  },
  {
    id: 5,
    title: "Security Companies",
    icon: Building,
    description:
      "Register your security company and connect with clients.",
  },
  {
    id: 6,
    title: "Training Providers",
    icon: BookOpen,
    description:
      "Offer security training courses and certifications.",
  },
  {
    id: 7,
    title: "Businesses",
    icon: Briefcase,
    description:
      "Discover top-tier security professionals, companies, and training providers tailored to your specific needs.",
  },
];

export default function RegistrationSelector() {
  const [selected, setSelected] = useState<number | null>(null);
  const [step, setStep] = useState(1);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const router = useRouter();

  const handleFormSubmit = async (formData: any) => {
    try {
      const response: AxiosResponse<RegistrationResponse> = await axios.post(
        "https://ub1b171tga.execute-api.eu-north-1.amazonaws.com/dev/auth/register",
        formData
      );

      console.log("Response Data:", response.data);

      if (
        response.status === 400 &&
        response.data?.message?.includes("Email address is not verified")
      ) {
        toast.error("Email not verified. Redirecting to sign in...");
        router.push("/signin");
        return;
      }

      localStorage.setItem("loginData", JSON.stringify(response.data));
      localStorage.setItem("profileData", JSON.stringify(response.data));

      toast.success("User registered successfully. Please verify your email.");
      router.push('/verify')
    } catch (error: unknown) {
      console.error("Registration error:", error);

      if (axios.isAxiosError(error)) {
        if (!error.response) {
          toast.error("Network error. Please check your internet connection.");
          return;
        }

        const { status, data } = error.response;

        if (status === 500 && data?.error === "Email already exists") {
          toast.error("This email is already registered. Please use a different one.");
          return;
        }

        const errorMessage =
          data?.message || data?.error || "Registration failed. Please try again.";
        toast.error(errorMessage);
      } else {
        toast.error("An unexpected error occurred. Please try again later.");
      }
    }
  };

  const renderForm = () => {
    switch (selected) {
      case 4:
        return (
          <ClientGeneralForm
            id={4}
            title="Looking for Security Professional"
            onSubmit={handleFormSubmit}
          />
        );
      case 3:
        return (
          <ClientGeneralForm
            id={3}
            title="Individuals Seeking Security"
            onSubmit={handleFormSubmit}
          />
        );
      case 5:
        return (
          <SecurityCompanyForm
            id={5}
            title="Security Companies"
            onSubmit={handleFormSubmit}
          />
        );
      case 6:
        return (
          <SecurityCompanyForm
            id={6}
            title="Course Provider"
            onSubmit={handleFormSubmit}
          />
        );
      case 7:
        return (
          <BusinessForm
            id={7}
            title="Corporate Clients"
            onSubmit={handleFormSubmit}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center mt-25 justify-center bg-white text-black p-6 relative">
      {/* Back Button */}
      {step === 1 ? (
        <button
          className="absolute top-10 left-10 flex items-center text-gray-700 hover:text-black text-lg"
          onClick={() => router.push("/signin")}
        >
          <ArrowLeft className="w-6 h-6 mr-2" />
        </button>
      ) : (
        <button
          className="absolute top-10 left-10 flex items-center text-gray-700 hover:text-black text-lg"
          onClick={() => setStep(1)}
        >
          <ArrowLeft className="w-6 h-6 mr-2" /> Back
        </button>
      )}

      {/* Step 1: Role Selection */}
      {step === 1 ? (
        <>
          <h1 className="text-3xl font-bold mb-6">Who are you?</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-4xl">
            {options.map((option) => (
              <div
                key={option.id}
                className={`p-6 cursor-pointer transition-transform duration-200 ease-in-out rounded-2xl shadow-lg bg-gray-900 hover:scale-105 ${
                  selected === option.id ? "border-4 border-red-600" : ""
                }`}
                onClick={() => {
                  setSelected(option.id);
                  setStep(2);
                }}
              >
                <div className="flex flex-col items-center text-center">
                  <option.icon className="w-12 h-12 text-white mb-4" />
                  <h2 className="text-xl text-white font-semibold mb-2">
                    {option.title}
                  </h2>
                  <p className="text-gray-400">{option.description}</p>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        renderForm()
      )}

      {/* Email Verification Modal */}
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
                    const loginData = JSON.parse(localStorage.getItem("loginData") || "{}");
                    const email = loginData?.email;
                    if (!email) {
                      toast.error("Email not found. Please try registering again.");
                      return;
                    }

                    const response: AxiosResponse<any> = await axios.post(
                      "https://ub1b171tga.execute-api.eu-north-1.amazonaws.com/dev/auth/login/verify",
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
  );
}
