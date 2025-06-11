import {getPublic, getWithAuth, postWithAuth, putWithAuth} from "../../../shared/api/apiClient.ts";
import {MY_URL} from "../../../shared/constants";

const BASE_URL: string = `${MY_URL}/shop`;

export const getShopById = (shopId: string) =>
    getPublic(`${BASE_URL}/getById/${shopId}`);

export const getShopByName = (shopName: string) =>
    getPublic(`${BASE_URL}/shop/getByName/${shopName}`);


export const createShop = (token: string, formData: FormData) =>
    postWithAuth(`${BASE_URL}/create`, formData, token);

export const doesTheUserOwnAShop = (token: string) =>
    getWithAuth(`${BASE_URL}/doesTheUserOwnAShop`, token);


export const updateShop = (token: string, formData: FormData) =>
    putWithAuth(`${BASE_URL}/private/update`, formData, token);

export const getMyShop = (token: string) =>
    getWithAuth(`${BASE_URL}/myShop`, token);


export const fetchTopShops = (limit: number = 12) =>
    getPublic(`${BASE_URL}/public/top/${limit}`);


