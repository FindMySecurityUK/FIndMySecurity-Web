"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
  FaSearch,
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaCalendarAlt,
  FaBriefcase,
  FaTag,
} from "react-icons/fa";
import { API_URL } from "@/utils/path";

import toast from "react-hot-toast";
import AnimateOnScrollProvider from "@/sections/components/animation/AnimateOnScrollProvider";
import { ArrowLeft } from "lucide-react";

import { Fragment } from 'react';
import { Dialog } from '@headlessui/react';

const DEFAULT_KEYWORD = "Security Guard";
const DEFAULT_LOCATION = "London";
const DEFAULT_RATE = 30000;

const PostAdLister: React.FC = () => {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [isApplying, setIsApplying] = useState(false);

  const [applyingJobs, setApplyingJobs] = useState<{[key: number]: boolean}>({});

  const handleApplyClick = async (job: any) => {
    if ((job.source === 'local' || job.source === 'Find My Security')&& (job.link===''||job.link===null)) {
      setApplyingJobs(prev => ({ ...prev, [job.id]: true }));
      try {
        await applyForJob(job.id);
      } finally {
        setApplyingJobs(prev => ({ ...prev, [job.id]: false }));
      }
    } else {
      window.open(job.url? job.url:job.link, '_blank', 'noopener,noreferrer');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const [localJobs, setLocalJobs] = useState<any[]>([]);
  const [adzunaJobs, setAdzunaJobs] = useState<any[]>([]);
  const [monsterJobs, setMonsterJobs] = useState<any[]>([]);
  const [securityJobs, setSecurityJobs] = useState<any[]>([]);
  const [reedJobs, setReedJobs] = useState<any[]>([]);


  const [keyword, setKeyword] = useState(DEFAULT_KEYWORD);
  const [location, setLocation] = useState(DEFAULT_LOCATION);
  const [rateFilter, setRateFilter] = useState<number | null>(DEFAULT_RATE);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const isClient = typeof window !== "undefined";


  const sourceLogos: Record<string, string> = {
    adzuna: "/pro-icons/adzuna.png",
    reed: "/pro-icons/reed.png",
    monster: "/pro-icons/Monster.png",
    local: "/pro-icons/local.png",
    "Find My Security": "/pro-icons/findmysecurity.png",
  };
  
  const fetchLocalJobs = (kw: string, loc: string, rate: number | null) => {
    if (!isClient) return [];
    const storedData = localStorage.getItem("jobs");
    if (!storedData) return [];
    const parsed = JSON.parse(storedData);

    return parsed.filter((post: any) => {
      const matchTitle = kw ? post.title?.toLowerCase().includes(kw.toLowerCase()) : true;
      const matchLocation = loc ? post.location?.toLowerCase().includes(loc.toLowerCase()) : true;
      const matchRate = rate !== null ? parseFloat(post.payRate) <= rate : true;
      return matchTitle && matchLocation && matchRate;
    });
  };

  const fetchSecurityJobs = async (): Promise<{ jobs: any[]; userId: any; token: string | undefined }> => {
    if (!isClient) return { jobs: [], userId: null, token: undefined };

    const token = localStorage.getItem("authToken")?.replace(/^"|"$/g, '');
    const storedData = localStorage.getItem('loginData');
    const data = storedData ? JSON.parse(storedData) : null;
    const currentId = data?.id || data?.user?.id;

    try {
      const res = await axios.get(`${API_URL}/security-jobs?keyword=${keyword}&location=${location}&minSalary=${rateFilter? rateFilter : 0}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return { jobs: res.data.jobs, userId: currentId, token };
    } catch (err) {
      console.error("Security Jobs API Error:", err);
      return { jobs: [], userId: null, token };
    }
  };

  const applyForJob = async (serviceAdId: number) => {
    if (!isClient) return;
    const token = localStorage.getItem("authToken")?.replace(/^"|"$/g, '');
    const storedData = localStorage.getItem('loginData');
    const data = storedData ? JSON.parse(storedData) : null;
    const currentId = data?.id || data?.user?.id;

    try {
      const response = await axios.post(
        `${API_URL}/job-applications`,
        {
          userId: currentId as number,
          serviceAdId,
          status: "pending"
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );
    
      if (response.status === 200 || response.status === 201) {
        toast.success("Applied successfully!");
      } else {
        toast.error(response.data?.message || "Error during apply");
      }
    
      return response.data;
    
    } catch (error: any) {
      if (error.response && error.response.status === 400) {
        toast.error(error.response.data?.message || "Bad request.");
      } else {
        toast.error(error.message || "Job application failed. Please try again.");
      }
    }
  }    

  const handleSearch = async () => {
    if (!isClient) return;

    setSearched(true);
    setLoading(true);
    try {
      const [ securityRes, adzunaRes, monsterRes,reedRes] = await Promise.all([
         fetchSecurityJobs(),
        fetch(`/api/reed-job?keyword=${keyword}&location=${location}&minSalary=${rateFilter? rateFilter : 0}`),
        fetch(`/api/monster-job?keyword=${keyword}&location=${location}&minSalary=${rateFilter? rateFilter : 0}`),
        fetch(`/api/reed?keyword=${keyword}&location=${location}&minSalary=${rateFilter? rateFilter : 0}`),
       
      ]);

      const [adzunaData, monsterData, reedData] = await Promise.all([
        adzunaRes.json(),
        monsterRes.json(),
        reedRes.json(),
      ]);

      setAdzunaJobs(adzunaRes.ok ? adzunaData : []);
      setMonsterJobs(monsterRes.ok ? monsterData : []);
      setReedJobs(reedRes.ok ? reedData?.results || [] : []);
      setSecurityJobs(securityRes.jobs || []);

      const filteredLocal = fetchLocalJobs(keyword, location, rateFilter);
      setLocalJobs(filteredLocal);
      setCurrentPage(1);
    } catch (err) {
      console.error("Fetch failed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isClient) {
      handleSearch();
    }
  }, []);

  const mergedJobs = [
    ...securityJobs.map((j) => ({ ...j, source: "Find My Security" })),
   
    ...adzunaJobs.map((j) => ({ ...j, source: "adzuna" })),
    ...monsterJobs.map((j) => ({ ...j, source: "monster" })),
    ...reedJobs.map((j) => ({ ...j, source: "reed" })),
  ];
  

  const totalPages = Math.ceil(mergedJobs.length / pageSize);
  const paginatedJobs = mergedJobs.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div style={{ marginTop: "90px" }} className="min-h-screen bg-gray-100 p-6 md:px-32">
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #666;
        }
      `}</style>
      <h1 className="text-4xl font-bold text-center text-gray-900 mb-8">
        Posted <span className="text-black">Job Ads</span>
      </h1>
      <button
        className="absolute top-4 left-4 mt-20 z-2 flex items-center text-gray-600 hover:text-black"
        onClick={() => router.back()}
      >
        <ArrowLeft className="w-6 h-6 mr-2" />
      </button>
      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white p-4 rounded-lg shadow mb-6">
        <div>
          <label className="text-sm font-semibold">Keyword</label>
          <div className="flex items-center space-x-2">
            <FaSearch className="text-gray-500" />
            <input
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="e.g. Security"
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>
        <div>
          <label className="text-sm font-semibold">Location</label>
          <div className="flex items-center space-x-2">
            <FaMapMarkerAlt className="text-gray-500" />
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. London"
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>
        <div>
          <label className="text-sm font-semibold">Min Pay Rate</label>
          <div className="flex items-center space-x-2">
            <FaMoneyBillWave className="text-gray-500" />
            <input
              type="number"
              value={rateFilter ?? ""}
              onChange={(e) => setRateFilter(e.target.value ? parseFloat(e.target.value) : null)}
              placeholder="e.g. 30000"
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>
        <div className="md:col-span-3 flex justify-end">
          <button
            onClick={handleSearch}
            className="px-6 py-2 bg-black text-white rounded hover:bg-gray-800"
          >
            Search Jobs
          </button>
        </div>
      </div>

      {/* Job Listings */}
      {loading ? (
        <p className="text-center text-gray-600">Loading jobs...</p>
      ) : mergedJobs.length === 0 ? (
        <p className="text-center text-gray-600">No jobs found for the current filters.</p>
      ) : (
        <>
        <AnimateOnScrollProvider>
          {paginatedJobs.map((post, idx) => (
            <div key={idx} className="bg-white rounded-lg shadow-md p-6 mb-6 hover:shadow-lg transition duration-300"  data-aos="fade-up">
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {post.title || post.jobTitle}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1 text-sm text-gray-700">
                    <p className="col-span-1"><strong>Location:</strong> {post.location || post.jobLocation || post.region}</p>
                    <p className="col-span-1"><strong>Pay:</strong> ${post.payRate || post.salaryRate || post.JobSalary}</p>
                    <p className="col-span-1 md:col-span-2 mt-2"><strong>Description:</strong> {post.description || post.jobDescription}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                  {(post.source === 'local' || post.source === 'Find My Security') && (post.link===''||post.link===null) ? (
                    <div className="flex flex-col items-end gap-2">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            setSelectedJob(post);
                            setIsModalOpen(true);
                          }}
                          className="text-sm px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                        >
                          View Job
                        </button>
                        <button
                          onClick={() => handleApplyClick(post)}
                          disabled={applyingJobs[post.id]}
                          className={`text-sm px-4 py-2 bg-black text-white rounded hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[80px] ${applyingJobs[post.id] ? 'gap-2' : ''}`}
                        >
                          {applyingJobs[post.id] ? (
                            <>
                              <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Applying...
                            </>
                          ) : 'Apply'}
                        </button>
                      </div>
                      <img 
                        src={sourceLogos[post.source]} 
                        alt={`${post.source} logo`} 
                        className="h-6 object-contain mt-2" 
                      />
                    </div>
                  ) : (
                    <div className="flex flex-col items-end gap-2">
                      <button
                        onClick={() => handleApplyClick(post)}
                        className="text-sm px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                      >
                        Visit
                      </button>
                      <img 
                        src={sourceLogos[post.source]} 
                        alt={`${post.source} logo`} 
                        className="h-6 object-contain mt-2" 
                      />
                    </div>
                  )}

                {/* Job Details Modal */}
                <Dialog
                  open={isModalOpen}
                  onClose={() => setIsModalOpen(false)}
                  className="fixed inset-0 z-50 overflow-y-auto"
                >
                  <div className="flex items-center justify-center min-h-screen p-4">
                    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity" />
                    <div className="relative bg-white rounded-xl max-w-3xl w-full p-8 shadow-2xl transform transition-all">
                      {selectedJob && (
                        <>
                          <Dialog.Title className="text-3xl font-bold mb-6 text-gray-900 border-b pb-4">
                            {selectedJob.jobTitle}
                          </Dialog.Title>
                          <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-4 custom-scrollbar">
                            <div className="grid grid-cols-2 gap-6">
                              <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="font-semibold text-gray-700 mb-2">Job Type</p>
                                <p className="text-gray-900">{selectedJob.jobType}</p>
                              </div>
                              <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="font-semibold text-gray-700 mb-2">Industry</p>
                                <p className="text-gray-900">{selectedJob.industryCategory}</p>
                              </div>
                              <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="font-semibold text-gray-700 mb-2">Location</p>
                                <p className="text-gray-900">{selectedJob.region} - {selectedJob.postcode}</p>
                              </div>
                              <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="font-semibold text-gray-700 mb-2">Salary</p>
                                <p className="text-gray-900">£{selectedJob.salaryRate} {selectedJob.salaryType}</p>
                              </div>
                              <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="font-semibold text-gray-700 mb-2">Experience Required</p>
                                <p className="text-gray-900">{selectedJob.requiredExperience} years</p>
                              </div>
                              <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="font-semibold text-gray-700 mb-2">Required Licenses</p>
                                <p className="text-gray-900">{selectedJob.requiredLicences}</p>
                              </div>
                              <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="font-semibold text-gray-700 mb-2">Shift & Hours</p>
                                <p className="text-gray-900">{selectedJob.shiftAndHours}</p>
                              </div>
                              <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="font-semibold text-gray-700 mb-2">Start Date</p>
                                <p className="text-gray-900">{formatDate(selectedJob.startDate)}</p>
                              </div>
                              <div className="bg-gray-50 p-4 rounded-lg col-span-2">
                                <p className="font-semibold text-gray-700 mb-2">Application Deadline</p>
                                <p className="text-gray-900">{formatDate(selectedJob.deadline)}</p>
                              </div>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg mt-6">
                              <p className="font-semibold text-gray-700 mb-3">Job Description</p>
                              <p className="text-gray-900 whitespace-pre-wrap leading-relaxed">{selectedJob.jobDescription}</p>
                            </div>
                          </div>
                          <div className="mt-8 flex justify-end space-x-4 border-t pt-4">
                            <button
                              onClick={() => setIsModalOpen(false)}
                              className="text-sm px-6 py-2.5 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200"
                            >
                              Close
                            </button>
                            <button
                              onClick={() => handleApplyClick(selectedJob)}
                              disabled={applyingJobs[selectedJob.id]}
                              className={`text-sm px-6 py-2.5 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[100px] ${applyingJobs[selectedJob.id] ? 'gap-2' : ''}`}
                            >
                              {applyingJobs[selectedJob.id] ? (
                                <>
                                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                  </svg>
                                  Applying...
                                </>
                              ) : 'Apply Now'}
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </Dialog>
                {/* <span className="flex items-center bg-gray-200 text-xs px-2 py-1 rounded-full text-gray-700">
                  <FaTag className="mr-1" />
                  {post.source}
                </span> */}
                </div>
              </div>
            </div>
          ))}
</AnimateOnScrollProvider>
          {/* Pagination */}
          <div className="flex justify-center items-center gap-4 mt-6">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded ${currentPage === 1
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-black text-white hover:bg-gray-800"
                }`}
            >
              Previous
            </button>
            <span className="text-sm text-gray-700">Page {currentPage} of {totalPages}</span>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded ${currentPage === totalPages
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-black text-white hover:bg-gray-800"
                }`}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default PostAdLister;
