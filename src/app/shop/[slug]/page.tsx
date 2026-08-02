import { notFound } from "next/navigation";
import { shopService } from "@/domains/shop/service.server";
import { contentService } from "@/domains/content/service.server";
import ProductDetailClient from "@/domains/shop/components/ProductDetailClient";

export default async function ProductDetailPage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  const [product, productsRaw, contactInfo] = await Promise.all([
    shopService.getBySlug(slug),
    shopService.list({ limit: 50 }),
    contentService.getContactInfo(),
  ]);

  if (!product) notFound();

  const allProducts = productsRaw.data;

  return <ProductDetailClient product={product} allProducts={allProducts} contactInfo={contactInfo} />;
}
