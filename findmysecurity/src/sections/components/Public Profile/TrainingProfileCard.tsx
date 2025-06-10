"use client";

import React from "react";
import Image from "next/image";
// import img from "../../../../public/images/training.jpg";
import { FiMail, FiPhone, FiGlobe } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";

// Define TypeScript interfaces based on API response
interface Permissions {
  acceptTerms: boolean;
  acceptEmails: boolean;
  premiumServiceNeed: boolean;
}

interface CourseProvider {
  id: number;
  companyName: string;
  contactPerson: string;
  jobTitle: string;
  address: string;
  phoneNumber: string;
  postCode: string;
  registrationNumber: string;
  website: string;
  servicesRequirements: string[];
  securityServicesOfferings: string[];
  permissions: Permissions;
  createdAt: string;
  updatedAt: string;
  userId: number;
}

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  address: string;
  role: string;
  roleId: number;
  createdAt: string;
  updatedAt: string;
  validated: boolean;
  isSubscriber: boolean;
  subscriptionTier: string | null;
}

interface Provider {
  courseProvider: CourseProvider;
  user: User;
  profile?: {
    profilePhoto?: string;
  };
}

/**
 * Props for the Section component.
 */
interface SectionProps {
  label: string;
  value?: string | number | Date | string[] | null | undefined;
  onClick?: () => void;
  clickable?: boolean;
  hiddenValue?: boolean;
  showIcon?: boolean;
}

/**
 * Displays a labeled field with optional clickable action and icon.
 */
const Section: React.FC<SectionProps> = ({
  label,
  value,
  onClick,
  clickable,
  hiddenValue,
  showIcon,
}) => {
  const formatValue = (val: unknown): string => {
    if (val === null || val === undefined) return "N/A";
    if (Array.isArray(val)) return val.join(", ");
    if (val instanceof Date) return val.toLocaleString();
    return String(val);
  };

  const isWhatsAppField = label === "Chat on Whatsapp";
  const isCallField = label === "Phone";
  const isEmailField = label === "Email";
  const isWebsiteField = label === "Website";
  const isSpecialField = isWhatsAppField || isCallField || isEmailField || isWebsiteField;

  const bgColor = isWhatsAppField
    ? "bg-green-600 hover:bg-green-700"
    : isCallField
    ? "bg-indigo-600 hover:bg-indigo-700"
    : isEmailField
    ? "bg-blue-600 hover:bg-blue-700"
    : isWebsiteField
    ? "bg-gray-500 hover:bg-gray-600"
    : "bg-gray-100";

  const fieldColor = clickable || isSpecialField ? "text-white" : "text-gray-800";

  return (
    <div
      className={`flex items-start gap-3 ${
        clickable ? `cursor-pointer ${bgColor} p-3 rounded-lg` : ""
      } transition-colors`}
      onClick={onClick}
      role={clickable ? "button" : undefined}
      aria-label={clickable ? `Open ${label}` : undefined}
    >
      {showIcon && (
        <div className={`${fieldColor} mt-0.5`}>
          {isWhatsAppField ? (
            <FaWhatsapp size={18} />
          ) : isCallField ? (
            <FiPhone size={18} />
          ) : isEmailField ? (
            <FiMail size={18} />
          ) : isWebsiteField ? (
            <FiGlobe size={18} />
          ) : (
            <FiMail size={18} />
          )}
        </div>
      )}
      <div>
        <p
          className={`text-sm font-medium uppercase tracking-wider ${
            isSpecialField ? "text-white" : "text-gray-500"
          }`}
        >
          {label}
        </p>
        <p className={`text-base font-medium break-words ${fieldColor}`}>
          {hiddenValue ? "" : formatValue(value)}
        </p>
      </div>
    </div>
  );
};

/**
 * Props for the ProfileGroup component.
 */
interface ProfileGroupProps {
  title: string;
  data: Record<string, unknown> | Permissions;
}

/**
 * Displays a group of profile data with a title.
 */
