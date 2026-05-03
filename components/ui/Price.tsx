"use client";

import { useCurrency } from "@payloadcms/plugin-ecommerce/client/react";
import { ComponentPropsWithoutRef, useMemo } from "react";
import { cn } from "@/utils/cn";

type BaseProps = {
	className?: string;
	currencyCodeClassName?: string;
	as?: "span" | "p";
};
type PriceFixed = {
	amount: number;
	currencyCode?: string;
	highestAmount?: never;
	lowestAmount?: never;
};
type PriceRange = {
	amount?: never;
	currencyCode?: string;
	highestAmount: number;
	lowestAmount: number;
};

type Props = BaseProps & (PriceFixed | PriceRange);
export const Price = ({
	amount,
	className,
	highestAmount,
	lowestAmount,
	currencyCode: currencyCodeFromProps,
	as = "p",
}: Props & ComponentPropsWithoutRef<"p">) => {
	const { formatCurrency, supportedCurrencies } = useCurrency();
	const Element = as;

	const currencyToUse = useMemo(() => {
		if (currencyCodeFromProps) {
			return supportedCurrencies.find(
				(currency) => currency.code === currencyCodeFromProps,
			);
		}

		return undefined;
	}, [currencyCodeFromProps, supportedCurrencies]);

	const defaultClassName = "tracking-wider";
	const combinedClassName = cn(defaultClassName, className);

	if (typeof amount === "number") {
		return (
			<Element className={combinedClassName} suppressHydrationWarning>
				{formatCurrency(amount, { currency: currencyToUse })}
			</Element>
		);
	}

	if (highestAmount && highestAmount !== lowestAmount) {
		return (
			<Element className={combinedClassName} suppressHydrationWarning>
				{formatCurrency(lowestAmount, { currency: currencyToUse })}–
				{formatCurrency(highestAmount, { currency: currencyToUse })}
			</Element>
		);
	}

	if (lowestAmount) {
		return (
			<Element className={combinedClassName} suppressHydrationWarning>
				{formatCurrency(lowestAmount, { currency: currencyToUse })}
			</Element>
		);
	}

	return null;
};
