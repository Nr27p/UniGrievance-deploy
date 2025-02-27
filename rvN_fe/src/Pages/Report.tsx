import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { storage } from "../api/firebase"; // Firebase storage import
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import mammoth from "mammoth"; // For DOC/DOCX reading

export default function ReportForm() {
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [descriptionType, setDescriptionType] = useState("normal");
  const [descriptionText, setDescriptionText] = useState("");
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState(""); // Store uploaded file name
  const [selectedOption, setSelectedOption] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imageName, setImageName] = useState(""); // Store uploaded image name
  const token = localStorage.getItem("token");
  const options = ["traffic", "water", "fire", "police", "pwd"];
  // const navigate = useNavigate();

  // Handle department selection
  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    setIsOpen(false);
  };

  // Handle image upload
  const handleImageUpload = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImageName(file.name); // Display file name
    }
  };

  // Handle DOC/DOCX file upload
  const handleFileUpload = (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      setFileName(uploadedFile.name); // Display file name
    }
  };

  // Function to read DOC/DOCX content
  const readDOCContent = async (file) => {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value; // Extracted plain text
  };

  // Handle form submission
  const handleSubmit = async () => {
    try {
      let description = "";

      // Handle description type
      if (descriptionType === "file" && file) {
        const fileType = file.type;

        if (
          fileType === "application/msword" ||
          fileType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        ) {
          description = await readDOCContent(file);
        } else {
          toast.error("Unsupported file type. Please upload a DOC or DOCX file.");
          return;
        }
      } else {
        description = descriptionText;
      }

      if (!imageFile) {
        toast.error("Please select an image.");
        return;
      }

      // Upload image to Firebase
      const imageRef = ref(storage, `reports/${imageFile.name}`);
      await uploadBytes(imageRef, imageFile);
      const imageURL = await getDownloadURL(imageRef);

      if (!imageURL) {
        throw new Error("Failed to get download URL.");
      }

      // Prepare form data
      const formData = {
        title,
        location,
        description,
        image: imageURL,
        department: selectedOption,
      };

      // Send data to backend
      const response = await axios.post(
        "http://localhost:5000/user/postUserReports",
        formData,
        {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        }
      );

      console.log(response.data);
      toast.success("Incident reported successfully!");

      // ✅ Reset form fields
      setTitle("");
      setLocation("");
      setDescriptionText("");
      setFile(null);
      setFileName("");
      setImageFile(null);
      setImageName("");
      setSelectedOption("");
      setDescriptionType("normal");
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to submit the form. Please try again later.");
    }
  };

  return (
    <div className="space-y-8 max-w-[800px] backdrop-blur-sm p-5 rounded-lg border-2 border-opacity-95">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold">Report an Incident/Problem</h2>
        <p className="text-gray-500 dark:text-gray-400">
          Fill out the form below and we'll get back to you as soon as possible.
        </p>
      </div>

      <div className="space-y-4">
        {/* Title */}
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            className="text-black"
            id="title"
            placeholder="Enter a brief title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        {/* Location */}
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input
            className="text-black"
            id="location"
            placeholder="Enter the location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label>Select description type</Label>
          <select
            className="block w-full border rounded text-gray-500 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
            value={descriptionType}
            onChange={(e) => setDescriptionType(e.target.value)}
          >
            <option value="normal">Normal Text</option>
            <option value="file">Upload DOC/DOCX</option>
          </select>

          {descriptionType === "normal" ? (
            <Input
              className="text-black"
              id="descriptionText"
              placeholder="Describe the issue"
              value={descriptionText}
              onChange={(e) => setDescriptionText(e.target.value)}
            />
          ) : (
            <div className="space-y-2">
              <Label htmlFor="fileUpload">Upload DOC/DOCX</Label>
              <Input
                id="fileUpload"
                type="file"
                accept=".doc,.docx"
                onChange={handleFileUpload}
              />
              {fileName && <p className="text-sm text-gray-500">Uploaded: {fileName}</p>}
            </div>
          )}
        </div>

        {/* Department Selection */}
        <div className="relative text-left flex flex-col gap-2">
          <Label>Select a department</Label>
          <button
            type="button"
            className="inline-flex justify-between w-full rounded-md border px-4 py-2 bg-white text-sm text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            onClick={() => setIsOpen(!isOpen)}
          >
            {selectedOption || "Select an option"}
          </button>
          {isOpen && (
            <div className="mt-2 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
              <div className="py-1">
                {options.map((option, index) => (
                  <button
                    key={index}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                    onClick={() => handleOptionSelect(option)}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Image Upload */}
        <div className="space-y-2">
          <Label htmlFor="imageUpload">Upload Image</Label>
          <Input id="imageUpload" type="file" accept="image/*" onChange={handleImageUpload} />
          {imageName && <p className="text-sm text-gray-500">Uploaded: {imageName}</p>}
        </div>

        {/* Submit Button */}
        <Button onClick={handleSubmit}>Report Problem</Button>
      </div>
    </div>
  );
}
