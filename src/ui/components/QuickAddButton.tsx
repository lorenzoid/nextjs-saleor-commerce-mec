"use client";

import { useFormStatus } from "react-dom";
import { ShoppingBagIcon } from "lucide-react";
import { Tooltip } from "../atoms/Tooltip";

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

export function QuickAddButton() {
	const { pending } = useFormStatus();

	return (
		<div className="flex">
			{pending ? (
				<PendingLoader />
			) : (
				<Tooltip text="Add to cart">
					<button
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
