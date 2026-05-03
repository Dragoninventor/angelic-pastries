import { slugField } from "@/payload/fields/slug";
import { CollectionConfig } from "payload";
import { adminOnly } from "@/payload/access/adminOnly";

export const Orders: CollectionConfig = {
	slug: "orders",
	access: {
		create: adminOnly,
		delete: adminOnly,
		read: adminOnly,
		update: adminOnly,
	},
	admin: {
		useAsTitle: "createdAt",
		defaultColumns: ["createdAt", "orderedBy", "_status"],
		preview: (doc) => {
			return `${process.env.PAYLOAD_PUBLIC_SERVER_URL}/orders/${doc.id}`;
		},
	},
	hooks: {},
	fields: [
		{
			name: "orderedBy",
			type: "relationship",
			relationTo: "users",
			hooks: {
				beforeChange: [],
			},
		},
		{
			name: "stripePaymentIntentID",
			label: "Stripe Payment Intent ID",
			type: "text",
			admin: {
				position: "sidebar",
				components: {
					// Field:
				},
			},
		},
		{
			name: "total",
			type: "number",
			required: true,
			min: 0,
		},
		// {
		// 	name: "categories",
		// 	type: "relationship",
		// 	admin: {
		// 		position: "sidebar",
		// 	},
		// 	hasMany: true,
		// 	relationTo: "categories",
		// },
		{
			name: "relatedProducts",
			type: "relationship",
			filterOptions: ({ id }) => {
				return {
					id: {
						not_in: [id],
					},
				};
			},
			hasMany: true,
			relationTo: "products",
		},
		slugField(),
	],

	versions: {
		drafts: true,
	},
};
