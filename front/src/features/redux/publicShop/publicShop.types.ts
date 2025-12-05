import {Product, Shop} from "../../../entities";

interface publicShopState {
    myShop: Shop | null;
    myShopItems: Product[];
    loading: boolean;
    error: string | null;
}
export const initialState: publicShopState = {
    myShop: null,
    myShopItems: [],
    loading: false,
    error: null
};