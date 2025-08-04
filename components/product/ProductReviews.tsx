'use client'

import { useState } from 'react'
import { Star, ThumbsUp, Filter, Camera } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { motion } from 'framer-motion'
import Image from 'next/image'

// Mock reviews data
const mockReviews = [
  {
    id: '1',
    author: 'Sarah M.',
    rating: 5,
    date: '2024-01-15',
    verified: true,
    title: 'Absolutely love it!',
    comment: 'This wig exceeded all my expectations. The quality is incredible and it looks so natural. I get compliments everywhere I go!',
    helpful: 23,
    images: ['/assets/good-faces-LKBuzE5A8pk-unsplash.jpg'],
  },
  {
    id: '2',
    author: 'Jennifer L.',
    rating: 4,
    date: '2024-01-10',
    verified: true,
    title: 'Great quality, minor adjustment needed',
    comment: 'The hair quality is amazing and the lace is very soft. I had to pluck the hairline a bit more for my preference, but overall very happy with my purchase.',
    helpful: 15,
    images: [],
  },
  {
    id: '3',
    author: 'Maria G.',
    rating: 5,
    date: '2024-01-05',
    verified: true,
    title: 'My go-to wig!',
    comment: 'I\'ve purchased multiple wigs from Truth Hair and this one is by far my favorite. The curls hold beautifully and it\'s so comfortable to wear all day.',
    helpful: 31,
    images: ['/assets/temitayo-olatoke-SwzA90mEb_E-unsplash.jpg', '/assets/shedrack-salami-If2zeZ1ln3w-unsplash.jpg'],
  },
]

const ratingDistribution = {
  5: 78,
  4: 15,
  3: 5,
  2: 1,
  1: 1,
}

export function ProductReviews({ productId }: { productId: string }) {
  const [sortBy, setSortBy] = useState('most-helpful')
  const [filterRating, setFilterRating] = useState<number | null>(null)
  const [showWriteReview, setShowWriteReview] = useState(false)
  const [newRating, setNewRating] = useState(5)

  const totalReviews = Object.values(ratingDistribution).reduce((a, b) => a + b, 0)
  const averageRating = 4.8 // Calculate from actual reviews

  return (
    <section className="py-12 border-t">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-playfair mb-8">Customer Reviews</h2>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Rating Summary */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="text-center mb-6">
                <div className="text-4xl font-bold mb-2">{averageRating}</div>
                <div className="flex justify-center mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(averageRating)
                          ? 'fill-champagne text-champagne'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-sm text-gray-600">Based on {totalReviews} reviews</p>
              </div>

              {/* Rating Distribution */}
              <div className="space-y-2">
                {Object.entries(ratingDistribution)
                  .reverse()
                  .map(([rating, count]) => (
                    <button
                      key={rating}
                      onClick={() => setFilterRating(parseInt(rating))}
                      className="w-full flex items-center gap-2 hover:bg-gray-100 p-2 rounded transition"
                    >
                      <span className="text-sm w-3">{rating}</span>
                      <Star className="w-4 h-4 fill-champagne text-champagne" />
                      <Progress
                        value={(count / totalReviews) * 100}
                        className="flex-1 h-2"
                      />
                      <span className="text-sm text-gray-600 w-10 text-right">
                        {count}
                      </span>
                    </button>
                  ))}
              </div>

              <Dialog open={showWriteReview} onOpenChange={setShowWriteReview}>
                <DialogTrigger asChild>
                  <Button className="w-full mt-6">Write a Review</Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg">
                  <DialogHeader>
                    <DialogTitle>Write a Review</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 mt-4">
                    <div>
                      <Label>Rating</Label>
                      <div className="flex gap-1 mt-2">
                        {[...Array(5)].map((_, i) => (
                          <button
                            key={i}
                            onClick={() => setNewRating(i + 1)}
                            className="p-1"
                          >
                            <Star
                              className={`w-6 h-6 ${
                                i < newRating
                                  ? 'fill-champagne text-champagne'
                                  : 'text-gray-300'
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="review-title">Title</Label>
                      <input
                        id="review-title"
                        type="text"
                        className="w-full mt-1 px-3 py-2 border rounded-md"
                        placeholder="Sum up your experience"
                      />
                    </div>
                    <div>
                      <Label htmlFor="review-comment">Review</Label>
                      <Textarea
                        id="review-comment"
                        rows={4}
                        placeholder="Tell us about your experience with this product"
                      />
                    </div>
                    <div>
                      <Label>Photos (optional)</Label>
                      <div className="mt-2 border-2 border-dashed rounded-lg p-4 text-center">
                        <Camera className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                        <p className="text-sm text-gray-600">
                          Click to upload photos
                        </p>
                      </div>
                    </div>
                    <Button className="w-full">Submit Review</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Reviews List */}
          <div className="lg:col-span-2">
            {/* Filters */}
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-medium">All Reviews ({totalReviews})</h3>
              <div className="flex gap-2">
                {filterRating && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setFilterRating(null)}
                  >
                    Clear filter
                  </Button>
                )}
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="most-helpful">Most Helpful</SelectItem>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="oldest">Oldest</SelectItem>
                    <SelectItem value="highest">Highest Rated</SelectItem>
                    <SelectItem value="lowest">Lowest Rated</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Reviews */}
            <div className="space-y-6">
              {mockReviews
                .filter(review => !filterRating || review.rating === filterRating)
                .map((review) => (
                  <motion.div
                    key={review.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border-b pb-6 last:border-0"
                  >
                    <div className="flex items-start gap-4">
                      <Avatar>
                        <AvatarFallback>{review.author[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{review.author}</span>
                              {review.verified && (
                                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">
                                  Verified Purchase
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-4 h-4 ${
                                      i < review.rating
                                        ? 'fill-champagne text-champagne'
                                        : 'text-gray-300'
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="text-sm text-gray-500">
                                {new Date(review.date).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>

                        <h4 className="font-medium mb-2">{review.title}</h4>
                        <p className="text-gray-600 mb-4">{review.comment}</p>

                        {review.images.length > 0 && (
                          <div className="flex gap-2 mb-4">
                            {review.images.map((image, index) => (
                              <div
                                key={index}
                                className="relative w-20 h-20 rounded overflow-hidden cursor-pointer"
                              >
                                <Image
                                  src={image}
                                  alt={`Review image ${index + 1}`}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            ))}
                          </div>
                        )}

                        <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900">
                          <ThumbsUp className="w-4 h-4" />
                          Helpful ({review.helpful})
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
            </div>

            {/* Load More */}
            <div className="text-center mt-8">
              <Button variant="outline">Load More Reviews</Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}