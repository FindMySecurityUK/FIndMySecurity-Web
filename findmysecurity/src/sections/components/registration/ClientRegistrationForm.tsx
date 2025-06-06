"use client";

import { useState, useEffect, useRef } from "react";
import { LockIcon } from "lucide-react";
import { FaEnvelope, FaMapMarkerAlt, FaUser, FaPhone } from "react-icons/fa";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
// import MembershipDialog from "./MembershipDialog"; // Adjust the import path as needed
import TextField from '@mui/material/TextField';
import toast from "react-hot-toast";
import { parsePhoneNumberFromString } from 'libphonenumber-js';

interface ClientGeneralFormProps {
  id: number;
  title: string;
  onSubmit: (data: any) => void;
}

const ClientGeneralForm: React.FC<ClientGeneralFormProps> = ({ id, title, onSubmit }) => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [passwordValidations, setPasswordValidations] = useState({
    length: false,
    hasUpper: false,
    hasLower: false,
    hasNumber: false,
    hasSpecial: false,
    isValid: false
  });
  const roleid = id;
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [showAllErrors, setShowAllErrors] = useState(false);
  // const [showMembershipDialog, setShowMembershipDialog] = useState(false);
  const [formSubmissionData, setFormSubmissionData] = useState<any>(null);
  const [phoneNumberInfo, setPhoneNumberInfo] = useState<{
    isValid: boolean;
    country?: string;
    formatInternational?: string;
    error?: string;
  }>({ isValid: false });
  const formRef = useRef<HTMLFormElement>(null);


  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    screenName: "",
    phoneNumber: "",
    dateOfBirth: { day: "", month: "", year: "" },
    address: "",
    terms:false,
    postcode: "",
  });

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setFormData(prev => ({ ...prev, phoneNumber: value }));
    
    // Clear previous errors - properly typed now
    setFormErrors(prev => ({ ...prev, phoneNumber: "" }));
    
    if (value) {
      const validation = validatePhoneNumber(value);
      setPhoneNumberInfo(validation);
      
      if (!validation.isValid) {
        setFormErrors(prev => ({ 
          ...prev, 
          phoneNumber: validation.error || "Invalid phone number" 
        }));
      }
    } else {
      setPhoneNumberInfo({ isValid: false });
    }
  };
  // Validate entire form whenever form data changes
  useEffect(() => {
    const isValid = validateForm();
    setIsFormValid(isValid);
  }, [formData, passwordValidations]);

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePhoneNumber = (phone: string) => {
    if (!phone.trim()) {
      return { isValid: false, error: "Phone number is required" };
    }

    const phoneNumber = parsePhoneNumberFromString(phone);
    if (!phoneNumber || !phoneNumber.isValid()) {
      return { isValid: false, error: "Invalid phone number" };
    }

    return {
      isValid: true,
      country: phoneNumber.country,
      formatInternational: phoneNumber.formatInternational(),
    };
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

  const handleChange = ( e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

  // Clear validation error for this field
  setFormErrors((prev) => ({ ...prev, [name]: "" }));

  // Handle dateOfBirth fields
  if (["day", "month", "year"].includes(name)) {
    setFormData((prev) => ({
      ...prev,
      dateOfBirth: { ...prev.dateOfBirth, [name]: value },
    }));
  } else {
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Special handling for password field
    if (name === "password") {
      setPasswordValidations(validatePassword(value));
    }
  }
    
  
    // const { name, value } = e.target;
    
    // setFormErrors(prev => ({ ...prev, [name]: "" }));

    // if (["day", "month", "year"].includes(name)) {
    //   setFormData({
    //     ...formData,
    //     dateOfBirth: { ...formData.dateOfBirth, [name]: value },
    //   });
    // } else {
    //   setFormData({ ...formData, [name]: value });

    //   if (name === "password") {
    //     setPasswordValidations(validatePassword(value));
    //   }
    // }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    let isValid = true;

    // Email validation
    if (!formData.email.trim()) {
      errors.email = "Email is required";
      isValid = false;
    } else if (!validateEmail(formData.email)) {
      errors.email = "Please enter a valid email";
      isValid = false;
    }

    // Password validation
    if (!formData.password.trim()) {
      errors.password = "Password is required";
      isValid = false;
    } else if (!passwordValidations.isValid) {
      errors.password = "Password doesn't meet requirements";
      isValid = false;
    }

    // Name validation
    if (!formData.firstName.trim()) {
      errors.firstName = "First name is required";
      isValid = false;
    }

    if (!formData.lastName.trim()) {
      errors.lastName = "Last name is required";
      isValid = false;
    }

    // Date of birth validation
    if (!formData.dateOfBirth.day || !formData.dateOfBirth.month || !formData.dateOfBirth.year) {
      errors.dateOfBirth = "Date of birth is required";
      isValid = false;
    }

    // Address validation
    if (!formData.address.trim()) {
      errors.address = "Address is required";
      isValid = false;
    }

    // Address validation
    if (!formData.postcode.trim()) {
      errors.address = "Post Code is required";
      isValid = false;
    }

    if (!formData.phoneNumber.trim()) {
      errors.phoneNumber = "Phone number is required";
      isValid = false;
    } else if (!phoneNumberInfo.isValid) {
      errors.phoneNumber = phoneNumberInfo.error || "Invalid phone number";
      isValid = false;
    }

    if(!formData.terms) {
      errors.terms = "Terms and Conditions are required";
      isValid = false;
    }
    setFormErrors(errors);
    return isValid && Object.keys(errors).length === 0;
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  const isValid = validateForm();
  setIsFormValid(isValid);

  if (!isValid) {
    setShowAllErrors(true);
    setTimeout(() => {
      const firstError = document.querySelector('.border-red-500');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
    return;
  }

  // Validate postcode via postcodes.io
  try {
    const response = await fetch(`https://api.postcodes.io/postcodes/${formData.postcode.trim()}`);
    const data = await response.json();

    if (!data.result || data.status !== 200) {
    toast.error("Invalid UK postcode. Please enter a valid one.");
      const postcodeInput = document.querySelector('input[name="postcode"]');
      if (postcodeInput) {
        postcodeInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }
  } catch (error) {
    console.error("Postcode validation failed:", error);
    alert("Failed to validate postcode. Please try again later.");
    return;
  }

  const { day, month, year } = formData.dateOfBirth;
  const formattedDateOfBirth = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;

  const submissionData = {
    email: formData.email,
    password: formData.password,
    firstName: formData.firstName,
    lastName: formData.lastName,
    screenName: formData.screenName,
    phoneNumber: formData.phoneNumber,
    dateOfBirth: formattedDateOfBirth,
    address: formData.address,
    postcode: formData.postcode,
    permissions: {},
    roleId: id,
  };

  setFormSubmissionData(submissionData);
  onSubmit(submissionData);
  // setShowMembershipDialog(true);
};


  const handlePlanSelected = (plan: string) => {
    // Add the selected plan to the submission data
    const finalData = {
      ...formSubmissionData,
      // membershipPlan: plan
    };
    
    // Close the dialog and submit the form with the selected plan
    // setShowMembershipDialog(false);
    onSubmit(finalData);
  };

  const handleDialogClose = () => {
    // If user closes the dialog without selecting a plan, submit with basic plan
    const finalData = {
      ...formSubmissionData,
      // membershipPlan: 'basic'
    };
    // setShowMembershipDialog(false);
    onSubmit(finalData);
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-md">
      <h2 className="text-2xl font-bold text-center my-4 text-black">
  Free {roleid === 3 ? "Registration - " : "Individuals Seeking Security For"}  {title}
</h2>

      {/* <h2 className="text-2xl font-bold text-center my-4 text-black">Free Registration For {title}</h2> */}

      <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
  {/* Email Address */}
  <div className="relative">
    <FaEnvelope className="absolute left-3 top-3 text-gray-500" />
    <TextField
      type="email"
      name="email"
      value={formData.email}
      onChange={handleChange}
      required
            id="outlined-basic"
      variant="outlined"
      label="Email Address"
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
      // className={`w-full pl-10 pr-3 py-2 border rounded-md bg-gray-100 focus:ring-2 focus:ring-black ${
      //   showAllErrors && formErrors.email ? "border-red-500" : "border-gray-300"
      // }`}
      
    />
    {(showAllErrors && formErrors.email) && (
      <p className="mt-1 text-xs text-red-500">{formErrors.email}</p>
    )}
  </div>

  {/* Password */}
  <div className="relative">
    <LockIcon className="absolute left-3 top-3 text-gray-500" />
    <TextField
      type={passwordVisible ? "text" : "password"}
      name="password"
      value={formData.password}
      onChange={handleChange}
      required
      id="outlined-basic"
      variant="outlined"
      label="Password"
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
    
    />
    <button
      type="button"
      className="absolute right-3 top-4 text-gray-500"
      onClick={() => setPasswordVisible(!passwordVisible)}
    >
      {passwordVisible ? <IoMdEyeOff className="w-6 h-6" /> : <IoMdEye className="w-6 h-6"/>}
    </button>

    {(formData.password || showAllErrors) && (
      <div className="mt-2 text-xs space-y-1">
        {(!passwordValidations.length || showAllErrors) && (
          <p className={passwordValidations.length ? "text-green-500" : "text-red-500"}>
            {passwordValidations.length ? "✓" : "✗"} At least 8 characters
          </p>
        )}
        {(!passwordValidations.hasUpper || showAllErrors) && (
          <p className={passwordValidations.hasUpper ? "text-green-500" : "text-red-500"}>
            {passwordValidations.hasUpper ? "✓" : "✗"} At least one capital letter
          </p>
        )}
        {(!passwordValidations.hasLower || showAllErrors) && (
          <p className={passwordValidations.hasLower ? "text-green-500" : "text-red-500"}>
            {passwordValidations.hasLower ? "✓" : "✗"} At least one small letter
          </p>
        )}
        {(!passwordValidations.hasNumber || showAllErrors) && (
          <p className={passwordValidations.hasNumber ? "text-green-500" : "text-red-500"}>
            {passwordValidations.hasNumber ? "✓" : "✗"} At least one number
          </p>
        )}
        {(!passwordValidations.hasSpecial || showAllErrors) && (
          <p className={passwordValidations.hasSpecial ? "text-green-500" : "text-red-500"}>
            {passwordValidations.hasSpecial ? "✓" : "✗"} At least one special character (. - _ ! @ # $ % ^ *)
          </p>
        )}
      </div>
    )}
    {(showAllErrors && formErrors.password) && (
      <p className="mt-1 text-xs text-red-500">{formErrors.password}</p>
    )}
  </div>

  {/* Name Fields */}
  <div className="grid grid-cols-2 gap-4">
    <div className="relative">
      <FaUser className="absolute left-3 top-3 text-gray-500" />
      <TextField
        type="text"
        name="firstName"
        value={formData.firstName}
        onChange={handleChange}
              id="outlined-basic"
      variant="outlined"
        label="First Name"
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
        // className={`w-full pl-10 pr-3 py-2 border rounded-md bg-gray-100 focus:ring-2 focus:ring-black ${
        //   (showAllErrors && formErrors.firstName) ? "border-red-500" : "border-gray-300"
        // }`}
      />
      {(showAllErrors && formErrors.firstName) && (
        <p className="mt-1 text-xs text-red-500">{formErrors.firstName}</p>
      )}
    </div>
    <div className="relative">
      <FaUser className="absolute left-3 top-3 text-gray-500" />
      <TextField
        type="text"
        name="lastName"
        value={formData.lastName}
        onChange={handleChange}
              id="outlined-basic"
      variant="outlined"
        label="Last Name"
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
      
      />
      {(showAllErrors && formErrors.lastName) && (
        <p className="mt-1 text-xs text-red-500">{formErrors.lastName}</p>
      )}
    </div>
  </div>

  {/* Screen Name */}
  <div className="relative">
    <FaUser className="absolute left-3 top-3 text-gray-500" />
    <TextField
      type="text"
      name="screenName"
      value={formData.screenName}
      onChange={handleChange}
            id="outlined-basic"
      variant="outlined"
      label="Screen Name"
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
      // className="w-full pl-10 pr-3 py-2 border rounded-md bg-gray-100 focus:ring-2 focus:ring-black"
    />
  </div>

  {/* Phone Number */}
  <div className="relative">
        <FaPhone className="absolute left-3 top-3 text-gray-500" />
        <TextField
          type="text"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handlePhoneNumberChange}
          id="outlined-basic"
          variant="outlined"
          label="Phone Number"
          className={`w-full pl-10 pr-3 py-2 border rounded-md bg-gray-100 focus:ring-2 focus:ring-black ${
            showAllErrors && formErrors.phoneNumber ? "border-red-500" : "border-gray-300"
          } focus:border-black`}
          InputLabelProps={{
            style: { color: 'gray' },
          }}
          inputProps={{
            className: "focus:outline-none"
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: showAllErrors && formErrors.phoneNumber ? "red" : "gray",
              },
              "&.Mui-focused fieldset": {
                borderColor: "black",
              },
            },
            "& .MuiInputLabel-root": {
              color: "gray",
            },
            "& .Mui-focused .MuiInputLabel-root": {
              color: "black",
            },
          }}
        />
        {(formData.phoneNumber && phoneNumberInfo.country) && (
          <div className="mt-1 text-xs text-gray-500">
            Country: {phoneNumberInfo.country}
            {phoneNumberInfo.formatInternational && (
              <span className="ml-2">({phoneNumberInfo.formatInternational})</span>
            )}
          </div>
        )}
        {(showAllErrors && formErrors.phoneNumber) && (
          <p className="mt-1 text-xs text-red-500">{formErrors.phoneNumber}</p>
        )}
      </div>
  <div>
    <label className="block text-sm font-medium">Date of Birth</label>
    <div className="grid grid-cols-3 gap-2">
      <select 
        name="day" 
        value={formData.dateOfBirth.day} 
        onChange={handleChange} 
        className={`w-full px-3 py-2 border rounded-md bg-gray-100 ${
          (showAllErrors && formErrors.dateOfBirth) ? "border-red-500" : ""
        }`}
      >
        <option value="">DD</option>
        {[...Array(31)].map((_, i) => (
          <option key={i} value={String(i + 1)}>{i + 1}</option>
        ))}
      </select>
      <select 
        name="month" 
        value={formData.dateOfBirth.month} 
        onChange={handleChange} 
        className={`w-full px-3 py-2 border rounded-md bg-gray-100 ${
          (showAllErrors && formErrors.dateOfBirth) ? "border-red-500" : ""
        }`}
      >
        <option value="">MM</option>
        {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
          <option key={m} value={String(m)}>{m}</option>
        ))}
      </select>
      <select 
        name="year" 
        value={formData.dateOfBirth.year} 
        onChange={handleChange} 
        className={`w-full px-3 py-2 border rounded-md bg-gray-100 ${
          (showAllErrors && formErrors.dateOfBirth) ? "border-red-500" : ""
        }`}
      >
        <option value="">YYYY</option>
        {[...Array(100)].map((_, i) => (
          <option key={i} value={String(2024 - i)}>{2024 - i}</option>
        ))}
      </select>
    </div>
    {(showAllErrors && formErrors.dateOfBirth) && (
      <p className="mt-1 text-xs text-red-500">{formErrors.dateOfBirth}</p>
    )}
  </div>

  {/* Address */}
  <div className="relative">
    <FaMapMarkerAlt className="absolute left-3 top-3 text-gray-500" />
    <TextField
      type="text"
      name="address"
      value={formData.address}
      onChange={handleChange}
            id="outlined-basic"
      variant="outlined"
      label="Full Address"
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
      // className={`w-full pl-10 pr-3 py-2 border rounded-md bg-gray-100 focus:ring-2 focus:ring-black ${
      //   (showAllErrors && formErrors.address) ? "border-red-500" : "border-gray-300"
      // }`}
    />
    {(showAllErrors && formErrors.address) && (
      <p className="mt-1 text-xs text-red-500">{formErrors.address}</p>
    )}
  </div>

  {/* PostCode */}
  <div className="relative">
    <FaMapMarkerAlt className="absolute left-3 top-3 text-gray-500" />
    <TextField
      type="text"
      name="postcode"
      value={formData.postcode}
      onChange={handleChange}
            id="outlined-basic"
      variant="outlined"
      label="Post Code"
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
      // className={`w-full pl-10 pr-3 py-2 border rounded-md bg-gray-100 focus:ring-2 focus:ring-black ${
      //   (showAllErrors && formErrors.address) ? "border-red-500" : "border-gray-300"
      // }`}
    />
    {(showAllErrors && formErrors.address) && (
      <p className="mt-1 text-xs text-red-500">{formErrors.address}</p>
    )}
  </div>
<div className="flex items-start space-x-2">
  <input
    type="checkbox"
    id="terms"
    name="terms"
    checked={formData.terms}
    onChange={handleChange}
    required
    className="mt-1"
  />
  <label htmlFor="terms" className="text-sm text-gray-700">
    I agree to the&nbsp;
    <a href="/legal/terms" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
      Terms and Conditions
    </a>
  </label>
</div>

  {/* Submit Button */}
  <button 
    type="submit" 
    className={`w-full py-3 text-white font-bold rounded-md transition-colors ${
      isFormValid ? "bg-black hover:bg-gray-800" : "bg-gray-400 cursor-not-allowed"
    }`}
    disabled={!isFormValid}
  >
    Join now for free
  </button>
</form>

      {/* <MembershipDialog 
        isOpen={showMembershipDialog}
        onClose={handleDialogClose}
        onPlanSelected={handlePlanSelected}
      /> */}
    </div>
  );
};

