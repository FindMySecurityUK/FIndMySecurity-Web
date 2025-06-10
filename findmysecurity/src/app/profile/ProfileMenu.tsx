"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  FaSearch,
  FaHeart,
  FaUserShield,
  FaCogs,
  FaAd,
  FaUserPlus,
  FaList,
  FaPlus,
  FaBell,
} from "react-icons/fa";
import { FiFileText } from "react-icons/fi";
import axios from "axios";
import { API_URL } from "@/utils/path";
import toast from "react-hot-toast";
import Link from "next/link";

interface Notification {
  id: number;
  profileImage: string;
  text: string;
  jobTitle: string;
  message?: string;
  relatedUserId?: number;
}

interface ProfileMenuProps {
  roleId: number;
}

/**
 * Displays a menu of profile-related actions with notifications.
 * @param props - The role ID of the user.
 */
const ProfileMenu: React.FC<ProfileMenuProps> = ({ roleId }) => {
  const router = useRouter();
  const [loginData, setLoginData] = useState<any>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isClearingNotifications, setIsClearingNotifications] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const storedData = localStorage.getItem("loginData");
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      setLoginData(parsedData);

      const fetchNotifications = async () => {
        try {
          const token = localStorage.getItem("authToken")?.replace(/^"|"$/g, '');
          const userId = parsedData.id;

          const response = await axios.get(
            `${API_URL}/notifications/user/${userId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          const notificationsArray = response.data?.data;
          if (Array.isArray(notificationsArray) && notificationsArray.length > 0) {
            setNotifications(notificationsArray);
          } else {
            setNotifications([]);
          }
        } catch (error) {
          console.error("Failed to fetch notifications:", error);
          toast.error("Failed to load notifications");
        }
      };

      fetchNotifications();
    }
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    }

    if (showNotifications) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showNotifications]);

  const handleClearAllNotifications = async () => {
    setIsClearingNotifications(true);
    const token = localStorage.getItem("authToken")?.replace(/^"|"$/g, '');

    try {
      await Promise.all(
        notifications.map((notif) =>
          axios.delete(`${API_URL}/notifications/${notif.id}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
        )
      );
      toast.success("All notifications cleared");
      setNotifications([]);
    } catch (err) {
      toast.error("Failed to clear notifications");
      console.error(err);
    } finally {
      setIsClearingNotifications(false);
    }
  };

  const shouldShowCreateProfile =
    roleId === 3 && !loginData?.individualProfessional?.profile?.weeklySchedule;

  const isSubscriber = loginData?.isSubscriber;
  const subscriptionTier = loginData?.subscriptionTier;

