import {ProfileEntity} from '../../../entities';
import {createSlice} from "@reduxjs/toolkit";


type ProfileState = {
    profileEntity: ProfileEntity | null;
    status: string | null;
};

const initialState: ProfileState = {
    profileEntity: null,
    status: 'loading'
};


const profileSlice = createSlice({
    name: 'profile',
    initialState,
    reducers: {
        updateUser(state, action){

        }
    }
})