const ProfileGroup: React.FC<ProfileGroupProps> = ({ title, data }) => {
  if (!data || Object.keys(data).length === 0) return null;

  return (
    <div className="mt-8 bg-gray-50 rounded-xl border p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">{title}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {Object.entries(data).map(([key, val]) =>
          val && typeof val === "object" && !Array.isArray(val) ? (
            <ProfileGroup key={key} title={formatKey(key)} data={val as Record<string, unknown>} />
          ) : (
            <Section
              key={key}
              label={formatKey(key)}
              value={Array.isArray(val) ? val : val?.toString()}
            />
          )
        )}
      </div>
    </div>
  );
};

/**
 * Formats a camelCase or snake_case key into a human-readable string.
 */
const formatKey = (key: string): string =>
  key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase())
    .replace(/_/g, " ")
    .trim();

/**
 * Displays a training provider profile card with details and contact options.
 * @param props - The provider data from the API.
 */
const TrainingProfileCard: React.FC<{ provider: Provider }> = ({ provider }) => {
  const { courseProvider, user, profile } = provider;
  const {
    companyName,
    contactPerson,
    jobTitle,
    phoneNumber,
    website,
    address,
    postCode,
    registrationNumber,
    servicesRequirements,
    securityServicesOfferings,
    permissions,
    createdAt,
  } = courseProvider;

  return (
    <div className="max-w-5xl mx-auto my-6 px-4 sm:px-6 lg:px-8 bg-white rounded-lg shadow">
    <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6 bg-white rounded-lg p-4 sm:p-6">
      <div className="flex-shrink-0 mx-auto sm:mx-0">
        <img
          src={profile?.profilePhoto || '/images/training.jpg'}
          alt={`${companyName} logo`}
          className="w-20 h-20 sm:w-32 sm:h-32 rounded-full object-cover border border-gray-200"
        />
      </div>
      <div className="flex-1 text-center sm:text-left">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">{companyName}</h2>
        <p className="text-gray-600 mt-2 text-sm sm:text-base">{jobTitle || "Training Provider"}</p>
        <div className="flex flex-col sm:flex-row mt-4 sm:mt-6 gap-2 sm:gap-3">
          <Section
            label="Chat on Whatsapp"
            value={phoneNumber}
            showIcon
            clickable
            hiddenValue
            onClick={() =>
              phoneNumber && window.open(`https://wa.me/${phoneNumber.replace(/[^\d]/g, "")}`, "_blank")
            }
          />
          <Section
            label="Phone"
            value={phoneNumber}
            showIcon
            clickable
            hiddenValue
            onClick={() => phoneNumber && window.open(`tel:${phoneNumber}`)}
          />
          <Section
            label="Email"
            value={user?.email || "N/A"}
            showIcon
            clickable
            hiddenValue
            onClick={() => user?.email && window.open(`mailto:${user.email}`)}
          />
        </div>
      </div>
    </div>
  
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mt-6 sm:mt-8 bg-white rounded-md p-4 sm:p-6 shadow-sm">
      <Section label="Contact Person" value={contactPerson} />
      <Section label="Job Title" value={jobTitle} />
      <Section label="Address" value={address} />
      <Section label="Postcode" value={postCode} />
      <Section label="Registration Number" value={registrationNumber} />
      <Section
        label="Website"
        value={website || "N/A"}
        showIcon
        clickable={!!website && website !== "nil"}
        hiddenValue
        onClick={() => website && website !== "nil" && window.open(website, "_blank")}

      />
      <Section label="Account Created" value={new Date(createdAt).toLocaleString()} />
    </div>
  
    <ProfileGroup title="Training Services Offered" data={{ services: servicesRequirements }} />
    <ProfileGroup title="Security Services Offered" data={{ services: securityServicesOfferings }} />
    <ProfileGroup
      title="Primary Contact"
      data={{
        firstName: contactPerson || "N/A",
        lastName: user?.lastName || "N/A",
        email: user?.email || "N/A",
        phoneNumber: phoneNumber || "N/A",
      }}
    />
  </div>
    // <div className="max-w-5xl mx-auto my-10 px-4 sm:px-6 bg-white rounded-lg shadow-lg p-6">
    //   <div className="flex flex-col sm:flex-row items-start gap-6 bg-white rounded-lg p-6">
    //     <div className="flex-shrink-0">
    //       <img
    //         src={profile?.profilePhoto || '/images/training.jpg'}
    //         alt={`${companyName} logo`}
    //         className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border border-gray-200"
    //       />
    //     </div>
    //     <div className="flex-1">
    //       <h2 className="text-2xl font-bold text-gray-800">{companyName}</h2>
    //       <p className="text-gray-600 mt-2">{jobTitle || "Training Provider"}</p>
    //       <div className="flex flex-col sm:flex-row mt-6 gap-3">
    //         <Section
    //           label="Chat on Whatsapp"
    //           value={phoneNumber}
    //           showIcon
    //           clickable
    //           hiddenValue
    //           onClick={() =>
    //             phoneNumber && window.open(`https://wa.me/${phoneNumber.replace(/[^\d]/g, "")}`, "_blank")
    //           }
    //         />
    //         <Section
    //           label="Phone"
    //           value={phoneNumber}
    //           showIcon
    //           clickable
    //           hiddenValue
    //           onClick={() => phoneNumber && window.open(`tel:${phoneNumber}`)}
    //         />
    //         <Section
    //           label="Email"
    //           value={user?.email || "N/A"}
    //           showIcon
    //           clickable
    //           hiddenValue
    //           onClick={() => user?.email && window.open(`mailto:${user.email}`)}
    //         />
    //       </div>
    //     </div>
    //   </div>

    //   <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8 bg-white rounded-lg p-6 shadow-sm">
    //     <Section label="Contact Person" value={contactPerson} />
    //     <Section label="Job Title" value={jobTitle} />
    //     <Section label="Address" value={address} />
    //     <Section label="Post Code" value={postCode} />
    //     <Section label="Registration Number" value={registrationNumber} />
    //     <Section
    //       label="Website"
    //       value={website || "N/A"}
    //       showIcon
    //       clickable={!!website && website !== "nil"}
    //       hiddenValue
          // onClick={() => website && website !== "nil" && window.open(website, "_blank")}
    //     />
    //     <Section label="Account Created" value={new Date(createdAt).toLocaleString()} />
    //   </div>

    //   <ProfileGroup title="Training Services Offered" data={{ services: servicesRequirements }} />
    //   <ProfileGroup title="Security Services Offered" data={{ services: securityServicesOfferings }} />
    //   {/* <ProfileGroup title="Permissions" data={permissions} /> */}
    //   <ProfileGroup
    //     title="Primary Contact"
    //     data={{
    //       firstName: user?.firstName || "N/A",
    //       lastName: user?.lastName || "N/A",
    //       email: user?.email || "N/A",
    //       phoneNumber: user?.phoneNumber || "N/A",
    //     }}
    //   />
    // </div>
  );
};

