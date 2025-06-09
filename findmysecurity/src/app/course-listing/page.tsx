'use client';

import React, { useEffect, useState } from "react";
import {
  ArrowLeft,
  GraduationCap,
  Layers,
  Clock,
  CalendarDays,
  MapPin,
  PoundSterling,
  Loader2
} from "lucide-react";
import Link from "next/link";

interface CreatedBy {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  screenName: string;
  phoneNumber: string;
  dateOfBirth: string;
  address: string;
  postcode: string;
  roleId: number;
  createdAt: string;
  updatedAt: string;
  validated: boolean;
}

export interface Course {
  id: number;
  createdById: number;
  title: string;
  description: string;
  otherCourse: string;
  courseType: string;
  courseLevel: string;
  duration: string;
  startDate: string;
  endDate: string;
  location: string;
  deliveryMethod: string;
  price: string;
  accreditation: string;
  bookingLink: string;
  createdAt: string;
  updatedAt: string;
  courseProviderId: number | null;
  createdBy: CreatedBy;
}

interface MetaData {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface CourseResponse {
  data: Course[];
  meta: MetaData;
}

const CourseListPage = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [applyingId, setApplyingId] = useState<number | null>(null);

  const [filters, setFilters] = useState({
    title: '',
    location: '',
    minprice: '',
    maxprice: '',
    startDate: '',
    duration: ''
  });

  const [touched, setTouched] = useState({
    minprice: false,
    maxprice: false,
    startDate: false
  });

  const isMinPriceInvalid = touched.minprice && filters.minprice !== "" && isNaN(Number(filters.minprice));
  const isMaxPriceInvalid = touched.maxprice && filters.maxprice !== "" && isNaN(Number(filters.maxprice));
  const isStartDateInvalid = touched.startDate && filters.startDate !== "" && isNaN(Date.parse(filters.startDate));

  useEffect(() => {
    fetchCourses(currentPage, 5);
  }, [currentPage, filters]);

  const fetchCourses = async (page: number, limit: number) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      params.append("page", page.toString());
      params.append("limit", limit.toString());

      if (filters.title) params.append("title", filters.title);
      if (filters.location) params.append("location", filters.location);
      if (filters.minprice && !isNaN(Number(filters.minprice))) params.append("minprice", filters.minprice);
      if (filters.maxprice && !isNaN(Number(filters.maxprice))) params.append("maxprice", filters.maxprice);
      if (filters.startDate) params.append("startDate", filters.startDate);
      if (filters.duration) params.append("duration", filters.duration);

      const url = `https://ub1b171tga.execute-api.eu-north-1.amazonaws.com/dev/course/course-ads?${params.toString()}`;
      const res = await fetch(url);

      if (!res.ok) throw new Error("Failed to fetch courses");

