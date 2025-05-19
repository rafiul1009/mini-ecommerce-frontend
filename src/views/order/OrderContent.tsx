"use client"

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import LoadingSkeleton from "@/components/skeleton/LoadingSkeleton";
import AuthService from "@/services/api/auth.service";

interface OrderItemAttributes {
  id: number;
  orderId: number;
  productId: number;
  productName: string;
  productDescription: string;
  productPrice: number;
  categoryId: number;
  categoryName: string;
  quantity: number;
  price: number;
}

interface OrderAttributes {
  id: number;
  userId: number;
  total: number;
  orderItems: OrderItemAttributes[];
}

export default function OrderContent() {
  const [isLoading, setIsLoading] = useState(true);
  const [orders, setOrders] = useState<OrderAttributes[]>([]);
  const [error, setError] = useState("");

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const response = await AuthService.getUserOrders();
      setOrders(response.data);
      setError("");
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      setError("Failed to load orders");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>

      <div className="space-y-6">
        {orders.map((order) => (
          <Card key={order.id}>
            <CardHeader>
              <CardTitle className="flex justify-between">
                <span>Order #{order.id}</span>
                <span>Total: ${order.total.toFixed(2)}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {order.orderItems.map((item) => (
                      <tr key={item.id}>
                        <td className="px-6 py-4">
                          <div>
                            <div className="font-medium">{item.productName}</div>
                            <div className="text-sm text-gray-500">{item.productDescription}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4">{item.categoryName}</td>
                        <td className="px-6 py-4">{item.quantity}</td>
                        <td className="px-6 py-4">${item.productPrice.toFixed(2)}</td>
                        <td className="px-6 py-4">${item.price.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        ))}

        {orders.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            You haven&apos;t placed any orders yet.
          </div>
        )}
      </div>
    </div>
  );
}