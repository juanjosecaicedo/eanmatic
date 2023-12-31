import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import cardIdSlice from '@/reducers/cart-id';
import cardSlice  from '@/reducers/cart'
import tokenSlice from '@/reducers/token'

export const store = configureStore({
  reducer: {
    cardId: cardIdSlice,
    cart: cardSlice,
    token: tokenSlice
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;