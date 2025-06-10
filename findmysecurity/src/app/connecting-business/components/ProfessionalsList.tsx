"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import GenericModal from "@/sections/components/modal/GenericModal";
import AnimateOnScrollProvider from "@/sections/components/animation/AnimateOnScrollProvider";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import axios from "axios";
import toast from "react-hot-toast";
import { API_URL } from "@/utils/path";

interface Professional {
  id: number;
  individualProfessionalId: number;
  hourlyRate: string;
  aboutMe?: string;
  availabilityDescription?: string | null;
  createdAt: string;
  experience?: string;
  feesDescription?: string | null;
  gender?: string;
  homeTelephone?: string;
  mobileTelephone?: string;
  otherService?: string;
  postcode?: string;
  profileHeadline?: string;
  profilePhoto?: string;
  qualifications?: string;
  screenName?: string;
  securityServicesOfferings: string[];
  serviceRequirements?: string[];
  updatedAt: string;
  website?: string;
  weeklySchedule?: {
    Evening?: Record<string, boolean>;
    Afternoon?: Record<string, boolean>;
    Morning?: Record<string, boolean>;
    Overnight?: Record<string, boolean>;
  };
  individualProfessional: {
    id: number;
    userId: number;
    permissions: Record<string, any>;
    createdAt: string;
    updatedAt: string;
    user?: {
      firstName?: string;
      lastName?: string;
      address?: string;
    };
  };
}

interface ProfessionalsListProps {
  apiData: {
    totalCount: number;
    page: number;
    pageSize: number;
    count: number;
    lastPage: number;
    professionals: Professional[];
  } | null;
  loading: boolean;
  error: string | null;
}

export default function ProfessionalsList({
  apiData,
  loading,
  error,
}: ProfessionalsListProps) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-5xl mx-auto my-20">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg md:text-xl font-semibold">
          Available Professionals {apiData && `(${apiData.totalCount} found)`}
        </h2>
      </div>

      {loading && (
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          {error}
        </div>
      )}

      {!loading && apiData && (
        apiData.professionals.length > 0 ? (
          <div className="grid grid-cols-1 gap-6">
            {apiData.professionals.map((professional) => (
              <ProfessionalCard key={professional.id} professional={professional} />
            ))}
          </div>
        ) : (
          <div className="text-center py-10 text-gray-500 bg-white rounded-lg border border-gray-200">
            No professionals found matching your criteria.
          </div>
        )
      )}
    </div>
  );
}

// const LocationIcon = () => (
//   <svg
//     className="w-4 h-4"
//     fill="none"
//     stroke="currentColor"
//     viewBox="0 0 24 24"
//     xmlns="http://www.w3.org/2000/svg"
//   >
//     <path
//       strokeLinecap="round"
//       strokeLinejoin="round"
//       strokeWidth={2}
//       d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
//     />
//     <path
//       strokeLinecap="round"
//       strokeLinejoin="round"
//       strokeWidth={2}
//       d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
//     />
//   </svg>
// );

