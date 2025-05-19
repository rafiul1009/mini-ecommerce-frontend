"use client"

import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { CartState } from "@/types";
import CartService from "@/services/api/cart.service";
import { setCart } from "@/store/slices/cartSlice";
import { Loader2, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CartContent() {
  const [loadingItems, setLoadingItems] = useState<number[]>([]);
  const [isClientSide, setIsClientSide] = useState(false);
  const cart = useSelector((state: { cart: CartState }) => state.cart);
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    setIsClientSide(true);
  }, []);

  const handleQuantityChange = async (productId: number, newQuantity: number) => {
    try {
      setLoadingItems(prev => [...prev, productId]);
      const cartData = {
        productId,
        quantity: newQuantity < 1 ? 0 : newQuantity
      };

      const response = await CartService.addToCart(cartData);
      dispatch(setCart(response.data));
    } catch (error) {
      console.error('Failed to update quantity:', error);
    } finally {
      setLoadingItems(prev => prev.filter(id => id !== productId));
    }
  };

  const handleCheckout = () => {
    router.push('/checkout');
  };

  if (!isClientSide) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {cart?.items?.length > 0 && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subtotal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {cart?.items?.map((item) => (
                <tr key={item.product.id}>
                  <td className="px-6 py-4">{item.product.name}</td>
                  <td className="px-6 py-4">${item.product.price.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        disabled={loadingItems.includes(item.product.id)}
                        onClick={() => handleQuantityChange(item.product.id, item.quantity - 1)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-8 text-center">
                        {loadingItems.includes(item.product.id) ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : item.quantity}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        disabled={loadingItems.includes(item.product.id)}
                        onClick={() => handleQuantityChange(item.product.id, item.quantity + 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                  <td className="px-6 py-4">${(item.product.price * item.quantity).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="px-6 py-4 bg-gray-50">
            <div className="flex justify-between items-center">
              <div className="text-lg font-semibold">Total: ${cart?.total?.toFixed(2)}</div>
              <Button
                onClick={handleCheckout}
                disabled={cart?.items?.length === 0}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Go to checkout
              </Button>
            </div>
          </div>
        </div>
      )}

      {(!cart.items || cart?.items?.length === 0) && (
        <div className="text-center py-8 text-gray-500">
          Your cart is empty
        </div>
      )}
    </div>
  );
}