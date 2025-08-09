import React, {
    useState,
    ChangeEvent,
    ChangeEventHandler, useEffect,
} from "react";
import {FiEdit} from "react-icons/fi";
import {useAuth0, User} from "@auth0/auth0-react";

import {ImageCropModal} from "../../../shared/lib/crop-image-modal/ImageCropModal.tsx";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../../../app/store.ts";
import {updateProfileAsync} from "../../../features/redux/profile";



interface FormData {
    name: string;
    surname: string;
    nickname: string;
    email: string;
    image: string;
    imageFile?: File;
}

export const Profile: React.FC = () => {

    const [cropModalOpen, setCropModalOpen] = useState(false);
    const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);

    const {user, getAccessTokenSilently} = useAuth0();
    const typedUser = user as User;
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<FormData>({
        name: "",
        surname: "",
        nickname: "",
        email: "",
        image: "",
    });
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const { profileEntity } = useSelector(
        (state: RootState) => state.profile
    );
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        if (profileEntity && typedUser) {
            setFormData({
                name: profileEntity.name ?? "",
                surname: profileEntity.familyName ?? "",
                nickname: profileEntity.nickname ?? "",
                email: typedUser.email ?? "",
                image: profileEntity.imageUrl ?? "",
            });
        }
    }, [profileEntity, typedUser]);


    const validateForm = (): { [key: string]: string } => {
        const newErrors: { [key: string]: string } = {};
        if (!formData.name.trim()) newErrors.name = "Name is required";
        if (!formData.surname.trim()) newErrors.surname = "Surname is required";
        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Email is invalid";
        }
        return newErrors;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const newErrors = validateForm();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        try {
            const payload = new FormData();
            const profile = {
                email: formData.email,
                name: formData.name,
                nickname: formData.nickname,
                givenName: formData.name,
                familyName: formData.surname,
                role: "user",
            };

            payload.append(
                "profile",
                new Blob([JSON.stringify(profile)], {type: "application/json"})
            );

            if (formData.imageFile) {
                payload.append("image", formData.imageFile);
            }

            const success = await dispatch(updateProfileAsync({
                token: await getAccessTokenSilently(),
                formData: payload,
            })).unwrap();

            if (success) {
                setIsEditing(false);
                setErrors({});
            } else {
                alert("Failed to update profile");
            }
        } catch (error) {
            console.error("Error updating profile:", error);
            alert("An error occurred while updating the profile.");
        }
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };


    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
            <div className="max-w-2xl w-full bg-gray-800 rounded-lg shadow-xl p-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-white">Your Profile</h1>
                    {!isEditing && (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="p-2 rounded-full bg-purple-600 hover:bg-purple-700 text-white transition-colors"
                        >
                            <FiEdit size={20}/>
                        </button>
                    )}
                </div>

                <div className="flex flex-col md:flex-row gap-8">
                    {isEditing ? (
                        <>
                            <div className="flex flex-col items-center gap-4">
                                <div className="relative w-32 h-32">
                                    <img
                                        src={formData.image}
                                        alt="Profile"
                                        className="block w-full h-full rounded-full object-cover border-4 border-purple-600 transition duration-300 hover:brightness-75 cursor-pointer"
                                        onClick={() =>
                                            document.getElementById("profile-image-upload")?.click()
                                        }
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src =
                                                "https://i.pinimg.com/736x/c8/ec/05/c8ec0552d878e70bd29c25d0957a6faf.jpg";
                                        }}
                                    />
                                    <input
                                        type="file"
                                        id="profile-image-upload"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                setSelectedImageFile(file);
                                                setCropModalOpen(true);
                                            }
                                        }}
                                    />
                                </div>
                            </div>

                            <form onSubmit={handleSubmit} className="flex-1 space-y-4">
                                <InputField
                                    label="Name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    error={errors.name}
                                />
                                <InputField
                                    label="Surname"
                                    name="surname"
                                    value={formData.surname}
                                    onChange={handleChange}
                                    error={errors.surname}
                                />
                                <InputField
                                    label="Nickname"
                                    name="nickname"
                                    value={formData.nickname}
                                    onChange={handleChange}
                                />

                                <div>
                                    <label className="block text-sm font-medium text-gray-400">
                                        Email
                                    </label>
                                    <p className="text-white text-lg">{formData.email}</p>
                                </div>

                                <div className="flex space-x-4">
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
                                    >
                                        Save Changes
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsEditing(false);
                                            setErrors({});
                                        }}
                                        className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </>
                    ) : (
                        <>
                            <div className="flex flex-col items-center gap-4">
                                <img
                                    src={
                                        profileEntity?.imageUrl ||
                                        "https://i.pinimg.com/736x/c8/ec/05/c8ec0552d878e70bd29c25d0957a6faf.jpg"
                                    }
                                    alt="Profile"
                                    className="w-32 h-32 rounded-full object-cover border-4 border-purple-600"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src =
                                            "https://i.pinimg.com/736x/c8/ec/05/c8ec0552d878e70bd29c25d0957a6faf.jpg";
                                    }}
                                />
                            </div>
                            <div className="flex-1 space-y-4">
                                <DisplayField label="Name" value={formData?.name}/>
                                <DisplayField label="Surname" value={formData?.surname}/>
                                <DisplayField label="Nickname" value={formData?.nickname}/>
                                <DisplayField label="Email" value={formData?.email}/>
                            </div>
                        </>
                    )}
                </div>
            </div>
            {cropModalOpen && selectedImageFile && (
                <ImageCropModal
                    image={URL.createObjectURL(selectedImageFile)}
                    cropShape="round"
                    onClose={() => {
                        URL.revokeObjectURL(URL.createObjectURL(selectedImageFile));
                        setCropModalOpen(false);
                        setSelectedImageFile(null);
                    }}
                    onSave={(croppedImage: string) => {
                        // Convert base64 to Blob -> File
                        const byteString = atob(croppedImage.split(',')[1]);
                        const mimeString = croppedImage.split(',')[0].split(':')[1].split(';')[0];

                        const ab = new ArrayBuffer(byteString.length);
                        const ia = new Uint8Array(ab);
                        for (let i = 0; i < byteString.length; i++) {
                            ia[i] = byteString.charCodeAt(i);
                        }

                        const blob = new Blob([ab], {type: mimeString});
                        const croppedFile = new File([blob], selectedImageFile?.name ?? 'cropped.jpg', {type: mimeString});

                        setFormData((prev) => ({
                            ...prev,
                            image: croppedImage,
                            imageFile: croppedFile,
                        }));
                        setCropModalOpen(false);
                        setSelectedImageFile(null);
                    }}
                />
            )}

        </div>
    );
};

const InputField = ({
                        label,
                        name,
                        value,
                        onChange,
                        error,
                    }: {
    label: string;
    name: string;
    value: string;
    onChange: ChangeEventHandler<HTMLInputElement>;
    error?: string;
}) => (
    <div>
        <label className="block text-sm font-medium text-gray-400">{label}</label>
        <input
            type="text"
            name={name}
            value={value}
            onChange={onChange}
            className="mt-1 w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-white focus:ring-2 focus:ring-purple-600 focus:border-transparent"
        />
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
);

const DisplayField = ({label, value}: { label: string; value?: string }) => (
    <div>
        <h3 className="text-sm font-medium text-gray-400">{label}</h3>
        <p className="text-white text-lg">{value}</p>
    </div>
);
