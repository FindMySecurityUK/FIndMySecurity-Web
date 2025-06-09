import React, { useEffect, useState } from "react";
import img from "../../../../public/images/profile.png";
import { FiMail, FiPhone, FiMessageSquare } from "react-icons/fi";
import { FileText, Award, CheckCircle } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import ProfessionalIcons from "./ProfessionalIcons";
import { FiChevronDown, FiChevronUp, FiDownload, FiSend, FiLock } from "react-icons/fi";
import {
  AiFillFilePdf,
  AiFillFileImage,
  AiFillFileWord,
  AiFillFileExcel,
  AiFillFilePpt,
  AiFillFileText,
} from "react-icons/ai";
import toast from "react-hot-toast";

interface SectionProps {
  label: string;
  value?: string | number | Date | any[] | null | undefined;
  onClick?: () => void;
  clickable?: boolean;
  hiddenValue?: boolean;
  showIcon?: boolean;
}

const Section = ({
  label,
  value,
  onClick,
  clickable,
  hiddenValue,
  showIcon,
}: SectionProps) => {
  const formatValue = (val: any): string => {
    if (val === null || val === undefined) return "N/A";
    if (Array.isArray(val)) return val.join(", ");
    if (val instanceof Date) return val.toLocaleString();
    return String(val);
  };
  const isWhatsAppField = label === "Chat on Whatsapp";
  const isCallField = label === "Mobile";
  const fieldColor = isWhatsAppField || isCallField ? "text-white" : "text-white";
  const bgColor = isWhatsAppField
    ? "bg-green-500 hover:bg-green-600"
    : isCallField
    ? "bg-indigo-500 hover:bg-indigo-600"
    : "bg-blue-500 hover:bg-blue-600";
  const displayValue = hiddenValue ? "" : formatValue(value);
  return (
    <div
      className={`group flex items-start gap-3 ${
        clickable ? `cursor-pointer ${bgColor}` : ""
      } p-3 rounded-lg transition-all`}
      onClick={onClick}
    >
      {showIcon && (
        <div className={`${fieldColor} mt-0.5`}>
          {isWhatsAppField ? (
            <FaWhatsapp size={18} style={{ color: "#fff" }} />
          ) : isCallField ? (
            <FiPhone size={18} style={{ color: "#fff" }} />
          ) : (
            <FiMail size={18} style={{ color: "#fff" }} />
          )}
        </div>
      )}
      <div>
        <p
          className={`text-sm font-medium uppercase tracking-wider ${
            isWhatsAppField || label === "Message" || isCallField
              ? "text-white"
              : "text-gray-500"
          }`}
        >
          {label}
        </p>
        <p
          className={`text-base font-medium ${
            clickable ? fieldColor : "text-gray-800"
          } break-words whitespace-pre-wrap`}
        >
          {displayValue
            .split(" ")
            .map((word) => (word.length > 15 ? word.slice(0, 15) + "..." : word))
            .join(" ")}
        </p>
      </div>
    </div>
  );
};
const ProfileGroup = ({ title, data }: { title: string; data: any }) => {
  // Helper function to detect if a value is a URL
  const isURL = (value: string): boolean => {
    try {
      const urlPattern = /^(https?:\/\/[^\s/$.?#].[^\s]*)$/i;
      return urlPattern.test(value);
    } catch {
      return false;
    }
  };

  // Format key for display (e.g., camelCase to Title Case)
  const formatKey = (key: string): string => {
    return key
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase())
      .trim();
  };

  const validEntries = Object.entries(data || {}).filter(
    ([, val]) =>
      val !== null &&
      val !== "" &&
      val !== undefined &&
      (typeof val !== "object" || (Array.isArray(val) ? val.length > 0 : Object.keys(val).length > 0))
  );

  if (validEntries.length === 0) return null;

  return (
    <div className="mt-8 bg-gray-50 rounded-xl border p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">{title}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {validEntries.map(([key, val]) =>
          typeof val === "object" && !Array.isArray(val) && val !== null ? (
            <ProfileGroup key={key} title={formatKey(key)} data={val} />
          ) : (
            <div key={key} className="flex flex-col">
              <span className="text-sm font-medium text-gray-600">{formatKey(key)}</span>
              {typeof val === "string" && isURL(val) ? (
                <a
                  href={val}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline break-all"
                >
                  {val}
                </a>
              ) : (
                <span className="text-gray-800">
                  {Array.isArray(val) ? val.join(", ") : String(val)}
                </span>
              )}
            </div>
          )
        )}
      </div>
    </div>
  );
};
// const ProfileGroup = ({ title, data }: { title: string; data: any }) => {
//   const validEntries = Object.entries(data || {}).filter(
//     ([, val]) =>
//       val !== null &&
//       val !== "" &&
//       val !== undefined &&
//       (typeof val !== "object" || (Array.isArray(val) ? val.length > 0 : Object.keys(val).length > 0))
//   );
//   if (validEntries.length === 0) return null;
//   return (
//     <div className="mt-8 bg-gray-50 rounded-xl border p-6 shadow-sm">
//       <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">{title}</h3>
//       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//         {validEntries.map(([key, val]) =>
//           typeof val === "object" && !Array.isArray(val) && val !== null ? (
//             <ProfileGroup key={key} title={formatKey(key)} data={val} />
//           ) : (
//             <Section
//               key={key}
//               label={formatKey(key)}
//               value={Array.isArray(val) ? val.join(", ") : val?.toString()}
//             />
//           )
//         )}
//       </div>
//     </div>
//   );
// };

const formatKey = (key: string) =>
  key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase())
    .replace(/_/g, " ");