const ProfessionalCard = ({ professional }: { professional: Professional }) => {
  const [showModal, setShowModal] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [favorites, setFavorites] = useState<number[]>([]);
  const router = useRouter();

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("authToken")?.replace(/^"|"$/g, "")
      : null;

  const userId =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("loginData") || "{}").id
      : null;

  const isFavorited = favorites.includes(professional.individualProfessional.userId);

  useEffect(() => {
    if (!token || !userId) return;

    const fetchFavorites = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/favorites/${userId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const favoritesArray = Array.isArray(response.data)
          ? response.data
          : response.data.data || response.data.favorites || [];

        setFavorites(favoritesArray.map((fav: any) => fav.targetUserId));
      } catch (err) {
        console.error("Failed to fetch favorites:", err);
      }
    };

    fetchFavorites();
  }, [token, userId]);

  const handleFavorite = async (targetId: number) => {
    if (!token) {
      setShowLoginPrompt(true);
      return;
    }

    const alreadyFavorited = favorites.includes(targetId);

    try {
      if (alreadyFavorited) {
        await axios.delete(
          `${API_URL}/favorites`,
          {
            data: { userId, targetUserId: targetId },
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        toast.success("Favorite successfully removed!");
        setFavorites((prev) => prev.filter((id) => id !== targetId));
      } else {
        const response = await axios.post(
          `${API_URL}/favorites`,
          { userId, targetUserId: targetId },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        toast.success(response.data.message || "Favorite added!");
        setFavorites((prev) => [...prev, targetId]);
      }
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Something went wrong with favorite action"
      );
      console.error(error?.response?.data || error.message);
    }
  };

  const handleViewProfile = () => {
    if (!token) {
      setShowLoginPrompt(true);
      return;
    }
    router.push(`/public-profile/${professional.individualProfessional.userId}`);
  };

  const handleCloseModal = () => setShowModal(false);
  const handleCloseLoginPrompt = () => {
    setShowLoginPrompt(false);
    router.push("/signin");
  };

  const getDisplayName = () =>
    professional?.screenName ||
    `${professional.individualProfessional?.user?.firstName || ''} ${
      professional.individualProfessional?.user?.lastName || ''
    }`.trim() ||
    "Unknown Professional";

  const getHourlyRate = () =>
    professional?.hourlyRate ? `£${professional.hourlyRate}/hr` : "Rate not specified";

  return (
    <>
      <AnimateOnScrollProvider>
        <div
          className="relative rounded-2xl p-6 bg-white hover:shadow-xl transition-all border border-gray-100 hover:border-transparent hover:ring-2 hover:ring-indigo-400"
          data-aos="fade-up"
        >
          <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-4">
            <div className="flex-shrink-0">
              {professional?.profilePhoto ? (
                <img
                  src={professional.profilePhoto}
                  alt="Profile"
                  className={`w-20 h-20 rounded-full object-cover border-2 border-indigo-200 shadow-sm ${
                    token ? "" : "blur-sm"
                  }`}
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 text-sm border border-gray-200">
                  N/A
                </div>
              )}
            </div>

            <div className="flex flex-col justify-between">
              <div>
                <h3 className={`text-xl font-semibold text-gray-900 ${token ? "" : "blur-sm"}`}>
                  {getDisplayName()}
                </h3>
                {professional?.profileHeadline && (
                  <p className={`text-gray-500 mt-1 text-sm ${token ? "" : "blur-sm"}`}>
                    {professional.profileHeadline}
                  </p>
                )}
              </div>

              <div className={`mt-3 flex flex-wrap gap-2 ${token ? "" : "blur-sm"}`}>
                {professional?.securityServicesOfferings?.slice(0, 3).map((service, index) => (
                  <span
                    key={index}
                    className="bg-indigo-50 text-indigo-700 text-xs px-3 py-1 rounded-full border border-indigo-200"
                  >
                    {service}
                  </span>
                ))}
                {(professional?.securityServicesOfferings?.length ?? 0) > 3 && (
                  <span className="bg-indigo-50 text-indigo-700 text-xs px-3 py-1 rounded-full border border-indigo-200">
                    +{(professional.securityServicesOfferings?.length ?? 0) - 3} more
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-[1fr_auto] gap-4 mt-6 items-start">
            <div className="flex flex-col gap-2">
              {professional?.individualProfessional?.user?.address && (
                <p className={`text-sm text-gray-400 flex items-center gap-1 ${token ? "" : "blur-sm"}`}>
                  <LocationIcon />
                  {professional.individualProfessional.user.address}
                </p>
              )}
              <div className="flex items-center gap-4">
                <span className={`text-lg font-bold text-gray-900 ${token ? "" : "blur-sm"}`}>
                  {getHourlyRate()}
                </span>
                {professional?.experience && (
                  <span className={`text-gray-500 text-sm ${token ? "" : "blur-sm"}`}>
                    {professional.experience} years exp.
                  </span>
                )}
              </div>
            </div>

            <div className="flex gap-4 items-center justify-end">
              <button
                className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-md px-4 py-2 text-sm font-semibold"
                onClick={handleViewProfile}
              >
                View Profile
              </button>
              <button
                className="text-2xl text-indigo-600 hover:text-indigo-800 transition"
                onClick={() => handleFavorite(professional.individualProfessional.userId)}
                title={isFavorited ? "Remove from favorites" : "Add to favorites"}
              >
                {isFavorited ? (
                  <FaHeart className="text-indigo-600" />
                ) : (
                  <FaRegHeart />
                )}
              </button>
            </div>
          </div>
        </div>
      </AnimateOnScrollProvider>

      {showModal && (
        <GenericModal
          show={showModal}
          onClose={handleCloseModal}
          icon={null}
          title={`${getDisplayName()}'s Profile`}
          message={professional.profileHeadline || "More profile details..."}
          buttonText="Close"
        />
      )}

      {showLoginPrompt && (
        <GenericModal
          show={true}
          onClose={handleCloseLoginPrompt}
          icon={
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100">
              <svg
                className="h-6 w-6 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
          }
          title="Login Required"
          message="You need to be logged in to perform this action."
          buttonText="Go to Login"
        />
      )}
    </>
  );
};









// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import GenericModal from "@/sections/components/modal/GenericModal";
// import AnimateOnScrollProvider from "@/sections/components/animation/AnimateOnScrollProvider";
// import { FaHeart, FaRegHeart } from "react-icons/fa";
// import axios from "axios";
// import toast from "react-hot-toast";

// interface Professional {
//   id: number;
//   individualProfessionalId: number;
//   hourlyRate: string;
//   aboutMe?: string;
//   availabilityDescription?: string | null;
//   createdAt: string;
//   experience?: string;
//   feesDescription?: string | null;
//   gender?: string;
//   homeTelephone?: string;
//   mobileTelephone?: string;
//   otherService?: string;
//   postcode?: string;
//   profileHeadline?: string;
//   profilePhoto?: string;
//   qualifications?: string;
//   screenName?: string;
//   securityServicesOfferings: string[];
//   serviceRequirements?: string[];
//   updatedAt: string;
//   website?: string;
//   weeklySchedule?: {
//     Evening?: Record<string, boolean>;
//     Afternoon?: Record<string, boolean>;
//     Morning?: Record<string, boolean>;
//     Overnight?: Record<string, boolean>;
//   };
//   individualProfessional: {
//     id: number;
//     userId: number;
//     permissions: Record<string, any>;
//     createdAt: string;
//     updatedAt: string;
//     user?: {
//       firstName?: string;
//       lastName?: string;
//       address?: string;
//     };
//   };
// }

// interface ProfessionalsListProps {
//   apiData: {
//     totalCount: number;
//     page: number;
//     pageSize: number;
//     count: number;
//     lastPage: number;
//     professionals: Professional[];
//   } | null;
//   loading: boolean;
//   error: string | null;
// }

// export default function ProfessionalsList({
//   apiData,
//   loading,
//   error,
// }: ProfessionalsListProps) {
//   return (
//     <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-5xl mx-auto my-20">
//       <div className="flex justify-between items-center mb-4">
//         <h2 className="text-lg md:text-xl font-semibold">
//           Available Professionals{" "}
//           {apiData && `(${apiData.totalCount} found)`}
//         </h2>
//       </div>

//       {loading && (
//         <div className="flex justify-center items-center py-10">
//           <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
//         </div>
//       )}

//       {error && (
//         <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
//           {error}
//         </div>
//       )}

//       {!loading && apiData && (
//         apiData.professionals.length > 0 ? (
//           <div className="grid grid-cols-1 gap-6">
//             {apiData.professionals.map((professional) => (
//               <ProfessionalCard
//                 key={professional.id}
//                 professional={professional}
//               />
//             ))}
//           </div>
//         ) : (
//           <div className="text-center py-10 text-gray-500 bg-white rounded-lg border border-gray-200">
//             No professionals found matching your criteria.
//           </div>
//         )
//       )}
//     </div>
//   );
// }

// const ProfessionalCard = ({ professional }: { professional: Professional }) => {
//   const [showModal, setShowModal] = useState(false);
//   const [showLoginPrompt, setShowLoginPrompt] = useState(false);
//   const [favorites, setFavorites] = useState<number[]>([]);
//   const router = useRouter();

//   const token =
//     typeof window !== "undefined"
//       ? localStorage.getItem("authToken")?.replace(/^"|"$/g, "")
//       : null;

//   const userId =
//     typeof window !== "undefined"
//       ? JSON.parse(localStorage.getItem("loginData") || "{}").id
//       : null;

//   const isFavorited = favorites.includes(professional.individualProfessional.userId);

//   useEffect(() => {
//     if (!token || !userId) return;

//     const fetchFavorites = async () => {
//       try {
//         const response = await axios.get(
//           `https://ub1b171tga.execute-api.eu-north-1.amazonaws.com/dev/favorites/${userId}`,
//           { headers: { Authorization: `Bearer ${token}` } }
//         );

//         const favoritesArray = Array.isArray(response.data)
//           ? response.data
//           : response.data.data || response.data.favorites || [];

//         setFavorites(favoritesArray.map((fav: any) => fav.targetUserId));
//       } catch (err) {
//         console.error("Failed to fetch favorites:", err);
//       }
//     };

//     fetchFavorites();
//   }, [token, userId]);

//   const handleFavorite = async (targetId: number) => {
//     if (!token) {
//       setShowLoginPrompt(true);
//       return;
//     }

//     const alreadyFavorited = favorites.includes(targetId);

//     try {
//       if (alreadyFavorited) {
//         // REMOVE from favorites
//         await axios.delete(
//           "https://ub1b171tga.execute-api.eu-north-1.amazonaws.com/dev/favorites",
//           {
//             data: { userId, targetUserId: targetId },
//             headers: {
//               Authorization: `Bearer ${token}`,
//               "Content-Type": "application/json",
//             },
//           }
//         );

//         toast.success("Favorite successfully removed!");
//         setFavorites((prev) => prev.filter((id) => id !== targetId));
//       } else {
//         // ADD to favorites
//         const response = await axios.post(
//           "https://ub1b171tga.execute-api.eu-north-1.amazonaws.com/dev/favorites",
//           { userId, targetUserId: targetId },
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//               "Content-Type": "application/json",
//             },
//           }
//         );

//         toast.success(response.data.message || "Favorite added!");
//         setFavorites((prev) => [...prev, targetId]);
//       }
//     } catch (error: any) {
//       toast.error(
//         error?.response?.data?.message ||
//           "Something went wrong with favorite action"
//       );
//       console.error(error?.response?.data || error.message);
//     }
//   };

//   const handleViewProfile = () => {
//     if (!token) {
//       setShowLoginPrompt(true);
//       return;
//     }
//     router.push(`/public-profile/${professional.individualProfessional.userId}`);
//   };
  
//   const handleCloseModal = () => setShowModal(false);
//   const handleCloseLoginPrompt = () => {
//     setShowLoginPrompt(false);
//     router.push("/signin");
//   };

//   const getDisplayName = () => 
//     professional?.screenName || 
//     `${professional.individualProfessional?.user?.firstName || ''} ${professional.individualProfessional?.user?.lastName || ''}`.trim() || 
//     'No name provided';

//   const getHourlyRate = () =>
//     professional?.hourlyRate ? `£${professional.hourlyRate}/hr` : "Rate not specified";

//   return (
//     <>
//       <AnimateOnScrollProvider>
//         <div
//           className="relative rounded-2xl p-6 bg-white hover:shadow-xl transition-all border border-gray-100 hover:border-transparent hover:ring-2 hover:ring-indigo-400"
//           data-aos="fade-up"
//         >
//           {/* Profile Content */}
//           <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-4">
//             <div className="flex-shrink-0">
//               {professional?.profilePhoto ? (
//                 <img
//                   src={professional.profilePhoto}
//                   alt="Profile"
//                   className={`w-20 h-20 rounded-full object-cover border-2 border-indigo-200 shadow-sm ${
//                     token ? "" : "blur-sm"
//                   }`}
//                 />
//               ) : (
//                 <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 text-sm border border-gray-200">
//                   N/A
//                 </div>
//               )}
//             </div>

//             <div className="flex flex-col justify-between">
//               <div>
//                 <h3 className={`text-xl font-semibold text-gray-900 ${token ? "" : "blur-sm"}`}>
//                   {getDisplayName()}
//                 </h3>
//                 {professional?.profileHeadline && (
//                   <p className={`text-gray-500 mt-1 text-sm ${token ? "" : "blur-sm"}`}>
//                     {professional.profileHeadline}
//                   </p>
//                 )}
//               </div>

//               <div className={`mt-3 flex flex-wrap gap-2 ${token ? "" : "blur-sm"}`}>
//                 {professional?.securityServicesOfferings?.slice(0, 3).map((service, index) => (
//                   <span
//                     key={index}
//                     className="bg-indigo-50 text-indigo-700 text-xs px-3 py-1 rounded-full border border-indigo-200"
//                   >
//                     {service}
//                   </span>
//                 ))}
//                 {(professional?.securityServicesOfferings?.length ?? 0) > 3 && (
//                   <span className="bg-indigo-50 text-indigo-700 text-xs px-3 py-1 rounded-full border border-indigo-200">
//                     +{(professional.securityServicesOfferings?.length ?? 0) - 3} more
//                   </span>
//                 )}
//               </div>
//             </div>
//           </div>

//           <div className="grid md:grid-cols-[1fr_auto] gap-4 mt-6 items-start">
//             <div className="flex flex-col gap-2">
//               {professional?.individualProfessional?.user?.address && (
//                 <p className={`text-sm text-gray-400 flex items-center gap-1 ${token ? "" : "blur-sm"}`}>
//                   <LocationIcon />
//                   {professional.individualProfessional.user.address}
//                 </p>
//               )}
//               <div className="flex items-center gap-4">
//                 <span className={`text-lg font-bold text-gray-900 ${token ? "" : "blur-sm"}`}>
//                   {getHourlyRate()}
//                 </span>
//                 {professional?.experience && (
//                   <span className={`text-gray-500 text-sm ${token ? "" : "blur-sm"}`}>
//                     {professional.experience} years exp.
//                   </span>
//                 )}
//               </div>
//             </div>

//             <div className="flex gap-4 items-center justify-end">
//               <button
//                 className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-md px-4 py-2 text-sm font-semibold cursor-pointer"
//                 onClick={handleViewProfile}
//               >
//                 View Profile
//               </button>
//               <button
//   className="text-2xl text-indigo-600 transition hover:scale-110 cursor-pointer"
//   onClick={() => handleFavorite(professional.individualProfessional.userId)}
//   title={isFavorited ? "Remove from favorites" : "Add to favorites"}
// >
//   {isFavorited ? (
//     <FaHeart className="text-indigo-600 hover:text-red-600 transition-colors duration-200" />
//   ) : (
//     <FaRegHeart className="hover:text-indigo-800 transition-colors duration-200" />
//   )}
// </button>

//             </div>
//           </div>
//         </div>
//       </AnimateOnScrollProvider>

//       {showModal && (
//         <GenericModal
//           show={showModal}
//           onClose={handleCloseModal}
//           icon={null}
//           title={`${getDisplayName()}'s Profile`}
//           message={professional.profileHeadline || "More profile details..."}
//           buttonText="Close"
//         />
//       )}

//       {showLoginPrompt && (
//         <GenericModal
//           show={true}
//           onClose={handleCloseLoginPrompt}
//           icon={
//             <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100">
//               <svg
//                 className="h-6 w-6 text-blue-600"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
//                 />
//               </svg>
//             </div>
//           }
//           title="Login Required"
//           message="You need to be logged in to perform this action."
//           buttonText="Go to Login"
//         />
//       )}
//     </>
//   );
// };










// const LocationIcon = () => (
//   <svg
//     xmlns="http://www.w3.org/2000/svg"
//     className="h-4 w-4"
//     fill="none"
//     viewBox="0 0 24 24"
//     stroke="currentColor"
//   >
//     <path
//       strokeLinecap="round"
//       strokeLinejoin="round"
//       strokeWidth={2}
//       d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
//     />
//     <path
//       strokeLinecap="round"
//       strokeLinejoin="round"
//       strokeWidth={2}
//       d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
//     />
//   </svg>
// );


// import { useEffect, useState } from "react";
// import { ApiResponse, Professional } from "../types";
// import GenericModal from "@/sections/components/modal/GenericModal";
// import { useRouter } from "next/navigation";
// import AnimateOnScrollProvider from "@/sections/components/animation/AnimateOnScrollProvider";
// import { FaHeart, FaRegHeart } from "react-icons/fa";
// import axios from "axios";
// import toast from "react-hot-toast";

// interface ProfessionalsListProps {
//   apiData: ApiResponse | null;
//   loading: boolean;
//   error: string | null;
// }

// const getDisplayName = (professional: Professional) =>
//   professional?.profile?.screenName ||
//   `${professional.user.firstName} ${professional.user.lastName}`;

// const getHourlyRate = (professional: Professional) =>
//   professional.profile?.hourlyRate
//     ? `£${professional.profile?.hourlyRate}/hr`
//     : "Rate not specified";

// export default function ProfessionalsList({
//   apiData,
//   loading,
//   error,
// }: ProfessionalsListProps) {
//   return (
//     <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-5xl mx-auto my-20">
//       <div className="flex justify-between items-center mb-4">
//         <h2 className="text-lg md:text-xl font-semibold">
//           Available Professionals{" "}
//           {apiData && `(${apiData.totalCount} found)`}
//         </h2>
//       </div>

//       {loading && (
//         <div className="flex justify-center items-center py-10">
//           <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
//         </div>
//       )}

//       {error && (
//         <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
//           {error}
//         </div>
//       )}

//       {!loading && apiData && (
//         apiData.professionals.length > 0 ? (
//           <div className="grid grid-cols-1 gap-6">
//             {apiData.professionals.map((professional) => (
//               <ProfessionalCard
//                 key={professional.id}
//                 professional={professional}
//               />
//             ))}
//           </div>
//         ) : (
//           <div className="text-center py-10 text-gray-500 bg-white rounded-lg border border-gray-200">
//             No professionals found matching your criteria.
//           </div>
//         )
//       )}
//     </div>
//   );
// }
// const ProfessionalCard = ({ professional }: { professional: Professional }) => {
//   const [showModal, setShowModal] = useState(false);
//   const [showLoginPrompt, setShowLoginPrompt] = useState(false);
//   const [favorites, setFavorites] = useState<number[]>([]);
//   const router = useRouter();

//   const token =
//     typeof window !== "undefined"
//       ? localStorage.getItem("authToken")?.replace(/^"|"$/g, "")
//       : null;

//   const userId =
//     typeof window !== "undefined"
//       ? JSON.parse(localStorage.getItem("loginData") || "{}").id
//       : null;

//   const isFavorited = favorites.includes(professional.userId);

//   useEffect(() => {
//     if (!token || !userId) return;

//     const fetchFavorites = async () => {
//       try {
//         const response = await axios.get(
//           `https://ub1b171tga.execute-api.eu-north-1.amazonaws.com/dev/favorites/${userId}`,
//           { headers: { Authorization: `Bearer ${token}` } }
//         );

//         const favoritesArray = Array.isArray(response.data)
//           ? response.data
//           : response.data.data || response.data.favorites || [];

//         setFavorites(favoritesArray.map((fav: any) => fav.targetUserId));
//       } catch (err) {
//         console.error("Failed to fetch favorites:", err);
//       }
//     };

//     fetchFavorites();
//   }, [token, userId]);

//   const handleFavorite = async (targetId: number) => {
//     if (!token) {
//       setShowLoginPrompt(true);
//       return;
//     }

//     const alreadyFavorited = favorites.includes(targetId);

//     try {
//       if (alreadyFavorited) {
//         // REMOVE from favorites
//         await axios.delete(
//           "https://ub1b171tga.execute-api.eu-north-1.amazonaws.com/dev/favorites",
//           {
//             data: { userId, targetUserId: targetId },
//             headers: {
//               Authorization: `Bearer ${token}`,
//               "Content-Type": "application/json",
//             },
//           }
//         );

//         toast.success("Favorite successfully removed!");
//         setFavorites((prev) => prev.filter((id) => id !== targetId));
//       } else {
//         // ADD to favorites
//         const response = await axios.post(
//           "https://ub1b171tga.execute-api.eu-north-1.amazonaws.com/dev/favorites",
//           { userId, targetUserId: targetId },
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//               "Content-Type": "application/json",
//             },
//           }
//         );

//         toast.success(response.data.message || "Favorite added!");
//         setFavorites((prev) => [...prev, targetId]);
//       }
//     } catch (error: any) {
//       toast.error(
//         error?.response?.data?.message ||
//           "Something went wrong with favorite action"
//       );
//       console.error(error?.response?.data || error.message);
//     }
//   };

//   const handleViewProfile = () => {
//     if (!token) {
//       setShowLoginPrompt(true);
//       return;
//     }
//     router.push(`/public-profile/${professional.userId}`);
//   };
  
//   const handleCloseModal = () => setShowModal(false);
//   const handleCloseLoginPrompt = () => {
//     setShowLoginPrompt(false);
//     router.push("/signin");
//   };

//   return (
//     <>
//       <AnimateOnScrollProvider>
//         <div
//           className="relative rounded-2xl p-6 bg-white hover:shadow-xl transition-all border border-gray-100 hover:border-transparent hover:ring-2 hover:ring-indigo-400"
//           data-aos="fade-up"
//         >
//           {/* Profile Content */}
//           <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-4">
//             <div className="flex-shrink-0">
//               {professional.profile?.profilePhoto || professional.user.profile? (
//                 <img
//                   src={professional?.profile?.profilePhoto? professional?.profile.profilePhoto : professional.user.profile}
//                   alt="Profile"
//                   className={`w-20 h-20 rounded-full object-cover border-2 border-indigo-200 shadow-sm ${
//                     token ? "" : "blur-sm"
//                   }`}
//                 />
//               ) : (
//                 <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 text-sm border border-gray-200">
//                   N/A
//                 </div>
//               )}
//             </div>

//             <div className="flex flex-col justify-between">
//               <div>
//                 <h3
//                   className={`text-xl font-semibold text-gray-900 ${
//                     token ? "" : "blur-sm"
//                   }`}
//                 >
//                   {getDisplayName(professional)}
//                 </h3>
//                 {professional.profile?.profileHeadline && (
//                   <p
//                     className={`text-gray-500 mt-1 text-sm ${
//                       token ? "" : "blur-sm"
//                     }`}
//                   >
//                     {professional.profile?.profileHeadline}
//                   </p>
//                 )}
//               </div>

//               <div className={`mt-3 flex flex-wrap gap-2 ${token ? "" : "blur-sm"}`}>
//                 {professional.profile?.securityServicesOfferings.slice(0, 3).map((service, index) => (
//                   <span
//                     key={index}
//                     className="bg-indigo-50 text-indigo-700 text-xs px-3 py-1 rounded-full border border-indigo-200"
//                   >
//                     {service}
//                   </span>
//                 ))}
//                 {(professional.profile?.serviceRequirements.length ?? 0) > 3 && (
//                   <span className="bg-indigo-50 text-indigo-700 text-xs px-3 py-1 rounded-full border border-indigo-200">
//                     +{(professional.profile?.serviceRequirements.length ?? 0) - 3} more
//                   </span>
//                 )}
//               </div>
//             </div>
//           </div>

//           <div className="grid md:grid-cols-[1fr_auto] gap-4 mt-6 items-start">
//             <div className="flex flex-col gap-2">
//               {professional.user.address && (
//                 <p
//                   className={`text-sm text-gray-400 flex items-center gap-1 ${
//                     token ? "" : "blur-sm"
//                   }`}
//                 >
//                   <LocationIcon />
//                   {professional.user.address}
//                 </p>
//               )}
//               <div className="flex items-center gap-4">
//                 <span
//                   className={`text-lg font-bold text-gray-900 ${
//                     token ? "" : "blur-sm"
//                   }`}
//                 >
//                   {getHourlyRate(professional)}
//                 </span>
//                 {professional.profile?.experience && (
//                   <span
//                     className={`text-gray-500 text-sm ${
//                       token ? "" : "blur-sm"
//                     }`}
//                   >
//                     {professional.profile.experience} years exp.
//                   </span>
//                 )}
//               </div>
//             </div>

//             <div className="flex gap-4 items-center justify-end">
//               <button
//                 className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-md px-4 py-2 text-sm font-semibold"
//                 onClick={handleViewProfile}
//               >
//                 View Profile
//               </button>
//               <button
//                 className="text-2xl text-indigo-600 hover:text-indigo-800 transition"
//                 onClick={() => handleFavorite(professional.userId)}
//                 title={
//                   isFavorited ? "Remove from favorites" : "Add to favorites"
//                 }
//               >
//                 {isFavorited ? (
//                   <FaHeart className="text-indigo-600" />
//                 ) : (
//                   <FaRegHeart />
//                 )}
//               </button>
//             </div>
//           </div>
//         </div>
//       </AnimateOnScrollProvider>

//       {showModal && (
//   <GenericModal
//     show={showModal}
//     onClose={handleCloseModal}
//     icon={null}
//     title={`${getDisplayName(professional)}'s Profile`}
//     message={professional.profile?.profileHeadline || "More profile details..."}
//     buttonText="Close"
//   />
// )}

// {showLoginPrompt && (
//   <GenericModal
//     show={true}
//     onClose={handleCloseLoginPrompt}
//     icon={
//       <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100">
//         <svg
//           className="h-6 w-6 text-blue-600"
//           fill="none"
//           viewBox="0 0 24 24"
//           stroke="currentColor"
//         >
//           <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             strokeWidth={2}
//             d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
//           />
//         </svg>
//       </div>
//     }
//     title="Login Required"
//     message="You need to be logged in to perform this action."
//     buttonText="Go to Login"
//   />
// )}

//     </>
//   );
// };

// const ProfessionalCard = ({ professional }: { professional: Professional }) => {
//   const [showModal, setShowModal] = useState(false);
//   const [showLoginPrompt, setShowLoginPrompt] = useState(false);
//   const [favorites, setFavorites] = useState<number[]>([]);
//   const router = useRouter();

//   const token = typeof window !== "undefined"
//     ? localStorage.getItem("authToken")?.replace(/^"|"$/g, "")
//     : null;

//   const userId = typeof window !== "undefined"
//     ? JSON.parse(localStorage.getItem("loginData") || "{}").id
//     : null;

//   const isFavorited = favorites.includes(professional.userId);

//   useEffect(() => {
//     if (!token || !userId) return;

//     const fetchFavorites = async () => {
//       try {
//         const response = await axios.get(
//           `https://ub1b171tga.execute-api.eu-north-1.amazonaws.com/dev/favorites/${userId}`,
//           { headers: { Authorization: `Bearer ${token}` } }
//         );

//         const favoritesArray = Array.isArray(response.data)
//           ? response.data
//           : response.data.data || response.data.favorites || [];

//         setFavorites(favoritesArray.map((fav: any) => fav.targetUserId));
//       } catch (err) {
//         console.error("Failed to fetch favorites:", err);
//       }
//     };

//     fetchFavorites();
//   }, [token, userId]);

//   const handleFavorite = async (targetId: number) => {
//     if (!token) {
//       setShowLoginPrompt(true);
//       return;
//     }

//     try {
//       const response = await axios.post(
//         "https://ub1b171tga.execute-api.eu-north-1.amazonaws.com/dev/favorites",
//         { userId, targetUserId: targetId },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       toast.success(response.data.message || "Favorite added!");
//       setFavorites((prev) => [...prev, targetId]);
//     } catch (error: any) {
//       toast.error("Failed to add favorite: Already added");
//       console.error(error?.response?.data || error.message);
//     }
//   };

//   const handleViewProfile = () => {
//     if (!token) {
//       setShowLoginPrompt(true);
//       return;
//     }
//     setShowModal(true);
//   };

//   const handleCloseModal = () => setShowModal(false);
//   const handleCloseLoginPrompt = () => {
//     setShowLoginPrompt(false);
//     router.push("/signin");
//   };

//   return (
//     <>
//       <AnimateOnScrollProvider>
//         <div
//           className="relative rounded-2xl p-6 bg-white hover:shadow-xl transition-all border border-gray-100 hover:border-transparent hover:ring-2 hover:ring-indigo-400"
//           data-aos="fade-up"
//         >
//           {/* Profile Image + Info */}
//           <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-4">
//             <div className="flex-shrink-0">
//               {professional.profileData?.profilePhoto ? (
//                 <img
//                   src={professional.profileData.profilePhoto}
//                   alt={`${getDisplayName(professional)}'s profile`}
//                   className={`w-20 h-20 rounded-full object-cover border-2 border-indigo-200 shadow-sm ${token ? "" : "blur-sm"}`}
//                 />
//               ) : (
//                 <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 text-sm border border-gray-200">
//                   N/A
//                 </div>
//               )}
//             </div>

//             <div className="flex flex-col justify-between">
//               <div>
//                 <h3 className={`text-xl font-semibold text-gray-900 ${token ? "" : "blur-sm"}`}>
//                   {getDisplayName(professional)}
//                 </h3>
//                 {professional.profileData?.basicInfo?.profileHeadline && (
//                   <p className={`text-gray-500 mt-1 text-sm ${token ? "" : "blur-sm"}`}>
//                     {professional.profileData.basicInfo.profileHeadline}
//                   </p>
//                 )}
//               </div>

//               {/* Services */}
              // <div className={`mt-3 flex flex-wrap gap-2 ${token ? "" : "blur-sm"}`}>
              //   {professional.profileData?.services?.selectedServices?.slice(0, 3).map((service, index) => (
              //     <span
              //       key={index}
              //       className="bg-indigo-50 text-indigo-700 text-xs px-3 py-1 rounded-full border border-indigo-200"
              //     >
              //       {service}
              //     </span>
              //   ))}
              //   {(professional.profileData?.services?.selectedServices?.length ?? 0) > 3 && (
              //     <span className="bg-indigo-50 text-indigo-700 text-xs px-3 py-1 rounded-full border border-indigo-200">
              //       +{(professional.profileData?.services?.selectedServices?.length ?? 0) - 3} more
              //     </span>
              //   )}
              // </div>
//             </div>
//           </div>

//           {/* Location + Rate + Buttons */}
//           <div className="grid md:grid-cols-[1fr_auto] gap-4 mt-6 items-start">
//             <div className="flex flex-col gap-2">
//               {professional.user.address && (
//                 <p className={`text-sm text-gray-400 flex items-center gap-1 ${token ? "" : "blur-sm"}`}>
//                   <LocationIcon />
//                   {professional.user.address}
//                 </p>
//               )}
//               <div className="flex items-center gap-4">
//                 <span className={`text-lg font-bold text-gray-900 ${token ? "" : "blur-sm"}`}>
//                   {getHourlyRate(professional)}
//                 </span>
//                 {professional.profileData?.experience?.years && (
//                   <span className={`text-gray-500 text-sm ${token ? "" : "blur-sm"}`}>
//                     {professional.profileData.experience.years} years exp.
//                   </span>
//                 )}
//               </div>
//             </div>

//             <div className="flex gap-4 items-center justify-end">
//               <button
//                 className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-md px-4 py-2 text-sm font-semibold"
//                 onClick={handleViewProfile}
//               >
//                 View Profile
//               </button>
//               <button
//                 className="text-2xl text-indigo-600 hover:text-indigo-800 transition"
//                 onClick={() => handleFavorite(professional.userId)}
//                 disabled={isFavorited}
//                 title={isFavorited ? "Already in favorites" : "Add to favorites"}
//               >
//                 {isFavorited ? <FaHeart /> : <FaRegHeart />}
//               </button>
//             </div>
//           </div>
//         </div>
//       </AnimateOnScrollProvider>

//       {showModal && (
//         <GenericModal visible={showModal} onClose={handleCloseModal} widthClass="max-w-4xl">
//           <div className="p-4">
//             <h2 className="text-xl font-semibold mb-2">
//               {getDisplayName(professional)}'s Profile
//             </h2>
//             <p>{professional.profileData?.basicInfo?.profileHeadline}</p>
//             <p>More profile details...</p>
//           </div>
//         </GenericModal>
//       )}

//       {showLoginPrompt && (
//         <GenericModal visible={true} onClose={handleCloseLoginPrompt}>
//           <div className="p-4">
//             <h2 className="text-xl font-semibold mb-4">Login Required</h2>
//             <p>You need to be logged in to perform this action.</p>
//             <button
//               className="mt-6 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md px-4 py-2"
//               onClick={handleCloseLoginPrompt}
//             >
//               Go to Login
//             </button>
//           </div>
//         </GenericModal>
//       )}
//     </>
//   );
// };

const LocationIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="inline-block h-4 w-4 mr-1 text-gray-400"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M17.657 16.657L13.414 20.9a1 1 0 01-1.414 0l-4.243-4.243a8 8 0 1111.314 0z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
    />
  </svg>
);









// import { useEffect, useState } from "react";
// import { ApiResponse, Professional } from "../types";
// import GenericModal from "@/sections/components/modal/GenericModal";
// import { useRouter } from "next/navigation";
// import AnimateOnScrollProvider from "@/sections/components/animation/AnimateOnScrollProvider";
// import { FaHeart, FaRegHeart } from "react-icons/fa";
// import axios from "axios";
// import toast from "react-hot-toast";

// // Update the ProfessionalsListProps to allow apiData to be null
// interface ProfessionalsListProps {
//   apiData: ApiResponse | null; // Allow null or ApiResponse
//   loading: boolean;
//   error: string | null;
// }

// const getDisplayName = (professional: Professional) => {
//   return (
//     professional.profileData?.basicInfo?.screenName ||
//     `${professional.user.firstName} ${professional.user.lastName}`
//   );
// };

// const getHourlyRate = (professional: Professional) => {
//   return professional.profileData?.fees?.hourlyRate
//     ? `£${professional.profileData.fees.hourlyRate}/hr`
//     : "Rate not specified";
// };

// export default function ProfessionalsList({
//   apiData,
//   loading,
//   error,
// }: ProfessionalsListProps) {
  
//   return (
//     <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-5xl mx-auto my-20">
//       <div className="flex justify-between items-center mb-4">
//         <h2 className="text-lg md:text-xl font-semibold">
//           Available Professionals{" "}
//           {apiData && `(${apiData.totalCount} found)`}
//         </h2>
//       </div>

//       {loading && (
//         <div className="flex justify-center items-center py-10">
//           <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
//         </div>
//       )}

//       {error && (
//         <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
//           {error}
//         </div>
//       )}

//       {!loading && apiData && (
//         <>
//           {apiData.professionals.length > 0 ? (
//             <div className="grid grid-cols-1 gap-6">
//               {apiData.professionals.map((professional) => (
//                 <ProfessionalCard
//                   key={professional.id}
//                   professional={professional}
//                 />
//               ))}
//             </div>
//           ) : (
//             <div className="text-center py-10 text-gray-500 bg-white rounded-lg border border-gray-200">
//               No professionals found matching your criteria.
//             </div>
//           )}
//         </>
//       )}
//     </div>
//   );
// }

// const ProfessionalCard = ({ professional }: { professional: Professional }) => {
//   const [showModal, setShowModal] = useState(false);
//   const [showLoginPrompt, setShowLoginPrompt] = useState(false);
//   const [modalVisible, setModalVisible] = useState(false);
//   const [isFavorited, setIsFavorited] = useState(false); // State for favorited status
//   const token = localStorage.getItem("authToken")?.replace(/^"|"$/g, '');
//   const [favorites, setFavorites] = useState<number[]>([]);
//   const userId = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("loginData") || "{}").id : null;
//   const router = useRouter();


//   useEffect(() => {
//     const fetchFavorites = async () => {
//       if (!token || !userId) return;
  
//       try {
//         const response = await axios.get(`https://ub1b171tga.execute-api.eu-north-1.amazonaws.com/dev/favorites/${userId}`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
  
//         console.log("Fetched favorites response:", response.data);
  
//         // Update this line based on actual response structure
//         const favoritesArray = Array.isArray(response.data)
//           ? response.data
//           : response.data.data || response.data.favorites || [];
  
//         const favoriteIds = favoritesArray.map((fav: any) => fav.targetUserId);
//         setFavorites(favoriteIds);
//       } catch (err) {
//         console.error("Failed to fetch favorites:", err);
//       }
//     };
  
//     fetchFavorites();
//   }, [token, userId]);
  
//   const handleViewProfile = () => {
//     if (!token) {
//       setShowLoginPrompt(true);
//       return;
//     }

//     setTimeout(() => {
//       setShowModal(true);
//       setModalVisible(true);
//     }, 500);
//   };

//   const handleFavorite = async (targetId : any) => {
//     if (!token) {
//       setShowLoginPrompt(true);
//       return;
//     }
// try {
//     const token = localStorage.getItem("authToken")?.replace(/^"|"$/g, "");
//     const userId = JSON.parse(localStorage.getItem("loginData") || "{}").id;

//     if (!token || !userId) {
//       throw new Error("Missing token or user ID");
//     }

//     const response = await axios.post(
//       "https://ub1b171tga.execute-api.eu-north-1.amazonaws.com/dev/favorites",
//       {
//         userId,
//         targetUserId:targetId,
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json"
//         }
//       }
//     );

//     toast.success( response.data.message || "Favorite added successfully!");
//   } catch (error: any) {
//     toast.error('Failed to add favorite:Already added')
//     console.error("Failed to add favorite:", error?.response?.data || error.message);
//     throw error;
//   }
//     setIsFavorited((prev) => !prev); // Toggle favorited state
//     // Optionally, add API call here to persist the favorite status
//   };

//   const handleCloseModal = () => {
//     setModalVisible(false);
//     setTimeout(() => {
//       setShowModal(false);
//     }, 500);
//   };

//   const handleCloseLoginPrompt = () => {
//     setShowLoginPrompt(false);
//     router.push("/signin");
//   };

//   const handleBackdropClick = (e: React.MouseEvent) => {
//     if (e.target === e.currentTarget) {
//       setModalVisible(false);
//       setTimeout(() => {
//         setShowModal(false);
//       }, 500);
//     }
//   };

//   return (
//     <>
//       <AnimateOnScrollProvider>
//         <div
//           className="relative rounded-2xl p-6 bg-white hover:shadow-xl transition-all border border-gray-100 hover:border-transparent hover:ring-2 hover:ring-indigo-400"
//           data-aos="fade-up"
//         >
//           {/* Top Grid: Profile image and main info */}
//           <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-4">
//             {/* Profile Image */}
//             <div className="flex-shrink-0">
//               {professional.profileData?.profilePhoto ? (
//                 <img
//                   src={professional.profileData.profilePhoto}
//                   alt={`${getDisplayName(professional)}'s profile`}
//                   className={`w-20 h-20 rounded-full object-cover border-2 border-indigo-200 shadow-sm ${
//                     token ? "" : "blur-sm"
//                   }`}
//                 />
//               ) : (
//                 <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 text-sm border border-gray-200">
//                   N/A
//                 </div>
//               )}
//             </div>

//             {/* Profile Content */}
//             <div className="flex flex-col justify-between">
//               <div>
//                 <h3
//                   className={`text-xl font-semibold text-gray-900 ${
//                     token ? "" : "blur-sm"
//                   }`}
//                 >
//                   {getDisplayName(professional)}
//                 </h3>
//                 {professional.profileData?.basicInfo?.profileHeadline && (
//                   <p
//                     className={`text-gray-500 mt-1 text-sm ${
//                       token ? "" : "blur-sm"
//                     }`}
//                   >
//                     {professional.profileData.basicInfo.profileHeadline}
//                   </p>
//                 )}
//               </div>

//               {/* Services */}
//               <div
//                 className={`mt-3 flex flex-wrap gap-2 ${
//                   token ? "" : "blur-sm"
//                 }`}
//               >
//                 {professional.profileData?.services?.selectedServices
//                   ?.slice(0, 3)
//                   .map((service, index) => (
//                     <span
//                       key={index}
//                       className="bg-indigo-50 text-indigo-700 text-xs px-3 py-1 rounded-full border border-indigo-200"
//                     >
//                       {service}
//                     </span>
//                   ))}
//                 {(professional.profileData?.services?.selectedServices
//                   ?.length ?? 0) > 3 && (
//                   <span className="bg-indigo-50 text-indigo-700 text-xs px-3 py-1 rounded-full border border-indigo-200">
//                     +
//                     {(professional.profileData?.services?.selectedServices
//                       ?.length ?? 0) - 3}{" "}
//                     more
//                   </span>
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* Location + Rate + Experience + Buttons */}
//           <div className="grid md:grid-cols-[1fr_auto] gap-4 mt-6 items-start">
//             <div className="flex flex-col gap-2">
//               {professional.user.address && (
//                 <p
//                   className={`text-sm text-gray-400 flex items-center gap-1 ${
//                     token ? "" : "blur-sm"
//                   }`}
//                 >
//                   <LocationIcon />
//                   {professional.user.address}
//                 </p>
//               )}
//               <div className="flex items-center gap-4">
//                 <span
//                   className={`text-lg font-bold text-gray-900 ${
//                     token ? "" : "blur-sm"
//                   }`}
//                 >
//                   {getHourlyRate(professional)}
//                 </span>
//                 {professional.profileData?.about?.experience && (
//                   <span
//                     className={`text-sm text-gray-500 ${
//                       token ? "" : "blur-sm"
//                     }`}
//                   >
//                     {professional.profileData.about.experience}
//                   </span>
//                 )}
//               </div>
//             </div>

//             <div className="flex flex-col items-end gap-2">
//               <button
//                 onClick={()=>handleFavorite(professional.userId)}
//                 className="px-4 py-2 rounded-lg text-sm font-medium transition-all shadow flex items-center gap-2"
//                 title={token ? (isFavorited ? "Remove from Favorites" : "Add to Favorites") : "Please login to favorite"}
//               >
//                 {isFavorited ? (
//                   <FaHeart className="text-red-500 text-lg" />
//                 ) : (
//                   <FaRegHeart className="text-gray-400 hover:text-red-500 text-lg" />
//                 )}
//                 Favorite
//               </button>
//               <button
//                 onClick={() => {
//                   token
//                     ? router.push(`/public-profile/${professional.userId}`)
//                     : setShowLoginPrompt(true);
//                 }}
//                 className={`w-full px-5 py-2 rounded-lg text-sm font-medium transition-all shadow ${
//                   token
//                     ? "bg-indigo-600 text-white hover:bg-indigo-700"
//                     : "bg-gray-300 text-gray-500 cursor-not-allowed"
//                 }`}
//                 title={!token ? "Please login to view the profile" : ""}
//               >
//                 View Profile
//               </button>
//             </div>
//           </div>

//           {/* About Section */}
//           {professional.profileData?.about?.aboutMe && (
//             <div
//               className={`mt-5 pt-5 border-t border-gray-100 ${
//                 token ? "" : "blur-sm"
//               }`}
//             >
//               <h4 className="font-semibold text-gray-800 mb-1">About</h4>
//               <p className="text-gray-600 text-sm line-clamp-2">
//                 {professional.profileData.about.aboutMe}
//               </p>
//             </div>
//           )}
//         </div>

//         {showLoginPrompt && (
//           <GenericModal
//             show={showLoginPrompt}
//             onClose={handleCloseLoginPrompt}
//             icon={
//               <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100">
//                 <svg
//                   className="h-6 w-6 text-blue-600"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   stroke="currentColor"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
//                   />
//                 </svg>
//               </div>
//             }
//             title="Please Login First"
//             message="You need to be logged in to view professional profiles."
//             buttonText="Got it!"
//           />
//         )}
//       </AnimateOnScrollProvider>
//     </>
//   );
// };

// // LocationIcon component (make sure to define this)
// const LocationIcon = () => (
//   <svg
//     className="w-4 h-4 mr-1"
//     fill="none"
//     stroke="currentColor"
//     viewBox="0 0 24 24"
//     xmlns="http://www.w3.org/2000/svg"
//   >
//     <path
//       strokeLinecap="round"
//       strokeLinejoin="round"
//       strokeWidth={2}
//       d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
//     />
//     <path
//       strokeLinecap="round"
//       strokeLinejoin="round"
//       strokeWidth={2}
//       d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
//     />
//   </svg>
// );



// // Assuming that Professional is the type for each professional object in the list
// import { useState } from "react";
// import { ApiResponse, Professional } from "../types";
// import GenericModal from "@/sections/components/modal/GenericModal";
// import { useRouter } from "next/navigation";
// import AnimateOnScrollProvider from "@/sections/components/animation/AnimateOnScrollProvider";

// // Update the ProfessionalsListProps to allow apiData to be null
// interface ProfessionalsListProps {
//   apiData: ApiResponse | null; // Allow null or ApiResponse
//   loading: boolean;
//   error: string | null;
// }

// const getDisplayName = (professional: Professional) => {
//   return professional.profileData?.basicInfo?.screenName || 
//     `${professional.user.firstName} ${professional.user.lastName}`;
// };

// const getHourlyRate = (professional: Professional) => {
//   return professional.profileData?.fees?.hourlyRate ? 
//     `£${professional.profileData.fees.hourlyRate}/hr` : "Rate not specified";
// };

// export default function ProfessionalsList({ apiData, loading, error }: ProfessionalsListProps) {
//   return (
//     <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-5xl mx-auto my-20">
//       <div className="flex justify-between items-center mb-4">
//         <h2 className="text-lg md:text-xl font-semibold">
//           Available Professionals {apiData && `(${apiData.totalCount} found)`}
//         </h2>
//       </div>
      
//       {loading && (
//         <div className="flex justify-center items-center py-10">
//           <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
//         </div>
//       )}
      
//       {error && (
//         <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
//           {error}
//         </div>
//       )}
      
//       {!loading && apiData && (
//         <>
//           {apiData.professionals.length > 0 ? (
//             <div className="grid grid-cols-1 gap-6">
//               {apiData.professionals.map((professional) => (
//                 <ProfessionalCard 
//                   key={professional.id} 
//                   professional={professional} 
//                 />
//               ))}
//             </div>
//           ) : (
//             <div className="text-center py-10 text-gray-500 bg-white rounded-lg border border-gray-200">
//               No professionals found matching your criteria.
//             </div>
//           )}
//         </>
//       )}
//     </div>
//   );
// }
// const ProfessionalCard = ({ professional }: { professional: Professional }) => {
//   const [showModal, setShowModal] = useState(false);
//   const [showLoginPrompt, setShowLoginPrompt] = useState(false);
//   const [modalVisible, setModalVisible] = useState(false);
//   const token = localStorage.getItem("authToken")?.replace(/^"|"$/g, '');
//   const router = useRouter();

//   const handleViewProfile = () => {
//     if (!token) {
//       setShowLoginPrompt(true);
//       return;
//     }

//     // Show modal after a 0.5s delay for a smoother effect
//     setTimeout(() => {
//       setShowModal(true); // Show modal
//       setModalVisible(true); // Start fade-in and scale-up transition
//     }, 500);
//   };

//   const handleCloseModal = () => {
//     setModalVisible(false);
//     setTimeout(() => {
//       setShowModal(false);
//     }, 500);
//   };

//   const handleCloseLoginPrompt = () => {
//     setShowLoginPrompt(false);
//     router.push("/signin");
//   };

//   const handleBackdropClick = (e: React.MouseEvent) => {
//     if (e.target === e.currentTarget) {
//       setModalVisible(false);
//       setTimeout(() => {
//         setShowModal(false);
//       }, 500);
//     }
//   };

//   return (
//     <>
//     <AnimateOnScrollProvider>
//       <div
//   className="relative rounded-2xl p-6 bg-white hover:shadow-xl transition-all border border-gray-100 hover:border-transparent hover:ring-2 hover:ring-indigo-400"
//   data-aos="fade-up"
// >
//   {/* Top Grid: Profile image and main info */}
//   <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-4">
//     {/* Profile Image */}
//     <div className="flex-shrink-0">
//       {professional.profileData?.profilePhoto ? (
//         <img
//           src={professional.profileData.profilePhoto}
//           alt={`${getDisplayName(professional)}'s profile`}
//           className={`w-20 h-20 rounded-full object-cover border-2 border-indigo-200 shadow-sm ${
//             token ? "" : "blur-sm"
//           }`}
//         />
//       ) : (
//         <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 text-sm border border-gray-200">
//           N/A
//         </div>
//       )}
//     </div>

//     {/* Profile Content */}
//     <div className="flex flex-col justify-between">
//       <div>
//         <h3
//           className={`text-xl font-semibold text-gray-900 ${
//             token ? "" : "blur-sm"
//           }`}
//         >
//           {getDisplayName(professional)}
//         </h3>
//         {professional.profileData?.basicInfo?.profileHeadline && (
//           <p className={`text-gray-500 mt-1 text-sm ${token ? "" : "blur-sm"}`}>
//             {professional.profileData.basicInfo.profileHeadline}
//           </p>
//         )}
//       </div>

//       {/* Services */}
//       <div className={`mt-3 flex flex-wrap gap-2 ${token ? "" : "blur-sm"}`}>
//         {professional.profileData?.services?.selectedServices?.slice(0, 3).map(
//           (service, index) => (
//             <span
//               key={index}
//               className="bg-indigo-50 text-indigo-700 text-xs px-3 py-1 rounded-full border border-indigo-200"
//             >
//               {service}
//             </span>
//           )
//         )}
//         {(professional.profileData?.services?.selectedServices?.length ?? 0) > 3 && (
//           <span className="bg-indigo-50 text-indigo-700 text-xs px-3 py-1 rounded-full border border-indigo-200">
//             +{(professional.profileData?.services?.selectedServices?.length ?? 0)  - 3} more
//           </span>
//         )}
//       </div>
//     </div>
//   </div>

//   {/* Location + Rate + Experience + Button */}
//   <div className="grid md:grid-cols-[1fr_auto] gap-4 mt-6 items-start">
//   <div className="flex flex-col gap-2">
//     {professional.user.address && (
//       <p
//         className={`text-sm text-gray-400 flex items-center gap-1 ${
//           token ? "" : "blur-sm"
//         }`}
//       >
//         <LocationIcon />
//         {professional.user.address}
//       </p>
//     )}
//     <div className="flex items-center gap-4">
//       <span
//         className={`text-lg font-bold text-gray-900 ${
//           token ? "" : "blur-sm"
//         }`}
//       >
//         {getHourlyRate(professional)}
//       </span>
//       {professional.profileData?.about?.experience && (
//         <span className={`text-sm text-gray-500 ${token ? "" : "blur-sm"}`}>
//           {professional.profileData.about.experience}
//         </span>
//       )}
//     </div>
//   </div>

//   <button
//   onClick={() => {
//     token
//       ? router.push(`/public-profile/${professional.userId}`)
//       : setShowLoginPrompt(true);
//   }}
//   className={`w-fit self-start px-5 py-2 rounded-lg text-sm font-medium transition-all shadow ${
//     token
//       ? "bg-indigo-600 text-white hover:bg-indigo-700"
//       : "bg-gray-300 text-gray-500 cursor-not-allowed"
//   }`}
//   title={!token ? "Please login to view the profile" : ""}
// >
//   View Profile
// </button>
// </div>

//   {/* About Section */}
//   {professional.profileData?.about?.aboutMe && (
//     <div className={`mt-5 pt-5 border-t border-gray-100 ${token ? "" : "blur-sm"}`}>
//       <h4 className="font-semibold text-gray-800 mb-1">About</h4>
//       <p className="text-gray-600 text-sm line-clamp-2">
//         {professional.profileData.about.aboutMe}
//       </p>
//     </div>
//   )}
// </div>


// {showLoginPrompt && (
//   <GenericModal
//   show={showLoginPrompt}
//   onClose={handleCloseLoginPrompt}
//   icon={
//     <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100">
//       <svg
//         className="h-6 w-6 text-blue-600"
//         fill="none"
//         viewBox="0 0 24 24"
//         stroke="currentColor"
//       >
//         <path
//           strokeLinecap="round"
//           strokeLinejoin="round"
//           strokeWidth={2}
//           d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
//         />
//       </svg>
//     </div>
//   }
//   title="Please Login First"
//   message="You need to be logged in to view professional profiles."
//   buttonText="Got it!"
// />

// )}

// </AnimateOnScrollProvider>
//     </>
//   );
// };


// // LocationIcon component (make sure to define this)
// const LocationIcon = () => (
//   <svg 
//     className="w-4 h-4 mr-1" 
//     fill="none" 
//     stroke="currentColor" 
//     viewBox="0 0 24 24" 
//     xmlns="http://www.w3.org/2000/svg"
//   >
//     <path 
//       strokeLinecap="round" 
//       strokeLinejoin="round" 
//       strokeWidth={2} 
//       d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" 
//     />
//     <path 
//       strokeLinecap="round" 
//       strokeLinejoin="round" 
//       strokeWidth={2} 
//       d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" 
//     />
//   </svg>
// );










      {/* <div className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all bg-white hover:bg-gray-50" data-aos="fade-up">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-4">
              {professional.profileData?.profilePhoto ? (
                <img 
                  src={professional.profileData.profilePhoto} 
                  alt={`${getDisplayName(professional)}'s profile`}
                  className={`w-16 h-16 rounded-full object-cover border border-gray-200 ${
                            token ? "" : "blur-sm"
                          }`}
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-sm border border-gray-200">
                  N/A
                </div>
              )}

              <div>
                <h3 className={`font-bold text-xl text-gray-900 ${
        token ? "" : "blur-sm"
      }`}>{getDisplayName(professional)}</h3>
                {professional.profileData?.basicInfo?.profileHeadline && (
                  <p className={`text-gray-600 mt-1 ${
                    token ? "" : "blur-sm"
                  }`}>{professional.profileData.basicInfo.profileHeadline}</p>
                )}
              </div>
            </div>

            <div className={`mt-3 flex flex-wrap gap-2 ${
        token ? "" : "blur-sm"
      }`}>
              {professional.profileData?.services?.selectedServices?.slice(0, 3).map((service, index) => (
                <span key={index} className="bg-gray-100 text-gray-800 text-xs px-3 py-1 rounded-full border border-gray-200">
                  {service}
                </span>
              ))}
              {((professional.profileData?.services?.selectedServices?.length ?? 0) > 3) && (
                <span className="bg-gray-100 text-gray-800 text-xs px-3 py-1 rounded-full border border-gray-200">
                  +{professional.profileData!.services!.selectedServices!.length - 3} more
                </span>
              )}
            </div>

            {professional.user.address && (
              <p className={`text-sm text-gray-500 mt-3 flex items-center ${
                token ? "" : "blur-sm"
              }`}>
                <LocationIcon />
                {professional.user.address}
              </p>
            )}
          </div>

          <div className="flex flex-col items-end">
            <span className={`text-lg font-semibold text-gray-900 ${
        token ? "" : "blur-sm"
      }`}>
              {getHourlyRate(professional)}
            </span>
            {professional.profileData?.about?.experience && (
              <span className={`text-sm text-gray-500 mt-1 ${
                token ? "" : "blur-sm"
              }`}>
                {professional.profileData.about.experience} experience
              </span>
            )}
            <button 
                onClick={() => {
                  if (token) {
                    router.push(`/public-profile/${professional.userId}`);
                  } else {
                    setShowLoginPrompt(true);
                  }
                }}
              className={`mt-3 px-4 py-2 rounded-md transition-colors shadow-sm ${
                token 
                  ? "bg-black text-white hover:bg-gray-800 cursor-pointer" 
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
              title={!token ? "Please login to view the profile" : ""}
            >
              View Profile
            </button>
          </div>
        </div>

        {professional.profileData?.about?.aboutMe && (
          <div className={`mt-4 pt-4 border-t border-gray-100 ${
            token ? "" : "blur-sm"
          }`}>
            <h4 className="font-medium text-gray-900">About</h4>
            <p className="text-gray-600 mt-1 line-clamp-2">
              {professional.profileData.about.aboutMe}
            </p>
          </div>
        )}
      </div> */}
// const ProfessionalCard = ({ professional }: { professional: Professional }) => {
//   const [showModal, setShowModal] = useState(false);
//   const [showLoginPrompt, setShowLoginPrompt] = useState(false);
//   const [modalVisible, setModalVisible] = useState(false);
//   const token = localStorage.getItem("authToken")?.replace(/^"|"$/g, '');

//   const handleViewProfile = () => {
//     if (!token) {
//       setShowLoginPrompt(true);
//       return;
//     }
    
//     // Show modal after a 0.5s delay for a smoother effect
//     setTimeout(() => {
//       setShowModal(true); // Show modal
//       setModalVisible(true); // Start fade-in and scale-up transition
//     }, 500); // Delay for a smoother effect
//   };

//   const handleCloseModal = () => {
//     setModalVisible(false); // Fade-out and scale-down
//     setTimeout(() => {
//       setShowModal(false); // Remove modal after animation
//     }, 500); // Match the duration of fade-out
//   };

//   const handleCloseLoginPrompt = () => {
//     setShowLoginPrompt(false);
//   };

//   const handleBackdropClick = (e: React.MouseEvent) => {
//     if (e.target === e.currentTarget) {
//       setModalVisible(false); // Fade-out and scale-down
//       setTimeout(() => {
//         setShowModal(false); // Hide modal after fade-out
//       }, 500); // Same duration as fade-out
//     }
//   };

//   return (
//     <>
//       <div className={`border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all bg-white hover:bg-gray-50`}>
//         <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//           <div className="flex-1">
//             <div className="flex items-center gap-4">
//               {professional.profileData?.profilePhoto ? (
//                 <img 
//                   src={professional.profileData.profilePhoto} 
//                   alt={`${getDisplayName(professional)}'s profile`}
//                   className="w-16 h-16 rounded-full object-cover border border-gray-200"
//                 />
//               ) : (
//                 <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-sm border border-gray-200">
//                   N/A
//                 </div>
//               )}

//               <div>
//                 <h3 className="font-bold text-xl text-gray-900">{getDisplayName(professional)}</h3>
//                 {professional.profileData?.basicInfo?.profileHeadline && (
//                   <p className="text-gray-600 mt-1">{professional.profileData.basicInfo.profileHeadline}</p>
//                 )}
//               </div>
//             </div>
            
//             <div className="mt-3 flex flex-wrap gap-2">
//               {professional.profileData?.services?.selectedServices?.slice(0, 3).map((service, index) => (
//                 <span key={index} className="bg-gray-100 text-gray-800 text-xs px-3 py-1 rounded-full border border-gray-200">
//                   {service}
//                 </span>
//               ))}
//               {((professional.profileData?.services?.selectedServices?.length ?? 0) > 3) && (
//                 <span className="bg-gray-100 text-gray-800 text-xs px-3 py-1 rounded-full border border-gray-200">
//                   +{professional.profileData!.services!.selectedServices!.length - 3} more
//                 </span>
//               )}
//             </div>
            
//             {professional.user.address && (
//               <p className="text-sm text-gray-500 mt-3 flex items-center">
//                 <LocationIcon />
//                 {professional.user.address}
//               </p>
//             )}
//           </div>
          
//           <div className="flex flex-col items-end">
//             <span className="text-lg font-semibold text-gray-900">
//               {getHourlyRate(professional)}
//             </span>
//             {professional.profileData?.about?.experience && (
//               <span className="text-sm text-gray-500 mt-1">
//                 {professional.profileData.about.experience} experience
//               </span>
//             )}
//             <button 
//               onClick={handleViewProfile} 
//               className={`mt-3 px-4 py-2 rounded-md transition-colors shadow-sm ${
//                 token 
//                   ? "bg-black text-white hover:bg-gray-800 cursor-pointer" 
//                   : "bg-gray-300 text-gray-500 cursor-not-allowed"
//               }`}
//               disabled={!token}
//             >
//               View Profile
//             </button>
//           </div>
//         </div>
        
//         {professional.profileData?.about?.aboutMe && (
//           <div className="mt-4 pt-4 border-t border-gray-100">
//             <h4 className="font-medium text-gray-900">About</h4>
//             <p className="text-gray-600 mt-1 line-clamp-2">
//               {professional.profileData.about.aboutMe}
//             </p>
//           </div>
//         )}
//       </div>

//       {showModal && (
//         <ProfileModal 
//           professional={professional} 
//           closeModal={handleCloseModal} 
//           backdropClick={handleBackdropClick}
//           modalVisible={modalVisible}
//         />
//       )}

//       {/* Beautiful Login Prompt Modal */}
//       {showLoginPrompt && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300">
//           <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 transform transition-all duration-300 scale-95 animate-scale-in">
//             <div className="text-center">
//               <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100">
//                 <svg 
//                   className="h-6 w-6 text-blue-600" 
//                   fill="none" 
//                   viewBox="0 0 24 24" 
//                   stroke="currentColor"
//                 >
//                   <path 
//                     strokeLinecap="round" 
//                     strokeLinejoin="round" 
//                     strokeWidth={2} 
//                     d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
//                   />
//                 </svg>
//               </div>
//               <h3 className="mt-3 text-lg font-medium text-gray-900">Please Login First</h3>
//               <div className="mt-2 text-sm text-gray-500">
//                 <p>You need to be logged in to view professional profiles.</p>
//               </div>
//               <div className="mt-4">
//                 <button
//                   type="button"
//                   className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
//                   onClick={handleCloseLoginPrompt}
//                 >
//                   Got it!
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };



 {/* {showLoginPrompt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 transform transition-all duration-300 scale-95 animate-scale-in">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100">
                <svg 
                  className="h-6 w-6 text-blue-600" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
                  />
                </svg>
              </div>
              <h3 className="mt-3 text-lg font-medium text-gray-900">Please Login First</h3>
              <div className="mt-2 text-sm text-gray-500">
                <p>You need to be logged in to view professional profiles.</p>
              </div>
              <div className="mt-4">
                <button
                  type="button"
                  className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                  onClick={handleCloseLoginPrompt}
                >
                  Got it!
                </button>
              </div>
            </div>
          </div>
        </div>
      )} */}




