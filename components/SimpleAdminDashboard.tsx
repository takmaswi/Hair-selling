'use client';

import React, { useState, useEffect } from 'react';
import { Product } from '@/types/database';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Edit, Trash2, Search, Package } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AdminProductForm from '@/components/AdminProductForm';

export default function SimpleAdminDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  // Form state is now handled by AdminProductForm

  // Fetch products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/products');
      const data = await response.json();
      
      if (data.success && data.products) {
        setProducts(data.products);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Filter products based on search
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle form submission
  const handleSubmit = async (productData: any) => {
    try {
      const url = editingProduct 
        ? `/api/admin/products/${editingProduct.id}`
        : '/api/admin/products';
      
      const method = editingProduct ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      });
      
      if (response.ok) {
        fetchProducts();
        setIsAddDialogOpen(false);
        setEditingProduct(null);
      }
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    try {
      const response = await fetch(`/api/admin/products/${id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        fetchProducts();
      }
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  // Handle edit
  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsAddDialogOpen(true);
  };

  // Handle dialog close
  const handleDialogClose = () => {
    setIsAddDialogOpen(false);
    setEditingProduct(null);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Product Management</h1>
        <p className="text-gray-600">Manage your Truth Hair product inventory</p>
      </div>

      {/* Controls */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button 
          onClick={() => {
            setEditingProduct(null);
            setIsAddDialogOpen(true);
          }}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Product
        </Button>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="text-center py-12">Loading products...</div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <Package className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-600">No products found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg line-clamp-1">
                    {product.name}
                  </CardTitle>
                  {product.featured && (
                    <Badge variant="secondary">Featured</Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="pb-3">
                <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                  {product.description}
                </p>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">Price:</span>
                    <span className="font-bold">${product.price}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">Stock:</span>
                    <span className={product.stock < 10 ? 'text-red-600' : ''}>
                      {product.stock} units
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">SKU:</span>
                    <span className="text-gray-600">{product.sku}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-3 gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleEdit(product)}
                  className="flex-1"
                >
                  <Edit className="h-3 w-3" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDelete(product.id)}
                  className="flex-1 text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </DialogTitle>
          </DialogHeader>
          <AdminProductForm
            product={editingProduct}
            onSubmit={handleSubmit}
            onCancel={handleDialogClose}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}