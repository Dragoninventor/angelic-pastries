"use client";

import { useCart } from "@payloadcms/plugin-ecommerce/client/react";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";
import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import Link from "next/link";
import { CheckoutOrder } from "@/components/checkout/CheckoutOrder";
import { Elements } from "@stripe/react-stripe-js";

const apiKey = `${process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY}`;
const stripe = loadStripe(apiKey);

export const CheckoutPage = () => {
	const { cart } = useCart();
	const [error, setError] = useState<null | string>(null);
	const cartIsEmpty = !cart || !cart.items || !cart.items.length;

	// My stuff
	const [addNote, setAddNote] = useState(false);
	const [orderNote, setOrderNote] = useState("");
	const [fulfillment, setFulfillment] = useState<"delivery" | "pickup">(
		"pickup",
	);

	if (!stripe) return null;

	if (cartIsEmpty) {
		return (
			<div className={"flex flex-col items-center rounded p-4"}>
				<p className={"mb-2 text-lg"}>Your cart is empty.</p>
				<Link href={"/"} className={"underline"}>
					Continue Shopping?
				</Link>
			</div>
		);
	}

	return (
		<section
			className={
				"my-8 flex grow flex-col items-stretch justify-stretch gap-10 md:gap-6 lg:flex-row lg:gap-8"
			}
		>
			<Elements stripe={stripe}>
				<CheckoutForm />
			</Elements>
			<CheckoutOrder />
		</section>
	);
};
