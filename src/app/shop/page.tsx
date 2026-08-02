import { shopService } from "@/domains/shop/service.server";
import { contentService } from "@/domains/content/service.server";
import { ShopHero } from "@/domains/shop/components/ShopHero";
import ShopClient from "@/domains/shop/components/ShopClient";

export const metadata = {
  title: "Shop",
  description: "Browse the store with secure checkout and local shipping.",
  openGraph: { title: "Shop", description: "Official merchandise and gear", images: ["/og/shop.jpg"] },
};

export default async function ShopPage(props: { searchParams?: Promise<{ [k: string]: string | string[] }> }) {
  const searchParams = await props.searchParams;
  const page = parseInt((searchParams?.page as string) || "1", 10) || 1;
  const limit = 48;

  const [productsResult, contactInfo] = await Promise.all([
    shopService.list({ page, limit }),
    contentService.getContactInfo(),
  ]);

  const products = productsResult.data;

  return (
    <div className="overflow-x-hidden">
      <ShopHero />
      <ShopClient initialProducts={products} contactInfo={contactInfo} />

      {productsResult.total > limit && (
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex justify-between">
            {page > 1 ? <a href={`/shop?page=${page - 1}`} className="text-xs text-brand">Previous</a> : <div />}
            {page * limit < productsResult.total ? <a href={`/shop?page=${page + 1}`} className="text-xs text-brand">Next</a> : <div />}
          </div>
        </div>
      )}
    </div>
  );
}
