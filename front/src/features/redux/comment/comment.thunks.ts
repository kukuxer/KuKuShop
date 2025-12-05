import {createAsyncThunk} from "@reduxjs/toolkit";

import {createProductComment, getProductComments} from "../../../entities/comment/api/comments.ts";
import {CommentEntity, CreateCommentDto} from "../../../entities/comment/model/types.ts";

export const getProductCommentsByProductId = createAsyncThunk<CommentEntity[], string>(
    'comment/getProductCommentsByProductId',
    async (productId) => {
        return await getProductComments(productId);
    }
);

export const createComment = createAsyncThunk<
    CommentEntity,
    { token: string; createCommentDto: CreateCommentDto }
>(
    'comment/createComment',
    async ({ token, createCommentDto }) => {
        return await createProductComment(token, createCommentDto);
    }
);

