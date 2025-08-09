import {useEffect, useState} from "react";
import {useAuth0} from "@auth0/auth0-react";
import {
    FiMenu,
    FiX,
    FiShoppingBag,
    FiHeart,
    FiUser,
    FiLogOut,
    FiShoppingCart,
    FiDollarSign, FiOctagon,
} from "react-icons/fi";
import {Link} from "react-router-dom";
import {SearchField} from "./SearchField.tsx";
import NavButton from "./NavButton.tsx";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../../../app/store.ts";
import {loadProfile} from "../../../features/redux/profile";



export const Navbar = () => {
    const {
        user,
        isAuthenticated,
        loginWithRedirect,
        logout,
        getAccessTokenSilently,
    } = useAuth0();

    const dispatch = useDispatch<AppDispatch>();

    const { profileEntity } = useSelector(
        (state: RootState) => state.profile
    );

    const [isOpen, setIsOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [buyHave, setBuyHave] = useState(false);
    const [favHave, setFavHave] = useState(false);
    const [basketHave, setBasketHave] = useState(false);
    const [sellHave, setSellHave] = useState(false);

    const logoutWithRedirect = () =>
        logout({
            logoutParams: {returnTo: window.location.origin},
        });

    useEffect(() => {
        if (!isAuthenticated) return;

        (async () => {
            const token = await getAccessTokenSilently();
            dispatch(loadProfile({ token, user }));
        })();
    }, [isAuthenticated, dispatch, getAccessTokenSilently, user]);

    return (
        <nav className="relative z-50 bg-gray-950 text-white shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <div className="flex-shrink-0 md:block text-purple-500">
                            <FiOctagon
                                className="block h-8 w-8"
                                aria-hidden="true"
                            />
                        </div>
                        <Link to={"/"}>
                            <div className="md:block ml-2 font-bold text-xl text-purple-500">
                                KuKuShop
                            </div>
                        </Link>

                        <div className="hidden md:block">
                            <div className="ml-4 flex items-center space-x-4">
                                <div className="ml-6 flex space-x-2">

                                    <NavButton
                                        to="/find/product"
                                        label="Buy"
                                        icon={
                                            <FiShoppingCart
                                                className={`transition-transform duration-300 transform ${
                                                    favHave ? "rotate-12 scale-125 tw-text-blue-600" : ""
                                                }`}
                                            />
                                        }
                                        onMouseEnter={() => setFavHave(true)}
                                        onMouseLeave={() => setFavHave(false)}
                                    />

                                    <NavButton
                                        to="/myshop"
                                        label="Sell"
                                        icon={
                                            <FiDollarSign
                                                className={`transition-transform duration-300 transform ${
                                                    sellHave ? "scale-125 tw-text-green-500" : ""
                                                }`}
                                            />
                                        }
                                        onMouseEnter={() => setSellHave(true)}
                                        onMouseLeave={() => setSellHave(false)}
                                    />
                                </div>
                            </div>
                        </div>

                    </div>

                    <div className="md:block hidden flex-1 ml-4 mr-auto items-center">
                        <SearchField/>
                    </div>


                    <div className="hidden md:block">
                        <div className="ml-4 flex items-center space-x-4">

                            <NavButton
                                to="/favorites"
                                label="Saved"
                                icon={
                                    <FiHeart
                                        className={`transition-transform duration-300 transform ${
                                            buyHave ? "scale-125 text-pink-400" : ""
                                        }`}
                                    />
                                }
                                onMouseEnter={() => setBuyHave(true)}
                                onMouseLeave={() => setBuyHave(false)}
                            />

                            <NavButton
                                to="/basket"
                                label="Basket"
                                icon={
                                    <FiShoppingBag
                                        className={`transition-transform duration-300 transform ${
                                            basketHave ? "rotate-12 scale-110 text-emerald-400" : ""
                                        }`}
                                    />
                                }
                                onMouseEnter={() => setBasketHave(true)}
                                onMouseLeave={() => setBasketHave(false)}
                            />

                            {isAuthenticated && user ? (
                                <div className="relative">
                                    <button
                                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                        className="flex items-center space-x-2 text-gray-300 hover:text-purple-500 px-3 py-2 rounded-md text-sm font-medium"
                                    >
                                        <img
                                            src={
                                                profileEntity?.imageUrl ||
                                                "https://i.pinimg.com/736x/c8/ec/05/c8ec0552d878e70bd29c25d0957a6faf.jpg"
                                            }
                                            alt="User"
                                            className="h-10 w-10 rounded-full border-1 border-purple-600 transition duration-300 hover:brightness-75"
                                        />
                                        <span>{profileEntity?.name}</span>
                                    </button>

                                    {isDropdownOpen && (
                                        <div
                                            className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-gray-800 ring-1 ring-black ring-opacity-5 z-50">
                                            <div className="py-1" role="menu">
                                                <Link to={"/profile"}>
                                                    <button
                                                        className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-purple-500"
                                                        role="menuitem"
                                                    >
                                                        <FiUser className="inline mr-2"/>
                                                        Profile
                                                    </button>
                                                </Link>
                                                <button
                                                    className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-purple-500"
                                                    role="menuitem"
                                                    onClick={logoutWithRedirect}
                                                >
                                                    <FiLogOut className="inline mr-2"/>
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
                            {isOpen ? <FiX size={24}/> : <FiMenu size={24}/>}
                        </button>
                    </div>
                </div>
            </div>
            <div className="block md:hidden pb-3">
                <SearchField/>
            </div>

            {isOpen && (
                <div className="md:hidden z-50">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">

                        <Link to={"/buy"}>
                            <button
                                className="text-gray-300 hover:text-purple-500 block px-3 py-2 rounded-md text-base font-medium w-full text-left">
                                <FiShoppingCart className="inline mr-2"/> Buy
                            </button>
                        </Link>

                        <Link to={"/myshop"}>
                            <button
                                className="text-gray-300 hover:text-purple-500 block px-3 py-2 rounded-md text-base font-medium w-full text-left">
                                <FiDollarSign className="inline mr-2"/> Sell
                            </button>
                        </Link>

                        <Link to={"/favorites"}>
                            <button
                                className="text-gray-300 hover:text-purple-500 block px-3 py-2 rounded-md text-base font-medium w-full text-left">
                                <FiHeart className="inline mr-2"/>
                                Saved
                            </button>
                        </Link>

                        <Link to={"/basket"}>
                            <button
                                className="text-gray-300 hover:text-purple-500 block px-3 py-2 rounded-md text-base font-medium w-full text-left">
                                <FiShoppingBag className="inline mr-2"/>
                                Basket
                            </button>
                        </Link>

                        {isAuthenticated && user ? (
                            <>
                                <Link to={"/profile"}>
                                    <button
                                        className="text-gray-300 hover:text-purple-500 block px-3 py-2 rounded-md text-base font-medium w-full text-left">
                                        <FiUser className="inline mr-2"/>
                                        Profile
                                    </button>
                                </Link>
                                <button
                                    className="text-gray-300 hover:text-purple-500 block px-3 py-2 rounded-md text-base font-medium w-full text-left"
                                    onClick={logoutWithRedirect}
                                >
                                    <FiLogOut className="inline mr-2"/>
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


