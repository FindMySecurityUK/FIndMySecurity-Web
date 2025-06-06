"use client";
import React, { JSX, useState, useEffect, useRef } from "react";
import AnimateOnScrollProvider from "@/sections/components/animation/AnimateOnScrollProvider";
import { Snackbar, Alert, Backdrop, CircularProgress } from "@mui/material";
import { useRouter } from "next/navigation";
import {
  FaMobileAlt,
  FaHome,
  FaEnvelope,
  FaBriefcase,
  FaFilePdf,
  FaFileImage,
  FaFileWord,
  FaFileExcel,
  FaFilePowerpoint,
  FaFileArchive,
  FaFileAlt,
  FaFileCode,
  FaFileAudio,
  FaFileVideo,
  FaDownload,
  FaSearch,
  FaSpinner,
  FaPlus,
  FaTrash,
} from "react-icons/fa";
import {
  TextField,
  Button,
  Chip,
  Divider,
  IconButton,
  Tooltip,
  Menu,
  MenuItem,
  InputAdornment,
  Badge,
  Avatar,
  Typography,
} from "@mui/material";
import { Delete, MoreVert, FileUpload, CloudDownload } from "@mui/icons-material";
import { uploadToS3 } from "@/utils/s3file";
import axios from 'axios';
import SubscriptionPopup from "@/sections/components/Subscription-plan-popup/SubscriptionPopup";
import SubscriptionBox from "./components/SubscriptionBox";
import { API_URL } from "@/utils/path";
 // adjust path as needed

 
interface SubscriptionDetails {
  status: string;
  startDate: string;
  endDate: string;
  nextInvoiceAmount: string;
  stripeProductName: string;
  tierName: string;
}

interface PaymentMethod {
  card: {
    brand: string;
    last4: string;
    exp_month: number;
    exp_year: number;
  };
  billing_details: {
    name: string;
    email: string;
    address: {
      country: string | null;
    };
  };
}
// interface Document {
//   id?: string;
//   url: string;
//   name: string;
//   type: string;
//   size: string;
//   uploadedAt: string;
//   loading?: boolean;
//   status?: string;
// }

interface Document {
  id?: string;
  url: string; // Permanent S3 URL
  signedUrl: string; // GET pre-signed URL for metadata
  name: string;
  type: string;
  size: string;
  uploadedAt: string;
  loading?: boolean;
  status?: string;
}

interface ActionButtonsProps {
  loginData: any;
  roleId: number;
  updateProfile: (updatedData: any) => void;
  refreshUserData: () => Promise<void>;
}

const fileTypeIcons: Record<string, JSX.Element> = {
  pdf: <FaFilePdf className="text-red-500" />,
  jpg: <FaFileImage className="text-green-500" />,
  jpeg: <FaFileImage className="text-green-500" />,
  png: <FaFileImage className="text-green-500" />,
  gif: <FaFileImage className="text-green-500" />,
  doc: <FaFileWord className="text-blue-500" />,
  docx: <FaFileWord className="text-blue-500" />,
  xls: <FaFileExcel className="text-green-600" />,
  xlsx: <FaFileExcel className="text-green-600" />,
  ppt: <FaFilePowerpoint className="text-orange-500" />,
  pptx: <FaFilePowerpoint className="text-orange-500" />,
  zip: <FaFileArchive className="text-yellow-500" />,
  rar: <FaFileArchive className="text-yellow-500" />,
  txt: <FaFileAlt className="text-gray-500" />,
  csv: <FaFileCode className="text-blue-300" />,
  json: <FaFileCode className="text-yellow-300" />,
  mp3: <FaFileAudio className="text-purple-500" />,
  wav: <FaFileAudio className="text-purple-500" />,
  mp4: <FaFileVideo className="text-red-400" />,
  mov: <FaFileVideo className="text-red-400" />,
};

