'use client';

import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import "@/app/globals.css";
import axios, { AxiosError } from "axios";  // Import AxiosError
import { ArrowLeft } from "lucide-react";
import TwoFAPopup from "@/sections/components/Login/TwoFAPopup";
import toast from "react-hot-toast";
import { API_URL } from "@/utils/path";

// Define the structure of the expected error response
interface ErrorResponse {
  message: string;
}

const SignIn = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show2FA, setShow2FA] = useState(false);
  const [sessionToken, setSessionToken] = useState(""); // Store token for 2FA verification
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    try {
      const response = await axios.post(
        `${API_URL}/auth/login`,
        { email, password },
        { headers: { "Content-Type": "application/json" } }
      );
  
      const data = response.data;
      if(data?.needed2FA){
       setShow2FA(true);
      toast.success(` Check your email for 2FA code`);
      }else if (data?.needsValidation)
        {
          toast.error(`Please verify your email first`);
          localStorage.setItem('email',email);
          router.push('/verify');
      }
        else{
        localStorage.setItem("loginData", JSON.stringify(data));
        localStorage.setItem("authToken", JSON.stringify(data.token)); 
        toast.success(`Login Success`);
        router.push('/profile');
         // Store in localStorage
      } // ✅ already parsed JSON
  
  
  
       // Show 2FA input
    } catch (error) {
      const axiosError = error as AxiosError;
  
     
  
      const errorMessage =
        (axiosError.response?.data as ErrorResponse)?.message || "Login failed";
      toast.error(errorMessage);
    }
  };
  
  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();

  //   try {
  //     const response = await axios.post(
  //       "https://ub1b171tga.execute-api.eu-north-1.amazonaws.com/dev/auth/login",
  //       { email, password },
  //       { headers: { "Content-Type": "application/json" } }
  //     );
    
  //     const data = response.data;
  //     const responseData = await data.json()
  //     console.log("Login Success:", data);
  //     setSessionToken(data.code);
  //     alert(data.code);
  //     localStorage.setItem("authToken", responseData.token);

  //     // localStorage.setItem("loginData", JSON.stringify(data));
  //     setShow2FA(true);
    
  //   } catch (error) {
  //     // Typecast the error as AxiosError
  //     const axiosError = error as AxiosError;

  //     console.error("Login failed:", axiosError);

  //     // Check if error.response and error.response.data are present and of the expected type
  //     const errorMessage = (axiosError.response?.data as ErrorResponse)?.message || "Login failed";
  //     alert(errorMessage);
  //   }
  // };
  // useEffect(()=>{
  //   localStorage.setItem("authToken", token);
  // },[])
  const handle2FAVerify = async (code: string) => {
    if(code===""){
      setShow2FA(false);
    } else {
      router.push('/profile')
    }
  };

  return (
    <div className="flex h-screen justify-center items-center bg-gray-100 mt-20">
      <button
        className="absolute top-10 left-10 flex items-center text-gray-700 hover:text-black text-lg"
        onClick={() => router.push("/")}
      >
        <ArrowLeft className="w-6 h-6 mr-2 mt-40" />
      </button>
      <div className="w-96 p-6 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Log In</h1>
        </div>

        <form onSubmit={handleSubmit} className="mt-6">
          <div className="mb-4">
            <label className="block font-semibold">Email</label>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-md bg-gray-200 focus:outline-none"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block font-semibold">Password</label>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-md bg-gray-200 focus:outline-none"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition"
          >
            Login
          </button>

          <div className="flex justify-between text-sm mt-3">
            <button
              type="button"
              className="text-blue-600 hover:underline"
              onClick={() => router.push("/signup")}
            >
              Create New Account?
            </button>
            <button
              type="button"
              className="text-blue-600 hover:underline"
              onClick={() => router.push("/reset-password")}
            >
              Forgot Password?
            </button>
          </div>
        </form>
      </div>
      {/* Show 2FA popup after login */}
      {show2FA && <TwoFAPopup email={email} onVerify={handle2FAVerify} />}
    </div>
  );
};

export default SignIn;








// import { useState } from "react";
// import { useRouter } from "next/router";
// import "./page-globals.css";
// import axios from "axios";
// import { ArrowLeft } from "lucide-react";
// import TwoFAPopup from "@/sections/components/Login/TwoFAPopup";

// const SignIn = () => {
//   const router = useRouter();
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [show2FA, setShow2FA] = useState(false);
//   const [sessionToken, setSessionToken] = useState(""); // Store token for 2FA verification
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     try {
//       const response = await axios.post(
//         "https://ub1b171tga.execute-api.eu-north-1.amazonaws.com/dev/auth/login",
//         { email, password },
//         { headers: { "Content-Type": "application/json" } }
//       );
    
//       const data = response.data;
      
//       console.log("Login Success:", data);
//       setSessionToken(data.code);
//       alert(data.code);
//       // localStorage.setItem("loginData", JSON.stringify(data));
//       setShow2FA(true);
    
//     } catch (error) {
//       console.error("Login failed:", error);
//       alert(error.response?.data?.message || "Login failed");
//     }
//   };

//   const handle2FAVerify = async (code: string) => {
//     if(code===""){
//       setShow2FA(false);
     
//     }else if(code === sessionToken){
  
        
//  router.push('/profile')
//     }
//   };

//   return (
// <div className="flex h-screen justify-center items-center bg-gray-100">
//       <button
//         className="absolute top-10 left-10 flex items-center text-gray-700 hover:text-black text-lg"
//         onClick={() => router.push("/")}
//       >
//         <ArrowLeft className="w-6 h-6 mr-2" />
//       </button>
//       <div className="w-96 p-6 bg-white rounded-lg shadow-lg">
//         <div className="text-center">
//           <h1 className="text-3xl font-bold">Log In</h1>
//         </div>

//         <form onSubmit={handleSubmit} className="mt-6">
//           <div className="mb-4">
//             <label className="block font-semibold">Email</label>
//             <input
//               type="email"
//               placeholder="Email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               className="w-full px-4 py-2 border rounded-md bg-gray-200 focus:outline-none"
//               required
//             />
//           </div>

//           <div className="mb-4">
//             <label className="block font-semibold">Password</label>
//             <input
//               type="password"
//               placeholder="Password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               className="w-full px-4 py-2 border rounded-md bg-gray-200 focus:outline-none"
//               required
//             />
//           </div>

//           <button
//             type="submit"
//             className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition"
//           >
//             Login
//           </button>

//           <div className="flex justify-between text-sm mt-3">
//             <button
//               type="button"
//               className="text-blue-600 hover:underline"
//               onClick={() => router.push("/signup")}
//             >
//               Create New Account?
//             </button>
//             <button
//               type="button"
//               className="text-blue-600 hover:underline"
//               onClick={() => router.push("/forgot-password")}
//             >
//               Forgot Password?
//             </button>
//           </div>
//         </form>
//       </div>
//       {/* Show 2FA popup after login */}
//       {show2FA && <TwoFAPopup email={email} onVerify={handle2FAVerify} />}
//     </div>
//   );
// };

// export default SignIn;