export default ClientGeneralForm;













// "use client";

// import { useState, useEffect, useRef } from "react";
// import { LockIcon } from "lucide-react";
// import { FaEnvelope, FaMapMarkerAlt, FaUser, FaPhone } from "react-icons/fa";
// import { IoMdEye, IoMdEyeOff } from "react-icons/io";

// interface ClientGeneralFormProps {
//   id: number;
//   title: string;
//   onSubmit: (data: any) => void;
// }

// const ClientGeneralForm: React.FC<ClientGeneralFormProps> = ({ id, title, onSubmit }) => {
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
//     email: "",
//     password: "",
//     firstName: "",
//     lastName: "",
//     screenName: "",
//     phoneNumber: "",
//     dateOfBirth: { day: "", month: "", year: "" },
//     address: "",
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

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//     const { name, value } = e.target;
    
//     setFormErrors(prev => ({ ...prev, [name]: "" }));

//     if (["day", "month", "year"].includes(name)) {
//       setFormData({
//         ...formData,
//         dateOfBirth: { ...formData.dateOfBirth, [name]: value },
//       });
//     } else {
//       setFormData({ ...formData, [name]: value });

//       if (name === "password") {
//         setPasswordValidations(validatePassword(value));
//       }
//     }
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

//     // Name validation
//     if (!formData.firstName.trim()) {
//       errors.firstName = "First name is required";
//       isValid = false;
//     }