// // Assuming that Professional is the type for each professional object in the list
// import { useState } from "react";
// import { ApiResponse, Professional } from "../types";

// // Update the ProfessionalsListProps to allow apiData to be null
// interface ProfessionalsListProps {
//   apiData: ApiResponse | null; // Allow null or ApiResponse
//   loading: boolean;
//   error: string | null;
// }

// const getDisplayName = (professional: Professional) => {
//   return professional.profileData?.basicInfo?.screenName || 
//     `${professional.user.firstName} ${professional.user.lastName}`;
// };

// const getHourlyRate = (professional: Professional) => {
//   return professional.profileData?.fees?.hourlyRate ? 
//     `£${professional.profileData.fees.hourlyRate}/hr` : "Rate not specified";
// };

// export default function ProfessionalsList({ apiData, loading, error }: ProfessionalsListProps) {
//   return (
//     <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-4xl mx-auto mb-10">
//       <div className="flex justify-between items-center mb-4">
//         <h2 className="text-lg md:text-xl font-semibold">
//           Available Professionals {apiData && `(${apiData.totalCount} found)`}
//         </h2>
//       </div>
      
//       {loading && (
//         <div className="flex justify-center items-center py-10">
//           <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
//         </div>
//       )}
      
//       {error && (
//         <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
//           {error}
//         </div>
//       )}
      
