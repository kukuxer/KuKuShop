import {Product, Shop} from "../../../entities";

interface MyShopState {
    myShop: Shop | null;
    myShopItems: Product[];
    loading: boolean;
    error: string | null;
}
export const initialState: MyShopState = {
    myShop: null,
    myShopItems: [],
    loading: false,
    error: null,
};