//     if (!formData.lastName.trim()) {
//       errors.lastName = "Last name is required";
//       isValid = false;
//     }

//     // Date of birth validation
//     if (!formData.dateOfBirth.day || !formData.dateOfBirth.month || !formData.dateOfBirth.year) {
//       errors.dateOfBirth = "Date of birth is required";
//       isValid = false;
//     }

//     // Address validation
//     if (!formData.address.trim()) {
//       errors.address = "Address is required";
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

//     const { day, month, year } = formData.dateOfBirth;
//     const formattedDateOfBirth = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;

//     const submissionData = {
//       email: formData.email,
//       password: formData.password,
//       firstName: formData.firstName,
//       lastName: formData.lastName,
//       screenName: formData.screenName,
//       phoneNumber: formData.phoneNumber,
//       dateOfBirth: formattedDateOfBirth,
//       address: formData.address,
//       permissions: {},
//       roleId: id,
//     };

//     onSubmit(submissionData);
//   };

  // return (
  //   <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-md">
  //     <h2 className="text-2xl font-bold text-center my-4 text-black">Free Registration For {title}</h2>

  //     <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
  //       {/* Email Address */}
  //       <div className="relative">
  //         <FaEnvelope className="absolute left-3 top-3 text-gray-500" />
  //         <input
  //           type="email"
  //           name="email"
  //           value={formData.email}
  //           onChange={handleChange}
  //           required
  //           placeholder="Email Address"
  //           className={`w-full pl-10 pr-3 py-2 border rounded-md bg-gray-100 focus:ring-2 focus:ring-black ${
  //             (showAllErrors && formErrors.email) ? "border-red-500" : "border-gray-300"
  //           }`}
  //         />
  //         {(showAllErrors && formErrors.email) && (
  //           <p className="mt-1 text-xs text-red-500">{formErrors.email}</p>
  //         )}
  //       </div>

  //       {/* Password */}
  //       <div className="relative">
  //         <LockIcon className="absolute left-3 top-3 text-gray-500" />
  //         <input
  //           type={passwordVisible ? "text" : "password"}
  //           name="password"
  //           value={formData.password}
  //           onChange={handleChange}
  //           required
  //           placeholder="Password"
  //           className={`w-full pl-10 pr-10 py-2 border rounded-md bg-gray-100 focus:ring-2 focus:ring-black ${
  //             (showAllErrors && formErrors.password) ? "border-red-500" : "border-gray-300"
  //           }`}
  //         />
  //         <button
  //           type="button"
  //           className="absolute right-3 top-3 text-gray-500"
  //           onClick={() => setPasswordVisible(!passwordVisible)}
  //         >
  //           {passwordVisible ? <IoMdEyeOff /> : <IoMdEye />}
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

  //       {/* Name Fields */}
  //       <div className="grid grid-cols-2 gap-4">
  //         <div className="relative">
  //           <FaUser className="absolute left-3 top-3 text-gray-500" />
  //           <input
  //             type="text"
  //             name="firstName"
  //             value={formData.firstName}
  //             onChange={handleChange}
  //             placeholder="First Name"
  //             className={`w-full pl-10 pr-3 py-2 border rounded-md bg-gray-100 focus:ring-2 focus:ring-black ${
  //               (showAllErrors && formErrors.firstName) ? "border-red-500" : "border-gray-300"
  //             }`}
  //           />
  //           {(showAllErrors && formErrors.firstName) && (
  //             <p className="mt-1 text-xs text-red-500">{formErrors.firstName}</p>
  //           )}
  //         </div>
  //         <div className="relative">
  //           <FaUser className="absolute left-3 top-3 text-gray-500" />
  //           <input
  //             type="text"
  //             name="lastName"
  //             value={formData.lastName}
  //             onChange={handleChange}
  //             placeholder="Last Name"
  //             className={`w-full pl-10 pr-3 py-2 border rounded-md bg-gray-100 focus:ring-2 focus:ring-black ${
  //               (showAllErrors && formErrors.lastName) ? "border-red-500" : "border-gray-300"
  //             }`}
  //           />
  //           {(showAllErrors && formErrors.lastName) && (
  //             <p className="mt-1 text-xs text-red-500">{formErrors.lastName}</p>
  //           )}
  //         </div>
  //       </div>

  //       {/* Screen Name */}
  //       <div className="relative">
  //         <FaUser className="absolute left-3 top-3 text-gray-500" />
  //         <input
  //           type="text"
  //           name="screenName"
  //           value={formData.screenName}
  //           onChange={handleChange}
  //           placeholder="Screen Name"
  //           className="w-full pl-10 pr-3 py-2 border rounded-md bg-gray-100 focus:ring-2 focus:ring-black"
  //         />
  //       </div>

  //       {/* Phone Number */}
  //       <div className="relative">
  //         <FaPhone className="absolute left-3 top-3 text-gray-500" />
  //         <input
  //           type="text"
  //           name="phoneNumber"
  //           value={formData.phoneNumber}
  //           onChange={handleChange}
  //           placeholder="Phone Number"
  //           className="w-full pl-10 pr-3 py-2 border rounded-md bg-gray-100 focus:ring-2 focus:ring-black"
  //         />
  //       </div>

  //       {/* Date of Birth */}
  //       <div>
  //         <label className="block text-sm font-medium">Date of Birth</label>
  //         <div className="grid grid-cols-3 gap-2">
  //           <select 
  //             name="day" 
  //             value={formData.dateOfBirth.day} 
  //             onChange={handleChange} 
  //             className={`w-full px-3 py-2 border rounded-md bg-gray-100 ${
  //               (showAllErrors && formErrors.dateOfBirth) ? "border-red-500" : ""
  //             }`}
  //           >
  //             <option value="">DD</option>
  //             {[...Array(31)].map((_, i) => (
  //               <option key={i} value={String(i + 1)}>{i + 1}</option>
  //             ))}
  //           </select>
  //           <select 
  //             name="month" 
  //             value={formData.dateOfBirth.month} 
  //             onChange={handleChange} 
  //             className={`w-full px-3 py-2 border rounded-md bg-gray-100 ${
  //               (showAllErrors && formErrors.dateOfBirth) ? "border-red-500" : ""
  //             }`}
  //           >
  //             <option value="">MM</option>
  //             {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
  //               <option key={m} value={String(m)}>{m}</option>
  //             ))}
  //           </select>
  //           <select 
  //             name="year" 
  //             value={formData.dateOfBirth.year} 
  //             onChange={handleChange} 
  //             className={`w-full px-3 py-2 border rounded-md bg-gray-100 ${
  //               (showAllErrors && formErrors.dateOfBirth) ? "border-red-500" : ""
  //             }`}
  //           >
  //             <option value="">YYYY</option>
  //             {[...Array(100)].map((_, i) => (
  //               <option key={i} value={String(2024 - i)}>{2024 - i}</option>
  //             ))}
  //           </select>
  //         </div>
  //         {(showAllErrors && formErrors.dateOfBirth) && (
  //           <p className="mt-1 text-xs text-red-500">{formErrors.dateOfBirth}</p>
  //         )}
  //       </div>

  //       {/* Address */}
  //       <div className="relative">
  //         <FaMapMarkerAlt className="absolute left-3 top-3 text-gray-500" />
  //         <input
  //           type="text"
  //           name="address"
  //           value={formData.address}
  //           onChange={handleChange}
  //           placeholder="Full Address"
  //           className={`w-full pl-10 pr-3 py-2 border rounded-md bg-gray-100 focus:ring-2 focus:ring-black ${
  //             (showAllErrors && formErrors.address) ? "border-red-500" : "border-gray-300"
  //           }`}
  //         />
  //         {(showAllErrors && formErrors.address) && (
  //           <p className="mt-1 text-xs text-red-500">{formErrors.address}</p>
  //         )}
  //       </div>

  //       {/* Submit Button */}
  //       <button 
  //         type="submit" 
  //         className={`w-full py-3 text-white font-bold rounded-md transition-colors ${
  //           isFormValid ? "bg-black hover:bg-gray-800" : "bg-gray-400 cursor-not-allowed"
  //         }`}
  //         disabled={!isFormValid}
  //       >
  //         Join now for free
  //       </button>
  //     </form>
  //   </div>
  // );