//       {!loading && apiData && (
//         <>
//           {apiData.professionals.length > 0 ? (
//             <div className="grid grid-cols-1 gap-6">
//               {apiData.professionals.map((professional) => (
//                 <ProfessionalCard 
//                   key={professional.id} 
//                   professional={professional} 
//                 />
//               ))}
//             </div>
//           ) : (
//             <div className="text-center py-10 text-gray-500 bg-white rounded-lg border border-gray-200">
//               No professionals found matching your criteria.
//             </div>
//           )}
//         </>
//       )}
//     </div>
//   );
// }

// const ProfessionalCard = ({ professional }: { professional: Professional }) => {
//   const [showModal, setShowModal] = useState(false);
//   const [modalVisible, setModalVisible] = useState(false);
//   const token = localStorage.getItem("authToken")?.replace(/^"|"$/g, '');
//   const handleViewProfile = () => {
//     // Show modal after a 0.5s delay for a smoother effect
//     setTimeout(() => {
//       setShowModal(true); // Show modal
//       setModalVisible(true); // Start fade-in and scale-up transition
//     }, 500); // Delay for a smoother effect
//   };

//   const handleCloseModal = () => {
//     setModalVisible(false); // Fade-out and scale-down
//     setTimeout(() => {
//       setShowModal(false); // Remove modal after animation
//     }, 500); // Match the duration of fade-out
//   };

