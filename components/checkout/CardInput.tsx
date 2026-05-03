"use client";

import { usePayments } from "@payloadcms/plugin-ecommerce/client/react";
import { CardElement } from "@stripe/react-stripe-js";
import { useEffect, useState } from "react";

export const CardInput = () => {
	const {
		confirmOrder,
		initiatePayment,
		paymentMethods,
		selectedPaymentMethod,
	} = usePayments();

	const [fontSize, setFontSize] = useState<string | undefined>();
	const CARD_ELEMENT_OPTIONS = {
		style: {
			base: {
				fontSize: fontSize,
				lineHeight: "1.5em",
				color: "#1e2939",
				"::placeholder": {
					color: "#4a5565",
				},
			},
			placeholder: {},
			invalid: {},
		},
	};

	// Input line height (1.5em) + total padding height (1rem * 2) + total border height (1px * 2)
	const minHeight = `calc(${CARD_ELEMENT_OPTIONS.style.base.lineHeight} + 2rem + 2px)`;

	useEffect(() => {
		const userFontSize = getComputedStyle(
			document.documentElement,
		).fontSize;

		setFontSize(userFontSize);
	}, []);

	return (
		<div className={"flex flex-col gap-2.5"}>
			<label className={"text-sm"} htmlFor={"payment"}>
				Payment Method
			</label>
			<div
				className={"rounded border border-gray-300 bg-gray-50 p-4"}
				style={{ minHeight: minHeight }}
			>
				{fontSize && (
					<CardElement
						id={"payment"}
						options={CARD_ELEMENT_OPTIONS}
					/>
				)}
			</div>
		</div>
	);
};