export default TrainingProfileCard;







// import React, { useState } from "react";
// import Image from "next/image";
// import img from "../../../../public/images/training.jpg"; // Placeholder for training provider logo
// import { FiMail, FiPhone, FiChevronDown, FiChevronUp, FiLock, FiGlobe } from "react-icons/fi";
// import { FaWhatsapp } from "react-icons/fa";
// import {
//   AiFillFilePdf,
//   AiFillFileImage,
//   AiFillFileWord,
//   AiFillFileExcel,
//   AiFillFilePpt,
// } from "react-icons/ai";

// interface SectionProps {
//   label: string;
//   value?: string | number | Date | any[] | null | undefined;
//   onClick?: () => void;
//   clickable?: boolean;
//   hiddenValue?: boolean;
//   showIcon?: boolean;
// }
// const Section = ({
//   label,
//   value,
//   onClick,
//   clickable,
//   hiddenValue,
//   showIcon,
// }: SectionProps) => {
//   const formatValue = (val: any): string => {
//     if (val === null || val === undefined) return "N/A";
//     if (Array.isArray(val)) return val.join(", ");
//     if (val instanceof Date) return val.toLocaleString();
//     return String(val);
//   };

//   const isWhatsAppField = label === "Chat on Whatsapp";
//   const isCallField = label === "Phone";
//   const isEmailField = label === "Email";
//   const isWebsiteField = label === "Website";
//   const isSpecialField = isWhatsAppField || isCallField || isEmailField || isWebsiteField;

//   // Different background colors for clickable fields
//   const bgColor = isWhatsAppField
//     ? "bg-green-500 hover:bg-green-600"
//     : isCallField
//     ? "bg-indigo-500 hover:bg-indigo-600"
//     : isEmailField
//     ? "bg-blue-500 hover:bg-blue-600"
//     : isWebsiteField
//     ? "bg-gray-500 hover:bg-gray-600"
//     : "";

