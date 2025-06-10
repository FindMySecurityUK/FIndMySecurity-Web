import { useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";

const whatWeDo = [
  { title: "Our Purpose", id: "our-purpose", link: "/our-purpose" },
  { title: "Our Values", id: "our-values", link: "/our-values" },
  { title: "Who We Are", id: "who-we-are", link: "/who-we-are" },
  { title: "What we do", id: "what-we-do", link: "/what-we-do" },
  { title: "Contact US ", id: "contact-us ", link: "/contact-us" },
  { title: "AI Chatbot", id: "chatbot", link: "/chatbot-ui" },
];

const MobileResourcesDropdown = () => {
  const [openDropdown, setOpenDropdown] = useState(false);

  return (
    <div className="w-full text-white">
      {/* Main Dropdown Button */}
      <button
        className="w-full text-left py-2 px-4 flex justify-between items-center border-b border-gray-600"
        onClick={() => setOpenDropdown(!openDropdown)}
      >
        Resources
        <ChevronDown className={`h-5 w-5 transition-transform  ${openDropdown ? "rotate-180" : ""}`} />
      </button>

      {/* Dropdown Content */}
      {openDropdown && (
        <div className="pl-4 border-l border-gray-600">
          {whatWeDo.map((item) => (
            <Link
              key={item.id}
              href={item.link}
              className="block py-2 hover:text-gray-300"
            >
              {item.title}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default MobileResourcesDropdown;
