import { createSlice, createSelector} from '@reduxjs/toolkit';
import { RootState } from '../app/store';
import moment from 'moment'

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
      state.expiredTime = moment().add(1, 'Q').valueOf();
    },
    updateExpiredTime(state){
      state.expiredTime = moment().add(1, 'Q').valueOf();
    }
  }, 
  extraReducers: (builder) => {
    
  }
})

export const {setUserPwd, updateExpiredTime} = auth.actions;
const selectAuthState =  (state: RootState)  => state.auth;
export const selectPwd = createSelector(selectAuthState, state => state.password);
export const selectExpiredTime = createSelector(selectAuthState, state => state.expiredTime); 

export default auth.reducer;