//   const handleBackdropClick = (e: React.MouseEvent) => {
//     if (e.target === e.currentTarget) {
//       setModalVisible(false); // Fade-out and scale-down
//       setTimeout(() => {
//         setShowModal(false); // Hide modal after fade-out
//       }, 500); // Same duration as fade-out
//     }
//   };

//   return (
//     <>
//       <div className={`border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all bg-white hover:bg-gray-50 transform ${
//         token ? "" : "blur-sm"
//       }`}>
//         <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//           <div className="flex-1">
//           <div className="flex items-center gap-4">
//   {professional.profileData?.profilePhoto ? (
//     <img 
//       src={professional.profileData.profilePhoto} 
//       alt={`${getDisplayName(professional)}'s profile`}
//       className={`w-16 h-16 rounded-full object-cover border border-gray-200 transition duration-300 ${
//         token ? "" : "blur-sm"
//       }`}
//     />
//   ) : (
//     <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-sm border border-gray-200">
//       N/A
//     </div>
//   )}

//   <div>
//     <h3 className="font-bold text-xl text-gray-900">{getDisplayName(professional)}</h3>
//     {professional.profileData?.basicInfo?.profileHeadline && (
//       <p className="text-gray-600 mt-1">{professional.profileData.basicInfo.profileHeadline}</p>
//     )}
//   </div>
// </div>
            
