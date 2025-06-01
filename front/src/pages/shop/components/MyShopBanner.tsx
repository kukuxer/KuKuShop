import React, { ChangeEvent, useRef, useState } from "react";
import { FiEdit, FiImage, FiSave, FiX } from "react-icons/fi";
import { FaStar } from "react-icons/fa";
import ShopEntity from "../../../entity/ShopEntity.ts";
import ShopDescription from "./ShopDescription.tsx";
import { useAuth0 } from "@auth0/auth0-react";

import ImageCropModal from "../../../components/utils/ImageCropModal.tsx";

interface MyShopBannerProps {
    shop?: ShopEntity;
}

const MyShopBanner: React.FC<MyShopBannerProps> = ({ shop }) => {
    const [initialTitle, setInitialTitle] = useState(shop?.name || "Elegant Fashion Boutique");
    const [initialDescription, setInitialDescription] = useState(
        shop?.description?.toString().trim() ||
        "Discover our curated collection of luxury fashion pieces, where style meets sophistication. Experience premium quality and trendsetting designs."
    );
    const [initialImageUrl, setInitialImageUrl] = useState(shop?.imageUrl || "");


    const [cropModalOpen, setCropModalOpen] = useState(false);
    const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);


    const {getAccessTokenSilently } = useAuth0();
    const [isEditing, setIsEditing] = useState(false);
    const [title, setTitle] = useState(initialTitle);
    const [description, setDescription] = useState(initialDescription);
    const [rating] = useState(shop?.rating || 4.8);
    const [reviewCount] = useState(256);
    const [imageUrl, setImageUrl] = useState(initialImageUrl);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [isLoading, setIsLoading] = useState(false);
    const [isDisabled, setIsDisabled] = useState(false);


    const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && file.type.startsWith("image/")) {
            setSelectedImageFile(file);
            setCropModalOpen(true);
        }
    };

    const validateForm = (): { [key: string]: string } => {
        const newErrors: { [key: string]: string } = {};
        if (!shop?.name.trim()) { newErrors.name = "Shop name is required"
            console.log(errors)
        };
        return newErrors;
    };

    const handleSave = async (e: React.FormEvent) => {
        setIsLoading(true);
        setIsDisabled(true);
        e.preventDefault();
        const newErrors = validateForm();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        try {
            const payload = new FormData();
            const shopPayload = {
                name: title,
                description: description
            };

            payload.append(
                "shopPayload",
                new Blob([JSON.stringify(shopPayload)], { type: "application/json" })
            );

            if (imageUrl.startsWith("data:image") || imageUrl.startsWith("blob:")) {
                const blob = await (await fetch(imageUrl)).blob();
                const extension = blob.type.split("/")[1]; // e.g., "jpeg" or "png"
                const filename = `banner_${Date.now()}.${extension}`;
                const file = new File([blob], filename, { type: blob.type });
                payload.append("image", file);
            }

            const response = await fetch(`http://localhost:8080/api/shop/private/update`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${await getAccessTokenSilently()}`,
                },
                body: payload,
            });

            const success = await response.json();
            if (success) {
                setIsEditing(false);
                setErrors({});
                setInitialTitle(title);
                setInitialDescription(description);
                setInitialImageUrl(imageUrl);
            } else {
                alert("Failed to update profile");
            }
        } catch (error) {
            console.error("Error updating profile:", error);
            alert("An error occurred while updating the profile.");
        } finally {
            setIsLoading(false);
            setIsDisabled(false);
        }
    };

    const Stars = () => (
        <div className="flex items-center space-x-1">
            {[...Array(5)].map((_, index) => (
                <FaStar
                    key={index}
                    className={`${index < Math.floor(rating) ? "text-yellow-400" : "text-gray-300"
                        } w-5 h-5`}
                />
            ))}
        </div>
    );

    const buttonBaseClass = "flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-300 transform focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";


    return (
        <div className="relative h-96 overflow-hidden  shadow-lg">
            <img
                src={imageUrl || "/placeholder.jpg"}
                alt="Shop Banner"
                className="absolute inset-0 w-full h-full object-cover"
            />

            <div className="relative h-full flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 bg-black/40">
                {isEditing ? (
                    <div className="w-full max-w-3xl space-y-6 text-white text-center">
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full bg-transparent text-4xl md:text-6xl font-bold text-center focus:outline-none focus:border-white border-b-2 border-transparent"
                            maxLength={50}
                            placeholder="Enter shop title"
                        />
                        <textarea
                            value={description}
                            onChange={
                                (e) => {
                                    console.log("User input:", e.target.value);
                                    setDescription(e.target.value)
                                }
                            }
                            className="w-full bg-transparent text-xl text-center focus:outline-none focus:border-white border-b-2 border-transparent resize-none "
                            rows={3}
                            maxLength={750}
                            placeholder="Enter description"
                        />
                        <input
                            type="file"
                            accept="image/*"
                            ref={fileInputRef}
                            onChange={handleImageUpload}
                            className="hidden"
                        />
                        <div className="flex flex-col md:flex-row gap-4 items-center justify-center">
                            <button
                                className={`${buttonBaseClass} bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:from-purple-500 hover:to-purple-600 hover:scale-105 focus:ring-purple-500 active:scale-95`}
                                aria-label="Change Image"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <FiImage className="w-5 h-5" />
                                <span>Change Image</span>
                            </button>

                            <button
                                className={`${buttonBaseClass} bg-gradient-to-r from-emerald-600 to-green-700 text-white hover:from-emerald-500 hover:to-green-600 hover:scale-105 focus:ring-green-500 active:scale-95`}
                                onClick={handleSave}
                                disabled={isDisabled}
                                aria-label="Save Changes"
                            >
                                {isLoading ? (
                                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                                ) : (
                                    <>
                                        <FiSave className="w-5 h-5" />
                                        <span>Save</span>
                                    </>
                                )}
                            </button>

                            <button
                                className={`${buttonBaseClass} bg-gradient-to-r from-red-800 to-red-900 text-white hover:from-red-700 hover:to-red-800 hover:scale-105 focus:ring-red-500 active:scale-95 hover:animate-shake`}
                                aria-label="Cancel"
                                onClick={
                                    () => {
                                        setTitle(initialTitle);
                                        setDescription(initialDescription);
                                        setImageUrl(initialImageUrl);
                                        setIsEditing(false);

                                    }
                                }
                            >
                                <FiX className="w-5 h-5" />
                                <span>Cancel</span>
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="w-full max-w-3xl text-center space-y-6">
                        <div className="relative inline-block">
                            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
                                {title}
                            </h1>
                            <button
                                onClick={() => setIsEditing(true)}
                                className="absolute -right-10 top-1 -translate-y-1/2 p-2 bg-purple-600 hover:bg-purple-700 rounded-full text-white transition-colors"
                                title="Edit banner"
                            >
                                <FiEdit className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="flex items-center justify-center space-x-4">
                            <Stars />
                            <span className="text-white">
                                {rating} ({reviewCount} reviews)
                            </span>
                        </div>
                        <ShopDescription description={description} />
                    </div>
                )}
            </div>
            {cropModalOpen && selectedImageFile && (
                <ImageCropModal
                    image={URL.createObjectURL(selectedImageFile)}
                    onClose={() => {
                        setCropModalOpen(false);
                        setSelectedImageFile(null);
                    }}
                    onSave={(croppedImage: string) => {
                        setImageUrl(croppedImage);
                        setCropModalOpen(false);
                        setSelectedImageFile(null);
                    }}
                />
            )}
        </div>
    );
};

export default MyShopBanner;


