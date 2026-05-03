import { CollectionOverride } from "@payloadcms/plugin-ecommerce/types";
import { publicAccess } from "@/payload/access/publicAccess";
import { adminOnly } from "@/payload/access/adminOnly";
import { validateOptions } from "@/payload/collections/Variants/hooks/validateOptions";
import { pricesField } from "@payloadcms/plugin-ecommerce";
import { Currencies } from "@/payload/collections/Currencies";

export const Variants: CollectionOverride = ({ defaultCollection }) => {
	return {
		...defaultCollection,
		// PERMISSIONS ERROR WHEN I DISABLE VERSIONS, UPDATE ACCESS VALUE SINCE PAYLOAD SETS A RESTRICTIVE ONE
		access: {
			create: adminOnly,
			delete: adminOnly,
			read: publicAccess,
			update: adminOnly,
		},
		admin: {
			hidden: false,
			group: "Ecommerce",
		},
		// fields: [...defaultCollection.fields],
		fields: [
			{
				name: "title",
				type: "text",
				admin: {
					description:
						"Used for administrative purposes, now show to customers.",
				},
			},
			{
				name: "product",
				type: "relationship",
				relationTo: "products",
				required: true,
				admin: {
					position: "sidebar",
					readOnly: true,
				},
			},
			{
				// This might need to be a custom component, to show a selector for each variant that is
				// enabled on the parent product
				// - separate select inputs, each showing only a specific variant (w/ options)
				// - it will save data to the DB as IDs in this relationship field
				// and needs a validate function as well which enforces that the options are fully specified, and accurate
				name: "options",
				type: "relationship",
				admin: {
					components: {
						Field: {
							path: "@payloadcms/plugin-ecommerce/rsc#VariantOptionsSelector",
						},
					},
				},
				hasMany: true,
				label: "Variant options",
				relationTo: "variantOptions",
				required: true,
				validate: validateOptions({
					productsCollectionSlug: "products",
				}),
			},
			...pricesField({
				currenciesConfig: Currencies,
			}),
		],
		hooks: {
			beforeChange: [],
		},
		versions: {
			drafts: false,
		},
		trash: false,
	};
};
