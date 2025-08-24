import {Product} from "../../../entities";

interface LikedState {
    items: Product[];
    loading: boolean;
    error: string | null;
}
export const initialState: LikedState = {
    items: [],
    loading: false,
    error: null,
};