      const data: CourseResponse = await res.json();
      setCourses(data?.data);
      setTotalPages(data?.meta?.totalPages || 1);
    } catch (err) {
      setError("Unknown error");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (courseId: number, postedBy: number) => {
    const storedData = localStorage.getItem('loginData');
    const data = storedData ? JSON.parse(storedData) : null;
    const currentId = data?.id || data?.user?.id;
    if (!currentId) return alert("User not logged in");

    setApplyingId(courseId);

    try {
      const response = await fetch("https://ub1b171tga.execute-api.eu-north-1.amazonaws.com/dev/course-applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: Number(currentId),
          postedBy: postedBy,
          courseAdId: courseId,
          status: "pending"
        })
      });

      if (!response.ok) throw new Error("Failed to apply");
      alert("Application submitted successfully!");
    } catch (err) {
      console.error(err);
      alert("Something went wrong while applying.");
    } finally {
      setApplyingId(null);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    if (name in touched) {
      setTouched(prev => ({ ...prev, [name]: true }));
    }
  };

  return (
    <div className="min-h-screen bg-white mt-30 text-black px-4 pt-36 pb-10 flex flex-col items-center">
      <button
        className="absolute top-6 left-4 flex mt-20 items-center gap-2 text-black border border-black rounded px-3 py-1 hover:bg-black hover:text-white transition"
        onClick={() => window.history.back()}
      >
        <ArrowLeft size={18} /> Back
      </button>

      <h1 className="text-3xl font-bold mb-8 text-center">Available Courses</h1>

      {/* Filters */}
      <div className="w-full max-w-4xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-10">
        <input
          type="text"
          name="title"
          placeholder="Course Title"
          value={filters.title}
          onChange={handleChange}
          className="border border-gray-300 px-3 py-2 rounded"
        />
        <input
          type="text"
          name="location"
          placeholder="Location"
          value={filters.location}
          onChange={handleChange}
          className="border border-gray-300 px-3 py-2 rounded"
        />
        <input
          type="text"
          name="minprice"
          placeholder="Min Price"
          value={filters.minprice}
          onChange={handleChange}
          onBlur={() => setTouched(prev => ({ ...prev, minprice: true }))}
          className={`border px-3 py-2 rounded w-full ${isMinPriceInvalid ? 'border-red-500' : 'border-gray-300'}`}
        />
        <input
          type="text"
          name="maxprice"
          placeholder="Max Price"
          value={filters.maxprice}
          onChange={handleChange}
          onBlur={() => setTouched(prev => ({ ...prev, maxprice: true }))}
          className={`border px-3 py-2 rounded w-full ${isMaxPriceInvalid ? 'border-red-500' : 'border-gray-300'}`}
        />
        <div>
          <input
            type="date"
            name="startDate"
            value={filters.startDate}
            onChange={handleChange}
            onBlur={() => setTouched(prev => ({ ...prev, startDate: true }))}
            className={`border px-3 py-2 rounded w-full ${isStartDateInvalid ? 'border-red-500' : 'border-gray-300'}`}
          />
          {isStartDateInvalid && <p className="text-sm text-red-600 mt-1">Enter a valid date</p>}
        </div>
        <select
          name="duration"
          value={filters.duration}
          onChange={handleChange}
          className="border border-gray-300 px-3 py-2 rounded"
        >
          <option value="">Select Duration</option>
          <option value="1 day">1 day</option>
          <option value="2 days">2 days</option>
          <option value="1 week">1 week</option>
          <option value="1 month">1 month</option>
          <option value="3 months">3 months</option>
          <option value="6 months">6 months</option>
          <option value="1 year">1 year</option>

        </select>
      </div>

      {/* Course Cards */}
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : (
        <div className="w-full max-w-4xl flex flex-col gap-8">
          {courses.map((course) => (
            <div
              key={course.id}
              className="border border-black rounded-2xl p-6 shadow-md bg-white hover:shadow-xl transition duration-300 flex flex-col md:flex-row md:items-start md:justify-between gap-6"
            >
              <div className="flex-1">
                <h2 className="text-2xl font-semibold mb-2 text-black">{course.title}</h2>
                <p className="text-sm text-gray-700 mb-4 max-h-32 overflow-hidden">
                  {course.description.length > 300
                    ? course.description.slice(0, 300) + "..."
                    : course.description}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm text-gray-800">
                  <p className="flex items-center gap-2"><GraduationCap size={16} /> <span className="font-medium">Type:</span> {course.courseType}</p>
                  <p className="flex items-center gap-2"><Layers size={16} /> <span className="font-medium">Level:</span> {course.courseLevel}</p>
                  <p className="flex items-center gap-2"><Clock size={16} /> <span className="font-medium">Duration:</span> {course.duration}</p>
                  <p className="flex items-center gap-2"><CalendarDays size={16} /> <span className="font-medium">Start:</span> {new Date(course.startDate).toLocaleDateString()}</p>
                  <p className="flex items-center gap-2"><CalendarDays size={16} /> <span className="font-medium">End:</span> {new Date(course.endDate).toLocaleDateString()}</p>
                  <p className="flex items-center gap-2"><MapPin size={16} /> <span className="font-medium">Location:</span> {course.location}</p>
                </div>
              </div>
              <div className="flex flex-col justify-between items-end min-w-[120px]">
                <p className="text-lg font-semibold text-black mt-2 md:mt-0 flex items-center gap-1">
                  <PoundSterling size={18} /> £{course.price}
                </p>
                {course.createdBy.id === 1 ? (
                  <Link href={course.bookingLink} className="mt-4 inline-block w-full text-center px-4 py-2 border border-black text-black rounded-lg hover:bg-black hover:text-white transition whitespace-nowrap flex items-center justify-center gap-2">
                    Follow Link
                  </Link>
                ) : (
                  <button
                    onClick={() => handleApply(course.id, course.createdBy.id)}
                    disabled={applyingId === course.id}
                    className="mt-4 inline-block w-full text-center px-4 py-2 border border-black text-black rounded-lg hover:bg-black hover:text-white transition whitespace-nowrap flex items-center justify-center gap-2"
                  >
                    {applyingId === course.id ? <Loader2 className="animate-spin" size={18} /> : null}
                    {applyingId === course.id ? "Applying..." : "Apply"}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="mt-12 flex flex-wrap justify-center gap-4">
        <button
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 border border-black rounded text-black hover:bg-black hover:text-white disabled:opacity-50"
        >
          Previous
        </button>
        <span className="px-4 py-2">Page {currentPage} of {totalPages}</span>
        <button
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-4 py-2 border border-black rounded text-black hover:bg-black hover:text-white disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default CourseListPage;
















// 'use client';
// interface CreatedBy {
//   id: number;
//   email: string;
//   firstName: string;
//   lastName: string;
//   screenName: string;
//   phoneNumber: string;
//   dateOfBirth: string; // ISO date string
//   address: string;
//   postcode: string;
//   roleId: number;
//   createdAt: string; // ISO date string
//   updatedAt: string; // ISO date string
//   validated: boolean;
// }

// // Interface for each course item
// export interface Course {
//   id: number;
//   createdById: number;
//   title: string;
//   description: string;
//   otherCourse: string;
//   courseType: string;
//   courseLevel: string;
//   duration: string;
//   startDate: string; // ISO date string
//   endDate: string; // ISO date string
//   location: string;
//   deliveryMethod: string;
//   price: string;
//   accreditation: string;
//   bookingLink: string;
//   createdAt: string; // ISO date string
//   updatedAt: string; // ISO date string
//   courseProviderId: number | null;
//   createdBy: CreatedBy;
// }

// // Interface for metadata about pagination
// interface MetaData {
//   total: number;
//   page: number;
//   pageSize: number;
//   totalPages: number;
// }

// // Interface for the entire response
// export interface CourseResponse {
//   data: Course[];
//   meta: MetaData;
// }
// import React, { useEffect, useState } from "react";
// import {
//   ArrowLeft,
//   GraduationCap,
//   Layers,
//   Clock,
//   CalendarDays,
//   MapPin,
//   PoundSterling,
//   Loader2
// } from "lucide-react";
// import Link from "next/link";
//  // adjust import based on your structure

// const CourseListPage = () => {
//   const [courses, setCourses] = useState<Course[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [applyingId, setApplyingId] = useState<number | null>(null);

//   const [filters, setFilters] = useState({
//     title: '',
//     location: '',
//     price: '',
//     startDate: '',
//     duration: ''
//   });

//   const [touched, setTouched] = useState({
//     price: false,
//     startDate: false
//   });

//   useEffect(() => {
//     fetchCourses(currentPage, 5);
//   }, [currentPage, filters]);

//   const fetchCourses = async (page: number, limit: number) => {
//     setLoading(true);
//     setError(null);
//     try {
//       const params = new URLSearchParams();
//       params.append("page", page.toString());
//       params.append("limit", limit.toString());

//       if (filters.title) params.append("title", filters.title);
//       if (filters.location) params.append("location", filters.location);
//       if (filters.price && !isNaN(Number(filters.price))) params.append("price", filters.price);
//       if (filters.startDate) params.append("startDate", filters.startDate);
//       if (filters.duration) params.append("duration", filters.duration);

//       const url = `https://ub1b171tga.execute-api.eu-north-1.amazonaws.com/dev/course/course-ads?${params.toString()}`;
//       const res = await fetch(url);

//       if (!res.ok) throw new Error("Failed to fetch courses");

//       const data: CourseResponse = await res.json();
//       setCourses(data?.data);
//       setTotalPages(data?.meta?.totalPages || 1);
//     } catch (err) {
//       setError("Unknown error");
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleApply = async (courseId: number , postedBy: number) => {
//     const storedData = localStorage.getItem('loginData');
//     const data = storedData ? JSON.parse(storedData) : null;
//     const currentId = data?.id || data?.user?.id;
//     if (!currentId) return alert("User not logged in");

//     setApplyingId(courseId);

//     try {
//       const response = await fetch("https://ub1b171tga.execute-api.eu-north-1.amazonaws.com/dev/course-applications", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json"
//         },
//         body: JSON.stringify({
//           userId: Number(currentId),
//           postedBy: postedBy,
//           courseAdId: courseId,
//           status: "pending"
//         })
//       });

//       if (!response.ok) throw new Error("Failed to apply");
//       alert("Application submitted successfully!");
//     } catch (err) {
//       console.error(err);
//       alert("Something went wrong while applying.");
//     } finally {
//       setApplyingId(null);
//     }
//   };

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFilters(prev => ({ ...prev, [name]: value }));
//     if (name in touched) {
//       setTouched(prev => ({ ...prev, [name]: true }));
//     }
//   };

//   const isPriceInvalid = touched.price && (filters.price !== "" && isNaN(Number(filters.price)));
//   const isStartDateInvalid = touched.startDate && (filters.startDate !== "" && isNaN(Date.parse(filters.startDate)));

//   return (
//     <div className="min-h-screen bg-white mt-30 text-black px-4 pt-36 pb-10 flex flex-col items-center">
//       <button
//         className="absolute top-6 left-4 flex mt-20 items-center gap-2 text-black border border-black rounded px-3 py-1 hover:bg-black hover:text-white transition"
//         onClick={() => window.history.back()}
//       >
//         <ArrowLeft size={18} /> Back
//       </button>

//       <h1 className="text-3xl font-bold mb-8 text-center">Available Courses</h1>

//       {/* Filters */}
//       <div className="w-full max-w-4xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-10">
//         <input
//           type="text"
//           name="title"
//           placeholder="Course Title"
//           value={filters.title}
//           onChange={handleChange}
//           className="border border-gray-300 px-3 py-2 rounded"
//         />
//         <input
//           type="text"
//           name="location"
//           placeholder="Location"
//           value={filters.location}
//           onChange={handleChange}
//           className="border border-gray-300 px-3 py-2 rounded"
//         />
//         <div>
//           <input
//             type="text"
//             name="price"
//             placeholder="Max Price"
//             value={filters.price}
//             onChange={handleChange}
//             onBlur={() => setTouched(prev => ({ ...prev, price: true }))}
//             className={`border px-3 py-2 rounded w-full ${isPriceInvalid ? 'border-red-500' : 'border-gray-300'}`}
//           />
//           {isPriceInvalid && <p className="text-sm text-red-600 mt-1">Enter a valid number</p>}
//         </div>
//         <div>
//           <input
//             type="date"
//             name="startDate"
//             placeholder="Start Date"
//             value={filters.startDate}
//             onChange={handleChange}
//             onBlur={() => setTouched(prev => ({ ...prev, startDate: true }))}
//             className={`border px-3 py-2 rounded w-full ${isStartDateInvalid ? 'border-red-500' : 'border-gray-300'}`}
//           />
//           {isStartDateInvalid && <p className="text-sm text-red-600 mt-1">Enter a valid date</p>}
//         </div>
//         <input
//           type="text"
//           name="duration"
//           placeholder="Duration (e.g., 2 days)"
//           value={filters.duration}
//           onChange={handleChange}
//           className="border border-gray-300 px-3 py-2 rounded"
//         />
//       </div>

//       {/* Course Cards */}
//       {loading ? (
//         <p>Loading...</p>
//       ) : error ? (
//         <p className="text-red-600">{error}</p>
//       ) : (
//         <div className="w-full max-w-4xl flex flex-col gap-8">
//           {courses.map((course) => (
//             <div
//               key={course.id}
//               className="border border-black rounded-2xl p-6 shadow-md bg-white hover:shadow-xl transition duration-300 flex flex-col md:flex-row md:items-start md:justify-between gap-6"
//             >
//               <div className="flex-1">
//                 <h2 className="text-2xl font-semibold mb-2 text-black">{course.title}</h2>
//                 <p className="text-sm text-gray-700 mb-4 max-h-32 overflow-hidden">
//                   {course.description.length > 300
//                     ? course.description.slice(0, 300) + "..."
//                     : course.description}
//                 </p>
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm text-gray-800">
//                   <p className="flex items-center gap-2"><GraduationCap size={16} /> <span className="font-medium">Type:</span> {course.courseType}</p>
//                   <p className="flex items-center gap-2"><Layers size={16} /> <span className="font-medium">Level:</span> {course.courseLevel}</p>
//                   <p className="flex items-center gap-2"><Clock size={16} /> <span className="font-medium">Duration:</span> {course.duration}</p>
//                   <p className="flex items-center gap-2"><CalendarDays size={16} /> <span className="font-medium">Start:</span> {new Date(course.startDate).toLocaleDateString()}</p>
//                   <p className="flex items-center gap-2"><CalendarDays size={16} /> <span className="font-medium">End:</span> {new Date(course.endDate).toLocaleDateString()}</p>
//                   <p className="flex items-center gap-2"><MapPin size={16} /> <span className="font-medium">Location:</span> {course.location}</p>
//                 </div>
//               </div>
//               <div className="flex flex-col justify-between items-end min-w-[120px]">
//                 <p className="text-lg font-semibold text-black mt-2 md:mt-0 flex items-center gap-1">
//                   <PoundSterling size={18} /> £{course.price}
//                 </p>
//             {course.createdBy.id===1 ? <Link href={course.bookingLink} className="mt-4 inline-block w-full text-center px-4 py-2 border border-black text-black rounded-lg hover:bg-black hover:text-white transition whitespace-nowrap flex items-center justify-center gap-2">Follow Link</Link> :    <button
//                   onClick={() => handleApply(course.id , course.createdBy.id)}
//                   disabled={applyingId === course.id}
//                   className="mt-4 inline-block w-full text-center px-4 py-2 border border-black text-black rounded-lg hover:bg-black hover:text-white transition whitespace-nowrap flex items-center justify-center gap-2"
//                 >
//                   {applyingId === course.id ? <Loader2 className="animate-spin" size={18} /> : null}
//                   {applyingId === course.id ? "Applying..." : "Apply"}
//                 </button>}
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* Pagination */}
//       <div className="mt-12 flex flex-wrap justify-center gap-4">
//         <button
//           onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
//           disabled={currentPage === 1}
//           className="px-4 py-2 border border-black rounded text-black hover:bg-black hover:text-white disabled:opacity-50"
//         >
//           Previous
//         </button>
//         <span className="px-4 py-2">Page {currentPage} of {totalPages}</span>
//         <button
//           onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
//           disabled={currentPage === totalPages}
//           className="px-4 py-2 border border-black rounded text-black hover:bg-black hover:text-white disabled:opacity-50"
//         >
//           Next
//         </button>
//       </div>
//     </div>
//   );
// };

// export default CourseListPage;