// };

// export default ClientGeneralForm;






// "use client";

// import { useState } from "react";
// import { LockIcon } from "lucide-react";
// import { FaEnvelope, FaMapMarkerAlt, FaUser, FaPhone } from "react-icons/fa";
// import { IoMdEye, IoMdEyeOff } from "react-icons/io";
// interface ClientGeneralFormProps {
//   id: number;
//   title: string;
//   onSubmit: (data: any) => void; // Callback function to pass data to parent
// }

// const ClientGeneralForm: React.FC<ClientGeneralFormProps> = ({ id, title, onSubmit }) => {
//   const [passwordVisible, setPasswordVisible] = useState(false);
//   const [formData, setFormData] = useState({
//     email: "",
//     password: "",
//     firstName: "",
//     lastName: "",
//     screenName: "",
//     phoneNumber: "",
//     dateOfBirth: { day: "", month: "", year: "" },
//     address: "",
//   });

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//     const { name, value, type } = e.target;
//     if (["day", "month", "year"].includes(name)) {
//       setFormData({
//         ...formData,
//         dateOfBirth: { ...formData.dateOfBirth, [name]: value },
//       });
//     } else {
//       setFormData({ ...formData, [name]: value });
//     }
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();

//     const { day, month, year } = formData.dateOfBirth;
//     const formattedDateOfBirth = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;

