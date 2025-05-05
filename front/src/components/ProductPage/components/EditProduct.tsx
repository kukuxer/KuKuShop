import React, { useState, useCallback, useEffect, useRef } from "react";
import { useDropzone } from "react-dropzone";
import {
  FaGem,
  FaTshirt,
  FaMobileAlt,
  FaAccessibleIcon,
  FaHome,
  FaRunning,
  FaTrash,
  FaUpload,
  FaPlus,
  FaTimes,
} from "react-icons/fa";
import Product from "../../../entity/Product";

interface ProductEditionPageProps {
  product: Product;
  onClose: () => void;
}

interface Category {
  id: string;
  name: string;
  icon: React.ElementType;
}

interface ImageFile extends File {
  preview: string;
}

const ProductEditionPage: React.FC<ProductEditionPageProps> = ({
  product,
  onClose,
}) => {
  const [formData, setFormData] = useState({
    name: product.name || "",
    description: product.description || "",
    selectedCategories: product.categories || [],
    customCategory: "",
    mainImage: null as ImageFile | null,
    additionalImages: [] as ImageFile[],
  });

  const [errors, setErrors] = useState<{ name?: string; description?: string }>({});
  const [isDirty, setIsDirty] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  const categories: Category[] = [
    { id: "jewelry", name: "Jewelry", icon: FaGem },
    { id: "clothing", name: "Clothing", icon: FaTshirt },
    { id: "electronics", name: "Electronics", icon: FaMobileAlt },
    { id: "accessories", name: "Accessories", icon: FaAccessibleIcon },
    { id: "homeGoods", name: "Home Goods", icon: FaHome },
    { id: "sports", name: "Sports & Outdoors", icon: FaRunning },
  ];

  const onDrop = useCallback(
    (acceptedFiles: File[], type: "main" | "additional" = "main") => {
      if (type === "main") {
        const file = acceptedFiles[0];
        if (file && !formData.mainImage) {
          const imageWithPreview = Object.assign(file, {
            preview: URL.createObjectURL(file),
          });
          setFormData((prev) => ({
            ...prev,
            mainImage: imageWithPreview,
          }));
        }
      } else {
        const remainingSlots = 8 - formData.additionalImages.length;
        const newFiles = acceptedFiles.slice(0, remainingSlots).map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        );
        setFormData((prev) => ({
          ...prev,
          additionalImages: [...prev.additionalImages, ...newFiles],
        }));
      }
      setIsDirty(true);
    },
    [formData.mainImage, formData.additionalImages.length]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (files) => onDrop(files, "main"),
    accept: { "image/*": [] },
    maxFiles: 1,
  });

  const {
    getRootProps: getAdditionalRootProps,
    getInputProps: getAdditionalInputProps,
  } = useDropzone({
    onDrop: (files) => onDrop(files, "additional"),
    accept: { "image/*": [] },
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setIsDirty(true);
    validateField(name, value);
  };

  const validateField = (name: string, value: string) => {
    const newErrors = { ...errors };
    if (name === "name" && !value.trim()) newErrors.name = "Product name is required";
    else if (name === "description" && value.length > 500)
      newErrors.description = "Description cannot exceed 500 characters";
    else delete newErrors[name as keyof typeof newErrors];
    setErrors(newErrors);
  };

  const handleCategorySelect = (categoryId: string) => {
    setFormData((prev) => {
      const updatedCategories = prev.selectedCategories.includes(categoryId)
        ? prev.selectedCategories.filter((id) => id !== categoryId)
        : [...prev.selectedCategories, categoryId];
      return { ...prev, selectedCategories: updatedCategories };
    });
    setIsDirty(true);
  };

  const handleCustomCategoryChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData((prev) => ({ ...prev, customCategory: e.target.value }));
    setIsDirty(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid()) return;
    console.log("Submitting form data:", formData);
  };

  const isFormValid = (): boolean => {
    return (
      formData.name.trim() !== "" &&
      (formData.selectedCategories.length > 0 || formData.customCategory.trim() !== "") &&
      Object.keys(errors).length === 0
    );
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  useEffect(() => {
    return () => {
      if (formData.mainImage?.preview) URL.revokeObjectURL(formData.mainImage.preview);
      formData.additionalImages.forEach((img) => URL.revokeObjectURL(img.preview));
    };
  }, [formData]);

  return (
    <>
    {/* Inline style for custom scrollbar */}
    <style>
      {`
        /* Style scrollbar for webkit browsers (Chrome, Safari, Edge) */
        .relative::-webkit-scrollbar {
          width: 8px;
        }

        .relative::-webkit-scrollbar-thumb {
          background-color: #6A0DAD; /* Dark purple color */
          border-radius: 10px;
        }

        .relative::-webkit-scrollbar-track {
          background-color: #2A2A2A; /* Dark background for track */
        }

        /* For Firefox */
        .relative {
          scrollbar-width: thin;
          scrollbar-color: #6A0DAD #2A2A2A; /* thumb color, track color */
        }
      `}
    </style>

    <div
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#2A2A2A] bg-opacity-80 p-4"
    >
      <div
        ref={modalRef}
        className="relative bg-[#1A1A1A] text-[#E0E0E0] p-4 rounded-xl shadow-lg w-full max-w-2xl overflow-y-auto max-h-[90vh]"
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-white bg-red-600 hover:bg-red-700 rounded-full p-2"
        >
          <FaTimes />
        </button>
        <form onSubmit={handleSubmit} className="space-y-6">
          <h1 className="text-2xl font-bold">Edit Product</h1>

          {/* Name */}
          <div>
            <label className="block mb-2">Product Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-4 py-2 bg-[#2A2A2A] border border-[#404040] rounded-lg focus:outline-none focus:border-[#9B59B6]"
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              maxLength={500}
              rows={3}
              className="w-full px-4 py-2 bg-[#2A2A2A] border border-[#404040] rounded-lg focus:outline-none focus:border-[#9B59B6]"
            />
            <p className="text-sm text-[#808080]">
              {formData.description.length}/500 characters
            </p>
          </div>

          {/* Categories */}
          <div>
            <h2 className="text-lg font-semibold mb-2">Categories</h2>
            <div className="grid grid-cols-2 gap-2">
              {categories.map((category) => {
                const Icon = category.icon;
                const selected = formData.selectedCategories.includes(category.id);
                return (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => handleCategorySelect(category.id)}
                    className={`flex items-center px-3 py-2 rounded-lg space-x-2 ${
                      selected
                        ? "bg-[#6A0DAD] text-white"
                        : "bg-[#2A2A2A] hover:bg-[#8E44AD]"
                    }`}
                  >
                    <Icon className="text-xl" />
                    <span>{category.name}</span>
                  </button>
                );
              })}
            </div>
            <input
              type="text"
              value={formData.customCategory}
              onChange={handleCustomCategoryChange}
              placeholder="Add custom category"
              className="mt-2 w-full px-4 py-2 bg-[#2A2A2A] border border-[#404040] rounded-lg focus:outline-none focus:border-[#9B59B6]"
            />
          </div>

          {/* Images */}
          <div className="space-y-2">
            <h2 className="text-lg font-semibold">Images</h2>

            {/* Main */}
            {!formData.mainImage && (
              <div
                {...getRootProps()}
                className="border-2 border-dashed border-[#404040] p-6 rounded-lg text-center cursor-pointer hover:border-[#9B59B6]"
              >
                <input {...getInputProps()} />
                <p className="flex justify-center items-center gap-2">
                  <FaUpload /> Upload Main Image
                </p>
              </div>
            )}

            {/* Additional */}
            {formData.additionalImages.length < 8 && (
              <div
                {...getAdditionalRootProps()}
                className="border-2 border-dashed border-[#404040] p-6 rounded-lg text-center cursor-pointer hover:border-[#9B59B6]"
              >
                <input {...getAdditionalInputProps()} />
                <p className="flex justify-center items-center gap-2">
                  <FaPlus /> Add Additional Images ({8 - formData.additionalImages.length} remaining)
                </p>
              </div>
            )}

            {/* Previews */}
            {(formData.mainImage || formData.additionalImages.length > 0) && (
              <div className="grid grid-cols-2 gap-2 mt-2">
                {formData.mainImage && (
                  <div className="relative">
                    <img
                      src={formData.mainImage.preview}
                      alt="Main"
                      className="w-full h-32 object-cover rounded"
                    />
                    <span className="absolute top-1 left-1 bg-purple-600 text-xs px-2 py-0.5 rounded">
                      Main
                    </span>
                  </div>
                )}
                {formData.additionalImages.map((img, idx) => (
                  <div key={idx} className="relative">
                    <img
                      src={img.preview}
                      alt={`Additional ${idx + 1}`}
                      className="w-full h-32 object-cover rounded"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          additionalImages: prev.additionalImages.filter((_, i) => i !== idx),
                        }))
                      }
                      className="absolute top-1 right-1 p-1 bg-red-600 hover:bg-red-700 rounded-full"
                    >
                      <FaTrash className="text-xs" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="flex justify-between pt-4">
            <button
              type="submit"
              disabled={!isFormValid() || !isDirty}
              className={`px-4 py-2 rounded-lg font-semibold ${
                isFormValid() && isDirty
                  ? "bg-[#6A0DAD] hover:bg-[#8E44AD]"
                  : "bg-[#404040] cursor-not-allowed"
              }`}
            >
              Save Changes
            </button>

            <button
              type="button"
              className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-semibold"
            >
              Delete Product
            </button>
          </div>
        </form>
      </div>
    </div>
    </>
  );
};

export default ProductEditionPage;
