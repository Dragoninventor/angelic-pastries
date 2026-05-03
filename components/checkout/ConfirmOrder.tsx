"use client";

import {
	useCart,
	usePayments,
} from "@payloadcms/plugin-ecommerce/client/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";

export const ConfirmOrder = () => {
	const { confirmOrder } = usePayments();
	const { cart } = useCart();

	const searchParams = useSearchParams();
	const router = useRouter();

	// Ensure we only confirm the order once, even if the component re-renders
	const isConfirming = useRef(false);

	useEffect(() => {
		if (!cart || !cart.items || cart.items?.length === 0) return;

		const paymentIntentID = searchParams.get("payment_intent");
		const email = searchParams.get("email");
		const notes = searchParams.get("notes");

		if (paymentIntentID) {
			if (!isConfirming.current) {
				isConfirming.current = true;

				confirmOrder("stripe", {
					additionalData: {
						paymentIntentID: paymentIntentID,
						customerEmail: email,
						notes: notes || undefined,
					},
				}).then((result) => {
					if (
						result &&
						typeof result === "object" &&
						"orderID" in result &&
						result.orderID
					) {
						router.push(
							`/orders/${result.orderID}${email ? `?email=${encodeURIComponent(email)}` : ""}`,
						);
					} else {
						router.push(`/`);
					}
				});
			}
		} else {
			router.push("/");
		}
	}, [cart, searchParams]);

	return (
		<div
			className={
				"flex w-full flex-col items-center justify-start gap-4 text-center"
			}
		>
			<h1>Confirming Your Order...</h1>
		</div>
	);
};
