import { Routes, Route } from "react-router-dom";
import Home from "./components/mainPage/Home";
import "./App.css";
import LikedProducts from "./components/favPage/LikedProducts";
import BasketPage from "./components/basketPage/BasketPage";
import Profile from "./components/profile/Profile";
import ProductForm from "./components/forms/ProductForm";
import MyShop from "./components/shopPage/MyShop";
import { withAuthenticationRequired } from "@auth0/auth0-react";
import Loading from "./components/utils/Loading";
import TailWindNavBar from "./components/navbar-footer/NavBar";
import ShopForm from "./components/forms/ShopForm";
import MyShopComponent from "./components/shopPage/components/MyShopComponent";
import Shop from "./components/shopPage/Shop";
import ProductPage from "./components/ProductPage/ProductPage";
import EditProduct from "./components/ProductPage/components/EditProduct";

const ProtectedShop = withAuthenticationRequired(MyShop, {
  onRedirecting: () => <Loading />,
});
const ProtectedShopComponent = withAuthenticationRequired(MyShopComponent, {
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
const ProtectedShopForm = withAuthenticationRequired(ShopForm, {
  onRedirecting: () => <Loading />,
});

const App = () => {
  return (
    <div id="app" className="d-flex flex-column h-100">
        <TailWindNavBar />
      <div className="flex-grow-1 w-full px-0">
        <div className="justify-center items-center">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shops/:shopName" element={<Shop />} />
            <Route path="/products/:productId" element={<ProductPage />} />
            {/* Secure Route */}
            <Route path="/myshop" element={<ProtectedShop />} />
            <Route path="/editProduct/:productId" element={<EditProduct />} />
            <Route
              path="/myshopComponent"
              element={<ProtectedShopComponent />}
            />
            <Route path="/profile" element={<ProtectedProfile />} />
            <Route path="/productForm" element={<ProtectedProductForm />} />
            <Route path="/shopForm" element={<ProtectedShopForm />} />
            <Route path="/favorites" element={<ProtectedLikedProducts />} />
            <Route path="/basket" element={<ProtectedBasket />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default App;
