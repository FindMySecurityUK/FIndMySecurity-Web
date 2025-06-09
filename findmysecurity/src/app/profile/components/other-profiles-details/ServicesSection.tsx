"use client";
import React, { useState, useEffect } from "react";
import Section from "./Section";
import toast from "react-hot-toast";
import axios from "axios";
import Select from "react-select";
import { API_URL } from "@/utils/path";
import companiesList from "@/sections/data/secuirty_services.json";
import trainersList from "@/sections/data/training_providers.json";
import businessesList from "@/sections/data/secuirty_professional.json";

interface RoleOption {
  label: string;
  value: string;
  group: string;
  isComingSoon: boolean;
}

interface RoleSelection {
  title: string;
  role: string;
}

type ProfileType = any;

interface Props {
  profile: ProfileType | null;
  roleId: number;
  userId: number;
}

const ServicesSection = ({ profile, userId, roleId }: Props) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    selectedRoles: [] as RoleSelection[],
    otherService: "",
  });
  const [updatedData, setUpdatedData] = useState({ ...formData });

  // Determine which list to use based on roleId
  const getRoleList = () => {
    switch (roleId) {
      case 5: // Security Company
        return companiesList;
      case 6: // Course Provider
        return trainersList;
      case 7: // Corporate Client
        return businessesList;
      default:
        return [];
    }
  };

  // Transform backend data to match expected format
  const transformBackendData = (profileData: any) => {
    const services = profileData?.securityServicesOfferings || profileData?.serviceRequirements || [];
    const selectedRoles = services.map((service: string) => {
      const category = getRoleList().find((cat: any) => cat.roles.includes(service));
      return {
        title: category?.title.replace(" (Coming Soon)", "") || "Unknown Category",
        role: service,
      };
    });
    return {
      selectedRoles,
      otherService: profileData?.otherService || "",
    };
  };

  // Fetch data from backend on mount
  useEffect(() => {
    const fetchServices = async () => {
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
            toast.error("Unknown role type.");
            return;
        }

        const response = await axios.get(endpoint, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const profileData = response.data?.profile || response.data || {};
        const transformedData = transformBackendData(profileData);
        setFormData(transformedData);
        setUpdatedData(transformedData);
      } catch (error: any) {
        toast.error("Failed to fetch services.");
      } finally {
        setIsLoading(false);
      }
    };

    // Initialize with profile prop if available
    if (profile?.securityServicesOfferings || profile?.serviceRequirements || profile?.otherService) {
      const transformedData = transformBackendData(profile);
      setFormData(transformedData);
      setUpdatedData(transformedData);
      setIsLoading(false);
    } else {
      fetchServices();
    }
  }, [profile, userId, roleId]);

  // Create role options from the appropriate list
  const roleOptions: RoleOption[] = getRoleList().flatMap((category: any) =>
    category.roles.map((role: string) => ({
      label: role,
      value: role,
      group: category.title.replace(" (Coming Soon)", ""),
      isComingSoon: category.title.includes("Coming Soon"),
    }))
  );

  const groupedOptions = roleOptions.reduce((acc, option) => {
    if (!acc[option.group]) acc[option.group] = [];
    acc[option.group].push(option);
    return acc;
  }, {} as Record<string, RoleOption[]>);

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleRoleSelection = (selectedOptions: any) => {
    const selectedItems = selectedOptions.map((option: any) => ({
      title: option.group,
      role: option.value,
    }));
    handleInputChange("selectedRoles", selectedItems);
  };

  const handleOtherServiceChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    handleInputChange("otherService", e.target.value);
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("authToken")?.replace(/^"|"$/g, "");
      if (!token) {
        toast.error("Authorization token not found.");
        return;
      }

      const selectedServices = formData.selectedRoles.map((item) => item.role);
      const payloadData: any = {
        otherService: formData.otherService,
      };

      if (roleId === 5 || roleId === 6) {
        payloadData.securityServicesOfferings = selectedServices;
      }

      if (roleId === 6 || roleId === 7) {
        payloadData.serviceRequirements = selectedServices;
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
          toast.error("Unknown role type.");
          return;
      }
      let payload = {}
      if(roleId===7){
        payload = {
          ...profile,
          ...payloadData,
        };
      }
      else if(roleId===6 || roleId===5){
        payload = {
          ...payloadData,
        };
      }

      await axios.put(endpoint, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      setUpdatedData({ ...formData });
      toast.success("Services updated successfully");
      setIsEditing(false);
    } catch (error: any) {
      const message = error.response?.data?.message || "Failed to update services.";
      toast.error(message);
    }
  };

  const handleCancel = () => {
    setFormData({ ...updatedData });
    setIsEditing(false);
  };

  if (isLoading) {
    return <Section title="Services"><p>Loading services...</p></Section>;
  }

  if (!profile && !updatedData.selectedRoles.length && !updatedData.otherService) {
    return <Section title="Services"><p>No services available.</p></Section>;
  }

  return (
    <Section
      title={
        <div className="flex items-center justify-between w-full">
          <h2 className="text-lg font-semibold">Services</h2>
        </div>
      }
    >
      {isEditing ? (
        <>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {roleId === 5 ? "Security Services" : 
               roleId === 6 ? "Training Services" : 
               "Business Services"}*{" "}
              <span className="ml-1 text-xs text-gray-500">(Select multiple if applicable)</span>
            </label>
            <Select
              isMulti
              options={Object.entries(groupedOptions).map(([label, options]) => ({
                label,
                options,
              }))}
              value={roleOptions.filter((option) =>
                formData.selectedRoles.some((item) => item.role === option.value)
              )}
              onChange={handleRoleSelection}
              className="react-select-container"
              classNamePrefix="react-select"
              styles={{
                control: (provided, state) => ({
                  ...provided,
                  minHeight: "44px",
                  borderRadius: "8px",
                  borderColor: state.isFocused ? "#6366f1" : "#d1d5db",
                  boxShadow: state.isFocused ? "0 0 0 1px #6366f1" : "none",
                  padding: "2px 4px",
                }),
                option: (provided, state) => ({
                  ...provided,
                  fontSize: "14px",
                  padding: "8px 12px",
                  color: state.data.isComingSoon ? "#6b7280" : "#111827",
                  backgroundColor: state.isSelected
                    ? "#e0e7ff"
                    : state.isFocused
                    ? "#f3f4f6"
                    : "white",
                }),
                multiValue: (provided, state) => ({
                  ...provided,
                  backgroundColor: state.data.isComingSoon ? "#f3f4f6" : "#e0e7ff",
                  borderRadius: "6px",
                  border: state.data.isComingSoon ? "1px dashed #d1d5db" : "none",
                }),
                multiValueLabel: (provided, state) => ({
                  ...provided,
                  color: state.data.isComingSoon ? "#6b7280" : "#4338ca",
                  fontWeight: "500",
                  padding: "4px 6px",
                }),
                multiValueRemove: (provided, state) => ({
                  ...provided,
                  color: state.data.isComingSoon ? "#9ca3af" : "#818cf8",
                  ":hover": {
                    backgroundColor: state.data.isComingSoon ? "#e5e7eb" : "#c7d2fe",
                    color: state.data.isComingSoon ? "#6b7280" : "#6366f1",
                  },
                }),
                groupHeading: (provided) => ({
                  ...provided,
                  fontSize: "13px",
                  fontWeight: "600",
                  color: "#374151",
                  backgroundColor: "#f9fafb",
                  padding: "8px 12px",
                  borderBottom: "1px solid #e5e7eb",
                  marginBottom: "4px",
                }),
                menu: (provided) => ({
                  ...provided,
                  borderRadius: "8px",
                  border: "1px solid #e5e7eb",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                }),
              }}
              formatGroupLabel={(group) => (
                <div className="flex items-center justify-between">
                  <span>{group.label.replace(" (Coming Soon)", "")}</span>
                  {group.label.includes("Coming Soon") && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      Coming Soon
                    </span>
                  )}
                </div>
              )}
              formatOptionLabel={(option) => (
                <div className="flex items-center">
                  {option.isComingSoon && (
                    <span className="mr-2 text-gray-400">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </span>
                  )}
                  <span className={option.isComingSoon ? "text-gray-500" : "text-gray-900"}>
                    {option.label}
                  </span>
                </div>
              )}
              closeMenuOnSelect={false}
              hideSelectedOptions={false}
              placeholder={
                <div className="flex items-center text-gray-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  {roleId === 5
                    ? "Select security services..."
                    : roleId === 6
                    ? "Select training services..."
                    : "Select business services..."}
                </div>
              }
              noOptionsMessage={() => "No services found"}
              components={{
                IndicatorSeparator: () => null,
                DropdownIndicator: () => (
                  <div className="pr-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                ),
              }}
            />
            {formData.selectedRoles.length > 0 && (
              <p className="mt-2 text-xs text-gray-500">
                Selected: {formData.selectedRoles.length} service(s)
              </p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Other Services</label>
            <textarea
              name="otherService"
              value={formData.otherService}
              onChange={handleOtherServiceChange}
              className="w-full border px-3 py-2 rounded text-gray-700"
              rows={4}
              placeholder="Describe other services you offer"
            />
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
          {updatedData.selectedRoles?.length > 0 ? (
            <div className="mb-4">
              <h4 className="font-medium text-gray-800 mb-2">Specializations</h4>
              <div className="flex flex-wrap gap-2">
                {updatedData.selectedRoles.map((item, index) => (
                  <span
                    key={index}
                    className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full"
                  >
                    {item.role}
                  </span>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-gray-500">No services selected.</p>
          )}
          {updatedData.otherService && (
            <div>
              <h4 className="font-medium text-gray-800">Other Services</h4>
              <p className="text-gray-700 whitespace-pre-wrap">{updatedData.otherService}</p>
            </div>
          )}
          <button
            onClick={() => setIsEditing(true)}
            className="text-sm px-5 py-2 mt-5 bg-black text-white rounded hover:bg-gray-800 transition"
          >
            Edit
          </button>
        </>
      )}
    </Section>
  );
};

export default ServicesSection;







// "use client";
// import React, { useState, useEffect } from "react";
// import Section from "./Section";
// import toast from "react-hot-toast";
// import axios from "axios";
// import Select from "react-select";
// import { API_URL } from "@/utils/path";
// import companiesList from "@/sections/data/secuirty_services.json";
// import trainersList from "@/sections/data/training_providers.json";
// import businessesList from "@/sections/data/secuirty_professional.json";

// interface RoleOption {
//   label: string;
//   value: string;
//   group: string;
//   isComingSoon: boolean;
// }

// interface RoleSelection {
//   title: string;
//   role: string;
// }

// type ProfileType = any;

// interface Props {
//   profile: ProfileType | null;
//   roleId: number;
//   userId: number;
// }

// const ServicesSection = ({ profile, userId, roleId }: Props) => {
//   const [isEditing, setIsEditing] = useState(false);
//   const [formData, setFormData] = useState({
//     selectedRoles: [] as RoleSelection[],
//     otherService: "",
//   });
//   const [updatedData, setUpdatedData] = useState({ ...formData });

//   // Determine which list to use based on roleId
//   const getRoleList = () => {
//     switch (roleId) {
//       case 5: // Security Company
//         return companiesList;
//       case 6: // Course Provider
//         return trainersList;
//       case 7: // Corporate Client
//         return businessesList;
//       default:
//         return [];
//     }
//   };

//   // Create role options from the appropriate list
//   const roleOptions: RoleOption[] = getRoleList().flatMap((category: any) =>
//     category.roles.map((role: string) => ({
//       label: role,
//       value: role,
//       group: category.title.replace(" (Coming Soon)", ""),
//       isComingSoon: category.title.includes("Coming Soon"),
//     }))
//   );

//   const groupedOptions = roleOptions.reduce((acc, option) => {
//     if (!acc[option.group]) acc[option.group] = [];
//     acc[option.group].push(option);
//     return acc;
//   }, {} as Record<string, RoleOption[]>);

//   useEffect(() => {
//     if (profile) {
//       // Initialize form data from profile
//       const selectedServices = profile.serviceRequirements || profile.securityServicesOfferings || [];
//       const selectedRoles = selectedServices.map((service: string) => ({
//         title: service, // This might need adjustment based on your data structure
//         role: service,
//       }));

//       setFormData({
//         selectedRoles,
//         otherService: profile.otherService || "",
//       });
//       setUpdatedData({
//         selectedRoles,
//         otherService: profile.otherService || "",
//       });
//     }
//   }, [profile]);

//   const handleInputChange = (field: string, value: any) => {
//     setFormData((prev) => ({ ...prev, [field]: value }));
//   };

//   const handleRoleSelection = (selectedOptions: any) => {
//     const selectedItems = selectedOptions.map((option: any) => ({
//       title: option.group,
//       role: option.value,
//     }));
//     handleInputChange("selectedRoles", selectedItems);
//   };

//   const handleOtherServiceChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
//     handleInputChange("otherService", e.target.value);
//   };

//   const handleSave = async () => {
//     try {
//       const token = localStorage.getItem("authToken")?.replace(/^"|"$/g, "");
//       if (!token) {
//         toast.error("Authorization token not found.");
//         return;
//       }

//       const selectedServices = formData.selectedRoles.map((item) => item.role);

//       const payloadData: any = {
//         otherService: formData.otherService,
//       };

//       if (roleId === 5 || roleId === 6) { // Security Company or Course Provider
//         payloadData.securityServicesOfferings = selectedServices;
//       }

//       if (roleId === 6 || roleId === 7) { // Course Provider or Corporate Client
//         payloadData.serviceRequirements = selectedServices;
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
//           toast.error("Unknown role type.");
//           return;
//       }

//       const payload = { ...profile, ...payloadData };

//       await axios.put(endpoint, payload, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       });

//       setUpdatedData({ ...formData });
//       toast.success("Services updated successfully");
//       setIsEditing(false);
//     } catch (error: any) {
//       const message = error.response?.data?.message || "Failed to update services.";
//       toast.error(message);
//     }
//   };

//   const handleCancel = () => {
//     setFormData({ ...updatedData });
//     setIsEditing(false);
//   };

//   if (!profile) return null;

//   return (
//     <Section
//       title={
//         <div className="flex items-center justify-between w-full">
//           <h2 className="text-lg font-semibold">Services</h2>
//         </div>
//       }
//     >
//       {isEditing ? (
//         <>
//           {/* Multi-Select Security Services */}
//           <div className="mb-6">
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               {roleId === 5 ? "Security Services" : 
//                roleId === 6 ? "Training Services" : 
//                "Business Services"}*{" "}
//               <span className="ml-1 text-xs text-gray-500">(Select multiple if applicable)</span>
//             </label>

//             <Select
//               isMulti
//               options={Object.entries(groupedOptions).map(([label, options]) => ({
//                 label,
//                 options,
//               }))}
//               value={roleOptions.filter((option) =>
//                 formData.selectedRoles.some((item) => item.role === option.value)
//               )}
//               onChange={handleRoleSelection}
//               className="react-select-container"
//               classNamePrefix="react-select"
//               styles={{
//                 control: (provided, state) => ({
//                   ...provided,
//                   minHeight: "44px",
//                   borderRadius: "8px",
//                   borderColor: state.isFocused ? "#6366f1" : "#d1d5db",
//                   boxShadow: state.isFocused ? "0 0 0 1px #6366f1" : "none",
//                   padding: "2px 4px",
//                 }),
//                 option: (provided, state) => ({
//                   ...provided,
//                   fontSize: "14px",
//                   padding: "8px 12px",
//                   color: state.data.isComingSoon ? "#6b7280" : "#111827",
//                   backgroundColor: state.isSelected
//                     ? "#e0e7ff"
//                     : state.isFocused
//                     ? "#f3f4f6"
//                     : "white",
//                 }),
//                 multiValue: (provided, state) => ({
//                   ...provided,
//                   backgroundColor: state.data.isComingSoon ? "#f3f4f6" : "#e0e7ff",
//                   borderRadius: "6px",
//                   border: state.data.isComingSoon ? "1px dashed #d1d5db" : "none",
//                 }),
//                 multiValueLabel: (provided, state) => ({
//                   ...provided,
//                   color: state.data.isComingSoon ? "#6b7280" : "#4338ca",
//                   fontWeight: "500",
//                   padding: "4px 6px",
//                 }),
//                 multiValueRemove: (provided, state) => ({
//                   ...provided,
//                   color: state.data.isComingSoon ? "#9ca3af" : "#818cf8",
//                   ":hover": {
//                     backgroundColor: state.data.isComingSoon ? "#e5e7eb" : "#c7d2fe",
//                     color: state.data.isComingSoon ? "#6b7280" : "#6366f1",
//                   },
//                 }),
//                 groupHeading: (provided) => ({
//                   ...provided,
//                   fontSize: "13px",
//                   fontWeight: "600",
//                   color: "#374151",
//                   backgroundColor: "#f9fafb",
//                   padding: "8px 12px",
//                   borderBottom: "1px solid #e5e7eb",
//                   marginBottom: "4px",
//                 }),
//                 menu: (provided) => ({
//                   ...provided,
//                   borderRadius: "8px",
//                   border: "1px solid #e5e7eb",
//                   boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
//                 }),
//               }}
//               formatGroupLabel={(group) => (
//                 <div className="flex items-center justify-between">
//                   <span>{group.label.replace(" (Coming Soon)", "")}</span>
//                   {group.label.includes("Coming Soon") && (
//                     <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
//                       Coming Soon
//                     </span>
//                   )}
//                 </div>
//               )}
//               formatOptionLabel={(option) => (
//                 <div className="flex items-center">
//                   {option.isComingSoon && (
//                     <span className="mr-2 text-gray-400">
//                       <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
//                       </svg>
//                     </span>
//                   )}
//                   <span className={option.isComingSoon ? "text-gray-500" : "text-gray-900"}>
//                     {option.label}
//                   </span>
//                 </div>
//               )}
//               closeMenuOnSelect={false}
//               hideSelectedOptions={false}
//               placeholder={
//                 <div className="flex items-center text-gray-400">
//                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
//                   </svg>
//                   {roleId === 5 ? "Select security services..." : 
//                    roleId === 6 ? "Select training services..." : 
//                    "Select business services..."}
//                 </div>
//               }
//               noOptionsMessage={() => "No services found"}
//               components={{
//                 IndicatorSeparator: () => null,
//                 DropdownIndicator: () => (
//                   <div className="pr-2">
//                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
//                     </svg>
//                   </div>
//                 ),
//               }}
//             />

//             {formData.selectedRoles.length > 0 && (
//               <p className="mt-2 text-xs text-gray-500">
//                 Selected: {formData.selectedRoles.length} service(s)
//               </p>
//             )}
//           </div>

//           <div className="mb-4">
//             <label className="block text-sm font-medium text-gray-700 mb-1">Other Services</label>
//             <textarea
//               name="otherService"
//               value={formData.otherService}
//               onChange={handleOtherServiceChange}
//               className="w-full border px-3 py-2 rounded text-gray-700"
//               rows={4}
//               placeholder="Describe other services you offer"
//             />
//           </div>

//           <div className="flex gap-3 mt-4 justify-end">
//             <button onClick={handleSave} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
//               Save
//             </button>
//             <button onClick={handleCancel} className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400">
//               Cancel
//             </button>
//           </div>
//         </>
//       ) : (
//         <>
//           {updatedData.selectedRoles?.length > 0 && (
//             <div className="mb-4">
//               <h4 className="font-medium text-gray-800 mb-2">Specializations</h4>
//               <div className="flex flex-wrap gap-2">
//                 {updatedData.selectedRoles.map((item, index) => (
//                   <span
//                     key={index}
//                     className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full"
//                   >
//                     {item.role}
//                   </span>
//                 ))}
//               </div>
//             </div>
//           )}
//           {updatedData.otherService && (
//             <div>
//               <h4 className="font-medium text-gray-800">Other Services</h4>
//               <p className="text-gray-700 whitespace-pre-wrap">{updatedData.otherService}</p>
//             </div>
//           )}
//           {!isEditing && (
//             <button
//               onClick={() => setIsEditing(true)}
//               className="text-sm px-5 py-2 mt-5 bg-black text-white rounded hover:bg-gray-800 transition"
//             >
//               Edit
//             </button>
//           )}
//         </>
//       )}
//     </Section>
//   );
// };

// export default ServicesSection;




// import React, { useState, useEffect } from "react";
// import Section from "./Section";
// import toast from "react-hot-toast";
// import axios from "axios";
// import { API_URL } from "@/utils/path";

// type ProfileType = {
//   id: number;
//   userId: number;
//   companyName: string;
//   serviceRequirements?: string[];
//   securityServicesOfferings?: string[];
//   otherService?: string;
// };

// interface Props {
//   profile: ProfileType | null;
//   roleId: number;
//   userId: number;
// }

// const ServicesSection = ({ profile, userId, roleId }: Props) => {
//   const [isEditing, setIsEditing] = useState(false);

//   if (!profile) return null;

//   const isSecurityCompany = roleId === 5;
//   const isCourseProvider = roleId === 6;
//   const isCorporateClient = roleId === 7;

//   const getCombinedServices = () => {
//     const sr = profile.serviceRequirements ?? [];
//     const sso = profile.securityServicesOfferings ?? [];
//     return Array.from(new Set([...sr, ...sso]));
//   };

//   const [formData, setFormData] = useState({
//     selectedServices: getCombinedServices().join(", "),
//     otherService: profile.otherService || "",
//   });

//   const [updatedData, setUpdatedData] = useState({ ...formData });

//   useEffect(() => {
//     const combined = getCombinedServices().join(", ");
//     setFormData({
//       selectedServices: combined,
//       otherService: profile.otherService || "",
//     });
//     setUpdatedData({
//       selectedServices: combined,
//       otherService: profile.otherService || "",
//     });
//   }, [profile]);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSave = async () => {
//     try {
//       const token = localStorage.getItem("authToken")?.replace(/^"|"$/g, "");
//       if (!token) return toast.error("Authorization token not found.");

//       const selectedServicesArr = formData.selectedServices
//         .split(",")
//         .map((s) => s.trim())
//         .filter((s) => s.length > 0);

//       const payloadData: any = {
//         otherService: formData.otherService,
//       };

//       if (isSecurityCompany || isCourseProvider) {
//         payloadData.securityServicesOfferings = selectedServicesArr;
//       }

//       if (isCorporateClient || isCourseProvider) {
//         payloadData.serviceRequirements = selectedServicesArr;
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
//           toast.error("Unknown role type.");
//           return;
//       }

//       const payload = { ...profile, ...payloadData };

//       await axios.put(endpoint, payload, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       });

//       setUpdatedData({ ...formData });
//       toast.success("Services updated successfully");
//       setIsEditing(false);
//     } catch (error: any) {
//       toast.error(error.response?.data?.message || "Failed to update services.");
//     }
//   };

//   const handleCancel = () => {
//     setFormData({ ...updatedData });
//     setIsEditing(false);
//   };

//   return (
//     <Section
//       title={
//         <div className="flex items-center justify-between w-full">
//           <h2 className="text-lg font-semibold">Services</h2>
//         </div>
//       }
//     >
//       {isEditing ? (
//         <>
//           <div className="space-y-3">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Services / Specializations (comma-separated)
//               </label>
//               <input
//                 type="text"
//                 name="selectedServices"
//                 value={formData.selectedServices}
//                 onChange={handleChange}
//                 className="w-full border px-3 py-2 rounded text-gray-700"
//                 placeholder="e.g., Security Officer, CCTV Services"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Other Services
//               </label>
//               <textarea
//                 name="otherService"
//                 value={formData.otherService}
//                 onChange={handleChange}
//                 className="w-full border px-3 py-2 rounded text-gray-700"
//                 rows={4}
//                 placeholder="Describe other services you offer"
//               />
//             </div>
//           </div>
//           <div className="flex gap-3 mt-4 justify-end">
//             <button
//               onClick={handleSave}
//               className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
//             >
//               Save
//             </button>
//             <button
//               onClick={handleCancel}
//               className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
//             >
//               Cancel
//             </button>
//           </div>
//         </>
//       ) : (
//         <>
//           {formData.selectedServices && (
//             <div className="mb-4">
//               <h4 className="font-medium text-gray-800 mb-2">Services / Specializations</h4>
//               <div className="flex flex-wrap gap-2">
//                 {formData.selectedServices
//                   .split(",")
//                   .map((s) => s.trim())
//                   .filter((s) => s.length > 0)
//                   .map((service, index) => (
//                     <span
//                       key={index}
//                       className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full"
//                     >
//                       {service}
//                     </span>
//                   ))}
//               </div>
//             </div>
//           )}
//           {formData.otherService && (
//             <div>
//               <h4 className="font-medium text-gray-800">Other Services</h4>
//               <p className="text-gray-700 whitespace-pre-wrap">{formData.otherService}</p>
//             </div>
//           )}
//           {!isEditing && (
//             <button
//               onClick={() => setIsEditing(true)}
//               className="text-sm px-5 py-2 mt-5 bg-black text-white rounded hover:bg-gray-800 transition"
//             >
//               Edit
//             </button>
//           )}
//         </>
//       )}
//     </Section>
//   );
// };

// export default ServicesSection;






// import React, { useState, useEffect } from "react";
// import Section from "./Section";
// import toast from "react-hot-toast";
// import axios from "axios";
// import { API_URL } from "@/utils/path";

// type ProfileType = {
//   id: number;
//   userId: number;
//   companyName: string;
//   serviceRequirements?: string[];           // for corporateClient + others
//   securityServicesOfferings?: string[];     // for securityCompany + courseProvider
//   otherService?: string;                     // add this field if you want
// };

// interface Props {
//   profile: ProfileType | null;
//   id: number;
// }

// const ServicesSection = ({ profile, id }: Props) => {
//   const [isEditing, setIsEditing] = useState(false);

//   if (!profile) return null;

//   // Merge service arrays from profile, depending on what's available
//   const getCombinedServices = () => {
//     const sr = profile.serviceRequirements ?? [];
//     const sso = profile.securityServicesOfferings ?? [];
//     const combined = [...sr, ...sso];
//     // Remove duplicates
//     return Array.from(new Set(combined));
//   };

//   // Initialize form data from merged service arrays and otherService (optional)
//   const [formData, setFormData] = useState({
//     selectedServices: getCombinedServices().join(", "),
//     otherService: profile.otherService || "",
//   });

//   const [updatedData, setUpdatedData] = useState({ ...formData });

//   // If profile changes, reset formData
//   useEffect(() => {
//     setFormData({
//       selectedServices: getCombinedServices().join(", "),
//       otherService: profile.otherService || "",
//     });
//     setUpdatedData({
//       selectedServices: getCombinedServices().join(", "),
//       otherService: profile.otherService || "",
//     });
//   }, [profile]);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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

//       // Prepare updated service arrays from the comma separated input
//       const selectedServicesArr = formData.selectedServices
//         .split(",")
//         .map((s) => s.trim())
//         .filter((s) => s.length > 0);

//       // Prepare payload according to the type of profile.
//       // We'll keep both arrays updated if both exist, else only serviceRequirements

//       let payloadData: any = {
//         otherService: formData.otherService,
//       };

//       // If profile has securityServicesOfferings, update it too
//       if (profile.securityServicesOfferings) {
//         payloadData.securityServicesOfferings = selectedServicesArr;
//       }

//       if (profile.serviceRequirements) {
//         payloadData.serviceRequirements = selectedServicesArr;
//       }

//       const payload = { profileData: payloadData };

//       await axios.put(`${API_URL}/profile/individual/${id}`, payload, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       });

//       setUpdatedData({ ...formData });
//       toast.success("Services updated successfully");
//       setIsEditing(false);
//     } catch (error: any) {
//       const message = error.response?.data?.message || "Failed to update services.";
//       toast.error(message);
//     }
//   };

//   const handleCancel = () => {
//     setFormData({ ...updatedData });
//     setIsEditing(false);
//   };

//   return (
//     <Section
//       title={
//         <div className="flex items-center justify-between w-full">
//           <h2 className="text-lg font-semibold">Services</h2>
//         </div>
//       }
//     >
//       {isEditing ? (
//         <>
//           <div className="space-y-3">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Services / Specializations (comma-separated)
//               </label>
//               <input
//                 type="text"
//                 name="selectedServices"
//                 value={formData.selectedServices}
//                 onChange={handleChange}
//                 className="w-full border px-3 py-2 rounded text-gray-700"
//                 placeholder="e.g., Security Officer, CCTV Services"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Other Services
//               </label>
//               <textarea
//                 name="otherService"
//                 value={formData.otherService}
//                 onChange={handleChange}
//                 className="w-full border px-3 py-2 rounded text-gray-700"
//                 rows={4}
//                 placeholder="Describe other services you offer"
//               />
//             </div>
//           </div>
//           <div className="flex gap-3 mt-4 justify-end">
//             <button
//               onClick={handleSave}
//               className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
//             >
//               Save
//             </button>
//             <button
//               onClick={handleCancel}
//               className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
//             >
//               Cancel
//             </button>
//           </div>
//         </>
//       ) : (
//         <>
//           {formData.selectedServices && formData.selectedServices.length > 0 && (
//             <div className="mb-4">
//               <h4 className="font-medium text-gray-800 mb-2">Services / Specializations</h4>
//               <div className="flex flex-wrap gap-2">
//                 {formData.selectedServices
//                   .split(",")
//                   .map((service) => service.trim())
//                   .filter((service) => service.length > 0)
//                   .map((service, index) => (
//                     <span
//                       key={index}
//                       className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full"
//                     >
//                       {service}
//                     </span>
//                   ))}
//               </div>
//             </div>
//           )}
//           {formData.otherService && (
//             <div>
//               <h4 className="font-medium text-gray-800">Other Services</h4>
//               <p className="text-gray-700 whitespace-pre-wrap">{formData.otherService}</p>
//             </div>
//           )}
//           {!isEditing && (
//             <button
//               onClick={() => setIsEditing(true)}
//               className="text-sm px-5 py-2 mt-5 bg-black text-white rounded hover:bg-gray-800 transition"
//             >
//               Edit
//             </button>
//           )}
//         </>
//       )}
//     </Section>
//   );
// };

// export default ServicesSection;







// const ServicesSection = ({ profile }: { profile: any }) => {
//     return (
//       <div>
//         <h2 className="text-lg font-semibold mb-2">Services</h2>
//         {profile.serviceRequirements?.length > 0 && (
//           <>
//             <h4 className="font-medium">Service Requirements:</h4>
//             <ul className="list-disc list-inside mb-2">
//               {profile.serviceRequirements.map((service: string, i: number) => (
//                 <li key={i}>{service}</li>
//               ))}
//             </ul>
//           </>
//         )}
//         {profile.securityServicesOfferings?.length > 0 && (
//           <>
//             <h4 className="font-medium">Security Services Offerings:</h4>
//             <ul className="list-disc list-inside">
//               {profile.securityServicesOfferings.map((offering: string, i: number) => (
//                 <li key={i}>{offering}</li>
//               ))}
//             </ul>
//           </>
//         )}
//       </div>
//     );
//   };
  
//   export default ServicesSection;
  