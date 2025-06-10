"use client";

import React, { useState } from "react";
import Section from "./Section";
import toast from "react-hot-toast";
import axios from "axios";
import { API_URL } from "@/utils/path";

interface AboutSectionProps {
  profile: any;
  userId: number;
  roleId: number;
}

const AboutSection: React.FC<AboutSectionProps> = ({ profile, roleId, userId }) => {
  const [isEditing, setIsEditing] = useState(false);

  const isSecurityCompany = roleId === 5;
  const isCourseProvider = roleId === 6;
  const isCorporateClient = roleId === 7;

  const [formData, setFormData] = useState({
    companyName: profile?.companyName || "",
    industryType: profile?.industryType || "",
  });

  const [updatedData, setUpdatedData] = useState({ ...formData });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("authToken")?.replace(/^"|"$/g, "");
      if (!token) {
        toast.error("Authorization token not found.");
        return;
      }

      let endpoint = "";
      switch (roleId) {
        case 5:
          endpoint = `${API_URL}/users/security-companies/${userId}`;
          break;
        case 6:
          endpoint = `${API_URL}/users/course-providers/${userId}`;
          break;
        case 7:
          endpoint = `${API_URL}/users/corporate-clients/${userId}`;
          break;
        default:
          toast.error("Unknown profile role.");
          return;
      }
      let payload = {}
      if(roleId===7){
        payload = {
          ...profile,
          ...formData,
        };
      }
      else if(roleId===6 || roleId===5){
        payload = {
          ...formData,
        };
      }


      await axios.put(endpoint, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      setUpdatedData({ ...formData });
      setIsEditing(false);
      toast.success("Profile updated successfully");
    } catch (error: any) {
      const message = error.response?.data?.message || "Failed to update profile.";
      toast.error(message);
    }
  };

  const handleCancel = () => {
    setFormData({ ...updatedData });
    setIsEditing(false);
  };

  const fields = [
    {
      name: "industryType",
      label: "Industry Type",
      visible: isCorporateClient,
    },
    {
      name: "companyName",
      label: "Company Name",
      visible: isSecurityCompany || isCourseProvider,
    },
  ];

  return (
    profile && (
      <Section
        title={
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">About</h2>
          </div>
        }
      >
        <div className="space-y-4 text-gray-700">
          {isEditing ? (
            <>
              <div className="grid grid-cols-1 gap-4">
                {fields
                  .filter((field) => field.visible)
                  .map((field) => (
                    <div key={field.name}>
                      <label className="block text-sm font-medium mb-1">{field.label}</label>
                      <input
                        name={field.name}
                        value={formData[field.name as keyof typeof formData]}
                        onChange={handleChange}
                        className="w-full border px-3 py-2 rounded text-gray-700"
                        placeholder={`Enter ${field.label.toLowerCase()}`}
                      />
                    </div>
                  ))}
              </div>

              <div className="flex gap-3 mt-4 justify-end">
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Save
                </button>
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </>
          ) : (
            <>
              {fields
                .filter((field) => field.visible)
                .map((field) => (
                  <p key={field.name}>
                    <strong>{field.label}:</strong>{" "}
                    {updatedData[field.name as keyof typeof updatedData] || "N/A"}
                  </p>
                ))}
              <p>
                <strong>Created At:</strong>{" "}
                {new Date(profile.createdAt).toLocaleDateString()}
              </p>
              <p>
                <strong>Updated At:</strong>{" "}
                {new Date(profile.updatedAt).toLocaleDateString()}
              </p>

              <button
                onClick={() => setIsEditing(true)}
                className="text-sm px-5 py-2 mt-5 bg-black text-white rounded hover:bg-gray-800 transition"
              >
                Edit
              </button>
            </>
          )}
        </div>
      </Section>
    )
  );
};

export default AboutSection;





// import React, { useState } from "react";
// import Section from "./Section";
// import toast from "react-hot-toast";
// import axios from "axios";

// const AboutSection = ({ profile, id }: { profile: any; id: any }) => {
//   const [isEditing, setIsEditing] = useState(false);

//   const [formData, setFormData] = useState({
//     industryType: profile?.industryType || "",
//   });

//   const [updatedData, setUpdatedData] = useState({ ...formData });

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSave = async () => {
//     try {
//       const token = localStorage.getItem("authToken")?.replace(/^"|"$/g, "");
//       if (!token) {
//         toast.error("Authorization token not found.");
//         return;
//       }

//       const payload = {
//         profileData: {
//           ...updatedData,
//           ...formData,
//         },
//       };

//       await axios.put(
//         `https://ub1b171tga.execute-api.eu-north-1.amazonaws.com/dev/profile/${id}`,
//         payload,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       setUpdatedData({ ...formData });
//       setIsEditing(false);
//       toast.success("Profile updated successfully");
//     } catch (error: any) {
//       const message =
//         error.response?.data?.message || "Failed to update profile.";
//       toast.error(message);
//     }
//   };

//   const handleCancel = () => {
//     setFormData({ ...updatedData });
//     setIsEditing(false);
//   };

//   return (
//     profile && (
//       <Section
//         title={
//           <div className="flex items-center justify-between">
//             <h2 className="text-lg font-semibold">About</h2>
//           </div>
//         }
//       >
//         <div className="space-y-4 text-gray-700">
//           {isEditing ? (
//             <>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Industry Type
//                 </label>
//                 <input
//                   name="industryType"
//                   value={formData.industryType}
//                   onChange={handleChange}
//                   className="w-full border px-3 py-2 rounded text-gray-700"
//                 />
//               </div>

//               <div className="flex gap-3 mt-4">
//                 <button
//                   onClick={handleSave}
//                   className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
//                 >
//                   Save
//                 </button>
//                 <button
//                   onClick={handleCancel}
//                   className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
//                 >
//                   Cancel
//                 </button>
//               </div>
//             </>
//           ) : (
//             <>
//               <div>
//                 <p>
//                   <strong>Industry Type:</strong>{" "}
//                   {updatedData.industryType || "N/A"}
//                 </p>
//                 <p>
//                   <strong>Created At:</strong>{" "}
//                   {new Date(profile.createdAt).toLocaleDateString()}
//                 </p>
//                 <p>
//                   <strong>Updated At:</strong>{" "}
//                   {new Date(profile.updatedAt).toLocaleDateString()}
//                 </p>
//               </div>
//               <button
//                 onClick={() => setIsEditing(true)}
//                 className="text-sm px-5 py-2 mt-5 bg-black text-white rounded hover:bg-gray-800 transition"
//               >
//                 Edit
//               </button>
//             </>
//           )}
//         </div>
//       </Section>
//     )
//   );
// };

// export default AboutSection;






// const AboutSection = ({ profile }: { profile: any }) => (
//   <div>
//     <h2 className="text-lg font-semibold mb-2">About</h2>
//     <p><strong>Industry Type:</strong> {profile.industryType || "N/A"}</p>
//     <p><strong>Created At:</strong> {new Date(profile.createdAt).toLocaleDateString()}</p>
//     <p><strong>Updated At:</strong> {new Date(profile.updatedAt).toLocaleDateString()}</p>
//   </div>
// );

// export default AboutSection;