//     const submissionData = {
//       email: formData.email,
//       password: formData.password,
//       firstName: formData.firstName,
//       lastName: formData.lastName,
//       screenName: formData.screenName,
//       phoneNumber: formData.phoneNumber,
//       dateOfBirth: formattedDateOfBirth,
//       address: formData.address,
//       permissions: {},
//       roleId: id,
//     };

//     // Send data back to the parent component
//     onSubmit(submissionData);
//   };

//   return (
//     <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-md">
//       <h2 className="text-2xl font-bold text-center my-4 text-black">Free Registration For {title}</h2>

//       <form onSubmit={handleSubmit} className="space-y-4">
//         {/* Email Address */}
//         <div className="relative">
//           <FaEnvelope className="absolute left-3 top-3 text-gray-500" />
//           <input
//             type="email"
//             name="email"
//             value={formData.email}
//             onChange={handleChange}
//             required
//             placeholder="Email Address"
//             className="w-full pl-10 pr-3 py-2 border rounded-md bg-gray-100 focus:ring-2 focus:ring-black"
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
//             className="w-full pl-10 pr-10 py-2 border rounded-md bg-gray-100 focus:ring-2 focus:ring-black"
//           />
//           <button
//             type="button"
//             className="absolute right-3 top-3 text-gray-500"
//             onClick={() => setPasswordVisible(!passwordVisible)}
//           >
//             {passwordVisible ? <IoMdEyeOff /> : <IoMdEye />}
//           </button>
//         </div>

