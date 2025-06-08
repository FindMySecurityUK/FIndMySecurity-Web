"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import CompaniesList from "@/app/connecting-business/components/CompaniesList";
import MapSection from "@/app/connecting-business/components/MapSection";
import filtersData from "@/sections/data/secuirty_services.json";
import { CompaniesApiResponse } from "@/app/connecting-business/types";
import { API_URL } from "@/utils/path";

export default function SecurityCompaniesPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [apiData, setApiData] = useState<CompaniesApiResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [selectedCategory, setSelectedCategory] = useState(searchParams?.get("sr") || "");
  const [selectedRole, setSelectedRole] = useState(searchParams?.get("so") || "");
  const [pc, setPc] = useState(searchParams?.get("pc") || "");
  const [distance, setDistance] = useState(searchParams?.get("distance") || "");
  const [experience, setExperience] = useState(searchParams?.get("experience") || "");
  const [page, setPage] = useState(searchParams?.get("page") || "1");
 const [postcodeValid, setPostcodeValid] = useState(true);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
useEffect(() => {
  validatePostcode(pc);
}, [pc]);
  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const queryParams = new URLSearchParams({
        ...(selectedCategory && { sr: selectedCategory }),
        ...(selectedRole && { so: selectedRole }),
        ...(pc && { pc }),
        ...(distance && { distance }),
        ...(experience && { experience }),
        page,
      });

      const apiUrl = `${API_URL}/users/security-companies?${queryParams}`;
      const response = await fetch(apiUrl);

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data: CompaniesApiResponse = await response.json();
      setApiData(data);
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedCategory, selectedRole, pc, distance, experience, page]);

  const updateSearchParams = (params: Record<string, string>) => {
    const newParams = new URLSearchParams(searchParams?.toString() || "");

    Object.entries(params).forEach(([key, value]) => {
      if (value) newParams.set(key, value);
      else newParams.delete(key);
    });

    router.push(`${pathname}?${newParams.toString()}`);
  };
