import {
  useState,
  useRef,
  useEffect,
  ChangeEvent,
  DragEvent,
  FormEvent,
} from "react";
import { FiUpload } from "react-icons/fi";
import { MdClose } from "react-icons/md";
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

interface FormData {
  name: string;
  description: string;
  price: string;
  categories: string[];
  customCategory: string;
  image: File | null;
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
  const [PriceInputIsFocused, PriceInputSetIsFocused] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate();

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

  const handleImageDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    handleImageFile(file);
  };

  const handleImageFile = (file: File | null) => {
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors({ ...errors, image: "File size must be less than 5MB" });
        return;
      }
      if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
        setErrors({
          ...errors,
          image: "Only JPG, PNG, and WebP files are allowed",
        });
        return;
      }
      setFormData({ ...formData, image: file });

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
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
      if (formData.image) data.append("image", formData.image);

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
      });
      setSelectedCategories([]);
      setImagePreview("");
      localStorage.removeItem("productFormDraft");
      navigate("/myshop");
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A15] p-4 md:p-8">
      <div className="max-w-2xl mx-auto bg-[#12121F] rounded-lg shadow-xl p-6 border border-gray-800">
        <h1 className="text-3xl font-light text-white mb-8">
          Create New Product
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Product Name */}
          <div>
            <label htmlFor="name" className="block text-white mb-2">
              Product Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full bg-[#1A1A2E] text-white rounded-md px-4 py-2 focus:outline-none focus:ring-1 focus:ring-purple-400 border border-gray-700"
              placeholder="Enter product name"
            />
            {errors.name && (
              <p className="text-red-400 text-sm mt-1">{errors.name}</p>
            )}
          </div>
          <div>
            <label htmlFor="description" className="block text-white mb-2">
              Description <span className="text-gray-500">(optional)</span>
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              maxLength={500}
              rows={4}
              className="w-full bg-[#1A1A2E] text-white rounded-md px-4 py-2 focus:outline-none focus:ring-1 focus:ring-purple-400 border border-gray-700"
              placeholder="Optional product description"
            />
          </div>

          {/* CATEGORY */}

          <div className="relative">
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-200 mb-2"
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
            >
              Select Category
            </label>
            {showTooltip && (
              <div className="absolute -top-10 left-0 bg-gray-700 text-white text-xs rounded py-1 px-2">
                Choose a product category from the list
              </div>
            )}
            <div className="relative">
              <button
                type="button"
                className={`w-full bg-gray-800 border ${
                  error ? "border-red-500" : "border-purple-500"
                } rounded-md py-2 pl-3 pr-10 text-left shadow-sm focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 sm:text-sm text-gray-200`}
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
                        className="w-full pl-10 pr-3 py-2 border border-gray-600 rounded-md leading-5 bg-gray-700 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
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
              <label className="block text-white mb-2">
                Price<span className="text-red-500">*</span>
              </label>
              <div
                className={`relative border ${
                  errors
                    ? "border-red-500"
                    : PriceInputIsFocused
                    ? "border-purple-500"
                    : "border-gray-700"
                } rounded-lg shadow-sm transition-all hover:border-purple-400 bg-[#121212]`}
              >
                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                  <FaDollarSign
                    className={`${
                      errors ? "text-red-500" : "text-purple-400"
                    } text-sm`}
                  />
                </div>
                <input
                  type="text"
                  value={formData.price}
                  onChange={handlePriceChange}
                  onFocus={() => PriceInputSetIsFocused(true)}
                  onBlur={() => PriceInputSetIsFocused(false)}
                  className="w-full bg-[#121212] text-purple-400 text-sm py-2 px-8 rounded-lg focus:outline-none"
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
          <div>
            <label className="block text-white mb-2">
              Product Image <span className="text-gray-500">(optional)</span>
            </label>
            <div
              onDrop={handleImageDrop}
              onDragOver={(e) => e.preventDefault()}
              className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center hover:border-[#6A5ACD] transition-colors"
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={(e) => {
                  if (e.target.files) {
                    handleImageFile(e.target.files[0]);
                  }
                }}
                accept=".jpg,.jpeg,.png,.webp"
                className="hidden"
              />
              {imagePreview ? (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="max-h-48 mx-auto rounded"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImagePreview("");
                      setFormData({ ...formData, image: null });
                    }}
                    className="absolute top-0 right-0 bg-red-500 rounded-full p-1 transform translate-x-1/2 -translate-y-1/2"
                  >
                    <MdClose className="text-white" />
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="cursor-pointer"
                >
                  <FiUpload className="mx-auto text-gray-400 mb-2" size={24} />
                  <p className="text-gray-400">
                    Drag & drop or click to upload
                  </p>
                  <p className="text-gray-500 text-sm">Max size: 5MB</p>
                </div>
              )}
            </div>
            {errors.image && (
              <p className="text-red-400 text-sm mt-1">{errors.image}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 rounded-md bg-purple-600 text-white hover:bg-purple-700 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? "Submitting..." : "Create Product"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProductCreationForm;
