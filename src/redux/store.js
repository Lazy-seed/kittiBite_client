import { configureStore } from '@reduxjs/toolkit';
import UserSlice from './slice/userSlice';
import friendsSlice from './slice/friendsSlice';

const store = configureStore({
  reducer: {
    user: UserSlice,
    friend:friendsSlice
  },
});

export default store;
