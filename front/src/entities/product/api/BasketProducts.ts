import {MY_URL} from "../../../shared/constants";
import {deleteWithAuth, getWithAuth, putWithAuth} from "../../../shared/api/apiClient.ts";


const BASE_URL: string = `${MY_URL}/basket`;


export const fetchBasketProducts = (token: string) =>
    getWithAuth(`${BASE_URL}/products`,token);

export const deleteProductFromBasket = (id: string, token: string) =>
    deleteWithAuth(`${BASE_URL}/delete/${id}`,token);

export const updateBasketProductQuantity = (id: string, quantity: number, token: string) =>
    putWithAuth(`${BASE_URL}/update-quantity/${id}`,quantity,token);

export const addProductToBasket = (id: string, token: string) =>
    getWithAuth(`${BASE_URL}/add/${id}`, token);