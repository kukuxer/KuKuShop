import React, { useState, ChangeEvent } from "react";
import { FiEdit } from "react-icons/fi";
import { useAuth0, User } from "@auth0/auth0-react";

interface FormData {
  name: string;
  surname: string;
  nickname: string;
  email: string;
  image: string;
}

const Profile: React.FC = () => {
  const { user, isAuthenticated } = useAuth0();

  // Ensure `user` is typed
  const typedUser = user as User;

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: typedUser.name || "",
    surname: "",
    nickname: "",
    email: typedUser.email || "",
    image: typedUser.picture || "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length === 0) {
      setIsEditing(false);
      setErrors({});
    } else {
      setErrors(newErrors);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-gray-800 rounded-lg shadow-xl p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">User Profile</h1>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="p-2 rounded-full bg-purple-600 hover:bg-purple-700 text-white transition-colors"
            >
              <FiEdit size={20} />
            </button>
          )}
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex flex-col items-center space-y-4">
            <img
              src={typedUser.picture || formData.image}
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover border-4 border-purple-600"
              // onError={(e) => {
              //   e.target.src =
              //     "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80";
              // }}
            />
          </div>

          {isEditing ? (
            <form onSubmit={handleSubmit} className="flex-1 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-1 w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-white focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400">Surname</label>
                <input
                  type="text"
                  name="surname"
                  value={formData.surname}
                  onChange={handleChange}
                  className="mt-1 w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-white focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                />
                {errors.surname && (
                  <p className="text-red-500 text-sm mt-1">{errors.surname}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400">Nickname</label>
                <input
                  type="text"
                  name="nickname"
                  value={formData.nickname}
                  onChange={handleChange}
                  className="mt-1 w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-white focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1 w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-white focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
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
          ) : (
            <div className="flex-1 space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-400">Name</h3>
                <p className="text-white text-lg">{typedUser.name}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-400">Surname</h3>
                <p className="text-white text-lg">{typedUser?.family_name}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-400">Nickname</h3>
                <p className="text-purple-400 text-lg font-medium">{typedUser?.nickname}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-400">Email</h3>
                <p className="text-white text-lg">{typedUser?.email}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
