import { createSlice } from "@reduxjs/toolkit";
import {MessageState} from "@/stores/types.ts";



const initialState: MessageState = {
}

const messageSlice = createSlice({
    name: "message",
    initialState,
    reducers: {
        setMessage: (_state, action) => {
            return { message: action.payload.message, isError: action.payload.isError };
        },
        clearMessage: () => {
            return { message: undefined, isError: undefined };
        },
    },
});

export const { setMessage, clearMessage } = messageSlice.actions;

export default messageSlice.reducer;