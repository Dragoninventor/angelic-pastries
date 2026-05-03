import { GlobalConfig } from "payload";

export const Business: GlobalConfig = {
	slug: "business",
	label: "Business",
	admin: {
		group: "Site Settings",
	},
	fields: [
		{
			name: "name",
			label: "Business Name",
			type: "text",
			required: true,
		},
		{
			name: "businessEmail",
			label: "Business Email",
			type: "email",
			required: true,
		},
	],
};
