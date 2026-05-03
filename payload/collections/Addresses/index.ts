import { CollectionOverride } from "@payloadcms/plugin-ecommerce/types";

export const Addresses: CollectionOverride = ({ defaultCollection }) => ({
	...defaultCollection,
	fields: [...defaultCollection.fields],
	supportedCountries: [
		{
			label: "United States",
			value: "US",
		},
	],
});
