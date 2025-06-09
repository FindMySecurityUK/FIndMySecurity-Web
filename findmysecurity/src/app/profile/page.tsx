"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import "../globals.css";
import ActionButtons from "./ActionButtons";
import ProfileMenu from "./ProfileMenu";
import WeeklySchedule from "./WeeklySchedule";
import axios from "axios";
import { API_URL } from "@/utils/path";
import toast from "react-hot-toast";
import ProfileOverview from "./otherProfiles";

const UserProfile: React.FC = () => {
  const [loginData, setLoginData] = useState<any>(null);
  const router = useRouter();
  const [roleId, setRoleId] = useState(0);

  const refreshUserData = async () => {
    const token = localStorage.getItem("authToken")?.replace(/^"|"$/g, '');
    const storedData = localStorage.getItem("loginData") || localStorage.getItem("profileData");
    const parsedData = storedData ? JSON.parse(storedData) : null;
    const currentId = parsedData?.id || parsedData?.user?.id;

    try {
      const response = await axios.get(`${API_URL}/auth/get-user/${currentId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = response.data;
      setRoleId(data?.role?.id || data?.roleId || 0);
      localStorage.setItem("loginData", JSON.stringify(data));
      setLoginData(data);
    } catch (error) {
      console.error("Error fetching user data:", error);
      router.push("/");
    }
  };

  useEffect(() => {
    refreshUserData();
  }, []);

  useEffect(() => {
    if (
      (roleId === 3) &&
      !(loginData?.user?.individualProfessional || loginData?.individualProfessional?.profile?.weeklySchedule) &&
      typeof window !== "undefined" && window.location.pathname === "/profile"
    ) {
      const interval = setInterval(() => {
        toast.error("You have not created your public profile yet. Please do so to enhance your visibility.");
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [roleId, loginData]);

  const updateProfile = async (updatedData: any) => {
    const token = localStorage.getItem("authToken")?.replace(/^"|"$/g, '');
    if (!token) {
      toast.error("Authentication token not found.");
      return;
    }

    try {
      const storedData = localStorage.getItem("loginData") || localStorage.getItem("profileData");
      const data = storedData ? JSON.parse(storedData) : null;
      if (!data) {
        throw new Error("No user data found.");
      }

      const currentRoleId = data?.id || data?.UserId;
      if (!currentRoleId) {
        throw new Error("User ID not found.");
      }

      const mergedData = {
        ...data,
        ...updatedData,
      };

      const response = await fetch(`${API_URL}/users/${currentRoleId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(mergedData),
      });

      if (response.ok) {
        const responseData = await response.json();
        toast.success("Profile updated successfully!");
        localStorage.setItem("loginData", JSON.stringify(responseData));
        await refreshUserData();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update profile.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(error instanceof Error ? error.message : "Error updating profile. Please try again.");
    }
  };

  if (!loginData) return null;

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <button
        className="absolute top-4 left-4 mt-20 z-10 flex items-center text-gray-600 hover:text-black"
        onClick={() => router.push("/")}
      >
        <ArrowLeft className="w-6 h-6 mr-2" />
      </button>

      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-6 relative mt-12 md:mt-16">
        <ActionButtons
          loginData={loginData}
          roleId={roleId}
          updateProfile={updateProfile}
          refreshUserData={refreshUserData}
        />
        <ProfileMenu roleId={roleId} />
        {loginData?.individualProfessional?.profile?.weeklySchedule && (
          <WeeklySchedule roleId={roleId} loginData={loginData} />
        )}
        {(roleId === 5 || roleId === 6 || roleId === 7) && (
          <ProfileOverview
            profileData={
              loginData?.corporateClient ||
              loginData?.securityCompany ||
              loginData?.courseProvider
            }
            roleId={loginData?.roleId}
            userId={loginData?.id}
          />
        )}
      </div>
    </div>
  );
};

export default UserProfile;






// "use client";

// import React, { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import { ArrowLeft } from "lucide-react";
// import "../globals.css";
// import ActionButtons from "./ActionButtons";
// import ProfileMenu from "./ProfileMenu";
// import WeeklySchedule from "./WeeklySchedule";
// import axios from "axios";
// import { API_URL } from "@/utils/path";
// import toast from "react-hot-toast";
// import ProfileOverview from "./otherProfiles";
// const UserProfile: React.FC = () => {
//   const [loginData, setLoginData] = useState<any>(null);
//   const router = useRouter();
//   const [roleId, setRoleId] = useState(0);
//   // ✅ Separated refresh function to be passed to children
//   const refreshUserData = async () => {

//     const token = localStorage.getItem("authToken")?.replace(/^"|"$/g, '');
//     const storedData = localStorage.getItem("loginData") || localStorage.getItem("profileData");
//     const parsedData = storedData ? JSON.parse(storedData) : null;
//     const currentId = parsedData?.id || parsedData?.user?.id;

