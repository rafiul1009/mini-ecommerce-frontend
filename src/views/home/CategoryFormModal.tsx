"use client"

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Category } from "@/types";
import CategoryService from "@/services/api/category.service";



interface CategoryFormModalProps {
  category: Category | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (category: Category) => void;
}

export function CategoryFormModal({ category, isOpen, onClose, onSubmit }: CategoryFormModalProps) {
  const [categoryName, setCategoryName] = useState(category?.name || "");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!categoryName.trim()) {
      setError("Category name is required");
      return;
    }

    setIsSubmitting(true);
    try {
      const apiCall = category
        ? CategoryService.updateCategory(category.id, { name: categoryName })
        : CategoryService.createCategory({ name: categoryName });

      apiCall
        .then((data) => {
          if(data?.data) {
            onSubmit(data.data);
          }
          setIsSubmitting(false);
          setCategoryName("");
          setError("");
          onClose();          
        })
        .catch(error => {
          console.log(error);
          setIsSubmitting(false);
          setError("Failed to " + (category ? "update" : "add") + " category");
        });
    } catch (error) {
      console.log(error);
      setIsSubmitting(false);
    }

  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>{category ? "Edit" : "Add"} Category</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="categoryName">Category Name</Label>
            <Input
              id="categoryName"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              placeholder="Enter category name"
              className={error ? "border-red-500" : ""}
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>

          <button
            onClick={handleSubmit}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-2 rounded-md"
            disabled={isSubmitting}
          >
            {isSubmitting ? (category ? 'Updating...' : 'Adding...') : (category ? 'Update Category' : 'Add Category')}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
