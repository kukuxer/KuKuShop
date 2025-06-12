import React from "react";
import {withAuthenticationRequired} from "@auth0/auth0-react";
import {Loading} from "../ui/loading";
import {BasketPage, MyShopPage, Profile} from "../../pages";
import {MyShopComponent} from "../../pages/shop/MyShopPage/ui/MyShopComponent.tsx";
import {ProductCreationForm, ShopCreationForm} from "../../features";
import FavProductsPage from "../../pages/favorite/ui/FavProductsPage.tsx";

const protect = (Component: React.ComponentType) =>
    withAuthenticationRequired(Component, { onRedirecting: () => <Loading /> });

export const ProtectedShop = protect(MyShopPage);
export const ProtectedShopComponent = protect(MyShopComponent);
export const ProtectedProductForm = protect(ProductCreationForm);
export const ProtectedProfile = protect(Profile);
export const ProtectedLikedProducts = protect(FavProductsPage);
export const ProtectedBasket = protect(BasketPage);
export const ProtectedShopForm = protect(ShopCreationForm);