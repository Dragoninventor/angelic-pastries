import { CollectionOverride } from "@payloadcms/plugin-ecommerce/types";
import { Field } from "payload";

export const VariantTypes: CollectionOverride = ({ defaultCollection }) => {
	const fields: Field[] = [
		{
			name: "label",
			type: "text",
			required: true,
		},
		{
			name: "name",
			type: "text",
			required: true,
		},
		{
			name: "options",
			type: "join",
			collection: "variantOptions",
			maxDepth: 2,
			on: "variantType",
			orderable: true,
		},
	];

	return {
		...defaultCollection,
		fields: fields,
		admin: {
			...defaultCollection.admin,
			hidden: false,
			group: "Ecommerce",
		},
		trash: false,
	};
};
