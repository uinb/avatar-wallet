import { createSlice, createSelector} from '@reduxjs/toolkit';
import { RootState } from '../app/store';

interface AuthProps {
  loading: boolean,
  password: string,
  expiredTime: number,
}

const initialState: AuthProps = {
  loading: false,
  password: '',
  expiredTime: 0
}


export const auth = createSlice({
  name:'auth',
  initialState,
  reducers: {
    setUserPwd(state, {payload = ''}){
      state.password  = payload;
      state.expiredTime = Date.now();
    },
  }, 
  extraReducers: (builder) => {
    
  }
})

export const {setUserPwd} = auth.actions;
const selectAuthState =  (state: RootState)  => state.auth;
export const selectPwd = createSelector(selectAuthState, state => state.password); 

export default auth.reducer;
