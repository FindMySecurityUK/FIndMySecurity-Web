"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { UserCircle,UserPlus  } from "@phosphor-icons/react";
import { Cross, Lock, Menu, LogOut  } from "lucide-react";
import { useRouter } from 'next/navigation'
import ResourcesDropdown from "@/sections/Navbar_Menus/ResourcesDropdown";
import DynamicDropdown from "@/sections/Navbar_Menus/DynamicDropdown";
import MobileDynamicDropdown from "@/sections/Navbar_Menus/MobileDropdown";
import MobileResourcesDropdown from "@/sections/Navbar_Menus/MobileResourcesDropdown";
// import '@/sections/Navbar_Menus/nav.css'
export default function Navbar() {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const storedData = localStorage.getItem("authToken");
    if (storedData) {
      setProfileData(JSON.parse(storedData)); // Parse JSON data
    }
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdown("");
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };

  });
  const handleLogout = () => {
    localStorage.removeItem("loginData"); // Remove user session
    localStorage.removeItem("profileData"); // Remove user session
    localStorage.removeItem("roleId"); // Remove user session
    localStorage.removeItem("createdPublicProfiles"); // Remove user session
    localStorage.removeItem("authToken"); // Remove user session


    setProfileData(null); // Update state to reflect logout
    router.push('/')
  };


  return (
    <>
      <nav className="bg-black bg-opacity-90 backdrop-blur-md px-0 sm:px-0 md:px-0 lg:px-0 xl:px-16 text-white fixed top-0 left-0 shadow-md z-50 w-full">
      <div className="container mx-auto px-3 py-5 flex items-center justify-between">

        {/* Logo */}

        <Link href="/" className="flex items-center gap-3 text-2xl font-bold">
          <img
            src="/pro-icons/FindMySecurity-New-Logo.png"
            alt="Logo"
            width={35}
            height={35}
            className="rounded-md"
          />
          <span>FindMySecurity</span>
        </Link>
        <button
          className="xl:hidden text-white text-3xl"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <Cross /> : <Menu />}
        </button>

        {/* Desktop Menu */}
        <div className="hidden xl:flex space-x-4">
          {/* Solution Dropdown */}
          <DynamicDropdown jsonFile="secuirty_professional.json" title="Security Professionals" basePath="/professionals/" />
          <DynamicDropdown jsonFile="secuirty_services.json" title="Security Services" basePath="/services/" />
          <DynamicDropdown jsonFile="training_providers.json" title="Training Providers" basePath="/providers/" />

          <a href="https://insyncinsurance.co.uk/findmysecurity-ltd/" target="_blank" rel="noopener noreferrer" className="text-md font-semibold hover:text-gray-400">
            Insurance Cover
          </a>
          <ResourcesDropdown />

        </div>
        {profileData ? (
          <>
            <div className="hidden xl:flex items-center space-x-4">

              <button onClick={handleLogout} className="text-white flex items-center space-x-2 ease-in-out hover:text-gray-200">
                <LogOut className="h-4 w-4" />
                <span className="font-bold">Logout</span>
              </button>
              <Link
      href="/profile"
      className="relative flex items-center text-white rounded-full transition-all duration-300 hover:bg-gray-100 group"
    >
      {/* Profile Icon */}
      <UserCircle size={32} weight="fill" className="text-white transition-all duration-300 group-hover:text-gray-700" />

      {/* Hover Tooltip */}
      <span className="absolute left-full ml-1 px-1 py-1 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-lg opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 whitespace-nowrap">
        Profile
      </span>
    </Link>


            </div>
          </>

        )
          : (
            <>
              <div className="hidden xl:flex items-center space-x-4">
                {/* <Link href="/signup" className="bg-white text-black px-4 py-1 font-bold rounded-full text-center ease-in-out hover:bg-gray-200">
                  Sign Up
                </Link> */}
 
                <Link href="/signin" className="text-white flex items-center space-x-2 ease-in-out hover:text-gray-200">
                  <Lock className="h-4 w-4" />
                  <span className="font-bold">Web Login</span>
                </Link>
                <Link
      href="/signup"
      className="relative flex items-center text-white rounded-full transition-all duration-300 hover:bg-gray-100 group "
    >
      {/* Signup Icon */}
      <UserPlus size={32} weight="fill" className="text-white transition-all duration-300 group-hover:text-gray-700" />

      {/* Hover Tooltip */}
      <span className="absolute left-full ml-1 px-1 py-1 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-lg opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 whitespace-nowrap">
        Signup
      </span>
    </Link>
              </div>

            </>
          )}
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div 
        
        className="xl:hidden bg-black text-white p-4 max-h-[90vh] overflow-y-auto"
        // className="md:hidden bg-black text-white p-4"
        >

          {/* Solution Dropdown */}
          <MobileDynamicDropdown jsonFile="secuirty_professional.json" title="Security Professionals" basePath="/professionals/" />
          <MobileDynamicDropdown jsonFile="secuirty_services.json" title="Security Services" basePath="/services/" />
          <MobileDynamicDropdown jsonFile="training_providers.json" title="Training Providers" basePath="/providers/" />
          <Link href="https://insyncinsurance.co.uk/findmysecurity-ltd/" className="block ml-4 py-2 hover:text-gray-300">
            Insurance Cover
          </Link>
          <MobileResourcesDropdown />
          {profileData ? (
            <>

              <button onClick={handleLogout} className="block py-2 ml-4 text-center hover:text-gray-300">
                Logout
              </button>
              <Link href="/profile" className="block py-2 bg-white text-black text-center rounded">
                My Profile
              </Link>
            </>

          )
            : (
              <>
                <Link href="/signup" className="block py-2 bg-white text-black text-center rounded">
                  Sign Up
                </Link>
                <Link href="/signin" className="block py-2 text-center hover:text-gray-300">
                  Web Login
                </Link>
              </>
            )}


        </div>
      )}
    </nav>
    </>
  );
}
