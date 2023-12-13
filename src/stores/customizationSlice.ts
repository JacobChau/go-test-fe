// ==============================|| CUSTOMIZATION REDUCER ||============================== //

import {createSlice} from "@reduxjs/toolkit";
import {CustomizationState} from "@/stores/types.ts";

export const initialState: CustomizationState = {
  isOpen: 'dashboard',
  navType: ''
};

const customizationSlice = createSlice({
    name: 'customization',
    initialState,
    reducers: {
        menuOpen: (state, action) => {
          state.isOpen = action.payload;
        },
        menuType: (state, action) => {
          state.navType = action.payload;
        }
    }
});

export const { menuOpen, menuType } = customizationSlice.actions;

export default customizationSlice.reducer;