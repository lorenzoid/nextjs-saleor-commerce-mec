/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */

import type { NextApiRequest, NextApiResponse } from "next";
import cookie from "cookie";
import * as Checkout from "@/lib/checkout";
import { executeGraphQL } from "@/lib/graphql";
import { CheckoutAddLineDocument } from "@/gql/graphql";

type AddItemRequestBody = {
	productVariantId: string;
	checkoutId: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	// Only allow POST requests
	if (req.method !== "POST") {
		return res.status(405).send({ error: "Method Not Allowed" });
	}

	try {
		const { productVariantId, checkoutId } = req.body as AddItemRequestBody;

		const shouldUseHttps =
			process.env.NEXT_PUBLIC_STOREFRONT_URL?.startsWith("https") || !!process.env.NEXT_PUBLIC_VERCEL_URL;

		const reqCheckoutId = checkoutId;

		// Find or create a checkout session
		if (reqCheckoutId) {
			const checkout = await Checkout.findOrCreate(reqCheckoutId);
			if (!checkout) throw new Error("Checkout session couldn't be created or found");

			// Set or update the checkoutId cookie
			res.setHeader(
				"Set-Cookie",
				// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
				cookie.serialize("checkoutId", checkout.id, {
					path: "/",
					secure: shouldUseHttps,
					sameSite: "lax",
					httpOnly: true,
				}),
			);

			// Execute the GraphQL mutation
			await executeGraphQL(CheckoutAddLineDocument, {
				variables: {
					id: checkout.id,
					productVariantId,
				},
				cache: "no-cache",
			});
		}

		res.status(200).json({ success: true });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal Server Error" });
	}
}
