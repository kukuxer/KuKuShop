import {createAsyncThunk} from "@reduxjs/toolkit";
import {ProfileEntity} from "../../../entities";
import {User} from "@auth0/auth0-react";
import {fetchOrCreateProfile, updateProfileApi} from "../../../entities/profile/api/profiles.ts";

export const loadProfile = createAsyncThunk<
    ProfileEntity,
    { token: string; user: User | undefined }
>("profile/loadProfile", async ({token, user}) => {
    return await fetchOrCreateProfile(token, user);
});

export const updateProfileAsync = createAsyncThunk<
    Partial<ProfileEntity>,
    { token: string; formData: FormData }
>(
    'profile/updateProfile',
    async ({token, formData}) => {
        return await updateProfileApi(token, formData);
    }
);