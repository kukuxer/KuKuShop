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
import { FaDollarSign } from "react-icons/fa";
import { BsChevronDown, BsChevronUp } from "react-icons/bs";

interface FormData {
  name: string;
  description: string;
  price: string;
  category: string;
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
    category: "",
    customCategory: "",
    image: null,
  });

  const [errors, setErrors] = useState<Errors>({});
  const { getAccessTokenSilently } = useAuth0();
  const [PriceInputIsFocused, PriceInputSetIsFocused] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showCustomCategory, setShowCustomCategory] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const categories: string[] = [
    "Home Goods",
    "Jewelry",
    "Electronics",
    "Clothing",
    "Accessories",
  ];

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
    if (!formData.category) {
      newErrors.category = "Please select a category";
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
      data.append("category", formData.category);
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
        category: "",
        customCategory: "",
        image: null,
      });
      setImagePreview("");
      localStorage.removeItem("productFormDraft");
      setShowModal(false);
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

          {/* Category */}
          <div>
            <label htmlFor="category" className="block text-white mb-2">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={(e) => {
                if (e.target.value === "custom") {
                  setShowCustomCategory(true);
                } else {
                  handleInputChange(e);
                }
              }}
              className="w-full bg-[#1A1A2E] text-white rounded-md px-4 py-2 focus:outline-none focus:ring-1 focus:ring-purple-400 border border-gray-700"
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
              <option value="custom">Add Custom Category</option>
            </select>
            {errors.category && (
              <p className="text-red-400 text-sm mt-1">{errors.category}</p>
            )}
          </div>

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
                onChange={(e) => handleImageFile(e.target.files[0])}
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
