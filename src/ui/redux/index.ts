import {
  AnyAction,
  Middleware,
  MiddlewareArray,
  combineReducers,
  configureStore,
} from "@reduxjs/toolkit";
import { persistStore, persistReducer, PersistConfig } from "redux-persist";
import storage from "redux-persist/lib/storage";
import logger from "redux-logger";
import { configReducer } from "./config";
import { authReducer } from "./auth";
import { useDispatch, useSelector } from "react-redux";
import _ from "lodash";
import { walletReducer } from "./wallet";
import { subscriptionReducer } from "./subscriptions";

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
// Use throughout your app instead of plain `useDispatch` and `useSelector`
type DispatchFunc = () => AppDispatch;
export const useAppDispatch: DispatchFunc = useDispatch;
export function useAppSelector<T>(selector: (state: RootState) => T) {
  return useSelector(selector, _.isEqual);
}
// export type AppThunk<ReturnType = void> = ThunkAction<
//   ReturnType,
//   RootState,
//   unknown,
//   UnknownAction
// >;

const isDev = process.env.NODE_ENV === "development";

const persistConfig: PersistConfig<RootState> = {
  key: "root",
  storage,
  whitelist: ["config"],
};

const rootReducer = combineReducers({
  auth: authReducer,
  wallet: walletReducer,
  config: configReducer,
  subscriptions: subscriptionReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddlewares) => {
    const middlewares = getDefaultMiddlewares();
    if (isDev) {
      return middlewares.concat(logger);
    }
    return middlewares;
  },
});

export default store;

export const persistor = persistStore(store);
