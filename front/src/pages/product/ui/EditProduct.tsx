import React, {
    useState,
    useCallback,
    useEffect,
    useRef,
    ChangeEvent,
} from "react";
import {useDropzone} from "react-dropzone";
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
    FaDollarSign,
    FaHashtag,
} from "react-icons/fa";
import {useAuth0} from "@auth0/auth0-react";
import {BsChevronDown, BsChevronUp} from "react-icons/bs";
import {Product} from "../../../entities";

interface ProductEditionPageProps {
    product: Product;
    onClose: () => void;
}

interface Category {
    id: string;
    name: string;
    icon: React.ElementType;
}

const ProductEditionPage: React.FC<ProductEditionPageProps> = ({
                                                                   product,
                                                                   onClose,
                                                               }) => {
    type ImageValue = {
        preview: string;
        file?: File | undefined;
    };

    const [formData, setFormData] = useState({
        name: product.name || "",
        description: product.description || "",
        selectedCategories: product.categories || [],
        mainImage: product.imageUrl
            ? {preview: product.imageUrl, file: undefined as File | undefined}
            : null,
        additionalImages: (product.additionalPictures || []).map((url) => ({
            preview: url,
        })),
        price: product.price || "",
        quantity: product.quantity || "",
    });

    const [errors, setErrors] = useState<{ name?: string; description?: string }>(
        {}
    );
    const [isDirty, setIsDirty] = useState(false);
    const modalRef = useRef<HTMLDivElement>(null);
    const {getAccessTokenSilently} = useAuth0();
    const mouseDownTargetRef = useRef<EventTarget | null>(null);

    const [confirmDelete, setConfirmDelete] = useState(false);
    const [deleteInput, setDeleteInput] = useState("");

    useEffect(() => {
        if (product) {
            const mainImageUrl = product.imageUrl;
            const filteredAdditionalImages = (product.additionalPictures || [])

                .filter((url) => url !== mainImageUrl)
                .map((url) => ({preview: url}));

            setFormData((prev) => ({
                ...prev,
                name: product.name || "",
                description: product.description || "",
                selectedCategories: product.categories || [],
                mainImage: product.imageUrl
                    ? {preview: product.imageUrl, file: undefined}
                    : null,
                additionalImages: filteredAdditionalImages,
                price: product.price || "",
                quantity: product.quantity || "",
            }));
        }
    }, [product]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!isFormValid()) return;

        try {
            const token = await getAccessTokenSilently();

            const formDataPayload = new FormData();

            formDataPayload.append("name", formData.name);
            formDataPayload.append("description", formData.description);
            formDataPayload.append(
                "price",
                formData.price ? formData.price.toString() : "0"
            );
            formDataPayload.append(
                "quantity",
                formData.quantity ? formData.quantity.toString() : "0"
            );
            formDataPayload.append(
                "additionalPictures",
                formData.additionalImages.map((img) => img.preview).join(",")
            );
            if (formData.mainImage) {
                formDataPayload.append("imageUrl", formData.mainImage.preview);
            }

            formData.selectedCategories.forEach((cat) =>
                formDataPayload.append("categories", cat)
            );

            if (formData.mainImage?.file) {
                formDataPayload.append("image", formData.mainImage.file);
            }

            // Handle additional images (send either the existing URLs or the new files)
            formData.additionalImages.forEach((img) => {
                if (img.file) {
                    formDataPayload.append("additionalImages", img.file);
                }
            });

            const response = await fetch(
                `http://localhost:8080/api/product/private/update/${product.id}`,
                {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    body: formDataPayload,
                }
            );

            const success = await response.json();
            console.log("API Response:", success);
            if (success) {
                alert("Product updated successfully.");
                onClose();
            } else {
                alert("Failed to update product.");
            }
        } catch (error) {
            console.error("Error updating product:", error);
            alert("An error occurred while updating the product.");
        }
    };

    const categories: Category[] = [
        {id: "jewelry", name: "Jewelry", icon: FaGem},
        {id: "clothing", name: "Clothing", icon: FaTshirt},
        {id: "electronics", name: "Electronics", icon: FaMobileAlt},
        {id: "accessories", name: "Accessories", icon: FaAccessibleIcon},
        {id: "homeGoods", name: "Home Goods", icon: FaHome},
        {id: "sports & outdoors", name: "sports & outdoors", icon: FaRunning},
    ];

    const generateDeleteCode = () => {
        const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        let result = "";
        for (let i = 0; i < 5; i++) {
            result += letters.charAt(Math.floor(Math.random() * letters.length));
        }
        return result;
    };
    const [deleteCode, setDeleteCode] = useState(generateDeleteCode());

    const handleDeleteConfirm = () => {
        if (deleteInput.trim() === deleteCode) {
            console.log("Product deleted");
            onClose();
        }
    };

    const handleCustomCategoryKeyPress = (
        e: React.KeyboardEvent<HTMLInputElement>
    ) => {
        if (e.key === "Enter") {
            e.preventDefault();
            const customCat = e.currentTarget.value.trim();
            if (
                customCat &&
                !formData.selectedCategories.includes(customCat) &&
                formData.selectedCategories.length < 5
            ) {
                setFormData((prev) => ({
                    ...prev,
                    selectedCategories: [...prev.selectedCategories, customCat],
                }));
                e.currentTarget.value = "";
                setIsDirty(true);
            }
        }
    };

    const handleRemoveCategory = (catId: string) => {
        setFormData((prev) => ({
            ...prev,
            selectedCategories: prev.selectedCategories.filter((c) => c !== catId),
        }));
        setIsDirty(true);
    };

    const onDrop = useCallback(
        (acceptedFiles: File[], type: "main" | "additional" = "main") => {
            if (type === "main") {
                const file = acceptedFiles[0];
                if (file) {
                    const newMainImage: ImageValue = {
                        preview: URL.createObjectURL(file),
                        file,
                    };
                    setFormData((prev) => ({
                        ...prev,
                        mainImage: newMainImage,
                    }));
                }
            } else {
                setFormData((prev) => {
                    const remainingSlots = 8 - prev.additionalImages.length;
                    const newFiles: ImageValue[] = acceptedFiles
                        .slice(0, remainingSlots)
                        .map((file) => ({
                            preview: URL.createObjectURL(file),
                            file,
                        }));

                    return {
                        ...prev,
                        additionalImages: [...prev.additionalImages, ...newFiles],
                    };
                });
            }

            setIsDirty(true);
        },
        [] // safe due to functional `setFormData`
    );

    const {getRootProps, getInputProps} = useDropzone({
        onDrop: (files) => onDrop(files, "main"),
        accept: {"image/*": []},
        maxFiles: 1,
    });

    const {
        getRootProps: getAdditionalRootProps,
        getInputProps: getAdditionalInputProps,
    } = useDropzone({
        onDrop: (files) => onDrop(files, "additional"),
        accept: {"image/*": []},
    });

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const {name, value} = e.target;
        setFormData((prev) => ({...prev, [name]: value}));
        setIsDirty(true);
        validateField(name, value);
    };

    const validateField = (name: string, value: string) => {
        const newErrors = {...errors};
        if (name === "name" && !value.trim())
            newErrors.name = "Product name is required";
        else if (name === "description" && value.length > 500)
            newErrors.description = "Description cannot exceed 500 characters";
        else delete newErrors[name as keyof typeof newErrors];
        setErrors(newErrors);
    };

    const handleCategorySelect = (categoryId: string) => {
        setFormData((prev) => {
            const isSelected = prev.selectedCategories.includes(categoryId);
            if (isSelected) {
                return {
                    ...prev,
                    selectedCategories: prev.selectedCategories.filter(
                        (id) => id !== categoryId
                    ),
                };
            } else if (prev.selectedCategories.length < 5) {
                return {
                    ...prev,
                    selectedCategories: [...prev.selectedCategories, categoryId],
                };
            }
            return prev;
        });
        setIsDirty(true);
    };

    const isFormValid = () =>
        formData.name.trim() !== "" &&
        formData.selectedCategories.length > 0 &&
        Object.keys(errors).length === 0;
    console.log("Form valid:", isFormValid());
    console.log("isDirty: ", isDirty);

    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        mouseDownTargetRef.current = e.target;
    };

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (
            modalRef.current &&
            !modalRef.current.contains(mouseDownTargetRef.current as Node) &&
            !modalRef.current.contains(e.target as Node)
        ) {
            onClose();
        }
    };

    const handlePriceChange = (e: ChangeEvent<HTMLInputElement>) => {
        const formattedPrice = formatPrice(e.target.value);
        setFormData((prev) => ({...prev, price: formattedPrice}));

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
            setErrors((prevErrors) => ({...prevErrors, price: undefined}));
        }
        setIsDirty(true);
    };

    const formatPrice = (value: string) => {
        // Allow only digits and dots
        const cleaned = value.replace(/[^\d.]/g, "");

        // Match valid price pattern: optional digits, optional dot, optional 2 digits after dot
        const match = cleaned.match(/^(\d*)(\.?)(\d{0,2})/);
        if (!match) return "";

        const [, intPart, dot, decPart] = match;
        return `${intPart}${dot}${decPart}`;
    };

    const handleQuantityChange = (e) => {
        setFormData((prev) => ({...prev, quantity: e.target.value}));
        setIsDirty(true);
    };

    const incrementPrice = () => {
        setFormData((prev) => ({
            ...prev,
            price: (parseFloat(prev.price || "0") + 1).toFixed(2),
        }));
        setIsDirty(true);
    };

    const decrementPrice = () => {
        setFormData((prev) => ({
            ...prev,
            price: Math.max(0, parseFloat(prev.price || "0") - 1).toFixed(2),
        }));
        setIsDirty(true);
    };

    const incrementQuantity = () => {
        setFormData((prev) => ({
            ...prev,
            quantity: String(Number(prev.quantity || 0) + 1),
        }));
        setIsDirty(true);
    };

    const decrementQuantity = () => {
        setFormData((prev) => ({
            ...prev,
            quantity: String(Math.max(0, Number(prev.quantity || 0) - 1)),
        }));
        setIsDirty(true);
    };

    useEffect(() => {
        return () => {
            if (formData.mainImage?.preview)
                URL.revokeObjectURL(formData.mainImage.preview);
            formData.additionalImages.forEach((img) =>
                URL.revokeObjectURL(img.preview)
            );
        };
    }, [formData]);

    return (
        <div
            onMouseDown={handleMouseDown}
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
                    <FaTimes/>
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
                            className="w-full px-4 py-2 bg-[#2A2A2A] border border-[#404040] rounded-lg focus:outline-none  purpleOnFocus"
                        />
                        {errors.name && (
                            <p className="text-red-500 text-sm">{errors.name}</p>
                        )}
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
                            className="w-full px-4 py-2 bg-[#2A2A2A] border border-[#404040] rounded-lg focus:outline-none focus:border-purple-700"
                        />
                        <p className="text-sm text-[#808080]">
                            {formData.description.length}/500 characters
                        </p>
                    </div>

                    <div className="w-full max-w-xs space-y-4">
                        {/* Price Field */}
                        <div className="relative">
                            <label className="flex items-center flex-wrap gap-2 mb-2 text-sm text-white">
                                Price<span className="text-red-500">*</span>
                            </label>
                            <div
                                className="relative border border-[#404040] rounded-lg bg-[#2A2A2A] hover:bg-[#333333] transition-colors duration-200">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                                    <FaDollarSign className="text-purple-400 text-sm"/>
                                </div>
                                <input
                                    type="text"
                                    value={formData.price}
                                    onChange={handlePriceChange}
                                    className="w-full bg-[#2A2A2A] text-[#E0E0E0] text-sm py-2 pl-10 pr-8 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-600"
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
                                        <BsChevronUp className="text-gray-400 hover:text-purple-400 text-xs"/>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={decrementPrice}
                                        className="p-1 hover:bg-purple-700 rounded"
                                        aria-label="Decrement price"
                                    >
                                        <BsChevronDown className="text-gray-400 hover:text-purple-400 text-xs"/>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Quantity Field */}
                        <div className="relative">
                            <label className="flex items-center flex-wrap gap-2 mb-2 text-sm text-white">
                                Quantity<span className="text-red-500">*</span>
                            </label>
                            <div
                                className="relative border border-[#404040] rounded-lg bg-[#2A2A2A] hover:bg-[#333333] transition-colors duration-200">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                                    <FaHashtag className="text-purple-400 text-sm"/>
                                </div>
                                <input
                                    type="number"
                                    value={formData.quantity}
                                    onChange={handleQuantityChange}
                                    className="w-full bg-[#2A2A2A] text-[#E0E0E0] text-sm py-2 pl-10 pr-8 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500 appearance-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                    placeholder="0"
                                    aria-label="Quantity input"
                                />

                                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-0.5">
                                    <button
                                        type="button"
                                        onClick={incrementQuantity}
                                        className="p-1 hover:bg-purple-700 rounded"
                                        aria-label="Increment quantity"
                                    >
                                        <BsChevronUp className="text-gray-400 hover:text-purple-400 text-xs"/>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={decrementQuantity}
                                        className="p-1 hover:bg-purple-700 rounded"
                                        aria-label="Decrement quantity"
                                    >
                                        <BsChevronDown className="text-gray-400 hover:text-purple-400 text-xs"/>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Categories */}
                    <div>
                        <h2 className="text-lg font-semibold mb-2">Categories</h2>
                        <div className="grid grid-cols-2 gap-2">
                            {categories.map((category) => {
                                const Icon = category.icon;
                                const selected = formData.selectedCategories.includes(
                                    category.id
                                );
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
                                        <Icon className="text-xl"/>
                                        <span>{category.name}</span>
                                    </button>
                                );
                            })}
                        </div>
                        <input
                            type="text"
                            onKeyDown={handleCustomCategoryKeyPress}
                            placeholder="Type and press Enter to add custom category"
                            disabled={formData.selectedCategories.length >= 5}
                            className="mt-2 w-full px-4 py-2 bg-[#2A2A2A] border border-[#404040] rounded-lg focus:outline-none focus:border-[#9B59B6] disabled:opacity-50"
                        />

                        <div className="flex flex-wrap gap-2 mt-2">
                            {formData.selectedCategories
                                .filter((catId) => !categories.find((c) => c.id === catId))
                                .map((customCat) => (
                                    <span
                                        key={customCat}
                                        className="bg-purple-700 text-white px-3 py-1 rounded-full flex items-center space-x-1"
                                    >
                    <span>{customCat}</span>
                    <button
                        type="button"
                        onClick={() => handleRemoveCategory(customCat)}
                        className="text-sm p-1 hover:bg-red-600 rounded-full"
                    >
                      <FaTimes/>
                    </button>
                  </span>
                                ))}
                        </div>
                    </div>
                    {formData.selectedCategories.length >= 5 && (
                        <p className="text-sm text-red-500 mt-1">
                            You can select up to 5 categories only.
                        </p>
                    )}

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
                                    <FaUpload/> Upload Main Image
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
                                    <FaPlus/> Add Additional Images (
                                    {8 - formData.additionalImages.length} remaining)
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
                                        <span
                                            className="absolute top-1 left-1 bg-purple-600 text-xs px-2 py-0.5 rounded">
                      Main
                    </span>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    mainImage: null,
                                                }));
                                                setIsDirty(true);
                                            }}
                                            className="absolute top-1 right-1 p-1 bg-red-600 hover:bg-red-700 rounded-full"
                                        >
                                            <FaTrash className="text-xs"/>
                                        </button>
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
                                            onClick={() => {
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    additionalImages: prev.additionalImages.filter(
                                                        (_, i) => i !== idx
                                                    ),
                                                }));
                                                setIsDirty(true);
                                            }}
                                            className="absolute top-1 right-1 p-1 bg-red-600 hover:bg-red-700 rounded-full"
                                        >
                                            <FaTrash className="text-xs"/>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-between pt-4">
                        {!confirmDelete && (
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
                        )}

                        {confirmDelete ? (
                            <div
                                className="flex flex-col space-y-2 bg-[#2A2A2A] p-4 rounded-lg w-full max-w-sm mx-auto">
                                <p className="text-sm text-red-400">
                                    Type the <strong>{deleteCode}</strong> to confirm deletion
                                </p>
                                <input
                                    type="text"
                                    value={deleteInput}
                                    onChange={(e) => setDeleteInput(e.target.value.toUpperCase())}
                                    className={`px-3 py-1 bg-[#1A1A1A] border-2 rounded-lg text-white focus:outline-none transition-colors duration-300 ${
                                        deleteInput === ""
                                            ? "border-[#404040]"
                                            : deleteInput === deleteCode
                                                ? "border-green-500 focus:border-green-500"
                                                : "border-red-500 focus:border-red-500"
                                    }`}
                                />
                                <div className="flex justify-between">
                                    <button
                                        type="button"
                                        onClick={() => setConfirmDelete(false)}
                                        className="px-3 py-1 rounded-lg bg-gray-600 hover:bg-gray-700 text-sm"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleDeleteConfirm}
                                        disabled={deleteInput !== deleteCode}
                                        className={`px-3 py-1 rounded-lg text-sm transition-colors duration-200 ${
                                            deleteInput === deleteCode
                                                ? "bg-red-600 hover:bg-red-700"
                                                : "bg-[#404040] cursor-not-allowed"
                                        }`}
                                    >
                                        Confirm Delete
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <button
                                type="button"
                                onClick={() => setConfirmDelete(true)}
                                className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-semibold"
                            >
                                Delete Product
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProductEditionPage;
