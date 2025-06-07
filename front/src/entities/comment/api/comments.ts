import axios from "axios";

interface CreateCommentDto {
    comment: string;
    rating: number;
    productId: string | number;
}

export const createProductComment = async (
    data: CreateCommentDto,
    token: string
) => {
    return await axios.post(
        `http://localhost:8080/api/comment/create`,
        data,
        {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        }
    );
};

export const getProductComments = async (productId: string) => {
    const res = await axios.get(`http://localhost:8080/api/comment/getProductComments/${productId}`);
    return res.data;
};

