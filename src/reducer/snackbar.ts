import { createSlice, createSelector, Reducer } from '@reduxjs/toolkit';
import { RootState } from '../app/store';

interface StateProps {
  notifications: any[]
}

const initialState: StateProps = {
  notifications: [],
}

export const snackbar = createSlice({
  name:'snackbar',
  initialState,
  reducers: {
    enqueueSnackbar: (state, {payload, type}) => {
      const key = `${type}-${payload.options.key}`;
      state.notifications.push({
        key,
        ...payload
      })
    },
    removeSnackbar: (state, {payload, type}) => {
      state.notifications = [];
      //state.notifications = state.notifications?.filter(notification => notification.key !== payload)
    }
  }
})

export const {removeSnackbar, enqueueSnackbar} = snackbar.actions;

const selectBaseState = (state: RootState)  => state.snackbar;
export const selectNotifications = createSelector(selectBaseState, snackbar => snackbar.notifications)

export default snackbar.reducer as Reducer<typeof initialState>;
  