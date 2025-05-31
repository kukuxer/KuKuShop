import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import {
  FiMenu,
  FiX,
  FiShoppingBag,
  FiHeart,
  FiUser,
  FiLogOut,
  FiPackage,
} from "react-icons/fi";
import { Link } from "react-router-dom";
import Profile from "../../entity/Profile";
import {SearchField} from "./components/SearchField";

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
  const [favHave, setFavHave] = useState(false);
  const [basketHave, setBasketHave] = useState(false);

  const logoutWithRedirect = () =>
    logout({
      logoutParams: { returnTo: window.location.origin },
    });

  const fetchOrCreateProfile = async () => {
    try {
      if (!isAuthenticated) return;

      const token = await getAccessTokenSilently();
      const response = await fetch(
        "http://localhost:8080/api/profile/getOrCreateProfile",
        {
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
            imageUrl: user?.picture || "",
          }),
        }
      );

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

      const response = await fetch(
        "http://localhost:8080/api/shop/myShopImage",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const imageUrl = await response.text();
        setShopImage(imageUrl);
      } else {
        setShopImage("/Shop.png");
      }
    } catch (error) {
      console.error("Error fetching shop image:", error);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      if (!isAuthenticated) return;
      await fetchOrCreateProfile();
      await fetchShopImage();
    };

    if (isMounted) fetchData();

    return () => {
      isMounted = false;
    };
  }, [isAuthenticated]);

  return (
    <nav className="relative z-50 bg-gray-950 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 md:block">
              <Link to={"/"}>
                <img
                  className="h-8 w-8"
                  src={shopImage || "/Shop.png"}
                  alt="Logo"
                />
              </Link>
            </div>
            <Link to={"/"}>
              <div className="md:block  ml-2 font-bold text-xl text-purple-500">
                KuKuShop {profile?.role}
              </div>
            </Link>
            <div className="md:block hidden ml-4">
              <Link to="/myshop">
                <button
                  aria-label="Navigate to Shop"
                  className="hidden md:flex items-center justify-center px-6 py-2.5 bg-gradient-to-r from-purple-700 to-purple-900 text-white rounded-lg shadow-lg hover:from-purple-800 hover:to-purple-950 transition-all duration-300 ease-in-out hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 "
                >
                  <FiPackage className="w-5 h-5 mr-2 transition-transform duration-300 group-hover:rotate-12" />
                  <span className="font-medium">My Shop</span>
                </button>
              </Link>
            </div>
          </div>

          <div className="md:flex flex-1 mx-8 items-center">
            <SearchField />
          </div>

          <div className="hidden md:block">
            <div className="ml-4 flex items-center space-x-4">
              <Link to="/favorites">
                <button
                  className=" text-gray-300 hover:text-purple-500 px-3 py-2 rounded-md text-sm font-medium flex items-center gap-1"
                  onMouseEnter={() => setFavHave(true)}
                  onMouseLeave={() => setFavHave(false)}
                >
                  <span className="inline-flex w-5 h-5 items-center justify-center">
                    <FiHeart
                      className={`transition-transform duration-300 transform ${
                        favHave ? "scale-125 text-pink-400" : ""
                      }`}
                    />
                  </span>
                  Favourites
                </button>
              </Link>

              <Link to="/basket">
                <button
                  className=" text-gray-300 hover:text-purple-500 px-3 py-2 rounded-md text-sm font-medium flex items-center gap-1"
                  onMouseEnter={() => setBasketHave(true)}
                  onMouseLeave={() => setBasketHave(false)}
                >
                  <span className="inline-flex w-5 h-5 items-center justify-center">
                    <FiShoppingBag
                      className={`transition-transform duration-300 transform ${
                        basketHave ? "rotate-12 scale-110 text-emerald-400" : ""
                      }`}
                    />
                  </span>
                  Basket
                </button>
              </Link>

              {isAuthenticated && user ? (
                <div className="relative">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center space-x-2 text-gray-300 hover:text-purple-500 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    <img
                      src={
                        profile?.imageUrl ||
                        "https://i.pinimg.com/736x/c8/ec/05/c8ec0552d878e70bd29c25d0957a6faf.jpg"
                      }
                      alt="User"
                      className="h-10 w-10 rounded-full border-1 border-purple-600 transition duration-300 hover:brightness-75"
                    />
                    <span>{profile?.name}</span>
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
            <Link to={"/favorites"}>
              <button className="text-gray-300 hover:text-purple-500 block px-3 py-2 rounded-md text-base font-medium w-full text-left">
                <FiHeart className="inline mr-2" />
                Favourites
              </button>
            </Link>
            <Link to={"/basket"}>
              <button className="text-gray-300 hover:text-purple-500 block px-3 py-2 rounded-md text-base font-medium w-full text-left">
                <FiShoppingBag className="inline mr-2" />
                Basket
              </button>
            </Link>

            {isAuthenticated && user ? (
              <>
                <Link to={"/profile"}>
                  <button className="text-gray-300 hover:text-purple-500 block px-3 py-2 rounded-md text-base font-medium w-full text-left">
                    <FiUser className="inline mr-2" />
                    Profile
                  </button>
                </Link>
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
