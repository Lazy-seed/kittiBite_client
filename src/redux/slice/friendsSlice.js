import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getReq } from '../../apis/Api';

const initialState = {
    friendList: [], 
    reqSendList:[],
    btnLoading:false,
    isLoading: false,
    error: null,
};

export const fetchPendingRequests = createAsyncThunk(
    'friend/fetchPendingRequests',
    async (_, thunkAPI) => {
        try {
            const response = await getReq('pendingFriends');
            return response.pendingList;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.msg || error.message);
        }
    }
);

export const sendFriendRequest = createAsyncThunk(
    'friend/sendFriendRequest',
    async (ID, thunkAPI) => {
        try {
            const response = await getReq(`requestFriend`, `${ID}`);
            return ID;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.msg || error.message);
        }
    }
);
export const acceptFriendRequest = createAsyncThunk(
    'friend/acceptFriendRequest',
    async (ID, thunkAPI) => {
        try {
            const response = await getReq(`acceptFriend`, `${ID}`);
            return ID;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.msg || error.message);
        }
    }
);
export const deleteRequest = createAsyncThunk(
    'friend/deleteRequest',
    async (ID, thunkAPI) => {
        try {
            const response = await getReq(`deleteRequest`, `${ID}`);
            return ID;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.msg || error.message);
        }
    }
);

export const getFriend = createAsyncThunk(
    'friend/getFriend',
    async (_, thunkAPI) => {
        try {
            const response = await getReq(`getFriends`);
            if (response.success) {
                return response.allFriends;
            } else {
                return []
            }
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.msg || error.message);
        }
    }
);
export const getAllUsers = createAsyncThunk(
    'friend/getAllUsers',
    async (_, thunkAPI) => {
        try {
            const response = await getReq(`getUsers`);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.msg || error.message);
        }
    }
);

const friendSlice = createSlice({
    name: 'friend',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchPendingRequests.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchPendingRequests.fulfilled, (state, action) => {
                state.isLoading = false;
                state.friendList = action.payload;
            })
            .addCase(fetchPendingRequests.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            .addCase(sendFriendRequest.pending, (state) => {
                // state.isLoading = true;
                state.error = null;
            })
            .addCase(sendFriendRequest.fulfilled, (state, action) => {
                state.isLoading = false;
                state.reqSendList = [action.payload, ...state.reqSendList]
            })
            .addCase(sendFriendRequest.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            // fends
            .addCase(getFriend.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getFriend.fulfilled, (state, action) => {
                state.isLoading = false;
                state.friendList = action.payload;
            })
            .addCase(getFriend.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
        //   acccept
            .addCase(acceptFriendRequest.pending, (state) => {
                state.btnLoading = true;
                state.error = null;
            })
            .addCase(acceptFriendRequest.fulfilled, (state, action) => {
                state.btnLoading = false;
                console.log(action.payload);
                state.friendList = state.friendList.filter((elm) => elm._id !== action.payload)
            })
            .addCase(acceptFriendRequest.rejected, (state, action) => {
                state.btnLoading = false;
                state.error = action.payload;
            })
            // alll
            .addCase(getAllUsers.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getAllUsers.fulfilled, (state, action) => {
                state.isLoading = false;
                state.friendList = action.payload.allusers;
                state.reqSendList = action.payload.reqSendList;
            })
            .addCase(getAllUsers.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            // delete
               .addCase(deleteRequest.pending, (state) => {
                state.btnLoading = true;
                state.error = null;
            })
            .addCase(deleteRequest.fulfilled, (state, action) => {
                state.btnLoading = false;
                state.reqSendList = state.reqSendList.filter((id) => id !== action.payload)
            })
            .addCase(deleteRequest.rejected, (state, action) => {
                state.btnLoading = false;
                state.error = action.payload;
            })
    },
});

export default friendSlice.reducer;
