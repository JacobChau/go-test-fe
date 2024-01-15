import { configureStore} from "@reduxjs/toolkit";
import authReducer from "@/stores/authSlice";
import messageReducer from "@/stores/messageSlice.ts";
import customizationReducer from "@/stores/customizationSlice.ts";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    message: messageReducer,
    customization: customizationReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export default store;

