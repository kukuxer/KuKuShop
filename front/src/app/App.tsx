import { Routes, Route } from "react-router-dom";
import "./styles/App.css";
import FavProductsPage from "../pages/favorite/ui/FavProductsPage.tsx";
import { withAuthenticationRequired } from "@auth0/auth0-react";
import {Navbar} from "../widgets/navbar";
import {MyShopComponent} from "../pages/shop/MyShopPage/ui/MyShopComponent.tsx";
import {MyShopPage,PublicShopPage, Profile, ProductPage, Home, BasketPage,} from "../pages";
import {ProductCreationForm, ShopCreationForm} from "../features";
import {Loading} from "../shared/ui/loading";
import {ProductSelectorPage} from "../pages/ProductSelector";

const ProtectedShop = withAuthenticationRequired(MyShopPage, {
  onRedirecting: () => <Loading />,
});
const ProtectedShopComponent = withAuthenticationRequired(MyShopComponent, {
  onRedirecting: () => <Loading />,
});
const ProtectedProfile = withAuthenticationRequired(Profile, {
  onRedirecting: () => <Loading />,
});
const ProtectedProductForm = withAuthenticationRequired(ProductCreationForm, {
  onRedirecting: () => <Loading />,
});

const ProtectedLikedProducts = withAuthenticationRequired(FavProductsPage, {
  onRedirecting: () => <Loading />,
});

const ProtectedBasket = withAuthenticationRequired(BasketPage, {
  onRedirecting: () => <Loading />,
});
const ProtectedShopForm = withAuthenticationRequired(ShopCreationForm, {
  onRedirecting: () => <Loading />,
});

export  const App = () => {
  return (
    <div id="app" className="d-flex flex-column h-100">
        <Navbar />
      <div className="flex-grow-1 w-full px-0">
        <div className="justify-center items-center">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shops/:shopName" element={<PublicShopPage />} />
            <Route path="/products/:productId" element={<ProductPage />} />
            <Route path="/find/product" element={<ProductSelectorPage />} />
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


