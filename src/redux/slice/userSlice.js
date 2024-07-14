import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    userData: {},
    isLogin:false
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.userData = action.payload;
    },
    clearUser: (state) => {
     state.userData = {}
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
