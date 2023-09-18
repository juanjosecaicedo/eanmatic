import { RootState } from '@/store'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface Value {
  value: string | null
}

const initialState: Value = {
  value: null,
}

export const tokenSlice = createSlice({
  name: 'token',
  initialState,
  reducers: {
    setToken: (state, action: PayloadAction<string | null>) => {
      state.value = action.payload
    }
  }
})

export const { setToken } = tokenSlice.actions
export const tokenSelector = (state: RootState) => {
  return state.token.value
}
export default tokenSlice.reducer