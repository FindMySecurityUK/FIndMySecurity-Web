"use client";

import { useState, useEffect, useRef } from "react";
import { FaBuilding, FaCheck, FaClipboardList, FaEnvelope, FaGlobe, FaIndustry, FaMapMarkerAlt, FaPhone, FaUserTie } from "react-icons/fa";
import { LockIcon } from "lucide-react";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import Select from "react-select";
import TextField from '@mui/material/TextField';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import companiesList from "@/sections/data/secuirty_services.json";
import providersList from "@/sections/data/training_providers.json";
import toast from "react-hot-toast";
import { parsePhoneNumberFromString } from 'libphonenumber-js';

interface ClientGeneralFormProps {
  id: number;
  title: string;
  onSubmit: (data: any) => void;
}

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

interface FormData {
  companyName: string;
  registrationNumber: string;
  address: string;
  postcode: string;
  industryType: string;
  contactPerson: string;
  password: string;
  jobTitle: string;
  email: string;
  phone: string;
  website: string;
  selectedRoles: RoleSelection[];
  otherService: string;
  premiumService: boolean;
  securityChallenges: string;
  receiveEmails: boolean;
  acceptTerms: boolean;
  dateOfBirth: { day: string; month: string; year: string };
}

const SecurityCompanyForm: React.FC<ClientGeneralFormProps> = ({ id, title, onSubmit }) => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwordValidations, setPasswordValidations] = useState({
    length: false,
    hasUpper: false,
    hasLower: false,
    hasNumber: false,
    hasSpecial: false,
    isValid: false
  });
  const [phoneNumberInfo, setPhoneNumberInfo] = useState<{
    isValid: boolean;
    country?: string;
    countryCode?: string;
    formatInternational?: string;
    error?: string;
  }>({ isValid: false });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [showAllErrors, setShowAllErrors] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const [formData, setFormData] = useState<FormData>({
    companyName: "",
    registrationNumber: "",
    address: "",
    postcode: "",
    industryType: "",
    contactPerson: "",
    password: "",
    jobTitle: "",
    email: "",
    phone: "",
    website: "",
    selectedRoles: [],
    otherService: "",
    premiumService: false,
    securityChallenges: "",
    receiveEmails: false,
    acceptTerms: false,
    dateOfBirth: { day: "", month: "", year: "" },
  });

  useEffect(() => {
    const isValid = validateForm();
    setIsFormValid(isValid);
  }, [formData, passwordValidations, phoneNumberInfo]);

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePassword = (password: string) => {
    const validations = {
      length: password.length >= 8,
      hasUpper: /[A-Z]/.test(password),
      hasLower: /[a-z]/.test(password),
      hasNumber: /\d/.test(password),
      hasSpecial: /[.\-_!@#$%^*]/.test(password),
      isValid: false
    };
    validations.isValid = Object.values(validations).slice(0, 5).every(Boolean);
    return validations;
  };

  const validatePhoneNumber = (phone: string) => {
    if (!phone || !phone.trim()) {
      return { isValid: false, error: "Phone number is required" };
    }

    const phoneNumber = parsePhoneNumberFromString(phone);
    if (!phoneNumber || !phoneNumber.isValid()) {
      return { isValid: false, error: "Invalid phone number" };
    }

    return {
      isValid: true,
      country: phoneNumber.country,
      countryCode: phoneNumber.countryCallingCode,
      formatInternational: phoneNumber.formatInternational(),
    };
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;

    setFormErrors(prev => ({ ...prev, [name]: "" }));

    if (["day", "month", "year"].includes(name)) {
      setFormData({
        ...formData,
        dateOfBirth: { ...formData.dateOfBirth, [name]: value },

      });
    } else if (type === "checkbox") {
      setFormData({
        ...formData,
        [name]: checked,
      });
    } else {
      setFormData({ ...formData, [name]: value });

      if (name === "password") {
        setPasswordValidations(validatePassword(value));
      }
    }
  };

  const handleInputChange = <K extends keyof FormData>(field: K, value: FormData[K]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleRoleSelection = (selectedOptions: any) => {
    const selectedItems = selectedOptions.map((option: any) => ({
      title: option.group,
      role: option.value
    }));
    handleInputChange('selectedRoles', selectedItems);
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    let isValid = true;

    if (!formData.email.trim()) {
      errors.email = "Email is required";
      isValid = false;
    } else if (!validateEmail(formData.email)) {
      errors.email = "Please enter a valid email";
      isValid = false;
    }

    if (!formData.phone.trim()) {
      errors.phone = "Phone number is required";
      isValid = false;
    } else if (!phoneNumberInfo.isValid) {
      errors.phone = phoneNumberInfo.error || "Invalid phone number";
      isValid = false;
    }

    if (!formData.password.trim()) {
      errors.password = "Password is required";
      isValid = false;
    } else if (!passwordValidations.isValid) {
      errors.password = "Password doesn't meet requirements";
      isValid = false;
    }

    if (!formData.companyName.trim()) {
      errors.companyName = "Company name is required";
      isValid = false;
    }

    if (!formData.address.trim()) {
      errors.address = "Address is required";
      isValid = false;
    }

    if (!formData.contactPerson.trim()) {
      errors.contactPerson = "Contact person is required";
      isValid = false;
    }

    if (!formData.acceptTerms) {
      errors.acceptTerms = "You must accept the terms and conditions";
      isValid = false;
    }

    setFormErrors(errors);
    console.log("Form validation errors:", errors);
    console.log("Is form valid?", isValid);
    return isValid && Object.keys(errors).length === 0;
  };

  const roleOptions: RoleOption[] = (
    id === 5 ? companiesList : id === 6 ? providersList : []
  ).flatMap(category =>
    category.roles.map(role => ({
      label: role,
      value: role,
      group: category.title.replace(" (Coming Soon)", ""),
      isComingSoon: category.title.includes("Coming Soon")
    }))
  );

  const groupedOptions = roleOptions.reduce((acc, option) => {
    if (!acc[option.group]) {
      acc[option.group] = [];
    }
    acc[option.group].push(option);
    return acc;
  }, {} as Record<string, typeof roleOptions>);

  const selectStyles = {
    option: (provided: any, state: any) => ({
      ...provided,
      color: state.data.isComingSoon ? '#9CA3AF' : provided.color,
      cursor: state.data.isComingSoon ? 'not-allowed' : provided.cursor,
      backgroundColor: state.isSelected ? '#E5E7EB' : provided.backgroundColor,
      '&:hover': {
        backgroundColor: state.data.isComingSoon ? provided.backgroundColor : '#F3F4F6'
      }
    }),
    multiValueLabel: (provided: any, state: any) => ({
      ...provided,
      textDecoration: 'none',
      color: state.data.isComingSoon ? '#9CA3AF' : provided.color
    }),
    multiValue: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: state.data.isComingSoon ? '#F3F4F6' : '#E5E7EB'
    })
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const toastId = toast.loading("Submitting form...");
  
    const isValid = validateForm();
    setIsFormValid(isValid);
  
    if (!isValid) {
      setShowAllErrors(true);
      toast.error("Please fix the errors in the form.", { id: toastId });
      setTimeout(() => {
        const firstError = document.querySelector('.border-red-500');
        if (firstError) {
          firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
      setIsSubmitting(false);
      return;
    }
  
    try {
      const postcodeResponse = await fetch(`https://api.postcodes.io/postcodes/${encodeURIComponent(formData.postcode.trim())}`);
      if (!postcodeResponse.ok || postcodeResponse.status !== 200) {
        setFormErrors(prev => ({
          ...prev,
          postcode: "Invalid UK postcode. Please enter a valid one."
        }));
        setShowAllErrors(true);
        toast.error("Invalid UK postcode. Please enter a valid one.", { id: toastId });
        const postcodeInput = document.querySelector('input[name="postcode"]');
        if (postcodeInput) {
          postcodeInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        setIsSubmitting(false);
        return;
      }
  
      const postcodeData = await postcodeResponse.json();
      if (!postcodeData.result) {
        setFormErrors(prev => ({
          ...prev,
          postcode: "Invalid UK postcode. Please enter a valid one."
        }));
        setShowAllErrors(true);
        toast.error("Invalid UK postcode. Please enter a valid one.", { id: toastId });
        const postcodeInput = document.querySelector('input[name="postcode"]');
        if (postcodeInput) {
          postcodeInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        setIsSubmitting(false);
        return;
      }
  
      const serviceRequirements = Array.from(
        new Set(formData.selectedRoles.map(item => item.title))
      );
  
      const securityServicesOfferings = [
        ...formData.selectedRoles.map(item => item.role),
        ...(formData.otherService ? [formData.otherService.trim()] : [])
      ];
  
      const formattedData = {
        email: formData.email,
        password: formData.password,
        firstName: formData.companyName.split(" ")[0],
        lastName: formData.companyName.split(" ")[1] || "",
        address: formData.address,
        phoneNumber: formData.phone,
        countryCode: phoneNumberInfo.countryCode,
        country: phoneNumberInfo.country,
        companyData: {
          companyName: formData.companyName,
          registrationNumber: formData.registrationNumber,
          address: formData.address,
          postCode: formData.postcode,
          contactPerson: formData.contactPerson,
          jobTitle: formData.jobTitle,
          phoneNumber: formData.phone,
          website: formData.website,
        },
        serviceRequirements,
        securityServicesOfferings,
        permissions: {
          premiumServiceNeed: formData.premiumService,
          acceptEmails: formData.receiveEmails,
          acceptTerms: formData.acceptTerms,
        },
        roleId: Number(id),
      };
  
      console.log("Submitting formatted data:", formattedData);
      await onSubmit(formattedData);
      toast.success("Form submitted successfully!", { id: toastId });
    } catch (error) {
      console.error("Error during form submission:", error);
      toast.error("An error occurred while submitting the form. Please try again.", { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePhoneNumberChange = (value: string | undefined) => {
    const phone = value || "";
    setFormData(prev => ({ ...prev, phone }));
    setFormErrors(prev => ({ ...prev, phone: "" }));

    if (phone) {
      const validation = validatePhoneNumber(phone);
      setPhoneNumberInfo(validation);
      if (!validation.isValid) {
        setFormErrors(prev => ({
          ...prev,
          phone: validation.error || "Invalid phone number"
        }));
      }
    } else {
      setPhoneNumberInfo({ isValid: false, error: "Phone number is required" });
      setFormErrors(prev => ({ ...prev, phone: "Phone number is required" }));
    }
  };

  return (
    <>
      <div className="max-w-4xl mx-auto bg-white shadow-lg p-8 rounded-md text-black">
        <h1 className="text-center text-3xl font-bold my-6">{title} Registration</h1>

        <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative flex items-center">
              <FaBuilding className="absolute left-3 text-gray-700" />
              <TextField
                type="text"
                name="companyName"
                label="Company Name"
                value={formData.companyName}
                onChange={handleChange}
                id="outlined-basic"
                variant="outlined"
                className={`w-full pl-10 pr-3 py-2 border rounded-md bg-gray-100 focus:ring-2 focus:ring-black ${
                  showAllErrors && formErrors.companyName ? "border-red-500" : "border-gray-300"
                } focus:border-black`}
                InputLabelProps={{ style: { color: 'gray' } }}
                inputProps={{ className: "focus:outline-none" }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: showAllErrors && formErrors.companyName ? "red" : "gray",
                    },
                    "&.Mui-focused fieldset": { borderColor: "black" },
                  },
                  "& .MuiInputLabel-root": { color: "gray" },
                  "& .Mui-focused .MuiInputLabel-root": { color: "black" },
                }}
                required
              />
              {(showAllErrors && formErrors.companyName) && (
                <p className="mt-1 text-xs text-red-500">{formErrors.companyName}</p>
              )}
            </div>
            <TextField
              type="text"
              name="registrationNumber"
              label="Registration Number"
              value={formData.registrationNumber}
              onChange={handleChange}
              id="outlined-basic"
              variant="outlined"
              className="w-full pl-3 pr-3 py-2 border rounded-md bg-gray-100 focus:ring-2 focus:ring-black border-gray-300 focus:border-black"
              InputLabelProps={{ style: { color: 'gray' } }}
              inputProps={{ className: "focus:outline-none" }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "gray" },
                  "&.Mui-focused fieldset": { borderColor: "black" },
                },
                "& .MuiInputLabel-root": { color: "gray" },
                "& .Mui-focused .MuiInputLabel-root": { color: "black" },
              }}
            />
          </div>

          <div className="relative">
  <LockIcon className="absolute left-3 top-3 text-gray-500" />
  <TextField
    type={passwordVisible ? "text" : "password"}
    name="password"
    value={formData.password}
    onChange={handleChange}
    required
    label="Password"
    id="outlined-basic"
    variant="outlined"
    className={`w-full pl-10 pr-3 py-2 border rounded-md bg-gray-100 focus:ring-2 focus:ring-black ${
      showAllErrors && formErrors.password ? "border-red-500" : "border-gray-300"
    } focus:border-black`}
    InputLabelProps={{ style: { color: 'gray' } }}
    inputProps={{ className: "focus:outline-none" }}
    sx={{
      "& .MuiOutlinedInput-root": {
        "& fieldset": {
          borderColor: showAllErrors && formErrors.password ? "red" : "gray",
        },
        "&.Mui-focused fieldset": { borderColor: "black" },
      },
      "& .MuiInputLabel-root": { color: "gray" },
      "& .Mui-focused .MuiInputLabel-root": { color: "black" },
    }}
  />
  <button
    type="button"
    className="absolute right-3 top-4 text-gray-500"
    onClick={() => setPasswordVisible(!passwordVisible)}
  >
    {passwordVisible ? <IoMdEyeOff className="w-6 h-6" /> : <IoMdEye className="w-6 h-6" />}
  </button>

  {(formData.password || showAllErrors) && !passwordValidations.isValid && (
    <div className="mt-2 text-xs space-y-1">
      {!passwordValidations.length && (
        <p className="text-red-500">✗ At least 8 characters</p>
      )}
      {!passwordValidations.hasUpper && (
        <p className="text-red-500">✗ At least one capital letter</p>
      )}
      {!passwordValidations.hasLower && (
        <p className="text-red-500">✗ At least one small letter</p>
      )}
      {!passwordValidations.hasNumber && (
        <p className="text-red-500">✗ At least one number</p>
      )}
      {!passwordValidations.hasSpecial && (
        <p className="text-red-500">✗ At least one special character (. - _ ! @ # $ % ^ *)</p>
      )}
    </div>
  )}
  {(showAllErrors && formErrors.password) && (
    <p className="mt-1 text-xs text-red-500">{formErrors.password}</p>
  )}
</div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative flex items-center">
              <FaMapMarkerAlt className="absolute left-3 text-gray-700" />
              <TextField
                type="text"
                name="address"
                label="Business Address"
                value={formData.address}
                onChange={handleChange}
                id="outlined-basic"
                variant="outlined"
                className={`w-full pl-10 pr-3 py-2 border rounded-md bg-gray-100 focus:ring-2 focus:ring-black ${
                  showAllErrors && formErrors.address ? "border-red-500" : "border-gray-300"
                } focus:border-black`}
                InputLabelProps={{ style: { color: 'gray' } }}
                inputProps={{ className: "focus:outline-none" }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: showAllErrors && formErrors.address ? "red" : "gray",
                    },
                    "&.Mui-focused fieldset": { borderColor: "black" },
                  },
                  "& .MuiInputLabel-root": { color: "gray" },
                  "& .Mui-focused .MuiInputLabel-root": { color: "black" },
                }}
                required
              />
              {(showAllErrors && formErrors.address) && (
                <p className="mt-1 text-xs text-red-500">{formErrors.address}</p>
              )}
            </div>
            <TextField
              type="text"
              name="postcode"
              label="Post Code"
              value={formData.postcode}
              onChange={handleChange}
              id="outlined-basic"
              variant="outlined"
              className="w-full pl-3 pr-3 py-2 border rounded-md bg-gray-100 focus:ring-2 focus:ring-black border-gray-300 focus:border-black"
              InputLabelProps={{ style: { color: 'gray' } }}
              inputProps={{ className: "focus:outline-none" }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "gray" },
                  "&.Mui-focused fieldset": { borderColor: "black" },
                },
                "& .MuiInputLabel-root": { color: "gray" },
                "& .Mui-focused .MuiInputLabel-root": { color: "black" },
              }}
              required
            />
          </div>

          <div className="relative flex items-center">
            <FaIndustry className="absolute left-3 text-gray-700" />
            <TextField
              type="text"
              name="industryType"
              label="Industry Type"
              value={formData.industryType}
              onChange={handleChange}
              id="outlined-basic"
              variant="outlined"
              className="w-full pl-10 pr-3 py-2 border rounded-md bg-gray-100 focus:ring-2 focus:ring-black border-gray-300 focus:border-black"
              InputLabelProps={{ style: { color: 'gray' } }}
              inputProps={{ className: "focus:outline-none" }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "gray" },
                  "&.Mui-focused fieldset": { borderColor: "black" },
                },
                "& .MuiInputLabel-root": { color: "gray" },
                "& .Mui-focused .MuiInputLabel-root": { color: "black" },
              }}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative flex items-center">
              <FaUserTie className="absolute left-3 text-gray-700" />
              <TextField
                type="text"
                name="contactPerson"
                label="Contact Person"
                value={formData.contactPerson}
                onChange={handleChange}
                id="outlined-basic"
                variant="outlined"
                className={`w-full pl-10 pr-3 py-2 border rounded-md bg-gray-100 focus:ring-2 focus:ring-black ${
                  showAllErrors && formErrors.contactPerson ? "border-red-500" : "border-gray-300"
                } focus:border-black`}
                InputLabelProps={{ style: { color: 'gray' } }}
                inputProps={{ className: "focus:outline-none" }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: showAllErrors && formErrors.contactPerson ? "red" : "gray",
                    },
                    "&.Mui-focused fieldset": { borderColor: "black" },
                  },
                  "& .MuiInputLabel-root": { color: "gray" },
                  "& .Mui-focused .MuiInputLabel-root": { color: "black" },
                }}
                required
              />
              {(showAllErrors && formErrors.contactPerson) && (
                <p className="mt-1 text-xs text-red-500">{formErrors.contactPerson}</p>
              )}
            </div>
            <TextField
              type="text"
              name="jobTitle"
              label="Job Title"
              value={formData.jobTitle}
              onChange={handleChange}
              id="outlined-basic"
              variant="outlined"
              className="w-full pl-3 pr-3 py-2 border rounded-md bg-gray-100 focus:ring-2 focus:ring-black border-gray-300 focus:border-black"
              InputLabelProps={{ style: { color: 'gray' } }}
              inputProps={{ className: "focus:outline-none" }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "gray" },
                  "&.Mui-focused fieldset": { borderColor: "black" },
                },
                "& .MuiInputLabel-root": { color: "gray" },
                "& .Mui-focused .MuiInputLabel-root": { color: "black" },
              }}
              required
            />
          </div>

          <div className="relative flex items-center">
            <FaEnvelope className="absolute left-3 text-gray-700" />
            <TextField
              type="email"
              name="email"
              label="Email Address"
              value={formData.email}
              onChange={handleChange}
              id="outlined-basic"
              variant="outlined"
              className={`w-full pl-10 pr-3 py-2 border rounded-md bg-gray-100 focus:ring-2 focus:ring-black ${
                showAllErrors && formErrors.email ? "border-red-500" : "border-gray-300"
              } focus:border-black`}
              InputLabelProps={{ style: { color: 'gray' } }}
              inputProps={{ className: "focus:outline-none" }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: showAllErrors && formErrors.email ? "red" : "gray",
                  },
                  "&.Mui-focused fieldset": { borderColor: "black" },
                  "&:hover fieldset": { borderColor: "gray" },
                },
                "& .MuiInputLabel-root": { color: "gray" },
                "& .Mui-focused .MuiInputLabel-root": { color: "black" },
              }}
              required
            />
            {(showAllErrors && formErrors.email) && (
              <p className="mt-1 text-xs text-red-500">{formErrors.email}</p>
            )}
          </div>

          <div className="relative flex items-center">
            <PhoneInput
              international
              defaultCountry="US"
              value={formData.phone}
              onChange={handlePhoneNumberChange}
              className={`w-full pl-10 pr-3 py-2 border rounded-md bg-gray-100 focus:ring-2 focus:ring-black ${
                showAllErrors && formErrors.phone ? "border-red-500" : "border-gray-300"
              } focus:border-black react-phone-number-input__input`}
              style={{
                paddingLeft: '2.5rem',
                paddingTop: '0.5rem',
                paddingBottom: '0.5rem',
                borderRadius: '0.375rem',
                backgroundColor: '#F3F4F6',
              }}
              placeholder="Enter phone number"
            />
            {(showAllErrors && formErrors.phone) && (
              <p className="mt-1 text-xs text-red-500">{formErrors.phone}</p>
            )}
          </div>

          <div className="relative flex items-center">
            <FaGlobe className="absolute left-3 text-gray-700" />
            <TextField
              type="text"
              name="website"
              label="Website (if applicable)"
              value={formData.website}
              onChange={handleChange}
              id="outlined-basic"
              variant="outlined"
              className="w-full pl-10 pr-3 py-2 border rounded-md bg-gray-100 focus:ring-2 focus:ring-black border-gray-300 focus:border-black"
              InputLabelProps={{ style: { color: 'gray' } }}
              inputProps={{ className: "focus:outline-none" }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "gray" },
                  "&.Mui-focused fieldset": { borderColor: "black" },
                },
                "& .MuiInputLabel-root": { color: "gray" },
                "& .Mui-focused .MuiInputLabel-root": { color: "black" },
              }}
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Security Services* <span className="ml-1 text-xs text-gray-500">(Select multiple if applicable)</span>
            </label>
            <Select
              isMulti
              options={Object.entries(groupedOptions).map(([label, options]) => ({
                label,
                options
              }))}
              value={roleOptions.filter(option => 
                formData.selectedRoles.some(item => item.role === option.value)
              )}
              onChange={handleRoleSelection}
              className="react-select-container"
              classNamePrefix="react-select"
              styles={{
                control: (provided, state) => ({
                  ...provided,
                  minHeight: '44px',
                  borderRadius: '8px',
                  borderColor: state.isFocused ? '#6366f1' : '#d1d5db',
                  boxShadow: state.isFocused ? '0 0 0 1px #6366f1' : 'none',
                  '&:hover': {
                    borderColor: state.isFocused ? '#6366f1' : '#9ca3af'
                  },
                  padding: '2px 4px'
                }),
                option: (provided, state) => ({
                  ...provided,
                  fontSize: '14px',
                  padding: '8px 12px',
                  color: state.data.isComingSoon ? '#6b7280' : '#111827',
                  backgroundColor: state.isSelected 
                    ? '#e0e7ff' 
                    : state.isFocused 
                    ? '#f3f4f6' 
                    : 'white',
                  '&:active': {
                    backgroundColor: '#e0e7ff'
                  },
                  display: 'flex',
                  alignItems: 'center'
                }),
                multiValue: (provided, state) => ({
                  ...provided,
                  backgroundColor: state.data.isComingSoon ? '#f3f4f6' : '#e0e7ff',
                  borderRadius: '6px',
                  border: state.data.isComingSoon ? '1px dashed #d1d5db' : 'none'
                }),
                multiValueLabel: (provided, state) => ({
                  ...provided,
                  color: state.data.isComingSoon ? '#6b7280' : '#4338ca',
                  fontWeight: '500',
                  padding: '4px 6px'
                }),
                multiValueRemove: (provided, state) => ({
                  ...provided,
                  color: state.data.isComingSoon ? '#9ca3af' : '#818cf8',
                  ':hover': {
                    backgroundColor: state.data.isComingSoon ? '#e5e7eb' : '#c7d2fe',
                    color: state.data.isComingSoon ? '#6b7280' : '#6366f1'
                  }
                }),
                groupHeading: (provided) => ({
                  ...provided,
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#374151',
                  backgroundColor: '#f9fafb',
                  padding: '8px 12px',
                  borderBottom: '1px solid #e5e7eb',
                  marginBottom: '4px'
                }),
                menu: (provided) => ({
                  ...provided,
                  borderRadius: '8px',
                  border: '1px solid #e5e7eb',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }),
                placeholder: (provided) => ({
                  ...provided,
                  color: '#9ca3af',
                  fontSize: '14px'
                })
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
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </span>
                  )}
                  <span className={option.isComingSoon ? 'text-gray-500' : 'text-gray-900'}>
                    {option.label}
                  </span>
                </div>
              )}
              closeMenuOnSelect={false}
              hideSelectedOptions={false}
              placeholder={
                <div className="flex items-center text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Select security services...
                </div>
              }
              noOptionsMessage={() => "No roles found"}
              components={{
                IndicatorSeparator: () => null,
                DropdownIndicator: () => (
                  <div className="pr-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                )
              }}
            />
            {formData.selectedRoles.length > 0 && (
              <p className="mt-2 text-xs text-gray-500">
                Selected: {formData.selectedRoles.length} service(s)
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Other Services:</label>
            <input
              type="text"
              value={formData.otherService}
              onChange={(e) => handleInputChange('otherService', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3 border"
              placeholder="Enter any additional service"
            />
          </div>

          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              name="premiumService"
              checked={formData.premiumService}
              onChange={handleChange}
              className="w-4 h-4"
            />
            <label>Interested in premium service package for enhanced visibility?</label>
          </div>

          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              name="acceptTerms"
              checked={formData.acceptTerms}
              onChange={handleChange}
              required
              className={`w-4 h-4 ${showAllErrors && formErrors.acceptTerms ? "border-red-500" : ""}`}
            />
            <span>
              Agree to <a href="/legal/terms" target="_blank" rel="noopener noreferrer" className="underline">Terms & Conditions</a>
            </span>
            {(showAllErrors && formErrors.acceptTerms) && (
              <p className="mt-1 text-xs text-red-500">{formErrors.acceptTerms}</p>
            )}
          </div>

          <button
            type="submit"
            className={`w-full py-3 text-white font-bold rounded-md transition-colors ${
              isFormValid && !isSubmitting ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-400 cursor-not-allowed"
            }`}
            disabled={!isFormValid || isSubmitting}
          >
            {isSubmitting ? "Submitting..." : <><FaCheck className="inline mr-2" /> Submit</>}
          </button>
        </form>
      </div>

      <style jsx global>{`
        .react-phone-number-input__input {
          border: none !important;
          background: transparent !important;
          outline: none !important;
        }
        .react-phone-number-input__country {
          margin-left: 2rem;
          background: #F3F4F6;
          border-radius: 0.375rem 0 0 0.375rem;
          border: 1px solid #D1D5DB;
          border-right: none;
        }
        .react-phone-number-input__input {
          border: 1px solid #D1D5DB !important;
          border-left: none !important;
          border-radius: 0 0.375rem 0.375rem 0;
          padding: 0.5rem 0.75rem !important;
          background: #F3F4F6 !important;
        }
        .react-phone-number-input__input:focus {
          border-color: #000000 !important;
          box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.2) !important;
        }
        .react-phone-number-input__input--invalid {
          border-color: #EF4444 !important;
        }
        .react-phone-number-input__icon {
          width: 1.5rem !important;
          height: 1.5rem !important;
          margin: 0.5rem;
        }
      `}</style>
    </>
  );
};

export default SecurityCompanyForm;





// "use client";

// import { useState, useEffect, useRef } from "react";
// import { FaBuilding, FaCheck, FaClipboardList, FaEnvelope, FaGlobe, FaIndustry, FaMapMarkerAlt, FaPhone, FaUserTie } from "react-icons/fa";
// import { LockIcon } from "lucide-react";
// import { IoMdEye, IoMdEyeOff } from "react-icons/io";
// import Select from "react-select";
// import TextField from '@mui/material/TextField';
// import companiesList from "@/sections/data/secuirty_services.json";
// import providersList from "@/sections/data/training_providers.json";
// import toast from "react-hot-toast";
// import { parsePhoneNumberFromString } from 'libphonenumber-js';

// interface ClientGeneralFormProps {
//   id: number;
//   title: string;
//   onSubmit: (data: any) => void;
// }

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

// interface FormData {
//   companyName: string;
//   registrationNumber: string;
//   address: string;
//   postcode: string;
//   industryType: string;
//   contactPerson: string;
//   password: string;
//   jobTitle: string;
//   email: string;
//   phone: string;
//   website: string;
//   selectedRoles: RoleSelection[];
//   otherService: string;
//   premiumService: boolean;
//   securityChallenges: string;
//   receiveEmails: boolean;
//   acceptTerms: boolean;
//   dateOfBirth: { day: string; month: string; year: string };
// }

// const SecurityCompanyForm: React.FC<ClientGeneralFormProps> = ({ id, title, onSubmit }) => {
//   const [passwordVisible, setPasswordVisible] = useState(false);
//   const [passwordValidations, setPasswordValidations] = useState({
//     length: false,
//     hasUpper: false,
//     hasLower: false,
//     hasNumber: false,
//     hasSpecial: false,
//     isValid: false
//   });
//   const [phoneNumberInfo, setPhoneNumberInfo] = useState<{
//     isValid: boolean;
//     country?: string;
//     formatInternational?: string;
//     error?: string;
//   }>({ isValid: false });
//   const [formErrors, setFormErrors] = useState<Record<string, string>>({});
//   const [isFormValid, setIsFormValid] = useState(false);
//   const [showAllErrors, setShowAllErrors] = useState(false);
//   const [formSubmissionData, setFormSubmissionData] = useState<any>(null);
//   const formRef = useRef<HTMLFormElement>(null);

//   const [formData, setFormData] = useState<FormData>({
//     companyName: "",
//     registrationNumber: "",
//     address: "",
//     postcode: "",
//     industryType: "",
//     contactPerson: "",
//     password: "",
//     jobTitle: "",
//     email: "",
//     phone: "",
//     website: "",
//     selectedRoles: [],
//     otherService: "",
//     premiumService: false,
//     securityChallenges: "",
//     receiveEmails: false,
//     acceptTerms: false,
//     dateOfBirth: { day: "", month: "", year: "" },
//   });

//   useEffect(() => {
//     const isValid = validateForm();
//     setIsFormValid(isValid);
//   }, [formData, passwordValidations]);

//   const validateEmail = (email: string) => {
//     const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     return re.test(email);
//   };

//   const validatePassword = (password: string) => {
//     const validations = {
//       length: password.length >= 8,
//       hasUpper: /[A-Z]/.test(password),
//       hasLower: /[a-z]/.test(password),
//       hasNumber: /\d/.test(password),
//       hasSpecial: /[.\-_!@#$%^*]/.test(password),
//       isValid: false
//     };
//     validations.isValid = Object.values(validations).slice(0, 5).every(Boolean);
//     return validations;
//   };

//   const validatePhoneNumber = (phone: string) => {
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

//   const validatePostcode = (postcode: string) => {
//     if (!postcode || !postcode.trim()) {
//       return { isValid: false, error: "Postcode is required" };
//     }
//     const postcodeRegex = /^[A-Z]{1,2}[0-9]{1,2}[A-Z]?\s?[0-9][A-Z]{2}$/i;
//     if (!postcodeRegex.test(postcode.trim())) {
//       return { isValid: false, error: "Invalid UK postcode format" };
//     }
//     return { isValid: true };
//   };

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
//     const { name, value, type, checked } = e.target as HTMLInputElement;

//     setFormErrors(prev => ({ ...prev, [name]: "" }));

//     if (["day", "month", "year"].includes(name)) {
//       setFormData({
//         ...formData,
//         dateOfBirth: { ...formData.dateOfBirth, [name]: value },
//       });
//     } else if (type === "checkbox") {
//       setFormData({
//         ...formData,
//         [name]: checked,
//       });
//     } else {
//       setFormData({ ...formData, [name]: value });

//       if (name === "password") {
//         setPasswordValidations(validatePassword(value));
//       }
//       if (name === "postcode") {
//         const validation = validatePostcode(value);
//         if (!validation.isValid) {
//           setFormErrors(prev => ({ ...prev, postcode: validation.error }));
//         }
//       }
//     }
//   };

//   const handleInputChange = <K extends keyof FormData>(field: K, value: FormData[K]) => {
//     setFormData(prev => ({
//       ...prev,
//       [field]: value
//     }));
//   };

//   const handleRoleSelection = (selectedOptions: any) => {
//     const selectedItems = selectedOptions.map((option: any) => ({
//       title: option.group,
//       role: option.value
//     }));
//     handleInputChange('selectedRoles', selectedItems);
//   };

//   const validateForm = () => {
//     const errors: Record<string, string> = {};
//     let isValid = true;

//     if (!formData.email.trim()) {
//       errors.email = "Email is required";
//       isValid = false;
//     } else if (!validateEmail(formData.email)) {
//       errors.email = "Please enter a valid email";
//       isValid = false;
//     }

//     if (!formData.phone.trim()) {
//       errors.phoneNumber = "Phone number is required";
//       isValid = false;
//     } else if (!phoneNumberInfo.isValid) {
//       errors.phoneNumber = phoneNumberInfo.error || "Invalid phone number";
//       isValid = false;
//     }

//     if (!formData.password.trim()) {
//       errors.password = "Password is required";
//       isValid = false;
//     } else if (!passwordValidations.isValid) {
//       errors.password = "Password doesn't meet requirements";
//       isValid = false;
//     }

//     if (!formData.companyName.trim()) {
//       errors.companyName = "Company name is required";
//       isValid = false;
//     }

//     if (!formData.address.trim()) {
//       errors.address = "Address is required";
//       isValid = false;
//     }

//     if (!formData.contactPerson.trim()) {
//       errors.contactPerson = "Contact person is required";
//       isValid = false;
//     }

//     const postcodeValidation = validatePostcode(formData.postcode);
//     if (!postcodeValidation.isValid) {
//       errors.postcode = postcodeValidation.error;
//       isValid = false;
//     }

//     if (!formData.acceptTerms) {
//       errors.acceptTerms = "You must accept the terms and conditions";
//       isValid = false;
//     }

//     setFormErrors(errors);
//     return isValid && Object.keys(errors).length === 0;
//   };

//   const roleOptions: RoleOption[] = (
//     id === 5 ? companiesList : id === 6 ? providersList : []
//   ).flatMap(category =>
//     category.roles.map(role => ({
//       label: role,
//       value: role,
//       group: category.title.replace(" (Coming Soon)", ""),
//       isComingSoon: category.title.includes("Coming Soon")
//     }))
//   );

//   const groupedOptions = roleOptions.reduce((acc, option) => {
//     if (!acc[option.group]) {
//       acc[option.group] = [];
//     }
//     acc[option.group].push(option);
//     return acc;
//   }, {} as Record<string, typeof roleOptions>);

//   const selectStyles = {
//     option: (provided: any, state: any) => ({
//       ...provided,
//       color: state.data.isComingSoon ? '#9CA3AF' : provided.color,
//       cursor: state.data.isComingSoon ? 'not-allowed' : provided.cursor,
//       backgroundColor: state.isSelected ? '#E5E7EB' : provided.backgroundColor,
//       '&:hover': {
//         backgroundColor: state.data.isComingSoon ? provided.backgroundColor : '#F3F4F6'
//       }
//     }),
//     multiValueLabel: (provided: any, state: any) => ({
//       ...provided,
//       textDecoration: 'none',
//       color: state.data.isComingSoon ? '#9CA3AF' : provided.color
//     }),
//     multiValue: (provided: any, state: any) => ({
//       ...provided,
//       backgroundColor: state.data.isComingSoon ? '#F3F4F6' : '#E5E7EB'
//     })
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     const isValid = validateForm();
//     setIsFormValid(isValid);

//     if (!isValid) {
//       setShowAllErrors(true);
//       toast.error("Please fix the errors in the form.", { duration: 5000 });
//       setTimeout(() => {
//         const firstError = document.querySelector('.border-red-500');
//         if (firstError) {
//           firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
//         }
//       }, 100);
//       return;
//     }

//     try {
//       const postcodeValidation = validatePostcode(formData.postcode);
//       if (!postcodeValidation.isValid) {
//         setFormErrors(prev => ({ ...prev, postcode: postcodeValidation.error }));
//         toast.error(postcodeValidation.error, { duration: 5000 });
//         const postcodeInput = document.querySelector('input[name="postcode"]');
//         if (postcodeInput) {
//           postcodeInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
//         }
//         return;
//       }

//       const postcodeResponse = await fetch(`https://api.postcodes.io/postcodes/${encodeURIComponent(formData.postcode.trim())}`);
//       const postcodeData = await postcodeResponse.json();

//       if (!postcodeResponse.ok || !postcodeData.result || postcodeData.status !== 200) {
//         setFormErrors(prev => ({ ...prev, postcode: "Invalid UK postcode. Please enter a valid one." }));
//         toast.error("Invalid UK postcode. Please enter a valid one.", { duration: 5000 });
//         const postcodeInput = document.querySelector('input[name="postcode"]');
//         if (postcodeInput) {
//           postcodeInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
//         }
//         return;
//       }

//       const serviceRequirements = Array.from(
//         new Set(formData.selectedRoles.map(item => item.title))
//       );

//       const securityServicesOfferings = [
//         ...formData.selectedRoles.map(item => item.role),
//         ...(formData.otherService ? [formData.otherService.trim()] : [])
//       ];

//       const formattedData = {
//         email: formData.email,
//         password: formData.password,
//         firstName: formData.companyName.split(" ")[0],
//         lastName: formData.companyName.split(" ")[1] || "",
//         address: formData.address,
//         phoneNumber: formData.phone,
//         companyData: {
//           companyName: formData.companyName,
//           registrationNumber: formData.registrationNumber,
//           address: formData.address,
//           postCode: formData.postcode,
//           contactPerson: formData.contactPerson,
//           jobTitle: formData.jobTitle,
//           phoneNumber: formData.phone,
//           website: formData.website,
//         },
//         serviceRequirements,
//         securityServicesOfferings,
//         permissions: {
//           premiumServiceNeed: formData.premiumService,
//           acceptEmails: formData.receiveEmails,
//           acceptTerms: formData.acceptTerms,
//         },
//         roleId: Number(id),
//       };

//       setFormSubmissionData(formattedData);
//       onSubmit(formattedData);
//     } catch (error) {
//       console.error("Postcode validation failed:", error);
//       toast.error("Failed to validate postcode. Please try again later.", { duration: 5000 });
//       return;
//     }
//   };

//   const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { value } = e.target;
//     setFormData(prev => ({ ...prev, phone: value }));
    
//     setFormErrors(prev => ({ ...prev, phoneNumber: "" }));
    
//     if (value) {
//       const validation = validatePhoneNumber(value);
//       setPhoneNumberInfo(validation);
      
//       if (!validation.isValid) {
//         setFormErrors(prev => ({ 
//           ...prev, 
//           phoneNumber: validation.error || "Invalid phone number" 
//         }));
//       }
//     } else {
//       setPhoneNumberInfo({ isValid: false });
//     }
//   };

//   const handlePlanSelected = (plan: string) => {
//     const finalData = {
//       ...formSubmissionData,
//       membershipPlan: plan
//     };
//     onSubmit(finalData);
//   };

//   const handleDialogClose = () => {
//     const finalData = {
//       ...formSubmissionData,
//       membershipPlan: 'basic'
//     };
//     onSubmit(finalData);
//   };

//   return (
    // <>
    //   <div className="max-w-4xl mx-auto bg-white shadow-lg p-8 rounded-md text-black">
    //     <h1 className="text-center text-3xl font-bold my-6">{title} Registration</h1>

    //     <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
    //       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    //         <div className="relative flex items-center">
    //           <FaBuilding className="absolute left-3 text-gray-700" />
    //           <TextField
    //             type="text" 
    //             name="companyName" 
    //             label="Company Name"
    //             value={formData.companyName} 
    //             onChange={handleChange}
    //             id="outlined-basic"
    //             variant="outlined"
    //             className={`w-full pl-10 pr-3 py-2 border rounded-md bg-gray-100 focus:ring-2 focus:ring-black ${
    //               showAllErrors && formErrors.companyName ? "border-red-500" : "border-gray-300"
    //             } focus:border-black`}
    //             InputLabelProps={{
    //               style: { color: 'gray' },
    //             }}
    //             inputProps={{
    //               className: "focus:outline-none"
    //             }}
    //             sx={{
    //               "& .MuiOutlinedInput-root": {
    //                 "& fieldset": {
    //                   borderColor: showAllErrors && formErrors.companyName ? "red" : "gray",
    //                 },
    //                 "&.Mui-focused fieldset": {
    //                   borderColor: "black",
    //                 },
    //               },
    //               "& .MuiInputLabel-root": {
    //                 color: "gray",
    //               },
    //               "& .Mui-focused .MuiInputLabel-root": {
    //                 color: "black",
    //               },
    //             }}
    //             required
    //           />
    //           {(showAllErrors && formErrors.companyName) && (
    //             <p className="mt-1 text-xs text-red-500">{formErrors.companyName}</p>
    //           )}
    //         </div>
    //         <TextField
    //           type="text" 
    //           name="registrationNumber" 
    //           label="Registration Number"
    //           value={formData.registrationNumber} 
    //           onChange={handleChange}
    //           id="outlined-basic"
    //           variant="outlined"
    //           className={`w-full pl-10 pr-3 py-2 border rounded-md bg-gray-100 focus:ring-2 focus:ring-black ${
    //             showAllErrors && formErrors.registrationNumber ? "border-red-500" : "border-gray-300"
    //           } focus:border-black`}
    //           InputLabelProps={{
    //             style: { color: 'gray' },
    //           }}
    //           inputProps={{
    //             className: "focus:outline-none"
    //           }}
    //           sx={{
    //             "& .MuiOutlinedInput-root": {
    //               "& fieldset": {
    //                 borderColor: showAllErrors && formErrors.registrationNumber ? "red" : "gray",
    //               },
    //               "&.Mui-focused fieldset": {
    //                 borderColor: "black",
    //               },
    //             },
    //             "& .MuiInputLabel-root": {
    //               color: "gray",
    //             },
    //             "& .Mui-focused .MuiInputLabel-root": {
    //               color: "black",
    //             },
    //           }}
    //         />
    //       </div>

    //       <div className="relative">
    //         <LockIcon className="absolute left-3 top-3 text-gray-500" />
    //         <TextField
    //           type={passwordVisible ? "text" : "password"}
    //           name="password"
    //           value={formData.password}
    //           onChange={handleChange}
    //           required
    //           label="Password"
    //           id="outlined-basic"
    //           variant="outlined"
    //           className={`w-full pl-10 pr-3 py-2 border rounded-md bg-gray-100 focus:ring-2 focus:ring-black ${
    //             showAllErrors && formErrors.password ? "border-red-500" : "border-gray-300"
    //           } focus:border-black`}
    //           InputLabelProps={{
    //             style: { color: 'gray' },
    //           }}
    //           inputProps={{
    //             className: "focus:outline-none"
    //           }}
    //           sx={{
    //             "& .MuiOutlinedInput-root": {
    //               "& fieldset": {
    //                 borderColor: showAllErrors && formErrors.password ? "red" : "gray",
    //               },
    //               "&.Mui-focused fieldset": {
    //                 borderColor: "black",
    //               },
    //             },
    //             "& .MuiInputLabel-root": {
    //               color: "gray",
    //             },
    //             "& .Mui-focused .MuiInputLabel-root": {
    //               color: "black",
    //             },
    //           }}
    //         />
    //         <button
    //           type="button"
    //           className="absolute right-3 top-4 text-gray-500"
    //           onClick={() => setPasswordVisible(!passwordVisible)}
    //         >
    //           {passwordVisible ? <IoMdEyeOff className="w-6 h-6" /> : <IoMdEye className="w-6 h-6"/>}
    //         </button>
            
    //         {(formData.password || showAllErrors) && (
    //           <div className="mt-2 text-xs space-y-1">
    //             {(!passwordValidations.length || showAllErrors) && (
    //               <p className={passwordValidations.length ? "text-green-500" : "text-red-500"}>
    //                 {passwordValidations.length ? "✓" : "✗"} At least 8 characters
    //               </p>
    //             )}
    //             {(!passwordValidations.hasUpper || showAllErrors) && (
    //               <p className={passwordValidations.hasUpper ? "text-green-500" : "text-red-500"}>
    //                 {passwordValidations.hasUpper ? "✓" : "✗"} At least one capital letter
    //               </p>
    //             )}
    //             {(!passwordValidations.hasLower || showAllErrors) && (
    //               <p className={passwordValidations.hasLower ? "text-green-500" : "text-red-500"}>
    //                 {passwordValidations.hasLower ? "✓" : "✗"} At least one small letter
    //               </p>
    //             )}
    //             {(!passwordValidations.hasNumber || showAllErrors) && (
    //               <p className={passwordValidations.hasNumber ? "text-green-500" : "text-red-500"}>
    //                 {passwordValidations.hasNumber ? "✓" : "✗"} At least one number
    //               </p>
    //             )}
    //             {(!passwordValidations.hasSpecial || showAllErrors) && (
    //               <p className={passwordValidations.hasSpecial ? "text-green-500" : "text-red-500"}>
    //                 {passwordValidations.hasSpecial ? "✓" : "✗"} At least one special character (. - _ ! @ # $ % ^ *)
    //               </p>
    //             )}
    //           </div>
    //         )}
    //         {(showAllErrors && formErrors.password) && (
    //           <p className="mt-1 text-xs text-red-500">{formErrors.password}</p>
    //         )}
    //       </div>

    //       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    //         <div className="relative flex items-center">
    //           <FaMapMarkerAlt className="absolute left-3 text-gray-700" />
    //           <TextField
    //             type="text" 
    //             name="address" 
    //             label="Business Address"
    //             value={formData.address} 
    //             onChange={handleChange}
    //             id="outlined-basic"
    //             variant="outlined"
    //             className={`w-full pl-10 pr-3 py-2 border rounded-md bg-gray-100 focus:ring-2 focus:ring-black ${
    //               showAllErrors && formErrors.address ? "border-red-500" : "border-gray-300"
    //             } focus:border-black`}
    //             InputLabelProps={{
    //               style: { color: 'gray' },
    //             }}
    //             inputProps={{
    //               className: "focus:outline-none"
    //             }}
    //             sx={{
    //               "& .MuiOutlinedInput-root": {
    //                 "& fieldset": {
    //                   borderColor: showAllErrors && formErrors.address ? "red" : "gray",
    //                 },
    //                 "&.Mui-focused fieldset": {
    //                   borderColor: "black",
    //                 },
    //               },
    //               "& .MuiInputLabel-root": {
    //                 color: "gray",
    //               },
    //               "& .Mui-focused .MuiInputLabel-root": {
    //                 color: "black",
    //               },
    //             }}
    //             required
    //           />
    //           {(showAllErrors && formErrors.address) && (
    //             <p className="mt-1 text-xs text-red-500">{formErrors.address}</p>
    //           )}
    //         </div>
    //         <TextField
    //           type="text" 
    //           name="postcode" 
    //           label="Post Code"
    //           value={formData.postcode} 
    //           onChange={handleChange}
    //           id="outlined-basic"
    //           variant="outlined"
    //           className={`w-full pl-10 pr-3 py-2 border rounded-md bg-gray-100 focus:ring-2 focus:ring-black ${
    //             showAllErrors && formErrors.postcode ? "border-red-500" : "border-gray-300"
    //           } focus:border-black`}
    //           InputLabelProps={{
    //             style: { color: 'gray' },
    //           }}
    //           inputProps={{
    //             className: "focus:outline-none"
    //           }}
    //           sx={{
    //             "& .MuiOutlinedInput-root": {
    //               "& fieldset": {
    //                 borderColor: showAllErrors && formErrors.postcode ? "red" : "gray",
    //               },
    //               "&.Mui-focused fieldset": {
    //                 borderColor: "black",
    //               },
    //             },
    //             "& .MuiInputLabel-root": {
    //               color: "gray",
    //             },
    //             "& .Mui-focused .MuiInputLabel-root": {
    //               color: "black",
    //             },
    //           }}
    //           required
    //         />
    //         {(showAllErrors && formErrors.postcode) && (
    //           <p className="mt-1 text-xs text-red-500">{formErrors.postcode}</p>
    //         )}
    //       </div>

    //       <div className="relative flex items-center">
    //         <FaIndustry className="absolute left-3 text-gray-700" />
    //         <TextField
    //           type="text" 
    //           name="industryType" 
    //           label="Industry Type"
    //           value={formData.industryType} 
    //           onChange={handleChange}
    //           id="outlined-basic"
    //           variant="outlined"
    //           className={`w-full pl-10 pr-3 py-2 border rounded-md bg-gray-100 focus:ring-2 focus:ring-black ${
    //             showAllErrors && formErrors.industryType ? "border-red-500" : "border-gray-300"
    //           } focus:border-black`}
    //           InputLabelProps={{
    //             style: { color: 'gray' },
    //           }}
    //           inputProps={{
    //             className: "focus:outline-none"
    //           }}
    //           sx={{
    //             "& .MuiOutlinedInput-root": {
    //               "& fieldset": {
    //                 borderColor: showAllErrors && formErrors.industryType ? "red" : "gray",
    //               },
    //               "&.Mui-focused fieldset": {
    //                 borderColor: "black",
    //               },
    //             },
    //             "& .MuiInputLabel-root": {
    //               color: "gray",
    //             },
    //             "& .Mui-focused .MuiInputLabel-root": {
    //               color: "black",
    //             },
    //           }}
    //           required
    //         />
    //       </div>

    //       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    //         <div className="relative flex items-center">
    //           <FaUserTie className="absolute left-3 text-gray-700" />
    //           <TextField
    //             type="text" 
    //             name="contactPerson" 
    //             label="Contact Person"
    //             value={formData.contactPerson} 
    //             onChange={handleChange}
    //             id="outlined-basic"
    //             variant="outlined"
    //             className={`w-full pl-10 pr-3 py-2 border rounded-md bg-gray-100 focus:ring-2 focus:ring-black ${
    //               showAllErrors && formErrors.contactPerson ? "border-red-500" : "border-gray-300"
    //             } focus:border-black`}
    //             InputLabelProps={{
    //               style: { color: 'gray' },
    //             }}
    //             inputProps={{
    //               className: "focus:outline-none"
    //             }}
    //             sx={{
    //               "& .MuiOutlinedInput-root": {
    //                 "& fieldset": {
    //                   borderColor: showAllErrors && formErrors.contactPerson ? "red" : "gray",
    //                 },
    //                 "&.Mui-focused fieldset": {
    //                   borderColor: "black",
    //                 },
    //               },
    //               "& .MuiInputLabel-root": {
    //                 color: "gray",
    //               },
    //               "& .Mui-focused .MuiInputLabel-root": {
    //                 color: "black",
    //               },
    //             }}
    //             required
    //           />
    //           {(showAllErrors && formErrors.contactPerson) && (
    //             <p className="mt-1 text-xs text-red-500">{formErrors.contactPerson}</p>
    //           )}
    //         </div>
    //         <TextField
    //           type="text" 
    //           name="jobTitle" 
    //           label="Job Title"
    //           value={formData.jobTitle} 
    //           onChange={handleChange}
    //           id="outlined-basic"
    //           variant="outlined"
    //           className={`w-full pl-10 pr-3 py-2 border rounded-md bg-gray-100 focus:ring-2 focus:ring-black ${
    //             showAllErrors && formErrors.jobTitle ? "border-red-500" : "border-gray-300"
    //           } focus:border-black`}
    //           InputLabelProps={{
    //             style: { color: 'gray' },
    //           }}
    //           inputProps={{
    //             className: "focus:outline-none"
    //           }}
    //           sx={{
    //             "& .MuiOutlinedInput-root": {
    //               "& fieldset": {
    //                 borderColor: showAllErrors && formErrors.jobTitle ? "red" : "gray",
    //               },
    //               "&.Mui-focused fieldset": {
    //                 borderColor: "black",
    //               },
    //             },
    //             "& .MuiInputLabel-root": {
    //               color: "gray",
    //             },
    //             "& .Mui-focused .MuiInputLabel-root": {
    //               color: "black",
    //             },
    //           }}
    //           required
    //         />
    //       </div>

    //       <div className="relative flex items-center">
    //         <FaEnvelope className="absolute left-3 text-gray-700" />
    //         <TextField
    //           type="email" 
    //           name="email" 
    //           label="Email Address"
    //           value={formData.email} 
    //           onChange={handleChange}
    //           id="outlined-basic"
    //           variant="outlined"
    //           className={`w-full pl-10 pr-3 py-2 border rounded-md bg-gray-100 focus:ring-2 focus:ring-black ${
    //             showAllErrors && formErrors.email ? "border-red-500" : "border-gray-300"
    //           } focus:border-black`}
    //           InputLabelProps={{
    //             style: { color: 'gray' },
    //           }}
    //           inputProps={{
    //             className: "focus:outline-none"
    //           }}
    //           sx={{
    //             "& .MuiOutlinedInput-root": {
    //               "& fieldset": {
    //                 borderColor: showAllErrors && formErrors.email ? "red" : "gray",
    //               },
    //               "&.Mui-focused fieldset": {
    //                 borderColor: "black",
    //               },
    //             },
    //             "& .MuiInputLabel-root": {
    //               color: "gray",
    //             },
    //             "& .Mui-focused .MuiInputLabel-root": {
    //               color: "black",
    //             },
    //           }}
    //           required
    //         />
    //         {(showAllErrors && formErrors.email) && (
    //           <p className="mt-1 text-xs text-red-500">{formErrors.email}</p>
    //         )}
    //       </div>

    //       <div className="relative flex items-center">
    //         <FaPhone className="absolute left-3 top-3 text-gray-500" />
    //         <TextField
    //           type="text"
    //           name="phoneNumber"
    //           value={formData.phone}
    //           onChange={handlePhoneNumberChange}
    //           id="outlined-basic"
    //           variant="outlined"
    //           label="Phone Number"
    //           className={`w-full pl-10 pr-3 py-2 border rounded-md bg-gray-100 focus:ring-2 focus:ring-black ${
    //             showAllErrors && formErrors.phoneNumber ? "border-red-500" : "border-gray-300"
    //           } focus:border-black`}
    //           InputLabelProps={{
    //             style: { color: 'gray' },
    //           }}
    //           inputProps={{
    //             className: "focus:outline-none"
    //           }}
    //           sx={{
    //             "& .MuiOutlinedInput-root": {
    //               "& fieldset": {
    //                 borderColor: showAllErrors && formErrors.phoneNumber ? "red" : "gray",
    //               },
    //               "&.Mui-focused fieldset": {
    //                 borderColor: "black",
    //               },
    //             },
    //             "& .MuiInputLabel-root": {
    //               color: "gray",
    //             },
    //             "& .Mui-focused .MuiInputLabel-root": {
    //               color: "black",
    //             },
    //           }}
    //         />
    //         {(formData.phone && phoneNumberInfo.country) && (
    //           <div className="mt-1 text-xs text-gray-500">
    //             Country: {phoneNumberInfo.country}
    //             {phoneNumberInfo.formatInternational && (
    //               <span className="ml-2">({phoneNumberInfo.formatInternational})</span>
    //             )}
    //           </div>
    //         )}
    //         {(showAllErrors && formErrors.phoneNumber) && (
    //           <p className="mt-1 text-xs text-red-500">{formErrors.phoneNumber}</p>
    //         )}
    //       </div>

    //       <div className="relative flex items-center">
    //         <FaGlobe className="absolute left-3 text-gray-700" />
    //         <TextField
    //           type="text" 
    //           name="website" 
    //           label="Website (if applicable)"
    //           value={formData.website} 
    //           onChange={handleChange}
    //           id="outlined-basic"
    //           variant="outlined"
    //           className={`w-full pl-10 pr-3 py-2 border rounded-md bg-gray-100 focus:ring-2 focus:ring-black ${
    //             showAllErrors && formErrors.website ? "border-red-500" : "border-gray-300"
    //           } focus:border-black`}
    //           InputLabelProps={{
    //             style: { color: 'gray' },
    //           }}
    //           inputProps={{
    //             className: "focus:outline-none"
    //           }}
    //           sx={{
    //             "& .MuiOutlinedInput-root": {
    //               "& fieldset": {
    //                 borderColor: showAllErrors && formErrors.website ? "red" : "gray",
    //               },
    //               "&.Mui-focused fieldset": {
    //                 borderColor: "black",
    //               },
    //             },
    //             "& .MuiInputLabel-root": {
    //               color: "gray",
    //             },
    //             "& .Mui-focused .MuiInputLabel-root": {
    //               color: "black",
    //             },
    //           }}
    //         />
    //       </div>

    //       <div className="mb-6">
    //         <label className="block text-sm font-medium text-gray-700 mb-2">
    //           Security Services* <span className="ml-1 text-xs text-gray-500">(Select multiple if applicable)</span>
    //         </label>
    //         <Select
    //           isMulti
    //           options={Object.entries(groupedOptions).map(([label, options]) => ({
    //             label,
    //             options
    //           }))}
    //           value={roleOptions.filter(option => 
    //             formData.selectedRoles.some(item => item.role === option.value)
    //           )}
    //           onChange={handleRoleSelection}
    //           className="react-select-container"
    //           classNamePrefix="react-select"
    //           styles={{
    //             control: (provided, state) => ({
    //               ...provided,
    //               minHeight: '44px',
    //               borderRadius: '8px',
    //               borderColor: state.isFocused ? '#6366f1' : '#d1d5db',
    //               boxShadow: state.isFocused ? '0 0 0 1px #6366f1' : 'none',
    //               '&:hover': {
    //                 borderColor: state.isFocused ? '#6366f1' : '#9ca3af'
    //               },
    //               padding: '2px 4px'
    //             }),
    //             option: (provided, state) => ({
    //               ...provided,
    //               fontSize: '14px',
    //               padding: '8px 12px',
    //               color: state.data.isComingSoon ? '#6b7280' : '#111827',
    //               backgroundColor: state.isSelected 
    //                 ? '#e0e7ff' 
    //                 : state.isFocused 
    //                   ? '#f3f4f6' 
    //                   : 'white',
    //               '&:active': {
    //                 backgroundColor: '#e0e7ff'
    //               },
    //               display: 'flex',
    //               alignItems: 'center'
    //             }),
    //             multiValue: (provided, state) => ({
    //               ...provided,
    //               backgroundColor: state.data.isComingSoon ? '#f3f4f6' : '#e0e7ff',
    //               borderRadius: '6px',
    //               border: state.data.isComingSoon ? '1px dashed #d1d5db' : 'none'
    //             }),
    //             multiValueLabel: (provided, state) => ({
    //               ...provided,
    //               color: state.data.isComingSoon ? '#6b7280' : '#4338ca',
    //               fontWeight: '500',
    //               padding: '4px 6px'
    //             }),
    //             multiValueRemove: (provided, state) => ({
    //               ...provided,
    //               color: state.data.isComingSoon ? '#9ca3af' : '#818cf8',
    //               ':hover': {
    //                 backgroundColor: state.data.isComingSoon ? '#e5e7eb' : '#c7d2fe',
    //                 color: state.data.isComingSoon ? '#6b7280' : '#6366f1'
    //               }
    //             }),
    //             groupHeading: (provided) => ({
    //               ...provided,
    //               fontSize: '13px',
    //               fontWeight: '600',
    //               color: '#374151',
    //               backgroundColor: '#f9fafb',
    //               padding: '8px 12px',
    //               borderBottom: '1px solid #e5e7eb',
    //               marginBottom: '4px'
    //             }),
    //             menu: (provided) => ({
    //               ...provided,
    //               borderRadius: '8px',
    //               border: '1px solid #e5e7eb',
    //               boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
    //             }),
    //             placeholder: (provided) => ({
    //               ...provided,
    //               color: '#9ca3af',
    //               fontSize: '14px'
    //             })
    //           }}
    //           formatGroupLabel={(group) => (
    //             <div className="flex items-center justify-between">
    //               <span>{group.label.replace(" (Coming Soon)", "")}</span>
    //               {group.label.includes("Coming Soon") && (
    //                 <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
    //                   Coming Soon
    //                 </span>
    //               )}
    //             </div>
    //           )}
    //           formatOptionLabel={(option) => (
    //             <div className="flex items-center">
    //               {option.isComingSoon && (
    //                 <span className="mr-2 text-gray-400">
    //                   <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    //                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    //                   </svg>
    //                 </span>
    //               )}
    //               <span className={option.isComingSoon ? 'text-gray-500' : 'text-gray-900'}>
    //                 {option.label}
    //               </span>
    //             </div>
    //           )}
    //           closeMenuOnSelect={false}
    //           hideSelectedOptions={false}
    //           placeholder={
    //             <div className="flex items-center text-gray-400">
    //               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    //                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    //               </svg>
    //               Select security services...
    //             </div>
    //           }
    //           noOptionsMessage={() => "No roles found"}
    //           components={{
    //             IndicatorSeparator: () => null,
    //             DropdownIndicator: () => (
    //               <div className="pr-2">
    //                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    //                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    //                 </svg>
    //               </div>
    //             )
    //           }}
    //         />
    //         {formData.selectedRoles.length > 0 && (
    //           <p className="mt-2 text-xs text-gray-500">
    //             Selected: {formData.selectedRoles.length} service(s)
    //           </p>
    //         )}
    //       </div>
          
    //       <div>
    //         <label className="block text-sm font-medium text-gray-700 mb-1">Other Services:</label>
    //         <input
    //           type="text"
    //           value={formData.otherService}
    //           onChange={(e) => handleInputChange('otherService', e.target.value)}
    //           className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3 border"
    //           placeholder="Enter any additional service"
    //         />
    //       </div>

    //       <div className="flex items-center space-x-3">
    //         <input
    //           type="checkbox"
    //           name="premiumService"
    //           checked={formData.premiumService}
    //           onChange={handleChange}
    //           className="w-4 h-4"
    //         />
    //         <label>Interested in premium service package for enhanced visibility?</label>
    //       </div>

    //       <div className="flex items-center space-x-3">
    //         <input
    //           type="checkbox"
    //           name="acceptTerms"
    //           checked={formData.acceptTerms}
    //           onChange={handleChange}
    //           required
    //           className={`w-4 h-4 ${(showAllErrors && formErrors.acceptTerms) ? "border-red-500" : ""}`}
    //         />
    //         <span>
    //           Agree to <a href="/legal/terms" target="_blank" rel="noopener noreferrer" className="underline">Terms & Conditions</a>
    //         </span>
    //         {(showAllErrors && formErrors.acceptTerms) && (
    //           <p className="mt-1 text-xs text-red-500">{formErrors.acceptTerms}</p>
    //         )}
    //       </div>

    //       <button 
    //         type="submit" 
    //         className={`w-full py-3 text-white font-bold rounded-md transition-colors ${
    //           isFormValid ? "bg-black hover:bg-gray-800" : "bg-gray-400 cursor-not-allowed"
    //         }`}
    //         disabled={!isFormValid}
    //       >
    //         <FaCheck className="inline mr-2" /> Submit
    //       </button>
    //     </form>
    //   </div>
    // </>
//   );
// };

// export default SecurityCompanyForm;











// "use client";

// import { useState, useEffect, useRef } from "react";
// import { FaBuilding, FaCheck, FaClipboardList, FaEnvelope, FaGlobe, FaIndustry, FaMapMarkerAlt, FaPhone, FaUserTie } from "react-icons/fa";
// import { LockIcon } from "lucide-react";
// import { IoMdEye, IoMdEyeOff } from "react-icons/io";
// import Select from "react-select";
// // import MembershipDialog from "./MembershipDialog";
// import TextField from '@mui/material/TextField';
// import companiesList from "@/sections/data/secuirty_services.json";
// import providersList from "@/sections/data/training_providers.json";
// import toast from "react-hot-toast";
// import { parsePhoneNumberFromString } from 'libphonenumber-js';

// interface ClientGeneralFormProps {
//   id: number;
//   title: string;
//   onSubmit: (data: any) => void;
// }

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

// interface FormData {
//   companyName: string;
//   registrationNumber: string;
//   address: string;
//   postcode: string;
//   industryType: string;
//   contactPerson: string;
//   password: string;
//   jobTitle: string;
//   email: string;
//   phone: string;
//   website: string;
//   selectedRoles: RoleSelection[];
//   otherService: string;
//   premiumService: boolean;
//   securityChallenges: string;
//   receiveEmails: boolean;
//   acceptTerms: boolean;
//   dateOfBirth: { day: string; month: string; year: string };
// }

// const SecurityCompanyForm: React.FC<ClientGeneralFormProps> = ({ id, title, onSubmit }) => {
//   const [passwordVisible, setPasswordVisible] = useState(false);
//   const [passwordValidations, setPasswordValidations] = useState({
//     length: false,
//     hasUpper: false,
//     hasLower: false,
//     hasNumber: false,
//     hasSpecial: false,
//     isValid: false
//   });
//   const [phoneNumberInfo, setPhoneNumberInfo] = useState<{
//     isValid: boolean;
//     country?: string;
//     formatInternational?: string;
//     error?: string;
//   }>({ isValid: false });
//   const [formErrors, setFormErrors] = useState<Record<string, string>>({});
//   const [isFormValid, setIsFormValid] = useState(false);
//   const [showAllErrors, setShowAllErrors] = useState(false);
//   // const [showMembershipDialog, setShowMembershipDialog] = useState(false);
//   const [formSubmissionData, setFormSubmissionData] = useState<any>(null);
//   const formRef = useRef<HTMLFormElement>(null);

//   const [formData, setFormData] = useState<FormData>({
//     companyName: "",
//     registrationNumber: "",
//     address: "",
//     postcode: "",
//     industryType: "",
//     contactPerson: "",
//     password: "",
//     jobTitle: "",
//     email: "",
//     phone: "",
//     website: "",
//     selectedRoles: [],
//     otherService: "",
//     premiumService: false,
//     securityChallenges: "",
//     receiveEmails: false,
//     acceptTerms: false,
//     dateOfBirth: { day: "", month: "", year: "" },
//   });

//   // Validate entire form whenever form data changes
//   useEffect(() => {
//     const isValid = validateForm();
//     setIsFormValid(isValid);
//   }, [formData, passwordValidations]);

//   const validateEmail = (email: string) => {
//     const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     return re.test(email);
//   };

//   const validatePassword = (password: string) => {
//     const validations = {
//       length: password.length >= 8,
//       hasUpper: /[A-Z]/.test(password),
//       hasLower: /[a-z]/.test(password),
//       hasNumber: /\d/.test(password),
//       hasSpecial: /[.\-_!@#$%^*]/.test(password),
//       isValid: false
//     };
//     validations.isValid = Object.values(validations).slice(0, 5).every(Boolean);
//     return validations;
//   };
//   const validatePhoneNumber = (phone: string) => {
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
//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
//     const { name, value, type, checked } = e.target as HTMLInputElement;

//     setFormErrors(prev => ({ ...prev, [name]: "" }));

//     if (["day", "month", "year"].includes(name)) {
//       setFormData({
//         ...formData,
//         dateOfBirth: { ...formData.dateOfBirth, [name]: value },
//       });
//     } else if (type === "checkbox") {
//       setFormData({
//         ...formData,
//         [name]: checked,
//       });
//     } else {
//       setFormData({ ...formData, [name]: value });

//       if (name === "password") {
//         setPasswordValidations(validatePassword(value));
//       }
//     }
//   };

//   const handleInputChange = <K extends keyof FormData>(field: K, value: FormData[K]) => {
//     setFormData(prev => ({
//       ...prev,
//       [field]: value
//     }));
//   };

//   const handleRoleSelection = (selectedOptions: any) => {
//     const selectedItems = selectedOptions.map((option: any) => ({
//       title: option.group,  // Store the group title
//       role: option.value    // Store the role value
//     }));
//     handleInputChange('selectedRoles', selectedItems);
//   };

//   const validateForm = () => {
//     const errors: Record<string, string> = {};
//     let isValid = true;

//     // Email validation
//     if (!formData.email.trim()) {
//       errors.email = "Email is required";
//       isValid = false;
//     } else if (!validateEmail(formData.email)) {
//       errors.email = "Please enter a valid email";
//       isValid = false;
//     }
//     if (!formData.phone.trim()) {
//       errors.phone = "Phone number is required";
//       isValid = false;
//     } else if (!phoneNumberInfo.isValid) {
//       errors.phone = phoneNumberInfo.error || "Invalid phone number";
//       isValid = false;
//     }

//     // Password validation
//     if (!formData.password.trim()) {
//       errors.password = "Password is required";
//       isValid = false;
//     } else if (!passwordValidations.isValid) {
//       errors.password = "Password doesn't meet requirements";
//       isValid = false;
//     }

//     // Company validation
//     if (!formData.companyName.trim()) {
//       errors.companyName = "Company name is required";
//       isValid = false;
//     }

//     // Address validation
//     if (!formData.address.trim()) {
//       errors.address = "Address is required";
//       isValid = false;
//     }

//     // Contact person validation
//     if (!formData.contactPerson.trim()) {
//       errors.contactPerson = "Contact person is required";
//       isValid = false;
//     }

//     // Terms validation
//     if (!formData.acceptTerms) {
//       errors.acceptTerms = "You must accept the terms and conditions";
//       isValid = false;
//     }

//     setFormErrors(errors);
//     return isValid && Object.keys(errors).length === 0;
//   };

//   // Transform professional data for select component
//   const roleOptions: RoleOption[] = (
//     id === 5 ? companiesList : id === 6 ? providersList : []
//   ).flatMap(category =>
//     category.roles.map(role => ({
//       label: role,
//       value: role,
//       group: category.title.replace(" (Coming Soon)", ""),
//       isComingSoon: category.title.includes("Coming Soon")
//     }))
//   );

//   const groupedOptions = roleOptions.reduce((acc, option) => {
//     if (!acc[option.group]) {
//       acc[option.group] = [];
//     }
//     acc[option.group].push(option);
//     return acc;
//   }, {} as Record<string, typeof roleOptions>);

//   const selectStyles = {
//     option: (provided: any, state: any) => ({
//       ...provided,
//       color: state.data.isComingSoon ? '#9CA3AF' : provided.color,
//       cursor: state.data.isComingSoon ? 'not-allowed' : provided.cursor,
//       backgroundColor: state.isSelected ? '#E5E7EB' : provided.backgroundColor,
//       '&:hover': {
//         backgroundColor: state.data.isComingSoon ? provided.backgroundColor : '#F3F4F6'
//       }
//     }),
//     multiValueLabel: (provided: any, state: any) => ({
//       ...provided,
//       textDecoration: 'none',
//       color: state.data.isComingSoon ? '#9CA3AF' : provided.color
//     }),
//     multiValue: (provided: any, state: any) => ({
//       ...provided,
//       backgroundColor: state.data.isComingSoon ? '#F3F4F6' : '#E5E7EB'
//     })
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     const isValid = validateForm();
//     setIsFormValid(isValid);

//     if (!isValid) {
//       setShowAllErrors(true);
//       setTimeout(() => {
//         const firstError = document.querySelector('.border-red-500');
//         if (firstError) {
//           firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
//         }
//       }, 100);
//       return;
//     }
//   try {
//     const postcodeResponse = await fetch(`https://api.postcodes.io/postcodes/${formData.postcode.trim()}`);
//     const postcodeData = await postcodeResponse.json();

//     if (!postcodeData.result || postcodeData.status !== 200) {
//       toast.error("Invalid UK postcode. Please enter a valid one.");
//       const postcodeInput = document.querySelector('input[name="postcode"]');
//       if (postcodeInput) {
//         postcodeInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
//       }
//       return;
//     }
//   } catch (error) {
//     console.error("Postcode validation failed:", error);
//     alert("Failed to validate postcode. Please try again later.");
//     return;
//   }
//     // Get unique titles from selected roles
//     const serviceRequirements = Array.from(
//       new Set(formData.selectedRoles.map(item => item.title))
//     );

//     // Get all roles and include other services if provided
//     const securityServicesOfferings = [
//       ...formData.selectedRoles.map(item => item.role),
//       ...(formData.otherService ? [formData.otherService.trim()] : [])
//     ];

//     const formattedData = {
//       email: formData.email,
//       password: formData.password,
//       firstName: formData.companyName.split(" ")[0],
//       lastName: formData.companyName.split(" ")[1] || "",
//       address: formData.address,
//       phoneNumber: formData.phone,
//       companyData: {
//         companyName: formData.companyName,
//         registrationNumber: formData.registrationNumber,
//         address: formData.address,
//         postCode: formData.postcode,
//         contactPerson: formData.contactPerson,
//         jobTitle: formData.jobTitle,
//         phoneNumber: formData.phone,
//         website: formData.website,
//       },
//       serviceRequirements, // Now contains only unique titles
//       securityServicesOfferings, // Contains all roles + other services
//       permissions: {
//         premiumServiceNeed: formData.premiumService,
//         acceptEmails: formData.receiveEmails,
//         acceptTerms: formData.acceptTerms,
//       },
//       roleId: Number(id),
//     };

//     setFormSubmissionData(formattedData);
//     onSubmit(formattedData);
//     // setShowMembershipDialog(true);
//   };
//   const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { value } = e.target;
//     setFormData(prev => ({ ...prev, phone: value }));
    
//     // Clear previous errors - fix the type issue here
//     setFormErrors(prev => ({ ...prev, phoneNumber: "" }));
    
//     if (value) {
//       const validation = validatePhoneNumber(value);
//       setPhoneNumberInfo(validation);
      
//       if (!validation.isValid) {
//         setFormErrors(prev => ({ 
//           ...prev, 
//           phoneNumber: validation.error || "Invalid phone number" 
//         }));
//       }
//     } else {
//       setPhoneNumberInfo({ isValid: false });
//     }
//   };
//   const handlePlanSelected = (plan: string) => {
//     const finalData = {
//       ...formSubmissionData,
//       membershipPlan: plan
//     };
//     // setShowMembershipDialog(false);
//     onSubmit(finalData);
//   };

//   const handleDialogClose = () => {
//     const finalData = {
//       ...formSubmissionData,
//       membershipPlan: 'basic'
//     };
//     // setShowMembershipDialog(false);
//     onSubmit(finalData);
//   };

//   return (
//     <>
//       <div className="max-w-4xl mx-auto bg-white shadow-lg p-8 rounded-md text-black">
//         <h1 className="text-center text-3xl font-bold my-6">{title} Registration</h1>

//         <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
//           {/* Company Name & Registration Number */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div className="relative flex items-center">
//               <FaBuilding className="absolute left-3 text-gray-700" />
//               <TextField
//                 type="text" 
//                 name="companyName" 
//                 label="Company Name"
//                 value={formData.companyName} 
//                 onChange={handleChange}
//                 id="outlined-basic"
//                 variant="outlined"
//                 className={`w-full pl-10 pr-3 py-2 border rounded-md bg-gray-100 focus:ring-2 focus:ring-black ${
//                   showAllErrors && formErrors.email ? "border-red-500" : "border-gray-300"
//                 } focus:border-black`} // Ensuring black border on focus
//                 InputLabelProps={{
//                   style: { color: 'gray' }, // Default label color
//                 }}
//                 inputProps={{
//                   className: "focus:outline-none" // Optional to remove outline when focused
//                 }}
//                 sx={{
//                   "& .MuiOutlinedInput-root": {
//                     "& fieldset": {
//                       borderColor: showAllErrors && formErrors.email ? "red" : "gray", // Border color for normal state
//                     },
//                     "&.Mui-focused fieldset": {
//                       borderColor: "black", // Black border when focused
//                     },
//                   },
//                   "& .MuiInputLabel-root": {
//                     color: "gray", // Default label color
//                   },
//                   "& .Mui-focused .MuiInputLabel-root": {
//                     color: "black", // Label color when focused
//                   },
//                 }}
//                 // className={`w-full pl-10 pr-3 py-3 border rounded-md bg-gray-100 focus-within:ring-2 focus-within:ring-black ${
//                 //   (showAllErrors && formErrors.companyName) ? "border-red-500" : "border-gray-500"
//                 // }`}
//                 required
//               />
//               {(showAllErrors && formErrors.companyName) && (
//                 <p className="mt-1 text-xs text-red-500">{formErrors.companyName}</p>
//               )}
//             </div>
//             <TextField
//               type="text" 
//               name="registrationNumber" 
//               label="Registration Number"
//               value={formData.registrationNumber} 
//               onChange={handleChange}
//               id="outlined-basic"
//                 variant="outlined"
//                 className={`w-full pl-10 pr-3 py-2 border rounded-md bg-gray-100 focus:ring-2 focus:ring-black ${
//                   showAllErrors && formErrors.email ? "border-red-500" : "border-gray-300"
//                 } focus:border-black`} // Ensuring black border on focus
//                 InputLabelProps={{
//                   style: { color: 'gray' }, // Default label color
//                 }}
//                 inputProps={{
//                   className: "focus:outline-none" // Optional to remove outline when focused
//                 }}
//                 sx={{
//                   "& .MuiOutlinedInput-root": {
//                     "& fieldset": {
//                       borderColor: showAllErrors && formErrors.email ? "red" : "gray", // Border color for normal state
//                     },
//                     "&.Mui-focused fieldset": {
//                       borderColor: "black", // Black border when focused
//                     },
//                   },
//                   "& .MuiInputLabel-root": {
//                     color: "gray", // Default label color
//                   },
//                   "& .Mui-focused .MuiInputLabel-root": {
//                     color: "black", // Label color when focused
//                   },
//                 }}
//               // className="w-full pl-3 pr-3 py-3 border border-gray-500 rounded-md bg-gray-100 focus-within:ring-2 focus-within:ring-black"
//             />
//           </div>

//           {/* Password */}
//           <div className="relative">
//             <LockIcon className="absolute left-3 top-3 text-gray-500" />
//             <TextField
//               type={passwordVisible ? "text" : "password"}
//               name="password"
//               value={formData.password}
//               onChange={handleChange}
//               required
//               label="Password"
//               id="outlined-basic"
//                 variant="outlined"
//                 className={`w-full pl-10 pr-3 py-2 border rounded-md bg-gray-100 focus:ring-2 focus:ring-black ${
//                   showAllErrors && formErrors.email ? "border-red-500" : "border-gray-300"
//                 } focus:border-black`} // Ensuring black border on focus
//                 InputLabelProps={{
//                   style: { color: 'gray' }, // Default label color
//                 }}
//                 inputProps={{
//                   className: "focus:outline-none" // Optional to remove outline when focused
//                 }}
//                 sx={{
//                   "& .MuiOutlinedInput-root": {
//                     "& fieldset": {
//                       borderColor: showAllErrors && formErrors.email ? "red" : "gray", // Border color for normal state
//                     },
//                     "&.Mui-focused fieldset": {
//                       borderColor: "black", // Black border when focused
//                     },
//                   },
//                   "& .MuiInputLabel-root": {
//                     color: "gray", // Default label color
//                   },
//                   "& .Mui-focused .MuiInputLabel-root": {
//                     color: "black", // Label color when focused
//                   },
//                 }}

//             />
//             <button
//                               type="button"
//                               className="absolute right-3 top-4 text-gray-500"
//                               onClick={() => setPasswordVisible(!passwordVisible)}
//                             >
//                               {passwordVisible ? <IoMdEyeOff className="w-6 h-6" /> : <IoMdEye className="w-6 h-6"/>}
//                             </button>
            
//             {(formData.password || showAllErrors) && (
//               <div className="mt-2 text-xs space-y-1">
//                 {(!passwordValidations.length || showAllErrors) && (
//                   <p className={passwordValidations.length ? "text-green-500" : "text-red-500"}>
//                     {passwordValidations.length ? "✓" : "✗"} At least 8 characters
//                   </p>
//                 )}
//                 {(!passwordValidations.hasUpper || showAllErrors) && (
//                   <p className={passwordValidations.hasUpper ? "text-green-500" : "text-red-500"}>
//                     {passwordValidations.hasUpper ? "✓" : "✗"} At least one capital letter
//                   </p>
//                 )}
//                 {(!passwordValidations.hasLower || showAllErrors) && (
//                   <p className={passwordValidations.hasLower ? "text-green-500" : "text-red-500"}>
//                     {passwordValidations.hasLower ? "✓" : "✗"} At least one small letter
//                   </p>
//                 )}
//                 {(!passwordValidations.hasNumber || showAllErrors) && (
//                   <p className={passwordValidations.hasNumber ? "text-green-500" : "text-red-500"}>
//                     {passwordValidations.hasNumber ? "✓" : "✗"} At least one number
//                   </p>
//                 )}
//                 {(!passwordValidations.hasSpecial || showAllErrors) && (
//                   <p className={passwordValidations.hasSpecial ? "text-green-500" : "text-red-500"}>
//                     {passwordValidations.hasSpecial ? "✓" : "✗"} At least one special character (. - _ ! @ # $ % ^ *)
//                   </p>
//                 )}
//               </div>
//             )}
//             {(showAllErrors && formErrors.password) && (
//               <p className="mt-1 text-xs text-red-500">{formErrors.password}</p>
//             )}
//           </div>

//           {/* Address & Postcode */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div className="relative flex items-center">
//               <FaMapMarkerAlt className="absolute left-3 text-gray-700" />
//               <TextField
//                 type="text" 
//                 name="address" 
//                 label="Business Address"
//                 value={formData.address} 
//                 onChange={handleChange}
//                 id="outlined-basic"
//                 variant="outlined"
//                 className={`w-full pl-10 pr-3 py-2 border rounded-md bg-gray-100 focus:ring-2 focus:ring-black ${
//                   showAllErrors && formErrors.email ? "border-red-500" : "border-gray-300"
//                 } focus:border-black`} // Ensuring black border on focus
//                 InputLabelProps={{
//                   style: { color: 'gray' }, // Default label color
//                 }}
//                 inputProps={{
//                   className: "focus:outline-none" // Optional to remove outline when focused
//                 }}
//                 sx={{
//                   "& .MuiOutlinedInput-root": {
//                     "& fieldset": {
//                       borderColor: showAllErrors && formErrors.email ? "red" : "gray", // Border color for normal state
//                     },
//                     "&.Mui-focused fieldset": {
//                       borderColor: "black", // Black border when focused
//                     },
//                   },
//                   "& .MuiInputLabel-root": {
//                     color: "gray", // Default label color
//                   },
//                   "& .Mui-focused .MuiInputLabel-root": {
//                     color: "black", // Label color when focused
//                   },
//                 }}
//                 // className={`w-full pl-10 pr-3 py-3 border rounded-md bg-gray-100 focus-within:ring-2 focus-within:ring-black ${
//                 //   (showAllErrors && formErrors.address) ? "border-red-500" : "border-gray-500"
//                 // }`}
//                 required
//               />
//               {(showAllErrors && formErrors.address) && (
//                 <p className="mt-1 text-xs text-red-500">{formErrors.address}</p>
//               )}
//             </div>
//             <TextField
//               type="text" 
//               name="postcode" 
//               label="Post Code"
//               value={formData.postcode} 
//               onChange={handleChange}
//               id="outlined-basic"
//                 variant="outlined"
//                 className={`w-full pl-10 pr-3 py-2 border rounded-md bg-gray-100 focus:ring-2 focus:ring-black ${
//                   showAllErrors && formErrors.email ? "border-red-500" : "border-gray-300"
//                 } focus:border-black`} // Ensuring black border on focus
//                 InputLabelProps={{
//                   style: { color: 'gray' }, // Default label color
//                 }}
//                 inputProps={{
//                   className: "focus:outline-none" // Optional to remove outline when focused
//                 }}
//                 sx={{
//                   "& .MuiOutlinedInput-root": {
//                     "& fieldset": {
//                       borderColor: showAllErrors && formErrors.email ? "red" : "gray", // Border color for normal state
//                     },
//                     "&.Mui-focused fieldset": {
//                       borderColor: "black", // Black border when focused
//                     },
//                   },
//                   "& .MuiInputLabel-root": {
//                     color: "gray", // Default label color
//                   },
//                   "& .Mui-focused .MuiInputLabel-root": {
//                     color: "black", // Label color when focused
//                   },
//                 }}
//               // className="w-full pl-3 pr-3 py-3 border border-gray-500 rounded-md bg-gray-100 focus-within:ring-2 focus-within:ring-black"
//               required
//             />
//           </div>

//           {/* Industry Type */}
//           <div className="relative flex items-center">
//             <FaIndustry className="absolute left-3 text-gray-700" />
//             <TextField
//               type="text" 
//               name="industryType" 
//               label="Industry Type"
//               value={formData.industryType} 
//               onChange={handleChange}
//               id="outlined-basic"
//                 variant="outlined"
//                 className={`w-full pl-10 pr-3 py-2 border rounded-md bg-gray-100 focus:ring-2 focus:ring-black ${
//                   showAllErrors && formErrors.email ? "border-red-500" : "border-gray-300"
//                 } focus:border-black`} // Ensuring black border on focus
//                 InputLabelProps={{
//                   style: { color: 'gray' }, // Default label color
//                 }}
//                 inputProps={{
//                   className: "focus:outline-none" // Optional to remove outline when focused
//                 }}
//                 sx={{
//                   "& .MuiOutlinedInput-root": {
//                     "& fieldset": {
//                       borderColor: showAllErrors && formErrors.email ? "red" : "gray", // Border color for normal state
//                     },
//                     "&.Mui-focused fieldset": {
//                       borderColor: "black", // Black border when focused
//                     },
//                   },
//                   "& .MuiInputLabel-root": {
//                     color: "gray", // Default label color
//                   },
//                   "& .Mui-focused .MuiInputLabel-root": {
//                     color: "black", // Label color when focused
//                   },
//                 }}
//               // className="w-full pl-10 pr-3 py-3 border border-gray-500 rounded-md bg-gray-100 focus-within:ring-2 focus-within:ring-black"
//               required
//             />
//           </div>

//           {/* Contact Person & Job Title */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div className="relative flex items-center">
//               <FaUserTie className="absolute left-3 text-gray-700" />
//               <TextField
//                 type="text" 
//                 name="contactPerson" 
//                 label="Contact Person"
//                 value={formData.contactPerson} 
//                 onChange={handleChange}
//                 id="outlined-basic"
//                 variant="outlined"
//                 className={`w-full pl-10 pr-3 py-2 border rounded-md bg-gray-100 focus:ring-2 focus:ring-black ${
//                   showAllErrors && formErrors.email ? "border-red-500" : "border-gray-300"
//                 } focus:border-black`} // Ensuring black border on focus
//                 InputLabelProps={{
//                   style: { color: 'gray' }, // Default label color
//                 }}
//                 inputProps={{
//                   className: "focus:outline-none" // Optional to remove outline when focused
//                 }}
//                 sx={{
//                   "& .MuiOutlinedInput-root": {
//                     "& fieldset": {
//                       borderColor: showAllErrors && formErrors.email ? "red" : "gray", // Border color for normal state
//                     },
//                     "&.Mui-focused fieldset": {
//                       borderColor: "black", // Black border when focused
//                     },
//                   },
//                   "& .MuiInputLabel-root": {
//                     color: "gray", // Default label color
//                   },
//                   "& .Mui-focused .MuiInputLabel-root": {
//                     color: "black", // Label color when focused
//                   },
//                 }}
//                 // className={`w-full pl-10 pr-3 py-3 border rounded-md bg-gray-100 focus-within:ring-2 focus-within:ring-black ${
//                 //   (showAllErrors && formErrors.contactPerson) ? "border-red-500" : "border-gray-500"
//                 // }`}
//                 required
//               />
//               {(showAllErrors && formErrors.contactPerson) && (
//                 <p className="mt-1 text-xs text-red-500">{formErrors.contactPerson}</p>
//               )}
//             </div>
//             <TextField
//               type="text" 
//               name="jobTitle" 
//               label="Job Title"
//               value={formData.jobTitle} 
//               onChange={handleChange}
//               id="outlined-basic"
//                 variant="outlined"
//                 className={`w-full pl-10 pr-3 py-2 border rounded-md bg-gray-100 focus:ring-2 focus:ring-black ${
//                   showAllErrors && formErrors.email ? "border-red-500" : "border-gray-300"
//                 } focus:border-black`} // Ensuring black border on focus
//                 InputLabelProps={{
//                   style: { color: 'gray' }, // Default label color
//                 }}
//                 inputProps={{
//                   className: "focus:outline-none" // Optional to remove outline when focused
//                 }}
//                 sx={{
//                   "& .MuiOutlinedInput-root": {
//                     "& fieldset": {
//                       borderColor: showAllErrors && formErrors.email ? "red" : "gray", // Border color for normal state
//                     },
//                     "&.Mui-focused fieldset": {
//                       borderColor: "black", // Black border when focused
//                     },
//                   },
//                   "& .MuiInputLabel-root": {
//                     color: "gray", // Default label color
//                   },
//                   "& .Mui-focused .MuiInputLabel-root": {
//                     color: "black", // Label color when focused
//                   },
//                 }}
//               // className="w-full pl-3 pr-3 py-3 border border-gray-500 rounded-md bg-gray-100 focus-within:ring-2 focus-within:ring-black"
//               required
//             />
//           </div>

//           {/* Email */}
//           <div className="relative flex items-center">
//             <FaEnvelope className="absolute left-3 text-gray-700" />
//             <TextField
//               type="email" 
//               name="email" 
//               label="Email Address"
//               value={formData.email} 
//               onChange={handleChange}
//               id="outlined-basic"
//                 variant="outlined"
//                 className={`w-full pl-10 pr-3 py-2 border rounded-md bg-gray-100 focus:ring-2 focus:ring-black ${
//                   showAllErrors && formErrors.email ? "border-red-500" : "border-gray-300"
//                 } focus:border-black`} // Ensuring black border on focus
//                 InputLabelProps={{
//                   style: { color: 'gray' }, // Default label color
//                 }}
//                 inputProps={{
//                   className: "focus:outline-none" // Optional to remove outline when focused
//                 }}
//                 sx={{
//                   "& .MuiOutlinedInput-root": {
//                     "& fieldset": {
//                       borderColor: showAllErrors && formErrors.email ? "red" : "gray", // Border color for normal state
//                     },
//                     "&.Mui-focused fieldset": {
//                       borderColor: "black", // Black border when focused
//                     },
//                   },
//                   "& .MuiInputLabel-root": {
//                     color: "gray", // Default label color
//                   },
//                   "& .Mui-focused .MuiInputLabel-root": {
//                     color: "black", // Label color when focused
//                   },
//                 }}
//               // className={`w-full pl-10 pr-3 py-3 border rounded-md bg-gray-100 focus-within:ring-2 focus-within:ring-black ${
//               //   (showAllErrors && formErrors.email) ? "border-red-500" : "border-gray-500"
//               // }`}
//               required
//             />
//             {(showAllErrors && formErrors.email) && (
//               <p className="mt-1 text-xs text-red-500">{formErrors.email}</p>
//             )}
//           </div>

//           {/* Phone */}
//           <div className="relative flex items-center">
//         <FaPhone className="absolute left-3 top-3 text-gray-500" />
//         <TextField
//           type="text"
//           name="phoneNumber"
//           value={formData.phone}
//           onChange={handlePhoneNumberChange}
//           id="outlined-basic"
//           variant="outlined"
//           label="Phone Number"
//           className={`w-full pl-10 pr-3 py-2 border rounded-md bg-gray-100 focus:ring-2 focus:ring-black ${
//             showAllErrors && formErrors.phoneNumber ? "border-red-500" : "border-gray-300"
//           } focus:border-black`}
//           InputLabelProps={{
//             style: { color: 'gray' },
//           }}
//           inputProps={{
//             className: "focus:outline-none"
//           }}
//           sx={{
//             "& .MuiOutlinedInput-root": {
//               "& fieldset": {
//                 borderColor: showAllErrors && formErrors.phone ? "red" : "gray",
//               },
//               "&.Mui-focused fieldset": {
//                 borderColor: "black",
//               },
//             },
//             "& .MuiInputLabel-root": {
//               color: "gray",
//             },
//             "& .Mui-focused .MuiInputLabel-root": {
//               color: "black",
//             },
//           }}
//         />
//         {(formData.phone && phoneNumberInfo.country) && (
//           <div className="mt-1 text-xs text-gray-500">
//             Country: {phoneNumberInfo.country}
//             {phoneNumberInfo.formatInternational && (
//               <span className="ml-2">({phoneNumberInfo.formatInternational})</span>
//             )}
//           </div>
//         )}
//         {(showAllErrors && formErrors.phoner) && (
//           <p className="mt-1 text-xs text-red-500">{formErrors.phone}</p>
//         )}
//       </div>
         

//           {/* Website */}
//           <div className="relative flex items-center">
//             <FaGlobe className="absolute left-3 text-gray-700" />
//             <TextField
//               type="text" 
//               name="website" 
//               label="Website (if applicable)"
//               value={formData.website} 
//               onChange={handleChange}
//               id="outlined-basic"
//                 variant="outlined"
//                 className={`w-full pl-10 pr-3 py-2 border rounded-md bg-gray-100 focus:ring-2 focus:ring-black ${
//                   showAllErrors && formErrors.email ? "border-red-500" : "border-gray-300"
//                 } focus:border-black`} // Ensuring black border on focus
//                 InputLabelProps={{
//                   style: { color: 'gray' }, // Default label color
//                 }}
//                 inputProps={{
//                   className: "focus:outline-none" // Optional to remove outline when focused
//                 }}
//                 sx={{
//                   "& .MuiOutlinedInput-root": {
//                     "& fieldset": {
//                       borderColor: showAllErrors && formErrors.email ? "red" : "gray", // Border color for normal state
//                     },
//                     "&.Mui-focused fieldset": {
//                       borderColor: "black", // Black border when focused
//                     },
//                   },
//                   "& .MuiInputLabel-root": {
//                     color: "gray", // Default label color
//                   },
//                   "& .Mui-focused .MuiInputLabel-root": {
//                     color: "black", // Label color when focused
//                   },
//                 }}
//               // className="w-full pl-10 pr-3 py-3 border border-gray-500 rounded-md bg-gray-100 focus-within:ring-2 focus-within:ring-black"
//             />
//           </div>
//           <div className="mb-6">
//   <label className="block text-sm font-medium text-gray-700 mb-2">
//     Security Services* <span className="ml-1 text-xs text-gray-500">(Select multiple if applicable)</span>
//   </label>

//   <Select
//     isMulti
//     options={Object.entries(groupedOptions).map(([label, options]) => ({
//       label,
//       options
//     }))}
//     value={roleOptions.filter(option => 
//       formData.selectedRoles.some(item => item.role === option.value)
//     )}
//     onChange={handleRoleSelection}
//     className="react-select-container"
//     classNamePrefix="react-select"
//     styles={{
//       control: (provided, state) => ({
//         ...provided,
//         minHeight: '44px',
//         borderRadius: '8px',
//         borderColor: state.isFocused ? '#6366f1' : '#d1d5db',
//         boxShadow: state.isFocused ? '0 0 0 1px #6366f1' : 'none',
//         '&:hover': {
//           borderColor: state.isFocused ? '#6366f1' : '#9ca3af'
//         },
//         padding: '2px 4px'
//       }),
//       option: (provided, state) => ({
//         ...provided,
//         fontSize: '14px',
//         padding: '8px 12px',
//         color: state.data.isComingSoon ? '#6b7280' : '#111827',
//         backgroundColor: state.isSelected 
//           ? '#e0e7ff' 
//           : state.isFocused 
//             ? '#f3f4f6' 
//             : 'white',
//         '&:active': {
//           backgroundColor: '#e0e7ff'
//         },
//         display: 'flex',
//         alignItems: 'center'
//       }),
//       multiValue: (provided, state) => ({
//         ...provided,
//         backgroundColor: state.data.isComingSoon ? '#f3f4f6' : '#e0e7ff',
//         borderRadius: '6px',
//         border: state.data.isComingSoon ? '1px dashed #d1d5db' : 'none'
//       }),
//       multiValueLabel: (provided, state) => ({
//         ...provided,
//         color: state.data.isComingSoon ? '#6b7280' : '#4338ca',
//         fontWeight: '500',
//         padding: '4px 6px'
//       }),
//       multiValueRemove: (provided, state) => ({
//         ...provided,
//         color: state.data.isComingSoon ? '#9ca3af' : '#818cf8',
//         ':hover': {
//           backgroundColor: state.data.isComingSoon ? '#e5e7eb' : '#c7d2fe',
//           color: state.data.isComingSoon ? '#6b7280' : '#6366f1'
//         }
//       }),
//       groupHeading: (provided) => ({
//         ...provided,
//         fontSize: '13px',
//         fontWeight: '600',
//         color: '#374151',
//         backgroundColor: '#f9fafb',
//         padding: '8px 12px',
//         borderBottom: '1px solid #e5e7eb',
//         marginBottom: '4px'
//       }),
//       menu: (provided) => ({
//         ...provided,
//         borderRadius: '8px',
//         border: '1px solid #e5e7eb',
//         boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
//       }),
//       placeholder: (provided) => ({
//         ...provided,
//         color: '#9ca3af',
//         fontSize: '14px'
//       })
//     }}
//     formatGroupLabel={(group) => (
//       <div className="flex items-center justify-between">
//         <span>{group.label.replace(" (Coming Soon)", "")}</span>
//         {group.label.includes("Coming Soon") && (
//           <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
//             Coming Soon
//           </span>
//         )}
//       </div>
//     )}
//     formatOptionLabel={(option) => (
//       <div className="flex items-center">
//         {option.isComingSoon && (
//           <span className="mr-2 text-gray-400">
//             <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
//             </svg>
//           </span>
//         )}
//         <span className={option.isComingSoon ? 'text-gray-500' : 'text-gray-900'}>
//           {option.label}
//         </span>
//       </div>
//     )}
//     closeMenuOnSelect={false}
//     hideSelectedOptions={false}
//     placeholder={
//       <div className="flex items-center text-gray-400">
//         <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
//         </svg>
//         Select security services...
//       </div>
//     }
//     noOptionsMessage={() => "No roles found"}
//     components={{
//       IndicatorSeparator: () => null,
//       DropdownIndicator: () => (
//         <div className="pr-2">
//           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
//           </svg>
//         </div>
//       )
//     }}
//   />

//   {formData.selectedRoles.length > 0 && (
//     <p className="mt-2 text-xs text-gray-500">
//       Selected: {formData.selectedRoles.length} service(s)
//     </p>
//   )}
// </div>
  
// {/* Other Services */}
// <div>
//   <label className="block text-sm font-medium text-gray-700 mb-1">Other Services:</label>
//   <input
//     type="text"
//     value={formData.otherService}
//     onChange={(e) => handleInputChange('otherService', e.target.value)}
//     className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3 border"
//     placeholder="Enter any additional service"
//   />
// </div>

//           {/* Premium Service */}
//           <div className="flex items-center space-x-3">
//             <input
//               type="checkbox"
//               name="premiumService"
//               checked={formData.premiumService}
//               onChange={handleChange}
//               className="w-4 h-4"
//             />
//             <label>Interested in premium service package for enhanced visibility?</label>
//           </div>

//           {/* Terms and Conditions */}
//           <div className="flex items-center space-x-3">
//             <input
//               type="checkbox"
//               name="acceptTerms"
//               checked={formData.acceptTerms}
//               onChange={handleChange}
//               required
//               className={`w-4 h-4 ${(showAllErrors && formErrors.acceptTerms) ? "border-red-500" : ""}`}
//             />
//             <span>
//               Agree to <a href="/legal/terms" target="_blank" rel="noopener noreferrer" className="underline">Terms & Conditions</a>
//             </span>
//             {(showAllErrors && formErrors.acceptTerms) && (
//               <p className="mt-1 text-xs text-red-500">{formErrors.acceptTerms}</p>
//             )}
//           </div>

//           {/* Submit Button */}
//           <button 
//             type="submit" 
//             className={`w-full py-3 text-white font-bold rounded-md transition-colors ${
//               isFormValid ? "bg-black hover:bg-gray-800" : "bg-gray-400 cursor-not-allowed"
//             }`}
//             disabled={!isFormValid}
//           >
//             <FaCheck className="inline mr-2" /> Submit
//           </button>
//         </form>
       
//       </div>
//     </>
//   );
// };

// export default SecurityCompanyForm;










 {/* <MembershipDialog 
        isOpen={showMembershipDialog}
        onClose={handleDialogClose}
        onPlanSelected={handlePlanSelected}
      /> */}
 {/* <div className="relative flex items-center">
            <FaPhone className="absolute left-3 text-gray-700" />
            <TextField
              type="text" 
              name="phone" 
              label="Phone Number"
              value={formData.phone} 
              onChange={handleChange}
              id="outlined-basic"
                variant="outlined"
                className={`w-full pl-10 pr-3 py-2 border rounded-md bg-gray-100 focus:ring-2 focus:ring-black ${
                  showAllErrors && formErrors.email ? "border-red-500" : "border-gray-300"
                } focus:border-black`} // Ensuring black border on focus
                InputLabelProps={{
                  style: { color: 'gray' }, // Default label color
                }}
                inputProps={{
                  className: "focus:outline-none" // Optional to remove outline when focused
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: showAllErrors && formErrors.email ? "red" : "gray", // Border color for normal state
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "black", // Black border when focused
                    },
                  },
                  "& .MuiInputLabel-root": {
                    color: "gray", // Default label color
                  },
                  "& .Mui-focused .MuiInputLabel-root": {
                    color: "black", // Label color when focused
                  },
                }}
              // className="w-full pl-10 pr-3 py-3 border border-gray-500 rounded-md bg-gray-100 focus-within:ring-2 focus-within:ring-black"
              required
            />
          </div> */}
    {/* <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Security Services*
            <span className="ml-1 text-xs text-gray-500">(Select multiple if applicable)</span>
          </label>

          <Select
            isMulti
            options={Object.entries(groupedOptions).map(([label, options]) => ({
              label,
              options
            }))}
            value={roleOptions.filter(option => 
              formData.selectedRoles.includes(option.value)
            )}
            onChange={handleRoleSelection}
            className="react-select-container"
            classNamePrefix="react-select"
            styles={{
              control: (provided, state) => ({
                ...provided,
                minHeight: '44px',
                borderRadius: '8px',
                borderColor: state.isFocused ? '#6366f1' : '#d1d5db',
                boxShadow: state.isFocused ? '0 0 0 1px #6366f1' : 'none',
                '&:hover': {
                  borderColor: state.isFocused ? '#6366f1' : '#9ca3af'
                },
                padding: '2px 4px'
              }),
              option: (provided, state) => ({
                ...provided,
                fontSize: '14px',
                padding: '8px 12px',
                color: state.data.isComingSoon ? '#6b7280' : '#111827',
                backgroundColor: state.isSelected 
                  ? '#e0e7ff' 
                  : state.isFocused 
                    ? '#f3f4f6' 
                    : 'white',
                '&:active': {
                  backgroundColor: '#e0e7ff'
                },
                display: 'flex',
                alignItems: 'center'
              }),
              multiValue: (provided, state) => ({
                ...provided,
                backgroundColor: state.data.isComingSoon ? '#f3f4f6' : '#e0e7ff',
                borderRadius: '6px',
                border: state.data.isComingSoon ? '1px dashed #d1d5db' : 'none'
              }),
              multiValueLabel: (provided, state) => ({
                ...provided,
                color: state.data.isComingSoon ? '#6b7280' : '#4338ca',
                fontWeight: '500',
                padding: '4px 6px'
              }),
              multiValueRemove: (provided, state) => ({
                ...provided,
                color: state.data.isComingSoon ? '#9ca3af' : '#818cf8',
                ':hover': {
                  backgroundColor: state.data.isComingSoon ? '#e5e7eb' : '#c7d2fe',
                  color: state.data.isComingSoon ? '#6b7280' : '#6366f1'
                }
              }),
              groupHeading: (provided) => ({
                ...provided,
                fontSize: '13px',
                fontWeight: '600',
                color: '#374151',
                backgroundColor: '#f9fafb',
                padding: '8px 12px',
                borderBottom: '1px solid #e5e7eb',
                marginBottom: '4px'
              }),
              menu: (provided) => ({
                ...provided,
                borderRadius: '8px',
                border: '1px solid #e5e7eb',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }),
              placeholder: (provided) => ({
                ...provided,
                color: '#9ca3af',
                fontSize: '14px'
              })
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
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </span>
                )}
                <span className={option.isComingSoon ? 'text-gray-500' : 'text-gray-900'}>
                  {option.label}
                </span>
              </div>
            )}
            closeMenuOnSelect={false}
            hideSelectedOptions={false}
            placeholder={
              <div className="flex items-center text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Select security services...
              </div>
            }
            noOptionsMessage={() => "No roles found"}
            components={{
              IndicatorSeparator: () => null,
              DropdownIndicator: () => (
                <div className="pr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              )
            }}
          />
  
          {formData.selectedRoles.length > 0 && (
            <p className="mt-2 text-xs text-gray-500">
              Selected: {formData.selectedRoles.length} service(s)
            </p>
          )}
        </div> */}





// "use client";

// import { useState, useEffect, useRef } from "react";
// import { FaBuilding, FaCheck, FaClipboardList, FaEnvelope, FaGlobe, FaIndustry, FaMapMarkerAlt, FaPhone, FaUserTie } from "react-icons/fa";
// import { LockIcon } from "lucide-react";
// import { IoMdEye, IoMdEyeOff } from "react-icons/io";
// import Select from "react-select";
// import MembershipDialog from "./MembershipDialog";
// import TextField from '@mui/material/TextField';
// import companiesList from "@/sections/data/secuirty_services.json";
// import providersList from "@/sections/data/training_providers.json";

// interface ClientGeneralFormProps {
//   id: number;
//   title: string;
//   onSubmit: (data: any) => void;
// }

// interface RoleOption {
//   label: string;
//   value: string;
//   group: string;
//   isComingSoon: boolean;
// }
// const SecurityCompanyForm: React.FC<ClientGeneralFormProps> = ({ id, title, onSubmit }) => {
//   const [passwordVisible, setPasswordVisible] = useState(false);
//   const [passwordValidations, setPasswordValidations] = useState({
//     length: false,
//     hasUpper: false,
//     hasLower: false,
//     hasNumber: false,
//     hasSpecial: false,
//     isValid: false
//   });
//   const [formErrors, setFormErrors] = useState<Record<string, string>>({});
//   const [isFormValid, setIsFormValid] = useState(false);
//   const [showAllErrors, setShowAllErrors] = useState(false);
//   const [showMembershipDialog, setShowMembershipDialog] = useState(false);
//   const [formSubmissionData, setFormSubmissionData] = useState<any>(null);
//   const formRef = useRef<HTMLFormElement>(null);

//   const [formData, setFormData] = useState({
//     companyName: "",
//     registrationNumber: "",
//     address: "",
//     postcode: "",
//     industryType: "",
//     contactPerson: "",
//     password: "",
//     jobTitle: "",
//     email: "",
//     phone: "",
//     website: "",
//     selectedRoles: [] as string[], 
//     otherService: "",
//     premiumService: false,
//     securityChallenges: "",
//     receiveEmails: false,
//     acceptTerms: false,
//     dateOfBirth: { day: "", month: "", year: "" },
//   });

//   // Validate entire form whenever form data changes
//   useEffect(() => {
//     const isValid = validateForm();
//     setIsFormValid(isValid);
//   }, [formData, passwordValidations]);

//   const validateEmail = (email: string) => {
//     const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     return re.test(email);
//   };

//   const validatePassword = (password: string) => {
//     const validations = {
//       length: password.length >= 8,
//       hasUpper: /[A-Z]/.test(password),
//       hasLower: /[a-z]/.test(password),
//       hasNumber: /\d/.test(password),
//       hasSpecial: /[.\-_!@#$%^*]/.test(password),
//       isValid: false
//     };
//     validations.isValid = Object.values(validations).slice(0, 5).every(Boolean);
//     return validations;
//   };

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
//     const { name, value, type, checked } = e.target as HTMLInputElement;
    
//     setFormErrors(prev => ({ ...prev, [name]: "" }));

//     if (["day", "month", "year"].includes(name)) {
//       setFormData({
//         ...formData,
//         dateOfBirth: { ...formData.dateOfBirth, [name]: value },
//       });
//     } else if (type === "checkbox") {
//       setFormData({
//         ...formData,
//         [name]: checked,
//       });
//     } else {
//       setFormData({ ...formData, [name]: value });

//       if (name === "password") {
//         setPasswordValidations(validatePassword(value));
//       }
//     }
//   };

//   const handleMultiSelectChange = (selectedOptions: any, field: string) => {
//     setFormData(prev => ({
//       ...prev,
//       [field]: selectedOptions.map((option: any) => option.value),
//     }));
//   };

//   const validateForm = () => {
//     const errors: Record<string, string> = {};
//     let isValid = true;

//     // Email validation
//     if (!formData.email.trim()) {
//       errors.email = "Email is required";
//       isValid = false;
//     } else if (!validateEmail(formData.email)) {
//       errors.email = "Please enter a valid email";
//       isValid = false;
//     }

//     // Password validation
//     if (!formData.password.trim()) {
//       errors.password = "Password is required";
//       isValid = false;
//     } else if (!passwordValidations.isValid) {
//       errors.password = "Password doesn't meet requirements";
//       isValid = false;
//     }

//     // Company validation
//     if (!formData.companyName.trim()) {
//       errors.companyName = "Company name is required";
//       isValid = false;
//     }

//     // Address validation
//     if (!formData.address.trim()) {
//       errors.address = "Address is required";
//       isValid = false;
//     }

//     // Contact person validation
//     if (!formData.contactPerson.trim()) {
//       errors.contactPerson = "Contact person is required";
//       isValid = false;
//     }

//     // Terms validation
//     if (!formData.acceptTerms) {
//       errors.acceptTerms = "You must accept the terms and conditions";
//       isValid = false;
//     }

//     setFormErrors(errors);
//     return isValid && Object.keys(errors).length === 0;
//   };

//   // Transform professional data for select component
//   const roleOptions: RoleOption[] = (
//     id === 5 ? companiesList : id === 6 ? providersList : []
//   ).flatMap(category =>
//     category.roles.map(role => ({
//       label: role,
//       value: role,
//       group: category.title.replace(" (Coming Soon)", ""),
//       isComingSoon: category.title.includes("Coming Soon")
//     }))
//   );
  
//     const groupedOptions = roleOptions.reduce((acc, option) => {
//       if (!acc[option.group]) {
//         acc[option.group] = [];
//       }
//       acc[option.group].push(option);
//       return acc;
//     }, {} as Record<string, typeof roleOptions>);
  
//     const selectStyles = {
//       option: (provided: any, state: any) => ({
//         ...provided,
//         color: state.data.isComingSoon ? '#9CA3AF' : provided.color,
//         cursor: state.data.isComingSoon ? 'not-allowed' : provided.cursor,
//         backgroundColor: state.isSelected ? '#E5E7EB' : provided.backgroundColor,
//         '&:hover': {
//           backgroundColor: state.data.isComingSoon ? provided.backgroundColor : '#F3F4F6'
//         }
//       }),
//       multiValueLabel: (provided: any, state: any) => ({
//         ...provided,
//         textDecoration: 'none',
//         color: state.data.isComingSoon ? '#9CA3AF' : provided.color
//       }),
//       multiValue: (provided: any, state: any) => ({
//         ...provided,
//         backgroundColor: state.data.isComingSoon ? '#F3F4F6' : '#E5E7EB'
//       })
//     };
//   const handleInputChange = <K extends keyof any>(field: K, value: any[K]) => {
//     setFormData(prev => ({
//       ...prev,
//       [field]: value
//     }));
//   };
//   const handleRoleSelection = (selectedOptions: any) => {
//     const selectedValues = selectedOptions.map((option: any) => option.value);
//     handleInputChange('selectedRoles', selectedValues);
//   };
//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();

//     const isValid = validateForm();
//     setIsFormValid(isValid);

//     if (!isValid) {
//       setShowAllErrors(true);
//       setTimeout(() => {
//         const firstError = document.querySelector('.border-red-500');
//         if (firstError) {
//           firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
//         }
//       }, 100);
//       return;
//     }

//     const formattedData = {
//       email: formData.email,
//       password: formData.password,
//       firstName: formData.companyName.split(" ")[0],
//       lastName: formData.companyName.split(" ")[1] || "",
//       address: formData.address,
//       phoneNumber: formData.phone,
//       companyData: {
//         companyName: formData.companyName,
//         registrationNumber: formData.registrationNumber,
//         address: formData.address,
//         postCode: formData.postcode,
//         contactPerson: formData.contactPerson,
//         jobTitle: formData.jobTitle,
//         phoneNumber: formData.phone,
//         website: formData.website,
//       },
//       serviceRequirements: formData.selectedRoles,
//       securityServicesOfferings: formData.otherService 
//     ? [formData.otherService.trim()] // Convert string to array (with trimming)
//     : [], // Empty array if no other service provided
//       permissions: {
//         premiumServiceNeed: formData.premiumService,
//         acceptEmails: formData.receiveEmails,
//         acceptTerms: formData.acceptTerms,
//       },
//       roleId: Number(id),
//     };

//     // Save the submission data and show the membership dialog
//     setFormSubmissionData(formattedData);
//     setShowMembershipDialog(true);
//   };

//   const handlePlanSelected = (plan: string) => {
//     // Add the selected plan to the submission data
//     const finalData = {
//       ...formSubmissionData,
//       // membershipPlan: plan
//     };
    
//     // Close the dialog and submit the form with the selected plan
//     setShowMembershipDialog(false);
//     onSubmit(finalData);
//   };

//   const handleDialogClose = () => {
//     // If user closes the dialog without selecting a plan, submit with basic plan
//     const finalData = {
//       ...formSubmissionData,
//       // membershipPlan: 'basic'
//     };
//     setShowMembershipDialog(false);
//     onSubmit(finalData);
//   };





// "use client";

// import { useState, useEffect, useRef } from "react";
// import { FaBuilding, FaCheck, FaClipboardList, FaEnvelope, FaGlobe, FaIndustry, FaMapMarkerAlt, FaPhone, FaUserTie } from "react-icons/fa";
// import { LockIcon } from "lucide-react";
// import { IoMdEye, IoMdEyeOff } from "react-icons/io";
// import Select from "react-select";

// interface ClientGeneralFormProps {
//   id: number;
//   title: string;
//   onSubmit: (data: any) => void;
// }

// const SecurityCompanyForm: React.FC<ClientGeneralFormProps> = ({ id, title, onSubmit }) => {
//   const [passwordVisible, setPasswordVisible] = useState(false);
//   const [passwordValidations, setPasswordValidations] = useState({
//     length: false,
//     hasUpper: false,
//     hasLower: false,
//     hasNumber: false,
//     hasSpecial: false,
//     isValid: false
//   });
//   const [formErrors, setFormErrors] = useState<Record<string, string>>({});
//   const [isFormValid, setIsFormValid] = useState(false);
//   const [showAllErrors, setShowAllErrors] = useState(false);
//   const formRef = useRef<HTMLFormElement>(null);

//   const [formData, setFormData] = useState({
//     companyName: "",
//     registrationNumber: "",
//     address: "",
//     postcode: "",
//     industryType: "",
//     contactPerson: "",
//     password: "",
//     jobTitle: "",
//     email: "",
//     phone: "",
//     website: "",
//     serviceRequirements: [],
//     serviceOfferings: [],
//     premiumService: false,
//     securityChallenges: "",
//     receiveEmails: false,
//     acceptTerms: false,
//     dateOfBirth: { day: "", month: "", year: "" },
//   });

//   const serviceOptions = [
//     { value: "Online training", label: "Online Training" },
//     { value: "Certification courses", label: "Certification Courses" },
//     { value: "Physical security", label: "Physical Security" },
//     { value: "Cybersecurity", label: "Cybersecurity" },
//   ];

//   const offeringOptions = [
//     { value: "Firearm training", label: "Firearm Training" },
//     { value: "Self-defense", label: "Self-Defense" },
//     { value: "Crowd control", label: "Crowd Control" },
//     { value: "Risk assessment", label: "Risk Assessment" },
//   ];

//   // Validate entire form whenever form data changes
//   useEffect(() => {
//     const isValid = validateForm();
//     setIsFormValid(isValid);
//   }, [formData, passwordValidations]);

//   const validateEmail = (email: string) => {
//     const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     return re.test(email);
//   };

//   const validatePassword = (password: string) => {
//     const validations = {
//       length: password.length >= 8,
//       hasUpper: /[A-Z]/.test(password),
//       hasLower: /[a-z]/.test(password),
//       hasNumber: /\d/.test(password),
//       hasSpecial: /[.\-_!@#$%^*]/.test(password),
//       isValid: false
//     };
//     validations.isValid = Object.values(validations).slice(0, 5).every(Boolean);
//     return validations;
//   };

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//     const { name, value, type, checked } = e.target as HTMLInputElement;
    
//     setFormErrors(prev => ({ ...prev, [name]: "" }));

//     if (["day", "month", "year"].includes(name)) {
//       setFormData({
//         ...formData,
//         dateOfBirth: { ...formData.dateOfBirth, [name]: value },
//       });
//     } else if (type === "checkbox") {
//       setFormData({
//         ...formData,
//         [name]: checked,
//       });
//     } else {
//       setFormData({ ...formData, [name]: value });

//       if (name === "password") {
//         setPasswordValidations(validatePassword(value));
//       }
//     }
//   };

//   const handleMultiSelectChange = (selectedOptions: any, field: string) => {
//     setFormData(prev => ({
//       ...prev,
//       [field]: selectedOptions.map((option: any) => option.value),
//     }));
//   };

//   const validateForm = () => {
//     const errors: Record<string, string> = {};
//     let isValid = true;

//     // Email validation
//     if (!formData.email.trim()) {
//       errors.email = "Email is required";
//       isValid = false;
//     } else if (!validateEmail(formData.email)) {
//       errors.email = "Please enter a valid email";
//       isValid = false;
//     }

//     // Password validation
//     if (!formData.password.trim()) {
//       errors.password = "Password is required";
//       isValid = false;
//     } else if (!passwordValidations.isValid) {
//       errors.password = "Password doesn't meet requirements";
//       isValid = false;
//     }

//     // Company validation
//     if (!formData.companyName.trim()) {
//       errors.companyName = "Company name is required";
//       isValid = false;
//     }

//     // Address validation
//     if (!formData.address.trim()) {
//       errors.address = "Address is required";
//       isValid = false;
//     }

//     // Contact person validation
//     if (!formData.contactPerson.trim()) {
//       errors.contactPerson = "Contact person is required";
//       isValid = false;
//     }

//     // Terms validation
//     if (!formData.acceptTerms) {
//       errors.acceptTerms = "You must accept the terms and conditions";
//       isValid = false;
//     }

//     setFormErrors(errors);
//     return isValid && Object.keys(errors).length === 0;
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();

//     const isValid = validateForm();
//     setIsFormValid(isValid);

//     if (!isValid) {
//       setShowAllErrors(true);
//       setTimeout(() => {
//         const firstError = document.querySelector('.border-red-500');
//         if (firstError) {
//           firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
//         }
//       }, 100);
//       return;
//     }

//     const formattedData = {
//       email: formData.email,
//       password: formData.password,
//       firstName: formData.companyName.split(" ")[0],
//       lastName: formData.companyName.split(" ")[1] || "",
//       phoneNumber: formData.phone,
//       companyData: {
//         companyName: formData.companyName,
//         registrationNumber: formData.registrationNumber,
//         businessAddress: formData.address,
//         postCode: formData.postcode,
//         contactPerson: formData.contactPerson,
//         jobTitle: formData.jobTitle,
//         phoneNumber: formData.phone,
//         website: formData.website,
//       },
//       serviceRequirements: formData.serviceRequirements,
//       securityServicesOfferings: formData.serviceOfferings,
//       permissions: {
//         premiumServiceNeed: formData.premiumService,
//         acceptEmails: formData.receiveEmails,
//         acceptTerms: formData.acceptTerms,
//       },
//       roleId: id,
//     };

//     onSubmit(formattedData);
//   };

//   return (
//     <div className="max-w-4xl mx-auto bg-white shadow-lg p-8 rounded-md text-black">
//       <h1 className="text-center text-3xl font-bold my-6">{title} Registration</h1>

//       <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
//         {/* Company Name & Registration Number */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <div className="relative flex items-center">
//             <FaBuilding className="absolute left-3 text-gray-700" />
//             <input
//               type="text" 
//               name="companyName" 
//               placeholder="Company Name"
//               value={formData.companyName} 
//               onChange={handleChange}
//               className={`w-full pl-10 pr-3 py-3 border rounded-md bg-gray-100 focus-within:ring-2 focus-within:ring-black ${
//                 (showAllErrors && formErrors.companyName) ? "border-red-500" : "border-gray-500"
//               }`}
//               required
//             />
//             {(showAllErrors && formErrors.companyName) && (
//               <p className="mt-1 text-xs text-red-500">{formErrors.companyName}</p>
//             )}
//           </div>
//           <input
//             type="text" 
//             name="registrationNumber" 
//             placeholder="Registration Number"
//             value={formData.registrationNumber} 
//             onChange={handleChange}
//             className="w-full pl-3 pr-3 py-3 border border-gray-500 rounded-md bg-gray-100 focus-within:ring-2 focus-within:ring-black"
//           />
//         </div>

//         {/* Password */}
//         <div className="relative">
//           <LockIcon className="absolute left-3 top-3 text-gray-500" />
//           <input
//             type={passwordVisible ? "text" : "password"}
//             name="password"
//             value={formData.password}
//             onChange={handleChange}
//             required
//             placeholder="Password"
//             className={`w-full pl-10 pr-10 py-2 border rounded-md bg-gray-100 focus:ring-2 focus:ring-black ${
//               (showAllErrors && formErrors.password) ? "border-red-500" : "border-gray-500"
//             }`}
//           />
//           <button
//             type="button"
//             className="absolute right-3 top-3 text-gray-500"
//             onClick={() => setPasswordVisible(!passwordVisible)}
//           >
//             {passwordVisible ? <IoMdEyeOff /> : <IoMdEye />}
//           </button>
          
//           {(formData.password || showAllErrors) && (
//             <div className="mt-2 text-xs space-y-1">
//               {(!passwordValidations.length || showAllErrors) && (
//                 <p className={passwordValidations.length ? "text-green-500" : "text-red-500"}>
//                   {passwordValidations.length ? "✓" : "✗"} At least 8 characters
//                 </p>
//               )}
//               {(!passwordValidations.hasUpper || showAllErrors) && (
//                 <p className={passwordValidations.hasUpper ? "text-green-500" : "text-red-500"}>
//                   {passwordValidations.hasUpper ? "✓" : "✗"} At least one capital letter
//                 </p>
//               )}
//               {(!passwordValidations.hasLower || showAllErrors) && (
//                 <p className={passwordValidations.hasLower ? "text-green-500" : "text-red-500"}>
//                   {passwordValidations.hasLower ? "✓" : "✗"} At least one small letter
//                 </p>
//               )}
//               {(!passwordValidations.hasNumber || showAllErrors) && (
//                 <p className={passwordValidations.hasNumber ? "text-green-500" : "text-red-500"}>
//                   {passwordValidations.hasNumber ? "✓" : "✗"} At least one number
//                 </p>
//               )}
//               {(!passwordValidations.hasSpecial || showAllErrors) && (
//                 <p className={passwordValidations.hasSpecial ? "text-green-500" : "text-red-500"}>
//                   {passwordValidations.hasSpecial ? "✓" : "✗"} At least one special character (. - _ ! @ # $ % ^ *)
//                 </p>
//               )}
//             </div>
//           )}
//           {(showAllErrors && formErrors.password) && (
//             <p className="mt-1 text-xs text-red-500">{formErrors.password}</p>
//           )}
//         </div>

//         {/* Address & Postcode */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <div className="relative flex items-center">
//             <FaMapMarkerAlt className="absolute left-3 text-gray-700" />
//             <input
//               type="text" 
//               name="address" 
//               placeholder="Business Address"
//               value={formData.address} 
//               onChange={handleChange}
//               className={`w-full pl-10 pr-3 py-3 border rounded-md bg-gray-100 focus-within:ring-2 focus-within:ring-black ${
//                 (showAllErrors && formErrors.address) ? "border-red-500" : "border-gray-500"
//               }`}
//               required
//             />
//             {(showAllErrors && formErrors.address) && (
//               <p className="mt-1 text-xs text-red-500">{formErrors.address}</p>
//             )}
//           </div>
//           <input
//             type="text" 
//             name="postcode" 
//             placeholder="Post Code"
//             value={formData.postcode} 
//             onChange={handleChange}
//             className="w-full pl-3 pr-3 py-3 border border-gray-500 rounded-md bg-gray-100 focus-within:ring-2 focus-within:ring-black"
//             required
//           />
//         </div>

//         {/* Industry Type */}
//         <div className="relative flex items-center">
//           <FaIndustry className="absolute left-3 text-gray-700" />
//           <input
//             type="text" 
//             name="industryType" 
//             placeholder="Industry Type"
//             value={formData.industryType} 
//             onChange={handleChange}
//             className="w-full pl-10 pr-3 py-3 border border-gray-500 rounded-md bg-gray-100 focus-within:ring-2 focus-within:ring-black"
//             required
//           />
//         </div>

//         {/* Contact Person & Job Title */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <div className="relative flex items-center">
//             <FaUserTie className="absolute left-3 text-gray-700" />
//             <input
//               type="text" 
//               name="contactPerson" 
//               placeholder="Contact Person"
//               value={formData.contactPerson} 
//               onChange={handleChange}
//               className={`w-full pl-10 pr-3 py-3 border rounded-md bg-gray-100 focus-within:ring-2 focus-within:ring-black ${
//                 (showAllErrors && formErrors.contactPerson) ? "border-red-500" : "border-gray-500"
//               }`}
//               required
//             />
//             {(showAllErrors && formErrors.contactPerson) && (
//               <p className="mt-1 text-xs text-red-500">{formErrors.contactPerson}</p>
//             )}
//           </div>
//           <input
//             type="text" 
//             name="jobTitle" 
//             placeholder="Job Title"
//             value={formData.jobTitle} 
//             onChange={handleChange}
//             className="w-full pl-3 pr-3 py-3 border border-gray-500 rounded-md bg-gray-100 focus-within:ring-2 focus-within:ring-black"
//             required
//           />
//         </div>

//         {/* Email */}
//         <div className="relative flex items-center">
//           <FaEnvelope className="absolute left-3 text-gray-700" />
//           <input
//             type="email" 
//             name="email" 
//             placeholder="Email Address"
//             value={formData.email} 
//             onChange={handleChange}
//             className={`w-full pl-10 pr-3 py-3 border rounded-md bg-gray-100 focus-within:ring-2 focus-within:ring-black ${
//               (showAllErrors && formErrors.email) ? "border-red-500" : "border-gray-500"
//             }`}
//             required
//           />
//           {(showAllErrors && formErrors.email) && (
//             <p className="mt-1 text-xs text-red-500">{formErrors.email}</p>
//           )}
//         </div>

//         {/* Phone */}
//         <div className="relative flex items-center">
//           <FaPhone className="absolute left-3 text-gray-700" />
//           <input
//             type="text" 
//             name="phone" 
//             placeholder="Phone Number"
//             value={formData.phone} 
//             onChange={handleChange}
//             className="w-full pl-10 pr-3 py-3 border border-gray-500 rounded-md bg-gray-100 focus-within:ring-2 focus-within:ring-black"
//             required
//           />
//         </div>

//         {/* Website */}
//         <div className="relative flex items-center">
//           <FaGlobe className="absolute left-3 text-gray-700" />
//           <input
//             type="text" 
//             name="website" 
//             placeholder="Website (if applicable)"
//             value={formData.website} 
//             onChange={handleChange}
//             className="w-full pl-10 pr-3 py-3 border border-gray-500 rounded-md bg-gray-100 focus-within:ring-2 focus-within:ring-black"
//           />
//         </div>

//         {/* Service Requirements */}
//         <div className="relative flex items-center">
//           <FaClipboardList className="absolute left-3 text-gray-700" />
//           <Select
//             isMulti
//             options={serviceOptions}
//             placeholder="Select Service Requirements"
//             className="w-full pl-10"
//             onChange={selected => handleMultiSelectChange(selected, "serviceRequirements")}
//           />
//         </div>

//         {/* Service Offerings */}
//         <div className="relative flex items-center">
//           <FaClipboardList className="absolute left-3 text-gray-700" />
//           <Select
//             isMulti
//             options={offeringOptions}
//             placeholder="Select Security Service Offerings"
//             className="w-full pl-10"
//             onChange={selected => handleMultiSelectChange(selected, "serviceOfferings")}
//           />
//         </div>

//         {/* Premium Service */}
//         <div className="flex items-center space-x-3">
//           <input
//             type="checkbox"
//             name="premiumService"
//             checked={formData.premiumService}
//             onChange={handleChange}
//             className="w-4 h-4"
//           />
//           <label>Interested in premium service package for enhanced visibility?</label>
//         </div>

//         {/* Terms and Conditions */}
//         <div className="flex items-center space-x-3">
//           <input
//             type="checkbox"
//             name="acceptTerms"
//             checked={formData.acceptTerms}
//             onChange={handleChange}
//             required
//             className={`w-4 h-4 ${(showAllErrors && formErrors.acceptTerms) ? "border-red-500" : ""}`}
//           />
//           <span>
//             Agree to <a href="#" className="underline">Terms & Conditions</a>
//           </span>
//           {(showAllErrors && formErrors.acceptTerms) && (
//             <p className="mt-1 text-xs text-red-500">{formErrors.acceptTerms}</p>
//           )}
//         </div>

//         {/* Submit Button */}
//         <button 
//           type="submit" 
//           className={`w-full py-3 text-white font-bold rounded-md transition-colors ${
//             isFormValid ? "bg-black hover:bg-gray-800" : "bg-gray-400 cursor-not-allowed"
//           }`}
//           disabled={!isFormValid}
//         >
//           <FaCheck className="inline mr-2" /> Submit
//         </button>
//       </form>
//     </div>
//   );
// };

// export default SecurityCompanyForm;






// import { useState } from "react";
// import { FaBuilding, FaCheck, FaClipboardList, FaEnvelope, FaGlobe, FaIndustry, FaMapMarkerAlt, FaPhone, FaUserTie } from "react-icons/fa";
// import { LockIcon } from "lucide-react";
// import { IoMdEye, IoMdEyeOff } from "react-icons/io";
// import Select from "react-select";

// interface ClientGeneralFormProps {
//   id: number;
//   title: string;
//   onSubmit: (data: any) => void;
// }

// const SecurityCompanyForm: React.FC<ClientGeneralFormProps> = ({ id, title, onSubmit }) => {
//   const [passwordVisible, setPasswordVisible] = useState(false);

//   const [formData, setFormData] = useState({
//     companyName: "",
//     registrationNumber: "",
//     address: "",
//     postcode: "",
//     industryType: "",
//     contactPerson: "",
//     password: "",
//     jobTitle: "",
//     email: "",
//     phone: "",
//     website: "",
//     serviceRequirements: [],
//     serviceOfferings: [],
//     premiumService: false,
//     securityChallenges: "",
//     receiveEmails: false,
//     acceptTerms: false,
//   });

//   const serviceOptions = [
//     { value: "Online training", label: "Online Training" },
//     { value: "Certification courses", label: "Certification Courses" },
//     { value: "Physical security", label: "Physical Security" },
//     { value: "Cybersecurity", label: "Cybersecurity" },
//   ];

//   const offeringOptions = [
//     { value: "Firearm training", label: "Firearm Training" },
//     { value: "Self-defense", label: "Self-Defense" },
//     { value: "Crowd control", label: "Crowd Control" },
//     { value: "Risk assessment", label: "Risk Assessment" },
//   ];

//   const handleChange = (e: any) => {
//     const { name, value, type, checked } = e.target;
//     setFormData({
//       ...formData,
//       [name]: type === "checkbox" ? checked : value,
//     });
//   };

//   const handleMultiSelectChange = (selectedOptions: any, field: string) => {
//     setFormData(prev => ({
//       ...prev,
//       [field]: selectedOptions.map((option: any) => option.value),
//     }));
//   };

//   const handleSubmit = (e: any) => {
//     e.preventDefault();

//     const formattedData = {
//       email: formData.email,
//       password: formData.password,
//       firstName: formData.companyName.split(" ")[0],
//       lastName: formData.companyName.split(" ")[1],
//       phoneNumber: formData.phone,
//       companyData: {
//         companyName: formData.companyName,
//         registrationNumber: formData.registrationNumber,
//         businessAddress: formData.address,
//         postCode: formData.postcode,
//         contactPerson: formData.contactPerson,
//         jobTitle: formData.jobTitle,
//         phoneNumber: formData.phone,
       
//         website: formData.website,
//       },
//       serviceRequirements: formData.serviceRequirements,
//       securityServicesOfferings: formData.serviceOfferings,
    
//       permissions: {
//         premiumServiceNeed: formData.premiumService,
//         acceptEmails: formData.receiveEmails,
//         acceptTerms: formData.acceptTerms,
//       },
//       roleId: id, // Ensure this matches your updated role array logic
//     };

//     console.log("Form Data Submitted:", formattedData);
//     onSubmit(formattedData);
//   };

//   return (
//     <div className="max-w-4xl mx-auto bg-white shadow-lg p-8 rounded-md text-black">
//     <h1 className="text-center text-3xl font-bold my-6">{title} Registration</h1>

//     <form onSubmit={handleSubmit} className="space-y-6">

//       {/* Company Name & Registration Number */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         <div className="relative flex items-center">
//           <FaBuilding className="absolute left-3 text-gray-700" />
//           <input
//             type="text" name="companyName" placeholder="Company Name"
//             value={formData.companyName} onChange={handleChange}
//             className="w-full pl-10 pr-3 py-3 border border-gray-500 rounded-md bg-gray-100 focus-within:ring-2 focus-within:ring-black"
//             required
//           />
//         </div>
//         <input
//           type="text" name="registrationNumber" placeholder="Registration Number"
//           value={formData.registrationNumber} onChange={handleChange}
//           className="w-full pl-3 pr-3 py-3 border border-gray-500 rounded-md bg-gray-100 focus-within:ring-2 focus-within:ring-black"
//         />
//       </div>
//       <div className="relative">
//         <LockIcon className="absolute left-3 top-3 text-gray-500" />
//         <input
//           type={passwordVisible ? "text" : "password"}
//           name="password"
//           value={formData.password}
//           onChange={handleChange}
//           required
//           placeholder="Password"
//           className="w-full pl-10 pr-10 py-2 border rounded-md bg-gray-100 focus:ring-2 focus:ring-black"
//         />
//         <button
//           type="button"
//           className="absolute right-3 top-3 text-gray-500"
//           onClick={() => setPasswordVisible(!passwordVisible)}
//         >
//           {passwordVisible ? <IoMdEyeOff /> : <IoMdEye />}
//         </button>
//       </div>
//       {/* Address & Postcode */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         <div className="relative flex items-center">
//           <FaMapMarkerAlt className="absolute left-3 text-gray-700" />
//           <input
//             type="text" name="address" placeholder="Business Address"
//             value={formData.address} onChange={handleChange}
//             className="w-full pl-10 pr-3 py-3 border border-gray-500 rounded-md bg-gray-100 focus-within:ring-2 focus-within:ring-black"
//             required
//           />
//         </div>
//         <input
//           type="text" name="postcode" placeholder="Post Code"
//           value={formData.postcode} onChange={handleChange}
//           className="w-full pl-3 pr-3 py-3 border border-gray-500 rounded-md bg-gray-100 focus-within:ring-2 focus-within:ring-black"
//           required
//         />
//       </div>

//       {/* Industry Type */}
//       <div className="relative flex items-center">
//         <FaIndustry className="absolute left-3 text-gray-700" />
//         <input
//           type="text" name="industryType" placeholder="Industry Type"
//           value={formData.industryType} onChange={handleChange}
//           className="w-full pl-10 pr-3 py-3 border border-gray-500 rounded-md bg-gray-100 focus-within:ring-2 focus-within:ring-black"
//           required
//         />
//       </div>

//       {/* Contact Person & Job Title */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         <div className="relative flex items-center">
//           <FaUserTie className="absolute left-3 text-gray-700" />
//           <input
//             type="text" name="contactPerson" placeholder="Contact Person"
//             value={formData.contactPerson} onChange={handleChange}
//             className="w-full pl-10 pr-3 py-3 border border-gray-500 rounded-md bg-gray-100 focus-within:ring-2 focus-within:ring-black"
//             required
//           />
//         </div>
//         <input
//           type="text" name="jobTitle" placeholder="Job Title"
//           value={formData.jobTitle} onChange={handleChange}
//           className="w-full pl-3 pr-3 py-3 border border-gray-500 rounded-md bg-gray-100 focus-within:ring-2 focus-within:ring-black"
//           required
//         />
//       </div>

//       {/* Email, Phone, Website */}
//       <div className="relative flex items-center">
//         <FaEnvelope className="absolute left-3 text-gray-700" />
//         <input
//           type="email" name="email" placeholder="Email Address"
//           value={formData.email} onChange={handleChange}
//           className="w-full pl-10 pr-3 py-3 border border-gray-500 rounded-md bg-gray-100 focus-within:ring-2 focus-within:ring-black"
//           required
//         />
//       </div>

//       <div className="relative flex items-center">
//         <FaPhone className="absolute left-3 text-gray-700" />
//         <input
//           type="text" name="phone" placeholder="Phone Number"
//           value={formData.phone} onChange={handleChange}
//           className="w-full pl-10 pr-3 py-3 border border-gray-500 rounded-md bg-gray-100 focus-within:ring-2 focus-within:ring-black"
//           required
//         />
//       </div>

//       <div className="relative flex items-center">
//         <FaGlobe  className="absolute left-3 text-gray-700" />
//         <input
//           type="text" name="website" placeholder="Website (if applicable)"
//           value={formData.website} onChange={handleChange}
//           className="w-full pl-10 pr-3 py-3 border border-gray-500 rounded-md bg-gray-100 focus-within:ring-2 focus-within:ring-black"
//         />
//       </div>

//         <div className="relative flex items-center">
//           <FaClipboardList className="absolute left-3 text-gray-700" />
//           <Select
//             isMulti
//             options={serviceOptions}
//             placeholder="Select Service Requirements"
//             className="w-full pl-10"
//             onChange={selected => handleMultiSelectChange(selected, "serviceRequirements")}
//           />
//         </div>
//         <div className="relative flex items-center">
//         <FaClipboardList className="absolute left-3 text-gray-700" />
//         <Select
//           isMulti
//           options={offeringOptions}
//           placeholder="Select Security Service Offerings"
//           className="w-full pl-10"
//           onChange={selected => handleMultiSelectChange(selected, "serviceOfferings")}
//         />
//       </div>

//         <div className="flex items-center space-x-3">
//           <input
//             type="checkbox"
//             name="premiumService"
//             checked={formData.premiumService}
//             onChange={handleChange}
//             className="w-4 h-4"
//           />
//           <label>Interested in premium service package for enhanced visibility?</label>
//         </div>

//         <div className="flex items-center space-x-3">
//           <input
//             type="checkbox"
//             name="acceptTerms"
//             checked={formData.acceptTerms}
//             onChange={handleChange}
//             required
//             className="w-4 h-4"
//           />
//           <span>
//             Agree to <a href="#" className="underline">Terms & Conditions</a>
//           </span>
//         </div>

//         <button type="submit" className="w-full bg-black text-white py-3 rounded-md hover:opacity-80 flex items-center justify-center">
//           <FaCheck className="mr-2" /> Submit
//         </button>
//       </form>
//     </div>
//   );
// };

// export default SecurityCompanyForm;
