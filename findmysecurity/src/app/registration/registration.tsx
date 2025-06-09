"use client";

import { useState } from "react";
import { FaUser, FaEnvelope, FaLock, FaMapMarkerAlt } from "react-icons/fa";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";

const ClientGeneralForm = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    screenName: "",
    dateOfBirth: { day: "", month: "", year: "" },
    addressLine1: "",
    addressLine2: "",
    town: "",
    postcode: "",
    receiveEmails: false,
    acceptTerms: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    if (e.target instanceof HTMLInputElement && type === "checkbox") {
      setFormData({ ...formData, [name]: e.target.checked });
    } else if (["day", "month", "year"].includes(name)) {
      setFormData({
        ...formData,
        dateOfBirth: { ...formData.dateOfBirth, [name]: value },
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-md">
      <h2 className="text-2xl font-bold text-center mb-4 text-black">Free Registration</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email Address */}
        <div className="relative">
          <FaEnvelope className="absolute left-3 top-3 text-gray-500" />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="Email Address"
            className="w-full pl-10 pr-3 py-2 border rounded-md bg-gray-100 focus:ring focus:ring-blue-300"
          />
        </div>

        {/* Password */}
        <div className="relative">
          <FaLock className="absolute left-3 top-3 text-gray-500" />
          <input
            type={passwordVisible ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            placeholder="Password"
            className="w-full pl-10 pr-10 py-2 border rounded-md bg-gray-100 focus:ring focus:ring-blue-300"
          />
          <button
            type="button"
            className="absolute right-3 top-3 text-gray-500"
            onClick={() => setPasswordVisible(!passwordVisible)}
          >
            {passwordVisible ? <IoMdEyeOff /> : <IoMdEye />}
          </button>
        </div>

        {/* Name Fields */}
        <div className="grid grid-cols-2 gap-4">
          <div className="relative">
            <FaUser className="absolute left-3 top-3 text-gray-500" />
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="First Name"
              className="w-full pl-10 pr-3 py-2 border rounded-md bg-gray-100 focus:ring focus:ring-blue-300"
            />
          </div>
          <div className="relative">
            <FaUser className="absolute left-3 top-3 text-gray-500" />
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Last Name"
              className="w-full pl-10 pr-3 py-2 border rounded-md bg-gray-100 focus:ring focus:ring-blue-300"
            />
          </div>
        </div>

        {/* Screen Name */}
        <div className="relative">
          <FaUser className="absolute left-3 top-3 text-gray-500" />
          <input
            type="text"
            name="screenName"
            value={formData.screenName}
            onChange={handleChange}
            placeholder="Screen Name"
            className="w-full pl-10 pr-3 py-2 border rounded-md bg-gray-100 focus:ring focus:ring-blue-300"
          />
        </div>

        {/* Date of Birth */}
        <div>
          <label className="block text-sm font-medium">Date of Birth</label>
          <div className="grid grid-cols-3 gap-2">
            <select name="day" value={formData.dateOfBirth.day} onChange={handleChange} className="w-full px-3 py-2 border rounded-md bg-gray-100">
              <option value="">DD</option>
              {[...Array(31)].map((_, i) => (
                <option key={i} value={i + 1}>{i + 1}</option>
              ))}
            </select>
            <select name="month" value={formData.dateOfBirth.month} onChange={handleChange} className="w-full px-3 py-2 border rounded-md bg-gray-100">
              <option value="">Month</option>
              {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map((m, i) => (
                <option key={i} value={i + 1}>{m}</option>
              ))}
            </select>
            <select name="year" value={formData.dateOfBirth.year} onChange={handleChange} className="w-full px-3 py-2 border rounded-md bg-gray-100">
              <option value="">YYYY</option>
              {[...Array(100)].map((_, i) => (
                <option key={i} value={2024 - i}>{2024 - i}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Address Fields */}
        <div className="relative">
          <FaMapMarkerAlt className="absolute left-3 top-3 text-gray-500" />
          <input
            type="text"
            name="addressLine1"
            value={formData.addressLine1}
            onChange={handleChange}
            placeholder="Address Line 1"
            className="w-full pl-10 pr-3 py-2 border rounded-md bg-gray-100"
          />
        </div>

        {/* Marketing Emails Checkbox */}
        <div className="flex items-center space-x-2">
          <input type="checkbox" name="receiveEmails" checked={formData.receiveEmails} onChange={handleChange} className="w-4 h-4" />
          <label className="text-sm">
            Please tick here if you would like to receive occasional <strong>Find4Security</strong> emails and information.
          </label>
        </div>

        {/* Terms and Conditions Checkbox */}
        <div className="flex items-center space-x-2">
          <input type="checkbox" name="acceptTerms" checked={formData.acceptTerms} onChange={handleChange} required className="w-4 h-4" />
          <label className="text-sm">
            Please tick here to confirm that you have read our <a href="/legal/terms" className="text-black underline">Terms and Conditions</a>.
          </label>
        </div>

        {/* Submit Button */}
        <button type="submit" className="w-full py-3 bg-black text-white font-bold rounded-md hover:bg-blue-700">
          Join now for free
        </button>
      </form>
    </div>
  );
};

export default ClientGeneralForm;
