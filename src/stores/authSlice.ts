import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {
    CredentialsParams,
    ForgotPasswordParams,
    GoogleLoginParams,
    RefreshTokenParams,
    RegisterParams
} from "@/types/apis";
import {AuthState} from "@/stores/types.ts";
import AuthService from "@/api/services/authService.ts";
import {setMessageWithTimeout} from "@/stores/messageSlice.ts";

export const login = createAsyncThunk(
    'auth/login',
    async (data: CredentialsParams, thunkAPI) => {
        try {
            const response = await AuthService.login(data);
            thunkAPI.dispatch(setMessageWithTimeout({message: response.data.message, isError: false}));
            return response;
        } catch (e: any) {
            const message =
                (e.response &&
                    e.response.data &&
                    e.response.data.message) ||
                e.message ||
                e.toString();

            thunkAPI.dispatch(setMessageWithTimeout({message, isError: true}));
            return thunkAPI.rejectWithValue({error: message});
        }
    }
);

export const register = createAsyncThunk(
    'auth/register',
    async (data: RegisterParams, thunkAPI) => {
        try {
            const response = await AuthService.register(data);
            thunkAPI.dispatch(setMessageWithTimeout({message: response.data.message, isError: false}));
            return response.data.data;
        } catch (e: any) {
            const message =
                (e.response &&
                    e.response.data &&
                    e.response.data.message) ||
                e.message ||
                e.toString();

            thunkAPI.dispatch(setMessageWithTimeout({message, isError: true}));
            return thunkAPI.rejectWithValue({error: message});
        }
    }
);

export const logout = () => {
    AuthService.logout();
}

export const loginWithGoogle = createAsyncThunk(
    'auth/google',
    async (data: GoogleLoginParams, thunkAPI) => {
        try {
            const response = await AuthService.loginWithGoogle(data);
            thunkAPI.dispatch(setMessageWithTimeout({message: response.data.message, isError: false}));
            return response.data.data;
        } catch (e: any) {
            const message =
                (e.response &&
                    e.response.data &&
                    e.response.data.message) ||
                e.message ||
                e.toString();

            thunkAPI.dispatch(setMessageWithTimeout({message, isError: true}));
            return thunkAPI.rejectWithValue({error: message});
        }
    }
);

export const refreshToken = createAsyncThunk(
    'auth/refreshToken',
    async (data: RefreshTokenParams, thunkAPI) => {
        try {
            const response = await AuthService.refreshToken(data);
            thunkAPI.dispatch(setMessageWithTimeout({message: response.data.message, isError: false}));
            return response.data.data;
        } catch (e: any) {
            const message =
                (e.response &&
                    e.response.data &&
                    e.response.data.message) ||
                e.message ||
                e.toString();

            thunkAPI.dispatch(setMessageWithTimeout({message, isError: true}));
            return thunkAPI.rejectWithValue({error: message});
        }
    }
);

export const forgotPassword = createAsyncThunk(
    'auth/forgot-password',
    async (data: ForgotPasswordParams, thunkAPI) => {
        try {
            const response = await AuthService.forgotPassword(data);
            thunkAPI.dispatch(setMessageWithTimeout({message: response.data.message, isError: false}));
            return response.data.data;
        } catch (e: any) {
            const message =
                (e.response &&
                    e.response.data &&
                    e.response.data.message) ||
                e.message ||
                e.toString();

            thunkAPI.dispatch(setMessageWithTimeout({message, isError: true}));
            return thunkAPI.rejectWithValue({error: message});
        }
    }
);


const initialState: AuthState = {
    isLoading: false,
    isLoggedIn: false,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.isLoggedIn = false;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(login.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(login.fulfilled, (state) => {
            state.isLoading = false;
            state.isLoggedIn = true;
        });
        builder.addCase(login.rejected, (state) => {
            state.isLoading = false;
        });
        builder.addCase(register.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(register.fulfilled, (state) => {
            state.isLoading = false;
            state.isLoggedIn = false;
        });
        builder.addCase(register.rejected, (state) => {
            state.isLoading = false;
            state.isLoggedIn = false;
        });
        builder.addCase(loginWithGoogle.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(loginWithGoogle.fulfilled, (state) => {
            state.isLoading = false;
            state.isLoggedIn = true;
        });
        builder.addCase(loginWithGoogle.rejected, (state) => {
            state.isLoading = false;
        });
        builder.addCase(refreshToken.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(refreshToken.fulfilled, (state) => {
            state.isLoading = false;
            state.isLoggedIn = true;
        });
        builder.addCase(refreshToken.rejected, (state) => {
            state.isLoading = false;
        });
        builder.addCase(forgotPassword.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(forgotPassword.fulfilled, (state) => {
            state.isLoading = false;
        });
        builder.addCase(forgotPassword.rejected, (state) => {
            state.isLoading = false;
        });
    }
});

export default authSlice.reducer;