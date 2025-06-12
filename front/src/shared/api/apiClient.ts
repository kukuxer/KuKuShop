import axios from "axios";

const createAuthHeaders = (token: string) => ({
    headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
    },
});

export const getWithAuth = async (url: string, token: string) => {
    const response = await axios.get(url, createAuthHeaders(token));
    return response.data;
};

export const postWithAuth = async (url: string, data: any, token: string) => {
    const response = await axios.post(url, data, createAuthHeaders(token));
    return response.data;
};

export const putWithAuth = async (url: string, data: any, token: string) => {
    const response = await axios.put(url, data, createAuthHeaders(token));
    return response.data;
};

export const deleteWithAuth = async (url: string, token: string) => {
    const response = await axios.delete(url, createAuthHeaders(token));
    return response.data;
};

export const getPublic = async (url: string) => {
    const response = await axios.get(url);
    return response.data;
};