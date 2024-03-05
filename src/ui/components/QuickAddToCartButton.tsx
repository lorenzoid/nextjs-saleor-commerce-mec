"use client";

import Link from "next/link";
import { useFormStatus } from "react-dom";
import { ShoppingBagIcon } from "lucide-react";
import { useState } from "react";
import { Tooltip } from "../atoms/Tooltip";
import { type VariantDetailsFragment, type ProductListItemFragment } from "@/gql/graphql";

const PendingLoader = () => (
	<div className="px-4 py-2">
		<svg
			className="gray-600 h-6 w-6 animate-spin"
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
		>
			<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
			<path
				className="opacity-75"
				fill="currentColor"
				d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
			></path>
		</svg>
	</div>
);

type QuickAddToCartButtonTypes = {
	product: ProductListItemFragment;
	checkoutId: string | undefined;
	variants: VariantDetailsFragment[];
};

export function QuickAddToCartButton(props: QuickAddToCartButtonTypes) {
	const { pending } = useFormStatus();

	const [showVariants, setShowVariants] = useState(false);

	const [pendingClient, setPendingClient] = useState(false);

	const { checkoutId, product, variants } = props;

	const handleShowVariants = () => {
		setShowVariants(true);
	};

	const handleAddItem = async (productVariantId: string) => {
		setPendingClient(true);

		try {
			const response = await fetch("/api/add-item", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					productVariantId,
					checkoutId: checkoutId,
				}),
			});

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
			setPendingClient(false);
			window.location.reload();
		} catch (error) {
			console.log("Error", error);
		}
	};

	const hasVariants = variants.length > 1;

	const renderVariants = () => {
		if (hasVariants) {
			return (
				<div className={`variants-container ${showVariants ? "variants-visible" : ""}`}>
					{variants.slice(0, 5).map((variant: VariantDetailsFragment) => {
						const { id, name } = variant;

						return (
							<button
								className="variants-button rounded bg-transparent px-4 py-2 text-sm font-semibold text-gray-400 transition duration-150 ease-in-out hover:text-gray-900"
								type="button"
								onClick={() => handleAddItem(id)}
								key={id}
							>
								{name}
							</button>
						);
					})}

					{variants.length > 5 && (
						<Link href={`/products/${product.slug}`}>
							<button
								className="variants-button rounded bg-transparent px-4 py-2 text-sm font-semibold text-gray-400 transition duration-150 ease-in-out hover:text-gray-900"
								type="button"
							>
								...
							</button>
						</Link>
					)}
				</div>
			);
		}
		return null;
	};

	const toggleDisplayVariants = () => {
		if (hasVariants) {
			setShowVariants(!showVariants);
		}
	};

	return (
		<div className="flex" onMouseEnter={toggleDisplayVariants} onMouseLeave={toggleDisplayVariants}>
			{showVariants && renderVariants()}

			{pending || pendingClient ? (
				<PendingLoader />
			) : (
				<Tooltip text="Add to cart">
					<button
						type={hasVariants ? "button" : "submit"}
						onClick={hasVariants ? handleShowVariants : undefined}
						aria-label="Add to cart"
						className="add-to-cart-button rounded bg-transparent px-4 py-2 font-semibold  text-gray-400 transition duration-150 ease-in-out hover:border-transparent hover:text-gray-900"
					>
						<ShoppingBagIcon className="h-6 w-6 shrink-0" aria-hidden="true" />
					</button>
				</Tooltip>
			)}
		</div>
	);
}
