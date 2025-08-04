'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Product,
  Category,
  HairType,
  QualityLevel,
  ProductStatus,
  CreateProductDto,
  UpdateProductDto,
  AdminProductFilter,
  PREDEFINED_TAGS,
  TagCategory,
  AVAILABLE_LENGTHS,
} from '@/types/database';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/alert';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Filter, 
  X, 
  Package,
  CheckCircle,
  XCircle,
  Star,
  AlertCircle,
  Loader2
} from 'lucide-react';

interface AdminProductDashboardProps {
  initialCategories?: Category[];
}

export default function AdminProductDashboard({ initialCategories = [] }: AdminProductDashboardProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Filter states
  const [filters, setFilters] = useState<AdminProductFilter>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilterCount, setActiveFilterCount] = useState(0);
  
  // Dialog states
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProductId, setDeletingProductId] = useState<string | null>(null);
  
  // Form states
  const [formData, setFormData] = useState<Partial<CreateProductDto>>({
    name: '',
    slug: '',
    description: '',
    price: 0,
    sku: '',
    category_id: '',
    hair_type: HairType.HUMAN_HAIR,
    quality: QualityLevel.STANDARD,
    inches: [],
    density: '130%',
    texture: 'Straight',
    origin: 'Brazilian',
    is_active: true,
    stock: 0,
    featured: false,
    status: ProductStatus.ACTIVE,
    tags: [],
  });

  // Fetch products
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const params = new URLSearchParams();
      
      // Add filters to params
      if (searchTerm) params.append('search', searchTerm);
      if (filters.category) params.append('category', filters.category);
      if (filters.hair_type) params.append('hair_type', filters.hair_type);
      if (filters.quality) params.append('quality', filters.quality);
      if (filters.featured !== undefined) params.append('featured', filters.featured.toString());
      if (filters.is_active !== undefined) params.append('is_active', filters.is_active.toString());
      if (filters.sortBy) params.append('sortBy', filters.sortBy);
      if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);
      
      const response = await fetch(`/api/admin/products?${params.toString()}`);
      const data = await response.json();
      
      console.log('Admin API Response:', data); // Debug log
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch products');
      }
      
      const productsToSet = data.products || data.data || [];
      console.log('Setting products:', productsToSet.length); // Debug log
      setProducts(productsToSet);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  }, [searchTerm, filters]);

  // Fetch categories if not provided
  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/products?options=true');
      const data = await response.json();
      if (data.categories) {
        setCategories(data.categories);
      }
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  };

  useEffect(() => {
    fetchProducts();
    if (categories.length === 0) {
      fetchCategories();
    }
  }, [fetchProducts, categories.length]);

  // Debug logging
  useEffect(() => {
    console.log('Current products state:', products.length, products);
    console.log('Loading state:', loading);
    console.log('Error state:', error);
  }, [products, loading, error]);

  // Count active filters
  useEffect(() => {
    let count = 0;
    if (filters.category) count++;
    if (filters.hair_type) count++;
    if (filters.quality) count++;
    if (filters.featured !== undefined) count++;
    if (filters.is_active !== undefined) count++;
    setActiveFilterCount(count);
  }, [filters]);

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const url = editingProduct 
        ? `/api/admin/products/${editingProduct.id}`
        : '/api/admin/products';
      
      const method = editingProduct ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to save product');
      }
      
      setSuccess(editingProduct ? 'Product updated successfully!' : 'Product created successfully!');
      setIsAddDialogOpen(false);
      setEditingProduct(null);
      resetForm();
      fetchProducts();
      
      setTimeout(() => setSuccess(null), 5000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  // Handle delete
  const handleDelete = async (productId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete product');
      }
      
      setSuccess('Product deleted successfully!');
      setDeletingProductId(null);
      fetchProducts();
      
      setTimeout(() => setSuccess(null), 5000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete product');
    } finally {
      setLoading(false);
    }
  };

  // Handle edit
  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      slug: product.slug,
      description: product.description,
      price: product.price,
      compare_at_price: product.compare_at_price || undefined,
      sku: product.sku,
      category_id: product.category_id,
      hair_type: product.hair_type,
      quality: product.quality,
      inches: product.inches || [],
      density: product.density || '130%',
      texture: product.texture || 'Straight',
      origin: product.origin || 'Brazilian',
      is_active: product.is_active,
      stock: product.stock,
      featured: product.featured,
      status: product.status,
      tags: product.tags || [],
      seo_title: product.seo_title || undefined,
      seo_description: product.seo_description || undefined,
    });
    setIsAddDialogOpen(true);
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      slug: '',
      description: '',
      price: 0,
      sku: '',
      category_id: '',
      hair_type: HairType.HUMAN_HAIR,
      quality: QualityLevel.STANDARD,
      inches: [],
      density: '130%',
      texture: 'Straight',
      origin: 'Brazilian',
      is_active: true,
      stock: 0,
      featured: false,
      status: ProductStatus.ACTIVE,
      tags: [],
    });
    setEditingProduct(null);
  };

  // Clear filters
  const clearFilters = () => {
    setFilters({});
    setSearchTerm('');
  };

  // Generate slug from name
  const generateSlug = (name: string) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  };

  // Handle length checkbox change
  const handleLengthChange = (length: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      inches: checked 
        ? [...(prev.inches || []), length]
        : (prev.inches || []).filter(l => l !== length)
    }));
  };

  // Handle tag checkbox change
  const handleTagChange = (tag: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      tags: checked 
        ? [...(prev.tags || []), tag]
        : (prev.tags || []).filter(t => t !== tag)
    }));
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Product Management</h1>
          <p className="text-gray-600 mt-1">Manage your Truth Hair product inventory</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { resetForm(); setIsAddDialogOpen(true); }}>
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>{editingProduct ? 'Edit Product' : 'Add New Product'}</DialogTitle>
                <DialogDescription>
                  {editingProduct ? 'Update product details' : 'Create a new product in your inventory'}
                </DialogDescription>
              </DialogHeader>
              
              <Tabs defaultValue="basic" className="mt-6">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="basic">Basic Info</TabsTrigger>
                  <TabsTrigger value="hair">Hair Details</TabsTrigger>
                  <TabsTrigger value="tags">Tags & Features</TabsTrigger>
                  <TabsTrigger value="inventory">Inventory</TabsTrigger>
                </TabsList>
                
                {/* Basic Info Tab */}
                <TabsContent value="basic" className="space-y-4">
                  <div>
                    <Label htmlFor="name">Product Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => {
                        setFormData({ ...formData, name: e.target.value });
                        if (!editingProduct) {
                          setFormData(prev => ({ ...prev, slug: generateSlug(e.target.value) }));
                        }
                      }}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="slug">URL Slug *</Label>
                    <Input
                      id="slug"
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={4}
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="price">Price *</Label>
                      <Input
                        id="price"
                        type="number"
                        step="0.01"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="compare_at_price">Compare at Price</Label>
                      <Input
                        id="compare_at_price"
                        type="number"
                        step="0.01"
                        value={formData.compare_at_price || ''}
                        onChange={(e) => setFormData({ ...formData, compare_at_price: parseFloat(e.target.value) || undefined })}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="sku">SKU *</Label>
                      <Input
                        id="sku"
                        value={formData.sku}
                        onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="category">Category *</Label>
                      <Select
                        value={formData.category_id}
                        onValueChange={(value) => setFormData({ ...formData, category_id: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map(cat => (
                            <SelectItem key={cat.id} value={cat.id}>
                              {cat.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </TabsContent>
                
                {/* Hair Details Tab */}
                <TabsContent value="hair" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="hair_type">Hair Type *</Label>
                      <Select
                        value={formData.hair_type}
                        onValueChange={(value) => setFormData({ ...formData, hair_type: value as HairType })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={HairType.HUMAN_HAIR}>Human Hair</SelectItem>
                          <SelectItem value={HairType.SYNTHETIC}>Synthetic</SelectItem>
                          <SelectItem value={HairType.BLEND}>Blend</SelectItem>
                          <SelectItem value={HairType.HEAT_FRIENDLY}>Heat Friendly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="quality">Quality Level *</Label>
                      <Select
                        value={formData.quality}
                        onValueChange={(value) => setFormData({ ...formData, quality: value as QualityLevel })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={QualityLevel.BASIC}>Basic</SelectItem>
                          <SelectItem value={QualityLevel.STANDARD}>Standard</SelectItem>
                          <SelectItem value={QualityLevel.PREMIUM}>Premium</SelectItem>
                          <SelectItem value={QualityLevel.LUXURY}>Luxury</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="density">Density</Label>
                      <Input
                        id="density"
                        value={formData.density}
                        onChange={(e) => setFormData({ ...formData, density: e.target.value })}
                        placeholder="e.g., 130%"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="texture">Texture</Label>
                      <Input
                        id="texture"
                        value={formData.texture}
                        onChange={(e) => setFormData({ ...formData, texture: e.target.value })}
                        placeholder="e.g., Straight"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="origin">Origin</Label>
                      <Input
                        id="origin"
                        value={formData.origin}
                        onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                        placeholder="e.g., Brazilian"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label>Available Lengths</Label>
                    <div className="grid grid-cols-6 gap-3 mt-2">
                      {AVAILABLE_LENGTHS.map(length => (
                        <div key={length} className="flex items-center space-x-2">
                          <Checkbox
                            id={`length-${length}`}
                            checked={formData.inches?.includes(length)}
                            onCheckedChange={(checked) => handleLengthChange(length, checked as boolean)}
                          />
                          <Label htmlFor={`length-${length}`} className="text-sm cursor-pointer">
                            {length}"
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>
                
                {/* Tags & Features Tab */}
                <TabsContent value="tags" className="space-y-4">
                  {Object.entries(PREDEFINED_TAGS).map(([category, tags]) => (
                    <div key={category}>
                      <Label className="text-base font-semibold mb-2">{category.replace(/_/g, ' ')}</Label>
                      <div className="grid grid-cols-3 gap-3 mt-2">
                        {tags.map(tag => (
                          <div key={tag.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={`tag-${tag.id}`}
                              checked={formData.tags?.includes(tag.slug)}
                              onCheckedChange={(checked) => handleTagChange(tag.slug, checked as boolean)}
                            />
                            <Label htmlFor={`tag-${tag.id}`} className="text-sm cursor-pointer">
                              {tag.name}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </TabsContent>
                
                {/* Inventory Tab */}
                <TabsContent value="inventory" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="stock">Stock Quantity *</Label>
                      <Input
                        id="stock"
                        type="number"
                        value={formData.stock}
                        onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) })}
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="status">Product Status</Label>
                      <Select
                        value={formData.status}
                        onValueChange={(value) => setFormData({ ...formData, status: value as ProductStatus })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={ProductStatus.ACTIVE}>Active</SelectItem>
                          <SelectItem value={ProductStatus.INACTIVE}>Inactive</SelectItem>
                          <SelectItem value={ProductStatus.OUT_OF_STOCK}>Out of Stock</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="featured"
                        checked={formData.featured}
                        onCheckedChange={(checked) => setFormData({ ...formData, featured: checked as boolean })}
                      />
                      <Label htmlFor="featured">Featured Product</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="is_active"
                        checked={formData.is_active}
                        onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked as boolean })}
                      />
                      <Label htmlFor="is_active">Active</Label>
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="seo_title">SEO Title</Label>
                    <Input
                      id="seo_title"
                      value={formData.seo_title || ''}
                      onChange={(e) => setFormData({ ...formData, seo_title: e.target.value })}
                      placeholder="Optional SEO title"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="seo_description">SEO Description</Label>
                    <Textarea
                      id="seo_description"
                      value={formData.seo_description || ''}
                      onChange={(e) => setFormData({ ...formData, seo_description: e.target.value })}
                      rows={3}
                      placeholder="Optional SEO description"
                    />
                  </div>
                </TabsContent>
              </Tabs>
              
              <DialogFooter className="mt-6">
                <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {editingProduct ? 'Update Product' : 'Create Product'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Alerts */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {success && (
        <Alert className="border-green-200 bg-green-50 text-green-900">
          <CheckCircle className="h-4 w-4" />
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      {/* Filters Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
            {activeFilterCount > 0 && (
              <Badge variant="secondary">{activeFilterCount} active</Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search products by name or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          {/* Filter Options */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <Select
              value={filters.category || 'all'}
              onValueChange={(value) => setFilters({ ...filters, category: value === 'all' ? undefined : value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(cat => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select
              value={filters.hair_type || 'all'}
              onValueChange={(value) => setFilters({ ...filters, hair_type: value === 'all' ? undefined : value as HairType })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Hair Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value={HairType.HUMAN_HAIR}>Human Hair</SelectItem>
                <SelectItem value={HairType.SYNTHETIC}>Synthetic</SelectItem>
                <SelectItem value={HairType.BLEND}>Blend</SelectItem>
                <SelectItem value={HairType.HEAT_FRIENDLY}>Heat Friendly</SelectItem>
              </SelectContent>
            </Select>
            
            <Select
              value={filters.quality || 'all'}
              onValueChange={(value) => setFilters({ ...filters, quality: value === 'all' ? undefined : value as QualityLevel })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Quality" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Qualities</SelectItem>
                <SelectItem value={QualityLevel.BASIC}>Basic</SelectItem>
                <SelectItem value={QualityLevel.STANDARD}>Standard</SelectItem>
                <SelectItem value={QualityLevel.PREMIUM}>Premium</SelectItem>
                <SelectItem value={QualityLevel.LUXURY}>Luxury</SelectItem>
              </SelectContent>
            </Select>
            
            <Select
              value={filters.featured === undefined ? 'all' : filters.featured.toString()}
              onValueChange={(value) => setFilters({ ...filters, featured: value === 'all' ? undefined : value === 'true' })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Featured" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Products</SelectItem>
                <SelectItem value="true">Featured Only</SelectItem>
                <SelectItem value="false">Non-Featured</SelectItem>
              </SelectContent>
            </Select>
            
            <Select
              value={filters.is_active === undefined ? 'all' : filters.is_active.toString()}
              onValueChange={(value) => setFilters({ ...filters, is_active: value === 'all' ? undefined : value === 'true' })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="true">Active</SelectItem>
                <SelectItem value="false">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Clear Filters */}
          {(activeFilterCount > 0 || searchTerm) && (
            <Button variant="outline" onClick={clearFilters} className="w-full">
              <X className="mr-2 h-4 w-4" />
              Clear All Filters
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Products Grid */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : products.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center h-64">
            <Package className="h-12 w-12 text-gray-400 mb-4" />
            <p className="text-lg font-medium text-gray-900">No products found</p>
            <p className="text-gray-500 mt-1">Try adjusting your filters or add a new product</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="relative group">
              <CardHeader>
                <div className="aspect-square bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
                  <Package className="h-16 w-16 text-gray-400" />
                </div>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg line-clamp-1">{product.name}</CardTitle>
                  <div className="flex gap-1">
                    {product.is_active ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
                    {product.featured && (
                      <Star className="h-5 w-5 text-yellow-500 fill-current" />
                    )}
                  </div>
                </div>
                <CardDescription className="line-clamp-2 mt-2">
                  {product.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold">${product.price}</span>
                  {product.compare_at_price && (
                    <span className="text-sm text-gray-500 line-through">
                      ${product.compare_at_price}
                    </span>
                  )}
                </div>
                
                <div className="flex gap-2 text-sm">
                  <Badge variant="secondary">{product.hair_type.replace(/_/g, ' ')}</Badge>
                  <Badge variant="outline">{product.quality}</Badge>
                </div>
                
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Stock: {product.stock}</span>
                  <span className="text-gray-600">SKU: {product.sku}</span>
                </div>
                
                {product.tags && product.tags.length > 0 && (
                  <div className="flex gap-1 flex-wrap">
                    {product.tags.slice(0, 3).map((tag, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {product.tags.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{product.tags.length - 3}
                      </Badge>
                    )}
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => handleEdit(product)}
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="sm" className="flex-1 text-red-600 hover:text-red-700">
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Product</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete "{product.name}"? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(product.id)}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}