import {ProfileEntity} from "../model/types";
import axios from "axios";
export const getProfile = async (token: string):Promise<ProfileEntity> => {
    try{
        const response = await axios.get<ProfileEntity>(
            `http://localhost:8080/api/profile/get`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                },
            }
        );
        return response.data;
    }catch (error){
        console.error("Failed to fetch profile", error);
        throw error;
    }
};

export const fetchOrCreateProfile = async (token: string, user: any) => {
    const response = await fetch("http://localhost:8080/api/profile/getOrCreateProfile", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
            name: user?.name || "",
            email: user?.email || "",
            familyName: user?.family_name || "",
            givenName: user?.given_name || "",
            nickname: user?.nickname || "",
            imageUrl: user?.picture || "",
        }),
    });

    if (!response.ok) {
        throw new Error("Failed to fetch or create profile");
    }

    return await response.json();
};


export const updateProfile = async(token: string, formData: FormData):Promise<ProfileEntity> => {
    try{
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
    }catch(error){
        console.error("Failed to update profile", error);
        throw error;
    }
}