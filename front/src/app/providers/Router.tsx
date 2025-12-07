import {createBrowserRouter} from "react-router-dom";
import {Home, ProductPage, PublicShopPage} from "../../pages";
import {App,} from "../App";
import {
    ProtectedShop,
    ProtectedShopComponent,
    ProtectedProfile,
    ProtectedShopForm,
    ProtectedLikedProducts,
    ProtectedBasket,
    ProtectedProductForm
} from "../../shared/utils/ProtectedComponent.tsx";
import {ProductsPage} from "../../pages/ProductSelector/ui/ProductsPage.tsx";

export const router = createBrowserRouter([
    {
        path: "/",
        Component: App,
        children: [
            {index: true, element: <Home/>},
            {path: "shops/:shopName", element: <PublicShopPage/>},
            {path: "products/:productId", element: <ProductPage/>},
            {path: "find/product", element: <ProductsPage/>},
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
