import {createSlice} from "@reduxjs/toolkit";
import {initialState} from "./profile.types.ts";
import {loadProfile, updateProfileAsync} from "./profile.thunks.ts";

const profileSlice = createSlice({
    name: "profile",
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder
            .addCase(loadProfile.pending, (state) => {
                state.status = "loading";
            })
            .addCase(loadProfile.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.profileEntity = action.payload;
                console.log(state.profileEntity);
            })
            .addCase(loadProfile.rejected, (state) => {
                state.status = "failed";
                state.error = "Failed to load profile";
            })
            .addCase(updateProfileAsync.fulfilled, (state, action) => {
                if (state.profileEntity) {
                    state.profileEntity = {
                        ...state.profileEntity,
                        ...action.payload,
                    };
                }
            })

    }
});


export default profileSlice.reducer;