//             <div className="mt-3 flex flex-wrap gap-2">
//               {professional.profileData?.services?.selectedServices?.slice(0, 3).map((service, index) => (
//                 <span key={index} className="bg-gray-100 text-gray-800 text-xs px-3 py-1 rounded-full border border-gray-200">
//                   {service}
//                 </span>
//               ))}
//               {((professional.profileData?.services?.selectedServices?.length ?? 0) > 3) && (
//                 <span className="bg-gray-100 text-gray-800 text-xs px-3 py-1 rounded-full border border-gray-200">
//                   +{professional.profileData!.services!.selectedServices!.length - 3} more
//                 </span>
//               )}
//             </div>
            
//             {professional.user.address && (
//               <p className="text-sm text-gray-500 mt-3 flex items-center">
//                 <LocationIcon />
//                 {professional.user.address}
//               </p>
//             )}
//           </div>
          
//           <div className="flex flex-col items-end">
//             <span className="text-lg font-semibold text-gray-900">
//               {getHourlyRate(professional)}
//             </span>
//             {professional.profileData?.about?.experience && (
//               <span className="text-sm text-gray-500 mt-1">
//                 {professional.profileData.about.experience} experience
//               </span>
//             )}
//             <button 
//               onClick={handleViewProfile} 
//               className="mt-3 px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors shadow-sm cursor-pointer"
//             >
//               View Profile
//             </button>
//           </div>
//         </div>
        