const AvailabilityTable = ({ schedule }: { schedule: any }) => {
  const timeSlots = ["Morning", "Afternoon", "Evening", "Overnight"];
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  return (
    <div className="overflow-auto mt-4 rounded-lg border border-gray-200">
      <table className="min-w-full text-sm text-center">
        <thead className="bg-gray-100 text-gray-700 font-medium">
          <tr>
            <th className="px-4 py-2 text-left">Time Slot</th>
            {days.map((day) => (
              <th key={day} className="px-3 py-2">{day}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {timeSlots.map((slot) => (
            <tr key={slot} className="border-t">
              <td className="px-4 py-2 text-left font-medium text-gray-700">{slot}</td>
              {days.map((day) => (
                <td
                  key={day}
                  className={`px-3 py-2 ${
                    schedule?.[slot]?.[day]
                      ? "bg-green-100 text-green-700"
                      : "text-gray-400"
                  }`}
                >
                  {schedule?.[slot]?.[day] ? "✓" : "—"}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const getFileIcon = (filename?: string) => {
  if (!filename || typeof filename !== "string") return <AiFillFileText className="text-gray-400" size={28} />;
  const ext = filename.split(".").pop()?.toLowerCase();
  if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext!)) return <AiFillFileImage className="text-pink-500" size={28} />;
  if (["pdf"].includes(ext!)) return <AiFillFilePdf className="text-red-500" size={28} />;
  if (["doc", "docx"].includes(ext!)) return <AiFillFileWord className="text-blue-500" size={28} />;
  if (["xls", "xlsx"].includes(ext!)) return <AiFillFileExcel className="text-green-600" size={28} />;
  if (["ppt", "pptx"].includes(ext!)) return <AiFillFilePpt className="text-orange-500" size={28} />;
  return <AiFillFileText className="text-gray-400" size={28} />;
};

const getDocumentNameFromUrl = (url: string) => {
  if (typeof url !== "string") return "Unnamed Document";
  const parts = url.split("/");
  const fileNameWithExt = decodeURIComponent(parts.pop() || "Unnamed Document");
  const namePart = fileNameWithExt.split("-").slice(1).join("-").split(".").slice(0, -1).join(".");
  return namePart || "Unnamed Document";
};
const DocumentsSection = ({
  documents,
  userId,
  targetUserId,
}: {
  documents: { id: number; individualProfessionalId: number; status: string; uploadedAt: string; url: string }[];
  userId: string | number;
  targetUserId: number;
}) => {
  const [visibleCount, setVisibleCount] = useState(3);
  const [showAll, setShowAll] = useState(false);
  const [accessGranted, setAccessGranted] = useState(false);
  const [requestSent, setRequestSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [documentUrls, setDocumentUrls] = useState<Record<number, string>>({});
  const [loadingUrls, setLoadingUrls] = useState<Record<number, boolean>>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalUrl, setModalUrl] = useState<string | null>(null);

  const requesterId = typeof userId === "string" ? parseInt(userId, 10) : userId;
  const approvedDocuments = documents.filter((doc) => doc.status === "APPROVED");
  const displayedDocuments = approvedDocuments.slice(0, visibleCount);

  const toggleShowAll = () => {
    setShowAll(!showAll);
    setVisibleCount(showAll ? 3 : approvedDocuments.length);
  };

  const getFileNameFromUrl = (url: string) => {
    if (typeof url !== "string") return null;
    const parts = url.split("/");
    return decodeURIComponent(parts.pop() || "");
  };

  const fetchDocumentUrl = async (docId: number, fileName: string) => {
    try {
      setLoadingUrls((prev) => ({ ...prev, [docId]: true }));
      const response = await fetch(
        `https://ub1b171tga.execute-api.eu-north-1.amazonaws.com/dev/file/file-url?fileName=${encodeURIComponent(fileName)}`
      );
      if (!response.ok) throw new Error(`Failed to fetch URL for ${fileName}`);
      const data = await response.json();
      return data?.url?.url;
    } catch (error) {
      console.error(`Error fetching URL for document ${docId}:`, error);
      return null;
    } finally {
      setLoadingUrls((prev) => ({ ...prev, [docId]: false }));
    }
  };

  const preloadAllUrls = async () => {
    for (const doc of approvedDocuments) {
      const fileName = getFileNameFromUrl(doc.url);
      if (!fileName) continue;
      const url = await fetchDocumentUrl(doc.id, fileName);
      if (url) {
        setDocumentUrls((prev) => ({ ...prev, [doc.id]: url }));
      }
    }

    // Show first document in modal automatically
    const firstUrl = Object.values(documentUrls)[0];
    if (firstUrl) {
      setModalUrl(firstUrl);
      setIsModalOpen(true);
    }
  };

  const handleDocumentClick = (docId: number) => {
    if (!accessGranted || !documentUrls[docId]) return;
    setModalUrl(documentUrls[docId]);
    setIsModalOpen(true);
  };

  const checkDocumentAccess = async () => {
    try {
      const response = await fetch(
        `https://ub1b171tga.execute-api.eu-north-1.amazonaws.com/dev/document/access-check?requesterId=${requesterId}&targetUserId=${targetUserId}`
      );
      const result = await response.json();
      if (response.ok && result.hasAccess) {
        setAccessGranted(true);
      } else {
        setAccessGranted(false);
      }
    } catch (error) {
      console.error("Access check failed:", error);
      setAccessGranted(false);
    }
  };

  const requestDocumentAccess = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        "https://ub1b171tga.execute-api.eu-north-1.amazonaws.com/dev/document/request",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ requesterId, targetUserId }),
        }
      );
      if (response.ok) {
        setRequestSent(true);
        setTimeout(() => setRequestSent(false), 3000);
        await checkDocumentAccess();
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Failed to request access.");
      }
    } catch (error) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkDocumentAccess();
  }, [userId, targetUserId]);

  useEffect(() => {
    if (accessGranted) preloadAllUrls();
  }, [accessGranted]);

  return (
    <div className="mt-10 bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">My Documents</h3>
        <p className="text-sm text-gray-600 mb-6">
          This member has uploaded the following documents.
        </p>

        {approvedDocuments.length === 0 && (
          <div className="text-gray-500">No documents available.</div>
        )}

        <div className="space-y-3">
          {displayedDocuments.map((doc) => {
            const name = getFileNameFromUrl(doc.url) || "Document";
            return (
              <div
                key={doc.id}
                className="flex items-start p-3 hover:bg-gray-50 rounded-lg transition-colors border border-gray-100"
              >
                <div className="ml-2 flex-1">
                  {accessGranted ? (
                    <button
                      onClick={() => handleDocumentClick(doc.id)}
                      className="text-blue-600 hover:underline"
                    >
                      <FiDownload className="inline-block mr-1" size={16} />
                      {name}
                    </button>
                  ) : (
                    <span className="text-gray-400 flex items-center gap-1">
                      <FiLock size={14} />
                      {name} (Access Denied)
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {approvedDocuments.length > 3 && (
          <button
            onClick={toggleShowAll}
            className="mt-4 text-sm text-blue-600 hover:text-blue-800 flex items-center"
          >
            {showAll ? <FiChevronUp className="mr-1" /> : <FiChevronDown className="mr-1" />}
            {showAll ? "Show less" : "Show more"}
          </button>
        )}

        {!accessGranted && !requestSent && (
          <button
            onClick={requestDocumentAccess}
            disabled={loading}
            className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
          >
            {loading ? "Requesting Access..." : "Request Access to Documents"}
          </button>
        )}

        {!accessGranted && requestSent && (
          <div className="mt-6 p-3 rounded bg-green-50 text-green-700 border border-green-300 text-center">
            Access request sent. Please wait for approval.
          </div>
        )}

        {error && (
          <div className="mt-4 p-3 rounded bg-red-100 text-red-700 border border-red-300 text-center">
            {error}
          </div>
        )}
      </div>

      {isModalOpen && modalUrl && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg overflow-hidden shadow-xl w-full max-w-3xl h-[80vh] relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
            <iframe
              src={modalUrl}
              className="w-full h-full"
              title="Document Viewer"
            />
          </div>
        </div>
      )}
    </div>
  );
};



interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  screenName?: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  isSubscriber?: boolean;
  subscriptionTier?: string;
  address?: string;
  postcode?: string;
  role: string;
  createdAt: string;
  updatedAt: string;
  individualProfessional?: {
    profile?: { profilePhoto?: string };
    profileData?: any;
    documents?: { id: number; individualProfessionalId: number; status: string; uploadedAt: string; url: string }[];
    permissions?: any;
  };
  additionalData?: { profileData?: any };
  profile?: any;
  permissions?: any;
}

interface UserProfileCardProps {
  user: User;
}

const UserProfileCard = ({ user }: UserProfileCardProps) => {
  const {
    email,
    firstName,
    lastName,
    screenName,
    phoneNumber,
    dateOfBirth,
    address,
    postcode,
    role,
    isSubscriber,
    subscriptionTier,
    createdAt,
    updatedAt,
  } = user;
  const profileData =
    user?.individualProfessional?.profile ||
    user?.additionalData?.profileData ||
    user?.profile ||
    {};
    
  const basicInfo = {
    profileHeadline: profileData?.profileHeadline,
    gender: profileData?.gender,
    hourlyRate: profileData?.hourlyRate,
    location: profileData?.postcode?.split(" ")[0],
  };
  
  const aboutMe = {
    aboutMe: profileData?.aboutMe,
    experience: profileData?.experience,
    qualifications: profileData?.qualifications,
  };
  
  const fee = {
    hourlyRate: profileData?.hourlyRate,
    feesDescription: profileData?.feesDescription,
  };
  
  const contactInfo = {
    homeTelephone: profileData?.homeTelephone,
    mobilePhone: profileData?.mobileTelephone,
    website: profileData?.website,
  };
  
  const services = {
    securityServicesOfferings: profileData?.securityServicesOfferings,
    serviceRequirements: profileData?.serviceRequirements,
  };
  
  const profilePhoto = user?.profile;
  const documents = user?.individualProfessional?.documents || [];
  const currentUser = localStorage.getItem("loginData");
  const userId = currentUser ? JSON.parse(currentUser).id : null;
  const targetUserId = user.id || 38;
  
  return (
    <div className="max-w-5xl mx-auto my-10 px-6 bg-white rounded-lg shadow p-6">
      <div className="flex flex-col items-left text-left bg-white rounded-lg shadow p-6">
        <div className="flex flex-row">
          <div className="relative w-fit">
            <div
              className={`w-36 h-36 rounded-full p-1 ${
                isSubscriber
                  ? subscriptionTier === "Premium"
                    ? "bg-gradient-to-tr from-yellow-400 via-yellow-300 to-yellow-500"
                    : subscriptionTier === "Standard"
                    ? "bg-gradient-to-tr from-gray-300 via-gray-200 to-gray-400"
                    : "bg-green-500"
                  : ""
              }`}
            >
              <div className="w-32 h-32 rounded-full overflow-hidden bg-white p-[2px]">
                <img
                  src={profilePhoto || img.src}
                  alt="Profile"
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
            </div>
            <div className="flex -mt-3 flex-col items-center">
              {isSubscriber && (
                <div className="bg-white rounded-full p-1 shadow-md border border-gray-300">
                  <span className="text-green-600 text-xs font-bold">Subscriber {subscriptionTier}</span>
                </div>
              )}
              {documents && documents.length > 0 && <ProfessionalIcons />}
            </div>
          </div>
          <div className="mx-6 my-4">
            <h2 className="text-2xl font-bold text-gray-800">{firstName} {lastName}</h2>
            <p className="text-gray-600">{role}</p>
            {profileData?.basicInfo?.profileHeadline && (
              <p className="text-gray-500 text-sm mt-1">
                {profileData.basicInfo.profileHeadline}
              </p>
            )}
            <div className="flex flex-col sm:flex-row mt-6 gap-3">
              <Section
                label="Chat on Whatsapp"
                value={phoneNumber}
                onClick={() => window.open(`https://wa.me/${phoneNumber?.replace(/[^\d]/g, '')}`, "_blank")}
                clickable
                hiddenValue
                showIcon
              />
              <Section
                label="Mobile"
                value={phoneNumber}
                onClick={() => window.location.href = `tel:${phoneNumber}`}
                clickable
                hiddenValue
                showIcon
              />
              <Section
                label="Message"
                value={email}
                onClick={() => window.location.href = `mailto:${email}`}
                clickable
                hiddenValue
                showIcon
              />
            </div>
          </div>
        </div>
      </div>
      {role != "IndividualProfessional" && (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-10 mt-10 bg-white rounded-lg shadow p-6">
        <Section label="Date of Birth" value={dateOfBirth} />
        <Section label="Address" value={address} />
        {postcode && <Section label="Postcode" value={postcode} />}
        {screenName && <Section label="Screen Name" value={profileData?.screenName || screenName} />}
      </div>
      )}

      <ProfileGroup title="Basic Info" data={basicInfo} />
      <ProfileGroup title="About" data={aboutMe} />
      <ProfileGroup title="Fees" data={fee} />
      <ProfileGroup title="Contact Info" data={contactInfo} />
      <ProfileGroup title="Services" data={services} />
      {profileData?.weeklySchedule ? (
        <div className="mt-10 bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Availability</h3>
          <p className="text-sm text-gray-600 mb-2">
            {profileData.availabilityDescription || "Weekly schedule:"}
          </p>
          <AvailabilityTable schedule={profileData.weeklySchedule} />
        </div>
      ) : (
        <div className="mt-10 bg-white rounded-xl border border-gray-200 p-6 text-center text-gray-500 shadow-sm">
          No professional profile available.
        </div>
      )}
      {documents && documents.length > 0 ? (
        <DocumentsSection documents={documents} userId={userId} targetUserId={targetUserId} />
      ) : (
        <div className="mt-10 bg-white rounded-xl border border-gray-200 p-6 text-center text-gray-500 shadow-sm">
          No documents available.
        </div>
      )}
      {/* <ProfileGroup
        title="Permissions"
        data={user?.individualProfessional?.permissions || user?.permissions}
      /> */}
    </div>
  );
};

export default UserProfileCard;






// import React, { useEffect, useState } from "react";
// import img from "../../../../public/images/profile.png";
// import { FiMail, FiPhone, FiMessageSquare } from "react-icons/fi";
// import { FileText, Award, CheckCircle } from "lucide-react";
// import { FaWhatsapp } from "react-icons/fa";
// import ProfessionalIcons from "./ProfessionalIcons";
// import { FiChevronDown, FiChevronUp, FiDownload, FiSend, FiLock } from "react-icons/fi";
// import {
//   AiFillFilePdf,
//   AiFillFileImage,
//   AiFillFileWord,
//   AiFillFileExcel,
//   AiFillFilePpt,
//   AiFillFileText,
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
//   const isCallField = label === "Mobile";
//   const fieldColor = isWhatsAppField || isCallField ? "text-white" : "text-white";
//   const bgColor = isWhatsAppField
//     ? "bg-green-500 hover:bg-green-600"
//     : isCallField
//     ? "bg-indigo-500 hover:bg-indigo-600"
//     : "bg-blue-500 hover:bg-blue-600";
//   const displayValue = hiddenValue ? "" : formatValue(value);
//   return (
//     <div
//       className={`group flex items-start gap-3 ${
//         clickable ? `cursor-pointer ${bgColor}` : ""
//       } p-3 rounded-lg transition-all`}
//       onClick={onClick}    >
//       {showIcon && (
//         <div className={`${fieldColor} mt-0.5`}>
//           {isWhatsAppField ? (
//             <FaWhatsapp size={18} style={{ color: "#fff" }} />
//           ) : isCallField ? (
//             <FiPhone size={18} style={{ color: "#fff" }} />
//           ) : (
//             <FiMail size={18} style={{ color: "#fff" }} />
//           )}
//         </div>
//       )}
//       <div>
//         <p
//           className={`text-sm font-medium uppercase tracking-wider ${
//             isWhatsAppField || label === "Message" || isCallField
//               ? "text-white"
//               : "text-gray-500"
//           }`}
//         >
//           {label}
//         </p>
// <p
//   className={`text-base font-medium ${
//     clickable ? fieldColor : "text-gray-800"
//   } break-words whitespace-pre-wrap`}
// >
//   {displayValue
//     .split(" ")
//     .map((word) => (word.length > 15 ? word.slice(0, 15) + "..." : word))
//     .join(" ")}
// </p>

//       </div>
//     </div>
//   );
// };
// const ProfileGroup = ({ title, data }: { title: string; data: any }) => {
//   const validEntries = Object.entries(data || {}).filter(
//     ([, val]) =>
//       val !== null &&
//     val !== "" &&
//       val !== undefined &&
//       (typeof val !== "object" || (Array.isArray(val) ? val.length > 0 : Object.keys(val).length > 0))
//   );
//   if (validEntries.length === 0) return null;
//   return (
//     <div className="mt-8 bg-gray-50 rounded-xl border p-6 shadow-sm">
//       <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">{title}</h3>
//       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//         {validEntries.map(([key, val]) =>
//           typeof val === "object" && !Array.isArray(val) && val !== null ? (
//             <ProfileGroup key={key} title={formatKey(key)} data={val} />
//           ) : (
//             <Section
//               key={key}
//               label={formatKey(key)}
//               value={Array.isArray(val) ? val.join(", ") : val?.toString()}
//             />
//           )
//         )}
//       </div>
//     </div>
//   );
// };
// const formatKey = (key: string) =>
//   key
//     .replace(/([A-Z])/g, " $1")
//     .replace(/^./, (str) => str.toUpperCase())
//     .replace(/_/g, " ");
// const AvailabilityTable = ({ schedule }: { schedule: any }) => {
//   const timeSlots = ["Morning", "Afternoon", "Evening", "Overnight"];
//   const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
//   return (
//     <div className="overflow-auto mt-4 rounded-lg border border-gray-200">
//       <table className="min-w-full text-sm text-center">
//         <thead className="bg-gray-100 text-gray-700 font-medium">
//           <tr>
//             <th className="px-4 py-2 text-left">Time Slot</th>
//             {days.map((day) => (
//               <th key={day} className="px-3 py-2">{day}</th>
//             ))}
//           </tr>
//         </thead>
//         <tbody>
//           {timeSlots.map((slot) => (
//             <tr key={slot} className="border-t">
//               <td className="px-4 py-2 text-left font-medium text-gray-700">{slot}</td>
//               {days.map((day) => (
//                 <td
//                   key={day}
//                   className={`px-3 py-2 ${
//                     schedule?.[slot]?.[day]
//                       ? "bg-green-100 text-green-700"
//                       : "text-gray-400"
//                   }`}
//                 >
//                   {schedule?.[slot]?.[day] ? "✓" : "—"}
//                 </td>
//               ))}
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };
// const getFileIcon = (filename?: string) => {
//   if (!filename || typeof filename !== "string") return <AiFillFileText className="text-gray-400" size={28} />;
//   const ext = filename.split(".").pop()?.toLowerCase();
//   if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext!)) return <AiFillFileImage className="text-pink-500" size={28} />;
//   if (["pdf"].includes(ext!)) return <AiFillFilePdf className="text-red-500" size={28} />;
//   if (["doc", "docx"].includes(ext!)) return <AiFillFileWord className="text-blue-500" size={28} />;
//   if (["xls", "xlsx"].includes(ext!)) return <AiFillFileExcel className="text-green-600" size={28} />;
//   if (["ppt", "pptx"].includes(ext!)) return <AiFillFilePpt className="text-orange-500" size={28} />;
//   return <AiFillFileText className="text-gray-400" size={28} />;
// };
// const getDocumentNameFromUrl = (url: string) => {
//   if (typeof url !== "string") return "Unnamed Document";
//   const parts = url.split("/");
//   const fileNameWithExt = decodeURIComponent(parts.pop() || "Unnamed Document");
//   const namePart = fileNameWithExt.split("-").slice(1).join("-").split(".").slice(0, -1).join(".");
//   return namePart || "Unnamed Document";
// };
// const DocumentsSection = ({
//   documents,
//   userId,
//   targetUserId,
// }: {
//   documents: { id: number; individualProfessionalId: number; status: string; uploadedAt: string; url: string }[];
//   userId: string | number;
//   targetUserId: number;
// }) => {
//   const [visibleCount, setVisibleCount] = useState(3);
//   const [showAll, setShowAll] = useState(false);
//   const [accessGranted, setAccessGranted] = useState(false);
//   const [requestSent, setRequestSent] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [isEditing, setIsEditing] = useState(false);
//   const requesterId = typeof userId === "string" ? parseInt(userId, 10) : userId;
//   const approvedDocuments = documents.filter((doc) => doc.status === "APPROVED");
//   const displayedDocuments = approvedDocuments.slice(0, visibleCount);
//   const toggleShowAll = () => {
//     setShowAll(!showAll);
//     setVisibleCount(showAll ? 3 : approvedDocuments.length);
//   };
//   const checkDocumentAccess = async () => {
//     try {
//       const response = await fetch(
//         `https://ub1b171tga.execute-api.eu-north-1.amazonaws.com/dev/document/access-check?requesterId=${requesterId}&targetUserId=${targetUserId}`
//       );
//       if (response.ok) {
//         const result = await response.json();
//         console.log("API result:", result); // Logs: { hasAccess: true/false }
//         setAccessGranted(result.hasAccess); // Updates state
//       } else {
//         console.warn("Access check failed: response not OK");
//         setAccessGranted(false);
//       }
//     } catch (error) {
//       console.error("Access check failed:", error);
//       setAccessGranted(false);
//     }
//   };
//   const requestDocumentAccess = async () => {
//     setLoading(true);
//     setError(null);
//     setRequestSent(false);
//     if (isNaN(requesterId)) {
//       setError("Invalid user ID. Please ensure your user ID is a valid number.");
//       setLoading(false);
//       return;
//     }
//     try {
//       const response = await fetch(
//         "https://ub1b171tga.execute-api.eu-north-1.amazonaws.com/dev/document/request",
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ requesterId, targetUserId }),
//         }
//       );
//       if (response.ok) {
//         setRequestSent(true);
//         setTimeout(() => setRequestSent(false), 3000);
//       } else {
//         const errorData = await response.json();
//         setError(errorData.message || "Failed to request access. Please try again.");
//       }
//     } catch (error) {
//       setError("Network error. Please check your connection and try again.");
//       console.error("Error requesting document access:", error);
//     } finally {
//       setLoading(false);
//     }
//   };
//   useEffect(() => {
//     checkDocumentAccess();
//   }, [userId, targetUserId]);
//   if (!approvedDocuments || approvedDocuments.length === 0)
//     return (
//       <div className="mt-10 bg-white rounded-xl border border-gray-200 p-6 text-center text-gray-500 shadow-sm">
//         No Documents Approved.
//       </div>
//     );
//   return (
//     <div className="mt-10 bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
//       <div className="p-6">
//         <div className="flex items-center justify-between w-full px-4 mb-3">
//           <h3 className="text-xl font-semibold text-gray-800">My Documents</h3>
//           <div className="flex items-center gap-4">
//             <div className="flex items-center text-sm text-gray-500">
//               <FiLock className="mr-1.5" size={14} />
//               <span>Secure Documents</span>
//             </div>
//             {/* {!isEditing && (
//               <button
//                 onClick={() => setIsEditing(true)}
//                 className="text-sm px-3 py-1 bg-black text-white rounded hover:bg-gray-800 transition ml-auto"
//               >
//                 Edit
//               </button>
//             )} */}
//           </div>
//         </div>
//         <p className="text-sm text-gray-600 mb-6">
//           This member has provided us with electronic copies of the following documents. These copies are held on file unless specified as deleted. The documents have been certified by the member as being true and accurate. We recommend you ask to see original copies of the documents before you hire them in order to verify the true accuracy for yourself.
//         </p>
//         <div className="space-y-3">
//           {displayedDocuments.map((doc, index) => {
//             const documentName = getDocumentNameFromUrl(doc.url);
//             return (
//               <div
//                 key={index}
//                 className="flex items-start p-3 hover:bg-gray-50 rounded-lg transition-colors border border-gray-100"
//               >
//                 <div className="flex items-center">{getFileIcon(documentName)}</div>
//                 <div className="ml-3 flex-1">
//                   <div className="flex justify-between items-center">
//                     <div className="flex items-center gap-1">
//                       <span className="font-medium text-gray-800">
//                         {accessGranted ? (
//                           <a
//                             href={doc.url}
//                             target="_blank"
//                             rel="noopener noreferrer"
//                             className="flex items-center gap-1 hover:text-blue-600"
//                           >
//                             <FiDownload size={14} />
//                             {documentName}
//                           </a>
//                         ) : (
//                           <span className="flex items-center gap-1 text-gray-400">
//                             <FiLock size={14} />
//                             {documentName} (Access Denied)
//                           </span>
//                         )}
//                       </span>
//                       <span className="text-xs text-gray-500 ml-2">
//                         added on {new Date(doc.uploadedAt).toLocaleDateString()}
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//         {approvedDocuments.length > 3 && (
//           <button
//             onClick={toggleShowAll}
//             className="mt-4 text-sm text-blue-600 hover:text-blue-800 flex items-center"
//           >
//             {showAll ? (
//               <>
//                 <FiChevronUp className="mr-1.5" />
//                 Show less
//               </>
//             ) : (
//               <>
//                 <FiChevronDown className="mr-1.5" />
//                 Show more
//               </>
//             )}
//           </button>
//         )}
//       </div>
//       <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
//         <button
//           onClick={requestDocumentAccess}
//           className="w-full sm:w-auto px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center justify-center space-x-2 shadow-sm disabled:opacity-50"
//           disabled={loading || requestSent}
//         >
//           {loading ? (
//             <svg
//               className="animate-spin h-5 w-5 text-white mr-2"
//               xmlns="http://www.w3.org/2000/svg"
//               fill="none"
//               viewBox="0 0 24 24"
//             >
//               <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
//               <path
//                 className="opacity-75"
//                 fill="currentColor"
//                 d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//               />
//             </svg>
//           ) : (
//             <FiLock className="text-blue-100" size={16} />
//           )}
//           <span>{loading ? "Requesting..." : "Request Access for All Documents"}</span>
//         </button>
//         {requestSent && <div className="mt-2 text-green-600 text-sm">Your request is delivered</div>}
//         {error && <div className="mt-2 text-red-600 text-sm">{error}</div>}
//       </div>
//     </div>
//   );
// };
// interface User {
//   id: number;
//   email: string;
//   firstName: string;
//   lastName: string;
//   screenName?: string;
//   phoneNumber?: string;
//   dateOfBirth?: string;
//   isSubscriber?: boolean;
//   subscriptionTier?: string;
//   address?: string;
//   postcode?: string;
//   role: string;
//   createdAt: string;
//   updatedAt: string;
//   individualProfessional?: {
//     profile?: { profilePhoto?: string };
//     profileData?: any;
//     documents?: { id: number; individualProfessionalId: number; status: string; uploadedAt: string; url: string }[]; // Updated to object array
//     permissions?: any;
//   };
//   additionalData?: { profileData?: any };
//   profile?: any;
//   permissions?: any;
// }
// interface UserProfileCardProps {
//   user: User;
// }
// const UserProfileCard = ({ user }: UserProfileCardProps) => {
//   const {
//     email,
//     firstName,
//     lastName,
//     screenName,
//     phoneNumber,
//     dateOfBirth,
//     address,
//     postcode,
//     role,
//     isSubscriber,
//     subscriptionTier,
//     createdAt,
//     updatedAt,
//   } = user;
//   const profileData =
//     user?.individualProfessional?.profile ||
//     user?.additionalData?.profileData ||
//     user?.profile ||
//     {};
//     const basicInfo = {
//       profileHeadline : profileData?.profileHeadline,
//       gender : profileData?.gender,
//       hourlyRate : profileData?.hourlyRate,
//       location : profileData?.postcode,
//     }
//     const aboutMe ={
//       aboutMe : profileData?.aboutMe,
//       experience : profileData?.experience,
//       qualifications : profileData?.qualifications,
//     }
//     const fee={
//       hourlyRate : profileData?.hourlyRate,
//       feesDescription : profileData?.feesDescription,
//     }
//     const contactInfo = {
//       homeTelephone : profileData?.homeTelephone,
//       mobilePhone : profileData?.mobileTelephone,
//     website : profileData?.website,
//     }
//   const services = {
// securityServicesOfferings: profileData?.securityServicesOfferings,
// serviceRequirements : profileData?.serviceRequirements,
//     }
//   const profilePhoto = user?.individualProfessional?.profile?.profilePhoto;
//   const documents = user?.individualProfessional?.documents || [];
//   const currentUser = localStorage.getItem("loginData");
//   const userId = currentUser ? JSON.parse(currentUser).id : null;
//   const targetUserId = user.id || 38;
//   return (
//     <div className="max-w-5xl mx-auto my-10 px-6 bg-white rounded-lg shadow p-6">
//       <div className="flex flex-col items-left text-left bg-white rounded-lg shadow p-6">
//         <div className="flex flex-row">
//      <div className="relative w-fit">
//   <div
//     className={`w-36 h-36 rounded-full p-1 ${
//       isSubscriber
//         ? subscriptionTier === "Premium"
//           ? "bg-gradient-to-tr from-yellow-400 via-yellow-300 to-yellow-500"
//           : subscriptionTier === "Standard"
//           ? "bg-gradient-to-tr from-gray-300 via-gray-200 to-gray-400"
//           : "bg-green-500"
//         : ""
//     }`}
//   >
//     <div className="w-32 h-32 rounded-full overflow-hidden bg-white p-[2px]">
//       <img
//         src={profilePhoto || img.src}
//         alt="Profile"
//         className="w-full h-full rounded-full object-cover"
//       />
//     </div>
//   </div>
//   <div>
    
//   </div>
//   <div className="flex -mt-3 flex-col items-center ">
//   {isSubscriber && (
//     <div className="bg-white rounded-full p-1 shadow-md border border-gray-300">
//       <span className="text-green-600 text-xs font-bold">Subscriber {subscriptionTier}</span>
//     </div>
//   )}
//   {documents && documents.length > 0 && <ProfessionalIcons />}
// </div>
//   {/* <div className="gap-5">
//   {isSubscriber && (
//     <div className="absolute bottom-0 right-0 bg-white rounded-full p-1 shadow-md border border-gray-300">
//       <span className="text-green-600 text-xs font-bold">Subscriber {subscriptionTier}</span>
//     </div>
//   )}
//   {documents && documents.length > 0 && <ProfessionalIcons />}
//   </div> */}
// </div>
//           <div className="mx-6 my-4">
//             <h2 className="text-2xl font-bold text-gray-800">{firstName} {lastName}</h2>
//             <p className="text-gray-600">{role}</p>
//             {profileData?.basicInfo?.profileHeadline && (
//               <p className="text-gray-500 text-sm mt-1">
//                 {profileData.basicInfo.profileHeadline}
//               </p>
//             )}
//             <div className="flex flex-col sm:flex-row mt-6 gap-3">
//               <Section
//                 label="Chat on Whatsapp"
//                 value={phoneNumber}
//                 onClick={() => window.open(`https://wa.me/${phoneNumber?.replace(/[^\d]/g, '')}`, "_blank")}
//                 clickable
//                 hiddenValue
//                 showIcon
//               />
//               <Section
//                 label="Mobile"
//                 value={phoneNumber}
//                 onClick={() => window.location.href = `tel:${phoneNumber}`}
//                 clickable
//                 hiddenValue
//                 showIcon
//               />
//               <Section
//                 label="Message"
//                 value={email}
//                 onClick={() => window.location.href = `mailto:${email}`}
//                 clickable
//                 hiddenValue
//                 showIcon
//               />
//             </div>
//           </div>
//         </div>
//       </div>
//       <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-10 mt-10 bg-white rounded-lg shadow p-6">
//         <Section label="Date of Birth" value={dateOfBirth} />
//         <Section label="Address" value={address} />
//       {postcode &&  <Section label="Postcode" value={postcode} />}
//        {screenName && <Section label="Screen Name" value={profileData?.screenName ||screenName} />}
//         {/* <Section label="Account Created" value={new Date(createdAt).toLocaleString()} />
//         <Section label="Last Updated" value={new Date(updatedAt).toLocaleString()} /> */}
//       </div>
//       <ProfileGroup title="Basic Info" data={basicInfo} />
//       <ProfileGroup title="About" data={aboutMe} />
//       <ProfileGroup title="Fees" data={fee} />
//       <ProfileGroup title="Contact Info" data={contactInfo} />
//       <ProfileGroup title="Services" data={services} />
//       {profileData?.weeklySchedule ? (
//         <div className="mt-10 bg-white rounded-lg shadow p-6">
//           <h3 className="text-lg font-semibold text-gray-800 mb-2">Availability</h3>
//           <p className="text-sm text-gray-600 mb-2">
//             {profileData.availabilityDescription || "Weekly schedule:"}
//           </p>
//           <AvailabilityTable schedule={profileData.weeklySchedule} />
//         </div>
//       ) : (
//         <div className="mt-10 bg-white rounded-xl border border-gray-200 p-6 text-center text-gray-500 shadow-sm">
//           No professional profile available.
//         </div>
//       )}
//       {documents && documents.length > 0 ? (
//         <DocumentsSection documents={documents} userId={userId} targetUserId={targetUserId} />
//       ) : (
//         <div className="mt-10 bg-white rounded-xl border border-gray-200 p-6 text-center text-gray-500 shadow-sm">
//           No documents available.
//         </div>
//       )}
//       <ProfileGroup
//         title="Permissions"
//         data={user?.individualProfessional?.permissions || user?.permissions}
//       />
//     </div>
//   );
// };
// export default UserProfileCard;








// const DocumentsSection = ({
//   documents,
//   userId,
//   targetUserId,
// }: {
//   documents: { id: number; individualProfessionalId: number; status: string; uploadedAt: string; url: string }[];
//   userId: string | number;
//   targetUserId: number;
// }) => {
//   const [visibleCount, setVisibleCount] = useState(3);
//   const [showAll, setShowAll] = useState(false);
//   const [accessGranted, setAccessGranted] = useState(false);
//   const [requestSent, setRequestSent] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [isEditing, setIsEditing] = useState(false);

//   const toggleShowAll = () => {
//     setShowAll(!showAll);
//     setVisibleCount(showAll ? 3 : approvedDocuments.length);
//   };

//   const approvedDocuments = documents.filter((doc) => doc.status === "APPROVED");

//   const displayedDocuments = approvedDocuments.slice(0, visibleCount);

//   const requestDocumentAccess = async () => {
//     setLoading(true);
//     setError(null);
//     setRequestSent(false);

//     const requesterId = typeof userId === "string" ? parseInt(userId, 10) : userId;

//     if (isNaN(requesterId)) {
//       setError("Invalid user ID. Please ensure your user ID is a valid number.");
//       setLoading(false);
//       return;
//     }

//     try {
//       const response = await fetch(
//         "https://ub1b171tga.execute-api.eu-north-1.amazonaws.com/dev/document/request",
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             requesterId,
//             targetUserId,
//           }),
//         }
//       );

//       if (response.ok) {
//         setRequestSent(true);
//         setTimeout(() => setRequestSent(false), 3000);
//       } else {
//         const errorData = await response.json();
//         setError(errorData.message || "Failed to request access. Please try again.");
//       }
//     } catch (error) {
//       setError("Network error. Please check your connection and try again.");
//       console.error("Error requesting document access:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (!approvedDocuments || approvedDocuments.length === 0) return  <div className="mt-10 bg-white rounded-xl border border-gray-200 p-6 text-center text-gray-500 shadow-sm">
//           No Documents Approved.
//         </div>;

//   return (
//     <div className="mt-10 bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
//       <div className="p-6">
//         <div className="flex items-center justify-between w-full px-4 mb-3">
//           <h3 className="text-xl font-semibold text-gray-800">My Documents</h3>
//           <div className="flex items-center gap-4">
//             <div className="flex items-center text-sm text-gray-500">
//               <FiLock className="mr-1.5" size={14} />
//               <span>Secure Documents</span>
//             </div>
//             {!isEditing && (
//               <button
//                 onClick={() => setIsEditing(true)}
//                 className="text-sm px-3 py-1 bg-black text-white rounded hover:bg-gray-800 transition ml-auto"
//               >
//                 Edit
//               </button>
//             )}
//           </div>
//         </div>

//         <p className="text-sm text-gray-600 mb-6">
//           This member has provided us with electronic copies of the following documents. These copies are held on file unless specified as deleted. The documents have been certified by the member as being true and accurate. We recommend you ask to see original copies of the documents before you hire them in order to verify the true accuracy for yourself.
//         </p>

//         <div className="space-y-3">
//           {displayedDocuments.map((doc, index) => {
//             const documentName = getDocumentNameFromUrl(doc.url);
//             return (
//               <div
//                 key={index}
//                 className="flex items-start p-3 hover:bg-gray-50 rounded-lg transition-colors border border-gray-100"
//               >
//                 <div className="flex items-center">{getFileIcon(documentName)}</div>
//                 <div className="ml-3 flex-1">
//                   <div className="flex justify-between items-center">
//                     <div className="flex items-center gap-1">
//                       <span className="font-medium text-gray-800">
//                         {accessGranted ? (
//                           <a
//                             href={doc.url}
//                             target="_blank"
//                             rel="noopener noreferrer"
//                             className="flex items-center gap-1 hover:text-blue-600"
//                           >
//                             <FiDownload size={14} />
//                             {documentName}
//                           </a>
//                         ) : (
//                           <span className="flex items-center gap-1 text-gray-400">
//                             <FiLock size={14} />
//                             {documentName} (Access Denied)
//                           </span>
//                         )}
//                       </span>
//                       <span className="text-xs text-gray-500 ml-2">
//                         added on {new Date(doc.uploadedAt).toLocaleDateString()}
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             );
//           })}
//         </div>

//         {approvedDocuments.length > 3 && (
//           <button
//             onClick={toggleShowAll}
//             className="mt-4 text-sm text-blue-600 hover:text-blue-800 flex items-center"
//           >
//             {showAll ? (
//               <>
//                 <FiChevronUp className="mr-1.5" />
//                 Show less
//               </>
//             ) : (
//               <>
//                 <FiChevronDown className="mr-1.5" />
//                 Show more
//               </>
//             )}
//           </button>
//         )}
//       </div>

//       <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
//         <button
//           onClick={requestDocumentAccess}
//           className="w-full sm:w-auto px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center justify-center space-x-2 shadow-sm disabled:opacity-50"
//           disabled={loading || requestSent}
//         >
//           {loading ? (
//             <svg
//               className="animate-spin h-5 w-5 text-white mr-2"
//               xmlns="http://www.w3.org/2000/svg"
//               fill="none"
//               viewBox="0 0 24 24"
//             >
//               <circle
//                 className="opacity-25"
//                 cx="12"
//                 cy="12"
//                 r="10"
//                 stroke="currentColor"
//                 strokeWidth="4"
//               />
//               <path
//                 className="opacity-75"
//                 fill="currentColor"
//                 d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//               />
//             </svg>
//           ) : (
//             <FiLock className="text-blue-100" size={16} />
//           )}
//           <span>
//             {loading ? "Requesting..." : "Request Access for All Documents"}
//           </span>
//         </button>
//         {requestSent && (
//           <div className="mt-2 text-green-600 text-sm">
//             Your request is delivered
//           </div>
//         )}
//         {error && (
//           <div className="mt-2 text-red-600 text-sm">
//             {error}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };



// import React, { useState } from "react";
// import img from "../../../../public/images/profile.png";
// import { FiMail, FiPhone, FiMessageSquare } from "react-icons/fi";
// import { FileText, Award, CheckCircle } from "lucide-react";
// import { FaWhatsapp } from "react-icons/fa";
// import ProfessionalIcons from "./ProfessionalIcons";
// import { FiChevronDown, FiChevronUp, FiDownload, FiSend, FiLock } from "react-icons/fi";
// import {
//   AiFillFilePdf,
//   AiFillFileImage,
//   AiFillFileWord,
//   AiFillFileExcel,
//   AiFillFilePpt,
//   AiFillFileText,
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
//   const isCallField = label === "Mobile";
//   const fieldColor = isWhatsAppField || isCallField ? "text-white" : "text-white";
//   const bgColor = isWhatsAppField
//     ? "bg-green-500 hover:bg-green-600"
//     : isCallField
//     ? "bg-indigo-500 hover:bg-indigo-600"
//     : "bg-blue-500 hover:bg-blue-600";

//   const displayValue = hiddenValue ? "" : formatValue(value);

//   return (
//     <div
//       className={`group flex items-start gap-3 ${
//         clickable ? `cursor-pointer ${bgColor}` : ""
//       } p-3 rounded-lg transition-all`}
//       onClick={onClick}
//     >
//       {showIcon && (
//         <div className={`${fieldColor} mt-0.5`}>
//           {isWhatsAppField ? (
//             <FaWhatsapp size={18} style={{ color: "#fff" }} />
//           ) : isCallField ? (
//             <FiPhone size={18} style={{ color: "#fff" }} />
//           ) : (
//             <FiMail size={18} style={{ color: "#fff" }} />
//           )}
//         </div>
//       )}
//       <div>
//         <p
//           className={`text-sm font-medium uppercase tracking-wider ${
//             isWhatsAppField || label === "Message" || isCallField
//               ? "text-white"
//               : "text-gray-500"
//           }`}
//         >
//           {label}
//         </p>
//         <p
//           className={`text-base font-medium ${
//             clickable ? fieldColor : "text-gray-800"
//           } break-words`}
//         >
//           {displayValue}
//         </p>
//       </div>
//     </div>
//   );
// };

// const ProfileGroup = ({ title, data }: { title: string; data: any }) => {
//   if (!data || Object.keys(data).length === 0) return null;
//   return (
//     <div className="mt-8 bg-gray-50 rounded-xl border p-6 shadow-sm">
//       <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">{title}</h3>
//       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//         {Object.entries(data).map(([key, val]) =>
//           typeof val === "object" && !Array.isArray(val) ? (
//             <ProfileGroup key={key} title={formatKey(key)} data={val} />
//           ) : (
//             <Section
//               key={key}
//               label={formatKey(key)}
//               value={Array.isArray(val) ? val : val?.toString()}
//             />
//           )
//         )}
//       </div>
//     </div>
//   );
// };

// const formatKey = (key: string) =>
//   key
//     .replace(/([A-Z])/g, " $1")
//     .replace(/^./, (str) => str.toUpperCase())
//     .replace(/_/g, " ");

// const AvailabilityTable = ({ schedule }: { schedule: any }) => {
//   const timeSlots = ["Morning", "Afternoon", "Evening", "Overnight"];
//   const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

//   return (
//     <div className="overflow-auto mt-4 rounded-lg border border-gray-200">
//       <table className="min-w-full text-sm text-center">
//         <thead className="bg-gray-100 text-gray-700 font-medium">
//           <tr>
//             <th className="px-4 py-2 text-left">Time Slot</th>
//             {days.map((day) => (
//               <th key={day} className="px-3 py-2">{day}</th>
//             ))}
//           </tr>
//         </thead>
//         <tbody>
//           {timeSlots.map((slot) => (
//             <tr key={slot} className="border-t">
//               <td className="px-4 py-2 text-left font-medium text-gray-700">{slot}</td>
//               {days.map((day) => (
//                 <td
//                   key={day}
//                   className={`px-3 py-2 ${
//                     schedule?.[slot]?.[day]
//                       ? "bg-green-100 text-green-700"
//                       : "text-gray-400"
//                   }`}
//                 >
//                   {schedule?.[slot]?.[day] ? "✓" : "—"}
//                 </td>
//               ))}
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// const getFileIcon = (filename?: string) => {
//   if (!filename || typeof filename !== "string") return <AiFillFileText className="text-gray-400" size={28} />;
//   const ext = filename.split(".").pop()?.toLowerCase();
//   if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext!)) return <AiFillFileImage className="text-pink-500" size={28} />;
//   if (["pdf"].includes(ext!)) return <AiFillFilePdf className="text-red-500" size={28} />;
//   if (["doc", "docx"].includes(ext!)) return <AiFillFileWord className="text-blue-500" size={28} />;
//   if (["xls", "xlsx"].includes(ext!)) return <AiFillFileExcel className="text-green-600" size={28} />;
//   if (["ppt", "pptx"].includes(ext!)) return <AiFillFilePpt className="text-orange-500" size={28} />;
//   return <AiFillFileText className="text-gray-400" size={28} />;
// };

// const getDocumentNameFromUrl = (url: string) => {
//   if (typeof url !== "string") return "Unnamed Document";
//   const parts = url.split("/");
//   const fileNameWithExt = decodeURIComponent(parts.pop() || "Unnamed Document");
//   const namePart = fileNameWithExt.split("-").slice(1).join("-").split(".").slice(0, -1).join(".");
//   return namePart || "Unnamed Document";
// };

// const DocumentsSection = ({
//   documents,
//   userId,
//   targetUserId,
// }: {
//   documents: { id: number; individualProfessionalId: number; status: string; uploadedAt: string; url: string }[];
//   userId: string | number;
//   targetUserId: number;
// }) => {
//   const [visibleCount, setVisibleCount] = useState(3);
//   const [showAll, setShowAll] = useState(false);
//   const [accessGranted, setAccessGranted] = useState(false);
//   const [requestSent, setRequestSent] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [isEditing, setIsEditing] = useState(false); // Added for Edit button functionality

//   const toggleShowAll = () => {
//     setShowAll(!showAll);
//     setVisibleCount(showAll ? 3 : approvedDocuments.length);
//   };

//   // Filter documents to show only those with status "APPROVED"
//   const approvedDocuments = documents.filter((doc) => doc.status === "APPROVED");

//   const displayedDocuments = approvedDocuments.slice(0, visibleCount);

//   const requestDocumentAccess = async () => {
//     setLoading(true);
//     setError(null);
//     setRequestSent(false);

//     const requesterId = typeof userId === "string" ? parseInt(userId, 10) : userId;

//     if (isNaN(requesterId)) {
//       setError("Invalid user ID. Please ensure your user ID is a valid number.");
//       setLoading(false);
//       return;
//     }

//     try {
//       const response = await fetch(
//         "https://ub1b171tga.execute-api.eu-north-1.amazonaws.com/dev/document/request",
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             requesterId,
//             targetUserId,
//           }),
//         }
//       );

//       if (response.ok) {
//         setRequestSent(true);
//         setTimeout(() => setRequestSent(false), 3000);
//       } else {
//         const errorData = await response.json();
//         setError(errorData.message || "Failed to request access. Please try again.");
//       }
//     } catch (error) {
//       setError("Network error. Please check your connection and try again.");
//       console.error("Error requesting document access:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (!approvedDocuments || approvedDocuments.length === 0) return null;

//   return (
//     <div className="mt-10 bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
//       <div className="p-6">
//         <div className="flex items-center justify-between w-full px-4 mb-3">
//           <h3 className="text-xl font-semibold text-gray-800">My Documents</h3>
//           <div className="flex items-center gap-4">
//             <div className="flex items-center text-sm text-gray-500">
//               <FiLock className="mr-1.5" size={14} />
//               <span>Secure Documents</span>
//             </div>
//             {!isEditing && (
//               <button
//                 onClick={() => setIsEditing(true)}
//                 className="text-sm px-3 py-1 bg-black text-white rounded hover:bg-gray-800 transition ml-auto"
//               >
//                 Edit
//               </button>
//             )}
//           </div>
//         </div>

//         <p className="text-sm text-gray-600 mb-6">
//           This member has provided us with electronic copies of the following documents. These copies are held on file unless specified as deleted. The documents have been certified by the member as being true and accurate. We recommend you ask to see original copies of the documents before you hire them in order to verify the true accuracy for yourself.
//         </p>

//         <div className="space-y-3">
//           {displayedDocuments.map((doc, index) => {
//             const documentName = getDocumentNameFromUrl(doc.url);
//             return (
//               <div
//                 key={index}
//                 className="flex items-start p-3 hover:bg-gray-50 rounded-lg transition-colors border border-gray-100"
//               >
//                 <div className="flex items-center">{getFileIcon(documentName)}</div>
//                 <div className="ml-3 flex-1">
//                   <div className="flex justify-between items-center">
//                     <div className="flex items-center gap-1">
//                       <span className="font-medium text-gray-800">
//                         {accessGranted ? (
//                           <a
//                             href={doc.url}
//                             target="_blank"
//                             rel="noopener noreferrer"
//                             className="flex items-center gap-1 hover:text-blue-600"
//                           >
//                             <FiDownload size={14} />
//                             {documentName}
//                           </a>
//                         ) : (
//                           <span className="flex items-center gap-1 text-gray-400">
//                             <FiLock size={14} />
//                             {documentName} (Access Denied)
//                           </span>
//                         )}
//                       </span>
//                       <span className="text-xs text-gray-500 ml-2">
//                         added on {new Date(doc.uploadedAt).toLocaleDateString()}
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             );
//           })}
//         </div>

//         {approvedDocuments.length > 3 && (
//           <button
//             onClick={toggleShowAll}
//             className="mt-4 text-sm text-blue-600 hover:text-blue-800 flex items-center"
//           >
//             {showAll ? (
//               <>
//                 <FiChevronUp className="mr-1.5" />
//                 Show less
//               </>
//             ) : (
//               <>
//                 <FiChevronDown className="mr-1.5" />
//                 Show more
//               </>
//             )}
//           </button>
//         )}
//       </div>

//       <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
//         <button
//           onClick={requestDocumentAccess}
//           className="w-full sm:w-auto px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center justify-center space-x-2 shadow-sm disabled:opacity-50"
//           disabled={loading || requestSent}
//         >
//           {loading ? (
//             <svg
//               className="animate-spin h-5 w-5 text-white mr-2"
//               xmlns="http://www.w3.org/2000/svg"
//               fill="none"
//               viewBox="0 0 24 24"
//             >
//               <circle
//                 className="opacity-25"
//                 cx="12"
//                 cy="12"
//                 r="10"
//                 stroke="currentColor"
//                 strokeWidth="4"
//               />
//               <path
//                 className="opacity-75"
//                 fill="currentColor"
//                 d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//               />
//             </svg>
//           ) : (
//             <FiLock className="text-blue-100" size={16} />
//           )}
//           <span>
//             {loading ? "Requesting..." : "Request Access for All Documents"}
//           </span>
//         </button>
//         {requestSent && (
//           <div className="mt-2 text-green-600 text-sm">
//             Your request is delivered
//           </div>
//         )}
//         {error && (
//           <div className="mt-2 text-red-600 text-sm">
//             {error}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };
// // const DocumentsSection = ({
// //   documents,
// //   userId,
// //   targetUserId,
// // }: {
// //   documents: string[];
// //   userId: string | number;
// //   targetUserId: number;
// // }) => {

// //   const [visibleCount, setVisibleCount] = useState(3);
// //   const [showAll, setShowAll] = useState(false);
// //   const [accessGranted, setAccessGranted] = useState(false);
// //   const [requestSent, setRequestSent] = useState(false);
// //   const [loading, setLoading] = useState(false);
// //   const [error, setError] = useState<string | null>(null);

// //   const toggleShowAll = () => {
// //     setShowAll(!showAll);
// //     setVisibleCount(showAll ? 3 : documents.length);
// //   };

// //   const displayedDocuments = documents.slice(0, visibleCount);

// //   const requestDocumentAccess = async () => {
// //     setLoading(true);
// //     setError(null);
// //     setRequestSent(false);

// //     // Convert userId to an integer
// //     const requesterId = typeof userId === "string" ? parseInt(userId, 10) : userId;

// //     // Validate that requesterId is a valid integer
// //     if (isNaN(requesterId)) {
// //       setError("Invalid user ID. Please ensure your user ID is a valid number.");
// //       setLoading(false);
// //       return;
// //     }

// //     try {
// //       const response = await fetch("https://ub1b171tga.execute-api.eu-north-1.amazonaws.com/dev/document/request", {
// //         method: "POST",
// //         headers: { "Content-Type": "application/json" },
// //         body: JSON.stringify({
// //           requesterId, // Now an integer
// //           targetUserId,
// //           // documentUrls: documents,
// //         }),
// //       });

// //       if (response.ok) {
// //         setRequestSent(true);
// //         setTimeout(() => setRequestSent(false), 3000); // Hide success message after 3 seconds
// //       } else {
// //         const errorData = await response.json();
// //         setError(errorData.message || "Failed to request access. Please try again.");
// //       }
// //     } catch (error) {
// //       setError("Network error. Please check your connection and try again.");
// //       console.error("Error requesting document access:", error);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   if (!documents || documents.length === 0) return null;

// //   return (
// //     <div className="mt-10 bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
// //       <div className="p-6">
// //         <div className="flex items-center justify-between mb-3">
// //           <h3 className="text-xl font-semibold text-gray-800">My Documents</h3>
// //           <div className="flex items-center text-sm text-gray-500">
// //             <FiLock className="mr-1.5" size={14} />
// //             <span>Secure Documents</span>
// //           </div>
// //         </div>

// //         <p className="text-sm text-gray-600 mb-6">
// //           This member has provided us with electronic copies of the following documents. These copies are held on file unless specified as deleted. The documents have been certified by the member as being true and accurate. We recommend you ask to see original copies of the documents before you hire them in order verify the true accuracy for yourself.
// //         </p>

// //         <div className="space-y-3">
// //           {displayedDocuments.map((url, index) => {
// //             const documentName = getDocumentNameFromUrl(url);
// //             return (
// //               <div
// //                 key={index}
// //                 className="flex items-start p-3 hover:bg-gray-50 rounded-lg transition-colors border border-gray-100"
// //               >
// //                 <div className="flex items-center">
// //                   {getFileIcon(documentName)}
// //                 </div>
// //                 <div className="ml-3 flex-1">
// //                   <div className="flex justify-between items-center">
// //                     <div className="flex items-center gap-1">
// //                       <span className="font-medium text-gray-800">
// //                         {accessGranted ? (
// //                           <a
// //                             href={url}
// //                             target="_blank"
// //                             rel="noopener noreferrer"
// //                             className="flex items-center gap-1 hover:text-blue-600"
// //                           >
// //                             <FiDownload size={14} />
// //                             {documentName}
// //                           </a>
// //                         ) : (
// //                           <span className="flex items-center gap-1 text-gray-400">
// //                             <FiLock size={14} />
// //                             {documentName} (Access Denied)
// //                           </span>
// //                         )}
// //                       </span>
// //                       <span className="text-xs text-gray-500 ml-2">added</span>
// //                     </div>
// //                   </div>
// //                 </div>
// //               </div>
// //             );
// //           })}
// //         </div>

// //         {documents.length > 3 && (
// //           <button
// //             onClick={toggleShowAll}
// //             className="mt-4 text-sm text-blue-600 hover:text-blue-800 flex items-center"
// //           >
// //             {showAll ? (
// //               <>
// //                 <FiChevronUp className="mr-1.5" />
// //                 Show less
// //               </>
// //             ) : (
// //               <>
// //                 <FiChevronDown className="mr-1.5" />
// //                 Show more
// //               </>
// //             )}
// //           </button>
// //         )}
// //       </div>

// //       <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
// //         <button
// //           onClick={requestDocumentAccess}
// //           className="w-full sm:w-auto px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center justify-center space-x-2 shadow-sm disabled:opacity-50"
// //           disabled={loading || requestSent}
// //         >
// //           {loading ? (
// //             <svg
// //               className="animate-spin h-5 w-5 text-white mr-2"
// //               xmlns="http://www.w3.org/2000/svg"
// //               fill="none"
// //               viewBox="0 0 24 24"
// //             >
// //               <circle
// //                 className="opacity-25"
// //                 cx="12"
// //                 cy="12"
// //                 r="10"
// //                 stroke="currentColor"
// //                 strokeWidth="4"
// //               />
// //               <path
// //                 className="opacity-75"
// //                 fill="currentColor"
// //                 d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
// //               />
// //             </svg>
// //           ) : (
// //             <FiLock className="text-blue-100" size={16} />
// //           )}
// //           <span>
// //             {loading ? "Requesting..." : "Request Access for All Documents"}
// //           </span>
// //         </button>
// //         {requestSent && (
// //           <div className="mt-2 text-green-600 text-sm">
// //             Your request is delivered
// //           </div>
// //         )}
// //         {error && (
// //           <div className="mt-2 text-red-600 text-sm">
// //             {error}
// //           </div>
// //         )}
// //       </div>
// //     </div>
// //   );
// // };

// interface User {
//   id: number;
//   email: string;
//   firstName: string;
//   lastName: string;
//   screenName?: string;
//   phoneNumber?: string;
//   dateOfBirth?: string;
//   address?: string;
//   postcode?: string;
//   role: string;
//   createdAt: string;
//   updatedAt: string;
//   individualProfessional?: {
//     profile?: { profilePhoto?: string };
//     profileData?: any;
//     documents?: string[];
//     permissions?: any;
//   };
//   additionalData?: { profileData?: any };
//   profile?: any;
//   permissions?: any;
// }

// interface UserProfileCardProps {
//   user: User;
//   // currentUser: string; // Assuming currentUser is the user ID as a string
// }

// const UserProfileCard = ({ user }: UserProfileCardProps) => {
//   const {
//     email,
//     firstName,
//     lastName,
//     screenName,
//     phoneNumber,
//     dateOfBirth,
//     address,
//     postcode,
//     role,
//     createdAt,
//     updatedAt,
//   } = user;

//   const profileData =
//     user?.individualProfessional?.profileData ||
//     user?.additionalData?.profileData ||
//     user?.profile ||
//     {};
//     const profilePhoto = user?.individualProfessional?.profile?.profilePhoto;
//     const documents = user?.individualProfessional?.documents;
//     const currentUser = localStorage.getItem("loginData");
//     const userId = currentUser ? JSON.parse(currentUser).id : null;
//     const targetUserId = user.id || 38; // Use user.id or fallback to API example

//   return (
//     <div className="max-w-5xl mx-auto my-10 px-6 bg-white rounded-lg shadow p-6">
//       {/* Header */}
//       <div className="flex flex-col items-left text-left bg-white rounded-lg shadow p-6">
//         <div className="flex flex-row">
//           <div>
//             <img
//               src={profilePhoto || img.src}
//               alt="Profile"
//               className="w-32 h-32 rounded-full object-cover border mb-4"
//             />
//             <ProfessionalIcons />
//           </div>
//           <div className="mx-6 my-4">
//             <h2 className="text-2xl font-bold text-gray-800">{firstName} {lastName}</h2>
//             <p className="text-gray-600">{role}</p>
//             {profileData?.basicInfo?.profileHeadline && (
//               <p className="text-gray-500 text-sm mt-1">
//                 {profileData.basicInfo.profileHeadline}
//               </p>
//             )}
//             <div className="flex flex-col sm:flex-row mt-6 gap-3">
//               <Section
//                 label="Chat on Whatsapp"
//                 value={phoneNumber}
//                 onClick={() => window.open(`https://wa.me/${phoneNumber?.replace(/[^\d]/g, '')}`, "_blank")}
//                 clickable
//                 hiddenValue
//                 showIcon
//               />
//               <Section
//                 label="Mobile"
//                 value={phoneNumber}
//                 onClick={() => window.location.href = `tel:${phoneNumber}`}
//                 clickable
//                 hiddenValue
//                 showIcon
//               />
//               <Section
//                 label="Message"
//                 value={email}
//                 onClick={() => window.location.href = `mailto:${email}`}
//                 clickable
//                 hiddenValue
//                 showIcon
//               />
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-10 mt-10 bg-white rounded-lg shadow p-6">
//         <Section label="Date of Birth" value={dateOfBirth} />
//         <Section label="Address" value={address} />
//         <Section label="Postcode" value={postcode} />
//         <Section label="Screen Name" value={screenName} />
//         <Section label="Account Created" value={new Date(createdAt).toLocaleString()} />
//         <Section label="Last Updated" value={new Date(updatedAt).toLocaleString()} />
//       </div>

//       {/* Profile Groups */}
//       <ProfileGroup title="Basic Info" data={profileData?.basicInfo} />
//       <ProfileGroup title="About" data={profileData?.about} />
//       <ProfileGroup title="Fees" data={profileData?.fees} />
//       <ProfileGroup title="Contact Info" data={profileData?.contact} />
//       <ProfileGroup title="Services" data={profileData?.services} />

//       {/* Availability */}
//       {profileData?.availability?.weeklySchedule ? (
//         <div className="mt-10 bg-white rounded-lg shadow p-6">
//           <h3 className="text-lg font-semibold text-gray-800 mb-2">Availability</h3>
//           <p className="text-sm text-gray-600 mb-2">
//             {profileData.availability.description || "Weekly schedule:"}
//           </p>
//           <AvailabilityTable schedule={profileData.availability.weeklySchedule} />
//         </div>
//       ) : (
//         <div className="mt-10 bg-white rounded-xl border border-gray-200 p-6 text-center text-gray-500 shadow-sm">
//           No professional profile available.
//         </div>
//       )}

//       {/* Documents */}
//       {documents && documents.length > 0 ? (
//         <DocumentsSection documents={documents} userId={userId} targetUserId={targetUserId} />
//       ) : (
//         <div className="mt-10 bg-white rounded-xl border border-gray-200 p-6 text-center text-gray-500 shadow-sm">
//           No documents available.
//         </div>
//       )}

//       {/* Permissions */}
//       <ProfileGroup
//         title="Permissions"
//         data={user?.individualProfessional?.permissions || user?.permissions}
//       />
//     </div>
//   );
// };

// export default UserProfileCard;







// import React, { useState } from "react";
// import img from "../../../../public/images/profile.png";
// import { FiMail, FiPhone, FiMessageSquare } from "react-icons/fi";
// import { FileText, Award, CheckCircle } from "lucide-react";
// import { FaWhatsapp } from "react-icons/fa";
// import ProfessionalIcons from "./ProfessionalIcons";
// import { FiChevronDown, FiChevronUp, FiDownload, FiSend, FiLock } from "react-icons/fi";
// import {
//   AiFillFilePdf,
//   AiFillFileImage,
//   AiFillFileWord,
//   AiFillFileExcel,
//   AiFillFilePpt,
//   AiFillFileText,
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
//   const isCallField = label === "Mobile";
//   const fieldColor = isWhatsAppField || isCallField ? "text-white" : "text-white";
//   const bgColor = isWhatsAppField
//     ? "bg-green-500 hover:bg-green-600"
//     : isCallField
//     ? "bg-indigo-500 hover:bg-indigo-600"
//     : "bg-blue-500 hover:bg-blue-600";

//   const displayValue = hiddenValue ? "" : formatValue(value);

//   return (
//     <div
//       className={`group flex items-start gap-3 ${
//         clickable ? `cursor-pointer ${bgColor}` : ""
//       } p-3 rounded-lg transition-all`}
//       onClick={onClick}
//     >
//       {showIcon && (
//         <div className={`${fieldColor} mt-0.5`}>
//           {isWhatsAppField ? (
//             <FaWhatsapp size={18} style={{ color: "#fff" }} />
//           ) : isCallField ? (
//             <FiPhone size={18} style={{ color: "#fff" }} />
//           ) : (
//             <FiMail size={18} style={{ color: "#fff" }} />
//           )}
//         </div>
//       )}
//       <div>
//         <p
//           className={`text-sm font-medium uppercase tracking-wider ${
//             isWhatsAppField || label === "Message" || isCallField
//               ? "text-white"
//               : "text-gray-500"
//           }`}
//         >
//           {label}
//         </p>
//         <p
//           className={`text-base font-medium ${
//             clickable ? fieldColor : "text-gray-800"
//           } break-words`}
//         >
//           {displayValue}
//         </p>
//       </div>
//     </div>
//   );
// };

// const ProfileGroup = ({ title, data }: { title: string; data: any }) => {
//   if (!data || Object.keys(data).length === 0) return null;
//   return (
//     <div className="mt-8 bg-gray-50 rounded-xl border p-6 shadow-sm">
//       <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">{title}</h3>
//       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//         {Object.entries(data).map(([key, val]) =>
//           typeof val === "object" && !Array.isArray(val) ? (
//             <ProfileGroup key={key} title={formatKey(key)} data={val} />
//           ) : (
//             <Section
//               key={key}
//               label={formatKey(key)}
//               value={Array.isArray(val) ? val : val?.toString()}
//             />
//           )
//         )}
//       </div>
//     </div>
//   );
// };

// const formatKey = (key: string) =>
//   key
//     .replace(/([A-Z])/g, " $1")
//     .replace(/^./, (str) => str.toUpperCase())
//     .replace(/_/g, " ");

// const AvailabilityTable = ({ schedule }: { schedule: any }) => {
//   const timeSlots = ["Morning", "Afternoon", "Evening", "Overnight"];
//   const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

//   return (
//     <div className="overflow-auto mt-4 rounded-lg border border-gray-200">
//       <table className="min-w-full text-sm text-center">
//         <thead className="bg-gray-100 text-gray-700 font-medium">
//           <tr>
//             <th className="px-4 py-2 text-left">Time Slot</th>
//             {days.map((day) => (
//               <th key={day} className="px-3 py-2">{day}</th>
//             ))}
//           </tr>
//         </thead>
//         <tbody>
//           {timeSlots.map((slot) => (
//             <tr key={slot} className="border-t">
//               <td className="px-4 py-2 text-left font-medium text-gray-700">{slot}</td>
//               {days.map((day) => (
//                 <td
//                   key={day}
//                   className={`px-3 py-2 ${
//                     schedule?.[slot]?.[day]
//                       ? "bg-green-100 text-green-700"
//                       : "text-gray-400"
//                   }`}
//                 >
//                   {schedule?.[slot]?.[day] ? "✓" : "—"}
//                 </td>
//               ))}
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// const getFileIcon = (filename?: string) => {
//   if (!filename || typeof filename !== "string") return <AiFillFileText className="text-gray-400" size={28} />;
//   const ext = filename.split(".").pop()?.toLowerCase();
//   if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext!)) return <AiFillFileImage className="text-pink-500" size={28} />;
//   if (["pdf"].includes(ext!)) return <AiFillFilePdf className="text-red-500" size={28} />;
//   if (["doc", "docx"].includes(ext!)) return <AiFillFileWord className="text-blue-500" size={28} />;
//   if (["xls", "xlsx"].includes(ext!)) return <AiFillFileExcel className="text-green-600" size={28} />;
//   if (["ppt", "pptx"].includes(ext!)) return <AiFillFilePpt className="text-orange-500" size={28} />;
//   return <AiFillFileText className="text-gray-400" size={28} />;
// };

// const getDocumentNameFromUrl = (url: string) => {
//   if (typeof url !== "string") return "Unnamed Document";
//   const parts = url.split("/");
//   const fileNameWithExt = decodeURIComponent(parts.pop() || "Unnamed Document");
//   const namePart = fileNameWithExt.split("-").slice(1).join("-").split(".").slice(0, -1).join(".");
//   return namePart || "Unnamed Document";
// };

// const DocumentsSection = ({
//   documents,
//   userId,
//   targetUserId,
// }: {
//   documents: string[];
//   userId: string | number;
//   targetUserId: number;
// }) => {
//   const [visibleCount, setVisibleCount] = useState(3);
//   const [showAll, setShowAll] = useState(false);
//   const [accessGranted, setAccessGranted] = useState(false);
//   const [requestSent, setRequestSent] = useState(false);
//   const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const toggleShowAll = () => {
//     setShowAll(!showAll);
//     setVisibleCount(showAll ? 3 : documents.length);
//   };

//   const displayedDocuments = documents.slice(0, visibleCount);

//   const handleDocumentSelect = (url: string) => {
//     setSelectedDocuments((prev) =>
//       prev.includes(url)
//         ? prev.filter((doc) => doc !== url)
//         : [...prev, url]
//     );
//   };

//   const handleSelectAll = () => {
//     if (selectedDocuments.length === documents.length) {
//       setSelectedDocuments([]);
//     } else {
//       setSelectedDocuments([...documents]);
//     }
//   };

//   const requestDocumentAccess = async () => {
//     setLoading(true);
//     setError(null);
//     setRequestSent(false);

//     try {
//       const response = await fetch("http://localhost:4000/dev/document/request", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           requesterId: userId,
//           targetUserId,
//           // documentUrls: selectedDocuments,
//         }),
//       });

//       if (response.ok) {
//         setRequestSent(true);
//         setSelectedDocuments([]); // Clear selection after request
//         setTimeout(() => setRequestSent(false), 3000); // Hide success message after 3 seconds
//       } else {
//         const errorData = await response.json();
//         setError(errorData.message || "Failed to request access. Please try again.");
//       }
//     } catch (error) {
//       setError("Network error. Please check your connection and try again.");
//       console.error("Error requesting document access:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (!documents || documents.length === 0) return null;

//   return (
//     <div className="mt-10 bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
//       <div className="p-6">
//         <div className="flex items-center justify-between mb-3">
//           <h3 className="text-xl font-semibold text-gray-800">My Documents</h3>
//           <div className="flex items-center text-sm text-gray-500">
//             <FiLock className="mr-1.5" size={14} />
//             <span>Secure Documents</span>
//           </div>
//         </div>

//         <p className="text-sm text-gray-600 mb-6">
//           This member has provided us with electronic copies of the following documents. These copies are held on file unless specified as deleted. The documents have been certified by the member as being true and accurate. We recommend you ask to see original copies of the documents before you hire them in order verify the true accuracy for yourself.
//         </p>

//         <div className="flex items-center mb-4">
//           <input
//             type="checkbox"
//             checked={selectedDocuments.length === documents.length}
//             onChange={handleSelectAll}
//             className="mr-2 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
//           />
//           <label className="text-sm text-gray-700">
//             Select All ({selectedDocuments.length}/{documents.length} selected)
//           </label>
//         </div>

//         <div className="space-y-3">
//           {displayedDocuments.map((url, index) => {
//             const documentName = getDocumentNameFromUrl(url);
//             return (
//               <div
//                 key={index}
//                 className="flex items-start p-3 hover:bg-gray-50 rounded-lg transition-colors border border-gray-100"
//               >
//                 <input
//                   type="checkbox"
//                   checked={selectedDocuments.includes(url)}
//                   onChange={() => handleDocumentSelect(url)}
//                   className="mr-3 mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
//                 />
//                 <div className="flex items-center">
//                   {getFileIcon(documentName)}
//                 </div>
//                 <div className="ml-3 flex-1">
//                   <div className="flex justify-between items-center">
//                     <div className="flex items-center gap-1">
//                       <span className="font-medium text-gray-800">
//                         {accessGranted ? (
//                           <a
//                             href={url}
//                             target="_blank"
//                             rel="noopener noreferrer"
//                             className="flex items-center gap-1 hover:text-blue-600"
//                           >
//                             <FiDownload size={14} />
//                             {documentName}
//                           </a>
//                         ) : (
//                           <span className="flex items-center gap-1 text-gray-400">
//                             <FiLock size={14} />
//                             {documentName} (Access Denied)
//                           </span>
//                         )}
//                       </span>
//                       <span className="text-xs text-gray-500 ml-2">added</span>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             );
//           })}
//         </div>

//         {documents.length > 3 && (
//           <button
//             onClick={toggleShowAll}
//             className="mt-4 text-sm text-blue-600 hover:text-blue-800 flex items-center"
//           >
//             {showAll ? (
//               <>
//                 <FiChevronUp className="mr-1.5" />
//                 Show less
//               </>
//             ) : (
//               <>
//                 <FiChevronDown className="mr-1.5" />
//                 Show more
//               </>
//             )}
//           </button>
//         )}
//       </div>

//       <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
//         <button
//           onClick={requestDocumentAccess}
//           className="w-full sm:w-auto px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center justify-center space-x-2 shadow-sm disabled:opacity-50"
//           disabled={loading || requestSent || selectedDocuments.length === 0}
//         >
//           {loading ? (
//             <svg
//               className="animate-spin h-5 w-5 text-white mr-2"
//               xmlns="http://www.w3.org/2000/svg"
//               fill="none"
//               viewBox="0 0 24 24"
//             >
//               <circle
//                 className="opacity-25"
//                 cx="12"
//                 cy="12"
//                 r="10"
//                 stroke="currentColor"
//                 strokeWidth="4"
//               />
//               <path
//                 className="opacity-75"
//                 fill="currentColor"
//                 d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//               />
//             </svg>
//           ) : (
//             <FiLock className="text-blue-100" size={16} />
//           )}
//           <span>
//             {loading
//               ? "Requesting..."
//               : `Request Access for ${selectedDocuments.length} Document${selectedDocuments.length !== 1 ? "s" : ""}`}
//           </span>
//         </button>
//         {requestSent && (
//           <div className="mt-2 text-green-600 text-sm">
//             Your request is delivered
//           </div>
//         )}
//         {error && (
//           <div className="mt-2 text-red-600 text-sm">
//             {error}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// interface User {
//   id: number;
//   email: string;
//   firstName: string;
//   lastName: string;
//   screenName?: string;
//   phoneNumber?: string;
//   dateOfBirth?: string;
//   address?: string;
//   postcode?: string;
//   role: string;
//   createdAt: string;
//   updatedAt: string;
//   individualProfessional?: {
//     profile?: { profilePhoto?: string };
//     profileData?: any;
//     documents?: string[];
//     permissions?: any;
//   };
//   additionalData?: { profileData?: any };
//   profile?: any;
//   permissions?: any;
// }

// interface UserProfileCardProps {
//   user: User;
//   currentUser: string; // Assuming currentUser is the user ID as a string
// }

// const UserProfileCard = ({ user, currentUser }: UserProfileCardProps) => {
//   const {
//     email,
//     firstName,
//     lastName,
//     screenName,
//     phoneNumber,
//     dateOfBirth,
//     address,
//     postcode,
//     role,
//     createdAt,
//     updatedAt,
//   } = user;

//   const profileData =
//     user?.individualProfessional?.profileData ||
//     user?.additionalData?.profileData ||
//     user?.profile ||
//     {};
//   const profilePhoto = user?.individualProfessional?.profile?.profilePhoto;
//   const documents = user?.individualProfessional?.documents;
//   const userId = currentUser; // Use currentUser directly as the user ID
//   const targetUserId = user.id || 38; // Use user.id or fallback to API example

//   return (
//     <div className="max-w-5xl mx-auto my-10 px-6 bg-white rounded-lg shadow p-6">
//       {/* Header */}
//       <div className="flex flex-col items-left text-left bg-white rounded-lg shadow p-6">
//         <div className="flex flex-row">
//           <div>
//             <img
//               src={profilePhoto || img.src}
//               alt="Profile"
//               className="w-32 h-32 rounded-full object-cover border mb-4"
//             />
//             <ProfessionalIcons />
//           </div>
//           <div className="mx-6 my-4">
//             <h2 className="text-2xl font-bold text-gray-800">{firstName} {lastName}</h2>
//             <p className="text-gray-600">{role}</p>
//             {profileData?.basicInfo?.profileHeadline && (
//               <p className="text-gray-500 text-sm mt-1">
//                 {profileData.basicInfo.profileHeadline}
//               </p>
//             )}
//             <div className="flex flex-col sm:flex-row mt-6 gap-3">
//               <Section
//                 label="Chat on Whatsapp"
//                 value={phoneNumber}
//                 onClick={() => window.open(`https://wa.me/${phoneNumber?.replace(/[^\d]/g, '')}`, "_blank")}
//                 clickable
//                 hiddenValue
//                 showIcon
//               />
//               <Section
//                 label="Mobile"
//                 value={phoneNumber}
//                 onClick={() => window.location.href = `tel:${phoneNumber}`}
//                 clickable
//                 hiddenValue
//                 showIcon
//               />
//               <Section
//                 label="Message"
//                 value={email}
//                 onClick={() => window.location.href = `mailto:${email}`}
//                 clickable
//                 hiddenValue
//                 showIcon
//               />
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-10 mt-10 bg-white rounded-lg shadow p-6">
//         <Section label="Date of Birth" value={dateOfBirth} />
//         <Section label="Address" value={address} />
//         <Section label="Postcode" value={postcode} />
//         <Section label="Screen Name" value={screenName} />
//         <Section label="Account Created" value={new Date(createdAt).toLocaleString()} />
//         <Section label="Last Updated" value={new Date(updatedAt).toLocaleString()} />
//       </div>

//       {/* Profile Groups */}
//       <ProfileGroup title="Basic Info" data={profileData?.basicInfo} />
//       <ProfileGroup title="About" data={profileData?.about} />
//       <ProfileGroup title="Fees" data={profileData?.fees} />
//       <ProfileGroup title="Contact Info" data={profileData?.contact} />
//       <ProfileGroup title="Services" data={profileData?.services} />

//       {/* Availability */}
//       {profileData?.availability?.weeklySchedule ? (
//         <div className="mt-10 bg-white rounded-lg shadow p-6">
//           <h3 className="text-lg font-semibold text-gray-800 mb-2">Availability</h3>
//           <p className="text-sm text-gray-600 mb-2">
//             {profileData.availability.description || "Weekly schedule:"}
//           </p>
//           <AvailabilityTable schedule={profileData.availability.weeklySchedule} />
//         </div>
//       ) : (
//         <div className="mt-10 bg-white rounded-xl border border-gray-200 p-6 text-center text-gray-500 shadow-sm">
//           No professional profile available.
//         </div>
//       )}

//       {/* Documents */}
//       {documents && documents.length > 0 ? (
//         <DocumentsSection documents={documents} userId={userId} targetUserId={targetUserId} />
//       ) : (
//         <div className="mt-10 bg-white rounded-xl border border-gray-200 p-6 text-center text-gray-500 shadow-sm">
//           No documents available.
//         </div>
//       )}

//       {/* Permissions */}
//       <ProfileGroup
//         title="Permissions"
//         data={user?.individualProfessional?.permissions || user?.permissions}
//       />
//     </div>
//   );
// };

// export default UserProfileCard;






// import React,{useState} from "react";
// import img from '../../../../public/images/profile.png';
// import { FiMail, FiPhone, FiMessageSquare} from "react-icons/fi";
// import { FileText, Award, CheckCircle } from "lucide-react";
// import { FaWhatsapp } from "react-icons/fa";
// import ProfessionalIcons from "./ProfessionalIcons";
// import { FiChevronDown, FiChevronUp, FiDownload, FiSend, FiLock } from "react-icons/fi";
// import {
//   AiFillFilePdf,
//   AiFillFileImage,
//   AiFillFileWord,
//   AiFillFileExcel,
//   AiFillFilePpt,
//   AiFillFileText,
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
//   const isCallField = label === "Mobile";
//   const fieldColor = isWhatsAppField || isCallField ? "text-white" : "text-white";
//   const bgColor = isWhatsAppField
//     ? "bg-green-500 hover:bg-green-600"
//     : isCallField
//     ? "bg-indigo-500 hover:bg-indigo-600"
//     : "bg-blue-500 hover:bg-blue-600";

//   const displayValue = hiddenValue ? "" : formatValue(value);

//   return (
//     <div
//       className={`group flex items-start gap-3 ${
//         clickable ? `cursor-pointer ${bgColor}` : ""
//       } p-3 rounded-lg transition-all`}
//       onClick={onClick}
//     >
//       {showIcon && (
//         <div className={`${fieldColor} mt-0.5`}>
//           {isWhatsAppField ? (
//             <FaWhatsapp size={18} style={{ color: "#fff" }} />
//           ) : isCallField ? (
//             <FiPhone size={18} style={{ color: "#fff" }} />
//           ) : (
//             <FiMail size={18} style={{ color: "#fff" }} />
//           )}
//         </div>
//       )}
//       <div>
//         <p
//           className={`text-sm font-medium uppercase tracking-wider ${
//             isWhatsAppField || label === "Message" || isCallField
//               ? "text-white"
//               : "text-gray-500"
//           }`}
//         >
//           {label}
//         </p>

//         <p
//           className={`text-base font-medium ${
//             clickable ? fieldColor : "text-gray-800"
//           } break-words`}
//         >
//           {displayValue}
//         </p>
//       </div>
//     </div>
//   );
// };


// // const Section = ({ label, value }: any) => (
// //   <div>
// //     <p className="text-sm text-gray-500">{label}</p>
// //     <p className="text-base font-medium text-gray-800 break-words">{value || "N/A"}</p>
// //   </div>
// // );

// const ProfileGroup = ({ title, data }: any) => {
//   if (!data || Object.keys(data).length === 0) return null;
//   return (
//     <div className="mt-8 bg-gray-50 rounded-xl border p-6 shadow-sm">
//       <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">{title}</h3>
//       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//         {Object.entries(data).map(([key, val]) =>
//           typeof val === "object" && !Array.isArray(val) ? (
//             <ProfileGroup key={key} title={formatKey(key)} data={val} />
//           ) : (
//             <Section
//               key={key}
//               label={formatKey(key)}
//               value={Array.isArray(val) ? val : val?.toString()}
//             />
//           )
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

// const AvailabilityTable = ({ schedule }: any) => {
//   const timeSlots = ["Morning", "Afternoon", "Evening", "Overnight"];
//   const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

//   return (
//     <div className="overflow-auto mt-4 rounded-lg border border-gray-200">
//       <table className="min-w-full text-sm text-center">
//         <thead className="bg-gray-100 text-gray-700 font-medium">
//           <tr>
//             <th className="px-4 py-2 text-left">Time Slot</th>
//             {days.map(day => (
//               <th key={day} className="px-3 py-2">{day}</th>
//             ))}
//           </tr>
//         </thead>
//         <tbody>
//           {timeSlots.map(slot => (
//             <tr key={slot} className="border-t">
//               <td className="px-4 py-2 text-left font-medium text-gray-700">{slot}</td>
//               {days.map(day => (
//                 <td
//                   key={day}
//                   className={`px-3 py-2 ${
//                     schedule?.[slot]?.[day]
//                       ? "bg-green-100 text-green-700"
//                       : "text-gray-400"
//                   }`}
//                 >
//                   {schedule?.[slot]?.[day] ? "✓" : "—"}
//                 </td>
//               ))}
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };
// const getFileIcon = (filename?: string) => {
//   if (!filename || typeof filename !== "string") return <AiFillFileText className="text-gray-400" size={28} />;
//   const ext = filename.split(".").pop()?.toLowerCase();
//   if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext!)) return <AiFillFileImage className="text-pink-500" size={28} />;
//   if (["pdf"].includes(ext!)) return <AiFillFilePdf className="text-red-500" size={28} />;
//   if (["doc", "docx"].includes(ext!)) return <AiFillFileWord className="text-blue-500" size={28} />;
//   if (["xls", "xlsx"].includes(ext!)) return <AiFillFileExcel className="text-green-600" size={28} />;
//   if (["ppt", "pptx"].includes(ext!)) return <AiFillFilePpt className="text-orange-500" size={28} />;
//   return <AiFillFileText className="text-gray-400" size={28} />;
// };
// // Function to extract document name after the "-" sign
// const getDocumentNameFromUrl = (url: any) => {
//   if (typeof url !== 'string') return "Unnamed Document";
  
