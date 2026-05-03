import { Payload } from "payload";

export const getProducts = async (payload: Payload) => {
	const products = await payload.find({
		collection: "products",
	});

	return products.docs;
};
