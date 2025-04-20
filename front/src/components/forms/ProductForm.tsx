import {
  useState,
  useEffect,
  ChangeEvent,
  FormEvent,
  useCallback,
} from "react";
import { FiPlus, FiTrash2, FiUpload } from "react-icons/fi";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import {
  FaAccessibleIcon,
  FaChevronDown,
  FaDollarSign,
  FaGem,
  FaHome,
  FaMobileAlt,
  FaPlus,
  FaRunning,
  FaSearch,
  FaTrash,
  FaTshirt,
} from "react-icons/fa";
import { BsChevronDown, BsChevronUp } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { useDropzone } from "react-dropzone";

interface FormData {
  name: string;
  description: string;
  price: string;
  categories: string[];
  customCategory: string;
  image: File | null;
  additionalImages: File[];
}

interface Errors {
  name?: string;
  price?: string;
  category?: string;
  image?: string;
}

const ProductCreationForm = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    description: "",
    price: "",
    categories: [],
    customCategory: "",
    image: null,
    additionalImages: [],
  });

  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");
  const [showTooltip, setShowTooltip] = useState(false);
  const [isAddingCustom, setIsAddingCustom] = useState(false);
  const [customCategory, setCustomCategory] = useState("");

  const [errors, setErrors] = useState<Errors>({});
  const { getAccessTokenSilently } = useAuth0();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const navigate = useNavigate();

  /*Image*/
  const [primaryImage, setPrimaryImage] = useState<
    (File & { preview: string }) | null
  >(null);
  const [additionalImages, setAdditionalImages] = useState<
    (File & { preview: string })[]
  >([]);

  const categories = [
    { id: 1, name: "Jewelry", icon: <FaGem /> },
    { id: 2, name: "Clothing", icon: <FaTshirt /> },
    { id: 3, name: "Electronics", icon: <FaMobileAlt /> },
    { id: 4, name: "Accessories", icon: <FaAccessibleIcon /> },
    { id: 5, name: "Home Goods", icon: <FaHome /> },
    { id: 6, name: "Sports & Outdoors", icon: <FaRunning /> },
  ];

  const handleCategorySelect = (category: string) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(
        selectedCategories.filter((cat) => cat !== category)
      );
    } else if (selectedCategories.length < 3) {
      setSelectedCategories([...selectedCategories, category]);
    } else {
      setError("Maximum 3 categories allowed");
      setTimeout(() => setError(""), 3000);
    }
    setIsOpen(false);
  };

  const handleClearSelection = (categoryToRemove: string) => {
    setSelectedCategories(
      selectedCategories.filter((cat) => cat !== categoryToRemove)
    );
    setSearchTerm("");
  };

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCustomCategorySubmit = () => {
    if (customCategory.trim()) {
      if (selectedCategories.length < 3) {
        setSelectedCategories([...selectedCategories, customCategory.trim()]);
        setIsAddingCustom(false);
        setCustomCategory("");
        setIsOpen(false);
      } else {
        setError("Maximum 3 categories allowed");
        setTimeout(() => setError(""), 3000);
      }
    }
  };

  useEffect(() => {
    const savedDraft = localStorage.getItem("productFormDraft");
    if (savedDraft) {
      setFormData(JSON.parse(savedDraft));
    }
  }, []);

  const validateForm = (): boolean => {
    const newErrors: Errors = {};

    if (!formData.name || formData.name.length < 3) {
      newErrors.name = "Product name must be at least 3 characters";
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = "Price must be greater than 0";
    }
    if (formData.image && formData.image.size > 5 * 1024 * 1024) {
      newErrors.image = "File size must be less than 5MB";
    }
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      window.scrollTo({
        top: 225,
        behavior: "smooth", 
      });
    }

    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: undefined,
    }));

    localStorage.setItem(
      "productFormDraft",
      JSON.stringify({ ...formData, [name]: value })
    );
  };

  const formatPrice = (price: string) => {
    const numericValue = price.replace(/[^0-9.]/g, "");
    const parts = numericValue.split(".");
    if (parts.length > 2) return price;
    if (parts[1]?.length > 2) parts[1] = parts[1].slice(0, 2);
    return parts.join(".");
  };

  const handlePriceChange = (e: ChangeEvent<HTMLInputElement>) => {
    const formattedPrice = formatPrice(e.target.value);
    setFormData((prev) => ({ ...prev, price: formattedPrice }));

    if (!formattedPrice) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        price: "Price is required",
      }));
    } else if (parseFloat(formattedPrice) < 0) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        price: "Price cannot be negative",
      }));
    } else if (parseFloat(formattedPrice) > 1000000) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        price: "Price cannot exceed 1,000,000",
      }));
    } else {
      setErrors((prevErrors) => ({ ...prevErrors, price: undefined }));
    }
  };

  const incrementPrice = () => {
    const currentPrice = parseFloat(formData.price) || 0;
    setFormData((prev) => ({
      ...prev,
      price: (currentPrice + 1).toFixed(2),
    }));
  };

  const decrementPrice = () => {
    const currentPrice = parseFloat(formData.price) || 0;
    if (currentPrice > 0) {
      setFormData((prev) => ({
        ...prev,
        price: (currentPrice - 1).toFixed(2),
      }));
    }
  };

  const validateFile = (file: File) => {
    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!validTypes.includes(file.type)) {
      setError("Invalid file type. Please upload JPEG, PNG, or WebP images.");
      return false;
    }

    if (file.size > maxSize) {
      setError("File size exceeds 5MB limit.");
      return false;
    }

    return true;
  };

  const onPrimaryDrop = useCallback((acceptedFiles: File[]) => {
    setError("");
    const file = acceptedFiles[0];
    if (validateFile(file)) {
      setPrimaryImage(
        Object.assign(file, { preview: URL.createObjectURL(file) })
      );
    }
  }, []);

  const onAdditionalDrop = useCallback(
    (acceptedFiles: File[]) => {
      setError("");
      if (additionalImages.length + acceptedFiles.length > 7) {
        setError("Maximum 8 images allowed.");
        return;
      }
      const validFiles = acceptedFiles.filter(validateFile);
      const newImages = validFiles.map((file) =>
        Object.assign(file, { preview: URL.createObjectURL(file) })
      );

      setAdditionalImages((prev) => [...prev, ...newImages]);
    },
    [additionalImages]
  );

  const {
    getRootProps: getPrimaryRootProps,
    getInputProps: getPrimaryInputProps,
  } = useDropzone({
    onDrop: onPrimaryDrop,
    accept: {
      "image/jpeg": [],
      "image/png": [],
      "image/webp": [],
    },
    multiple: false,
  });

  const {
    getRootProps: getAdditionalRootProps,
    getInputProps: getAdditionalInputProps,
  } = useDropzone({
    onDrop: onAdditionalDrop,
    accept: {
      "image/jpeg": [],
      "image/png": [],
      "image/webp": [],
    },
    multiple: true,
  });

  const removePrimaryImage = () => {
    if (primaryImage) {
      URL.revokeObjectURL(primaryImage.preview);
      setPrimaryImage(null);
    }
  };

  const removeAdditionalImage = (index: number) => {
    setAdditionalImages((prev) => {
      const newImages = [...prev];
      URL.revokeObjectURL(newImages[index].preview);
      newImages.splice(index, 1);
      return newImages;
    });
  };
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const isValid = validateForm();

    if (!isValid) {
      console.log("Form validation failed!", errors);
      return;
    }

    setIsSubmitting(true);
    try {
      console.log("Submitting form data:", formData);
      const token = await getAccessTokenSilently();
      const data = new FormData();
      data.append("name", formData.name);
      data.append("description", formData.description);
      data.append("price", formData.price);
      data.append("categories", selectedCategories.join(","));
      if (primaryImage) data.append("image", primaryImage);
      additionalImages.forEach((file) => data.append("additionalImages", file));
      const response = await axios.post(
        "http://localhost:8080/api/product/create",
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Server response:", response.data); // Debugging log

      setFormData({
        name: "",
        description: "",
        price: "",
        categories: [],
        customCategory: "",
        image: null,
        additionalImages: [],
      });
      setSelectedCategories([]);
      localStorage.removeItem("productFormDraft");
      navigate("/myshop");
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4 py-12">
      <div className="max-w-4xl mx-auto bg-gray-800 rounded-xl shadow-xl p-8 space-y-8">
        <h1 className="text-3xl font-bold text-white">Create New Product</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Product Name */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-purple-300"
            >
              Product Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="mt-1 block w-full bg-gray-700 border-2 border-gray-600 rounded-lg
                       text-white px-4 py-2 focus:outline-none focus:border-purple-500
                       transition-colors duration-200"
              placeholder="Enter product name"
            />
            {errors.name && (
              <p className="text-red-400 text-sm mt-1">{errors.name}</p>
            )}
          </div>
          <div>
            <label htmlFor="description" className="block text-gray-300 mb-2">
              Description <span className="text-gray-500">(optional)</span>
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              maxLength={500}
              rows={4}
              className="mt-1 block w-full bg-gray-700 border-2 border-gray-600 rounded-lg
                       text-white px-4 py-2 focus:outline-none focus:border-purple-500
                       transition-colors duration-200"
              placeholder="Optional product description"
            />
          </div>

          {/* CATEGORY */}

          <div className="relative">
            <label
              htmlFor="category"
              className="block text-gray-300 mb-2"
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
            >
              Select Category <span className="text-gray-500">(optional)</span>
            </label>
            {showTooltip && (
              <div className="absolute -top-7 left-0 bg-gray-700 text-white text-xs rounded py-1 px-2">
                Choose a product category from the list
              </div>
            )}
            <div className="relative">
              <button
                type="button"
                className={`w-full flex flex-col items-center justify-center h-10 border-gray-600 border-2 rounded-lg cursor-pointer bg-gray-700 hover:bg-gray-600 transition-colors duration-200 py-2 pl-3 pr-10 text-left shadow-sm focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 sm:text-sm text-gray-200`}
                onClick={() => setIsOpen(!isOpen)}
                aria-haspopup="listbox"
                aria-expanded={isOpen}
                aria-labelledby="category-label"
              >
                <span className="flex items-center flex-wrap gap-2">
                  Select category
                </span>
                <span className="absolute inset-y-0 right-0 flex items-center pr-2">
                  <FaChevronDown
                    className="h-4 w-4 text-gray-400"
                    aria-hidden="true"
                  />
                </span>
              </button>

              {isOpen && (
                <div className="absolute z-10 mt-1 w-full bg-gray-800 shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-purple-500 ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                  <div className="sticky top-0 z-10 bg-gray-800 p-2">
                    <div className="relative">
                      <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        className="w-full pl-10 pr-3 py-2 border bg-gray-700 rounded-md leading-5 text-gray-200 placeholder-gray-400 "
                        placeholder="Search categories..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>

                  {filteredCategories.map((category) => (
                    <div
                      key={category.id}
                      className={`cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-gray-700 text-gray-200 ${
                        selectedCategories.includes(category.name)
                          ? "bg-purple-900"
                          : ""
                      }`}
                      onClick={() => handleCategorySelect(category.name)}
                      role="option"
                      aria-selected={selectedCategories.includes(category.name)}
                    >
                      <div className="flex items-center">
                        <span className="mr-2">{category.icon}</span>
                        {category.name}
                      </div>
                    </div>
                  ))}

                  <div className="border-t border-gray-600 mt-2 pt-2">
                    {isAddingCustom ? (
                      <div className="px-3 py-2">
                        <input
                          type="text"
                          className="w-full px-3 py-1 border border-gray-600 rounded-md bg-gray-700 text-gray-200 focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                          placeholder="Enter custom category"
                          value={customCategory}
                          onChange={(e) => setCustomCategory(e.target.value)}
                          onKeyPress={(e) =>
                            e.key === "Enter" && handleCustomCategorySubmit()
                          }
                        />
                      </div>
                    ) : (
                      <div
                        className="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-gray-700 text-purple-400 flex items-center"
                        onClick={() => setIsAddingCustom(true)}
                      >
                        <FaPlus className="mr-2" />
                        Add Custom Category
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-2 flex flex-wrap gap-2">
              {selectedCategories.map((category) => (
                <div
                  key={category}
                  className="flex items-center bg-gray-700 px-2 py-1 rounded"
                >
                  {categories.find((c) => c.name === category)?.icon}
                  <span className="ml-1">{category}</span>
                  <button
                    type="button"
                    onClick={() => handleClearSelection(category)}
                    className="ml-2 text-gray-400 hover:text-gray-200"
                    aria-label="Remove category"
                  >
                    <FaTrash className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {error && (
            <p className="mt-2 text-sm text-red-400" role="alert">
              {error}
            </p>
          )}

          {/* PRICE INPUT  */}

          <div className="w-full max-w-xs">
            <div className="relative">
              <label className="flex items-center flex-wrap gap-2 mb-2">
                Price<span className="text-red-500">*</span>
              </label>
              <div
                className={`relative border-gray-600 border-2 rounded-lg cursor-pointer bg-gray-700 hover:bg-gray-600 transition-colors duration-200`}
              >
                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                  <FaDollarSign
                    className={`${
                      errors ? "text-purple-500" : "text-purple-400"
                    } text-sm`}
                  />
                </div>
                <input
                  type="text"
                  value={formData.price}
                  onChange={handlePriceChange}
                  onFocus={() => PriceInputSetIsFocused(true)}
                  onBlur={() => PriceInputSetIsFocused(false)}
                  className="w-full bg-gray-700 text-purple-400 text-sm py-2 pl-10 pr-8 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500"
                  placeholder="0.00"
                  aria-label="Price input"
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-0.5">
                  <button
                    type="button"
                    onClick={incrementPrice}
                    className="p-1 hover:bg-purple-700 rounded"
                    aria-label="Increment price"
                  >
                    <BsChevronUp className="text-gray-400 group-hover:text-purple-400 text-xs" />
                  </button>
                  <button
                    type="button"
                    onClick={decrementPrice}
                    className="p-1 hover:bg-purple-700 rounded"
                    aria-label="Decrement price"
                  >
                    <BsChevronDown className="text-gray-400 group-hover:text-purple-400 text-xs" />
                  </button>
                </div>
              </div>
              {errors.price && (
                <div className="absolute -bottom-5 left-0 flex items-center text-red-500 text-xs">
                  {errors.price}
                </div>
              )}
            </div>
          </div>

          {/* File Upload */}

          <div className="max-w-4xl mx-auto bg-gray-800 rounded-xl px-0 pt-6 pb-6 space-y-6">
            <h2 className="text-2xl font-bold text-white mb-6">Image Upload</h2>

            {error && (
              <div
                className="bg-red-500 bg-opacity-20 text-red-200 p-4 rounded-lg"
                role="alert"
              >
                {error}
              </div>
            )}

            <div className="space-y-6">
              <div className="primary-upload">
                <h3 className="text-lg font-semibold text-white mb-3">
                  Primary Image
                </h3>
                {!primaryImage ? (
                  <div
                    {...getPrimaryRootProps()}
                    className="border-2 border-dashed border-purple-500 rounded-lg p-8 hover:border-purple-400 focus:outline-none focus:ring-1 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-all duration-200 ease-in-out focus:border-purple-600 focus:border-dashed focus:border-4 focus:border-purple-600 focus:dash-width-[4px]"
                  >
                    <input
                      {...getPrimaryInputProps()}
                      aria-label="Upload primary image"
                    />
                    <div className="text-center">
                      <FiUpload className="mx-auto h-12 w-12 text-purple-500" />
                      <p className="mt-2 text-sm text-gray-300">
                        Drag & drop your primary image here, or click to select
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="relative">
                    <img
                      src={primaryImage.preview}
                      alt="Primary preview"
                      className="w-full h-64 object-cover rounded-lg"
                    />
                    <button
                      onClick={removePrimaryImage}
                      className="absolute top-2 right-2 p-2 bg-red-500 rounded-full hover:bg-red-600 transition-colors"
                      aria-label="Remove primary image"
                    >
                      <FiTrash2 className="text-white" />
                    </button>
                  </div>
                )}
              </div>

              <div
                className="additional-uploads"
                style={{
                  overflowX: "auto",
                  scrollbarWidth: "thin",
                  scrollbarColor: "#6b46c1 #121212",
                }}
              >
                <h3 className="text-lg font-semibold text-white mb-3">
                  Additional Images
                </h3>
                <div className="flex gap-4 overflow-x-auto pb-4">
                  {additionalImages.map((image, index) => (
                    <div key={index} className="relative flex-shrink-0">
                      <img
                        src={image.preview}
                        alt={`Additional preview ${index + 1}`}
                        className="w-32 h-32 object-cover rounded-lg"
                      />
                      <button
                        onClick={() => removeAdditionalImage(index)}
                        className="absolute top-1 right-1 p-1.5 bg-red-500 rounded-full hover:bg-red-600 transition-colors"
                        aria-label={`Remove image ${index + 1}`}
                      >
                        <FiTrash2 className="text-white w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  {additionalImages.length < 7 && (
                    <div
                      {...getAdditionalRootProps()}
                      className="w-32 h-32 flex-shrink-0 border-2 border-dashed border-purple-500 rounded-lg flex items-center justify-center hover:border-purple-400 focus:border-purple-300"
                    >
                      <input
                        {...getAdditionalInputProps()}
                        aria-label="Upload additional images"
                      />
                      <FiPlus className="h-8 w-8 text-purple-500" />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="text-sm text-gray-400 mt-2">
              <p>Supported formats: JPEG, PNG, WebP</p>
              <p>Maximum file size: 5MB per image</p>
              <p>Maximum additional images: 7</p>
            </div>
          </div>

          {/* Submit Button */}

          <div className="flex justify-center mt-8">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 rounded-md bg-purple-600 text-white hover:bg-purple-700 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? "Submitting..." : "Create Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductCreationForm;
