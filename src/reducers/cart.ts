import { Cart } from '@/interfaces/Cart'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface Value {
  value: Cart | null | object
}

const initialState: Value = {
  value: null,
}

export const cardSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCart: (state, action: PayloadAction<object>) => {
      state.value = action.payload
    }
  }
})

export const { setCart } = cardSlice.actions
export default cardSlice.reducer