//   const parts = url.split('/');
//   const fileNameWithExt = decodeURIComponent(parts.pop() || "Unnamed Document");
  
//   // Split the file name by "-" and take the part after the first "-"
//   const namePart = fileNameWithExt.split('-').slice(1).join('-').split('.').slice(0, -1).join('.');
//   return namePart || 'Unnamed Document';
// };

// const DocumentsSection = ({
//   documents,
// }: {
//   documents: string[]; // Change to string array because documents are URLs
// }) => {
//   const [visibleCount, setVisibleCount] = useState(3);
//   const [showAll, setShowAll] = useState(false);

//   if (!documents || documents.length === 0) return null;

//   const toggleShowAll = () => {
//     setShowAll(!showAll);
//     setVisibleCount(showAll ? 3 : documents.length);
//   };

//   const displayedDocuments = documents.slice(0, visibleCount);

//   return (
//     <div className="mt-10 bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
//       <div className="p-6">
//         <div className="flex items-center justify-between mb-3">
//           <h3 className="text-xl font-semibold text-gray-800">My Documents</h3>
//           <div className="flex items-center text-sm text-gray-500">
//             <FiLock className="mr-1.5" size={14} />
//             <span>Secure Documents</span>
//           </div>
//         </div>

//         <p className="text-sm text-gray-600 mb-6">
//           This member has provided us with electronic copies of the following documents. These copies are held on file unless specified as deleted. The documents have been certified by the member as being true and accurate. We recommend you ask to see original copies of the documents before you hire them in order verify the true accuracy for yourself.
//         </p>

