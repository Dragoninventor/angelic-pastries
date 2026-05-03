import { GlobalConfig } from "payload";

export const Email: GlobalConfig = {
	slug: "email",
	label: "Email",
	admin: {
		group: "Site Settings",
	},
	fields: [
		{
			name: "businessEmail",
			label: "Email",
			type: "text",
		},
		{
			name: "emailTemplate",
			label: "Email Template",
			type: "richText",
			defaultValue: ({ user, locale, req }) => {},
		},
	],
};
