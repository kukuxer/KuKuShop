import { Routes, Route } from "react-router-dom";
import Home from "../components/mainPage/Home.tsx";
import "../App.css";
import LikedProducts from "../components/favPage/LikedProducts.tsx";
import BasketPage from "../pages/basket/BasketPage.tsx";
import Profile from "../components/profile/Profile.tsx";
import ProductForm from "../components/forms/ProductForm.tsx";
import MyShop from "../components/shopPage/MyShop.tsx";
import { withAuthenticationRequired } from "@auth0/auth0-react";
import Loading from "../components/utils/Loading.tsx";
import TailWindNavBar from "../components/navbar-footer/NavBar.tsx";
import ShopForm from "../components/forms/ShopForm.tsx";
import MyShopComponent from "../components/shopPage/components/MyShopComponent.tsx";
import Shop from "../components/shopPage/Shop.tsx";
import ProductPage from "../components/ProductPage/ProductPage.tsx";
import EditProduct from "../components/ProductPage/components/EditProduct.tsx";

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
