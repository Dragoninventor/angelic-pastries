"use server";

import { getPayload } from "payload";
import configPromise from "@payload-config";
import { revalidatePath } from "next/cache";
import { Order } from "@/payload-types";

export async function updateOrderAction(id: string, data: Partial<Order>) {
	const payload = await getPayload({ config: configPromise });

	await payload.update({
		collection: "orders",
		id,
		data,
	});

	revalidatePath("/", "layout");
}

export async function markAsResponded(id: string) {
	await updateOrderAction(id, { responded: true });
}

export async function markAsCompleted(id: string) {
	await updateOrderAction(id, { status: "completed" });
}
