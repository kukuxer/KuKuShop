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