//         {professional.profileData?.about?.aboutMe && (
//           <div className="mt-4 pt-4 border-t border-gray-100">
//             <h4 className="font-medium text-gray-900">About</h4>
//             <p className="text-gray-600 mt-1 line-clamp-2">
//               {professional.profileData.about.aboutMe}
//             </p>
//           </div>
//         )}
//       </div>

//       {showModal && (
//         <ProfileModal 
//           professional={professional} 
//           closeModal={handleCloseModal} 
//           backdropClick={handleBackdropClick}
//           modalVisible={modalVisible} // Control visibility
//         />
//       )}
//     </>
//   );
// };



// const LocationIcon = () => (
//   <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
//   </svg>
// );









// import React, { useState, useEffect } from "react";
// import { ApiResponse, Professional } from "../types";

// interface ProfessionalsListProps {
//   apiData: ApiResponse | null;
//   loading: boolean;
//   error: string | null;
// }

// const getDisplayName = (professional: Professional) => {
//   return professional.profileData?.basicInfo?.screenName || 
//     `${professional.user.firstName} ${professional.user.lastName}`;
// };

// const getHourlyRate = (professional: Professional) => {
//   return professional.profileData?.fees?.hourlyRate ? 
//     `£${professional.profileData.fees.hourlyRate}/hr` : "Rate not specified";
// };

// export default function ProfessionalsList({ apiData, loading, error }: ProfessionalsListProps) {
//   return (
//     <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-4xl mx-auto mb-10">
//       <div className="flex justify-between items-center mb-4">
//         <h2 className="text-lg md:text-xl font-semibold">
//           Available Professionals {apiData && `(${apiData.totalCount} found)`}
//         </h2>
//       </div>
      