const ActionButtons: React.FC<ActionButtonsProps> = ({
  loginData,
  roleId,
  updateProfile,
  refreshUserData
}) => {
  const router = useRouter();

  const [isEditing, setIsEditing] = useState(false);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({ ...loginData });
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loadingDocuments, setLoadingDocuments] = useState(true);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  const [subscriptionDetails, setSubscriptionDetails] = useState<SubscriptionDetails | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);

  const [error, setError] = useState<string | null>(null);
  const shouldShowDocuments = roleId === 3;
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleClick = () => {
    inputRef.current?.click(); // open file dialog
  };
 useEffect(() => {
    const fetchSubscriptionDetails = async () => {
      try {
        const token = localStorage.getItem('authToken')?.replace(/^"|"$/g, '');

        const response = await axios.get(
          `${API_URL}/stripe/get-subscription-details?userId=${loginData?.id || loginData?.userId || 1}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const { success, result, message } = response.data;

        if (success) {
          setSubscriptionDetails(result.subscriptionDetails);
          setPaymentMethod(result.paymentMethod);
        } else {
          throw new Error(message || 'Failed to fetch subscription');
        }
      } catch (err: any) {
        setError(err.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptionDetails();
  }, []);
//   const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const token = localStorage.getItem("authToken")?.replace(/^"|"$/g, '');
//     const file = e.target.files?.[0];
//     if (!file) return;

//     setLoading(true);

//     try {
//       const {fileUrl , signedUrl} = await uploadToS3({ file });

//       if (!fileUrl || typeof fileUrl !== "string" || !fileUrl.startsWith("http")) {
//         throw new Error("Invalid S3 URL returned");
//       }

//       const dbRes = await fetch(`${API_URL}/document/upload`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           url: encodeURI(fileUrl),
//           userId: loginData?.id || loginData?.userId || 1,
//         }),
//       });

//       const dbResult = await dbRes.json();
//       // console.log("dbResult",dbResult)
//       if (!dbRes.ok) {
//         throw new Error("DB Save Failed");
//       }
// // console.log(signedUrl)
//       const newDoc = await fetchDocumentDetails(signedUrl);
//       setDocuments((prev) => [...prev, newDoc]);
//       await refreshUserData();

//       setSnackbar({ open: true, message: 'Document uploaded successfully!', severity: 'success' });
//     } catch (err) {
//       console.error("Upload Error:", err);
//       setSnackbar({ open: true, message: 'Document upload failed.', severity: 'error' });
//     } finally {
//       setLoading(false);
//     }
//   };
const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const token = localStorage.getItem("authToken")?.replace(/^"|"$/g, "");
  const file = e.target.files?.[0];
  if (!file) return;

  setLoading(true);
  try {
    const { fileUrl, signedUrl } = await uploadToS3({ file });
    if (!fileUrl || typeof fileUrl !== "string" || !fileUrl.startsWith("http")) {
      throw new Error("Invalid S3 URL returned");
    }

    const dbRes = await fetch(`${API_URL}/document/upload`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        url: fileUrl,
        key: fileUrl.split("/").pop(), // Store S3 key
        userId: loginData?.id || loginData?.userId || 1,
      }),
    });

    const dbResult = await dbRes.json();
    if (!dbRes.ok) {
      throw new Error("DB Save Failed: " + dbResult.message);
    }

    console.log("GET signedUrl:", signedUrl, "Timestamp:", new Date().toISOString());
    const newDoc = await fetchDocumentDetails(signedUrl); // Use GET signed URL
    setDocuments((prev) => [...prev, { ...newDoc, id: dbResult.id }]);
    await refreshUserData();
    setSnackbar({ open: true, message: "Document uploaded successfully!", severity: "success" });
  } catch (err) {
    console.error("Upload Error:", err);
    setSnackbar({ open: true, message: "Document upload failed.", severity: "error" });
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  const loadDocuments = async () => {
    const rawDocuments = loginData?.individualProfessional?.documents || [];
    setLoadingDocuments(true);
    const initialDocuments = rawDocuments.map((doc: any) => ({
      id: doc.id,
      url: doc.url,
      signedUrl: doc.url, // Temporary placeholder
      name: decodeURIComponent(doc.url?.split("/").pop() || "Document"),
      type: doc.url?.split(".").pop()?.toUpperCase() || "FILE",
      size: "Loading...",
      uploadedAt: doc.uploadedAt,
      status: doc.status,
      loading: true,
    }));
    setDocuments(initialDocuments);

    try {
      const token = localStorage.getItem("authToken")?.replace(/^"|"$/g, "");
      const response = await fetch(`${API_URL}/document/generate-presigned-urls`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ documentIds: rawDocuments.map((doc: any) => doc.id) }),
      });
      const { urls } = await response.json();
      if (!response.ok) {
        throw new Error("Failed to fetch pre-signed URLs");
      }

      console.log("Pre-signed URLs:", urls);
      const detailedDocuments = await Promise.all(
        urls.map((item: { signedUrl: string }) => fetchDocumentDetails(item.signedUrl))
      );
      const mergedDocuments = initialDocuments.map((doc: { id: string; url: string }) => {
        const detail = detailedDocuments.find((d) => d.url === doc.url);
        return detail ? { ...doc, ...detail, id: doc.id, loading: false } : doc;
      });
      setDocuments(mergedDocuments);
    } catch (err) {
      console.error("Error loading document details:", err);
    } finally {
      setLoadingDocuments(false);
    }
  };
  if (loginData?.individualProfessional?.documents) {
    loadDocuments();
  }
}, [loginData]);
  // const fetchDocumentDetails = async (url: string): Promise<Document> => {
  //   try {
  //     const response = await fetch(url, { method: 'HEAD' });
      
  //     if (!response.ok) {
  //       throw new Error(`HTTP error! status: ${response.status}`);
  //     }
      
  //     const contentLength = response.headers.get('content-length');
  //     const lastModified = response.headers.get('last-modified');
      
  //     const fileName = decodeURIComponent(url.split('/').pop() || "Document");
  //     const fileType = url.split('.').pop()?.toUpperCase() || 'FILE';
  //     return {
  //       url,
  //       name: fileName,
  //       type: fileType,
  //       size: contentLength ? formatFileSize(parseInt(contentLength)) : 'Unknown',
  //       uploadedAt: lastModified ? new Date(lastModified).toLocaleDateString() : 'Unknown date',
  //       loading: false
  //     };
  //   } catch (error) {
  //     console.error(`Error fetching document details for ${url}:`, error);
  //     return {
  //       url,
  //       name: decodeURIComponent(url.split('/').pop() || "Document"),
  //       type: url.split('.').pop()?.toUpperCase() || 'FILE',
  //       size: 'Unknown',
  //       uploadedAt: 'Unknown date',
  //       loading: false
  //     };
  //   }
  // };
  const fetchDocumentDetails = async (signedUrl: string): Promise<Document> => {
    try {
      console.log("Fetching details for:", signedUrl);
      const response = await fetch(signedUrl, { method: "HEAD" });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const contentLength = response.headers.get("content-length");
      const lastModified = response.headers.get("last-modified");
      const fileName = decodeURIComponent(signedUrl.split("/").pop()?.split("?")[0] || "Document");
      const fileType = fileName.split(".").pop()?.toUpperCase() || "FILE";
  
      return {
        url: signedUrl.split("?")[0], // Permanent URL
        signedUrl, // GET signed URL
        name: fileName,
        type: fileType,
        size: contentLength ? formatFileSize(parseInt(contentLength)) : "Unknown",
        uploadedAt: lastModified ? new Date(lastModified).toLocaleDateString() : "Unknown date",
        loading: false,
      };
    } catch (error) {
      console.error(`Error fetching document details for ${signedUrl}:`, error);
      return {
        url: signedUrl.split("?")[0],
        signedUrl,
        name: decodeURIComponent(signedUrl.split("/").pop()?.split("?")[0] || "Document"),
        type: signedUrl.split(".").pop()?.split("?")[0]?.toUpperCase() || "FILE",
        size: "Unknown",
        uploadedAt: "Unknown date",
        loading: false,
      };
    }
  };
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  useEffect(() => {
    const loadDocuments = async () => {
      const rawDocuments = loginData?.individualProfessional?.documents || [];
      setLoadingDocuments(true);
  
      const initialDocuments = rawDocuments.map((doc: any) => ({
        id: doc.id,
        url: doc.url,
        name: decodeURIComponent(doc.url?.split('/').pop() || 'Document'),
        type: doc.url?.split('.').pop()?.toUpperCase() || 'FILE',
        size: 'Loading...',
        uploadedAt: doc.uploadedAt,
        status: doc.status,
        loading: true,
      }));
  
      setDocuments(initialDocuments);
  
      try {
        const detailedDocuments = await Promise.all(
          rawDocuments.map((doc: any) => fetchDocumentDetails(doc.url))
        );
  
        const mergedDocuments = initialDocuments.map((doc: { url: any; }) => {
          const detail = detailedDocuments.find(d => d.url === doc.url);
          return detail
            ? {
                ...doc,
                ...detail,
                loading: false,
              }
            : doc;
        });
  
        setDocuments(mergedDocuments);
      } catch (err) {
        console.error("Error loading document details:", err);
      } finally {
        setLoadingDocuments(false);
      }
    };
  
    if (loginData?.individualProfessional?.documents) {
      loadDocuments();
    }
  }, [loginData]);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, doc: Document) => {
    setAnchorEl(event.currentTarget);
    setSelectedDoc(doc);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedDoc(null);
  };

  const handleDeleteDocument = async (docId?: string) => {
    if (!docId) return;
    
    setDeletingId(docId);
    const token = localStorage.getItem("authToken")?.replace(/^"|"$/g, '');
    
    try {
      const response = await fetch(`${API_URL}/document/${docId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete document');
      }

      setDocuments(prev => prev.filter(doc => doc.id !== docId));
      await refreshUserData();
      setSnackbar({ open: true, message: 'Document deleted successfully!', severity: 'success' });
    } catch (error) {
      console.error('Error deleting document:', error);
      setSnackbar({ open: true, message: 'Failed to delete document', severity: 'error' });
    } finally {
      setDeletingId(null);
      handleMenuClose();
    }
  };

  const handleDelete = () => {
    if (selectedDoc?.id) {
      handleDeleteDocument(selectedDoc.id);
    }
  };

  const handleDownload = () => {
    if (selectedDoc) window.open(selectedDoc.url, "_blank");
    handleMenuClose();
  };

  const filteredDocuments = documents.filter(doc =>
    doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (doc.status?.toLowerCase() || '').includes(searchQuery.toLowerCase())
  );

  const documentGroups = filteredDocuments.reduce((groups: Record<string, Document[]>, doc) => {
    const type = doc.type;
    if (!groups[type]) groups[type] = [];
    groups[type].push(doc);
    return groups;
  }, {});

const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const { name, value } = e.target;
  setFormData((prev: any) => ({
    ...prev,
    [name]: value,
  }));
};


const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  // Show preview immediately
  const imageUrl = URL.createObjectURL(file);
  setProfilePhoto(imageUrl);
setLoading(true);
  try {
    // Upload to S3
    const {fileUrl, signedUrl} = await uploadToS3({ file });
    console.log(fileUrl)
    // Store uploaded file URL in formData
    if(fileUrl){
    setFormData((prev: any) => ({
      ...prev,
      profile: fileUrl, // store S3 URL, not the file itself
    }));
  
  }
  } catch (err) {
    console.error('Image upload failed:', err);
     setLoading(false);
    alert('Failed to upload image. Please try again.');
  }
    setLoading(false);
  console.log(formData);
};
const isSubscriber = loginData?.isSubscriber;
const tier = loginData?.subscriptionTier;

let ringClass = '';
if (isSubscriber && tier !== 'Basic') {
  if (tier === 'Standard') ringClass = 'ring-6 ring-gray-400'; // silver
  else if (tier === 'Premium') ringClass = 'ring-6 ring-yellow-500'; // gold
}


  const handleSubmit = () => {
    updateProfile(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({ ...loginData });
    setIsEditing(false);
  };

  const profileData = loginData.profile|| loginData?.individualProfessional?.profile?.profilePhoto || '';
  const finalImage = profilePhoto || profileData || "/images/profile.png";
  
  return (
    <div className="w-full max-w-5xl mx-auto p-4 space-y-6">
      <div className="flex flex-col items-center md:flex-row md:items-center md:space-x-6">
        <div className="relative w-28 h-28 rounded-full shadow-lg shadow-gray-400 hover:scale-105 transition-transform duration-300">
         <img
  src={finalImage}
  alt="Profile"
  className={`w-full h-full object-cover rounded-full ${ringClass}`}
/>

          {isEditing && (
            <>
              <input
                id="profilePhoto"
                type="file"
                accept="image/*"
                name="profile"
                onChange={handleImageChange}
                className="hidden"
              />
              <label
                htmlFor="profilePhoto"
                className="absolute bottom-0 left-0 right-0 text-center bg-black bg-opacity-70 text-white text-xs py-1 cursor-pointer rounded-b-lg hover:bg-opacity-90 transition"
              >
                Upload Image
              </label>
            </>
          )}
        </div>

        <div className="text-center md:text-left mt-4 md:mt-0 space-y-1">
          <h2 className="text-2xl font-semibold text-gray-800">
            {formData?.firstName || formData?.lastName
              ? `${formData.firstName} ${formData.lastName}`
              : "Mr. Y"}
          </h2>
          <h2 className="text-xl text-gray-600">{formData?.screenName ?? "Mr."}</h2>
          {roleId === 3 ? ( <p className="text-gray-500">
            
            {"Security Professional"}</p>):(
          
          <p className="text-gray-500">
            
            {loginData?.role?.name ?? loginData?.role ?? "Security Officer"}
          </p>
            )}
          {/* <span className="text-sm text-yellow-500"> */}
            {/* ✅ Usually responds within 1 hour */}
          {/* </span> */}
        </div>
      </div>

      <div className="flex flex-wrap mt-6 gap-4">
        <div className="w-full md:w-[48%]">
          <TextField
            label="First Name"
            name="firstName"
            value={formData.firstName || ""}
            onChange={handleInputChange}
            disabled={!isEditing}
            fullWidth
            size="small"
          />
        </div>
        <div className="w-full md:w-[48%]">
          <TextField
            label="Last Name"
            name="lastName"
            value={formData.lastName || ""}
            onChange={handleInputChange}
            disabled={!isEditing}
            fullWidth
            size="small"
          />
        </div>

        <div className="w-full">
          <TextField
            label="Screen Name"
            name="screenName"
            value={formData.screenName || ""}
            onChange={handleInputChange}
            disabled={!isEditing}
            fullWidth
            size="small"
          />
        </div>

        <div className="w-full md:w-[48%]">
          <TextField
            label="Email"
            name="email"
            value={formData.email || ""}
            onChange={handleInputChange}
            disabled={!isEditing}
            fullWidth
            size="small"
          />
        </div>
        <div className="w-full md:w-[48%]">
          <TextField
            label="Phone Number"
            name="phoneNumber"
            value={formData.phoneNumber || ""}
            onChange={handleInputChange}
            disabled={!isEditing}
            fullWidth
            size="small"
          />
        </div>

        <div className="w-full">
          <TextField
            label="Address"
            name="address"
            value={formData.address || ""}
            onChange={handleInputChange}
            disabled={!isEditing}
            fullWidth
            size="small"
          />
        </div>
      </div>

      <div className="mt-3 flex flex-col md:flex-row">
        {isEditing ? (
          <>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              fullWidth
              sx={{ bgcolor: "black", ":hover": { bgcolor: "#333" } }}
            >
              Save Profile
            </Button>
            <Button
              variant="outlined"
              onClick={handleCancel}
              fullWidth
              sx={{ color: "black", borderColor: "black" }}
            >
              Back
            </Button>
          </>
        ) : (
          <Button
            onClick={() => setIsEditing(true)}
            fullWidth
            variant="contained"
            sx={{ bgcolor: "black", ":hover": { bgcolor: "#333" } }}
          >
            Update Profile
          </Button>
        )}
      </div>

      {/* Upgrade Button */}
      {!isEditing &&  !loginData.isSubscriber &&(
        <></>
        // <Button
        //   fullWidth
        //    onClick={() => setOpen(true)}
        //   variant="contained"
        //   sx={{ bgcolor: "#f97316", ":hover": { bgcolor: "#ea580c" } }}
        // >
        //   Upgrade My Membership
        // </Button>
      )}
             {loginData.isSubscriber && (
    
      <SubscriptionBox
        subscriptionDetails={
          subscriptionDetails ?? {
            status: "",
            startDate: "",
            endDate: "",
            nextInvoiceAmount: "",
            stripeProductName: "",
            tierName: ""
          }
        }
        paymentMethod={
          paymentMethod ?? {
            card: {
              brand: "",
              last4: "",
              exp_month: 0,
              exp_year: 0,
            },
            billing_details: {
              name: "",
              email: "",
              address: {
                country: null,
              },
            },
          }
        }
      />
 
          )}

      {/* Documents Section Block */}

      {shouldShowDocuments && (
  <AnimateOnScrollProvider>
    <div className="space-y-6 mt-5">
      <Divider className="my-4">
        <Chip
          label={
            <div className="flex items-center space-x-2">
              <CloudDownload />
              <span>My Documents ({documents.length})</span>
            </div>
          }
          color="primary"
        />
      </Divider>
      <div className="flex flex-col md:flex-row justify-between gap-4 mt-3">
        <div className="flex flex-col sm:flex-row items-center gap-2 w-full">
          <TextField
            size="small"
            placeholder="Search documents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <FaSearch className="text-gray-400" />
                </InputAdornment>
              ),
            }}
            sx={{ flex: 1, maxWidth: { xs: "100%", sm: 400 } }}
          />
          <>
            <input
              type="file"
              accept="*/*"
              ref={inputRef}
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
            <Button
              variant="contained"
              startIcon={<FaPlus />}
              onClick={handleClick}
              sx={{
                bgcolor: "primary.main",
                whiteSpace: "nowrap",
                minWidth: "fit-content",
                width: { xs: "100%", sm: "auto" },
              }}
            >
              Add Documents
            </Button>
            <Backdrop open={loading} sx={{ zIndex: 9999, color: "#fff" }}>
              <CircularProgress color="inherit" />
            </Backdrop>
            <Snackbar
              open={snackbar.open}
              autoHideDuration={4000}
              onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
              anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
              <Alert
                onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
                severity={snackbar.severity}
                sx={{ width: "100%" }}
              >
                {snackbar.message}
              </Alert>
            </Snackbar>
          </>
        </div>
      </div>

      {loadingDocuments && (
        <div className="flex justify-center items-center py-8">
          <FaSpinner className="animate-spin text-2xl text-gray-400 mr-2" />
          <Typography variant="body1" className="text-gray-500">
            Loading documents...
          </Typography>
        </div>
      )}

      {!loadingDocuments &&
        Object.entries(documentGroups).map(([type, docs]) => (
          <div key={type} className="space-y-6">
            <div className="flex justify-between items-center px-2">
              <Typography variant="h6" className="font-semibold text-gray-700">
                {type} Files ({docs.length})
              </Typography>
              <Typography variant="body2" className="text-gray-500">
                {docs.length} items
              </Typography>
            </div>

            <div className="space-y-4">
              {docs.map((doc, index) => {
                const docName = doc.name.split("-").slice(1).join(" ").replace(/\.[^/.]+$/, "");
                const chipStyles =
                  doc.status === "PENDING"
                    ? { color: "#D97706", bgcolor: "#FEF3C7" }
                    : doc.status === "APPROVED"
                    ? { color: "#16A34A", bgcolor: "#DCFCE7" }
                    : doc.status === "REJECTED"
                    ? { color: "#DC2626", bgcolor: "#FEE2E2" }
                    : { color: "#6B7280", bgcolor: "#F3F4F6" };

                return (
                  <div
                    key={index}
                    className="flex flex-col sm:flex-row sm:items-center gap-2 p-3 bg-white border border-gray-300 rounded-lg shadow-sm transition-all duration-200 max-w-full overflow-hidden"
                    data-aos="fade-up"
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <Avatar className="w-10 h-10 bg-gray-200 flex-shrink-0">
                        {fileTypeIcons[doc.type.toLowerCase()] || <FaFileAlt className="text-gray-600" />}
                      </Avatar>
                      <div className="flex flex-col min-w-0 flex-1">
                        <Typography
                          variant="subtitle1"
                          className="font-medium text-gray-800 truncate"
                          title={docName} // Show full name on hover
                        >
                          {docName}
                        </Typography>
                        <Typography variant="body2" className="text-gray-500 truncate">
                          {doc.loading ? (
                            <span className="flex items-center">
                              <FaSpinner className="animate-spin mr-1" size={12} />
                              Loading details...
                            </span>
                          ) : (
                            <>
                              {doc.size} • {doc.uploadedAt}
                            </>
                          )}
                        </Typography>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0 pt-2 sm:pt-0">
                      {!doc.loading && (
                        <Chip
                          size="small"
                          label={doc.status || "UNKNOWN"}
                          sx={{
                            fontWeight: "bold",
                            borderRadius: "12px",
                            padding: "2px 8px",
                            ...chipStyles,
                            minWidth: "80px",
                          }}
                        />
                      )}
                      <Tooltip title="Download">
                        <IconButton
                          size="small"
                          onClick={() => window.open(doc.signedUrl, "_blank")} // Use signedUrl
                          sx={{
                            color: "primary.main",
                            "&:hover": { color: "blue.500" },
                          }}
                        >
                          <FaDownload />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          size="small"
                          onClick={() => doc.id && handleDeleteDocument(doc.id)}
                          disabled={deletingId === doc.id}
                          sx={{
                            color: deletingId === doc.id ? "gray.500" : "red.500",
                            "&:hover": {
                              color: deletingId === doc.id ? "gray.500" : "red.700",
                              backgroundColor: deletingId === doc.id ? "transparent" : "rgba(255, 0, 0, 0.08)",
                            },
                          }}
                        >
                          {deletingId === doc.id ? <FaSpinner className="animate-spin" /> : <FaTrash />}
                        </IconButton>
                      </Tooltip>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

      {!loadingDocuments && filteredDocuments.length === 0 && (
        <div className="text-center py-8">
          <FaFileAlt className="mx-auto text-4xl text-gray-300 mb-2" />
          <Typography variant="body1" className="text-gray-500">
            {searchQuery ? "No matching documents found" : "No documents uploaded yet"}
          </Typography>
        </div>
      )}
    </div>
  </AnimateOnScrollProvider>
)}
  

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleDownload}>
          <FaDownload className="mr-2" /> Download
        </MenuItem>
        <MenuItem onClick={handleDelete}>
          <Delete className="mr-2" /> Delete
        </MenuItem>
      </Menu>
       {open && (
        <SubscriptionPopup roleId={roleId} onClose={() => setOpen(false)} />
      )}
    </div>
  );
};

export default ActionButtons;












// {shouldShowDocuments && 
//   <AnimateOnScrollProvider>
//     <div className="space-y-6 mt-5">
//       <Divider className="my-4">
//         <Chip 
//           label={
//             <div className="flex items-center space-x-2">
//               <CloudDownload />
//               <span>My Documents ({documents.length})</span>
//             </div>
//           } 
//           color="primary" 
//         />
//       </Divider>
//       <div className="flex flex-col md:flex-row justify-between gap-4 mt-3">
//         <div className="flex items-center gap-2 w-full">
//           <TextField
//             size="small"
//             placeholder="Search documents..."
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             InputProps={{
//               startAdornment: (
//                 <InputAdornment position="start">
//                   <FaSearch className="text-gray-400" />
//                 </InputAdornment>
//               ),
//             }}
//             sx={{ flex: 1, maxWidth: 400 }}
//           />
//           <>
//             <input
//               type="file"
//               accept="*/*"
//               ref={inputRef}
//               onChange={handleFileChange}
//               style={{ display: "none" }}
//             />
//             <Button
//               variant="contained"
//               startIcon={<FaPlus />}
//               onClick={handleClick}
//               sx={{
//                 bgcolor: 'primary.main',
//                 whiteSpace: 'nowrap',
//                 minWidth: 'fit-content',
//               }}
//             >
//               Add Documents
//             </Button>
//             <Backdrop open={loading} sx={{ zIndex: 9999, color: '#fff' }}>
//               <CircularProgress color="inherit" />
//             </Backdrop>
//             <Snackbar
//               open={snackbar.open}
//               autoHideDuration={4000}
//               onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
//               anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
//             >
//               <Alert onClose={() => setSnackbar(prev => ({ ...prev, open: false }))} severity={snackbar.severity} sx={{ width: '100%' }}>
//                 {snackbar.message}
//               </Alert>
//             </Snackbar>
//           </>
//         </div>
//       </div>

//       {loadingDocuments && (
//         <div className="flex justify-center items-center py-8">
//           <FaSpinner className="animate-spin text-2xl text-gray-400 mr-2" />
//           <Typography variant="body1" className="text-gray-500">
//             Loading documents...
//           </Typography>
//         </div>
//       )}

//       {!loadingDocuments && Object.entries(documentGroups).map(([type, docs]) => (
//         <div key={type} className="space-y-6">
//           <div className="flex justify-between items-center">
//             <Typography variant="h6" className="font-semibold text-gray-700">
//               {type} Files ({docs.length})
//             </Typography>
//             <Typography variant="body2" className="text-gray-500">
//               {docs.length} items
//             </Typography>
//           </div>

//           <div className="space-y-6">
//             {docs.map((doc, index) => {
//               const docName = doc.name.split('-').slice(1).join(' ').replace(/\.[^/.]+$/, '');
//               const chipStyles = doc.status === 'PENDING' 
//                 ? { color: '#D97706', bgcolor: '#FEF3C7' } // Tailwind: text-yellow-500, bg-yellow-100
//                 : doc.status === 'APPROVED' 
//                 ? { color: '#16A34A', bgcolor: '#DCFCE7' } // Tailwind: text-green-500, bg-green-100
//                 : doc.status === 'REJECTED' 
//                 ? { color: '#DC2626', bgcolor: '#FEE2E2' } // Tailwind: text-red-500, bg-red-100
//                 : { color: '#6B7280', bgcolor: '#F3F4F6' }; // Tailwind: text-gray-500, bg-gray-100

//               return (
//                 <div key={index} className="flex justify-between items-center p-4 bg-white border border-gray-300 rounded-lg shadow-sm transition-all duration-200" data-aos="fade-up">
//                   <div className="flex items-center space-x-4">
//                     <Avatar className="w-14 h-14 bg-gray-200">
//                       {fileTypeIcons[doc.type.toLowerCase()] || <FaFileAlt className="text-gray-600" />}
//                     </Avatar>

//                     <div className="flex flex-col">
//                       <Typography variant="subtitle1" className="font-medium text-gray-800">
//                         {docName}
//                       </Typography>
//                       <Typography variant="body2" className="text-gray-500">
//                         {doc.loading ? (
//                           <span className="flex items-center">
//                             <FaSpinner className="animate-spin mr-1" size={12} />
//                             Loading details...
//                           </span>
//                         ) : (
//                           <>
//                             {doc.size} • {doc.uploadedAt}
//                           </>
//                         )}
//                       </Typography>
//                     </div>
//                   </div>

//                   <div className="flex items-center space-x-4">
//                     {!doc.loading && (
//                       <Chip
//                         size="small"
//                         label={doc.status || 'UNKNOWN'}
//                         sx={{
//                           fontWeight: 'bold',
//                           borderRadius: '12px',
//                           padding: '2px 8px',
//                           ...chipStyles,
//                         }}
//                       />
//                     )}
//                     <Tooltip title="Download">
//                       <IconButton
//                         size="small"
//                         onClick={() => window.open(doc.url, "_blank")}
//                         sx={{
//                           color: 'primary.main',
//                           '&:hover': { color: 'blue.500' }
//                         }}
//                       >
//                         <FaDownload />
//                       </IconButton>
//                     </Tooltip>
//                     <Tooltip title="Delete">
//                       <IconButton
//                         size="small"
//                         onClick={() => doc.id && handleDeleteDocument(doc.id)}
//                         disabled={deletingId === doc.id}
//                         sx={{
//                           color: deletingId === doc.id ? 'gray.500' : 'red.500',
//                           '&:hover': { 
//                             color: deletingId === doc.id ? 'gray.500' : 'red.700',
//                             backgroundColor: deletingId === doc.id ? 'transparent' : 'rgba(255, 0, 0, 0.08)'
//                           }
//                         }}
//                       >
//                         {deletingId === doc.id ? (
//                           <FaSpinner className="animate-spin" />
//                         ) : (
//                           <FaTrash />
//                         )}
//                       </IconButton>
//                     </Tooltip>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         </div>
//       ))}

//       {!loadingDocuments && filteredDocuments.length === 0 && (
//         <div className="text-center py-8">
//           <FaFileAlt className="mx-auto text-4xl text-gray-300 mb-2" />
//           <Typography variant="body1" className="text-gray-500">
//             {searchQuery ? "No matching documents found" : "No documents uploaded yet"}
//           </Typography>
//         </div>
//       )}
//     </div>
//   </AnimateOnScrollProvider>
// }


// "use client";
// import React, {JSX, useState, useEffect, useRef } from "react";
// import AnimateOnScrollProvider from "@/sections/components/animation/AnimateOnScrollProvider";
// import { Snackbar, Alert, Backdrop, CircularProgress } from "@mui/material";
// import { useRouter } from "next/navigation";
// import {
//   FaMobileAlt,
//   FaHome,
//   FaEnvelope,
//   FaBriefcase,
//   FaFilePdf,
//   FaFileImage,
//   FaFileWord,
//   FaFileExcel,
//   FaFilePowerpoint,
//   FaFileArchive,
//   FaFileAlt,
//   FaFileCode,
//   FaFileAudio,
//   FaFileVideo,
//   FaDownload,
//   FaSearch,
//   FaSpinner,
//   FaPlus,
//   FaTrash,
// } from "react-icons/fa";
// import {
//   TextField,
//   Button,
//   Chip,
//   Divider,
//   IconButton,
//   Tooltip,
//   Menu,
//   MenuItem,
//   InputAdornment,
//   Badge,
//   Avatar,
//   Typography,
// } from "@mui/material";
// import { Delete, MoreVert, FileUpload, CloudDownload } from "@mui/icons-material";
// import { uploadToS3 } from "@/utils/s3file";

// interface Document {
//   id?: string;
//   url: string;
//   name: string;
//   type: string;
//   size: string;
//   uploadedAt: string;
//   loading?: boolean;
//   status?: string;
// }

// interface ActionButtonsProps {
//   loginData: any;
//   roleId: number;
//   updateProfile: (updatedData: any) => void;
//   refreshUserData: () => Promise<void>;
// }

// const fileTypeIcons: Record<string, JSX.Element> = {
//   pdf: <FaFilePdf className="text-red-500" />,
//   jpg: <FaFileImage className="text-green-500" />,
//   jpeg: <FaFileImage className="text-green-500" />,
//   png: <FaFileImage className="text-green-500" />,
//   gif: <FaFileImage className="text-green-500" />,
//   doc: <FaFileWord className="text-blue-500" />,
//   docx: <FaFileWord className="text-blue-500" />,
//   xls: <FaFileExcel className="text-green-600" />,
//   xlsx: <FaFileExcel className="text-green-600" />,
//   ppt: <FaFilePowerpoint className="text-orange-500" />,
//   pptx: <FaFilePowerpoint className="text-orange-500" />,
//   zip: <FaFileArchive className="text-yellow-500" />,
//   rar: <FaFileArchive className="text-yellow-500" />,
//   txt: <FaFileAlt className="text-gray-500" />,
//   csv: <FaFileCode className="text-blue-300" />,
//   json: <FaFileCode className="text-yellow-300" />,
//   mp3: <FaFileAudio className="text-purple-500" />,
//   wav: <FaFileAudio className="text-purple-500" />,
//   mp4: <FaFileVideo className="text-red-400" />,
//   mov: <FaFileVideo className="text-red-400" />,
// };

// const ActionButtons: React.FC<ActionButtonsProps> = ({
//   loginData,
//   roleId,
//   updateProfile,
//   refreshUserData
// }) => {
//   const router = useRouter();
//   const [isEditing, setIsEditing] = useState(false);
//   const [formData, setFormData] = useState({ ...loginData });
//   const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
//   const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
//   const [documents, setDocuments] = useState<Document[]>([]);
//   const [loadingDocuments, setLoadingDocuments] = useState(true);
//   const [loading, setLoading] = useState(false);
//   const [deletingId, setDeletingId] = useState<string | null>(null);
//   const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

//   const shouldShowDocuments = roleId === 3;
//   const inputRef = useRef<HTMLInputElement | null>(null);

//   const handleClick = () => {
//     inputRef.current?.click(); // open file dialog
//   };

//   const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const token = localStorage.getItem("authToken")?.replace(/^"|"$/g, '');
//     const file = e.target.files?.[0];
//     if (!file) return;

//     setLoading(true);

//     try {
//       const uploadedUrl = await uploadToS3({ file });

//       if (!uploadedUrl || typeof uploadedUrl !== "string" || !uploadedUrl.startsWith("http")) {
//         throw new Error("Invalid S3 URL returned");
//       }

//       const dbRes = await fetch("https://ub1b171tga.execute-api.eu-north-1.amazonaws.com/dev/document/upload", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           url: encodeURI(uploadedUrl),
//           userId: loginData?.id || loginData?.userId || 1,
//         }),
//       });

//       const dbResult = await dbRes.json();

//       if (!dbRes.ok) {
//         throw new Error("DB Save Failed");
//       }

//       const newDoc = await fetchDocumentDetails(uploadedUrl);
//       setDocuments((prev) => [...prev, newDoc]);
//       await refreshUserData();

//       // ✅ Show success message
//       setSnackbar({ open: true, message: 'Document uploaded successfully!', severity: 'success' });
//     } catch (err) {
//       console.error("Upload Error:", err);
//       setSnackbar({ open: true, message: 'Document upload failed.', severity: 'error' });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchDocumentDetails = async (url: string): Promise<Document> => {
//     try {
//       const response = await fetch(url, { method: 'HEAD' });
      
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
      
//       const contentLength = response.headers.get('content-length');
//       const lastModified = response.headers.get('last-modified');
      
//       const fileName = decodeURIComponent(url.split('/').pop() || "Document");
//       const fileType = url.split('.').pop()?.toUpperCase() || 'FILE';
      
//       return {
//         url,
//         name: fileName,
//         type: fileType,
//         size: contentLength ? formatFileSize(parseInt(contentLength)) : 'Unknown',
//         uploadedAt: lastModified ? new Date(lastModified).toLocaleDateString() : 'Unknown date',
//         loading: false
//       };
//     } catch (error) {
//       console.error(`Error fetching document details for ${url}:`, error);
//       return {
//         url,
//         name: decodeURIComponent(url.split('/').pop() || "Document"),
//         type: url.split('.').pop()?.toUpperCase() || 'FILE',
//         size: 'Unknown',
//         uploadedAt: 'Unknown date',
//         loading: false
//       };
//     }
//   };

//   const formatFileSize = (bytes: number): string => {
//     if (bytes === 0) return '0 Bytes';
//     const k = 1024;
//     const sizes = ['Bytes', 'KB', 'MB', 'GB'];
//     const i = Math.floor(Math.log(bytes) / Math.log(k));
//     return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
//   };

//   useEffect(() => {
//     const loadDocuments = async () => {
//       const rawDocuments = loginData?.individualProfessional?.documents || [];
//       setLoadingDocuments(true);
  
//       // Use actual structure from payload
//       const initialDocuments = rawDocuments.map((doc: any) => ({
//         id: doc.id,
//         url: doc.url,
//         name: decodeURIComponent(doc.url?.split('/').pop() || 'Document'),
//         type: doc.url?.split('.').pop()?.toUpperCase() || 'FILE',
//         size: 'Loading...',
//         uploadedAt: doc.uploadedAt,
//         status: doc.status,
//         loading: true,
//       }));
  
//       setDocuments(initialDocuments);
  
//       try {
//         const detailedDocuments = await Promise.all(
//           rawDocuments.map((doc: any) => fetchDocumentDetails(doc.url))
//         );
  
//         const mergedDocuments = initialDocuments.map((doc: { url: any; }) => {
//           const detail = detailedDocuments.find(d => d.url === doc.url);
//           return detail
//             ? {
//                 ...doc,
//                 ...detail,
//                 loading: false,
//               }
//             : doc;
//         });
  
//         setDocuments(mergedDocuments);
//       } catch (err) {
//         console.error("Error loading document details:", err);
//       } finally {
//         setLoadingDocuments(false);
//       }
//     };
  
//     if (loginData?.individualProfessional?.documents) {
//       loadDocuments();
//     }
//   }, [loginData]);

//   const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, doc: Document) => {
//     setAnchorEl(event.currentTarget);
//     setSelectedDoc(doc);
//   };

//   const handleMenuClose = () => {
//     setAnchorEl(null);
//     setSelectedDoc(null);
//   };

//   const handleDeleteDocument = async (docId?: string) => {
//     if (!docId) return;
    
//     setDeletingId(docId);
//     const token = localStorage.getItem("authToken")?.replace(/^"|"$/g, '');
    
//     try {
//       const response = await fetch(`https://ub1b171tga.execute-api.eu-north-1.amazonaws.com/dev/document/${docId}`, {
//         method: 'DELETE',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       if (!response.ok) {
//         throw new Error('Failed to delete document');
//       }

//       setDocuments(prev => prev.filter(doc => doc.id !== docId));
//       await refreshUserData();
//       setSnackbar({ open: true, message: 'Document deleted successfully!', severity: 'success' });
//     } catch (error) {
//       console.error('Error deleting document:', error);
//       setSnackbar({ open: true, message: 'Failed to delete document', severity: 'error' });
//     } finally {
//       setDeletingId(null);
//       handleMenuClose();
//     }
//   };

//   const handleDelete = () => {
//     if (selectedDoc?.id) {
//       handleDeleteDocument(selectedDoc.id);
//     }
//   };

//   const handleDownload = () => {
//     if (selectedDoc) window.open(selectedDoc.url, "_blank");
//     handleMenuClose();
//   };

//   // Filter documents based on search
//   const filteredDocuments = documents.filter(doc =>
//     doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//     doc.type.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   // Group documents by type
//   const documentGroups = filteredDocuments.reduce((groups: Record<string, Document[]>, doc) => {
//     const type = doc.type;
//     if (!groups[type]) groups[type] = [];
//     groups[type].push(doc);
//     return groups;
//   }, {});

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFormData((prev: any) => ({ ...prev, [name]: value }));
//   };

//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       const imageUrl = URL.createObjectURL(file);
//       setProfilePhoto(imageUrl);
//     }
//   };

//   const handleSubmit = () => {
//     updateProfile(formData);
//     setIsEditing(false);
//   };

//   const handleCancel = () => {
//     setFormData({ ...loginData });
//     setIsEditing(false);
//   };

//   const profileData = loginData?.individualProfessional?.profile?.profilePhoto || loginData.profile|| '';
//   const finalImage = profilePhoto || profileData || "/images/profile.png";
  
//   return (
//     <div className="w-full max-w-5xl mx-auto p-4 space-y-6">
//       {/* Profile Section */}
//       <div className="flex flex-col items-center md:flex-row md:items-center md:space-x-6">
//         <div className="relative w-28 h-28 rounded-full shadow-lg shadow-gray-400 hover:scale-105 transition-transform duration-300">
//           <img
//             src={finalImage}
//             alt="Profile"
//             className="w-full h-full object-cover rounded-full"
//           />
//           {isEditing && (
//             <>
//               <input
//                 id="profilePhoto"
//                 type="file"
//                 accept="image/*"
//                 onChange={handleImageChange}
//                 className="hidden"
//               />
//               <label
//                 htmlFor="profilePhoto"
//                 className="absolute bottom-0 left-0 right-0 text-center bg-black bg-opacity-70 text-white text-xs py-1 cursor-pointer rounded-b-lg hover:bg-opacity-90 transition"
//               >
//                 Upload Image
//               </label>
//             </>
//           )}
//         </div>

//         {/* Profile Info */}
//         <div className="text-center md:text-left mt-4 md:mt-0 space-y-1">
//           <h2 className="text-2xl font-semibold text-gray-800">
//             {formData?.firstName || formData?.lastName
//               ? `${formData.firstName} ${formData.lastName}`
//               : "Mr. Y"}
//           </h2>
//           <h2 className="text-xl text-gray-600">{formData?.screenName ?? "Mr."}</h2>
//           <p className="text-gray-500">
//             {loginData?.role?.name ?? loginData?.role ?? "Security Officer"}
//           </p>
//           <span className="text-sm text-yellow-500">
//             ✅ Usually responds within 1 hour
//           </span>
//         </div>
//       </div>

//      <div className="flex flex-wrap mt-6 gap-4">
//       {/* Row 1: 2 fields */}
//          <div className="w-full md:w-[48%]">
//           <TextField
//             label="First Name"
//             name="firstName"
//             value={formData.firstName || ""}
//             onChange={handleInputChange}
//             disabled={!isEditing}
//             fullWidth
//             size="small"
//           />
//         </div>
//         <div className="w-full md:w-[48%]">
//           <TextField
//             label="Last Name"
//             name="lastName"
//             value={formData.lastName || ""}
//             onChange={handleInputChange}
//             disabled={!isEditing}
//             fullWidth
//             size="small"
//           />
//         </div>

//         {/* Row 2: 1 field */}
//         <div className="w-full">
//           <TextField
//             label="Screen Name"
//             name="screenName"
//             value={formData.screenName || ""}
//             onChange={handleInputChange}
//             disabled={!isEditing}
//             fullWidth
//             size="small"
//           />
//         </div>

//        {/* Row 3: 2 fields */}
//         <div className="w-full md:w-[48%]">
//           <TextField
//             label="Email"
//             name="email"
//             value={formData.email || ""}
//             onChange={handleInputChange}
//             disabled={!isEditing}
//             fullWidth
//             size="small"
//           />
//         </div>
//         <div className="w-full md:w-[48%]">
//           <TextField
//             label="Phone Number"
//             name="phoneNumber"
//             value={formData.phoneNumber || ""}
//             onChange={handleInputChange}
//             disabled={!isEditing}
//             fullWidth
//             size="small"
//           />
//         </div>

//         {/* Row 4: 1 field */}
//         <div className="w-full">
//           <TextField
//             label="Address"
//             name="address"
//             value={formData.address || ""}
//             onChange={handleInputChange}
//             disabled={!isEditing}
//             fullWidth
//             size="small"
//           />
//         </div>
//       </div>

//       <div className="mt-3 flex flex-col md:flex-row">
//         {isEditing ? (
//           <>
//             <Button
//               variant="contained"
//               color="primary"
//               onClick={handleSubmit}
//               fullWidth
//               sx={{ bgcolor: "black", ":hover": { bgcolor: "#333" } }}
//             >
//               Save Profile
//             </Button>
//             <Button
//               variant="outlined"
//               onClick={handleCancel}
//               fullWidth
//               sx={{ color: "black", borderColor: "black" }}
//             >
//               Back
//             </Button>
//           </>
//         ) : (
//           <Button
//             onClick={() => setIsEditing(true)}
//             fullWidth
//             variant="contained"
//             sx={{ bgcolor: "black", ":hover": { bgcolor: "#333" } }}
//           >
//             Update Profile
//           </Button>
//         )}
//       </div>

//       {/* Upgrade Button */}
//       {!isEditing && (
//         <Button
//           fullWidth
//           variant="contained"
//           sx={{ bgcolor: "#f97316", ":hover": { bgcolor: "#ea580c" } }}
//         >
//           Upgrade My Membership
//         </Button>
//       )}

//       {/* Documents Section */}
//       {shouldShowDocuments && 
//     <AnimateOnScrollProvider>

//       <div className="space-y-6 mt-5">
//         <Divider className="my-4">
//           <Chip 
//             label={
//               <div className="flex items-center space-x-2">
//                 <CloudDownload />
//                 <span>My Documents ({documents.length})</span>
//               </div>
//             } 
//             color="primary" 
//           />
//         </Divider>
//         <div className="flex flex-col md:flex-row justify-between gap-4 mt-3" >
//           <div className="flex items-center gap-2 w-full">
//             <TextField
//               size="small"
//               placeholder="Search documents..."
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               InputProps={{
//                 startAdornment: (
//                   <InputAdornment position="start">
//                     <FaSearch className="text-gray-400" />
//                   </InputAdornment>
//                 ),
//               }}
//               sx={{ flex: 1, maxWidth: 400 }}
//             />
//           <>
//       {/* 🔒 Hidden File Input */}
//       <input
//         type="file"
//         accept="*/*"
//         ref={inputRef}
//         onChange={handleFileChange}
//         style={{ display: "none" }}
//       />

//       {/* 📄 Upload Button */}
//       <Button
//         variant="contained"
//         startIcon={<FaPlus />}
//         onClick={handleClick}
//         sx={{
//           bgcolor: 'primary.main',
//           whiteSpace: 'nowrap',
//           minWidth: 'fit-content',
//         }}
//       >
//         Add Documents
//       </Button>
//       <Backdrop open={loading} sx={{ zIndex: 9999, color: '#fff' }}>
//   <CircularProgress color="inherit" />
// </Backdrop>
// <Snackbar
//   open={snackbar.open}
//   autoHideDuration={4000}
//   onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
//   anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
// >
//   <Alert onClose={() => setSnackbar(prev => ({ ...prev, open: false }))} severity={snackbar.severity} sx={{ width: '100%' }}>
//     {snackbar.message}
//   </Alert>
// </Snackbar>

//     </>

//           </div>
// {/* 
//           {isEditing && (
//             <Button
//               variant="contained"
//               startIcon={<FileUpload />}
//               sx={{ bgcolor: 'primary.main', whiteSpace: 'nowrap' }}
//             >
//               Upload New
//             </Button>
//           )} */}
//         </div>

//         {loadingDocuments && (
//           <div className="flex justify-center items-center py-8">
//             <FaSpinner className="animate-spin text-2xl text-gray-400 mr-2" />
//             <Typography variant="body1" className="text-gray-500">
//               Loading documents...
//             </Typography>
//           </div>
          
//         )}

//         {!loadingDocuments && Object.entries(documentGroups).map(([type, docs]) => (
//           <div key={type} className="space-y-6">
//             {/* Document Group Header */}
//             <div className="flex justify-between items-center">
//               <Typography variant="h6" className="font-semibold text-gray-700">
//                 {type} Files ({docs.length})
//               </Typography>
//               <Typography variant="body2" className="text-gray-500">
//                 {docs.length} items
//               </Typography>
//             </div>

//             <div className="space-y-6">
//               {docs.map((doc, index) => {
//                 const docName = doc.name.split('-').slice(1).join(' ').replace(/\.[^/.]+$/, '');

//                 return (
//                   <div key={index} className="flex justify-between items-center p-4 bg-white border border-gray-300 rounded-lg shadow-sm transition-all duration-200"  data-aos="fade-up" >
                    
//                     <div className="flex items-center space-x-4">
//                       <Avatar className="w-14 h-14 bg-gray-200">
//                         {fileTypeIcons[doc.type.toLowerCase()] || <FaFileAlt className="text-gray-600" />}
//                       </Avatar>

//                       <div className="flex flex-col">
//                         <Typography variant="subtitle1" className="font-medium text-gray-800">
//                           {docName}
//                         </Typography>
//                         <Typography variant="body2" className="text-gray-500">
//                           {doc.loading ? (
//                             <span className="flex items-center">
//                               <FaSpinner className="animate-spin mr-1" size={12} />
//                               Loading details...
//                             </span>
//                           ) : (
//                             `${doc.size} • ${doc.uploadedAt}`
//                           )}
//                         </Typography>
//                       </div>
//                     </div>

//                     <div className="flex items-center space-x-4">
//                       <Tooltip title="Download">
//                         <IconButton
//                           size="small"
//                           onClick={() => window.open(doc.url, "_blank")}
//                           sx={{
//                             color: 'primary.main',
//                             '&:hover': { color: 'blue.500' }
//                           }}
//                         >
//                           <FaDownload />
//                         </IconButton>
//                       </Tooltip>

//                       <Tooltip title="Delete">
//                         <IconButton
//                           size="small"
//                           onClick={() => doc.id && handleDeleteDocument(doc.id)}
//                           disabled={deletingId === doc.id}
//                           sx={{
//                             color: deletingId === doc.id ? 'gray.500' : 'red.500',
//                             '&:hover': { 
//                               color: deletingId === doc.id ? 'gray.500' : 'red.700',
//                               backgroundColor: deletingId === doc.id ? 'transparent' : 'rgba(255, 0, 0, 0.08)'
//                             }
//                           }}
//                         >
//                           {deletingId === doc.id ? (
//                             <FaSpinner className="animate-spin" />
//                           ) : (
//                             <FaTrash />
//                           )}
//                         </IconButton>
//                       </Tooltip>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           </div>
//         ))}

//         {!loadingDocuments && filteredDocuments.length === 0 && (
//           <div className="text-center py-8">
//             <FaFileAlt className="mx-auto text-4xl text-gray-300 mb-2" />
//             <Typography variant="body1" className="text-gray-500">
//               {searchQuery ? "No matching documents found" : "No documents uploaded yet"}
//             </Typography>
//           </div>
//         )}
//       </div>
//     </AnimateOnScrollProvider>
// }

//       {/* Document Context Menu */}
//       <Menu
//         anchorEl={anchorEl}
//         open={Boolean(anchorEl)}
//         onClose={handleMenuClose}
//       >
//         <MenuItem onClick={handleDownload}>
//           <FaDownload className="mr-2" /> Download
//         </MenuItem>
//         <MenuItem onClick={handleDelete}>
//           <Delete className="mr-2" /> Delete
//         </MenuItem>
//       </Menu>
//     </div>
//   );
// };

// export default ActionButtons;















// "use client";
// import React, {JSX, useState, useEffect, useRef } from "react";
// import AnimateOnScrollProvider from "@/sections/components/animation/AnimateOnScrollProvider";
// import { Snackbar, Alert, Backdrop, CircularProgress } from "@mui/material";
// import { useRouter } from "next/navigation";
// import {
//   FaMobileAlt,
//   FaHome,
//   FaEnvelope,
//   FaBriefcase,
//   FaFilePdf,
//   FaFileImage,
//   FaFileWord,
//   FaFileExcel,
//   FaFilePowerpoint,
//   FaFileArchive,
//   FaFileAlt,
//   FaFileCode,
//   FaFileAudio,
//   FaFileVideo,
//   FaDownload,
//   FaSearch,
//   FaSpinner,
//   FaPlus,
// } from "react-icons/fa";
// import {
//   TextField,
//   Button,
//   Chip,
//   Divider,
//   IconButton,
//   Tooltip,
//   Menu,
//   MenuItem,
//   InputAdornment,
//   Badge,
//   Avatar,
//   Typography,
// } from "@mui/material";
// import { Delete, MoreVert, FileUpload, CloudDownload } from "@mui/icons-material";
// import { uploadToS3 } from "@/utils/s3file";

// interface Document {
//   url: string;
//   name: string;
//   type: string;
//   size: string;
//   uploadedAt: string;
//   loading?: boolean;
// }

// interface ActionButtonsProps {
//   loginData: any;
//   roleId: number;
//   updateProfile: (updatedData: any) => void;
//   refreshUserData: () => Promise<void>;
// }

// const fileTypeIcons: Record<string, JSX.Element> = {
//   pdf: <FaFilePdf className="text-red-500" />,
//   jpg: <FaFileImage className="text-green-500" />,
//   jpeg: <FaFileImage className="text-green-500" />,
//   png: <FaFileImage className="text-green-500" />,
//   gif: <FaFileImage className="text-green-500" />,
//   doc: <FaFileWord className="text-blue-500" />,
//   docx: <FaFileWord className="text-blue-500" />,
//   xls: <FaFileExcel className="text-green-600" />,
//   xlsx: <FaFileExcel className="text-green-600" />,
//   ppt: <FaFilePowerpoint className="text-orange-500" />,
//   pptx: <FaFilePowerpoint className="text-orange-500" />,
//   zip: <FaFileArchive className="text-yellow-500" />,
//   rar: <FaFileArchive className="text-yellow-500" />,
//   txt: <FaFileAlt className="text-gray-500" />,
//   csv: <FaFileCode className="text-blue-300" />,
//   json: <FaFileCode className="text-yellow-300" />,
//   mp3: <FaFileAudio className="text-purple-500" />,
//   wav: <FaFileAudio className="text-purple-500" />,
//   mp4: <FaFileVideo className="text-red-400" />,
//   mov: <FaFileVideo className="text-red-400" />,
// };

// const ActionButtons: React.FC<ActionButtonsProps> = ({
//   loginData,
//   roleId,
//   updateProfile,
//   refreshUserData
// }) => {
//   const router = useRouter();
//   const [isEditing, setIsEditing] = useState(false);
//   const [formData, setFormData] = useState({ ...loginData });
//   const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
//   const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
//   const [documents, setDocuments] = useState<Document[]>([]);
//   const [loadingDocuments, setLoadingDocuments] = useState(true);
//   const [loading, setLoading] = useState(false);
//   const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

//   const shouldShowDocuments = roleId === 3;
//   // const handleAddDocument = () => {
//   //   // Implement your document upload logic here
//   //   console.log("Add document clicked");
//   // };
//   const inputRef = useRef<HTMLInputElement | null>(null);

// const handleClick = () => {
//   inputRef.current?.click(); // open file dialog
// };
// const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
//   const token = localStorage.getItem("authToken")?.replace(/^"|"$/g, '');
//   const file = e.target.files?.[0];
//   if (!file) return;

//   setLoading(true);

//   try {
//     const uploadedUrl = await uploadToS3({ file });

//     if (!uploadedUrl || typeof uploadedUrl !== "string" || !uploadedUrl.startsWith("http")) {
//       throw new Error("Invalid S3 URL returned");
//     }

//     const dbRes = await fetch("https://ub1b171tga.execute-api.eu-north-1.amazonaws.com/dev/document/upload", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//       body: JSON.stringify({
//         url: encodeURI(uploadedUrl),
//         userId: loginData?.id || loginData?.userId || 1,
//       }),
//     });

//     const dbResult = await dbRes.json();

//     if (!dbRes.ok) {
//       throw new Error("DB Save Failed");
//     }

//     const newDoc = await fetchDocumentDetails(uploadedUrl);
//     setDocuments((prev) => [...prev, newDoc]);
//     await refreshUserData();

//     // ✅ Show success message
//     setSnackbar({ open: true, message: 'Document uploaded successfully!', severity: 'success' });
//   } catch (err) {
//     console.error("Upload Error:", err);
//     setSnackbar({ open: true, message: 'Document upload failed.', severity: 'error' });
//   } finally {
//     setLoading(false);
//   }
// };


//   const fetchDocumentDetails = async (url: string): Promise<Document> => {
//     try {
//       const response = await fetch(url, { method: 'HEAD' });
      
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
      
//       const contentLength = response.headers.get('content-length');
//       const lastModified = response.headers.get('last-modified');
      
//       const fileName = decodeURIComponent(url.split('/').pop() || "Document");
//       const fileType = url.split('.').pop()?.toUpperCase() || 'FILE';
      
//       return {
//         url,
//         name: fileName,
//         type: fileType,
//         size: contentLength ? formatFileSize(parseInt(contentLength)) : 'Unknown',
//         uploadedAt: lastModified ? new Date(lastModified).toLocaleDateString() : 'Unknown date',
//         loading: false
//       };
//     } catch (error) {
//       console.error(`Error fetching document details for ${url}:`, error);
//       return {
//         url,
//         name: decodeURIComponent(url.split('/').pop() || "Document"),
//         type: url.split('.').pop()?.toUpperCase() || 'FILE',
//         size: 'Unknown',
//         uploadedAt: 'Unknown date',
//         loading: false
//       };
//     }
//   };

//   const formatFileSize = (bytes: number): string => {
//     if (bytes === 0) return '0 Bytes';
//     const k = 1024;
//     const sizes = ['Bytes', 'KB', 'MB', 'GB'];
//     const i = Math.floor(Math.log(bytes) / Math.log(k));
//     return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
//   };
//   useEffect(() => {
//     const loadDocuments = async () => {
//       const rawDocuments = loginData?.individualProfessional?.documents || [];
//       setLoadingDocuments(true);
  
//       // Use actual structure from payload
//       const initialDocuments = rawDocuments.map((doc: any) => ({
//         id: doc.id,
//         url: doc.url,
//         name: decodeURIComponent(doc.url?.split('/').pop() || 'Document'),
//         type: doc.url?.split('.').pop()?.toUpperCase() || 'FILE',
//         size: 'Loading...',
//         uploadedAt: doc.uploadedAt,
//         status: doc.status,
//         loading: true,
//       }));
  
//       setDocuments(initialDocuments);
  
//       try {
//         const detailedDocuments = await Promise.all(
//           rawDocuments.map((doc: any) => fetchDocumentDetails(doc.url))
//         );
  
//         const mergedDocuments = initialDocuments.map((doc: { url: any; }) => {
//           const detail = detailedDocuments.find(d => d.url === doc.url);
//           return detail
//             ? {
//                 ...doc,
//                 ...detail,
//                 loading: false,
//               }
//             : doc;
//         });
  
//         setDocuments(mergedDocuments);
//       } catch (err) {
//         console.error("Error loading document details:", err);
//       } finally {
//         setLoadingDocuments(false);
//       }
//     };
  
//     if (loginData?.individualProfessional?.documents) {
//       loadDocuments();
//     }
//   }, [loginData]);
  
//   // useEffect(() => {
//   //   const loadDocuments = async () => {
//   //     const rawDocuments = loginData?.individualProfessional?.documents || [];
//   //     setLoadingDocuments(true);
      
//   //     // Explicitly type the url parameter as string
//   //     const documentPromises = rawDocuments.map(async (url: string) => {
//   //       return {
//   //         url,
//   //         name: decodeURIComponent(url.split('/').pop() || "Document"),
//   //         type: url.split('.').pop()?.toUpperCase() || 'FILE',
//   //         size: 'Loading...',
//   //         uploadedAt: 'Loading...',
//   //         loading: true
//   //       };
//   //     });
  
//   //     const initialDocuments = await Promise.all(documentPromises);
//   //     setDocuments(initialDocuments);
  
//   //     // Now fetch the actual details for each document
//   //     // Also type the url parameter here
//   //     const detailedDocuments = await Promise.all(
//   //       rawDocuments.map((url: string) => fetchDocumentDetails(url))
//   //     );
      
//   //     setDocuments(detailedDocuments);
//   //     setLoadingDocuments(false);
//   //   };
  
//   //   loadDocuments();
//   // }, [loginData]);

//   const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, doc: Document) => {
//     setAnchorEl(event.currentTarget);
//     setSelectedDoc(doc);
//   };

//   const handleMenuClose = () => {
//     setAnchorEl(null);
//     setSelectedDoc(null);
//   };

//   const handleDelete = () => {
//     // Implement delete functionality
//     handleMenuClose();
//   };

//   const handleDownload = () => {
//     if (selectedDoc) window.open(selectedDoc.url, "_blank");
//     handleMenuClose();
//   };

//   // Filter documents based on search
//   const filteredDocuments = documents.filter(doc =>
//     doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//     doc.type.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   // Group documents by type
//   const documentGroups = filteredDocuments.reduce((groups: Record<string, Document[]>, doc) => {
//     const type = doc.type;
//     if (!groups[type]) groups[type] = [];
//     groups[type].push(doc);
//     return groups;
//   }, {});

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFormData((prev: any) => ({ ...prev, [name]: value }));
//   };

//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       const imageUrl = URL.createObjectURL(file);
//       setProfilePhoto(imageUrl);
//     }
//   };

//   const handleSubmit = () => {
//     updateProfile(formData);
//     setIsEditing(false);
//   };

//   const handleCancel = () => {
//     setFormData({ ...loginData });
//     setIsEditing(false);
//   };

//   const profileData = loginData?.individualProfessional?.profile?.profilePhoto || loginData.profile|| '';
//   const finalImage = profilePhoto || profileData || "/images/profile.png";
//   return (
//     <div className="w-full max-w-5xl mx-auto p-4 space-y-6">
//       {/* Profile Section */}
//       <div className="flex flex-col items-center md:flex-row md:items-center md:space-x-6">
//         <div className="relative w-28 h-28 rounded-full shadow-lg shadow-gray-400 hover:scale-105 transition-transform duration-300">
//           <img
//             src={finalImage}
//             alt="Profile"
//             className="w-full h-full object-cover rounded-full"
//           />
//           {isEditing && (
//             <>
//               <input
//                 id="profilePhoto"
//                 type="file"
//                 accept="image/*"
//                 onChange={handleImageChange}
//                 className="hidden"
//               />
//               <label
//                 htmlFor="profilePhoto"
//                 className="absolute bottom-0 left-0 right-0 text-center bg-black bg-opacity-70 text-white text-xs py-1 cursor-pointer rounded-b-lg hover:bg-opacity-90 transition"
//               >
//                 Upload Image
//               </label>
//             </>
//           )}
//         </div>

//         {/* Profile Info */}
//         <div className="text-center md:text-left mt-4 md:mt-0 space-y-1">
//           <h2 className="text-2xl font-semibold text-gray-800">
//             {formData?.firstName || formData?.lastName
//               ? `${formData.firstName} ${formData.lastName}`
//               : "Mr. Y"}
//           </h2>
//           <h2 className="text-xl text-gray-600">{formData?.screenName ?? "Mr."}</h2>
//           <p className="text-gray-500">
//             {loginData?.role?.name ?? loginData?.role ?? "Security Officer"}
//           </p>
//           <span className="text-sm text-yellow-500">
//             ✅ Usually responds within 1 hour
//           </span>
//         </div>
//       </div>

//      <div className="flex flex-wrap mt-6 gap-4">
//       {/* Row 1: 2 fields */}
//          <div className="w-full md:w-[48%]">
//           <TextField
//             label="First Name"
//             name="firstName"
//             value={formData.firstName || ""}
//             onChange={handleInputChange}
//             disabled={!isEditing}
//             fullWidth
//             size="small"
//           />
//         </div>
//         <div className="w-full md:w-[48%]">
//           <TextField
//             label="Last Name"
//             name="lastName"
//             value={formData.lastName || ""}
//             onChange={handleInputChange}
//             disabled={!isEditing}
//             fullWidth
//             size="small"
//           />
//         </div>

//         {/* Row 2: 1 field */}
//         <div className="w-full">
//           <TextField
//             label="Screen Name"
//             name="screenName"
//             value={formData.screenName || ""}
//             onChange={handleInputChange}
//             disabled={!isEditing}
//             fullWidth
//             size="small"
//           />
//         </div>

//        {/* Row 3: 2 fields */}
//         <div className="w-full md:w-[48%]">
//           <TextField
//             label="Email"
//             name="email"
//             value={formData.email || ""}
//             onChange={handleInputChange}
//             disabled={!isEditing}
//             fullWidth
//             size="small"
//           />
//         </div>
//         <div className="w-full md:w-[48%]">
//           <TextField
//             label="Phone Number"
//             name="phoneNumber"
//             value={formData.phoneNumber || ""}
//             onChange={handleInputChange}
//             disabled={!isEditing}
//             fullWidth
//             size="small"
//           />
//         </div>

//         {/* Row 4: 1 field */}
//         <div className="w-full">
//           <TextField
//             label="Address"
//             name="address"
//             value={formData.address || ""}
//             onChange={handleInputChange}
//             disabled={!isEditing}
//             fullWidth
//             size="small"
//           />
//         </div>
//       </div>

//       <div className="mt-3 flex flex-col md:flex-row">
//         {isEditing ? (
//           <>
//             <Button
//               variant="contained"
//               color="primary"
//               onClick={handleSubmit}
//               fullWidth
//               sx={{ bgcolor: "black", ":hover": { bgcolor: "#333" } }}
//             >
//               Save Profile
//             </Button>
//             <Button
//               variant="outlined"
//               onClick={handleCancel}
//               fullWidth
//               sx={{ color: "black", borderColor: "black" }}
//             >
//               Back
//             </Button>
//           </>
//         ) : (
//           <Button
//             onClick={() => setIsEditing(true)}
//             fullWidth
//             variant="contained"
//             sx={{ bgcolor: "black", ":hover": { bgcolor: "#333" } }}
//           >
//             Update Profile
//           </Button>
//         )}
//       </div>

//       {/* Upgrade Button */}
//       {!isEditing && (
//         <Button
//           fullWidth
//           variant="contained"
//           sx={{ bgcolor: "#f97316", ":hover": { bgcolor: "#ea580c" } }}
//         >
//           Upgrade My Membership
//         </Button>
//       )}

//       {/* Documents Section */}
//       {shouldShowDocuments && 
//     <AnimateOnScrollProvider>

//       <div className="space-y-6 mt-5">
//         <Divider className="my-4">
//           <Chip 
//             label={
//               <div className="flex items-center space-x-2">
//                 <CloudDownload />
//                 <span>My Documents ({documents.length})</span>
//               </div>
//             } 
//             color="primary" 
//           />
//         </Divider>
//         <div className="flex flex-col md:flex-row justify-between gap-4 mt-3" >
//           <div className="flex items-center gap-2 w-full">
//             <TextField
//               size="small"
//               placeholder="Search documents..."
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               InputProps={{
//                 startAdornment: (
//                   <InputAdornment position="start">
//                     <FaSearch className="text-gray-400" />
//                   </InputAdornment>
//                 ),
//               }}
//               sx={{ flex: 1, maxWidth: 400 }}
//             />
//           <>
//       {/* 🔒 Hidden File Input */}
//       <input
//         type="file"
//         accept="*/*"
//         ref={inputRef}
//         onChange={handleFileChange}
//         style={{ display: "none" }}
//       />

//       {/* 📄 Upload Button */}
//       <Button
//         variant="contained"
//         startIcon={<FaPlus />}
//         onClick={handleClick}
//         sx={{
//           bgcolor: 'primary.main',
//           whiteSpace: 'nowrap',
//           minWidth: 'fit-content',
//         }}
//       >
//         Add Documents
//       </Button>
//       <Backdrop open={loading} sx={{ zIndex: 9999, color: '#fff' }}>
//   <CircularProgress color="inherit" />
// </Backdrop>
// <Snackbar
//   open={snackbar.open}
//   autoHideDuration={4000}
//   onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
//   anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
// >
//   <Alert onClose={() => setSnackbar(prev => ({ ...prev, open: false }))} severity={snackbar.severity} sx={{ width: '100%' }}>
//     {snackbar.message}
//   </Alert>
// </Snackbar>

//     </>

//           </div>

//           {isEditing && (
//             <Button
//               variant="contained"
//               startIcon={<FileUpload />}
//               sx={{ bgcolor: 'primary.main', whiteSpace: 'nowrap' }}
//             >
//               Upload New
//             </Button>
//           )}
//         </div>

//         {loadingDocuments && (
//           <div className="flex justify-center items-center py-8">
//             <FaSpinner className="animate-spin text-2xl text-gray-400 mr-2" />
//             <Typography variant="body1" className="text-gray-500">
//               Loading documents...
//             </Typography>
//           </div>
          
//         )}

//         {!loadingDocuments && Object.entries(documentGroups).map(([type, docs]) => (
//           <div key={type} className="space-y-6">
//             {/* Document Group Header */}
//             <div className="flex justify-between items-center">
//               <Typography variant="h6" className="font-semibold text-gray-700">
//                 {type} Files ({docs.length})
//               </Typography>
//               <Typography variant="body2" className="text-gray-500">
//                 {docs.length} items
//               </Typography>
//             </div>

//             <div className="space-y-6">
//               {docs.map((doc, index) => {
//                 const docName = doc.name.split('-').slice(1).join(' ').replace(/\.[^/.]+$/, '');

//                 return (
//         <div key={index} className="flex justify-between items-center p-4 bg-white border border-gray-300 rounded-lg shadow-sm transition-all duration-200"  data-aos="fade-up" >
                    
//                     <div className="flex items-center space-x-4">
//                       <Avatar className="w-14 h-14 bg-gray-200">
//                         {fileTypeIcons[doc.type.toLowerCase()] || <FaFileAlt className="text-gray-600" />}
//                       </Avatar>

//                       <div className="flex flex-col">
//                         <Typography variant="subtitle1" className="font-medium text-gray-800">
//                           {docName}
//                         </Typography>
//                         <Typography variant="body2" className="text-gray-500">
//                           {doc.loading ? (
//                             <span className="flex items-center">
//                               <FaSpinner className="animate-spin mr-1" size={12} />
//                               Loading details...
//                             </span>
//                           ) : (
//                             `${doc.size} • ${doc.uploadedAt}`
//                           )}
//                         </Typography>
//                       </div>
//                     </div>

//                     <div className="flex items-center space-x-4">
//                       <Tooltip title="Download">
//                         <IconButton
//                           size="small"
//                           onClick={() => window.open(doc.url, "_blank")}
//                           sx={{
//                             color: 'primary.main',
//                             '&:hover': { color: 'blue.500' }
//                           }}
//                         >
//                           <FaDownload />
//                         </IconButton>
//                       </Tooltip>

//                       {isEditing && (
//                         <Tooltip title="Delete">
//                           <IconButton
//                             size="small"
//                             onClick={handleDelete}
//                             sx={{
//                               color: 'red.500',
//                               '&:hover': { color: 'red.700' }
//                             }}
//                           >
//                             <Delete />
//                           </IconButton>
//                         </Tooltip>
//                       )}
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           </div>
//         ))}

//         {!loadingDocuments && filteredDocuments.length === 0 && (
//           <div className="text-center py-8">
//             <FaFileAlt className="mx-auto text-4xl text-gray-300 mb-2" />
//             <Typography variant="body1" className="text-gray-500">
//               {searchQuery ? "No matching documents found" : "No documents uploaded yet"}
//             </Typography>
//           </div>
//         )}
//       </div>
//     </AnimateOnScrollProvider>

// }
//       {/* Document Context Menu */}
//       <Menu
//         anchorEl={anchorEl}
//         open={Boolean(anchorEl)}
//         onClose={handleMenuClose}
//       >
//         <MenuItem onClick={handleDownload}>
//           <FaDownload className="mr-2" /> Download
//         </MenuItem>
//         <MenuItem onClick={handleDelete}>
//           <Delete className="mr-2" /> Delete
//         </MenuItem>
//       </Menu>
      
//     </div>
//   );
// };

// export default ActionButtons;















// "use client";
// import React, {JSX, useState } from "react";
// import { useRouter } from "next/navigation";
// import {
//   FaMobileAlt,
//   FaHome,
//   FaEnvelope,
//   FaBriefcase,
//   FaFilePdf,
//   FaFileImage,
//   FaFileWord,
//   FaFileExcel,
//   FaFilePowerpoint,
//   FaFileArchive,
//   FaFileAlt,
//   FaFileCode,
//   FaFileAudio,
//   FaFileVideo,
//   FaDownload,
//   FaSearch,
// } from "react-icons/fa";
// import {
//   TextField,
//   Button,
//   Chip,
//   Divider,
//   IconButton,
//   Tooltip,
//   Menu,
//   MenuItem,
//   InputAdornment,
//   Badge,
//   Avatar,
//   Typography,
// } from "@mui/material";
// import { Delete, MoreVert, FileUpload, CloudDownload } from "@mui/icons-material";

// interface Document {
//   url: string;
//   name: string;
//   type: string;
//   size?: string;
//   uploadedAt?: string;
// }

// interface ActionButtonsProps {
//   loginData: any;
//   roleId: number;
//   updateProfile: (updatedData: any) => void;
// }

// const fileTypeIcons: Record<string, JSX.Element> = {
//   pdf: <FaFilePdf className="text-red-500" />,
//   jpg: <FaFileImage className="text-green-500" />,
//   jpeg: <FaFileImage className="text-green-500" />,
//   png: <FaFileImage className="text-green-500" />,
//   gif: <FaFileImage className="text-green-500" />,
//   doc: <FaFileWord className="text-blue-500" />,
//   docx: <FaFileWord className="text-blue-500" />,
//   xls: <FaFileExcel className="text-green-600" />,
//   xlsx: <FaFileExcel className="text-green-600" />,
//   ppt: <FaFilePowerpoint className="text-orange-500" />,
//   pptx: <FaFilePowerpoint className="text-orange-500" />,
//   zip: <FaFileArchive className="text-yellow-500" />,
//   rar: <FaFileArchive className="text-yellow-500" />,
//   txt: <FaFileAlt className="text-gray-500" />,
//   csv: <FaFileCode className="text-blue-300" />,
//   json: <FaFileCode className="text-yellow-300" />,
//   mp3: <FaFileAudio className="text-purple-500" />,
//   wav: <FaFileAudio className="text-purple-500" />,
//   mp4: <FaFileVideo className="text-red-400" />,
//   mov: <FaFileVideo className="text-red-400" />,
// };

// const ActionButtons: React.FC<ActionButtonsProps> = ({
//   loginData,
//   roleId,
//   updateProfile,
// }) => {
//   const router = useRouter();
//   const [isEditing, setIsEditing] = useState(false);
//   const [formData, setFormData] = useState({ ...loginData });
//   const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
//   const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);

//   const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, doc: Document) => {
//     setAnchorEl(event.currentTarget);
//     setSelectedDoc(doc);
//   };

//   const handleMenuClose = () => {
//     setAnchorEl(null);
//     setSelectedDoc(null);
//   };

//   const handleDelete = () => {
//     // Implement delete functionality
//     handleMenuClose();
//   };

//   const handleDownload = () => {
//     if (selectedDoc) window.open(selectedDoc.url, "_blank");
//     handleMenuClose();
//   };

//   // Process documents
//   const rawDocuments = loginData?.individualProfessional?.profileData?.documents || [];
//   const processedDocuments: Document[] = rawDocuments.map((url: string) => ({
//     url,
//     name: decodeURIComponent(url.split('/').pop() || "Document"),
//     type: url.split('.').pop()?.toUpperCase() || 'FILE',
//     size: `${Math.floor(Math.random() * 5 + 1)} MB`, // Mock size
//     uploadedAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toLocaleDateString(),
//   }));

//   // Filter documents based on search
//   const filteredDocuments = processedDocuments.filter(doc =>
//     doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//     doc.type.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   // Group documents by type
//   const documentGroups = filteredDocuments.reduce((groups: Record<string, Document[]>, doc) => {
//     const type = doc.type;
//     if (!groups[type]) groups[type] = [];
//     groups[type].push(doc);
//     return groups;
//   }, {});

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFormData((prev: any) => ({ ...prev, [name]: value }));
//   };

//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       const imageUrl = URL.createObjectURL(file);
//       setProfilePhoto(imageUrl);
//     }
//   };

//   const handleSubmit = () => {
//     updateProfile(formData);
//     setIsEditing(false);
//   };

//   const handleCancel = () => {
//     setFormData({ ...loginData });
//     setIsEditing(false);
//   };

//   const profileData = loginData?.individualProfessional?.profileData?.profilePhoto || '';
//   const finalImage = profilePhoto || profileData || "/images/profile.png";

//   return (
//     <div className="w-full max-w-5xl mx-auto p-4 space-y-6">
//       {/* Profile Section */}
//       <div className="flex flex-col items-center md:flex-row md:items-center md:space-x-6">
//         <div className="relative w-28 h-28 rounded-full shadow-lg shadow-gray-400 hover:scale-105 transition-transform duration-300">
//           <img
//             src={finalImage}
//             alt="Profile"
//             className="w-full h-full object-cover rounded-full"
//           />
//           {isEditing && (
//             <>
//               <input
//                 id="profilePhoto"
//                 type="file"
//                 accept="image/*"
//                 onChange={handleImageChange}
//                 className="hidden"
//               />
//               <label
//                 htmlFor="profilePhoto"
//                 className="absolute bottom-0 left-0 right-0 text-center bg-black bg-opacity-70 text-white text-xs py-1 cursor-pointer rounded-b-lg hover:bg-opacity-90 transition"
//               >
//                 Upload Image
//               </label>
//             </>
//           )}
//         </div>

//         {/* Profile Info */}
//         <div className="text-center md:text-left mt-4 md:mt-0 space-y-1">
//           <h2 className="text-2xl font-semibold text-gray-800">
//             {formData?.firstName && formData?.lastName
//               ? `${formData.firstName} ${formData.lastName}`
//               : "Mr. Y"}
//           </h2>
//           <h2 className="text-xl text-gray-600">{formData?.screenName ?? "Mr."}</h2>
//           <p className="text-gray-500">
//             {loginData?.role?.name ?? loginData?.role ?? "Security Officer"}
//           </p>
//           <span className="text-sm text-yellow-500">
//             ✅ Usually responds within 1 hour
//           </span>
//         </div>
//       </div>

//       {/* Action Buttons */}
//       <div className="mt-3 flex flex-col md:flex-row">
//         {isEditing ? (
//           <>
//             <Button
//               variant="contained"
//               color="primary"
//               onClick={handleSubmit}
//               fullWidth
//               sx={{ bgcolor: "black", ":hover": { bgcolor: "#333" } }}
//             >
//               Save Profiled
//             </Button>
//             <Button
//               variant="outlined"
//               onClick={handleCancel}
//               fullWidth
//               sx={{ color: "black", borderColor: "black" }}
//             >
//               Back
//             </Button>
//           </>
//         ) : (
//           <Button
//             onClick={() => setIsEditing(true)}
//             fullWidth
//             variant="contained"
//             sx={{ bgcolor: "black", ":hover": { bgcolor: "#333" } }}
//           >
//             Update Profile
//           </Button>
//         )}
//       </div>

//       {/* Upgrade Button */}
//       {!isEditing && (
//         <Button
//           fullWidth
//           variant="contained"
//           sx={{ bgcolor: "#f97316", ":hover": { bgcolor: "#ea580c" } }}
//         >
//           Upgrade My Membership
//         </Button>
//       )}

//       {/* Documents Section */}
//       <div className="space-y-6 mt-5">
//         <Divider className="my-4">
//           <Chip 
//             label={
//               <div className="flex items-center space-x-2">
//                 <CloudDownload />
//                 <span>My Documents ({processedDocuments.length})</span>
//               </div>
//             } 
//             color="primary" 
//           />
//         </Divider>

//         {/* Document Controls */}
//         <div className="flex flex-col md:flex-row justify-between gap-4 mt-3">
//           <TextField
//             size="small"
//             placeholder="Search documents..."
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             InputProps={{
//               startAdornment: (
//                 <InputAdornment position="start">
//                   <FaSearch className="text-gray-400" />
//                 </InputAdornment>
//               ),
//             }}
//             sx={{ width: '100%', maxWidth: 400 }}
//           />

//           {isEditing && (
//             <Button
//               variant="contained"
//               startIcon={<FileUpload />}
//               sx={{ bgcolor: 'primary.main', whiteSpace: 'nowrap' }}
//             >
//               Upload New
//             </Button>
//           )}
//         </div>

//         {/* Document Display */}
//         {Object.entries(documentGroups).map(([type, docs]) => (
//   <div key={type} className="space-y-6">
//     {/* Document Group Header */}
//     <div className="flex justify-between items-center">
//       <Typography variant="h6" className="font-semibold text-gray-700">
//         {type} Files ({docs.length})
//       </Typography>
//       <Typography variant="body2" className="text-gray-500">
//         {docs.length} items
//       </Typography>
//     </div>

//     {/* Document Grid Layout */}
//     <div className="space-y-6">
//   {docs.map((doc, index) => {
//     // Extract the name part of the document (without number prefix and file extension)
//     const docName = doc.name.split('-').slice(1).join(' ').replace(/\.[^/.]+$/, '');

//     return (
//       <div key={index} className="flex justify-between items-center p-4 bg-white border border-gray-300 rounded-lg shadow-sm transition-all duration-200">
        
//         {/* Document Info Section */}
//         <div className="flex items-center space-x-4">
//           <Avatar className="w-14 h-14 bg-gray-200">
//             {fileTypeIcons[doc.type.toLowerCase()] || <FaFileAlt className="text-gray-600" />}
//           </Avatar>

//           <div className="flex flex-col">
//             <Typography variant="subtitle1" className="font-medium text-gray-800">
//               {docName} {/* Show document name without the file prefix and extension */}
//             </Typography>
//             <Typography variant="body2" className="text-gray-500">
//               {doc.size} • {doc.uploadedAt}
//             </Typography>
//           </div>
//         </div>

//         {/* Action Buttons: Download, Delete */}
//         <div className="flex items-center space-x-4">
//           <Tooltip title="Download">
//             <IconButton
//               size="small"
//               onClick={() => window.open(doc.url, "_blank")}
//               sx={{
//                 color: 'primary.main',
//                 '&:hover': { color: 'blue.500' }
//               }}
//             >
//               <FaDownload />
//             </IconButton>
//           </Tooltip>

//           {isEditing && (
//             <Tooltip title="Delete">
//               <IconButton
//                 size="small"
//                 onClick={handleDelete}
//                 sx={{
//                   color: 'red.500',
//                   '&:hover': { color: 'red.700' }
//                 }}
//               >
//                 <Delete />
//               </IconButton>
//             </Tooltip>
//           )}
//         </div>
//       </div>
//     );
//   })}
// </div>

//   </div>
// ))}


//         {/* Empty State */}
//         {filteredDocuments.length === 0 && (
//           <div className="text-center py-8">
//             <FaFileAlt className="mx-auto text-4xl text-gray-300 mb-2" />
//             <Typography variant="body1" className="text-gray-500">
//               {searchQuery ? "No matching documents found" : "No documents uploaded yet"}
//             </Typography>
//           </div>
//         )}
//       </div>

//       {/* Document Context Menu */}
//       <Menu
//         anchorEl={anchorEl}
//         open={Boolean(anchorEl)}
//         onClose={handleMenuClose}
//       >
//         <MenuItem onClick={handleDownload}>
//           <FaDownload className="mr-2" /> Download
//         </MenuItem>
//         <MenuItem onClick={handleDelete}>
//           <Delete className="mr-2" /> Delete
//         </MenuItem>
//       </Menu>
//     </div>
//   );
// };

// export default ActionButtons;






// "use client";
// import React, { useState,JSX } from "react";
// import { useRouter } from "next/navigation";
// import {
//   FaFilePdf,
//   FaFileImage,
//   FaFileWord,
//   FaFileExcel,
//   FaFilePowerpoint,
//   FaFileArchive,
//   FaFileAlt,
//   FaFileCode,
//   FaFileAudio,
//   FaFileVideo,
//   FaDownload,
//   FaSearch,
// } from "react-icons/fa";
// import {
//   TextField,
//   Button,
//   Chip,
//   Divider,
//   IconButton,
//   Tooltip,
//   Menu,
//   MenuItem,
//   InputAdornment,
//   Badge,
//   Avatar,
//   Typography,
// } from "@mui/material";
// import { Delete, MoreVert, FileUpload, CloudDownload } from "@mui/icons-material";

// interface Document {
//   url: string;
//   name: string;
//   type: string;
//   size?: string;
//   uploadedAt?: string;
// }

// interface ActionButtonsProps {
//   loginData: any;
//   roleId: number;
//   updateProfile: (updatedData: any) => void;
// }

// const fileTypeIcons: Record<string, JSX.Element> = {
//   pdf: <FaFilePdf className="text-red-500" />,
//   jpg: <FaFileImage className="text-green-500" />,
//   jpeg: <FaFileImage className="text-green-500" />,
//   png: <FaFileImage className="text-green-500" />,
//   gif: <FaFileImage className="text-green-500" />,
//   doc: <FaFileWord className="text-blue-500" />,
//   docx: <FaFileWord className="text-blue-500" />,
//   xls: <FaFileExcel className="text-green-600" />,
//   xlsx: <FaFileExcel className="text-green-600" />,
//   ppt: <FaFilePowerpoint className="text-orange-500" />,
//   pptx: <FaFilePowerpoint className="text-orange-500" />,
//   zip: <FaFileArchive className="text-yellow-500" />,
//   rar: <FaFileArchive className="text-yellow-500" />,
//   txt: <FaFileAlt className="text-gray-500" />,
//   csv: <FaFileCode className="text-blue-300" />,
//   json: <FaFileCode className="text-yellow-300" />,
//   mp3: <FaFileAudio className="text-purple-500" />,
//   wav: <FaFileAudio className="text-purple-500" />,
//   mp4: <FaFileVideo className="text-red-400" />,
//   mov: <FaFileVideo className="text-red-400" />,
// };

// const ActionButtons: React.FC<ActionButtonsProps> = ({
//   loginData,
//   roleId,
//   updateProfile,
// }) => {
//   const router = useRouter();
//   const [isEditing, setIsEditing] = useState(false);
//   const [formData, setFormData] = useState({ ...loginData });
//   const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
//   const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);

//   // Document management functions
//   const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, doc: Document) => {
//     setAnchorEl(event.currentTarget);
//     setSelectedDoc(doc);
//   };

//   const handleMenuClose = () => {
//     setAnchorEl(null);
//     setSelectedDoc(null);
//   };

//   const handleDelete = () => {
//     // Implement delete functionality
//     handleMenuClose();
//   };

//   const handleDownload = () => {
//     if (selectedDoc) window.open(selectedDoc.url, "_blank");
//     handleMenuClose();
//   };

//   // Process documents
//   const rawDocuments = loginData?.individualProfessional?.profileData?.documents || [];
//   const processedDocuments: Document[] = rawDocuments.map((url: string) => ({
//     url,
//     name: decodeURIComponent(url.split('/').pop() || "Document"),
//     type: url.split('.').pop()?.toUpperCase() || 'FILE',
//     size: `${Math.floor(Math.random() * 5 + 1)} MB`, // Mock size
//     uploadedAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toLocaleDateString(), // Mock date
//   }));

//   // Filter documents based on search
//   const filteredDocuments = processedDocuments.filter(doc =>
//     doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//     doc.type.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   // Group documents by type
//   const documentGroups = filteredDocuments.reduce((groups: Record<string, Document[]>, doc) => {
//     const type = doc.type;
//     if (!groups[type]) groups[type] = [];
//     groups[type].push(doc);
//     return groups;
//   }, {});

//   return (
//     <div className="w-full max-w-5xl mx-auto p-4 space-y-6">
//       {/* Profile Section (unchanged) */}
//       {/* ... */}
  
//       {/* Documents Section */}
//       <div className="space-y-6">
//         {/* Documents Header */}
//         <Divider className="my-4">
//           <Chip 
//             label={
//               <div className="flex items-center space-x-2">
//                 <CloudDownload />
//                 <span>My Documents ({processedDocuments.length})</span>
//               </div>
//             } 
//             color="primary" 
//           />
//         </Divider>
  
//         {/* Document Controls */}
//         <div className="flex flex-col md:flex-row justify-between gap-4">
//           {/* Search Documents */}
//           <TextField
//             size="small"
//             placeholder="Search documents..."
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             InputProps={{
//               startAdornment: (
//                 <InputAdornment position="start">
//                   <FaSearch className="text-gray-400" />
//                 </InputAdornment>
//               ),
//             }}
//             sx={{ width: '100%', maxWidth: 400 }}
//           />
  
//           {/* Upload Button */}
//           {isEditing && (
//             <Button
//               variant="contained"
//               startIcon={<FileUpload />}
//               sx={{ bgcolor: 'primary.main', whiteSpace: 'nowrap' }}
//             >
//               Upload New
//             </Button>
//           )}
//         </div>
  
//         {/* Document Groups */}
//         {Object.entries(documentGroups).map(([type, docs]) => (
//           <div key={type} className="space-y-3">
//             {/* Document Type Header */}
//             <Typography variant="subtitle1" className="font-medium text-gray-600">
//               {type} Files ({docs.length})
//             </Typography>
  
//             {/* Document Grid with Improved Styling */}
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//               {docs.map((doc, index) => (
//                 <div key={index} className="border-2 rounded-lg shadow-lg p-6 transition-transform transform hover:scale-105 hover:shadow-xl bg-white">
//                   {/* Document Header */}
//                   <div className="flex items-start space-x-3">
//                     <Badge
//                       badgeContent={doc.type}
//                       color="primary"
//                       anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
//                     >
//                       <Avatar className="w-14 h-14">
//                         {fileTypeIcons[doc.type.toLowerCase()] || <FaFileAlt />}
//                       </Avatar>
//                     </Badge>
  
//                     {/* Document Details */}
//                     <div className="flex-1 min-w-0">
//                       <Typography variant="subtitle2" className="font-medium truncate text-gray-800">
//                         {doc.name}
//                       </Typography>
//                       <Typography variant="caption" className="text-gray-500">
//                         {doc.size} • {doc.uploadedAt}
//                       </Typography>
//                     </div>
  
//                     {/* Document Menu */}
//                     <div>
//                       <IconButton onClick={(e) => handleMenuOpen(e, doc)}>
//                         <MoreVert />
//                       </IconButton>
//                     </div>
//                   </div>
  
//                   {/* Document Actions */}
//                   <div className="mt-4 flex justify-end space-x-2">
//                     <Tooltip title="Download">
//                       <IconButton
//                         size="small"
//                         onClick={() => window.open(doc.url, "_blank")}
//                         sx={{
//                           color: 'primary.main',
//                           '&:hover': { color: 'blue.500' }
//                         }}
//                       >
//                         <FaDownload className="text-gray-500 hover:text-blue-500" />
//                       </IconButton>
//                     </Tooltip>
  
//                     {/* Delete Action */}
//                     {isEditing && (
//                       <Tooltip title="Delete">
//                         <IconButton
//                           size="small"
//                           onClick={handleDelete}
//                           sx={{
//                             color: 'red.500',
//                             '&:hover': { color: 'red.700' }
//                           }}
//                         >
//                           <Delete className="text-gray-500 hover:text-red-500" />
//                         </IconButton>
//                       </Tooltip>
//                     )}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         ))}
  
//         {/* Empty State for No Documents */}
//         {filteredDocuments.length === 0 && (
//           <div className="text-center py-8">
//             <FaFileAlt className="mx-auto text-4xl text-gray-300 mb-2" />
//             <Typography variant="body1" className="text-gray-500">
//               {searchQuery ? "No matching documents found" : "No documents uploaded yet"}
//             </Typography>
//           </div>
//         )}
//       </div>
  
//       {/* Document Context Menu */}
//       <Menu
//         anchorEl={anchorEl}
//         open={Boolean(anchorEl)}
//         onClose={handleMenuClose}
//       >
//         <MenuItem onClick={handleDownload}>
//           <FaDownload className="mr-2" /> Download
//         </MenuItem>
//         <MenuItem onClick={handleDelete}>
//           <Delete className="mr-2" /> Delete
//         </MenuItem>
//       </Menu>
//     </div>
//   );
  
  
  
// };

// export default ActionButtons;




// "use client";
// import React, { useState,JSX  } from "react";
// import { useRouter } from "next/navigation";
// import {
//   FaFilePdf,
//   FaFileImage,
//   FaFileWord,
//   FaFileExcel,
//   FaFilePowerpoint,
//   FaFileArchive,
//   FaFileAlt,
//   FaFileCode,
//   FaFileAudio,
//   FaFileVideo,
//   FaDownload,
// } from "react-icons/fa";
// import {
//   TextField,
//   Button,
//   List,
//   ListItem,
//   ListItemIcon,
//   ListItemText,
//   IconButton,
//   Tooltip,
//   Chip,
//   Divider,
// } from "@mui/material";
// import { FileCopy, Delete } from "@mui/icons-material";

// interface ActionButtonsProps {
//   loginData: any;
//   roleId: number;
//   updateProfile: (updatedData: any) => void;
// }

// const fileTypeIcons: Record<string, JSX.Element> = {
//   pdf: <FaFilePdf className="text-red-500" />,
//   jpg: <FaFileImage className="text-green-500" />,
//   jpeg: <FaFileImage className="text-green-500" />,
//   png: <FaFileImage className="text-green-500" />,
//   gif: <FaFileImage className="text-green-500" />,
//   doc: <FaFileWord className="text-blue-500" />,
//   docx: <FaFileWord className="text-blue-500" />,
//   xls: <FaFileExcel className="text-green-600" />,
//   xlsx: <FaFileExcel className="text-green-600" />,
//   ppt: <FaFilePowerpoint className="text-orange-500" />,
//   pptx: <FaFilePowerpoint className="text-orange-500" />,
//   zip: <FaFileArchive className="text-yellow-500" />,
//   rar: <FaFileArchive className="text-yellow-500" />,
//   txt: <FaFileAlt className="text-gray-500" />,
//   csv: <FaFileCode className="text-blue-300" />,
//   json: <FaFileCode className="text-yellow-300" />,
//   mp3: <FaFileAudio className="text-purple-500" />,
//   wav: <FaFileAudio className="text-purple-500" />,
//   mp4: <FaFileVideo className="text-red-400" />,
//   mov: <FaFileVideo className="text-red-400" />,
// };

// const ActionButtons: React.FC<ActionButtonsProps> = ({
//   loginData,
//   roleId,
//   updateProfile,
// }) => {
//   const router = useRouter();
//   const [isEditing, setIsEditing] = useState(false);
//   const [formData, setFormData] = useState({ ...loginData });
//   const [profilePhoto, setProfilePhoto] = useState<string | null>(null);

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFormData((prev: any) => ({ ...prev, [name]: value }));
//   };

//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       const imageUrl = URL.createObjectURL(file);
//       setProfilePhoto(imageUrl);
//     }
//   };

//   const handleSubmit = () => {
//     updateProfile(formData);
//     setIsEditing(false);
//   };

//   const handleCancel = () => {
//     setFormData({ ...loginData });
//     setIsEditing(false);
//   };

//   // Get all documents
//   const documents = loginData?.individualProfessional?.profileData?.documents || [];
//   const profileData = loginData?.individualProfessional?.profileData?.profilePhoto || '';

//   const finalImage = profilePhoto || profileData || "/images/profile.png";

//   // Function to get file icon based on extension
//   const getFileIcon = (url: string) => {
//     const extension = url.split('.').pop()?.toLowerCase() || 'file';
//     return fileTypeIcons[extension] || <FaFileAlt className="text-gray-400" />;
//   };

//   // Function to extract filename from URL
//   const getFilename = (url: string) => {
//     return decodeURIComponent(url.split('/').pop() || "Document");
//   };

//   // Function to get file type
//   const getFileType = (url: string) => {
//     const extension = url.split('.').pop()?.toUpperCase() || 'FILE';
//     return extension;
//   };

//   // Function to format file size (mock - would need actual size data)
//   const formatFileSize = () => {
//     return Math.floor(Math.random() * 5 + 1) + " MB"; // Mock size
//   };

//   return (
//     <div className="w-full max-w-5xl mx-auto p-4">
//       {/* Profile Section (unchanged) */}
//       {/* ... */}
//       <div className="flex flex-col items-center md:flex-row md:items-center md:space-x-6">
//         <div className="relative w-28 h-28 rounded-full shadow-lg shadow-gray-400 hover:scale-105 transition-transform duration-300">
//           <img
//             src={finalImage}
//             alt="Profile"
//             className="w-full h-full object-cover rounded-full"
//           />
//           {isEditing && (
//             <>
//               <input
//                 id="profilePhoto"
//                 type="file"
//                 accept="image/*"
//                 onChange={handleImageChange}
//                 className="hidden"
//               />
//               <label
//                 htmlFor="profilePhoto"
//                 className="absolute bottom-0 left-0 right-0 text-center bg-black bg-opacity-70 text-white text-xs py-1 cursor-pointer rounded-b-lg hover:bg-opacity-90 transition"
//               >
//                 Upload Image
//               </label>
//             </>
//           )}
//         </div>

//         {/* Profile Info */}
//         <div className="text-center md:text-left mt-4 md:mt-0 space-y-1">
//           <h2 className="text-2xl font-semibold text-gray-800">
//             {formData?.firstName && formData?.lastName
//               ? `${formData.firstName} ${formData.lastName}`
//               : "Mr. Y"}
//           </h2>
//           <h2 className="text-xl text-gray-600">{formData?.screenName ?? "Mr."}</h2>
//           <p className="text-gray-500">
//             {loginData?.role?.name ?? loginData?.role ?? "Security Officer"}
//           </p>
//           <span className="text-sm text-yellow-500">
//             ✅ Usually responds within 1 hour
//           </span>
//         </div>
//       </div>

//       {/* Action Buttons */}
//       <div className="mt-6 flex flex-col md:flex-row gap-3">
//         {isEditing ? (
//           <>
//             <Button
//               variant="contained"
//               color="primary"
//               onClick={handleSubmit}
//               fullWidth
//               sx={{ bgcolor: "black", ":hover": { bgcolor: "#333" } }}
//             >
//               Save Profile
//             </Button>
//             <Button
//               variant="outlined"
//               onClick={handleCancel}
//               fullWidth
//               sx={{ color: "black", borderColor: "black" }}
//             >
//               Back
//             </Button>
//           </>
//         ) : (
//           <Button
//             onClick={() => setIsEditing(true)}
//             fullWidth
//             variant="contained"
//             sx={{ bgcolor: "black", ":hover": { bgcolor: "#333" } }}
//           >
//             Update Profile
//           </Button>
//         )}
//       </div>

//       {/* Upgrade Button */}
//       {!isEditing && (
//         <Button
//           fullWidth
//           variant="contained"
//           sx={{ mt: 2, bgcolor: "#f97316", ":hover": { bgcolor: "#ea580c" } }}
//         >
//           Upgrade My Membership
//         </Button>
//       )}

      
      
//       {/* Documents Section */}
//       {documents.length > 0 && (
//         <div className="mt-8">
//           <Divider className="my-4">
//             <Chip label="My Documents" color="primary" />
//           </Divider>
          
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             {documents.map((docUrl: string, index: number) => (
//               <div 
//                 key={index}
//                 className="border rounded-lg p-4 hover:shadow-md transition-shadow"
//               >
//                 <div className="flex items-start space-x-3">
//                   <div className="text-3xl pt-1">
//                     {getFileIcon(docUrl)}
//                   </div>
//                   <div className="flex-1 min-w-0">
//                     <p className="font-medium truncate">{getFilename(docUrl)}</p>
//                     <div className="flex space-x-2 text-sm text-gray-500 mt-1">
//                       <span>{getFileType(docUrl)}</span>
//                       <span>•</span>
//                       <span>{formatFileSize()}</span>
//                     </div>
//                   </div>
//                   <div className="flex space-x-2">
//                     <Tooltip title="Download">
//                       <IconButton 
//                         size="small"
//                         onClick={() => window.open(docUrl, "_blank")}
//                       >
//                         <FaDownload className="text-gray-500 hover:text-blue-500" />
//                       </IconButton>
//                     </Tooltip>
//                     {isEditing && (
//                       <Tooltip title="Delete">
//                         <IconButton size="small">
//                           <Delete className="text-gray-500 hover:text-red-500" />
//                         </IconButton>
//                       </Tooltip>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ActionButtons;









// "use client";
// import React, { useState } from "react";
// import { useRouter } from "next/navigation";
// import {
//   FaMobileAlt,
//   FaHome,
//   FaEnvelope,
//   FaBriefcase,
//   FaFilePdf,
//   FaFileImage,
//   FaFileWord,
//   FaFileAlt,
// } from "react-icons/fa";
// import TextField from "@mui/material/TextField";
// import Button from "@mui/material/Button";
// import List from "@mui/material/List";
// import ListItem from "@mui/material/ListItem";
// import ListItemIcon from "@mui/material/ListItemIcon";
// import ListItemText from "@mui/material/ListItemText";
// import IconButton from "@mui/material/IconButton";
// import Tooltip from "@mui/material/Tooltip";

// interface ActionButtonsProps {
//   loginData: any;
//   roleId: number;
//   updateProfile: (updatedData: any) => void;
// }

// const ActionButtons: React.FC<ActionButtonsProps> = ({
//   loginData,
//   roleId,
//   updateProfile,
// }) => {
//   const router = useRouter();
//   const [isEditing, setIsEditing] = useState(false);
//   const [formData, setFormData] = useState({ ...loginData });
//   const [profilePhoto, setProfilePhoto] = useState<string | null>(null);

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFormData((prev: any) => ({ ...prev, [name]: value }));
//   };

//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       const imageUrl = URL.createObjectURL(file);
//       setProfilePhoto(imageUrl);
//     }
//   };

//   const handleSubmit = () => {
//     updateProfile(formData);
//     setIsEditing(false);
//   };

//   const handleCancel = () => {
//     setFormData({ ...loginData });
//     setIsEditing(false);
//   };

//   // Get all documents
//   const documents = loginData?.individualProfessional?.profileData?.documents || [];
//   const profileData = loginData?.individualProfessional?.profileData?.profilePhoto || '';

//   const finalImage = profilePhoto || profileData || "/images/profile.png";

//   // Function to get file icon based on extension
//   const getFileIcon = (url: string) => {
//     if (url.endsWith(".pdf")) return <FaFilePdf className="text-red-500" />;
//     if (url.endsWith(".doc") || url.endsWith(".docx")) return <FaFileWord className="text-blue-500" />;
//     if (url.endsWith(".jpg") || url.endsWith(".jpeg") || url.endsWith(".png")) return <FaFileImage className="text-green-500" />;
//     return <FaFileAlt className="text-gray-500" />;
//   };

//   // Function to extract filename from URL
//   const getFilename = (url: string) => {
//     return url.split('/').pop() || "Document";
//   };

//   return (
//     <div className="w-full max-w-5xl mx-auto p-4">
//       {/* Profile Section */}
//       <div className="flex flex-col items-center md:flex-row md:items-center md:space-x-6">
//         <div className="relative w-28 h-28 rounded-full shadow-lg shadow-gray-400 hover:scale-105 transition-transform duration-300">
//           <img
//             src={finalImage}
//             alt="Profile"
//             className="w-full h-full object-cover rounded-full"
//           />
//           {isEditing && (
//             <>
//               <input
//                 id="profilePhoto"
//                 type="file"
//                 accept="image/*"
//                 onChange={handleImageChange}
//                 className="hidden"
//               />
//               <label
//                 htmlFor="profilePhoto"
//                 className="absolute bottom-0 left-0 right-0 text-center bg-black bg-opacity-70 text-white text-xs py-1 cursor-pointer rounded-b-lg hover:bg-opacity-90 transition"
//               >
//                 Upload Image
//               </label>
//             </>
//           )}
//         </div>

//         {/* Profile Info */}
//         <div className="text-center md:text-left mt-4 md:mt-0 space-y-1">
//           <h2 className="text-2xl font-semibold text-gray-800">
//             {formData?.firstName && formData?.lastName
//               ? `${formData.firstName} ${formData.lastName}`
//               : "Mr. Y"}
//           </h2>
//           <h2 className="text-xl text-gray-600">{formData?.screenName ?? "Mr."}</h2>
//           <p className="text-gray-500">
//             {loginData?.role?.name ?? loginData?.role ?? "Security Officer"}
//           </p>
//           <span className="text-sm text-yellow-500">
//             ✅ Usually responds within 1 hour
//           </span>
//         </div>
//       </div>

//       {/* Action Buttons */}
//       <div className="mt-6 flex flex-col md:flex-row gap-3">
//         {isEditing ? (
//           <>
//             <Button
//               variant="contained"
//               color="primary"
//               onClick={handleSubmit}
//               fullWidth
//               sx={{ bgcolor: "black", ":hover": { bgcolor: "#333" } }}
//             >
//               Save Profile
//             </Button>
//             <Button
//               variant="outlined"
//               onClick={handleCancel}
//               fullWidth
//               sx={{ color: "black", borderColor: "black" }}
//             >
//               Back
//             </Button>
//           </>
//         ) : (
//           <Button
//             onClick={() => setIsEditing(true)}
//             fullWidth
//             variant="contained"
//             sx={{ bgcolor: "black", ":hover": { bgcolor: "#333" } }}
//           >
//             Update Profile
//           </Button>
//         )}
//       </div>

//       {/* Upgrade Button */}
//       {!isEditing && (
//         <Button
//           fullWidth
//           variant="contained"
//           sx={{ mt: 2, bgcolor: "#f97316", ":hover": { bgcolor: "#ea580c" } }}
//         >
//           Upgrade My Membership
//         </Button>
//       )}

//       {/* Documents Section */}
//       {documents.length > 0 && (
//         <div className="mt-6">
//           <h3 className="text-lg font-semibold mb-3">Documents</h3>
//           <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
//             {documents.map((docUrl: string, index: number) => (
//               <ListItem
//                 key={index}
//                 secondaryAction={
//                   <Tooltip title="View Document">
//                     <IconButton 
//                       edge="end" 
//                       onClick={() => window.open(docUrl, "_blank")}
//                     >
//                       <FaBriefcase />
//                     </IconButton>
//                   </Tooltip>
//                 }
//               >
//                 <ListItemIcon>
//                   {getFileIcon(docUrl)}
//                 </ListItemIcon>
//                 <ListItemText 
//                   primary={getFilename(docUrl)} 
//                   secondary={docUrl.split('/').slice(0, -1).join('/')} 
//                 />
//               </ListItem>
//             ))}
//           </List>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ActionButtons;








// "use client";
// import React, { useState } from "react";
// import { useRouter } from "next/navigation";
// import {
//   FaMobileAlt,
//   FaHome,
//   FaEnvelope,
//   FaBriefcase,
// } from "react-icons/fa";
// import TextField from "@mui/material/TextField";
// import Button from "@mui/material/Button";

// interface ActionButtonsProps {
//   loginData: any;
//   roleId: number;
//   updateProfile: (updatedData: any) => void;
// }

// const ActionButtons: React.FC<ActionButtonsProps> = ({
//   loginData,
//   roleId,
//   updateProfile,
// }) => {
//   const router = useRouter();
//   const [isEditing, setIsEditing] = useState(false);
//   const [formData, setFormData] = useState({ ...loginData });
//   const [profilePhoto, setProfilePhoto] = useState<string | null>(null);

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFormData((prev: any) => ({ ...prev, [name]: value }));
//   };

//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       const imageUrl = URL.createObjectURL(file);
//       setProfilePhoto(imageUrl);
//     }
//   };

//   const handleSubmit = () => {
//     updateProfile(formData);
//     setIsEditing(false);
//   };

//   const handleCancel = () => {
//     setFormData({ ...loginData });
//     setIsEditing(false);
//   };

//   // Separate image and PDF URLs
//   const documents = loginData?.individualProfessional?.profileData?.documents || [];
//   const profileData = loginData?.individualProfessional?.profileData?.profilePhoto || '';


//   const pdfUrl = documents.find((url: string) => url.endsWith(".pdf"));

//   const finalImage =
//     profilePhoto || profileData || "/images/profile.png";

//   return (
//     <div className="w-full max-w-5xl mx-auto p-4">
//       {/* Profile Section */}
//       <div className="flex flex-col items-center md:flex-row md:items-center md:space-x-6">
//         <div className="relative w-28 h-28 rounded-full shadow-lg shadow-gray-400 hover:scale-105 transition-transform duration-300">
//           <img
//             src={finalImage}
//             alt="Profile"
//             className="w-full h-full object-cover rounded-full"
//           />
//           {isEditing && (
//             <>
//               <input
//                 id="profilePhoto"
//                 type="file"
//                 accept="image/*"
//                 onChange={handleImageChange}
//                 className="hidden"
//               />
//               <label
//                 htmlFor="profilePhoto"
//                 className="absolute bottom-0 left-0 right-0 text-center bg-black bg-opacity-70 text-white text-xs py-1 cursor-pointer rounded-b-lg hover:bg-opacity-90 transition"
//               >
//                 Upload Image
//               </label>
//             </>
//           )}
//         </div>

//         {/* Profile Info */}
//         <div className="text-center md:text-left mt-4 md:mt-0 space-y-1">
//           <h2 className="text-2xl font-semibold text-gray-800">
//             {formData?.firstName && formData?.lastName
//               ? `${formData.firstName} ${formData.lastName}`
//               : "Mr. Y"}
//           </h2>
//           <h2 className="text-xl text-gray-600">{formData?.screenName ?? "Mr."}</h2>
//           <p className="text-gray-500">
//             {loginData?.role?.name ?? loginData?.role ?? "Security Officer"}
//           </p>
//           <span className="text-sm text-yellow-500">
//             ✅ Usually responds within 1 hour
//           </span>
//         </div>
//       </div>

//       {/* Action Buttons */}
//       <div className="mt-6 flex flex-col md:flex-row gap-3">
//         {isEditing ? (
//           <>
//             <Button
//               variant="contained"
//               color="primary"
//               onClick={handleSubmit}
//               fullWidth
//               sx={{ bgcolor: "black", ":hover": { bgcolor: "#333" } }}
//             >
//               Save Profile
//             </Button>
//             <Button
//               variant="outlined"
//               onClick={handleCancel}
//               fullWidth
//               sx={{ color: "black", borderColor: "black" }}
//             >
//               Back
//             </Button>
//           </>
//         ) : (
//           <Button
//             onClick={() => setIsEditing(true)}
//             fullWidth
//             variant="contained"
//             sx={{ bgcolor: "black", ":hover": { bgcolor: "#333" } }}
//           >
//             Update Profile
//           </Button>
//         )}
//       </div>

//       {/* Upgrade Button */}
//       {!isEditing && (
//         <Button
//           fullWidth
//           variant="contained"
//           sx={{ mt: 2, bgcolor: "#f97316", ":hover": { bgcolor: "#ea580c" } }}
//         >
//           Upgrade My Membership
//         </Button>
//       )}

//       {/* View PDF Button */}
//       {pdfUrl && (
//         <Button
//           variant="outlined"
//           color="primary"
//           onClick={() => window.open(pdfUrl, "_blank")}
//           sx={{ mt: 4 }}
//         >
//           View Document
//         </Button>
//       )}
//     </div>
//   );
// };

// export default ActionButtons;






// "use client";
// import React, { useState } from "react";
// import { useRouter } from "next/navigation";
// import {
//   FaMobileAlt,
//   FaHome,
//   FaEnvelope,
//   FaBriefcase,
// } from "react-icons/fa";
// import TextField from "@mui/material/TextField";
// import Button from "@mui/material/Button";

// interface ActionButtonsProps {
//   loginData: any;
//   roleId: number;
//   updateProfile: (updatedData: any) => void;
// }

// const ActionButtons: React.FC<ActionButtonsProps> = ({
//   loginData,
//   roleId,
//   updateProfile,
// }) => {
//   const router = useRouter();
//   const [isEditing, setIsEditing] = useState(false);
//   const [formData, setFormData] = useState({ ...loginData });
//   const [profilePhoto, setProfilePhoto] = useState<string | null>(null);

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFormData((prev: any) => ({ ...prev, [name]: value }));
//   };

//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       const imageUrl = URL.createObjectURL(file);
//       setProfilePhoto(imageUrl);
//     }
//   };

//   const handleSubmit = () => {
//     updateProfile(formData); // Pass form data to the parent function
//     setIsEditing(false); // Optionally disable editing mode after saving
//   };

//   const handleCancel = () => {
//     setFormData({ ...loginData });
//     setIsEditing(false);
//   };

//   // Check for PDF or image URLs in documents
//   const documentUrl = loginData?.individualProfessional?.profileData?.documents?.find(
//     (url: string) => url.endsWith(".pdf") || url.match(/\.(jpeg|jpg|png)$/)
//   );

//   return (
//     <div className="w-full max-w-5xl mx-auto p-4">
//       {/* Profile & Header */}
//       <div className="flex flex-col items-center md:flex-row md:items-center md:space-x-6">
//         <div className="relative w-28 h-28 rounded-full shadow-lg shadow-gray-400 hover:scale-105 transition-transform duration-300">
//           {/* Check if documentUrl is an image */}
//           {documentUrl && documentUrl.match(/\.(jpeg|jpg|png)$/) ? (
//             <img
//               src={documentUrl}
//               alt="Profile"
//               className="w-full h-full object-cover rounded-full"
//             />
//           ) : (
//             // Fallback image
//             <div
//               className="w-full h-full bg-cover bg-center rounded-full"
//               style={{
//                 backgroundImage: `url(${
//                   profilePhoto ||
//                   loginData?.individualProfessional?.profileData?.documents[1] ||
//                   "/images/profile.png"
//                 })`,
//               }}
//             />
//           )}

//           {isEditing && (
//             <>
//               <input
//                 id="profilePhoto"
//                 type="file"
//                 accept="image/*"
//                 onChange={handleImageChange}
//                 className="hidden"
//               />
//               <label
//                 htmlFor="profilePhoto"
//                 className="absolute bottom-0 left-0 right-0 text-center bg-black bg-opacity-70 text-white text-xs py-1 cursor-pointer rounded-b-lg hover:bg-opacity-90 transition"
//               >
//                 Upload Image
//               </label>
//             </>
//           )}
//         </div>
//         <div className="text-center md:text-left mt-4 md:mt-0 space-y-1">
//           <h2 className="text-2xl font-semibold text-gray-800">
//             {formData?.firstName && formData?.lastName
//               ? `${formData.firstName} ${formData.lastName}`
//               : "Mr. Y"}
//           </h2>
//           <h2 className="text-xl text-gray-600">{formData?.screenName ?? "Mr."}</h2>
//           <p className="text-gray-500">
//             {loginData?.role?.name ?? loginData?.role ?? "Security Officer"}
//           </p>
//           <span className="text-sm text-yellow-500">
//             ✅ Usually responds within 1 hour
//           </span>
//         </div>
//       </div>

//       {/* Buttons */}
//       <div className="mt-6 flex flex-col md:flex-row gap-3">
//         {isEditing ? (
//           <>
//             <Button
//               variant="contained"
//               color="primary"
//               onClick={handleSubmit}
//               fullWidth
//               sx={{ bgcolor: "black", ":hover": { bgcolor: "#333" } }}
//             >
//               Save Profile
//             </Button>
//             <Button
//               variant="outlined"
//               onClick={handleCancel}
//               fullWidth
//               sx={{ color: "black", borderColor: "black" }}
//             >
//               Back
//             </Button>
//           </>
//         ) : (
//           <Button
//             onClick={() => setIsEditing(true)}
//             fullWidth
//             variant="contained"
//             sx={{ bgcolor: "black", ":hover": { bgcolor: "#333" } }}
//           >
//             Update Profile
//           </Button>
//         )}
//       </div>

//       {!isEditing && (
//         <Button
//           fullWidth
//           variant="contained"
//           sx={{ mt: 2, bgcolor: "#f97316", ":hover": { bgcolor: "#ea580c" } }}
//         >
//           Upgrade My Membership
//         </Button>
//       )}

//       {/* PDF Button (if document exists) */}
//       {documentUrl && documentUrl.endsWith(".pdf") && (
//         <Button
//           variant="outlined"
//           color="primary"
//           onClick={() => window.open(documentUrl, "_blank")}
//           sx={{ mt: 4 }}
//         >
//           View Document
//         </Button>
//       )}
//     </div>
//   );
// };

// export default ActionButtons;















// "use client";
// import React, { useState } from "react";
// import { useRouter } from "next/navigation";
// import {
//   FaMobileAlt,
//   FaHome,
//   FaEnvelope,
//   FaBriefcase,
// } from "react-icons/fa";
// import TextField from "@mui/material/TextField";
// import Button from "@mui/material/Button";

// interface ActionButtonsProps {
//   loginData: any;
//   roleId: number;
//   updateProfile: (updatedData: any) => void;
// }

// const ActionButtons: React.FC<ActionButtonsProps> = ({
//   loginData,
//   roleId,
//   updateProfile,
// }) => {
//   const router = useRouter();
//   const [isEditing, setIsEditing] = useState(false);
//   const [formData, setFormData] = useState({ ...loginData });
//   const [profilePhoto, setProfilePhoto] = useState<string | null>(null);

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFormData((prev: any) => ({ ...prev, [name]: value }));
//   };

//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       const imageUrl = URL.createObjectURL(file);
//       setProfilePhoto(imageUrl);
//     }
//   };

//   const handleSubmit = () => {
//     updateProfile(formData); // Pass form data to the parent function
//     setIsEditing(false); // Optionally disable editing mode after saving
//   };

//   const handleCancel = () => {
//     setFormData({ ...loginData });
//     setIsEditing(false);
//   };

//    // Check for PDF or image URLs in documents
//    const documentUrl = loginData?.individualProfessional?.profileData?.documents?.find(
//     (url: string) => url.endsWith(".pdf") || url.match(/\.(jpeg|jpg|png)$/)
//   );

//   return (
//     <div className="w-full max-w-5xl mx-auto p-4">
//       {/* Profile & Header */}
//       <div className="flex flex-col items-center md:flex-row md:items-center md:space-x-6">
//         <div
//           className="w-28 h-28 rounded-full shadow-lg shadow-gray-400 hover:scale-105 transition-transform duration-300 relative"
//           style={{
//             backgroundImage: `url(${
//               documentUrl
//               // profilePhoto ||
//               // loginData?.individualProfessional?.profileData?.documents[1] ||
//               // "/images/profile.png"
//             })`,
//             backgroundSize: "cover",
//             backgroundPosition: "center",
//           }}
//         >
//           {isEditing && (
//             <>
//               <input
//                 id="profilePhoto"
//                 type="file"
//                 accept="image/*"
//                 onChange={handleImageChange}
//                 className="hidden"
//               />
//               <label
//                 htmlFor="profilePhoto"
//                 className="absolute bottom-0 left-0 right-0 text-center bg-black bg-opacity-70 text-white text-xs py-1 cursor-pointer rounded-b-lg hover:bg-opacity-90 transition"
//               >
//                 Upload Image
//               </label>
//             </>
//           )}
//         </div>
//         <div className="text-center md:text-left mt-4 md:mt-0 space-y-1">
//           <h2 className="text-2xl font-semibold text-gray-800">
//             {formData?.firstName && formData?.lastName
//               ? `${formData.firstName} ${formData.lastName}`
//               : "Mr. Y"}
//           </h2>
//           <h2 className="text-xl text-gray-600">
//             {formData?.screenName ?? "Mr."}
//           </h2>
//           <p className="text-gray-500">
//             {loginData?.role?.name ?? loginData?.role ?? "Security Officer"}
//           </p>
//           <span className="text-sm text-yellow-500">
//             ✅ Usually responds within 1 hour
//           </span>
//         </div>
//       </div>

//       {/* Buttons */}
//       <div className="mt-6 flex flex-col md:flex-row gap-3">
//         {isEditing ? (
//           <>
//             <Button
//               variant="contained"
//               color="primary"
//               onClick={handleSubmit}
//               fullWidth
//               sx={{ bgcolor: "black", ":hover": { bgcolor: "#333" } }}
//             >
//               Save Profile
//             </Button>
//             <Button
//               variant="outlined"
//               onClick={handleCancel}
//               fullWidth
//               sx={{ color: "black", borderColor: "black" }}
//             >
//               Back
//             </Button>
//           </>
//         ) : (
//           <Button
//             onClick={() => setIsEditing(true)}
//             fullWidth
//             variant="contained"
//             sx={{ bgcolor: "black", ":hover": { bgcolor: "#333" } }}
//           >
//             Update Profile
//           </Button>
//         )}
//       </div>

     

//       {!isEditing && (
//         <Button
//           fullWidth
//           variant="contained"
//           sx={{ mt: 2, bgcolor: "#f97316", ":hover": { bgcolor: "#ea580c" } }}
//         >
//           Upgrade My Membership
//         </Button>
//       )}
//        {/* PDF Button (if document exists) */}
//        {documentUrl && (
//         <Button
//           variant="outlined"
//           color="primary"
//           onClick={() => window.open(documentUrl, "_blank")}
//           sx={{ mt: 4 }}
//         >
//           View Document
//         </Button>
//       )}
//     </div>
//   );
// };

// export default ActionButtons;









// "use client";
// import React, { useState } from "react";
// import { useRouter } from "next/navigation";
// import {
//   FaMobileAlt,
//   FaHome,
//   FaEnvelope,
//   FaBriefcase,
// } from "react-icons/fa";
// import TextField from "@mui/material/TextField";
// import Button from "@mui/material/Button";

// interface ActionButtonsProps {
//   loginData: any;
//   roleId: number;
//   updateProfile: (updatedData: any) => void;
// }

// const ActionButtons: React.FC<ActionButtonsProps> = ({
//   loginData,
//   roleId,
//   updateProfile,
// }) => {
//   const router = useRouter();
//   const [isEditing, setIsEditing] = useState(false);
//   const [formData, setFormData] = useState({ ...loginData });
//   const [profilePhoto, setProfilePhoto] = useState<string | null>(null);

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFormData((prev: any) => ({ ...prev, [name]: value }));
//   };

//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       const imageUrl = URL.createObjectURL(file);
//       setProfilePhoto(imageUrl);
//     }
//   };

//   const handleSubmit = () => {
//     updateProfile(formData); // Pass form data to the parent function
//     setIsEditing(false); // Optionally disable editing mode after saving
//   };

//   console.log("login data", loginData?.individualProfessional?.profileData?.documents)
//   const handleCancel = () => {
//     setFormData({ ...loginData });
//     setIsEditing(false);
//   };

//   return (
//     <div className="w-full max-w-5xl mx-auto p-4">
//       {/* Profile & Header */}
//       <div className="flex flex-col items-center md:flex-row md:items-center md:space-x-6">
//         <div
//           className="w-28 h-28 rounded-full shadow-lg shadow-gray-400 hover:scale-105 transition-transform duration-300 relative"
//           style={{
//             backgroundImage: `url(${
//               profilePhoto ||
//               loginData?.individualProfessional?.profileData?.documents[1] ||
//               "/images/profile.png"
//             })`,
//             backgroundSize: "cover",
//             backgroundPosition: "center",
//           }}
//         >
//           {isEditing && (
//              <>
//              <input
//                id="profilePhoto"
//                type="file"
//                accept="image/*"
//                onChange={handleImageChange}
//                className="hidden"
//              />
//              <label
//                htmlFor="profilePhoto"
//                className="absolute bottom-0 left-0 right-0 text-center bg-black bg-opacity-70 text-white text-xs py-1 cursor-pointer rounded-b-lg hover:bg-opacity-90 transition"
//              >
//                Upload Image
//              </label>
//            </>
//           )}
//         </div>
//         <div className="text-center md:text-left mt-4 md:mt-0 space-y-1">
//           <h2 className="text-2xl font-semibold text-gray-800">
//             {formData?.firstName && formData?.lastName
//               ? `${formData.firstName} ${formData.lastName}`
//               : "Mr. Y"}
//           </h2>
//           <h2 className="text-xl text-gray-600">
//             {formData?.screenName ?? "Mr."}
//           </h2>
//           <p className="text-gray-500">
//             {loginData?.role?.name ?? loginData?.role ?? "Security Officer"}
//           </p>
//           <span className="text-sm text-yellow-500">
//             ✅ Usually responds within 1 hour
//           </span>
//         </div>
//       </div>

//       {/* 2-1-2-1 layout */}
//       <div className="flex flex-wrap mt-6 gap-4">
//         {/* Row 1: 2 fields */}
//         <div className="w-full md:w-[48%]">
//           <TextField
//             label="First Name"
//             name="firstName"
//             value={formData.firstName || ""}
//             onChange={handleInputChange}
//             disabled={!isEditing}
//             fullWidth
//             size="small"
//           />
//         </div>
//         <div className="w-full md:w-[48%]">
//           <TextField
//             label="Last Name"
//             name="lastName"
//             value={formData.lastName || ""}
//             onChange={handleInputChange}
//             disabled={!isEditing}
//             fullWidth
//             size="small"
//           />
//         </div>

//         {/* Row 2: 1 field */}
//         <div className="w-full">
//           <TextField
//             label="Screen Name"
//             name="screenName"
//             value={formData.screenName || ""}
//             onChange={handleInputChange}
//             disabled={!isEditing}
//             fullWidth
//             size="small"
//           />
//         </div>

//         {/* Row 3: 2 fields */}
//         <div className="w-full md:w-[48%]">
//           <TextField
//             label="Email"
//             name="email"
//             value={formData.email || ""}
//             onChange={handleInputChange}
//             disabled={!isEditing}
//             fullWidth
//             size="small"
//           />
//         </div>
//         <div className="w-full md:w-[48%]">
//           <TextField
//             label="Phone Number"
//             name="phoneNumber"
//             value={formData.phoneNumber || ""}
//             onChange={handleInputChange}
//             disabled={!isEditing}
//             fullWidth
//             size="small"
//           />
//         </div>

//         {/* Row 4: 1 field */}
//         <div className="w-full">
//           <TextField
//             label="Address"
//             name="address"
//             value={formData.address || ""}
//             onChange={handleInputChange}
//             disabled={!isEditing}
//             fullWidth
//             size="small"
//           />
//         </div>
//       </div>

//       {/* Buttons */}
//       <div className="mt-6 flex flex-col md:flex-row gap-3">
//         {isEditing ? (
//           <>
//             <Button
//               variant="contained"
//               color="primary"
//               onClick={handleSubmit}
//               fullWidth
//               sx={{ bgcolor: "black", ":hover": { bgcolor: "#333" } }}
//             >
//               Save Profile
//             </Button>
//             <Button
//               variant="outlined"
//               onClick={handleCancel}
//               fullWidth
//               sx={{ color: "black", borderColor: "black" }}
//             >
//               Back
//             </Button>
//           </>
//         ) : (
//           <Button
//             onClick={() => setIsEditing(true)}
//             fullWidth
//             variant="contained"
//             sx={{ bgcolor: "black", ":hover": { bgcolor: "#333" } }}
//           >
//             Update Profile
//           </Button>
//         )}
//       </div>

//       {!isEditing && (
//         <Button
//           fullWidth
//           variant="contained"
//           sx={{ mt: 2, bgcolor: "#f97316", ":hover": { bgcolor: "#ea580c" } }}
//         >
//           Upgrade My Membership
//         </Button>
//       )}
//     </div>
//   );
// };

// export default ActionButtons;
