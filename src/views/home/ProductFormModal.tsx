/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import ProductService from "@/services/api/product.service";
import CategoryService from "@/services/api/category.service";
import { Product } from "@/types";
import { CategoryFormModal } from "./CategoryFormModal";
import { Category } from "@/types";
import { useToast } from "@/components/ui/use-toast";

interface ProductFormModalProps {
  product?: Product | null;
  isOpen: boolean;
  onClose: () => void;
  setIsNewProduct: (value: boolean) => void;
}

export function ProductFormModal({ product, isOpen, onClose, setIsNewProduct }: ProductFormModalProps) {
  const { toast } = useToast();
  const [productName, setProductName] = useState(product?.name || "");
  const [price, setPrice] = useState(product?.price?.toString() || "");
  const [categoryId, setCategoryId] = useState(product?.categoryId?.toString() || "");
  const [description, setDescription] = useState(product?.description || "");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(true);
  const [categoryError, setCategoryError] = useState("");

  const fetchCategories = async () => {
    try {
      setIsCategoriesLoading(true);
      const data = await CategoryService.getAllCategories();
      console.log("data", data);
      if (data?.data) {
        setCategories(data.data);
      } else {
        setCategories([]);
      }
      setCategoryError("");
    } catch (error) {
      setCategoryError("Failed to load categories");
      setCategories([]);
      console.error(error);
    } finally {
      setIsCategoriesLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!productName.trim()) {
      newErrors.productName = "Product name is required";
    }
    if (!price.trim()) {
      newErrors.price = "Price is required";
    }
    if (!categoryId) {
      newErrors.category = "Category is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const formData = {
      name: productName,
      price: parseFloat(price),
      categoryId: parseInt(categoryId),
      description
    };

    try {
      setIsSubmitting(true);
      const apiCall = product
        ? ProductService.updateProduct(product.id, formData)
        : ProductService.createProduct(formData);

      apiCall
        .then(() => {
          setIsSubmitting(false);
          setIsNewProduct(true);
          toast({
            title: "Success",
            description: `Product ${product ? 'updated' : 'created'} successfully`,
          });
          onClose();
        })
        .catch(error => {
          setIsSubmitting(false);
          setIsNewProduct(false);
          toast({
            variant: "destructive",
            title: "Error",
            description: error.message || 'Failed to save product.',
          });
        });
    } catch (error) {
      setIsSubmitting(false);
      setIsNewProduct(false);
    }
  };

  const handleNewCategory = (category: Category) => {
    setCategories([...categories, category]);
    setCategoryId(category.id.toString());
    setIsCategoryModalOpen(false);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{product ? 'Edit Product' : 'Add Product'}</DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label htmlFor="productName">Product Name</Label>
              <Input
                id="productName"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="Enter product name"
                className={errors.productName ? "border-red-500" : ""}
              />
              {errors.productName && (
                <p className="text-sm text-red-500">{errors.productName}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                type="number"
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Enter price"
                className={errors.price ? "border-red-500" : ""}
              />
              {errors.price && (
                <p className="text-sm text-red-500">{errors.price}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Category</Label>
              <div className="flex gap-2">
                <Select
                  value={categoryId}
                  onValueChange={setCategoryId}
                  disabled={isCategoriesLoading}
                >
                  <SelectTrigger className={errors.category ? "border-red-500" : ""}>
                    <SelectValue placeholder={isCategoriesLoading ? "Loading categories..." : "Select Category"} />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id.toString()}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <button
                  onClick={() => setIsCategoryModalOpen(true)}
                  className="p-2 border rounded-md hover:bg-gray-50 disabled:opacity-50"
                  disabled={isCategoriesLoading}
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              {categoryError && (
                <p className="text-sm text-red-500">{categoryError}</p>
              )}
              {errors.category && (
                <p className="text-sm text-red-500">{errors.category}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter description"
              />
            </div>

            <button
              onClick={handleSubmit}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-2 rounded-md"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </DialogContent>
      </Dialog>

      <CategoryFormModal
        category={null}
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        onSubmit={handleNewCategory}
      />
    </>
  );
}