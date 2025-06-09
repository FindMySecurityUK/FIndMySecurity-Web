"use client";

import React, { useState } from "react";
import Section from "./Section";
import toast from "react-hot-toast";
import axios from "axios";
import { API_URL } from "@/utils/path";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import { FaPhone, FaMapMarkerAlt, FaGlobe } from "react-icons/fa";

interface PhoneNumberInfo {
  isValid: boolean;
  country?: string;
  formatInternational?: string;
  error?: string;
}

type Props = {
  profile: any;
  userId: number;
  roleId: number;
};

const ContactSection: React.FC<Props> = ({ profile, roleId, userId }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false); // Prevent double save
  const [formData, setFormData] = useState({
    address: profile?.address || "",
    postCode: profile?.postCode || "",
    phoneNumber: profile?.phoneNumber || "",
    website: profile?.website || "",
  });

  const [phoneNumberInfo, setPhoneNumberInfo] = useState<PhoneNumberInfo>({ isValid: false });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [updatedData, setUpdatedData] = useState({ ...formData });

  const validatePhoneNumber = (phone: string): PhoneNumberInfo => {
    if (!phone.trim()) return { isValid: false, error: "Phone number is required" };
    const phoneNumber = parsePhoneNumberFromString(phone);
    if (!phoneNumber || !phoneNumber.isValid()) {
      return { isValid: false, error: "Invalid phone number" };
    }
    return {
      isValid: true,
      country: phoneNumber.country,
      formatInternational: phoneNumber.formatInternational(),
    };
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setFormErrors(prev => ({ ...prev, [name]: "" }));

    if (name === "phoneNumber") {
      const validation = validatePhoneNumber(value);
      setPhoneNumberInfo(validation);
      if (!validation.isValid) {
        setFormErrors(prev => ({
          ...prev,
          phoneNumber: validation.error || "Invalid phone number",
        }));
      }
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    let isValid = true;

    if (formData.phoneNumber) {
      const phoneValidation = validatePhoneNumber(formData.phoneNumber);
      if (!phoneValidation.isValid) {
        errors.phoneNumber = phoneValidation.error || "Invalid phone number";
        isValid = false;
      }
    }

    if (
      formData.website &&
      !formData.website.match(/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/)
    ) {
      errors.website = "Invalid website URL";
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      toast.error("Please fix the errors before saving");
      return;
    }

    if (isSaving) return; // prevent duplicate calls
    setIsSaving(true);

    try {
      const token = localStorage.getItem("authToken")?.replace(/^"|"$/g, "");
      if (!token) {
        toast.error("Authorization token not found.");
        setIsSaving(false);
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
          setIsSaving(false);
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
      toast.success("Contact information updated successfully");
      setIsEditing(false);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update contact info.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({ ...updatedData });
    setFormErrors({});
    setPhoneNumberInfo({ isValid: false });
    setIsEditing(false);
  };

  const formatPhoneNumberDisplay = (phone: string) => {
    const parsed = parsePhoneNumberFromString(phone);
    return parsed?.formatInternational() || phone;
  };

  return (
    <Section title={<h2 className="text-lg font-semibold">Contact</h2>}>
      {isEditing ? (
        <div className="space-y-4">
          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <div className="relative">
              <FaMapMarkerAlt className="absolute left-3 top-3 text-gray-500" />
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded text-gray-700"
                placeholder="123 Main St"
              />
            </div>
          </div>

          {/* Post Code */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Post Code</label>
            <input
              type="text"
              name="postCode"
              value={formData.postCode}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded text-gray-700"
              placeholder="AB12 3CD"
            />
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <div className="relative">
              <FaPhone className="absolute left-3 top-3 text-gray-500" />
              <input
                type="text"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                className={`w-full pl-10 pr-3 py-2 border rounded text-gray-700 ${
                  formErrors.phoneNumber ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="+44 20 1234 5678"
              />
            </div>
            {formData.phoneNumber && phoneNumberInfo.country && (
              <div className="mt-1 text-xs text-gray-500">
                Country: {phoneNumberInfo.country}
              </div>
            )}
            {formErrors.phoneNumber && (
              <p className="mt-1 text-xs text-red-500">{formErrors.phoneNumber}</p>
            )}
          </div>

          {/* Website */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
            <div className="relative">
              <FaGlobe className="absolute left-3 top-3 text-gray-500" />
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleChange}
                className={`w-full pl-10 pr-3 py-2 border rounded text-gray-700 ${
                  formErrors.website ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="https://example.com"
              />
            </div>
            {formErrors.website && (
              <p className="mt-1 text-xs text-red-500">{formErrors.website}</p>
            )}
          </div>

          {/* Save/Cancel Buttons */}
          <div className="flex justify-end gap-3 mt-4">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className={`bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 ${
                isSaving ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isSaving ? "Saving..." : "Save"}
            </button>
            <button
              onClick={handleCancel}
              className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {updatedData.address && (
            <div className="flex items-start">
              <FaMapMarkerAlt className="mt-1 mr-2 text-gray-500" />
              <div>
                <p className="font-medium">Address:</p>
                <p>{updatedData.address}</p>
              </div>
            </div>
          )}

          {updatedData.postCode && (
            <div className="flex items-start">
              <FaMapMarkerAlt className="mt-1 mr-2 text-gray-500 opacity-0" />
              <div>
                <p className="font-medium">Post Code:</p>
                <p>{updatedData.postCode}</p>
              </div>
            </div>
          )}

          {updatedData.phoneNumber && (
            <div className="flex items-start">
              <FaPhone className="mt-1 mr-2 text-gray-500" />
              <div>
                <p className="font-medium">Phone Number:</p>
                <p>{formatPhoneNumberDisplay(updatedData.phoneNumber)}</p>
              </div>
            </div>
          )}

          {updatedData.website && (
            <div className="flex items-start">
              <FaGlobe className="mt-1 mr-2 text-gray-500" />
              <div>
                <p className="font-medium">Website:</p>
                <a
                  href={updatedData.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline break-all"
                >
                  {updatedData.website}
                </a>
              </div>
            </div>
          )}

          <button
            onClick={() => setIsEditing(true)}
            className="bg-black text-white px-4 py-2 rounded mt-4 hover:bg-gray-800"
          >
            Edit
          </button>
        </div>
      )}
    </Section>
  );
};

export default ContactSection;







// "use client";

// import React, { useState } from "react";
// import Section from "./Section";
// import toast from "react-hot-toast";
// import axios from "axios";
// import { API_URL } from "@/utils/path";
// import { parsePhoneNumberFromString } from 'libphonenumber-js';
// import { FaPhone, FaMapMarkerAlt, FaGlobe } from "react-icons/fa";

// interface PhoneNumberInfo {
//   isValid: boolean;
//   country?: string;
//   formatInternational?: string;
//   error?: string;
// }

// type Props = {
//   profile: any;
//   userId: number;
//   roleId: number;
// };

// const ContactSection: React.FC<Props> = ({ profile, roleId, userId }) => {
//   const [isEditing, setIsEditing] = useState(false);
//   const [formData, setFormData] = useState({
//     address: profile?.address || "",
//     postCode: profile?.postCode || "",
//     phoneNumber: profile?.phoneNumber || "",
//     website: profile?.website || "",
//   });

//   const [phoneNumberInfo, setPhoneNumberInfo] = useState<PhoneNumberInfo>({
//     isValid: false
//   });

//   const [formErrors, setFormErrors] = useState<Record<string, string>>({});
//   const [updatedData, setUpdatedData] = useState({ ...formData });

//   const validatePhoneNumber = (phone: string): PhoneNumberInfo => {
//     if (!phone.trim()) {
//       return { isValid: false, error: "Phone number is required" };
//     }

//     const phoneNumber = parsePhoneNumberFromString(phone);
//     if (!phoneNumber || !phoneNumber.isValid()) {
//       return { isValid: false, error: "Invalid phone number" };
//     }

//     return {
//       isValid: true,
//       country: phoneNumber.country,
//       formatInternational: phoneNumber.formatInternational(),
//     };
//   };

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
    
//     // Clear previous errors
//     setFormErrors(prev => ({ ...prev, [name]: "" }));
    
//     if (name === 'phoneNumber') {
//       const validation = validatePhoneNumber(value);
//       setPhoneNumberInfo(validation);
      
//       if (!validation.isValid) {
//         setFormErrors(prev => ({ 
//           ...prev, 
//           phoneNumber: validation.error || "Invalid phone number"
//         }));
//       }
//     }
//   };

//   const validateForm = () => {
//     const errors: Record<string, string> = {};
//     let isValid = true;

//     // Validate phone number if it has value
//     if (formData.phoneNumber) {
//       const phoneValidation = validatePhoneNumber(formData.phoneNumber);
//       if (!phoneValidation.isValid) {
//         errors.phoneNumber = phoneValidation.error || "Invalid phone number";
//         isValid = false;
//       }
//     }

//     // Validate website URL format if it has value
//     if (formData.website && !formData.website.match(/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/)) {
//       errors.website = "Invalid website URL";
//       isValid = false;
//     }

//     setFormErrors(errors);
//     return isValid;
//   };

//   const handleSave = async () => {
//     if (!validateForm()) {
//       toast.error("Please fix the errors before saving");
//       return;
//     }

//     try {
//       const token = localStorage.getItem("authToken")?.replace(/^"|"$/g, "");
//       if (!token) {
//         toast.error("Authorization token not found.");
//         return;
//       }

//       let endpoint = "";
//       switch (roleId) {
//         case 5:
//           endpoint = `${API_URL}/users/security-companies/${userId}`;
//           break;
//         case 6:
//           endpoint = `${API_URL}/users/course-providers/${userId}`;
//           break;
//         case 7:
//           endpoint = `${API_URL}/users/corporate-clients/${userId}`;
//           break;
//         default:
//           toast.error("Unknown profile role.");
//           return;
//       }

//       const payload = {
//         // ...profile,
//         ...formData,
//       };

//       await axios.put(endpoint, payload, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       });

//       setUpdatedData({ ...formData });
//       toast.success("Contact information updated successfully");
//       setIsEditing(false);
//     } catch (err: any) {
//       toast.error(err.response?.data?.message || "Failed to update contact info.");
//     }
//   };

//   const handleCancel = () => {
//     setFormData({ ...updatedData });
//     setFormErrors({});
//     setPhoneNumberInfo({ isValid: false });
//     setIsEditing(false);
//   };

//   const formatPhoneNumberDisplay = (phone: string) => {
//     const parsed = parsePhoneNumberFromString(phone);
//     return parsed?.formatInternational() || phone;
//   };

//   return (
//     <Section title={<h2 className="text-lg font-semibold">Contact</h2>}>
//       {isEditing ? (
//         <div className="space-y-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
//             <div className="relative">
//               <FaMapMarkerAlt className="absolute left-3 top-3 text-gray-500" />
//               <input
//                 type="text"
//                 name="address"
//                 value={formData.address}
//                 onChange={handleChange}
//                 className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded text-gray-700"
//                 placeholder="123 Main St"
//               />
//             </div>
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Post Code</label>
//             <input
//               type="text"
//               name="postCode"
//               value={formData.postCode}
//               onChange={handleChange}
//               className="w-full border px-3 py-2 rounded text-gray-700"
//               placeholder="AB12 3CD"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
//             <div className="relative">
//               <FaPhone className="absolute left-3 top-3 text-gray-500" />
//               <input
//                 type="text"
//                 name="phoneNumber"
//                 value={formData.phoneNumber}
//                 onChange={handleChange}
//                 className={`w-full pl-10 pr-3 py-2 border rounded text-gray-700 ${
//                   formErrors.phoneNumber ? "border-red-500" : "border-gray-300"
//                 }`}
//                 placeholder="+44 20 1234 5678"
//               />
//             </div>
//             {formData.phoneNumber && phoneNumberInfo.country && (
//               <div className="mt-1 text-xs text-gray-500">
//                 Country: {phoneNumberInfo.country}
//               </div>
//             )}
//             {formErrors.phoneNumber && (
//               <p className="mt-1 text-xs text-red-500">{formErrors.phoneNumber}</p>
//             )}
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
//             <div className="relative">
//               <FaGlobe className="absolute left-3 top-3 text-gray-500" />
//               <input
//                 type="url"
//                 name="website"
//                 value={formData.website}
//                 onChange={handleChange}
//                 className={`w-full pl-10 pr-3 py-2 border rounded text-gray-700 ${
//                   formErrors.website ? "border-red-500" : "border-gray-300"
//                 }`}
//                 placeholder="https://example.com"
//               />
//             </div>
//             {formErrors.website && (
//               <p className="mt-1 text-xs text-red-500">{formErrors.website}</p>
//             )}
//           </div>

//           <div className="flex justify-end gap-3 mt-4">
//             <button
//               onClick={handleSave}
//               className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
//             >
//               Save
//             </button>
//             <button
//               onClick={handleCancel}
//               className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
//             >
//               Cancel
//             </button>
//           </div>
//         </div>
//       ) : (
//         <div className="space-y-3">
//           {updatedData.address && (
//             <div className="flex items-start">
//               <FaMapMarkerAlt className="mt-1 mr-2 text-gray-500 flex-shrink-0" />
//               <div>
//                 <p className="font-medium">Address:</p>
//                 <p>{updatedData.address}</p>
//               </div>
//             </div>
//           )}

//           {updatedData.postCode && (
//             <div className="flex items-start">
//               <FaMapMarkerAlt className="mt-1 mr-2 text-gray-500 flex-shrink-0 opacity-0" />
//               <div>
//                 <p className="font-medium">Post Code:</p>
//                 <p>{updatedData.postCode}</p>
//               </div>
//             </div>
//           )}

//           {updatedData.phoneNumber && (
//             <div className="flex items-start">
//               <FaPhone className="mt-1 mr-2 text-gray-500 flex-shrink-0" />
//               <div>
//                 <p className="font-medium">Phone Number:</p>
//                 <p>{formatPhoneNumberDisplay(updatedData.phoneNumber)}</p>
//               </div>
//             </div>
//           )}

//           {updatedData.website && (
//             <div className="flex items-start">
//               <FaGlobe className="mt-1 mr-2 text-gray-500 flex-shrink-0" />
//               <div>
//                 <p className="font-medium">Website:</p>
//                 <a
//                   href={updatedData.website}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="text-blue-600 hover:underline break-all"
//                 >
//                   {updatedData.website}
//                 </a>
//               </div>
//             </div>
//           )}

//           <button
//             onClick={() => setIsEditing(true)}
//             className="bg-black text-white px-4 py-2 rounded mt-4 hover:bg-gray-800"
//           >
//             Edit
//           </button>
//         </div>
//       )}
//     </Section>
//   );
// };

// export default ContactSection;





// "use client";

// import React, { useState } from "react";
// import Section from "./Section";
// import toast from "react-hot-toast";
// import axios from "axios";
// import { API_URL } from "@/utils/path";

// type Props = {
//   profile: any;
//   userId: number;
//   roleId: number;
// };

// const ContactSection: React.FC<Props> = ({ profile, roleId, userId }) => {
//   const [isEditing, setIsEditing] = useState(false);

//   const [formData, setFormData] = useState({
//     address: profile?.address || "",
//     postCode: profile?.postCode || "",
//     phoneNumber: profile?.phoneNumber || "",
//     website: profile?.website || "",
//   });

//   const [updatedData, setUpdatedData] = useState({ ...formData });

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSave = async () => {
//     try {
//       const token = localStorage.getItem("authToken")?.replace(/^"|"$/g, "");
//       if (!token) return toast.error("Authorization token not found.");

//       let endpoint = "";
//       switch (roleId) {
//         case 5:
//           endpoint = `${API_URL}/users/security-companies/${userId}`;
//           break;
//         case 6:
//           endpoint = `${API_URL}/users/course-providers/${userId}`;
//           break;
//         case 7:
//           endpoint = `${API_URL}/users/corporate-clients/${userId}`;
//           break;
//         default:
//           toast.error("Unknown profile role.");
//           return;
//       }

//       const payload = {
//         ...profile,
//         ...formData,
//       };

//       await axios.put(endpoint, payload, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       });

//       setUpdatedData({ ...formData });
//       toast.success("Contact information updated successfully");
//       setIsEditing(false);
//     } catch (err: any) {
//       toast.error(err.response?.data?.message || "Failed to update contact info.");
//     }
//   };

//   const handleCancel = () => {
//     setFormData({ ...updatedData });
//     setIsEditing(false);
//   };

//   return (
//     <Section title={<h2 className="text-lg font-semibold">Contact</h2>}>
//       {isEditing ? (
//         <div className="space-y-4">
//           {["address", "postCode", "phoneNumber", "website"].map((field) => (
//             <div key={field}>
//               <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
//                 {field.replace(/([A-Z])/g, " $1")}
//               </label>
//               <input
//                 type={field === "website" ? "url" : "text"}
//                 name={field}
//                 value={formData[field as keyof typeof formData]}
//                 onChange={handleChange}
//                 className="w-full border px-3 py-2 rounded text-gray-800"
//               />
//             </div>
//           ))}

//           <div className="flex justify-end gap-3 mt-4">
//             <button
//               onClick={handleSave}
//               className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
//             >
//               Save
//             </button>
//             <button
//               onClick={handleCancel}
//               className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
//             >
//               Cancel
//             </button>
//           </div>
//         </div>
//       ) : (
//         <div className="space-y-2">
//           {updatedData.address && (
//             <p><strong>Address:</strong> {updatedData.address}</p>
//           )}
//           {updatedData.postCode && (
//             <p><strong>Post Code:</strong> {updatedData.postCode}</p>
//           )}
//           {updatedData.phoneNumber && (
//             <p><strong>Phone Number:</strong> {updatedData.phoneNumber}</p>
//           )}
//           {updatedData.website && (
//             <p>
//               <strong>Website:</strong>{" "}
//               <a
//                 href={updatedData.website}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="text-blue-600 hover:underline break-words"
//               >
//                 {updatedData.website}
//               </a>
//             </p>
//           )}
//           <button
//             onClick={() => setIsEditing(true)}
//             className="bg-black text-white px-4 py-2 rounded mt-4 hover:bg-gray-800"
//           >
//             Edit
//           </button>
//         </div>
//       )}
//     </Section>
//   );
// };

// export default ContactSection;





// import React, { useState } from "react";
// import Section from "./Section";
// import toast from "react-hot-toast";
// import axios from "axios";
// import { API_URL } from "@/utils/path";

// const ContactSection = ({ profile, id }: { profile: any; id: any }) => {
//   const [isEditing, setIsEditing] = useState(false);
//   const [formData, setFormData] = useState({
//     address: profile?.address || "",
//     postCode: profile?.postCode || "",
//     phoneNumber: profile?.phoneNumber || "",
//     website: profile?.website || "",
//   });

//   const [updatedData, setUpdatedData] = useState({ ...formData });

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleSave = async () => {
//     try {
//       const token = localStorage.getItem("authToken")?.replace(/^"|"$/g, "");
//       if (!token) return toast.error("Authorization token not found.");

//       const payload = {
//         profileData: { ...formData },
//       };

//       await axios.put(`${API_URL}/profile/individual/${id}`, payload, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       });

//       setUpdatedData({ ...formData });
//       toast.success("Contact information updated successfully");
//       setIsEditing(false);
//     } catch (err: any) {
//       toast.error(err.response?.data?.message || "Failed to update contact info.");
//     }
//   };

//   const handleCancel = () => {
//     setFormData({ ...updatedData });
//     setIsEditing(false);
//   };

//   return (
//     <Section title={<h2 className="text-lg font-semibold">Contact</h2>}>
//       {isEditing ? (
//         <>
//           <div className="space-y-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
//               <input
//                 type="text"
//                 name="address"
//                 value={formData.address}
//                 onChange={handleChange}
//                 className="w-full border px-3 py-2 rounded"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Post Code</label>
//               <input
//                 type="text"
//                 name="postCode"
//                 value={formData.postCode}
//                 onChange={handleChange}
//                 className="w-full border px-3 py-2 rounded"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
//               <input
//                 type="text"
//                 name="phoneNumber"
//                 value={formData.phoneNumber}
//                 onChange={handleChange}
//                 className="w-full border px-3 py-2 rounded"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
//               <input
//                 type="url"
//                 name="website"
//                 value={formData.website}
//                 onChange={handleChange}
//                 className="w-full border px-3 py-2 rounded"
//               />
//             </div>
//           </div>
//           <div className="flex justify-end gap-3 mt-4">
//             <button onClick={handleSave} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Save</button>
//             <button onClick={handleCancel} className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400">Cancel</button>
//           </div>
//         </>
//       ) : (
//         <>
//           {updatedData.address && (
//             <p><strong>Address:</strong> {updatedData.address}</p>
//           )}
//           {updatedData.postCode && (
//             <p><strong>Post Code:</strong> {updatedData.postCode}</p>
//           )}
//           {updatedData.phoneNumber && (
//             <p><strong>Phone Number:</strong> {updatedData.phoneNumber}</p>
//           )}
//           {updatedData.website && (
//             <p>
//               <strong>Website:</strong>{" "}
//               <a href={updatedData.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline break-words">
//                 {updatedData.website}
//               </a>
//             </p>
//           )}
//           <button
//             onClick={() => setIsEditing(true)}
//             className="bg-black text-white px-4 py-2 rounded mt-4 hover:bg-gray-800"
//           >
//             Edit
//           </button>
//         </>
//       )}
//     </Section>
//   );
// };

// export default ContactSection;






// const ContactSection = ({ profile }: { profile: any }) => (
//     <div>
//       <h2 className="text-lg font-semibold mb-2">Contact</h2>
//       <p><strong>Address:</strong> {profile.address}</p>
//       <p><strong>Post Code:</strong> {profile.postCode}</p>
//       <p><strong>Phone Number:</strong> {profile.phoneNumber}</p>
//       <p><strong>Website:</strong> {profile.website}</p>
//     </div>
//   );
  
//   export default ContactSection;
  