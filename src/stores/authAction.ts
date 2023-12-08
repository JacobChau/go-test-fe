// import {createAsyncThunk} from "@reduxjs/toolkit";
//
// export const registerUser = createAsyncThunk(
//     '/auth/register',
//     async (payload: any, thunkAPI: any) => {
//         const response = await fetch('http://localhost:3000/api/v1/users', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify(payload)
//         });
//         return await response.json();
//     }
// );