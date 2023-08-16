import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import cardIdSlice from '@/reducers/cart-id';
import cardSlice  from '@/reducers/cart'

export const store = configureStore({
  reducer: {
    cardId: cardIdSlice,
    cart: cardSlice
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