const validatePostcode = async (postcode: string) => {
  if (!postcode) {
    setPostcodeValid(true);
    //setPostcodeError("");
    return;
  }

  try {
    const res = await fetch(`https://api.postcodes.io/postcodes/${postcode}/validate`);
    const data = await res.json();
    if (data.result) {
      setPostcodeValid(true);
      //setPostcodeError("");
    } else {
      setPostcodeValid(false);
     // setPostcodeError("Invalid UK postcode");
    }
  } catch (err) {
    setPostcodeValid(false);
   // setPostcodeError("Error validating postcode");
  }
};
  const handleFilterChange = (updatedParams: Record<string, string>) => {
    if (updatedParams.pc !== undefined) {
      setPc(updatedParams.pc);
      setDistance("");
    }
    if (updatedParams.sr !== undefined) {
      setSelectedCategory(updatedParams.sr);
      setSelectedRole("");
    }
    if (updatedParams.so !== undefined) {
      setSelectedRole(updatedParams.so);
    }
    if (updatedParams.pc !== undefined) setPc(updatedParams.pc);
    if (updatedParams.distance !== undefined) setDistance(updatedParams.distance);
    if (updatedParams.experience !== undefined) setExperience(updatedParams.experience);

    setPage("1");
    updateSearchParams({ ...updatedParams, page: "1" });
  };

  const clearFilters = () => {
    setSelectedCategory("");
    setSelectedRole("");
    setPc("");
    setDistance("");
    setExperience("");
    setPage("1");
    setApiData(null); // Clear existing data to avoid rendering stale state
    router.push(`${pathname}?page=1`);
  };

  const availableRoles =
    filtersData.find((category: any) => category.title === selectedCategory)?.roles || [];

  return (
    <div className="mt-20 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center text-black">Security Companies</h1>

      <div className="bg-white p-6 w-full max-w-5xl mx-auto">
        <h2 className="text-2xl font-semibold text-black mb-4">Filter Security Companies</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Postcode"
            value={pc}
            onChange={(e) => handleFilterChange({ pc: e.target.value })}
             className={`border px-4 py-2 rounded-md focus:outline-none focus:ring-2 text-black ${
    postcodeValid ? 'border-gray-300 focus:ring-black' : 'border-red-500 focus:ring-red-500'
  }`}     />

          <select
            value={selectedCategory}
            onChange={(e) => handleFilterChange({ sr: e.target.value })}
            className="border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-black text-black bg-white"
          >
            <option value="">Select Category</option>
            {filtersData.map((category: any) => (
              <option key={category.title} value={category.title}>
                {category.title}
              </option>
            ))}
          </select>

          <select
            value={selectedRole}
            onChange={(e) => handleFilterChange({ so: e.target.value })}
            className="border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-black text-black bg-white"
            disabled={!selectedCategory}
          >
            <option value="">Select Role</option>
            {availableRoles.map((role: any) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>

          {showAdvanced && (
            <select
              value={distance}
              onChange={(e) => {
                const value = e.target.value;
                if (value === "Nationwide") {
                  handleFilterChange({ distance: value, pc: "" });
                } else {
                  handleFilterChange({ distance: value });
                }
              }}
              className="border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-black text-black bg-white"
              disabled={!pc}
            >
            <option value="">Select Distance</option>
            <option value="5">Up to 5 miles</option>
            <option value="10">10 miles</option>
            <option value="20">20 miles</option>
            <option value="50">50 miles</option>
            <option value="Nationwide">Nationwide</option>
            </select>
          )}
        </div>

        <div className="mt-4 flex flex-wrap gap-4">
          <button
            onClick={() => {
              const token = localStorage.getItem("loginData");
              if (token) {
                setShowAdvanced(!showAdvanced);
              } else {
                setShowLoginModal(true);
              }
            }}
            className="px-5 py-2 bg-black text-white rounded hover:bg-gray-800 transition"
          >
            {showAdvanced ? "Hide Advanced Search" : "Show Advanced Search"}
          </button>

          <button
            onClick={clearFilters}
            className="px-5 py-2 bg-gray-200 text-black rounded hover:bg-gray-300 transition"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {showLoginModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full text-center">
            <h3 className="text-lg font-semibold mb-4 text-black">
              Please login to use advanced filters.
            </h3>
            <button
              onClick={() => setShowLoginModal(false)}
              className="mt-2 px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* ✅ Safe rendering only when data is available */}
      {apiData ? (
        <>
          <CompaniesList apiData={apiData} loading={loading} error={error} />

          {/* Pagination */}
          {apiData.totalCount && apiData.pageSize && (
            <div className="flex justify-center mt-6">
              {Array.from({ length: Math.ceil(apiData.totalCount / apiData.pageSize) }, (_, i) => (
                <button
                  key={i}
                  className={`px-3 py-1 mx-1 rounded ${
                    apiData.page === i + 1 ? "bg-black text-white" : "bg-gray-200"
                  }`}
                  onClick={() => updateSearchParams({ page: String(i + 1) })}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
          <MapSection data={apiData.companies} type="security companies" />

          
        </>
      ) : (
        <p className="text-center mt-8 text-gray-500">Loading security companies...</p>
      )}
    </div>
  );
}






// "use client";

// import { useEffect, useState } from "react";
// import { useSearchParams, useRouter, usePathname } from "next/navigation";
// import CompaniesList from "@/app/connecting-business/components/CompaniesList";
// import MapSection from "@/app/connecting-business/components/MapSection";
// import filtersData from "@/sections/data/secuirty_services.json";
//  import {CompaniesApiResponse} from "@/app/connecting-business/types"; // Use shared types
// import { API_URL } from "@/utils/path";


// export default function SecurityCompaniesPage() {
//   const searchParams = useSearchParams();
//   const router = useRouter();
//   const pathname = usePathname();

//   const [apiData, setApiData] = useState<CompaniesApiResponse | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const [selectedCategory, setSelectedCategory] = useState(searchParams?.get("sr") || "");
//   const [selectedRole, setSelectedRole] = useState(searchParams?.get("so") || "");
//   const [pc, setPc] = useState(searchParams?.get("pc") || "");
//   const [distance, setDistance] = useState(searchParams?.get("distance") || "");
//   const [experience, setExperience] = useState(searchParams?.get("experience") || "");
//   const [page, setPage] = useState(searchParams?.get("page") || "1");

//   const [showAdvanced, setShowAdvanced] = useState(false);
//   const [showLoginModal, setShowLoginModal] = useState(false);

//   const fetchData = async () => {
//     setLoading(true);
//     setError(null);

//     try {
//       const queryParams = new URLSearchParams({
//         ...(selectedCategory && { sr: selectedCategory }),
//         ...(selectedRole && { so: selectedRole }),
//         ...(pc && { pc }),
//         ...(distance && { distance }),
//         ...(experience && { experience }),
//         page,
//       });

//       const apiUrl = `${API_URL}/users/security-companies?${queryParams}`;
//       const response = await fetch(apiUrl);

//       if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

//       const data: CompaniesApiResponse = await response.json();
//       setApiData(data);
//     } catch (err: any) {
//       setError(err.message || "An error occurred");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, [selectedCategory, selectedRole, pc, distance, experience, page]);

//   const updateSearchParams = (params: Record<string, string>) => {
//     const newParams = new URLSearchParams(searchParams?.toString() || "");

//     Object.entries(params).forEach(([key, value]) => {
//       if (value) newParams.set(key, value);
//       else newParams.delete(key);
//     });

//     router.push(`${pathname}?${newParams.toString()}`);
//   };

//   const handleFilterChange = (updatedParams: Record<string, string>) => {

//     if (updatedParams.sr !== undefined) {
//       setSelectedCategory(updatedParams.sr);
//       setSelectedRole("");
//     }
//     if (updatedParams.so !== undefined) {
//       setSelectedRole(updatedParams.so);
//     }
//     if (updatedParams.pc !== undefined) setPc(updatedParams.pc);
//     if (updatedParams.distance !== undefined) setDistance(updatedParams.distance);
//     if (updatedParams.experience !== undefined) setExperience(updatedParams.experience);

//     setPage("1");
//     updateSearchParams({ ...updatedParams, page: "1" });
//   };

//   const clearFilters = () => {
//     setSelectedCategory("");
//     setSelectedRole("");
//     setPc("");
//     setDistance("");
//     setExperience("");
//     setPage("1");

//     router.push(`${pathname}?page=1`);
//   };

//   const availableRoles =
//     filtersData.find((category: any) => category.title === selectedCategory)?.roles || [];

//   return (
//     <div className="mt-20 px-4">
//       <h1 className="text-3xl font-bold mb-8 text-center text-black">Security Companies</h1>

//       <div className="bg-white  p-6 w-full max-w-5xl mx-auto">
//         <h2 className="text-2xl font-semibold text-black mb-4">Filter Security Companies</h2>
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
//           <input
//             type="text"
//             placeholder="Postcode"
//             value={pc}
//             onChange={(e) => handleFilterChange({ pc: e.target.value })}
//             className="border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-black text-black"
//           />

//           <select
//             value={selectedCategory}
//             onChange={(e) => handleFilterChange({ sr: e.target.value })}
//             className="border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-black text-black bg-white"
//           >
//             <option value="">Select Category</option>
//             {filtersData.map((category: any) => (
//               <option key={category.title} value={category.title}>
//                 {category.title}
//               </option>
//             ))}
//           </select>

//           <select
//             value={selectedRole}
//             onChange={(e) => handleFilterChange({ so: e.target.value })}
//             className="border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-black text-black bg-white"
//             disabled={!selectedCategory}
//           >
//             <option value="">Select Role</option>
//             {availableRoles.map((role: any) => (
//               <option key={role} value={role}>
//                 {role}
//               </option>
//             ))}
//           </select>

//           {showAdvanced && (
//             <>
//               <input
//                 type="text"
//                 placeholder="Distance"
//                 value={distance}
//                 onChange={(e) => handleFilterChange({ distance: e.target.value })}
//                 className="border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-black text-black"
//               />

//             </>
//           )}
//         </div>

//         <div className="mt-4 flex flex-wrap gap-4">
//           <button
//             onClick={() => {
//               const token = localStorage.getItem("loginData");
//               if (token) {
//                 setShowAdvanced(!showAdvanced);
//               } else {
//                 setShowLoginModal(true);
//               }
//             }}
//             className="px-5 py-2 bg-black text-white rounded hover:bg-gray-800 transition"
//           >
//             {showAdvanced ? "Hide Advanced Search" : "Show Advanced Search"}
//           </button>

//           <button
//             onClick={clearFilters}
//             className="px-5 py-2 bg-gray-200 text-black rounded hover:bg-gray-300 transition"
//           >
//             Clear Filters
//           </button>
//         </div>
//       </div>

//       {showLoginModal && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
//           <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full text-center">
//             <h3 className="text-lg font-semibold mb-4 text-black">
//               Please login to use advanced filters.
//             </h3>
//             <button
//               onClick={() => setShowLoginModal(false)}
//               className="mt-2 px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition"
//             >
//               Close
//             </button>
//           </div>
//         </div>
//       )}

//       <CompaniesList apiData={apiData as CompaniesApiResponse} loading={loading} error={error} />
//       <MapSection data={apiData?.companies || []} type="security companies" />

//       {apiData?.totalCount && apiData?.pageSize && (
//         <div className="flex justify-center mt-6">
//           {Array.from({ length: Math.ceil(apiData.totalCount / apiData.pageSize) }, (_, i) => (
//             <button
//               key={i}
//               className={`px-3 py-1 mx-1 rounded ${
//                 apiData.page === i + 1 ? "bg-black text-white" : "bg-gray-200"
//               }`}
//               onClick={() => updateSearchParams({ page: String(i + 1) })}
//             >
//               {i + 1}
//             </button>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }
