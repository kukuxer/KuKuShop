import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { FaGem, FaTshirt, FaMobileAlt, FaAccessibleIcon, FaHome, FaRunning, FaTrash, FaUpload, FaPlus } from "react-icons/fa";

const ProductEditionPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    selectedCategories: [],
    customCategory: "",
    mainImage: null,
    additionalImages: []
  });

  const [errors, setErrors] = useState({});
  const [isDirty, setIsDirty] = useState(false);

  const categories = [
    { id: "jewelry", name: "Jewelry", icon: FaGem },
    { id: "clothing", name: "Clothing", icon: FaTshirt },
    { id: "electronics", name: "Electronics", icon: FaMobileAlt },
    { id: "accessories", name: "Accessories", icon: FaAccessibleIcon },
    { id: "homeGoods", name: "Home Goods", icon: FaHome },
    { id: "sports", name: "Sports & Outdoors", icon: FaRunning }
  ];

  const onDrop = useCallback((acceptedFiles, type = "main") => {
    if (type === "main") {
      const file = acceptedFiles[0];
      if (file && !formData.mainImage) {
        setFormData(prev => ({
          ...prev,
          mainImage: Object.assign(file, {
            preview: URL.createObjectURL(file)
          })
        }));
      }
    } else {
      if (formData.additionalImages.length < 8) {
        const remainingSlots = 8 - formData.additionalImages.length;
        const newFiles = acceptedFiles.slice(0, remainingSlots).map(file => 
          Object.assign(file, {
            preview: URL.createObjectURL(file)
          })
        );
        setFormData(prev => ({
          ...prev,
          additionalImages: [...prev.additionalImages, ...newFiles]
        }));
      }
    }
    setIsDirty(true);
  }, [formData.mainImage, formData.additionalImages]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    maxFiles: 1
  });

  const { getRootProps: getAdditionalRootProps, getInputProps: getAdditionalInputProps } = useDropzone({
    onDrop: (files) => onDrop(files, "additional"),
    accept: { "image/*": [] }
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setIsDirty(true);
    validateField(name, value);
  };

  const validateField = (name, value) => {
    let newErrors = { ...errors };
    switch (name) {
      case "name":
        if (!value.trim()) {
          newErrors.name = "Product name is required";
        } else {
          delete newErrors.name;
        }
        break;
      case "description":
        if (value.length > 500) {
          newErrors.description = "Description cannot exceed 500 characters";
        } else {
          delete newErrors.description;
        }
        break;
      default:
        break;
    }
    setErrors(newErrors);
  };

  const handleCategorySelect = (categoryId) => {
    setFormData(prev => {
      const categories = prev.selectedCategories.includes(categoryId)
        ? prev.selectedCategories.filter(id => id !== categoryId)
        : [...prev.selectedCategories, categoryId];
      return { ...prev, selectedCategories: categories };
    });
    setIsDirty(true);
  };

  const handleCustomCategoryChange = (e) => {
    setFormData(prev => ({ ...prev, customCategory: e.target.value }));
    setIsDirty(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const isFormValid = () => {
    return formData.name.trim() !== "" && 
           (formData.selectedCategories.length > 0 || formData.customCategory.trim() !== "") && 
           Object.keys(errors).length === 0;
  };

  return (
    <div className="min-h-screen bg-[#1A1A1A] text-[#E0E0E0] p-6">
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-8">
        {(formData.mainImage || formData.additionalImages.length > 0) && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Current Images</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {formData.mainImage && (
                <div className="relative">
                  <img src={formData.mainImage.preview} alt="Main" className="w-full h-40 object-cover rounded-lg" />
                  <span className="absolute top-2 left-2 bg-purple-600 px-2 py-1 rounded text-sm">Main</span>
                </div>
              )}
              {formData.additionalImages.map((img, idx) => (
                <div key={idx} className="relative">
                  <img src={img.preview} alt={`Additional ${idx + 1}`} className="w-full h-40 object-cover rounded-lg" />
                  <button
                    type="button"
                    onClick={() => {
                      setFormData(prev => ({
                        ...prev,
                        additionalImages: prev.additionalImages.filter((_, i) => i !== idx)
                      }));
                    }}
                    className="absolute top-2 right-2 p-2 bg-red-500 rounded-full hover:bg-red-600 transition-colors"
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-6">
          <h1 className="text-3xl font-bold">Edit Product</h1>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Basic Information</h2>
            
            <div>
              <label className="block mb-2">Product Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter product name"
                className="w-full px-4 py-2 bg-[#2A2A2A] border border-[#404040] rounded-lg focus:outline-none focus:border-[#9B59B6] transition-colors"
                aria-required="true"
              />
              {errors.name && <p className="text-red-500 mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block mb-2">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe your product"
                maxLength={500}
                rows={4}
                className="w-full px-4 py-2 bg-[#2A2A2A] border border-[#404040] rounded-lg focus:outline-none focus:border-[#9B59B6] transition-colors"
              />
              <p className="text-sm text-[#808080] mt-1">
                {formData.description.length}/500 characters
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Categories (Select multiple)</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {categories.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => handleCategorySelect(category.id)}
                  className={`p-4 rounded-lg flex items-center space-x-3 transition-colors ${formData.selectedCategories.includes(category.id) ? "bg-[#6A0DAD] text-white" : "bg-[#2A2A2A] hover:bg-[#8E44AD]"}`}
                >
                  <category.icon className="text-2xl" />
                  <span>{category.name}</span>
                </button>
              ))}
            </div>

            <div className="mt-4">
              <input
                type="text"
                value={formData.customCategory}
                onChange={handleCustomCategoryChange}
                placeholder="Add custom category"
                className="w-full px-4 py-2 bg-[#2A2A2A] border border-[#404040] rounded-lg focus:outline-none focus:border-[#9B59B6] transition-colors"
              />
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Product Images</h2>
            
            {!formData.mainImage && (
              <div {...getRootProps()} className="border-2 border-dashed border-[#404040] rounded-lg p-8 text-center cursor-pointer hover:border-[#9B59B6] transition-colors">
                <input {...getInputProps()} />
                <div className="flex flex-col items-center">
                  <FaUpload className="text-4xl mb-4" />
                  <p>Drag and drop your main product image here, or click to select</p>
                </div>
              </div>
            )}

            {formData.additionalImages.length < 8 && (
              <div {...getAdditionalRootProps()} className="border-2 border-dashed border-[#404040] rounded-lg p-8 text-center cursor-pointer hover:border-[#9B59B6] transition-colors">
                <input {...getAdditionalInputProps()} />
                <div className="flex flex-col items-center">
                  <FaPlus className="text-4xl mb-4" />
                  <p>Add additional product images ({8 - formData.additionalImages.length} slots remaining)</p>
                </div>
              </div>
            )}
          </div>

          <div className="flex space-x-4 pt-6">
            <button
              type="submit"
              disabled={!isFormValid() || !isDirty}
              className={`px-6 py-2 rounded-lg font-semibold ${isFormValid() && isDirty ? "bg-[#6A0DAD] hover:bg-[#8E44AD]" : "bg-[#404040] cursor-not-allowed"} transition-colors`}
            >
              Save Changes
            </button>
            
            <button
              type="button"
              onClick={() => window.history.back()}
              className="px-6 py-2 bg-[#2A2A2A] rounded-lg font-semibold hover:bg-[#404040] transition-colors"
            >
              Cancel
            </button>

            <button
              type="button"
              className="px-6 py-2 bg-red-600 rounded-lg font-semibold hover:bg-red-700 transition-colors ml-auto"
            >
              Delete Product
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ProductEditionPage;