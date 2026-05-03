"use client";

import { stripeAdapterClient } from "@payloadcms/plugin-ecommerce/payments/stripe";
import { EcommerceProvider } from "@payloadcms/plugin-ecommerce/client/react";
import { ReactNode } from "react";

export const PaymentsProvider = ({ children }: { children: ReactNode }) => {
	return (
		<EcommerceProvider
			enableVariants={true}
			api={{
				cartsFetchQuery: {
					depth: 2,
					populate: {
						products: {
							slug: true,
							title: true,
							gallery: true,
							quantities: true,
						},
						variants: {
							title: true,
						},
					},
				},
			}}
			paymentMethods={[
				stripeAdapterClient({
					publishableKey:
						process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
				}),
			]}
			syncLocalStorage={true}
			debug={true}
		>
			{children}
		</EcommerceProvider>
	);
};