//         {/* Name Fields */}
//         <div className="grid grid-cols-2 gap-4">
//           <div className="relative">
//             <FaUser className="absolute left-3 top-3 text-gray-500" />
//             <input
//               type="text"
//               name="firstName"
//               value={formData.firstName}
//               onChange={handleChange}
//               placeholder="First Name"
//               className="w-full pl-10 pr-3 py-2 border rounded-md bg-gray-100 focus:ring-2 focus:ring-black"
//             />
//           </div>
//           <div className="relative">
//             <FaUser className="absolute left-3 top-3 text-gray-500" />
//             <input
//               type="text"
//               name="lastName"
//               value={formData.lastName}
//               onChange={handleChange}
//               placeholder="Last Name"
//               className="w-full pl-10 pr-3 py-2 border rounded-md bg-gray-100 focus:ring-2 focus:ring-black"
//             />
//           </div>
//         </div>

//         {/* Screen Name */}
//         <div className="relative">
//           <FaUser className="absolute left-3 top-3 text-gray-500" />
//           <input
//             type="text"
//             name="screenName"
//             value={formData.screenName}
//             onChange={handleChange}
//             placeholder="Screen Name"
//             className="w-full pl-10 pr-3 py-2 border rounded-md bg-gray-100 focus:ring-2 focus:ring-black"
//           />
//         </div>

