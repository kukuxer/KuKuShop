import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import { RootState } from "../../../app/store";
import {initialState} from "./comment.types.ts";
import {getProductCommentsByProductId,createComment} from "./comment.thunks.ts";
import {CommentEntity} from "../../../entities";


const commentSlice = createSlice({
    name: 'comment',
    initialState,
    reducers: {
        addItem(state, action: PayloadAction<CommentEntity>) {
            state.comments.push(action.payload);
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getProductCommentsByProductId.pending, (state) => {
                state.commentsLoading = true;
                state.commentsError = null;
            })
            .addCase(getProductCommentsByProductId.fulfilled, (state, action) => {
                state.commentsLoading = false;
                state.comments = action.payload;
            })
            .addCase(getProductCommentsByProductId.rejected, (state, action) => {
                state.commentsLoading = false;
                state.commentsError = action.error.message || 'Failed to fetch basket';
            })
            .addCase(createComment.fulfilled, (state, action) => {
                state.commentsLoading = false;
                state.comments.push(action.payload);
            })
            .addCase(createComment.rejected, (state, action) => {
                state.commentsLoading = false;
                state.commentsError = action.error.message || 'Failed to create comment';
            })
    },
});

export const commentSelector = (state: RootState) => state.comment;
export const {addItem} = commentSlice.actions;
export default commentSlice.reducer;