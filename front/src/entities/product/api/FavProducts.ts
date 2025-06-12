
import {getWithAuth} from "../../../shared/api/apiClient.ts";
import {MY_URL} from "../../../shared/constants";

const BASE_URL: string = `${MY_URL}/favorites`;


export const fetchFavoriteProducts = (token: string) =>
    getWithAuth(`${BASE_URL}/products`,token);

export const toggleFavoriteProduct = (productId: string,token: string) =>
    getWithAuth(`${BASE_URL}/${productId}`,token);