//   return (
//     <div
//       className={`group flex items-start gap-3 ${
//         clickable ? `cursor-pointer ${bgColor}` : ""
//       } p-3 rounded-lg transition-all`}
//       onClick={onClick}
//     >
//       {showIcon && (
//         <div className={`${clickable ? "text-white" : isSpecialField ? "text-white" : "text-gray-800"} mt-0.5`}>
//           {isWhatsAppField ? (
//             <FaWhatsapp size={18} />
//           ) : isCallField ? (
//             <FiPhone size={18} />
//           ) : isEmailField ? (
//             <FiMail size={18} />
//           ) : isWebsiteField ? (
//             <FiGlobe size={18} />
//           ) : (
//             <FiMail size={18} />
//           )}
//         </div>
//       )}
//       <div>
//         <p className={`text-sm font-medium uppercase tracking-wider ${isSpecialField ? "text-white" : "text-gray-500"}`}>
//           {label}
//         </p>
//         {!isSpecialField && (
//           <p className={`text-base font-medium break-words ${clickable ? "text-white" : "text-gray-800"}`}>
//             {hiddenValue ? "Hidden" : formatValue(value)}
//           </p>
//         )}
//       </div>
//     </div>
//   );
// };

// const formatKey = (key: string) =>
//   key
//     .replace(/([A-Z])/g, " $1")
//     .replace(/^./, str => str.toUpperCase())
//     .replace(/_/g, " ");
// const ProfileGroup = ({ title, data }: any) => {
//   if (!data || Object.keys(data).length === 0) return null;

//   return (
//     <div className="mt-8 bg-gray-50 rounded-xl border p-6 shadow-sm">
//       <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">{title}</h3>
//       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//       {Object.entries(data).map(([key, val]) =>
//           typeof val === "object" && !Array.isArray(val) ? (
//             <ProfileGroup key={key} title={formatKey(key)} data={val} />
//           ) : (
//             <Section key={key} label={formatKey(key)} value={Array.isArray(val) ? val : val?.toString()} />
//           )
//         )}
//       </div>
//     </div>
//   );
// };

// const TrainingProfileCard = ({ provider }: { provider: any }) => {
//   const {
//     companyName,
//     contactPerson,
//     jobTitle,
//     phoneNumber,
//     website,
//     address,
//     servicesRequirements,
//     securityServicesOfferings,
//     permissions,
//     createdAt,
//     user,
//   } = provider;


//   return (
//     <div className="max-w-5xl mx-auto my-10 px-6 bg-white rounded-lg shadow p-6">
//       <div className="flex items-center gap-4 mb-6">
//         <img
//           src={img.src}
//           alt="Providers Logo"
//           className="w-32 h-32 rounded-full object-cover border mb-4"
//           style={{ width: '120px', height: '120px' }}  // Adjust dimensions as needed
//         />

//         <h2 className="text-2xl font-semibold text-gray-900">{companyName}</h2>
//       </div>

//       <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
//         <Section label="Contact Person" value={contactPerson} />
//         <Section label="Job Title" value={jobTitle} />
//         <Section label="Phone" value={phoneNumber} showIcon clickable onClick={() => window.open(`tel:${phoneNumber}`)} />
//         <Section label="Chat on Whatsapp" value={phoneNumber} showIcon clickable onClick={() => window.open(`https://wa.me/${phoneNumber}`)} />
//         <Section label="Website" value={website} clickable onClick={() => window.open(website, "_blank")} />
//         <Section label="Email" value={user?.email} showIcon clickable onClick={() => window.open(`mailto:${user?.email}`)} />
//         <Section label="Address" value={address} />
//         <Section label="Created At" value={new Date(createdAt)} />
//       </div>

//       <ProfileGroup title="Training Services Offered" data={{ servicesRequirements }} />
//       <ProfileGroup title="Security Services Offered" data={{ securityServicesOfferings }} />
//       <ProfileGroup title="Permissions" data={permissions} />

//       {/* {documents.length > 0 && <DocumentsSection documents={documents} />} */}
//     </div>
//   );
// };

// export default TrainingProfileCard;
