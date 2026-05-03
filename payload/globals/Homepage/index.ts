import { GlobalConfig } from "payload";
import { adminOnly } from "@/payload/access/adminOnly";

export const Homepage: GlobalConfig = {
	slug: "homepage",
	label: "Homepage",
	admin: {
		group: "Site Settings",
	},
	access: {
		read: adminOnly,
		update: adminOnly,
	},
	fields: [
		{
			type: "group",
			label: "Hero",
			fields: [
				{
					name: "featuredProduct",
					label: "Featured Product",
					type: "relationship",
					relationTo: "products",
					required: true,
				},
				{
					name: "featuredProductBanner",
					label: "Banner Image",
					type: "upload",
					relationTo: "media",
					required: true,
				},
				{
					name: "heroContent",
					label: "Content",
					type: "richText",
					required: true,
				},
			],
		},
		// {
		// 	name: "content",
		// 	label: "Homepage Content",
		// 	type: "richText",
		// },
	],
};
