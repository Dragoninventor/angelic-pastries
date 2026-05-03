import { CollectionConfig } from "payload";
import { amountField } from "@payloadcms/plugin-ecommerce";
import { Currencies } from "@/payload/collections/Currencies";
import { Discount } from "@/payload-types";
import { validateEndDateAfterStart } from "@/payload/validations/validateEndDateAfterStart";

const currency = Currencies.supportedCurrencies.find(
	(currency) => currency.code === Currencies.defaultCurrency,
);

export const Discounts: CollectionConfig = {
	slug: "discounts",
	admin: {
		useAsTitle: "name",
		defaultColumns: ["name", "code", "type", "active"],
		group: "Ecommerce",
	},
	fields: [
		{
			name: "name",
			type: "text",
			required: true,
		},
		{
			name: "code",
			type: "text",
			admin: {
				description:
					"Optional promo code that can be applied at checkout.",
			},
		},
		{
			name: "active",
			type: "checkbox",
			defaultValue: true,
		},
		{
			name: "type",
			type: "select",
			defaultValue: "orderTotal",
			required: true,
			options: [{ label: "Order Total", value: "orderTotal" }],
		},
		amountField({
			currenciesConfig: Currencies,
			overrides: {
				name: "minOrderAmount",
				label: `Minimum Order Amount${currency ? ` (${currency.code})` : ""}`,
				admin: {
					condition: (data) => data.type === "orderTotal",
					description:
						"The minimum order amount required for this discount to apply.",
				},
			},
		}),
		{
			type: "row",
			fields: [
				{
					name: "discountType",
					type: "select",
					defaultValue: "percentage",
					required: true,
					options: [
						{ label: "Percentage", value: "percentage" },
						{ label: "Fixed Amount", value: "fixedAmount" },
					],
				},
				{
					name: "discountPercentage",
					type: "number",
					admin: {
						condition: (data) => data.discountType === "percentage",
					},
				},
				amountField({
					currenciesConfig: Currencies,
					overrides: {
						name: "discountFixedAmount",
						label: `Discount Amount${currency ? ` (${currency.code})` : ""}`,
						admin: {
							condition: (data) =>
								data.discountType === "fixedAmount",
						},
					},
				}),
			],
		},
		{
			type: "row",
			fields: [
				{
					name: "startDate",
					type: "date",
					admin: {
						width: "50%",
					},
				},
				{
					name: "endDate",
					type: "date",
					admin: {
						width: "50%",
					},
					validate: validateEndDateAfterStart<Discount>(),
				},
			],
		},
	],
};