//         {/* Phone Number */}
//         <div className="relative">
//           <FaPhone className="absolute left-3 top-3 text-gray-500" />
//           <input
//             type="text"
//             name="phoneNumber"
//             value={formData.phoneNumber}
//             onChange={handleChange}
//             placeholder="Phone Number"
//             className="w-full pl-10 pr-3 py-2 border rounded-md bg-gray-100 focus:ring-2 focus:ring-black"
//           />
//         </div>

//         {/* Date of Birth */}
//         <div>
//           <label className="block text-sm font-medium">Date of Birth</label>
//           <div className="grid grid-cols-3 gap-2">
//             <select name="day" value={formData.dateOfBirth.day} onChange={handleChange} className="w-full px-3 py-2 border rounded-md bg-gray-100">
//               <option value="">DD</option>
//               {[...Array(31)].map((_, i) => (
//                 <option key={i} value={String(i + 1)}>{i + 1}</option>
//               ))}
//             </select>
//             <select name="month" value={formData.dateOfBirth.month} onChange={handleChange} className="w-full px-3 py-2 border rounded-md bg-gray-100">
//               <option value="">MM</option>
//               {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
//                 <option key={m} value={String(m)}>{m}</option>
//               ))}
//             </select>
//             <select name="year" value={formData.dateOfBirth.year} onChange={handleChange} className="w-full px-3 py-2 border rounded-md bg-gray-100">
//               <option value="">YYYY</option>
//               {[...Array(100)].map((_, i) => (
//                 <option key={i} value={String(2024 - i)}>{2024 - i}</option>
//               ))}
//             </select>
//           </div>
//         </div>

//         {/* Address */}
//         <div className="relative">
//           <FaMapMarkerAlt className="absolute left-3 top-3 text-gray-500" />
//           <input
//             type="text"
//             name="address"
//             value={formData.address}
//             onChange={handleChange}
//             placeholder="Full Address"
//             className="w-full pl-10 pr-3 py-2 border rounded-md bg-gray-100 focus:ring-2 focus:ring-black"
//           />
//         </div>

//         {/* Submit Button */}
//         <button type="submit" className="w-full py-3 bg-black text-white font-bold rounded-md hover:bg-blue-700">
//           Join now for free
//         </button>
//       </form>
//     </div>
//   );
// };

// export default ClientGeneralForm;
