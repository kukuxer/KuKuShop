import {createBrowserRouter} from "react-router-dom";
import {BasketPage, Home, MyShopPage, ProductPage, Profile, PublicShopPage} from "../../pages";
import {ProductSelectorPage} from "../../pages/ProductSelector";
import {App,} from "../App";
import {withAuthenticationRequired} from "@auth0/auth0-react";
import {Loading} from "../../shared/ui/loading";
import {MyShopComponent} from "../../pages/shop/MyShopPage/ui/MyShopComponent.tsx";
import {ProductCreationForm, ShopCreationForm} from "../../features";
import FavProductsPage from "../../pages/favorite/ui/FavProductsPage.tsx";

export const ProtectedShop = withAuthenticationRequired(MyShopPage, {
    onRedirecting: () => <Loading />,
});
export const ProtectedShopComponent = withAuthenticationRequired(MyShopComponent, {
    onRedirecting: () => <Loading />,
});
export const ProtectedProductForm = withAuthenticationRequired(ProductCreationForm, {
    onRedirecting: () => <Loading />,
});

export const ProtectedProfile = withAuthenticationRequired(Profile, {
    onRedirecting: () => <Loading />,
});

export const ProtectedLikedProducts = withAuthenticationRequired(FavProductsPage, {
    onRedirecting: () => <Loading />,
});

export const ProtectedBasket = withAuthenticationRequired(BasketPage, {
    onRedirecting: () => <Loading />,
});
export const ProtectedShopForm = withAuthenticationRequired(ShopCreationForm, {
    onRedirecting: () => <Loading />,
});

export const router = createBrowserRouter([
    {
        path: "/",
        Component: App,
        children: [
            {index: true, element: <Home/>},
            {path: "shops/:shopName", element: <PublicShopPage/>},
            {path: "products/:productId", element: <ProductPage/>},
            {path: "find/product", element: <ProductSelectorPage/>},

            // Protected routes (could add loader/auth check here)
            {path: "myshop", element: <ProtectedShop/>},
            {path: "myshopComponent", element: <ProtectedShopComponent/>},
            {path: "profile", element: <ProtectedProfile/>},
            {path: "productForm", element: <ProtectedProductForm/>},
            {path: "shopForm", element: <ProtectedShopForm/>},
            {path: "favorites", element: <ProtectedLikedProducts/>},
            {path: "basket", element: <ProtectedBasket/>},
        ],
    },
]);
