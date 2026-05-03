"use client";

import { CardInput } from "@/components/checkout/CardInput";
import { FormInput } from "@/components/ui/form/FormInput";
import { Form } from "@/components/ui/form/Form";
import { SyntheticEvent, useCallback, useState } from "react";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useRouter } from "next/navigation";
import {
	useCart,
	usePayments,
} from "@payloadcms/plugin-ecommerce/client/react";
import { Button } from "@/components/ui/button";
import { OrderNote } from "@/components/checkout/OrderNote";
import { updateOrder } from "@/actions/updateOrder";

export const CheckoutForm = () => {
	const stripe = useStripe();
	const router = useRouter();
	const [error, setError] = useState<null | string>(null);
	const [paymentData, setPaymentData] = useState<null | Record<
		string,
		unknown
	>>(null);
	const { confirmOrder, initiatePayment } = usePayments();
	const elements = useElements();
	const { clearCart } = useCart();

	const [email, setEmail] = useState("");
	const [orderNote, setOrderNote] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [isProcessingPayment, setProcessingPayment] = useState(false);

	const cardElement = elements?.getElement(CardElement);

	const handleSubmit = useCallback(
		async (event: SyntheticEvent<HTMLFormElement>) => {
			event.preventDefault();

			setIsLoading(true);
			setProcessingPayment(true);

			if (stripe && cardElement) {
				try {
					const returnUrl = `${process.env.NEXT_PUBLIC_SERVER_URL}/checkout/confirm-order?email=${encodeURIComponent(email)}`;

					// 1. Create the payment intent
					const paymentData = (await initiatePayment("stripe", {
						additionalData: {
							customerEmail: email,
						},
					})) as Record<string, unknown>;

					if (paymentData) {
						setPaymentData(paymentData);
					}

					const clientSecret =
						paymentData &&
						typeof paymentData.clientSecret === "string"
							? paymentData.clientSecret
							: null;

					if (!clientSecret) {
						setError(
							"Unable to initiate payment. Please try again or contact support.",
						);
						setIsLoading(false);
						setProcessingPayment(false);

						return;
					}

					// 2. Confirm the payment with the newly created client secret
					const { error: stripeError, paymentIntent } =
						await stripe.confirmCardPayment(clientSecret, {
							payment_method: {
								card: cardElement,
								billing_details: {
									email: email,
								},
							},
							receipt_email: email,
							return_url: returnUrl,
						});

					if (paymentIntent && paymentIntent.status === "succeeded") {
						try {
							const confirmResult = await confirmOrder("stripe", {
								additionalData: {
									paymentIntentID: paymentIntent.id,
									customerEmail: email,
								},
							});

							if (
								confirmResult &&
								typeof confirmResult === "object" &&
								"orderID" in confirmResult &&
								typeof confirmResult.orderID === "string"
							) {
								const orderID = confirmResult.orderID;

								await updateOrder(orderID, {
									notes: orderNote,
								});

								const redirectUrl = `/orders/${orderID}${email ? `?email=${encodeURIComponent(email)}` : ""}`;

								void clearCart();

								router.push(redirectUrl);
							}
						} catch (error) {
							console.error({ error: error });

							const msg =
								error instanceof Error
									? error.message
									: "Something went wrong.";

							setError(`Error while confirming order: ${msg}`);
							setIsLoading(false);
						}
					}

					if (stripeError?.message) {
						setError(stripeError.message);
						setIsLoading(false);
					}
				} catch (error) {
					const msg =
						error instanceof Error
							? error.message
							: "Something went wrong.";

					setError(`Error while submitting payment: ${msg}`);
					setIsLoading(false);
					setProcessingPayment(false);
				}
			}
		},
		[
			setProcessingPayment,
			stripe,
			elements,
			email,
			orderNote,
			confirmOrder,
			initiatePayment,
			clearCart,
			router,
		],
	);

	if (!stripe) return null;

	return (
		<Form
			onSubmit={(event) => {
				event.preventDefault();

				void handleSubmit(event);
			}}
			className={
				"flex basis-full flex-col justify-stretch gap-8 lg:basis-2/3"
			}
		>
			<FormInput
				type={"email"}
				id={"email"}
				label={"Email Address"}
				placeholder={"Enter your email"}
				value={email}
				onChange={(e) => setEmail(e.target.value)}
				required
			/>
			<CardInput />
			<OrderNote orderNote={orderNote} setOrderNote={setOrderNote} />
			{error && (
				<p className="text-sm text-red-600" role="alert">
					{error}
				</p>
			)}
			<div className="flex gap-2">
				<Button
					type="submit"
					variant={"vibrant"}
					size={"lg"}
					disabled={
						isLoading || isProcessingPayment || !stripe || !elements
					}
				>
					{isProcessingPayment ? "Processing..." : "Checkout"}
				</Button>
			</div>
		</Form>
	);
};
