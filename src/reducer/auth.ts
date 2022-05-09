import { createSlice, createSelector, createAsyncThunk } from '@reduxjs/toolkit';

interface AuthProps {
  loading: boolean,
}

const initialState: AuthProps = {
  loading: false,
}


export const auth = createSlice({
  name:'auth',
  initialState,
  reducers: {
  },
  extraReducers: (builder) => {
    
  }
})


export default auth.reducer;