//         <div className="space-y-3">
//           {displayedDocuments.map((url, index) => {
//             const documentName = getDocumentNameFromUrl(url); // Get the document name from the URL
//             return (
//               <div
//                 key={index}
//                 className="flex items-start p-3 hover:bg-gray-50 rounded-lg transition-colors border border-gray-100"
//               >
//                 <div className="flex items-center">
//                   {getFileIcon(documentName)}
//                 </div>
//                 <div className="ml-3 flex-1">
//                   <div className="flex justify-between items-center">
//                     <div className="flex items-center gap-1">
//                       <span className="font-medium text-gray-800">
//                         {/* {documentName} */}
//                         <a
//                       href={url}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                     >
//                       {/* <FiDownload size={14} /> */}
//                       {documentName}
//                     </a>
//                       <FiLock className="ml-2 text-gray-400" size={14} />
//                       </span>
//                       <span className="text-xs text-gray-500 ml-2">
//                     added 
//                   </span>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             );
//           })}
//         </div>

//         {documents.length > 3 && (
//           <button
//             onClick={toggleShowAll}
//             className="mt-4 text-sm text-blue-600 hover:text-blue-800 flex items-center"
//           >
//             {showAll ? (
//               <>
//                 <FiChevronUp className="mr-1.5" />
//                 Show less
//               </>
//             ) : (
//               <>
//                 <FiChevronDown className="mr-1.5" />
//                 Show more
//               </>
//             )}
//           </button>
//         )}
//       </div>

