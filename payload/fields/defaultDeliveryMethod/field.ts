import { Field } from "payload";

export const DefaultDeliveryMethodField: Field = {
	name: "defaultDeliveryMethodField",
	type: "text",
	admin: {
		components: {
			Field: "/payload/fields/defaultDeliveryMethod/component",
		},
	},
};
