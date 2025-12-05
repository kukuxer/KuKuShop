import {CommentEntity} from "../../../entities";

interface commentState {
    comments: CommentEntity[];
    commentsLoading: boolean;
    commentsError: string | null;
}
export const initialState: commentState = {
    comments: [],
    commentsLoading: false,
    commentsError: null,
};