//       <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
//         <button className="w-full sm:w-auto px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center justify-center space-x-2 shadow-sm">
//           <FiLock className="text-blue-100" size={16} />
//           <span>Request Document Access</span>
//         </button>
//       </div>
//     </div>
//   );
// };

// const UserProfileCard = ({ user }: any) => {
//   const {
//     email,
//     firstName,
//     lastName,
//     screenName,
//     phoneNumber,
//     dateOfBirth,
//     address,
//     postcode,
//     role,
//     createdAt,
//     updatedAt
//   } = user;

//   const profileData =
//     user?.individualProfessional?.profileData ||
//     user?.additionalData?.profileData ||
//     user?.profile ||
//     {};
//   // console.log(profileData)
//   const profilePhoto = user?.individualProfessional?.profile?.profilePhoto;
//   const documents = user?.individualProfessional?.documents;
//   console.log(documents)

//   return (
//     <div className="max-w-5xl mx-auto my-10 px-6  bg-white rounded-lg shadow p-6">
//       {/* Header */}
//       <div className="flex flex-col items-left text-left  bg-white rounded-lg shadow p-6">
//         <div className="flex flex-row">
//         <div>
//         <img
//           src={profilePhoto || img.src}
//           alt="Profile"
//           className="w-32 h-32 rounded-full object-cover border mb-4"
//         />
//         <ProfessionalIcons/>
//         </div>

