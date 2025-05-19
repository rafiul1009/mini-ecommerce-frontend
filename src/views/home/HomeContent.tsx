"use client"

import { useState, useEffect, Fragment } from "react";
import ProductCard from '@/components/cards/ProductCard';
import ErrorMessage from '@/components/message/ErrorMessage';
import LoadingSkeleton from '@/components/skeleton/LoadingSkeleton';
import { ProductFormModal } from '@/views/home/ProductFormModal';
import { Product, UserState, CartState, CartItem } from "@/types";
import ProductService from "@/services/api/product.service";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ProductResponse, FilterParams, Category } from "@/types";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import CategoryService from "@/services/api/category.service";
import CartService from "@/services/api/cart.service";
import { setCart } from "@/store/slices/cartSlice";

export default function Homepage() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [isNewProduct, setIsNewProduct] = useState(false);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCounts, setTotalCounts] = useState(0);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filters, setFilters] = useState<FilterParams>({
    page: 1,
    categoryId: "",
    minPrice: "",
    maxPrice: "",
    minRating: "",
    search: ""
  });
  const [loadingCartItems, setLoadingCartItems] = useState<number[]>([]);

  const user = useSelector((state: UserState) => state.auth.user);
  const router = useRouter();
  const dispatch = useDispatch();
  const cart = useSelector((state: { cart: CartState }) => state.cart);

  const initialFilters: FilterParams = {
    page: 1,
    categoryId: "",
    minPrice: "",
    maxPrice: "",
    minRating: "",
    search: ""
  };

  const handleResetFilters = () => {
    setFilters(initialFilters);
  };

  const fetchProducts = async (params: FilterParams) => {
    try {
      setIsLoading(true);
      const response = await ProductService.getAllProducts(params);
      const data: ProductResponse = response.data;
      console.log("data", data);
      if(data) {
        setProducts(data.products);
        setTotalPages(data.pages);
        setCurrentPage(data.currentPage);
        setTotalCounts(data.count);
      } else {
        setProducts([]);
        setTotalPages(1);
        setCurrentPage(1);
        setTotalCounts(0);
      }
      setError("");
    } catch (error) {
      console.log(error);
      setError('Failed to fetch products.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToCart = async (product: Product) => {
    if (!user) {
      router.push("/login");
      return;
    }

    try {
      setLoadingCartItems(prev => [...prev, product.id]);
      // Calculate current quantity
      const currentItem = cart.items.find((item: CartItem) => item.product.id === product.id);
      const currentQuantity = currentItem ? currentItem.quantity : 0;

      const cartData = {
        productId: product.id,
        quantity: currentQuantity + 1
      }
      
      // Add one more to current quantity
      const response = await CartService.addToCart(cartData);
      const cartResponseData = response.data;
      
      // Update redux and localStorage
      dispatch(setCart(cartResponseData));
    } catch (error) {
      console.error('Failed to add to cart:', error);
    } finally {
      setLoadingCartItems(prev => prev.filter(id => id !== product.id));
    }
  };

  const handleProductEdit = (product: Product) => {
    if (user) {
      setSelectedProduct(product);
      setIsAddProductOpen(true);
    } else {
      router.push("/login");
    }
  };

  const handleProductDelete = async (product: Product) => {
    if (user && product) {
      try {
        await ProductService.deleteProduct(product.id);
        setIsNewProduct(true);
      } catch (error) {
        console.log(error);
        setIsNewProduct(false);
      }
    } else {
      router.push("/login");
    }
  };

  const handleProductEditClose = () => {
    setIsAddProductOpen(false);
    setSelectedProduct(null);
  };

  const handleFilterChange = (key: keyof FilterParams, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1 // Reset to first page when filters change
    }));
  };

  const handlePageChange = (page: number) => {
    setFilters(prev => ({
      ...prev,
      page
    }));
  };

  // Fetch categories for filter dropdown
  const fetchCategories = async () => {
    try {
      const data = await CategoryService.getAllCategories();
      if (data?.data) {
        setCategories(data.data);
      } else {
        setCategories([]);
      }
    } catch (error) {
      setCategories([]);
      console.error('Failed to fetch categories:', error);
    }
  };

  useEffect(() => {
    fetchProducts(filters);
  }, [filters]);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (isNewProduct) {
      fetchProducts(filters);
      setIsNewProduct(false);
    }
  }, [isNewProduct, filters]);

  return (
    <div className="container mx-auto px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Available Products</h1>
        {user && user.type === 'admin' &&
          <button
            onClick={() => setIsAddProductOpen(true)}
            className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md cursor-pointer"
          >
            Add Product
          </button>
        }
      </div>

      {/* Filter Section */}
      <div className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <Select
              value={filters.categoryId}
              onValueChange={(value) => handleFilterChange('categoryId', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id.toString()}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="Min Price"
              min={0}
              value={filters.minPrice}
              onChange={(e) => handleFilterChange('minPrice', e.target.value)}
            />
            <Input
              type="number"
              placeholder="Max Price"
              min={0}
              value={filters.maxPrice}
              onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
            />
          </div>

          <div>
            <Select
              value={filters.minRating}
              onValueChange={(value) => handleFilterChange('minRating', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Rating" />
              </SelectTrigger>
              <SelectContent>
                {[5, 4, 3, 2, 1].map((rating) => (
                  <SelectItem key={rating} value={rating.toString()}>
                    {rating}+ Stars
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Input
              placeholder="Search products..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
            />
          </div>

          <div>
            <Button 
              variant="default" 
              onClick={handleResetFilters}
              className="flex items-center gap-2 cursor-pointer"
            >
              Reset Filters
            </Button>
          </div>
        </div>        
      </div>

      {isLoading ? (
        <LoadingSkeleton />
      ) : error ? (
        <ErrorMessage error={error} onRetry={() => fetchProducts(filters)} />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
                onEdit={handleProductEdit}
                onDelete={handleProductDelete}
                isAddingToCart={loadingCartItems.includes(product.id)}
              />
            ))}
            {products.length === 0 && (
              <p className="col-span-3 text-center text-gray-500">
                No products available at the moment.
              </p>
            )}
          </div>

          {/* Updated Pagination */}
          {totalPages > 0 && (
            <div className="mt-8">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Showing {((currentPage - 1) * 10) + 1}-{Math.min(((currentPage - 1) * 10) + 10, totalCounts)} of {totalCounts} items
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    size="sm"
                  >
                    Previous
                  </Button>
                  
                  {totalPages <= 7 ? (
                    // Show all pages if total pages are 7 or less
                    Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        onClick={() => handlePageChange(page)}
                        size="sm"
                      >
                        {page}
                      </Button>
                    ))
                  ) : (
                    // Show truncated pagination for more than 7 pages
                    <>
                      {[
                        1,
                        currentPage - 1,
                        currentPage,
                        currentPage + 1,
                        totalPages
                      ]
                        .filter(page => page > 0 && page <= totalPages)
                        .map((page, index, array) => (
                          <Fragment key={page}>
                            {index > 0 && array[index - 1] !== page - 1 && (
                              <span className="px-2">...</span>
                            )}
                            <Button
                              variant={currentPage === page ? "default" : "outline"}
                              onClick={() => handlePageChange(page)}
                              size="sm"
                            >
                              {page}
                            </Button>
                          </Fragment>
                        ))}
                    </>
                  )}

                  <Button
                    variant="outline"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    size="sm"
                  >
                    Next
                  </Button>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {isAddProductOpen && (
        <ProductFormModal
          product={selectedProduct}
          isOpen={isAddProductOpen}
          setIsNewProduct={setIsNewProduct}
          onClose={handleProductEditClose}
        />
      )}
    </div>
  );
}
