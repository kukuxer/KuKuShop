import {getPublic, postWithAuth} from "../../../shared/api/apiClient.ts";
import {MY_URL} from "../../../shared/constants";
import {CreateCommentDto} from "../model/types.ts";

const BASE_URL: string = `${MY_URL}/comment`;


export const createProductComment = (token: string, data: CreateCommentDto) =>
    postWithAuth(`${BASE_URL}/create`, data, token);

export const getProductComments = (productId: string) =>
    getPublic(`${BASE_URL}/getProductComments/${productId}`);

