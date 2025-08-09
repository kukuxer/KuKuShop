import {ProfileEntity} from "../../../entities";

type ProfileState = {
    profileEntity: ProfileEntity | null;
    status: "idle" | "loading" | "succeeded" | "failed";
    error?: string;
};

export const initialState: ProfileState = {
    profileEntity: null,
    status: "idle",
};