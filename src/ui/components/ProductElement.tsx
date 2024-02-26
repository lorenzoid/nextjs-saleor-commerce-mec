import Link from "next/link";
import { ShoppingBagIcon } from "lucide-react";
import { cookies } from "next/headers";

import { revalidatePath } from "next/cache";
import { invariant } from "ts-invariant";
import { Tooltip } from "../atoms/Tooltip";
import { Rating } from "../atoms/Rating";
import { ProductImageWrapper } from "@/ui/atoms/ProductImageWrapper";

import { CheckoutAddLineDocument, type ProductListItemFragment } from "@/gql/graphql";
import { executeGraphQL, formatMoneyRange } from "@/lib/graphql";
import * as Checkout from "@/lib/checkout";

const shouldUseHttps =
	process.env.NEXT_PUBLIC_STOREFRONT_URL?.startsWith("https") || !!process.env.NEXT_PUBLIC_VERCEL_URL;

export function ProductElement({
	product,
	loading,
	priority,
}: { product: ProductListItemFragment } & { loading: "eager" | "lazy"; priority?: boolean }) {
	async function addItem() {
		"use server";

		const variants = product.variants || [];
		const defaultVariant = product.defaultVariant;

		const checkout = await Checkout.findOrCreate(cookies().get("checkoutId")?.value);
		invariant(checkout, "This should never happen");

		cookies().set("checkoutId", checkout.id, {
			secure: shouldUseHttps,
			sameSite: "lax",
			httpOnly: true,
		});

		await executeGraphQL(CheckoutAddLineDocument, {
			variables: {
				id: checkout.id,
				productVariantId: variants.length > 1 ? defaultVariant!.id : variants[0].id,
			},
			cache: "no-cache",
		});

		revalidatePath("/cart");
	}

	return (
		<li data-testid="ProductElement">
			<div className="product-wrapper relative">
				{product?.thumbnail?.url && (
					<Link href={`/products/${product.slug}`} key={product.id}>
						<ProductImageWrapper
							loading={loading}
							src={product.thumbnail.url}
							alt={product.thumbnail.alt ?? ""}
							width={512}
							height={512}
							sizes={"512px"}
							priority={priority}
						/>
					</Link>
				)}
				<form className="group absolute bottom-20 right-2 mb-2 mr-2" action={addItem}>
					<Tooltip text="Add to Cart">
						<button
							type="submit"
							className="add-to-cart-button rounded bg-transparent px-4 py-2 font-semibold  text-gray-500 transition duration-150 ease-in-out hover:border-transparent hover:text-gray-900"
						>
							<ShoppingBagIcon className="h-6 w-6 shrink-0" aria-hidden="true" />
						</button>
					</Tooltip>
				</form>

				<div className="mt-2 flex justify-between">
					<div>
						<h3 className="mt-1 text-sm font-semibold text-neutral-900">{product.name} hi</h3>
						<p className="mt-1 text-sm text-neutral-500" data-testid="ProductElement_Category">
							{product.category?.name}
						</p>
					</div>
					<div>
						<p
							className="mt-1 text-right text-sm font-medium text-neutral-900"
							data-testid="ProductElement_PriceRange"
						>
							{formatMoneyRange({
								start: product?.pricing?.priceRange?.start?.gross,
								stop: product?.pricing?.priceRange?.stop?.gross,
							})}
						</p>
						{product.rating ? <Rating size={16} rating={product.rating} /> : null}
					</div>
				</div>
			</div>
		</li>
	);
}
