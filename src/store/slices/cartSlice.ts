import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CartState } from '@/types';
import StorageService from '@/services/app/storage.service';

const initialState: CartState = {
  items: [],
  total: 0
};

const cartSlice = createSlice({
  name: 'cart',
  initialState: StorageService.get('cart') || initialState,
  reducers: {
    setCart: (state, action: PayloadAction<CartState>) => {
      state.items = action.payload.items;
      state.total = action.payload.total;
      StorageService.set('cart', action.payload);
    },
    clearCart: (state) => {
      state.items = [];
      state.total = 0;
      StorageService.unset('cart');
    },
  },
});

export const { setCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
