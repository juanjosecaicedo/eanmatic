import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface CardIdState {
  value: string | null
}

const cardId = localStorage.getItem("CART_ID")

const initialState: CardIdState = {
  value: cardId,
}

export const cardIdSlice = createSlice({
  name: 'cardId',
  initialState,
  reducers: {
    setCardId: (state, action: PayloadAction<string>) => {
      state.value = action.payload
    }
  }
})

export const { setCardId } = cardIdSlice.actions
export default cardIdSlice.reducer