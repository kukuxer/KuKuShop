import {useState, ChangeEvent, FormEvent} from "react";
import {FiUpload} from "react-icons/fi";
import {useAuth0} from "@auth0/auth0-react";
import {useNavigate} from "react-router-dom";
import {createShop} from "../../../entities/shop/api/shops.ts";

interface ShopDto {
    shopName: string;
    image: File | null;
    description: string;
}

interface Errors {
    shopName?: string;
    agreement?: string;
}

export const ShopCreationForm = () => {
    const {getAccessTokenSilently} = useAuth0();
    const [formData, setFormData] = useState<ShopDto>({
        shopName: "",
        image: null,
        description: "",
    });
    const [agreement, setAgreement] = useState<boolean>(false);
    const [errors, setErrors] = useState<Errors>({});
    const [loading, setLoading] = useState<boolean>(false);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleInputChange = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const {name, value} = e.target;
        setFormData((prev) => ({...prev, [name]: value}));
        setErrors((prev) => ({...prev, [name]: ""}));
    };

    const handleAgreementChange = (e: ChangeEvent<HTMLInputElement>) => {
        setAgreement(e.target.checked);
        setErrors((prev) => ({...prev, agreement: ""}));
    };

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFormData((prev) => ({...prev, image: file}));
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const validateForm = (): boolean => {
        const newErrors: Errors = {};
        if (!formData.shopName.trim()) {
            newErrors.shopName = "PublicShopPage name is required";
        }
        if (!agreement) {
            newErrors.agreement = "Please accept the terms and conditions";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            setLoading(true);
            try {
                const token = await getAccessTokenSilently();

                const data = new FormData();
                data.append("name", formData.shopName);
                data.append("description", formData.description);
                if (formData.image) {
                    data.append("image", formData.image as Blob);
                }
                console.log("Image type:", formData.image);

                const response = await createShop(token, data);

                console.log("navigating..");
                navigate("/myshopComponent");
                console.log("PublicShopPage created:", response);
                setFormData({shopName: "", image: null, description: ""});
                setAgreement(false);
                setImagePreview(null);
            } catch (error) {
                setErrors(errors => ({...errors, shopName: "this name is already taken"}));
                console.error("Error submitting form:", error);
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4 py-12">
            <div className="max-w-md w-full space-y-8 bg-gray-800 p-8 rounded-xl shadow-2xl">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-white">Create Your Shop</h2>
                    <p className="mt-2 text-purple-400">
                        Fill in the details to get started
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <label
                            htmlFor="shopName"
                            className="block text-sm font-medium text-purple-300"
                        >
                            Shop Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            id="shopName"
                            name="shopName"
                            type="text"
                            required
                            className="mt-1 block w-full bg-gray-700 border-2 border-gray-600 rounded-lg
                       text-white px-4 py-2 focus:outline-none focus:border-purple-500
                       transition-colors duration-200"
                            placeholder="Enter shop name"
                            value={formData.shopName}
                            onChange={handleInputChange}
                        />
                        {errors.shopName && (
                            <p className="mt-1 text-red-500 text-sm">{errors.shopName}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-purple-300">
                            Shop Image <span className="text-gray-400">(optional)</span>
                        </label>
                        <div className="mt-1 flex items-center justify-center w-full">
                            <label
                                htmlFor="shopImage"
                                className="flex flex-col items-center justify-center w-full h-48
                         border-2 border-dashed border-purple-500 rounded-lg
                         cursor-pointer bg-gray-700 hover:bg-gray-600
                         transition-colors duration-200"
                            >
                                {imagePreview ? (
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        className="h-full w-full object-cover rounded-lg"
                                    />
                                ) : (
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <FiUpload className="w-10 h-10 text-purple-400 mb-3"/>
                                        <p className="text-sm text-purple-300">Upload Shop Image</p>
                                    </div>
                                )}
                                <input
                                    id="shopImage"
                                    name="shopImage"
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                />
                            </label>
                        </div>
                    </div>

                    <div>
                        <label
                            htmlFor="description"
                            className="block text-sm font-medium text-purple-300"
                        >
                            Description <span className="text-gray-400">(optional)</span>
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            rows={3}
                            className="mt-1 block w-full bg-gray-700 border-2 border-gray-600 rounded-lg
                       text-white px-4 py-2 focus:outline-none focus:border-purple-500
                       transition-colors duration-200"
                            placeholder="Enter shop description"
                            value={formData.description}
                            onChange={handleInputChange}
                            maxLength={750}
                        />
                    </div>

                    <div className="flex items-center">
                        <input
                            id="agreement"
                            name="agreement"
                            type="checkbox"
                            className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                            checked={agreement}
                            onChange={handleAgreementChange}
                        />
                        <label
                            htmlFor="agreement"
                            className="ml-2 block text-sm text-purple-300"
                        >
                            I agree to the terms and conditions{" "}
                            <span className="text-red-500">*</span>
                        </label>
                    </div>
                    {errors.agreement && (
                        <p className="text-red-500 text-sm">{errors.agreement}</p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex justify-center py-3 px-4 border border-transparent
                     rounded-lg shadow-sm text-sm font-medium text-white
                     bg-purple-600 hover:bg-purple-700 focus:outline-none
                     focus:ring-2 focus:ring-offset-2 focus:ring-purple-500
                     disabled:opacity-50 disabled:cursor-not-allowed
                     transition-colors duration-200"
                    >
                        {loading ? "Processing..." : "Create PublicShopPage"}
                    </button>
                </form>
            </div>
        </div>
    );
};
