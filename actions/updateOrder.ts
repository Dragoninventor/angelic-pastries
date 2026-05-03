"use server";

import { getPayload } from "payload";
import configPromise from "@payload-config";

export const updateOrder = async (id: string, data: { notes?: string }) => {
	const payload = await getPayload({ config: configPromise });

	return await payload.update({
		id: id,
		collection: "orders",
		data: {
			notes: data.notes,
		},
	});
};