//         <div className="mx-6 my-4">
//         <h2 className="text-2xl font-bold text-gray-800">{firstName} {lastName}</h2>
//         <p className="text-gray-600">{role}</p>
//         {profileData?.basicInfo?.profileHeadline && (
//           <p className="text-gray-500 text-sm mt-1">
//             {profileData.basicInfo.profileHeadline}
//           </p>
//         )}
//               <div className="flex flex-col sm:flex-row mt-6 gap-3">
//               <Section 
//           label="Chat on Whatsapp" 
//           value={phoneNumber}
//           onClick={() => window.open(`https://wa.me/${phoneNumber.replace(/[^\d]/g, '')}`, '_blank')}
//           clickable
//           hiddenValue
//           showIcon
//         />
      
//         <Section 
//   label="Mobile"
//   value={phoneNumber}
//   onClick={() => window.location.href = `tel:${phoneNumber}`}
//   clickable
//   hiddenValue
//   showIcon
// />
// <Section 
//           label="Message" 
//           value={email}
//           onClick={() => window.location.href = `mailto:${email}`}
//           clickable
//           hiddenValue
//           showIcon
//         />
//       </div>
//         </div>
       
//         </div>
        

        
//               {/* Contact Info */}

//       </div>


//       <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-10 mt-10  bg-white rounded-lg shadow p-6">
//         {/* <Section label="Email" value={email} />
//         <Section label="Phone Number" value={phoneNumber} /> */}
        
     
//         <Section label="Date of Birth" value={dateOfBirth} />
//         <Section label="Address" value={address} />
//         <Section label="Postcode" value={postcode} />
//         <Section label="Screen Name" value={screenName} />
//         <Section label="Account Created" value={new Date(createdAt).toLocaleString()} />
//         <Section label="Last Updated" value={new Date(updatedAt).toLocaleString()} />
//       </div>

