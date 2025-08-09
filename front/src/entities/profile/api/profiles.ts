import {ProfileEntity} from "../model/types";
import axios from "axios";
import {User} from "@auth0/auth0-react";

export const getProfile = async (token: string): Promise<ProfileEntity> => {
    try {
        const response = await axios.get<ProfileEntity>(
            `http://localhost:8080/api/profile/get`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error("Failed to fetch profile", error);
        throw error;
    }
};

export const fetchOrCreateProfile = async (token: string, user: User | undefined) => {
    try {
        const response = await axios.post<ProfileEntity>(
            "http://localhost:8080/api/profile/getOrCreateProfile",
            {
                name: user?.name || "",
                email: user?.email || "",
                familyName: user?.family_name || "",
                givenName: user?.given_name || "",
                nickname: user?.nickname || "",
                imageUrl: user?.picture || "",
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error("Failed to fetch or create profile", error);
        throw error;
    }
};



export const updateProfileApi = async (token: string, formData: FormData): Promise<ProfileEntity> => {
    try {
        const response = await axios.put(
            'http://localhost:8080/api/profile/update',
            formData,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error("Failed to update profile", error);
        throw error;
    }
}