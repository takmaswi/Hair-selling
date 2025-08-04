import { ProductDetail } from '@/components/product/ProductDetail'
import { ProductReviews } from '@/components/product/ProductReviews'
import { RelatedProducts } from '@/components/product/RelatedProducts'
import { Header } from '@/components/Header'

export default function ProductPage({ params }: { params: { slug: string } }) {
  return (
    <>
      <Header />
      <main className="min-h-screen pt-20">
        <ProductDetail slug={params.slug} />
        <ProductReviews productId={params.slug} />
        <RelatedProducts productId={params.slug} />
      </main>    </>
  )
}