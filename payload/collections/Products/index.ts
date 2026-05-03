import { slugField } from "@/payload/fields/slug";
import { CollectionOverride } from "@payloadcms/plugin-ecommerce/types";
import {
	FixedToolbarFeature,
	HeadingFeature,
	HorizontalRuleFeature,
	InlineToolbarFeature,
	lexicalEditor,
} from "@payloadcms/richtext-lexical";
import { DefaultDocumentIDType, Where } from "payload";
import { Product, VariantType } from "@/payload-types";
import { Currencies } from "@/payload/collections/Currencies";
import { amountField } from "@payloadcms/plugin-ecommerce";
import { validateWithinQuantityRange } from "@/payload/validations/validateWithinQuantityRange";
import { validateEndDateAfterStart } from "@/payload/validations/validateEndDateAfterStart";

const currency = Currencies.supportedCurrencies.find(
	(currency) => currency.code === Currencies.defaultCurrency,
);

export const Products: CollectionOverride = ({ defaultCollection }) => {
	return {
		...defaultCollection,
		admin: {
			...defaultCollection?.admin,
			useAsTitle: "title",
			defaultColumns: ["title", "content.description", "_status"],
			// preview: (doc) => {
			// 	return `${process.env.PAYLOAD_PUBLIC_SERVER_URL}/next/preview?url=${encodeURIComponent(
			// 		`${process.env.PAYLOAD_PUBLIC_SERVER_URL}/products/${doc.slug}`,
			// 	)}&secret=${process.env.PAYLOAD_PUBLIC_DRAFT_SECRET}`;
			// },
		},
		defaultPopulate: {
			...defaultCollection?.defaultPopulate,
			title: true,
			description: true,
			slug: true,
			variantOptions: true,
			variants: true,
			enableVariants: true,
			gallery: true,
			priceInUSD: true,
			meta: true,
			quantities: true,
		},
		variants: true,
		fields: [
			{
				name: "title",
				type: "text",
				required: true,
			},
			{
				type: "tabs",
				tabs: [
					// CONTENT TAB
					{
						label: "Content",
						fields: [
							{
								name: "description",
								label: "Description",
								type: "richText",
								editor: lexicalEditor({
									features: ({ rootFeatures }) => {
										return [
											...rootFeatures,
											HeadingFeature({
												enabledHeadingSizes: [
													"h1",
													"h2",
													"h3",
													"h4",
												],
											}),
											FixedToolbarFeature(),
											InlineToolbarFeature(),
											HorizontalRuleFeature(),
										];
									},
								}),
								required: true,
							},
							{
								name: "gallery",
								type: "array",
								minRows: 1,
								required: true,
								fields: [
									{
										name: "image",
										type: "upload",
										relationTo: "media",
										required: true,
									},
									{
										name: "variantOption",
										type: "relationship",
										relationTo: "variantOptions",
										admin: {
											condition: (data) => {
												return (
													data?.enableVariants ===
														true &&
													data?.variantTypes?.length >
														0
												);
											},
										},
										filterOptions: ({ data }) => {
											if (
												data?.enableVariants &&
												data?.variantTypes?.length > 0
											) {
												const variantTypeIDs =
													data.variantTypes.map(
														(item: VariantType) => {
															if (
																typeof item ===
																	"object" &&
																item?.id
															) {
																return item.id;
															}
															return item;
														},
													) as DefaultDocumentIDType[];

												if (variantTypeIDs.length === 0)
													return {
														variantType: {
															in: [],
														},
													};

												const query: Where = {
													variantType: {
														in: variantTypeIDs,
													},
												};

												return query;
											}

											return {
												variantType: {
													in: [],
												},
											};
										},
									},
								],
							},
						],
					},
					// PRODUCT DETAILS TAB
					{
						label: "Product Details",
						fields: [
							...defaultCollection.fields,
							// ...variantsFields({
							// 	variantsSlug: "variants",
							// 	variantTypesSlug: "variantTypes",
							// }),
							{
								name: "quantities",
								label: "Product Quantities",
								type: "group",
								fields: [
									{
										name: "quantityOptions",
										label: "Product Quantity Options",
										type: "number",
										hasMany: true,
										maxRows: 6,
										min: 1,
										max: 999,
										required: true,
										// Manually setting the type for the props, since payloadcms/typescript can't infer it: https://github.com/payloadcms/payload/issues/7549
										validate:
											validateWithinQuantityRange<Product>(),
										hooks: {
											beforeChange: [
												({ value }) => {
													if (
														Array.isArray(value) &&
														value.length > 0
													) {
														return [...value].sort(
															(
																a: number,
																b: number,
															) => a - b,
														);
													}

													return value;
												},
											],
										},
									},
									{
										type: "row",
										fields: [
											{
												name: "quantityMinimum",
												label: "Order Minimum Quantity",
												type: "number",
												min: 1,
												max: 999,
												required: true,
												admin: {
													width: "50%",
												},
											},
											{
												name: "quantityMaximum",
												label: "Order Maximum Quantity",
												type: "number",
												min: 1,
												max: 999,
												required: true,
												admin: {
													width: "50%",
												},
											},
										],
									},
								],
							},
							{
								name: "discounts",
								label: "Product Discounts",
								type: "array",
								fields: [
									// DISCOUNT CONDITION
									{
										type: "group",
										name: "condition",
										label: "Condition",
										admin: {
											description: `The condition that must be met for this discount to apply.`,
										},
										fields: [
											{
												name: "conditionType",
												label: false,
												type: "select",
												required: true,
												options: [
													{
														label: "Product Quantity",
														value: "productQuantity",
													},
													{
														label: "Date Range",
														value: "dateRange",
													},
												],
											},
											// Product Quantity
											{
												name: "minimumProductQuantity",
												label: "Minimum Number of Products",
												type: "number",
												required: true,
												min: 1,
												max: 999,
												admin: {
													condition: (
														_,
														siblingData,
													) => {
														return (
															siblingData?.conditionType ===
															"productQuantity"
														);
													},
												},
												validate:
													validateWithinQuantityRange<Product>(),
											},
											// Date Range
											{
												type: "row",
												fields: [
													{
														name: "startDate",
														label: "Start Date",
														type: "date",
														required: true,
													},
													{
														name: "endDate",
														label: "End Date",
														type: "date",
														required: true,
														validate:
															validateEndDateAfterStart<
																NonNullable<
																	Product["discounts"]
																>[number]["condition"]
															>(),
													},
												],
												admin: {
													condition: (
														_,
														siblingData,
													) => {
														return (
															siblingData?.conditionType ===
															"dateRange"
														);
													},
												},
											},
										],
									},

									// DISCOUNT AMOUNT
									{
										type: "group",
										name: "discountAmount",
										label: "Discount",
										admin: {
											description: `The type of discount to apply to the product, either a fixed price amount, or a percentage of the product price.`,
										},
										fields: [
											{
												name: "discountType",
												label: false,
												type: "select",
												required: true,
												options: [
													{
														label: "Percentage",
														value: "percentage",
													},
													{
														label: "Fixed Amount",
														value: "fixedAmount",
													},
												],
											},
											amountField({
												currenciesConfig: Currencies,
												overrides: {
													name: "discountFixedAmount",
													label: `Discount Amount${currency ? ` (${currency.code})` : ""}`,
													admin: {
														condition: (
															_,
															siblingData,
														) => {
															return (
																siblingData?.discountType ===
																"fixedAmount"
															);
														},
													},
												},
											}),
											{
												name: "discountPercentage",
												label: "Discount Percentage %",
												type: "number",
												required: true,
												admin: {
													condition: (
														_,
														siblingData,
													) => {
														return (
															siblingData?.discountType ===
															"percentage"
														);
													},
													placeholder: "0",
													style: {
														width: "fit-content",
													},
												},
											},
										],
									},
									// {
									// 	type: "ui",
									// 	name: "discountedPriceDisplay",
									// 	admin: {
									// 		components: {
									// 			Field: "/payload/collections/Products/ui/DiscountedPrice#DiscountedPrice",
									// 		},
									// 	},
									// },

									// DISCOUNT OPTIONS
									{
										type: "row",
										fields: [
											{
												name: `discountStacks`,
												label: "Enable discount stacking",
												type: "checkbox",
												admin: {
													description:
														"Allow this discount to stack with other product discounts.",
													width: "100%",
													style: {
														alignSelf: "center",
													},
												},
											},
										],
									},
								],
							},
							{
								name: "delivery",
								type: "group",
								fields: [
									{
										name: "deliveryMethods",
										type: "select",
										hasMany: true,
										defaultValue: "pickup",
										options: [
											{
												label: "Pickup",
												value: "pickup",
											},
											// {
											// 	label: "Local Drop-off",
											// 	value: "localDropOffs",
											// },
										],
										required: true,
										admin: {
											isSortable: true,
											description:
												'Select the "delivery" methods available for this product. Local drop-offs is currently unavailable.',
										},
									},
								],
								admin: {
									hideGutter: true,
								},
							},
							{
								name: "relatedProducts",
								type: "relationship",
								filterOptions: ({ id }) => {
									if (id) {
										return {
											id: {
												not_in: [id],
											},
										};
									}

									// ID comes back as undefined during seeding so we need to handle that case
									return {
										id: {
											exists: true,
										},
									};
								},
								hasMany: true,
								relationTo: "products",
							},
						],
					},
				],
			},
			slugField(),
		],
		versions: {
			drafts: true,
		},
	};
};
