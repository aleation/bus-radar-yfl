import { configureStore } from "@reduxjs/toolkit";
import { journeysApi } from "./services/journeys";

export const store = configureStore({
    reducer: {
        [journeysApi.reducerPath]: journeysApi.reducer
    },
    middleware: getDefaultMiddleware => getDefaultMiddleware().concat(journeysApi.middleware)
});

export type RootState   = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

// optional, but required for refetchOnFocus/refetchOnReconnect behaviors
// see `setupListeners` docs - takes an optional callback as the 2nd arg for customization
// setupListeners(store.dispatch);