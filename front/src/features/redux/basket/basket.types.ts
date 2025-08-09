import {Product} from "../../../entities";

 interface BasketState {
    items: Product[];
    loading: boolean;
    error: string | null;
}
export const initialState: BasketState = {
    items: [],
    loading: false,
    error: null,
};
