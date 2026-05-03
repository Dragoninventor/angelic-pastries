import { GlobalConfig } from "payload";

export const Delivery: GlobalConfig = {
	slug: "delivery",
	label: "Delivery",
	admin: {
		group: "Site Settings",
	},
	fields: [
		{
			type: "tabs",
			tabs: [
				{
					label: "Pickup",
					fields: [
						{
							name: "pickupAddress",
							label: "Pickup Address",
							type: "text",
							admin: {
								description:
									"The address where customers can pick up their orders. Currently unused; this field has no functionality.",
							},
						},
					],
				},
				// {
				// 	label: "Local Drop-off",
				// 	admin: {
				// 		disabled: true,
				// 	},
				// 	fields: [
				// 		{
				// 			name: "addressEligibilityMethod",
				// 			label: "Local Drop-off Location Eligibility",
				// 			type: "select",
				// 			defaultValue: "city",
				// 			options: [
				// 				{
				// 					label: "Pickup City",
				// 					value: "city",
				// 				},
				// 				{
				// 					label: "ZIP/Postal Codes Allowlist",
				// 					value: "postalCodes",
				// 				},
				// 			],
				// 			required: true,
				// 			admin: {
				// 				description:
				// 					"The method for determining which locations are eligible for local drop-offs. Filter by either city or postal code allowlist.",
				// 			},
				// 		},
				// 		// City
				// 		{
				// 			name: "pickupCity",
				// 			label: "Pickup City",
				// 			type: "text",
				// 			admin: {
				// 				condition: (_, data) =>
				// 					data?.addressEligibilityMethod === "city",
				// 			},
				// 		},
				// 		// Postal codes
				// 		{
				// 			name: "postalCodesAllowlist",
				// 			label: "Allowed Postal Codes",
				// 			type: "array",
				// 			admin: {
				// 				condition: (_, data) =>
				// 					data?.addressEligibilityMethod ===
				// 					"postalCodes",
				// 			},
				// 			fields: [
				// 				{
				// 					name: "postalCode",
				// 					label: "Postal Code",
				// 					type: "array",
				// 					admin: {
				// 						condition: (value, data) =>
				// 							data?.addressEligibilityMethod ===
				// 							"postalCodes",
				// 					},
				// 					fields: [
				// 						{
				// 							name: "postalCode",
				// 							label: "Postal Code",
				// 							type: "text",
				// 						},
				// 					],
				// 				},
				// 			],
				// 		},
				// 	],
				// },
			],
		},
	],
};
