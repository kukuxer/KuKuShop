import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import {
  FiMenu,
  FiX,
  FiShoppingBag,
  FiHeart,
  FiUser,
  FiSearch,
  FiLogOut,
  FiSlash,
  FiPackage,
} from "react-icons/fi";
import { Link } from "react-router-dom";
import Profile from "../../entity/Profile";

const Navbar = () => {
  const {
    user,
    isAuthenticated,
    loginWithRedirect,
    logout,
    getAccessTokenSilently,
  } = useAuth0();

  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [profile, setProfile] = useState<Profile | null>(null);
  const [shopImage, setShopImage] = useState<string | null>(null);

  const logoutWithRedirect = () =>
    logout({
      logoutParams: { returnTo: window.location.origin },
    });

  const fetchOrCreateProfile = async () => {
    try {
      if (!isAuthenticated) return;

      const token = await getAccessTokenSilently();
      const response = await fetch("http://localhost:8080/api/profile/get", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: user?.name || "",
          email: user?.email || "",
          familyName: user?.family_name || "",
          givenName: user?.given_name || "",
          nickname: user?.nickname || "",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch or create profile");
      }

      const profileData = await response.json();
      setProfile(profileData);
    } catch (error) {
      console.error("Error fetching or creating profile:", error);
    }
  };

  const fetchShopImage = async () => {
    try {
      const token = await getAccessTokenSilently();

      const response = await fetch("http://localhost:8080/api/shop/myShopImage", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const imageUrl = await response.text();
        setShopImage(imageUrl);
      } else {
        setShopImage("/default-shop-image.jpg");
      }
    } catch (error) {
      console.error("Error fetching shop image:", error);
    }
  };

  useEffect(() => {
    fetchOrCreateProfile();
    fetchShopImage();
  }, [isAuthenticated, user]);

  return (
    <nav className="bg-gray-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 md:block hidden">
              <img className="h-8 w-8" src={shopImage || ""} alt="Logo" />
            </div>
            <Link to={"/"}>
              <div className="md:block hidden ml-2 font-bold text-xl text-purple-500">
                KuKuShop {profile?.role}
              </div>
            </Link>
            <div className="md:block hidden ml-4">
              <Link to="/myshop">
                <button className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white px-6 py-2.5 rounded-full text-sm font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2 transform hover:scale-105">
                  <FiPackage className="animate-bounce" />
                  <span>MyShop</span>
                </button>
              </Link>
            </div>
            <div className="md:hidden flex items-center">
              <FiSlash className="h-8 w-8 text-purple-500" />
            </div>
          </div>

          <div className="hidden md:block flex-1 mx-8">
            <div className="relative flex-1">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full bg-gray-800 text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          <div className="hidden md:block">
            <div className="ml-4 flex items-center space-x-4">
            <Link
                  to="/favorites"
                  className="text-white hover:text-purple-400 transition-colors duration-300"
                >
                  <button className="text-gray-300 hover:text-purple-500 px-3 py-2 rounded-md text-sm font-medium flex items-center">
                  <FiHeart className="mr-1" />
                  Favourites
                  </button>
                </Link>

              <button className="text-gray-300 hover:text-purple-500 px-3 py-2 rounded-md text-sm font-medium flex items-center">
                <FiShoppingBag className="mr-1" />
                Basket
              </button>

              {isAuthenticated && user ? (
                <div className="relative">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center space-x-2 text-gray-300 hover:text-purple-500 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    <img
                      src={user.picture || "https://via.placeholder.com/32"}
                      alt="User"
                      className="h-6 w-6 rounded-full"
                    />
                    <span>{user.name}</span>
                  </button>

                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-gray-800 ring-1 ring-black ring-opacity-5 z-50">
                      <div className="py-1" role="menu">
                        <Link to={"/profile"}>
                          <button
                            className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-purple-500"
                            role="menuitem"
                          >
                            <FiUser className="inline mr-2" />
                            Profile
                          </button>
                        </Link>
                        <button
                          className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-purple-500"
                          role="menuitem"
                          onClick={logoutWithRedirect}
                        >
                          <FiLogOut className="inline mr-2" />
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => loginWithRedirect()}
                  className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-md text-sm font-medium"
                >
                  Login
                </button>
              )}
            </div>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-300 hover:text-purple-500"
            >
              {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden z-50">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <button className="text-gray-300 hover:text-purple-500 block px-3 py-2 rounded-md text-base font-medium w-full text-left">
              <FiHeart className="inline mr-2" />
              Favourites
            </button>

            <button className="text-gray-300 hover:text-purple-500 block px-3 py-2 rounded-md text-base font-medium w-full text-left">
              <FiShoppingBag className="inline mr-2" />
              Basket
            </button>

            {isAuthenticated && user ? (
              <>
                <button className="text-gray-300 hover:text-purple-500 block px-3 py-2 rounded-md text-base font-medium w-full text-left">
                  <FiUser className="inline mr-2" />
                  Profile
                </button>
                <button
                  className="text-gray-300 hover:text-purple-500 block px-3 py-2 rounded-md text-base font-medium w-full text-left"
                  onClick={logoutWithRedirect}
                >
                  <FiLogOut className="inline mr-2" />
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={() => loginWithRedirect()}
                className="bg-purple-600 hover:bg-purple-700 block px-3 py-2 rounded-md text-base font-medium w-full"
              >
                Login
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