//     try {
//       const response = await axios.get(`${API_URL}/auth/get-user/${currentId}`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       const data = response.data;
//       setRoleId(data?.role?.id || data?.roleId);
//       localStorage.setItem("loginData", JSON.stringify(data));
//       setLoginData(data);
//       if (
//         (data?.role?.id === 3|| data?.roleId===3) &&
//         !(data?.user?.individualProfessional || data?.individualProfessional?.profile?.weeklySchedule) 
//       ) {
//            if (typeof window !== "undefined" && window.location.pathname === "/profile") {
//       const interval = setInterval(() => {
//         toast.error("You have not created your public profile yet. Please do so to enhance your visibility.");
//         // Show only once
//       }, 5000);
//     }
//       }
      
//     } catch (error) {
//       console.error("Error fetching user data:", error);
//       router.push("/");
//     }
//   };

//   useEffect(() => {
//     refreshUserData();
//   }, []);
 
  
//   const updateProfile = async (updatedData: any) => {
//     const token = localStorage.getItem("authToken")?.replace(/^"|"$/g, '');

//     try {
//       const storedData = localStorage.getItem("loginData") || localStorage.getItem("profileData");
//       const data = storedData ? JSON.parse(storedData) : null;
  
//       const currentRoleId = data?.id || data?.UserId;
  
//       // Merge existing data and updated fields
//       const mergedData = {
//         ...data,
//         ...updatedData,
//       };
  
//       const response = await fetch(
//         `${API_URL}/users/${currentRoleId}`,
//         {
//           method: "PUT",
//           headers: {
//             "Content-Type": "application/json",
//             'Authorization': `Bearer ${token}`,

//           },
//           body: JSON.stringify(mergedData), // send merged data directly, no wrapper object
//         }
//       );
  
//       if (response.ok) {
//         const responseData = await response.json();
  
//         toast.success("Profile updated successfully!");
//         localStorage.setItem("loginData", JSON.stringify(responseData)); // Save updated data
//       } else {
//         throw new Error("Failed to update profile.");
//       }
//     } catch (error) {
//       console.error("Error updating profile:", error);
//       toast.error("Error updating profile. Please try again.");
//     }
//   };
    

//   if (!loginData) return null;

//   return (
//     <div className="min-h-screen bg-gray-100 p-4 md:p-8">
//       <button
//         className="absolute top-4 left-4 mt-20 z-2 flex items-center text-gray-600 hover:text-black"
//         onClick={() => router.push("/")}
//       >
//         <ArrowLeft className="w-6 h-6 mr-2" />
//       </button>

//       <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-6 relative mt-12 md:mt-16">
//         <ActionButtons 
//           loginData={loginData} 
//           roleId={roleId} 
//           updateProfile={updateProfile} 
//           refreshUserData={refreshUserData}
//         />

//         <ProfileMenu roleId={roleId} />
//          {loginData?.individualProfessional?.profile?.weeklySchedule   && (
//           <>
        
//         <WeeklySchedule roleId={roleId} loginData={loginData} />
//         </>
//          )
//          }
//      {(roleId === 5 || roleId === 6 || roleId === 7) && (
      
//   <ProfileOverview
//     profileData={
//       loginData?.corporateClient ||
//       loginData?.securityCompany ||
//       loginData?.courseProvider
//     }
//     roleId={loginData?.roleId}
//     userId={loginData?.id}
//   />
// )}

       
//       </div>
//     </div>
//   );
// };

// export default UserProfile;




// if (
      //   data?.role?.id === 3 &&
      //   !(data?.user?.individualProfessional || data?.individualProfessional)
      // ) {
      //   const interval = setInterval(() => {
      //     if (window.confirm("Make your public profile?")) {
      //       router.push("/public-profile");
      //     }
      //   }, 5000);

      //   return () => clearInterval(interval);
      // }


       // useEffect(() => {
  //   const token = localStorage.getItem("authToken");
  //   const token2 = localStorage.getItem("authToken")?.replace(/^"|"$/g, '');
  //   console.log("token", token)
  //   console.log("token 2", token2)
  //   const fetchUserData = async () => {
  //     const storedData1 = localStorage.getItem("loginData") || localStorage.getItem("profileData");
  //     const data1 = storedData1 ? JSON.parse(storedData1) : null; 
  //     const currentId = data1?.id || data1?.user?.id;
  //     try {
  //         const response = await axios.get(
  //           `${API_URL}/auth/get-user/${currentId}`,
  //           {
  //             headers: {
  //               'Authorization': `Bearer ${token2}`,
  //             },
  //           }
  //         );

  
  //       const data = await response.data;
  //         console.log("data",data)
  //       const roleId = data?.role?.id || data?.roleId;
  //       setRoleId(roleId);
  //       localStorage.setItem("loginData", JSON.stringify(data));
  //       setLoginData(data);
  
  //       // Public profile check for roleId 3
  //       if (
  //         roleId === 3 &&
  //         !(data?.user?.individualProfessional || data?.individualProfessional)
  //       ) {
  //         const interval = setInterval(() => {
  //           if (window.confirm("Make your public profile?")) {
  //             router.push("/public-profile");
  //           }
  //         }, 5000);
  
  //         return () => clearInterval(interval);
  //       }
  //     } catch (error) {
  //       console.error("Error fetching user data:", error);
  //       router.push("/"); // Redirect if not logged in
  //     }
  //   };
  
  //   fetchUserData();
  // }, [router]);