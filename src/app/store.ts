import { combineReducers, configureStore, ThunkAction, Action, AnyAction} from '@reduxjs/toolkit';
import { persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'reduxjs-toolkit-persist';
import autoMergeLevel2 from 'reduxjs-toolkit-persist/lib/stateReconciler/autoMergeLevel2';
import storage from 'reduxjs-toolkit-persist/lib/storage';
import authReducer from '../reducer/auth';

const persistConfig = {
  key: 'avatar-wallet',
  storage: storage,
  stateReconciler: autoMergeLevel2,
  whitelist: ['auth']
};

const rootReducers = combineReducers({
  auth: authReducer
})

const _persistedReducer = persistReducer<any,AnyAction>(persistConfig, rootReducers);

export const store = configureStore({
  reducer: _persistedReducer,
  middleware: (getDefaultMiddleware: any) => {
    return getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          FLUSH,
          REHYDRATE,
          PAUSE,
          PERSIST,
          PURGE,
          REGISTER
        ],
      }
    })
  },
  devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof rootReducers>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  any,
  Action<string>
>;
export interface ActionReducer<T, V extends Action = Action> {
  (state: T | undefined, action: V): T;
}

