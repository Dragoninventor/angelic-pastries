import { CollectionOverride } from "@payloadcms/plugin-ecommerce/types";

// const enforceCityEligibility: FieldHook = async ({ data, req, operation }) => {
// 	if (operation !== "create" && operation !== "update") return;
//
// 	const payload = await getPayload({ config: configPromise });
//
// 	const delivery = await payload.findGlobal({ slug: "delivery" });
// 	const method = delivery?.addressEligibilityMethod;
//
// 	if (method === "city") {
// 		const allowed = (delivery?.pickupCity || "").trim().toLowerCase();
// 		const provided = (data?.customerAddress?.city || "").trim().toLowerCase();
//
// 		if (!provided) throw new Error("Please provide your city for local pickup.");
// 		if (allowed && provided !== allowed) throw new Error(`Local drop-off is only available in ${delivery.pickupCity}.`)
// 	}
// };

export const Orders: CollectionOverride = ({ defaultCollection }) => ({
	...defaultCollection,
	hooks: {
		...defaultCollection.hooks,
		afterChange: [
			...(defaultCollection.hooks?.afterChange || []),
			async ({ doc, operation, req }) => {
				if (operation === "create" && doc.customerEmail) {
					try {
						await req.payload.jobs.queue({
							task: "sendOrderReceiptEmail",
							input: {
								userEmail: doc.customerEmail,
							},
						});
					} catch (error) {
						req.payload.logger.error(
							`Error queuing order receipt email: ${error}`,
						);
					}
				}
			},
		],
	},
	fields: [
		...defaultCollection.fields,
		{
			name: "notes",
			label: "Order Notes",
			type: "textarea",
			admin: {
				position: "sidebar",
			},
		},
		{
			name: "responded",
			label: "Order Responded",
			type: "checkbox",
			defaultValue: false,
			admin: {
				position: "sidebar",
			},
		},
	],
	enableQueryPresets: true,
});
