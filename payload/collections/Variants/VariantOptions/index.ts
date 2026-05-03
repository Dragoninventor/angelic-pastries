import { CollectionOverride } from "@payloadcms/plugin-ecommerce/types";

export const VariantOptions: CollectionOverride = ({ defaultCollection }) => ({
	...defaultCollection,
	fields: [...defaultCollection.fields],
	admin: {
		hidden: false,
		group: "Ecommerce",
	},
	trash: false,
});
