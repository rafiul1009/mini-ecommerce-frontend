"use client"

import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Product, UserState } from "@/types";
import { useSelector } from "react-redux";
import { Loader2 } from "lucide-react";

interface ProductCardProps {
  product: Product;
  isAddingToCart?: boolean;
  onAddToCart: (product: Product) => void;
  onEdit?: (product: Product) => void;
  onDelete?: (product: Product) => void;
}

export default function ProductCard({ product, isAddingToCart, onAddToCart, onEdit, onDelete }: ProductCardProps) {

  const user = useSelector((state: UserState) => state.auth.user)

  return (
    <Card className="hover:shadow-lg transition-shadow">

      <CardContent>
        <CardTitle>{product.name}</CardTitle>
        <CardDescription>
          <div className="font-semibold mb-2 border-b border-gray-300 pb-1 mt-4">Price: ${product.price.toFixed(2)}</div>
          <div className="font-semibold mb-2 border-b border-gray-300 pb-1 mt-4">Rating: {product.rating}</div>
          <div className="font-semibold mb-2 border-b border-gray-300 pb-1 mt-4">Category: {product.category?.name}</div>
        </CardDescription>
      </CardContent>
      <CardContent>
        <button
          onClick={() => onAddToCart(product)}
          disabled={isAddingToCart}
          className="flex items-center justify-center w-full bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md mt-2 cursor-pointer"
        >
          {isAddingToCart && (
            <span className="flex items-center justify-center mr-2">
              <Loader2 className="h-4 w-4 animate-spin" />
            </span>
          )}
          Add to Cart
        </button>
        {user && user.type === 'admin' && onEdit &&
          <button
            onClick={() => onEdit(product)}
            className="w-full bg-sky-800 text-white hover:bg-sky-800/90 px-4 py-2 rounded-md mt-2 cursor-pointer"
          >
            Edit
          </button>}
        {user && user.type === 'admin' && onDelete &&
          <button
            onClick={() => onDelete(product)}
            className="w-full bg-red-800 text-white hover:bg-red-800/90 px-4 py-2 rounded-md mt-2 cursor-pointer"
          >
            Delete
          </button>
        }
      </CardContent>
    </Card>
  );
}