//       {/* Profile Groups */}
   
//       <ProfileGroup title="Basic Info" data={profileData?.basicInfo} />
//       <ProfileGroup title="About" data={profileData?.about} />
//       <ProfileGroup title="Fees" data={profileData?.fees} />
//       <ProfileGroup title="Contact Info" data={profileData?.contact} />
//       <ProfileGroup title="Services" data={profileData?.services} />
    

//       {/* Availability */}
//       {profileData?.availability?.weeklySchedule ? (
//         <div className="mt-10  bg-white rounded-lg shadow p-6">
//           <h3 className="text-lg font-semibold text-gray-800 mb-2">Availability</h3>
//           <p className="text-sm text-gray-600 mb-2">
//             {profileData.availability.description || "Weekly schedule:"}
//           </p>
//           <AvailabilityTable schedule={profileData.availability.weeklySchedule} />
//         </div>
//       ) : (
//         <div className="mt-10 bg-white rounded-xl border border-gray-200 p-6 text-center text-gray-500 shadow-sm">
//     No professional profile available.
//   </div>
//       )}

//       {/* Documents */}
//       {documents && documents.length > 0 ? (
//   <DocumentsSection documents={documents} />
// ) : (
//   <div className="mt-10 bg-white rounded-xl border border-gray-200 p-6 text-center text-gray-500 shadow-sm">
//     No documents available.
//   </div>
// )}


