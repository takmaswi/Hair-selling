'use client';

import React, { useState } from 'react';
import { Product } from '@/types/database';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

interface AdminProductFormProps {
  product?: Product | null;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

const AVAILABLE_LENGTHS = ['8', '10', '12', '14', '16', '18', '20', '22', '24', '26', '28', '30', '32'];
const COLORS = ['Natural Black', 'Dark Brown', 'Medium Brown', 'Light Brown', 'Blonde', 'Burgundy', 'Red', 'Gray', 'Ombre', 'Balayage', 'Highlighted'];
const TEXTURES = ['Straight', 'Body Wave', 'Deep Wave', 'Water Wave', 'Kinky Straight', 'Kinky Curly', 'Loose Wave', 'Jerry Curl', 'Afro Kinky'];
const ORIGINS = ['Brazilian', 'Peruvian', 'Indian', 'Malaysian', 'Vietnamese', 'Mongolian', 'European', 'Chinese'];
const DENSITIES = ['130%', '150%', '180%', '200%', '250%'];
const CAP_CONSTRUCTIONS = ['Full Lace', 'Lace Front', '360 Lace', 'U-Part', 'V-Part', 'Machine Made', 'Hand-Tied'];
const CAP_SIZES = ['Small', 'Medium', 'Large', 'Extra Large'];
const LACE_TYPES = ['Swiss Lace', 'French Lace', 'HD Lace', 'Transparent Lace', 'Medium Brown Lace'];
const PARTING_SPACES = ['Free Part', 'Middle Part', 'Side Part', 'Three Part', 'T-Part'];

export default function AdminProductForm({ product, onSubmit, onCancel }: AdminProductFormProps) {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price?.toString() || '',
    compare_at_price: product?.compare_at_price?.toString() || '',
    sku: product?.sku || '',
    stock: product?.stock?.toString() || '',
    category_id: product?.category_id || 'cat_human_hair',
    hair_type: product?.hair_type || 'HUMAN_HAIR',
    quality: product?.quality || 'STANDARD',
    inches: product?.inches || [],
    density: product?.density || '130%',
    texture: product?.texture || 'Straight',
    origin: product?.origin || 'Brazilian',
    color: product?.color || 'Natural Black',
    cap_construction: product?.cap_construction || 'Lace Front',
    cap_size: product?.cap_size || 'Medium',
    lace_type: product?.lace_type || 'HD Lace',
    parting_space: product?.parting_space || 'Free Part',
    baby_hair: product?.baby_hair || false,
    pre_plucked: product?.pre_plucked || false,
    bleached_knots: product?.bleached_knots || false,
    featured: product?.featured || false,
    is_active: product?.is_active !== undefined ? product.is_active : true,
    tags: product?.tags || []
  });

  const [newTag, setNewTag] = useState('');

  const handleLengthToggle = (length: string) => {
    const inches = formData.inches || [];
    if (inches.includes(length)) {
      setFormData({ ...formData, inches: inches.filter(l => l !== length) });
    } else {
      setFormData({ ...formData, inches: [...inches, length] });
    }
  };

  const addTag = () => {
    if (newTag && !formData.tags.includes(newTag)) {
      setFormData({ ...formData, tags: [...formData.tags, newTag] });
      setNewTag('');
    }
  };

  const removeTag = (tag: string) => {
    setFormData({ ...formData, tags: formData.tags.filter(t => t !== tag) });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const productData = {
      ...formData,
      price: parseFloat(formData.price),
      compare_at_price: formData.compare_at_price ? parseFloat(formData.compare_at_price) : null,
      stock: parseInt(formData.stock),
      slug: formData.name.toLowerCase().replace(/\s+/g, '-'),
      status: 'ACTIVE'
    };
    
    onSubmit(productData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-h-[80vh] overflow-y-auto p-1">
      {/* Basic Information */}
      <div className="space-y-4">
        <h3 className="font-semibold text-lg">Basic Information</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <Label htmlFor="name">Product Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          
          <div className="col-span-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="price">Price *</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="compare_at_price">Compare at Price</Label>
            <Input
              id="compare_at_price"
              type="number"
              step="0.01"
              value={formData.compare_at_price}
              onChange={(e) => setFormData({ ...formData, compare_at_price: e.target.value })}
            />
          </div>
          
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
            <Label htmlFor="stock">Stock *</Label>
            <Input
              id="stock"
              type="number"
              value={formData.stock}
              onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
              required
            />
          </div>
        </div>
      </div>

      {/* Hair Specifications */}
      <div className="space-y-4">
        <h3 className="font-semibold text-lg">Hair Specifications</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="category">Category</Label>
            <Select value={formData.category_id} onValueChange={(value) => setFormData({ ...formData, category_id: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cat_human_hair">Human Hair Wigs</SelectItem>
                <SelectItem value="cat_synthetic">Synthetic Wigs</SelectItem>
                <SelectItem value="cat_lace_front">Lace Front Wigs</SelectItem>
                <SelectItem value="cat_full_lace">Full Lace Wigs</SelectItem>
                <SelectItem value="cat_360_lace">360 Lace Wigs</SelectItem>
                <SelectItem value="cat_u_part">U-Part Wigs</SelectItem>
                <SelectItem value="cat_closures">Closures & Frontals</SelectItem>
                <SelectItem value="cat_bundles">Hair Bundles</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="hair_type">Hair Type</Label>
            <Select value={formData.hair_type} onValueChange={(value) => setFormData({ ...formData, hair_type: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="HUMAN_HAIR">Human Hair</SelectItem>
                <SelectItem value="SYNTHETIC">Synthetic</SelectItem>
                <SelectItem value="BLEND">Blend</SelectItem>
                <SelectItem value="HEAT_FRIENDLY">Heat Friendly</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="quality">Quality</Label>
            <Select value={formData.quality} onValueChange={(value) => setFormData({ ...formData, quality: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="BASIC">Basic</SelectItem>
                <SelectItem value="STANDARD">Standard</SelectItem>
                <SelectItem value="PREMIUM">Premium</SelectItem>
                <SelectItem value="LUXURY">Luxury</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="texture">Texture</Label>
            <Select value={formData.texture} onValueChange={(value) => setFormData({ ...formData, texture: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TEXTURES.map(texture => (
                  <SelectItem key={texture} value={texture}>{texture}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="origin">Origin</Label>
            <Select value={formData.origin} onValueChange={(value) => setFormData({ ...formData, origin: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ORIGINS.map(origin => (
                  <SelectItem key={origin} value={origin}>{origin}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="color">Color</Label>
            <Select value={formData.color} onValueChange={(value) => setFormData({ ...formData, color: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {COLORS.map(color => (
                  <SelectItem key={color} value={color}>{color}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="density">Density</Label>
            <Select value={formData.density} onValueChange={(value) => setFormData({ ...formData, density: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {DENSITIES.map(density => (
                  <SelectItem key={density} value={density}>{density}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Available Lengths */}
        <div>
          <Label>Available Lengths (inches)</Label>
          <div className="flex flex-wrap gap-2 mt-2">
            {AVAILABLE_LENGTHS.map(length => (
              <Button
                key={length}
                type="button"
                variant={formData.inches?.includes(length) ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleLengthToggle(length)}
              >
                {length}"
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Cap Construction */}
      <div className="space-y-4">
        <h3 className="font-semibold text-lg">Cap Construction</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="cap_construction">Cap Construction</Label>
            <Select value={formData.cap_construction} onValueChange={(value) => setFormData({ ...formData, cap_construction: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CAP_CONSTRUCTIONS.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="cap_size">Cap Size</Label>
            <Select value={formData.cap_size} onValueChange={(value) => setFormData({ ...formData, cap_size: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CAP_SIZES.map(size => (
                  <SelectItem key={size} value={size}>{size}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="lace_type">Lace Type</Label>
            <Select value={formData.lace_type} onValueChange={(value) => setFormData({ ...formData, lace_type: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {LACE_TYPES.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="parting_space">Parting Space</Label>
            <Select value={formData.parting_space} onValueChange={(value) => setFormData({ ...formData, parting_space: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PARTING_SPACES.map(space => (
                  <SelectItem key={space} value={space}>{space}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="space-y-4">
        <h3 className="font-semibold text-lg">Features</h3>
        
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="baby_hair"
              checked={formData.baby_hair}
              onCheckedChange={(checked) => setFormData({ ...formData, baby_hair: checked as boolean })}
            />
            <Label htmlFor="baby_hair">Baby Hair</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox
              id="pre_plucked"
              checked={formData.pre_plucked}
              onCheckedChange={(checked) => setFormData({ ...formData, pre_plucked: checked as boolean })}
            />
            <Label htmlFor="pre_plucked">Pre-Plucked Hairline</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox
              id="bleached_knots"
              checked={formData.bleached_knots}
              onCheckedChange={(checked) => setFormData({ ...formData, bleached_knots: checked as boolean })}
            />
            <Label htmlFor="bleached_knots">Bleached Knots</Label>
          </div>
          
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
            <Label htmlFor="is_active">Active (Visible on site)</Label>
          </div>
        </div>
      </div>

      {/* Tags */}
      <div className="space-y-4">
        <h3 className="font-semibold text-lg">Tags</h3>
        
        <div className="flex gap-2">
          <Input
            placeholder="Add a tag..."
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addTag();
              }
            }}
          />
          <Button type="button" onClick={addTag}>Add Tag</Button>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {formData.tags.map(tag => (
            <Badge key={tag} variant="secondary" className="flex items-center gap-1">
              {tag}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => removeTag(tag)}
              />
            </Badge>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {product ? 'Update Product' : 'Create Product'}
        </Button>
      </div>
    </form>
  );
}