const menuItems = [
  { icon: <FaList />, label: "Courses", route: "/course-listing" },
  { icon: <FaHeart />, label: "My Favourites", route:'/my-favourites' },


  ...((roleId === 3 || roleId === 6) ?[]:[ {
    icon: <FaUserShield />,
    label:  "My Job Applicants" ,
    route: "/my-job-applicants",
  }]),

  ...((roleId === 3|| roleId === 6)
  //  || isSubscriber && subscriptionTier !== "Basic"
    ? []
    : [{ icon: <FaCogs />, label: "My Ads", route: "/my-ads" }]),

  ...(roleId === 5 || roleId === 6 || roleId === 7
    ? [{ icon: <FaSearch />, label: "Tender Board", route:"/tender-board-listing" }]
    : []),

  { icon: <FaCogs />, label: "Customer Support", route: "/contact-us" },
...(roleId === 6
  ?[{ icon: <FaPlus />, label: "Course Board Management", route:'/course-board-management' }]:[]),
  ...(
    // isSubscriber && subscriptionTier !== "Basic"
    true
    ? [{ icon: <FaBell />, label: "Notifications", isNotification: true }]
    : []),

  ...(roleId === 3 
    // && isSubscriber && subscriptionTier !== "Basic"
    ? [
        {
          icon: <FiFileText />,
          label: "Document Applicants",
          route: "/document-applicants",
        },
      ]
    : []),

  ...((roleId === 3|| roleId === 6)
   
      ? []
      : [{ icon: <FaAd />, label: "Post Free Job", route: "/post-ad" }]
  ),
...(roleId === 3 || roleId === 6
    ? [{ icon: <FaAd />, label: "View Jobs", route: "/view-ads" }]    :[]),
  ...(shouldShowCreateProfile
    ? [
        {
          icon: <FaUserPlus />,
          label: "Create Public Profile",
          route: "/public-profile",
        },
      ]
    : []),
];


  const handleMenuClick = (item: any) => {
    if (item.isNotification) {
      setShowNotifications((prev) => !prev);
    } else if (item.onClick) {
      item.onClick();
    } else if (item.route) {
      router.push(item.route);
    }
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 relative">
      {menuItems.map((item, index) => (
        <div
          key={index}
          onClick={() => handleMenuClick(item)}
          className="cursor-pointer p-4 bg-gray-100 rounded-lg shadow-sm hover:bg-gray-200 transition text-center relative"
        >
          <div className="text-2xl relative inline-block">
            {item.icon}
            {item.isNotification && notifications.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full text-xs px-1">
                {notifications.length}
              </span>
            )}
          </div>
          <p className="text-sm mt-1">{item.label}</p>
        </div>
      ))}

      {showNotifications && (
        <div
          ref={popupRef}
          className="absolute right-0 top-24 bg-white shadow-lg rounded-lg w-80 z-50 p-4 max-h-96 overflow-y-auto"
        >
          <div className="flex justify-between items-center mb-3">
            <h4 className="font-semibold text-lg">Notifications</h4>
            {notifications.length > 0 && (
              <button
                className="text-sm text-red-600 hover:underline"
                onClick={handleClearAllNotifications}
                disabled={isClearingNotifications}
              >
                {isClearingNotifications ? "Clearing..." : "Clear All"}
              </button>
            )}
          </div>

          {isClearingNotifications ? (
            <p className="text-center text-gray-500">Clearing notifications...</p>
          ) : notifications.length === 0 ? (
            <p className="text-gray-500 text-center">No new notifications</p>
          ) : (
            notifications.map((notif) => (
              <div key={notif.id} className="flex items-start gap-3 p-2 border-b">
                <div className="flex-1">
                  <p className="text-sm">
                    {typeof notif?.message === "string"
                      ? notif.message.split(":")[1]?.trim()
                      : ""}
                  </p>
                  <Link href={`/public-profile/${notif?.relatedUserId}`}>
                    <p className="text-xs text-gray-500">
                      {typeof notif?.message === "string"
                        ? notif.message.split(":")[0]?.trim()
                        : ""}
                    </p>
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default ProfileMenu;








// "use client";

// import React, { useEffect, useRef, useState, ReactNode } from "react";
// import { useRouter } from "next/navigation";
// import {
//   FaSearch,
//   FaHeart,
//   FaUserShield,
//   FaCogs,
//   FaAd,
//   FaUserPlus,
//   FaBell,
// } from "react-icons/fa";
// import { FiFileText } from "react-icons/fi";
// import axios from "axios";
// import { API_URL } from "@/utils/path";
// import toast from "react-hot-toast";
// import Link from "next/link";

// interface Notification {
//   id: number;
//   profileImage: string;
//   text: string;
//   jobTitle: string;
//   message?: string;
//   relatedUserId?: number;
// }

// interface DocumentRequest {
//   id: number;
//   requesterId: number;
//   documentOwnerId: number;
//   documentUrl: string;
//   status: "pending" | "approved" | "rejected";
//   createdAt: string;
//   updatedAt: string;
//   requester: {
//     firstName: string;
//     lastName: string;
//     profileImage: string;
//   };
// }

// interface ProfileMenuProps {
//   roleId: number;
// }

// const ProfileMenu: React.FC<ProfileMenuProps> = ({ roleId }) => {
//   const router = useRouter();
//   const [loginData, setLoginData] = useState<any>(null);
//   const [showNotifications, setShowNotifications] = useState(false);
//   const [notifications, setNotifications] = useState<Notification[]>([]);
//   const [isClearingNotifications, setIsClearingNotifications] = useState(false);
//   const [showDocumentApplicants, setShowDocumentApplicants] = useState(false);
//   const [documentRequests, setDocumentRequests] = useState<DocumentRequest[]>([]);
//   const [isClearingDocuments, setIsClearingDocuments] = useState(false);
//   const popupRef = useRef<HTMLDivElement>(null);
//   const docPopupRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     const storedData = localStorage.getItem("loginData");
//     if (storedData) {
//       const parsedData = JSON.parse(storedData);
//       setLoginData(parsedData);

//       const fetchNotifications = async () => {
//         try {
//           const token = localStorage.getItem("authToken")?.replace(/^"|"$/g, '');
//           const userId = parsedData.id;

//           const response = await axios.get(
//             `${API_URL}/notifications/user/${userId}`,
//             {
//               headers: {
//                 Authorization: `Bearer ${token}`,
//               },
//             }
//           );

//           const notificationsArray = response.data?.data;
//           if (Array.isArray(notificationsArray) && notificationsArray.length > 0) {
//             setNotifications(notificationsArray);
//           } else {
//             setNotifications([]);
//           }
//         } catch (error) {
//           console.error("Failed to fetch notifications:", error);
//         }
//       };

//       const fetchDocumentRequests = async () => {
//         try {
//           const token = localStorage.getItem("authToken")?.replace(/^"|"$/g, '');
//           const userId = parsedData.id;
//           const response = await axios.get(
//             `${API_URL}/document/user/${userId}`,
//             {
//               headers: {
//                 Authorization: `Bearer ${token}`,
//               },
//             }
//           );

//           const requestsArray = response.data?.data;
//           if (Array.isArray(requestsArray) && requestsArray.length > 0) {
//             setDocumentRequests(requestsArray);
//           } else {
//             setDocumentRequests([]);
//           }
//         } catch (error) {
//           console.error("Failed to fetch document access requests:", error);
//         }
//       };

//       fetchNotifications();
//       fetchDocumentRequests();
//     }
//   }, []);

//   useEffect(() => {
//     function handleClickOutside(event: MouseEvent) {
//       if (
//         popupRef.current &&
//         !popupRef.current.contains(event.target as Node)
//       ) {
//         setShowNotifications(false);
//       }
//       if (
//         docPopupRef.current &&
//         !docPopupRef.current.contains(event.target as Node)
//       ) {
//         setShowDocumentApplicants(false);
//       }
//     }

//     if (showNotifications || showDocumentApplicants) {
//       document.addEventListener("mousedown", handleClickOutside);
//     } else {
//       document.removeEventListener("mousedown", handleClickOutside);
//     }

//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, [showNotifications, showDocumentApplicants]);

//   const handleClearAllNotifications = async () => {
//     setIsClearingNotifications(true);
//     const token = localStorage.getItem("authToken")?.replace(/^"|"$/g, '');

//     try {
//       await Promise.all(
//         notifications.map((notif) =>
//           axios.delete(`${API_URL}/notifications/${notif.id}`, {
//             headers: { Authorization: `Bearer ${token}` },
//           })
//         )
//       );
//       toast.success("All notifications cleared");
//       setNotifications([]);
//     } catch (err) {
//       toast.error("Failed to clear notifications");
//       console.error(err);
//     } finally {
//       setIsClearingNotifications(false);
//     }
//   };

//   const handleClearAllDocuments = async () => {
//     setIsClearingDocuments(true);
//     const token = localStorage.getItem("authToken")?.replace(/^"|"$/g, '');

//     try {
//       await Promise.all(
//         documentRequests.map((req) =>
//           axios.delete(`${API_URL}/document-access-requests/${req.id}`, {
//             headers: { Authorization: `Bearer ${token}` },
//           })
//         )
//       );
//       toast.success("All document access requests cleared");
//       setDocumentRequests([]);
//     } catch (err) {
//       toast.error("Failed to clear document access requests");
//       console.error(err);
//     } finally {
//       setIsClearingDocuments(false);
//     }
//   };

//   const extractDocumentName = (url: string) => {
//     if (typeof url !== "string") return "Unnamed Document";
//     const parts = url.split("/");
//     const fileNameWithExt = decodeURIComponent(parts.pop() || "Unnamed Document");
//     const namePart = fileNameWithExt.split("-").slice(1).join("-").split(".").slice(0, -1).join(".");
//     return namePart || "Unnamed Document";
//   };

//   const shouldShowCreateProfile =
//     roleId === 3 && !loginData?.individualProfessional?.profileData?.availability;

//   const isSubscriber = loginData?.isSubscriber;
//   const subscriptionTier = loginData?.subscriptionTier;

//   const menuItems = [
//     { icon: <FaSearch />, label: "My Searches" },
//     { icon: <FaHeart />, label: "My Favourites" },
//     {
//       icon: <FaUserShield />,
//       label: roleId !== 3 ? "My Job Applicants" : "Visitors",
//       route: roleId !== 3 ? "/my-job-applicants" : "/visitors",
//     },
//     ...(roleId !== 3 && isSubscriber && subscriptionTier !== "Basic"
//       ? [{ icon: <FaCogs />, label: "My Ads", route: "/my-ads" }]
//       : []),
//     { icon: <FaSearch />, label: "Advance Search" },
//     { icon: <FaCogs />, label: "Customer Support" },
//     ...(isSubscriber && subscriptionTier !== "Basic"
//       ? [
//           { icon: <FaBell />, label: "Notifications", isNotification: true },
//         ]
//       : []),
//    ...(roleId === 3 && isSubscriber && subscriptionTier !== "Basic"
//       ? [{ icon: <FiFileText />, label: "Document Applicants",route: "/document-applicants",  isDocumentApplicants: true }]
//       : []),
      
//     ...(roleId !== 3
//       ? isSubscriber && subscriptionTier !== "Basic"
//         ? [{ icon: <FaAd />, label: "Post Free Ad", route: "/post-ad" }]
//         : []
//       : [{ icon: <FaAd />, label: "View Jobs", route: "/view-ads" }]),
//     ...(shouldShowCreateProfile
//       ? [
//           {
//             icon: <FaUserPlus />,
//             label: "Create Public Profile",
//             route: "/public-profile",
//           },
//         ]
//       : []),
//   ];

//   const handleMenuClick = (item: any) => {
//     if (item.isNotification) {
//       setShowNotifications((prev) => !prev);
//       setShowDocumentApplicants(false); // Close Document Applicants popup if open
//     } else if (item.isDocumentApplicants) {
//       setShowDocumentApplicants((prev) => !prev);
//       setShowNotifications(false); // Close Notifications popup if open
//     } else if (item.route) {
//       router.push(item.route);
//     }
//   };

//   return (
//     <div className="grid grid-cols-2 md:grid-cols-3 gap-4 relative">
//       {menuItems.map((item, index) => (
//         <div
//           key={index}
//           onClick={() => handleMenuClick(item)}
//           className="cursor-pointer p-4 bg-gray-100 rounded-lg shadow-sm hover:bg-gray-200 transition text-center relative"
//         >
//           <div className="text-2xl relative inline-block">
//             {item.icon}
//             {item.isNotification && notifications.length > 0 && (
//               <span className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full text-xs px-1">
//                 {notifications.length}
//               </span>
//             )}
//             {item.isDocumentApplicants && documentRequests.length > 0 && (
//               <span className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full text-xs px-1">
//                 {documentRequests.length}
//               </span>
//             )}
//           </div>
//           <p className="text-sm mt-1">{item.label}</p>
//         </div>
//       ))}

//       {showNotifications && (
//         <div
//           ref={popupRef}
//           className="absolute right-0 top-24 bg-white shadow-lg rounded-lg w-80 z-50 p-4 max-h-96 overflow-y-auto"
//         >
//           <div className="flex justify-between items-center mb-3">
//             <h4 className="font-semibold text-lg">Notifications</h4>
//             {notifications.length > 0 && (
//               <button
//                 className="text-sm text-red-600 hover:underline"
//                 onClick={handleClearAllNotifications}
//                 disabled={isClearingNotifications}
//               >
//                 {isClearingNotifications ? "Clearing..." : "Clear All"}
//               </button>
//             )}
//           </div>

//           {isClearingNotifications ? (
//             <p className="text-center text-gray-500">Clearing notifications...</p>
//           ) : notifications.length === 0 || notifications === null ? (
//             <p className="text-gray-500 text-center">No new notifications</p>
//           ) : (
//             notifications.map((notif) => (
//               <div key={notif.id} className="flex items-start gap-3 p-2 border-b">
//                 <div className="flex-1">
//                   <p className="text-sm">
//                     {typeof notif?.message === "string"
//                       ? notif.message.split(":")[1]?.trim()
//                       : ""}
//                   </p>
//                   <Link href={`public-profile/${notif?.relatedUserId}`}>
//                     <p className="text-xs text-gray-500">
//                       {typeof notif?.message === "string"
//                         ? notif.message.split(":")[0]?.trim()
//                         : ""}
//                     </p>
//                   </Link>
//                 </div>
//               </div>
//             ))
//           )}
//         </div>
//       )}

//       {showDocumentApplicants && (
//         <div
//           ref={docPopupRef}
//           className="absolute right-0 top-24 bg-white shadow-lg rounded-lg w-80 z-50 p-4 max-h-96 overflow-y-auto"
//         >
//           <div className="flex justify-between items-center mb-3">
//             <h4 className="font-semibold text-lg">Document Applicants</h4>
//             {documentRequests.length > 0 && (
//               <button
//                 className="text-sm text-red-600 hover:underline"
//                 onClick={handleClearAllDocuments}
//                 disabled={isClearingDocuments}
//               >
//                 {isClearingDocuments ? "Clearing..." : "Clear All"}
//               </button>
//             )}
//           </div>

//           {isClearingDocuments ? (
//             <p className="text-center text-gray-500">Clearing document requests...</p>
//           ) : documentRequests.length === 0 ? (
//             <p className="text-gray-500 text-center">No document access requests</p>
//           ) : (
//             documentRequests.map((req) => (
//               <div key={req.id} className="flex items-start gap-3 p-2 border-b">
//                 <div className="flex-1">
//                   <p className="text-sm">
//                     <span className="font-semibold">{req.requester.firstName} {req.requester.lastName}</span> requested access to{" "}
//                     <span className="text-blue-600">{extractDocumentName(req.documentUrl)}</span>
//                   </p>
//                   <p className="text-xs text-gray-500">
//                     Requested on: {new Date(req.createdAt).toLocaleString()}
//                   </p>
//                   <Link href={`/public-profile/${req.requesterId}`}>
//                     <p className="text-xs text-blue-600 hover:underline">
//                       View Profile
//                     </p>
//                   </Link>
//                 </div>
//               </div>
//             ))
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default ProfileMenu;