//       {/* Permissions */}
//       <ProfileGroup
//         title="Permissions"
//         data={user?.individualProfessional?.permissions || user?.permissions}
//       />
//     </div>
//   );
// };

// export default UserProfileCard;

// const getDocumentNameFromUrl = (url: string) => {
//   const parts = url.split('/');
//   const fileNameWithExt = decodeURIComponent(parts.pop() || "Unnamed Document");
  
//   // Split the file name by "-" and take the part after the first "-"
//   const namePart = fileNameWithExt.split('-').slice(1).join('-').split('.').slice(0, -1).join('.');
//   return namePart || 'Unnamed Document';
// };

// const getFileIcon = (filename: string) => {
//   const ext = filename.split('.').pop()?.toLowerCase();
//   if (!ext) return "📁";

//   if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext)) return "🖼️";
//   if (["pdf"].includes(ext)) return "📄";
//   if (["doc", "docx"].includes(ext)) return "📝";
//   if (["xls", "xlsx"].includes(ext)) return "📊";
//   if (["ppt", "pptx"].includes(ext)) return "📽️";
//   return "📁";
// };


// const DocumentsSection = ({ documents }: { documents: string[] }) => {
//   if (!documents || documents.length === 0) return null;

//   return (
//     <div className="mt-10">
//       <h3 className="text-lg font-semibold text-gray-800 mb-4">Documents</h3>
//       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//         {documents.map((docUrl, index) => {
//           const fileName = docUrl.split("/").pop() || `Document ${index + 1}`;
//           const docName = fileName
//             .split("-")
//             .slice(1)
//             .join(" ")
//             .replace(/\.[^/.]+$/, "");

//           const icon = getFileIcon(fileName);
//           const isImage = /\.(jpeg|jpg|png|gif|webp)$/i.test(fileName);

//           return (
//             <div
//               key={index}
//               className="p-4 rounded-md bg-gray-50 shadow-sm hover:shadow-md transition"
//             >

//               <a
//                 href={docUrl}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="block text-center text-black font-medium"
//               >
//                 {icon} {docName}
//               </a>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// };

