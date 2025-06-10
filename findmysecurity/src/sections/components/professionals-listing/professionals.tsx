"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

import lookingForData from "@/sections/data/secuirty_professional.json";
import { ApiResponse } from "@/app/connecting-business/types";
import ProfessionalsList from "@/app/connecting-business/components/ProfessionalsList";
import MapSection from "@/app/connecting-business/components/MapSection";
import { API_URL } from "@/utils/path";

// Define valid time slots and days for type safety
type TimeSlot = "Morning" | "Afternoon" | "Evening" | "Overnight";
type Day = "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";

export default function ProfessionalsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [apiData1, setApiData1] = useState<ApiResponse | null>(null);
  const [filteredData, setFilteredData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [postcodeValid, setPostcodeValid] = useState(true);

  const [selectedCategory, setSelectedCategory] = useState(searchParams?.get("role") || "");
  const [selectedRole, setSelectedRole] = useState(searchParams?.get("subcategory") || "");

  // Validate timeSlot and day from searchParams
  const validTimeSlots: TimeSlot[] = ["Morning", "Afternoon", "Evening", "Overnight"];
  const validDays: Day[] = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const initialTimeSlot = searchParams?.get("timeSlot");
  const initialDay = searchParams?.get("day");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | "">(
    initialTimeSlot && validTimeSlots.includes(initialTimeSlot as TimeSlot) ? initialTimeSlot as TimeSlot : ""
  );
  const [selectedDay, setSelectedDay] = useState<Day | "">(
    initialDay && validDays.includes(initialDay as Day) ? initialDay as Day : ""
  );

  const pc = searchParams?.get("pc") || "";
  const distance = searchParams?.get("distance") || "";
  const experience = searchParams?.get("experience") || "";
  const page = searchParams?.get("page") || "1";
  const minHr = searchParams?.get("minHr") || "";
  const maxHr = searchParams?.get("maxHr") || "";
  const [pageSize, setPageSize] = useState<number>(10);

  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    validatePostcode(pc);
  }, [pc]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const queryParamsArray: string[] = [];

      if (selectedCategory) queryParamsArray.push(`role=${encodeURIComponent(selectedCategory)}`);
      if (selectedRole) queryParamsArray.push(`subcategory=${encodeURIComponent(selectedRole)}`);
      // Only include postcode if distance is not Nationwide
      if (pc && distance !== "Nationwide") queryParamsArray.push(`pc=${encodeURIComponent(pc)}`);
      if (distance) queryParamsArray.push(`distance=${encodeURIComponent(distance)}`);
      if (experience) queryParamsArray.push(`exp=${encodeURIComponent(experience)}`);
      if (minHr) queryParamsArray.push(`minHr=${encodeURIComponent(minHr)}`);
      if (maxHr) queryParamsArray.push(`maxHr=${encodeURIComponent(maxHr)}`);
      if (page) queryParamsArray.push(`page=${encodeURIComponent(page.toString())}`);
      if (pageSize) queryParamsArray.push(`pageSize=${encodeURIComponent(pageSize.toString())}`);

      const queryString = queryParamsArray.length > 0 ? `?${queryParamsArray.join('&')}` : '';
      const apiUrl = `${API_URL}/users/professionals${queryString}`;

      const response = await fetch(apiUrl);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const token = localStorage.getItem("loginData");
      setIsLoggedIn(!!token);

      const data: ApiResponse = await response.json();
      setApiData1(data);

      if (selectedDay && selectedTimeSlot) {
        const filteredProfessionals = data.professionals.filter((professional) => {
          const schedule = professional?.weeklySchedule;

      
          const available = schedule?.[selectedTimeSlot]?.[selectedDay] === true;
      
          return available;
        });
      
      
        setFilteredData({
          ...data,
          professionals: filteredProfessionals,
          count: filteredProfessionals.length,
          totalCount: filteredProfessionals.length,
        });
      } else if (selectedDay) {
        const filteredProfessionals = data.professionals.filter((professional) => {
          const schedule = professional?.weeklySchedule;
          const available = Object.keys(schedule || {}).some((timeSlot) => {
            const isAvailable = schedule?.[timeSlot as TimeSlot]?.[selectedDay] === true;
            console.log(`  TimeSlot ${timeSlot} → ${selectedDay}:`, isAvailable);
            return isAvailable;
          });
      
          return available;
        });
      
      
        setFilteredData({
          ...data,
          professionals: filteredProfessionals,
          count: filteredProfessionals.length,
          totalCount: filteredProfessionals.length,
        });
      } else if (selectedTimeSlot) {
        const filteredProfessionals = data.professionals.filter((professional) => {
          const schedule = professional?.weeklySchedule;
      
          const available = Object.values(schedule?.[selectedTimeSlot] || {}).some(
            (available) => available === true
          );
      
          return available;
        });
            
        setFilteredData({
          ...data,
          professionals: filteredProfessionals,
          count: filteredProfessionals.length,
          totalCount: filteredProfessionals.length,
        });
      } else {
        console.log("No day or time filter selected — showing all professionals.");
        setFilteredData(data);
      }
      
      // Apply client-side filtering for day and time slot
      // if (selectedDay && selectedTimeSlot) {
      //   const filteredProfessionals = data.professionals.filter((professional) => {
      //     const schedule = professional?.weeklySchedule;
      //     if (schedule && selectedTimeSlot in schedule && schedule[selectedTimeSlot]) {
      //       return schedule[selectedTimeSlot][selectedDay] === true;
      //     }
      //     return false;
      //   });
      //   setFilteredData({
      //     ...data,
      //     professionals: filteredProfessionals,
      //     count: filteredProfessionals.length,
      //     totalCount: filteredProfessionals.length,
      //   });
      // } else if (selectedDay) {
      //   const filteredProfessionals = data.professionals.filter((professional) => {
      //     const schedule = professional?.weeklySchedule;
      //     if (!schedule) return false;
      //     return Object.keys(schedule).some(
      //       (timeSlot) =>
      //         timeSlot in schedule &&
      //         schedule[timeSlot as TimeSlot]?.[selectedDay] === true
      //     );
      //   });
      //   setFilteredData({
      //     ...data,
      //     professionals: filteredProfessionals,
      //     count: filteredProfessionals.length,
      //     totalCount: filteredProfessionals.length,
      //   });
      // } else if (selectedTimeSlot) {
      //   const filteredProfessionals = data.professionals.filter((professional) => {
      //     const schedule = professional?.weeklySchedule;
      //     if (schedule && selectedTimeSlot in schedule && schedule[selectedTimeSlot]) {
      //       return Object.values(schedule[selectedTimeSlot]).some((available) => available === true);
      //     }
      //     return false;
      //   });
      //   setFilteredData({
      //     ...data,
      //     professionals: filteredProfessionals,
      //     count: filteredProfessionals.length,
      //     totalCount: filteredProfessionals.length,
      //   });
      // } else {
      //   setFilteredData(data);
      // }
    } catch (err: any) {
      setError(err.message || "An error occurred");
      setFilteredData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [
    selectedCategory,
    selectedRole,
    pc,
    distance,
    experience,
    page,
    pageSize,
    minHr,
    maxHr,
    selectedTimeSlot,
    selectedDay,
  ]);

  const updateSearchParams = (params: Record<string, string>) => {
    const newParams = new URLSearchParams(searchParams?.toString() || "");
    Object.entries(params).forEach(([key, value]) => {
      if (value) newParams.set(key, value);
      else newParams.delete(key);
    });
    router.push(`${pathname}?${newParams.toString()}`);
  };

  const validatePostcode = async (postcode: string) => {
    if (!postcode) return setPostcodeValid(true);

    try {
      const res = await fetch(`https://api.postcodes.io/postcodes/${postcode}/validate`);
      const data = await res.json();
      setPostcodeValid(data.result);
    } catch {
      setPostcodeValid(false);
    }
  };

  const handleFilterChange = (updatedParams: Record<string, string>) => {
    if (updatedParams.role !== undefined) {
      setSelectedCategory(updatedParams.role);
      setSelectedRole("");
    }
    if (updatedParams.subcategory !== undefined) {
      setSelectedRole(updatedParams.subcategory);
    }
    if (updatedParams.timeSlot !== undefined) {
      const timeSlot = updatedParams.timeSlot;
      setSelectedTimeSlot(validTimeSlots.includes(timeSlot as TimeSlot) ? timeSlot as TimeSlot : "");
    }
    if (updatedParams.day !== undefined) {
      const day = updatedParams.day;
      setSelectedDay(validDays.includes(day as Day) ? day as Day : "");
    }
    updateSearchParams({ ...updatedParams, page: "1" });
  };

  const handleClearFilters = () => {
    setSelectedCategory("");
    setSelectedRole("");
    setSelectedTimeSlot("");
    setSelectedDay("");
    updateSearchParams({
      page: "1",
      role: "",
      subcategory: "",
      pc: "",
      distance: "",
      experience: "",
      minHr: "",
      maxHr: "",
      timeSlot: "",
      day: "",
    });
  };

  const availableRoles =
    lookingForData.find((category: any) => category.title === selectedCategory)?.roles || [];

  return (
    <div className="mt-20 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center text-black">Professionals</h1>

      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-5xl mx-auto">
        <h2 className="text-2xl font-semibold text-black mb-4">Filter Professionals</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Postcode"
            value={pc}
            onChange={(e) => handleFilterChange({ pc: e.target.value, distance: "" })}
            className={`border px-4 py-2 rounded-md focus:outline-none focus:ring-2 text-black ${
              postcodeValid ? "border-gray-300 focus:ring-black" : "border-red-500 focus:ring-red-500"
            }`}
          />

          <select
            value={selectedCategory}
            onChange={(e) => handleFilterChange({ role: e.target.value })}
            className="border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-black text-black bg-white"
          >
            <option value="">Select Category</option>
            {lookingForData.map((category: any) => (
              <option key={category.title} value={category.title}>
                {category.title}
              </option>
            ))}
          </select>

          <select
            value={selectedRole}
            onChange={(e) => handleFilterChange({ subcategory: e.target.value })}
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
            <>
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

              <input
                type="text"
                placeholder="Experience"
                value={experience}
                onChange={(e) => handleFilterChange({ experience: e.target.value })}
                className="border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-black text-black"
              />

              <input
                type="number"
                placeholder="Min Hourly Rate"
                value={minHr}
                onChange={(e) => handleFilterChange({ minHr: e.target.value })}
                className="border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-black text-black"
              />

              <input
                type="number"
                placeholder="Max Hourly Rate"
                value={maxHr}
                onChange={(e) => handleFilterChange({ maxHr: e.target.value })}
                className="border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-black text-black"
              />

              <select
                value={selectedTimeSlot}
                onChange={(e) => handleFilterChange({ timeSlot: e.target.value })}
                className="border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-black text-black bg-white"
              >
                <option value="">Select Time Slot</option>
                <option value="Morning">Morning</option>
                <option value="Afternoon">Afternoon</option>
                <option value="Evening">Evening</option>
                <option value="Overnight">Overnight</option>
              </select>

              <select
                value={selectedDay}
                onChange={(e) => handleFilterChange({ day: e.target.value })}
                className="border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-black text-black bg-white"
              >
                <option value="">Select Day</option>
                <option value="Mon">Monday</option>
                <option value="Tue">Tuesday</option>
                <option value="Wed">Wednesday</option>
                <option value="Thu">Thursday</option>
                <option value="Fri">Friday</option>
                <option value="Sat">Saturday</option>
                <option value="Sun">Sunday</option>
              </select>
            </>
          )}
        </div>

        <div className="mt-4 flex flex-wrap gap-4">
          <button
            onClick={() => {
              if (isLoggedIn) {
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
            onClick={handleClearFilters}
            className="px-5 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
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

      <>
        <ProfessionalsList apiData={filteredData as ApiResponse} loading={loading} error={error} />
        {filteredData?.totalCount && filteredData?.pageSize && (
          <div className="flex justify-center mt-6">
            {Array.from({ length: Math.ceil(filteredData.totalCount / filteredData.pageSize) }, (_, i) => (
              <button
                key={i}
                className={`px-3 py-1 mx-1 rounded ${
                  filteredData.page === i + 1 ? "bg-black text-white" : "bg-gray-200"
                }`}
                onClick={() => updateSearchParams({ page: String(i + 1) })}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
        <MapSection data={filteredData?.professionals || []} type="professionals" />
      </>
    </div>
  );
}




// "use client";

// import { useEffect, useState } from "react";
// import { useSearchParams, useRouter, usePathname } from "next/navigation";

// import lookingForData from "@/sections/data/secuirty_professional.json";
// import { ApiResponse } from "@/app/connecting-business/types";
// import ProfessionalsList from "@/app/connecting-business/components/ProfessionalsList";
// import MapSection from "@/app/connecting-business/components/MapSection";

// export default function ProfessionalsPage() {
//   const searchParams = useSearchParams();
//   const router = useRouter();
//   const pathname = usePathname();

//   const [apiData1, setApiData1] = useState<ApiResponse | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [postcodeValid, setPostcodeValid] = useState(true);

//   const [selectedCategory, setSelectedCategory] = useState(searchParams?.get("role") || "");
//   const [selectedRole, setSelectedRole] = useState(searchParams?.get("subcategory") || "");
//   const [selectedTimeSlot, setSelectedTimeSlot] = useState(searchParams?.get("timeSlot") || "");
//   const [selectedDay, setSelectedDay] = useState(searchParams?.get("day") || "");

//   const pc = searchParams?.get("pc") || "";
//   const distance = searchParams?.get("distance") || "";
//   const experience = searchParams?.get("experience") || "";
//   const page = searchParams?.get("page") || "1";
//   const minHr = searchParams?.get("minHr") || "";
//   const maxHr = searchParams?.get("maxHr") || "";
//   const [pageSize, setPageSize] = useState<number>(10);

//   const [showAdvanced, setShowAdvanced] = useState(false);
//   const [showLoginModal, setShowLoginModal] = useState(false);
//   const [isLoggedIn, setIsLoggedIn] = useState(false);

//   useEffect(() => {
//     validatePostcode(pc);
//   }, [pc]);

//   const fetchData = async () => {
//     setLoading(true);
//     setError(null);

//     try {
//       const queryParamsArray: string[] = [];

//       if (selectedCategory) queryParamsArray.push(`role=${encodeURIComponent(selectedCategory)}`);
//       if (selectedRole) queryParamsArray.push(`subcategory=${encodeURIComponent(selectedRole)}`);
//       if (pc) queryParamsArray.push(`pc=${encodeURIComponent(pc)}`);
//       if (distance) queryParamsArray.push(`distance=${encodeURIComponent(distance)}`);
//       if (experience) queryParamsArray.push(`experience=${encodeURIComponent(experience)}`);
//       if (minHr) queryParamsArray.push(`minHr=${encodeURIComponent(minHr)}`);
//       if (maxHr) queryParamsArray.push(`maxHr=${encodeURIComponent(maxHr)}`);
//       if (selectedTimeSlot) queryParamsArray.push(`timeSlot=${encodeURIComponent(selectedTimeSlot)}`);
//       if (selectedDay) queryParamsArray.push(`day=${encodeURIComponent(selectedDay)}`);
//       if (page) queryParamsArray.push(`page=${encodeURIComponent(page.toString())}`);
//       if (pageSize) queryParamsArray.push(`pageSize=${encodeURIComponent(pageSize.toString())}`);

//       const queryString = queryParamsArray.length > 0 ? `?${queryParamsArray.join('&')}` : '';
//       const apiUrl = `https://ub1b171tga.execute-api.eu-north-1.amazonaws.com/dev/users/professionals${queryString}`;

//       const response = await fetch(apiUrl);
//       if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

//       const token = localStorage.getItem("loginData");
//       setIsLoggedIn(!!token);

//       const data: ApiResponse = await response.json();
//       setApiData1(data);
//     } catch (err: any) {
//       setError(err.message || "An error occurred");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, [
//     selectedCategory,
//     selectedRole,
//     pc,
//     distance,
//     experience,
//     page,
//     pageSize,
//     minHr,
//     maxHr,
//     selectedTimeSlot,
//     selectedDay,
//   ]);

//   const updateSearchParams = (params: Record<string, string>) => {
//     const newParams = new URLSearchParams(searchParams?.toString() || "");
//     Object.entries(params).forEach(([key, value]) => {
//       if (value) newParams.set(key, value);
//       else newParams.delete(key);
//     });
//     router.push(`${pathname}?${newParams.toString()}`);
//   };

//   const validatePostcode = async (postcode: string) => {
//     if (!postcode) return setPostcodeValid(true);

//     try {
//       const res = await fetch(`https://api.postcodes.io/postcodes/${postcode}/validate`);
//       const data = await res.json();
//       setPostcodeValid(data.result);
//     } catch {
//       setPostcodeValid(false);
//     }
//   };

//   const handleFilterChange = (updatedParams: Record<string, string>) => {
//     if (updatedParams.role !== undefined) {
//       setSelectedCategory(updatedParams.role);
//       setSelectedRole("");
//     }
//     if (updatedParams.subcategory !== undefined) {
//       setSelectedRole(updatedParams.subcategory);
//     }
//     if (updatedParams.timeSlot !== undefined) {
//       setSelectedTimeSlot(updatedParams.timeSlot);
//     }
//     if (updatedParams.day !== undefined) {
//       setSelectedDay(updatedParams.day);
//     }
//     updateSearchParams({ ...updatedParams, page: "1" });
//   };

//   const handleClearFilters = () => {
//     setSelectedCategory("");
//     setSelectedRole("");
//     setSelectedTimeSlot("");
//     setSelectedDay("");
//     updateSearchParams({
//       page: "1",
//       role: "",
//       subcategory: "",
//       pc: "",
//       distance: "",
//       experience: "",
//       minHr: "",
//       maxHr: "",
//       timeSlot: "",
//       day: "",
//     });
//   };

//   const availableRoles =
//     lookingForData.find((category: any) => category.title === selectedCategory)?.roles || [];

//   return (
//     <div className="mt-20 px-4">
//       <h1 className="text-3xl font-bold mb-8 text-center text-black">Professionals</h1>

//       <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-5xl mx-auto">
//         <h2 className="text-2xl font-semibold text-black mb-4">Filter Professionals</h2>
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
//           <input
//             type="text"
//             placeholder="Postcode"
//             value={pc}
//             onChange={(e) => handleFilterChange({ pc: e.target.value })}
//             className={`border px-4 py-2 rounded-md focus:outline-none focus:ring-2 text-black ${
//               postcodeValid ? "border-gray-300 focus:ring-black" : "border-red-500 focus:ring-red-500"
//             }`}
//           />

//           <select
//             value={selectedCategory}
//             onChange={(e) => handleFilterChange({ role: e.target.value })}
//             className="border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-black text-black bg-white"
//           >
//             <option value="">Select Category</option>
//             {lookingForData.map((category: any) => (
//               <option key={category.title} value={category.title}>
//                 {category.title}
//               </option>
//             ))}
//           </select>

//           <select
//             value={selectedRole}
//             onChange={(e) => handleFilterChange({ subcategory: e.target.value })}
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

//               <input
//                 type="text"
//                 placeholder="Experience"
//                 value={experience}
//                 onChange={(e) => handleFilterChange({ experience: e.target.value })}
//                 className="border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-black text-black"
//               />

//               <input
//                 type="number"
//                 placeholder="Min Hourly Rate"
//                 value={minHr}
//                 onChange={(e) => handleFilterChange({ minHr: e.target.value })}
//                 className="border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-black text-black"
//               />

//               <input
//                 type="number"
//                 placeholder="Max Hourly Rate"
//                 value={maxHr}
//                 onChange={(e) => handleFilterChange({ maxHr: e.target.value })}
//                 className="border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-black text-black"
//               />

//               <select
//                 value={selectedTimeSlot}
//                 onChange={(e) => handleFilterChange({ timeSlot: e.target.value })}
//                 className="border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-black text-black bg-white"
//               >
//                 <option value="">Select Time Slot</option>
//                 <option value="Morning">Morning</option>
//                 <option value="Afternoon">Afternoon</option>
//                 <option value="Evening">Evening</option>
//                 <option value="Overnight">Overnight</option>
//               </select>

//               <select
//                 value={selectedDay}
//                 onChange={(e) => handleFilterChange({ day: e.target.value })}
//                 className="border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-black text-black bg-white"
//               >
//                 <option value="">Select Day</option>
//                 <option value="Mon">Monday</option>
//                 <option value="Tue">Tuesday</option>
//                 <option value="Wed">Wednesday</option>
//                 <option value="Thu">Thursday</option>
//                 <option value="Fri">Friday</option>
//                 <option value="Sat">Saturday</option>
//                 <option value="Sun">Sunday</option>
//               </select>
//             </>
//           )}
//         </div>

//         <div className="mt-4 flex flex-wrap gap-4">
//           <button
//             onClick={() => {
//               if (isLoggedIn) {
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
//             onClick={handleClearFilters}
//             className="px-5 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
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

//       <>
//         <ProfessionalsList apiData={apiData1 as ApiResponse} loading={loading} error={error} />
//         {apiData1?.totalCount && apiData1?.pageSize && (
//           <div className="flex justify-center mt-6">
//             {Array.from({ length: Math.ceil(apiData1.totalCount / apiData1.pageSize) }, (_, i) => (
//               <button
//                 key={i}
//                 className={`px-3 py-1 mx-1 rounded ${
//                   apiData1.page === i + 1 ? "bg-black text-white" : "bg-gray-200"
//                 }`}
//                 onClick={() => updateSearchParams({ page: String(i + 1) })}
//               >
//                 {i + 1}
//               </button>
//             ))}
//           </div>
//         )}
//         <MapSection data={apiData1?.professionals || []} type="professionals" />
//       </>
//     </div>
//   );
// }









// "use client";

// import { useEffect, useState } from "react";
// import { useSearchParams, useRouter, usePathname } from "next/navigation";

// import lookingForData from "@/sections/data/secuirty_professional.json";
// import { ApiResponse, Professional } from "@/app/connecting-business/types"; // Use shared types
// import ProfessionalsList from "@/app/connecting-business/components/ProfessionalsList";
// import MapSection from "@/app/connecting-business/components/MapSection";

// export default function ProfessionalsPage() {
//   const searchParams = useSearchParams();
//   const router = useRouter();
//   const pathname = usePathname();

//   const [apiData1, setApiData1] = useState<ApiResponse | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//  const [postcodeValid, setPostcodeValid] = useState(true);
//   const [selectedCategory, setSelectedCategory] = useState(searchParams?.get("role") || "");
//   const [selectedRole, setSelectedRole] = useState(searchParams?.get("subcategory") || "");
//   const pc = searchParams?.get("pc") || "";
//   const distance = searchParams?.get("distance") || "";
//   const experience = searchParams?.get("experience") || "";
//   const page = searchParams?.get("page") || "1";
//   const minHr = searchParams?.get("minHr") || "";
//   const maxHr = searchParams?.get("maxHr") || "";
//   const [pageSize, setPageSize] = useState<number>(10);


//   const [showAdvanced, setShowAdvanced] = useState(false);
//   const [showLoginModal, setShowLoginModal] = useState(false);
//   const [isLoggedIn, setIsLoggedIn] = useState(false); // Track login state

// useEffect(() => {
//   validatePostcode(pc);
// }, [pc]);
// const fetchData = async () => {
//   setLoading(true);
//   setError(null);

//   try {
//     const queryParamsArray: string[] = [];

//     if (selectedCategory) queryParamsArray.push(`role=${encodeURIComponent(selectedCategory)}`);
//     if (selectedRole) queryParamsArray.push(`subcategory=${encodeURIComponent(selectedRole)}`);
//     if (pc) queryParamsArray.push(`pc=${encodeURIComponent(pc)}`);
//     if (distance) queryParamsArray.push(`distance=${encodeURIComponent(distance)}`);
//     if (experience) queryParamsArray.push(`experience=${encodeURIComponent(experience)}`);
//     if (minHr) queryParamsArray.push(`minHr=${encodeURIComponent(minHr)}`);
//     if (maxHr) queryParamsArray.push(`maxHr=${encodeURIComponent(maxHr)}`);
//     if (page !== undefined && page !== null) queryParamsArray.push(`page=${encodeURIComponent(page.toString())}`);
//     if (pageSize !== undefined && pageSize !== null) queryParamsArray.push(`pageSize=${encodeURIComponent(pageSize.toString())}`);

//     const queryString = queryParamsArray.length > 0 ? `?${queryParamsArray.join('&')}` : '';

//     const apiUrl = `https://ub1b171tga.execute-api.eu-north-1.amazonaws.com/dev/users/professionals${queryString}`;
//     const response = await fetch(apiUrl);

//     if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
//     const token = localStorage.getItem("loginData");
//     setIsLoggedIn(!!token);
//     const data: ApiResponse = await response.json();
//     setApiData1(data);
//   } catch (err: any) {
//     setError(err.message || "An error occurred");
//   } finally {
//     setLoading(false);
//   }
// };
// useEffect(() => {
//   fetchData();
// }, [selectedCategory, selectedRole, pc, distance, experience, page, pageSize, minHr, maxHr]);


//   const updateSearchParams = (params: Record<string, string>) => {
//     const newParams = new URLSearchParams(searchParams?.toString() || "");

//     Object.entries(params).forEach(([key, value]) => {
//       if (value) newParams.set(key, value);
//       else newParams.delete(key);
//     });

//     router.push(`${pathname}?${newParams.toString()}`);
//   };
// const validatePostcode = async (postcode: string) => {
//   if (!postcode) {
//     setPostcodeValid(true);
//    // setPostcodeError("");
//     return;
//   }

//   try {
//     const res = await fetch(`https://api.postcodes.io/postcodes/${postcode}/validate`);
//     const data = await res.json();
//     if (data.result) {
//       setPostcodeValid(true);
//      // setPostcodeError("");
//     } else {
//       setPostcodeValid(false);
//       //setPostcodeError("Invalid UK postcode");
//     }
//   } catch (err) {
//     setPostcodeValid(false);
//     //setPostcodeError("Error validating postcode");
//   }
// };
//   const handleFilterChange = (updatedParams: Record<string, string>) => {
//     if (updatedParams.role !== undefined) {
//       setSelectedCategory(updatedParams.role);
//       setSelectedRole("");
//     }
//     if (updatedParams.subcategory !== undefined) {
//       setSelectedRole(updatedParams.subcategory);
//     }
//     updateSearchParams({ ...updatedParams, page: "1" });
//   };

//   const handleClearFilters = () => {
//     setSelectedCategory("");
//     setSelectedRole("");
//     updateSearchParams({
//       page: "1",
//       role: "",
//       subcategory: "",
//       pc: "",
//       distance: "",
//       experience: "",
//       minHr: "",
//       maxHr: "",
//     });
//   };

//   const availableRoles =
//     lookingForData.find((category: any) => category.title === selectedCategory)?.roles || [];

//   return (
//     <div className="mt-20 px-4">
//       <h1 className="text-3xl font-bold mb-8 text-center text-black">Professionals</h1>

//       <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-5xl mx-auto">
//         <h2 className="text-2xl font-semibold text-black mb-4">Filter Professionals</h2>
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
//           <input
//             type="text"
//             placeholder="Postcode"
//             value={pc}
//             onChange={(e) => handleFilterChange({ pc: e.target.value })}
//               className={`border px-4 py-2 rounded-md focus:outline-none focus:ring-2 text-black ${
//     postcodeValid ? 'border-gray-300 focus:ring-black' : 'border-red-500 focus:ring-red-500'
//   }`}
//   //className="border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-black text-black"
//           />

//           <select
//             value={selectedCategory}
//             onChange={(e) => handleFilterChange({ role: e.target.value })}
//             className="border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-black text-black bg-white"
//           >
//             <option value="">Select Category</option>
//             {lookingForData.map((category: any) => (
//               <option key={category.title} value={category.title}>
//                 {category.title}
//               </option>
//             ))}
//           </select>

//           <select
//             value={selectedRole}
//             onChange={(e) => handleFilterChange({ subcategory: e.target.value })}
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

//               <input
//                 type="text"
//                 placeholder="Experience"
//                 value={experience}
//                 onChange={(e) => handleFilterChange({ experience: e.target.value })}
//                 className="border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-black text-black"
//               />

//               <input
//                 type="number"
//                 placeholder="Min Hourly Rate"
//                 value={minHr}
//                 onChange={(e) => handleFilterChange({ minHr: e.target.value })}
//                 className="border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-black text-black"
//               />

//               <input
//                 type="number"
//                 placeholder="Max Hourly Rate"
//                 value={maxHr}
//                 onChange={(e) => handleFilterChange({ maxHr: e.target.value })}
//                 className="border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-black text-black"
//               />
//             </>
//           )}
//         </div>

//         <div className="mt-4 flex flex-wrap gap-4">
//           <button
//             onClick={() => {
//               if (isLoggedIn) {
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
//             onClick={handleClearFilters}
//             className="px-5 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
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

//       <>
//         <ProfessionalsList apiData={apiData1 as ApiResponse} loading={loading} error={error} />
//       {apiData1?.totalCount && apiData1?.pageSize && (
//         <div className="flex justify-center mt-6">
//           {Array.from({ length: Math.ceil(apiData1.totalCount / apiData1.pageSize) }, (_, i) => (
//             <button
//               key={i}
//               className={`px-3 py-1 mx-1 rounded ${
//                 apiData1.page === i + 1 ? "bg-black text-white" : "bg-gray-200"
//               }`}
//               onClick={() => updateSearchParams({ page: String(i + 1) })}
//             >
//               {i + 1}
//             </button>
//           ))}
//         </div>
//       )}
//         <MapSection data={apiData1?.professionals || []} type="professionals" />
//       </>

//     </div>
//   );
// }
