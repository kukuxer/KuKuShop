import { Routes, Route } from "react-router-dom";
import Home from "./components/mainPage/Home";
import NavBar from "./components/navbar-footer/NavBar";
import './App.css';
import LikedProducts from "./components/favPage/LikedProducts";
import BasketPage from "./components/basketPage/BasketPage";

import Profile from "./components/profile/Profile";
import ProductForm from "./components/forms/ProductForm";
import MyShop from "./components/shopPage/MyShop";
import { withAuthenticationRequired } from "@auth0/auth0-react";
import Loading from "./components/utils/Loading";
import TailWindNavBar from "./components/navbar-footer/NavBar";


const ProtectedShop = withAuthenticationRequired(MyShop, {
  onRedirecting: () => <Loading />,
}); 
const ProtectedProfile = withAuthenticationRequired(Profile, {
  onRedirecting: () => <Loading />,
});
const ProtectedProductForm = withAuthenticationRequired(ProductForm, {
  onRedirecting: () => <Loading />,
});

const ProtectedLikedProducts = withAuthenticationRequired(LikedProducts, {
  onRedirecting: () => <Loading />,
});

const ProtectedBasket = withAuthenticationRequired(BasketPage, {
  onRedirecting: () => <Loading />,
});

const App = () => {
  return (
    <div id="app" className="d-flex flex-column h-100">
      <TailWindNavBar />
      <div className="container flex-grow-1">
        <div className="mt-5">
          <Routes>
            <Route path="/" element={<Home />} />
            
             {/* Secure Route */}
             <Route path="/myshop" element={<ProtectedShop />} />
             <Route path="/profile" element={<ProtectedProfile />} />
             <Route path="/productForm" element={<ProtectedProductForm />} />
             <Route path="/favorites" element={<ProtectedLikedProducts/>} />
             <Route path="/basket" element={<ProtectedBasket/>} />

          </Routes>
        </div>
      </div>
    </div>
  );
};

export default App;