//       {loading && (
//         <div className="flex justify-center items-center py-10">
//           <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
//         </div>
//       )}
      
//       {error && (
//         <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
//           {error}
//         </div>
//       )}
      
//       {!loading && apiData && (
//         <>
//           {apiData.professionals.length > 0 ? (
//             <div className="grid grid-cols-1 gap-6">
//               {apiData.professionals.map((professional) => (
//                 <ProfessionalCard 
//                   key={professional.id} 
//                   professional={professional} 
//                 />
//               ))}
//             </div>
//           ) : (
//             <div className="text-center py-10 text-gray-500 bg-white rounded-lg border border-gray-200">
//               No professionals found matching your criteria.
//             </div>
//           )}
//         </>
//       )}
//     </div>
//   );
// }

// const ProfessionalCard = ({ professional }: { professional: Professional }) => {
//   const [showModal, setShowModal] = useState(false);

//   const handleViewProfile = () => {
//     setShowModal(true);
//   };

//   const handleCloseModal = () => {
//     setShowModal(false);
//   };

//   // Close modal when clicking outside of it
//   const handleBackdropClick = (e: React.MouseEvent) => {
//     if (e.target === e.currentTarget) {
//       setShowModal(false);
//     }
//   };

//   return (
//     <>
//       <div className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all bg-white hover:bg-gray-50 transform hover:scale-101">
//         <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//           <div className="flex-1">
//             <h3 className="font-bold text-xl text-gray-900">{getDisplayName(professional)}</h3>
//             {professional.profileData?.basicInfo?.profileHeadline && (
//               <p className="text-gray-600 mt-1">{professional.profileData.basicInfo.profileHeadline}</p>
//             )}
            
//             <div className="mt-3 flex flex-wrap gap-2">
//               {professional.profileData?.services?.selectedServices?.slice(0, 3).map((service, index) => (
//                 <span key={index} className="bg-gray-100 text-gray-800 text-xs px-3 py-1 rounded-full border border-gray-200">
//                   {service}
//                 </span>
//               ))}
//               {((professional.profileData?.services?.selectedServices?.length ?? 0) > 3) && (
//                 <span className="bg-gray-100 text-gray-800 text-xs px-3 py-1 rounded-full border border-gray-200">
//                   +{professional.profileData!.services!.selectedServices!.length - 3} more
//                 </span>
//               )}
//             </div>
            
//             {professional.user.address && (
//               <p className="text-sm text-gray-500 mt-3 flex items-center">
//                 <LocationIcon />
//                 {professional.user.address}
//               </p>
//             )}
//           </div>
          
//           <div className="flex flex-col items-end">
//             <span className="text-lg font-semibold text-gray-900">
//               {getHourlyRate(professional)}
//             </span>
//             {professional.profileData?.about?.experience && (
//               <span className="text-sm text-gray-500 mt-1">
//                 {professional.profileData.about.experience} experience
//               </span>
//             )}
//             <button 
//               onClick={handleViewProfile} 
//               className="mt-3 px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors shadow-sm cursor-pointer"
//             >
//               View Profile
//             </button>
//           </div>
//         </div>
        
//         {professional.profileData?.about?.aboutMe && (
//           <div className="mt-4 pt-4 border-t border-gray-100">
//             <h4 className="font-medium text-gray-900">About</h4>
//             <p className="text-gray-600 mt-1 line-clamp-2">
//               {professional.profileData.about.aboutMe}
//             </p>
//           </div>
//         )}
//       </div>

//       {showModal && (
//         <ProfileModal 
//           professional={professional} 
//           closeModal={handleCloseModal} 
//           backdropClick={handleBackdropClick}
//         />
//       )}
//     </>
//   );
// };

// const LocationIcon = () => (
//   <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
//   </svg>
// );

// const ProfileModal = ({ professional, closeModal, backdropClick }: { professional: Professional, closeModal: () => void, backdropClick: (e: React.MouseEvent) => void }) => {
//   return (
//     <div 
//       className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 transition-opacity duration-300 opacity-100 pointer-events-auto"
//       onClick={backdropClick}
//     >
//       <div className="bg-white p-10 rounded-lg shadow-xl w-11/12 max-w-4xl transition-transform transform duration-500 ease-in-out scale-100 opacity-100 pointer-events-auto">
//         <button 
//           onClick={closeModal} 
//           className="absolute top-4 right-4 text-gray-600 font-bold text-xl hover:text-gray-800 transition-colors"
//         >
//           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
//           </svg>
//         </button>
        
//         <h2 className="text-3xl font-semibold mb-6 text-gray-800">{getDisplayName(professional)}'s Profile</h2>

//         <div className="space-y-6">
//           <p className="text-gray-700"><strong>Email:</strong> <span className="text-gray-500">{professional.user.email}</span></p>
//           <p className="text-gray-700"><strong>Phone Number:</strong> <span className="text-gray-500">{professional.user.phoneNumber}</span></p>
//           <p className="text-gray-700"><strong>About Me:</strong> <span className="text-gray-500">{professional.profileData?.about?.aboutMe || "No information available"}</span></p>
//           <p className="text-gray-700"><strong>Experience:</strong> <span className="text-gray-500">{professional.profileData?.about?.experience || "No experience information"}</span></p>
//           <p className="text-gray-700"><strong>Qualifications:</strong> <span className="text-gray-500">{professional.profileData?.about?.qualifications || "No qualifications listed"}</span></p>
//           <p className="text-gray-700"><strong>Services:</strong> <span className="text-gray-500">{professional.profileData?.services?.selectedServices?.join(", ") || "No services listed"}</span></p>
//           <p className="text-gray-700"><strong>Hourly Rate:</strong> <span className="text-gray-500">£{professional.profileData?.fees?.hourlyRate || "Not specified"}/hr</span></p>
//           <p className="text-gray-700"><strong>Website:</strong> 
//             <a 
//               href={professional.profileData?.contact?.website} 
//               target="_blank" 
//               rel="noopener noreferrer" 
//               className="text-blue-500 hover:underline"
//             >
//               {professional.profileData?.contact?.website || "No website provided"}
//             </a>
//           </p>
//           <p className="text-gray-700"><strong>Home Phone:</strong> <span className="text-gray-500">{professional.profileData?.contact?.homeTelephone || "No home phone provided"}</span></p>
//           <p className="text-gray-700"><strong>Mobile Phone:</strong> <span className="text-gray-500">{professional.profileData?.contact?.mobileTelephone || "No mobile phone provided"}</span></p>
//         </div>
//       </div>
//     </div>
//   );
// };





// import React from "react";
// import { ApiResponse, Professional } from "../types";

// interface ProfessionalsListProps {
//   apiData: ApiResponse | null;
//   loading: boolean;
//   error: string | null;
// }

// const getDisplayName = (professional: Professional) => {
//   return professional.profileData?.basicInfo?.screenName || 
//     `${professional.user.firstName} ${professional.user.lastName}`;
// };

// const getHourlyRate = (professional: Professional) => {
//   return professional.profileData?.fees?.hourlyRate ? 
//     `£${professional.profileData.fees.hourlyRate}/hr` : "Rate not specified";
// };

// export default function ProfessionalsList({ apiData, loading, error }: ProfessionalsListProps) {
//   return (
//     <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-4xl mx-auto mb-10">
//       <div className="flex justify-between items-center mb-4">
//         <h2 className="text-lg md:text-xl font-semibold">
//           Available Professionals {apiData && `(${apiData.totalCount} found)`}
//         </h2>
//       </div>
      
//       {loading && (
//         <div className="flex justify-center items-center py-10">
//           <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
//         </div>
//       )}
      
//       {error && (
//         <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
//           {error}
//         </div>
//       )}
      
//       {!loading && apiData && (
//         <>
//           {apiData.professionals.length > 0 ? (
//             <div className="grid grid-cols-1 gap-6">
//               {apiData.professionals.map((professional) => (
//                 <ProfessionalCard 
//                   key={professional.id} 
//                   professional={professional} 
//                 />
//               ))}
//             </div>
//           ) : (
//             <div className="text-center py-10 text-gray-500 bg-white rounded-lg border border-gray-200">
//               No professionals found matching your criteria.
//             </div>
//           )}
//         </>
//       )}
//     </div>
//   );
// }

// const ProfessionalCard = ({ professional }: { professional: Professional }) => {
//   return (
//     <div className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all bg-white hover:bg-gray-50">
//       <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//         <div className="flex-1">
//           <h3 className="font-bold text-xl text-gray-900">{getDisplayName(professional)}</h3>
//           {professional.profileData?.basicInfo?.profileHeadline && (
//             <p className="text-gray-600 mt-1">{professional.profileData.basicInfo.profileHeadline}</p>
//           )}
          
//           <div className="mt-3 flex flex-wrap gap-2">
//             {professional.profileData?.services?.selectedServices?.slice(0, 3).map((service, index) => (
//               <span key={index} className="bg-gray-100 text-gray-800 text-xs px-3 py-1 rounded-full border border-gray-200">
//                 {service}
//               </span>
//             ))}
//        {((professional.profileData?.services?.selectedServices?.length ?? 0) > 3) && (
//   <span className="bg-gray-100 text-gray-800 text-xs px-3 py-1 rounded-full border border-gray-200">
//     +{professional.profileData!.services!.selectedServices!.length - 3} more
//   </span>
// )}
//           </div>
          
//           {professional.user.address && (
//             <p className="text-sm text-gray-500 mt-3 flex items-center">
//               <LocationIcon />
//               {professional.user.address}
//             </p>
//           )}
//         </div>
        
//         <div className="flex flex-col items-end">
//           <span className="text-lg font-semibold text-gray-900">
//             {getHourlyRate(professional)}
//           </span>
//           {professional.profileData?.about?.experience && (
//             <span className="text-sm text-gray-500 mt-1">
//               {professional.profileData.about.experience} experience
//             </span>
//           )}
//           <button className="mt-3 px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors shadow-sm">
//             View Profile
//           </button>
//         </div>
//       </div>
      
//       {professional.profileData?.about?.aboutMe && (
//         <div className="mt-4 pt-4 border-t border-gray-100">
//           <h4 className="font-medium text-gray-900">About</h4>
//           <p className="text-gray-600 mt-1 line-clamp-2">
//             {professional.profileData.about.aboutMe}
//           </p>
//         </div>
//       )}
//     </div>
//   );
// };

// const LocationIcon = () => (
//   <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
//   </svg>
// );