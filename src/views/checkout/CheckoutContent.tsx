"use client"

import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { CartState } from "@/types";
import { setCart } from "@/store/slices/cartSlice";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import CheckoutService from "@/services/api/checkout.service";
import { useToast } from "@/components/ui/use-toast";

export default function CheckoutContent() {
  const [isClientSide, setIsClientSide] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const cart = useSelector((state: { cart: CartState }) => state.cart);
  const dispatch = useDispatch();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    setIsClientSide(true);
  }, []);

  const handlePlaceOrder = async () => {
    try {
      setIsSubmitting(true);
      await CheckoutService.checkout();
      
      // Clear cart after successful checkout
      dispatch(setCart({ items: [], total: 0 }));
      
      toast({
        title: "Order placed successfully!",
        description: "Thank you for your order.",
      });
      
      router.push('/');
    } catch (error) {
      console.log("error", error);
      
      toast({
        variant: "destructive",
        title: "Failed to place order",
        description: "Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
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
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>
      
      {cart?.items?.length > 0 ? (
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
                  <td className="px-6 py-4">{item.quantity}</td>
                  <td className="px-6 py-4">${(item.product.price * item.quantity).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="px-6 py-4 bg-gray-50">
            <div className="flex justify-between items-center">
              <div className="text-lg font-semibold">Total: ${cart?.total?.toFixed(2)}</div>
              <Button
                onClick={handlePlaceOrder}
                disabled={isSubmitting}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Placing Order...
                  </>
                ) : (
                  'Place Order'
                )}
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          Your cart is empty
        </div>
      )}
    </div>
  );
}