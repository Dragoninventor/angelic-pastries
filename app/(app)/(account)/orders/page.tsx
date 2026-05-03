import { headers as getHeaders } from "next/headers";
import { getPayload } from "payload";

import configPromise from "@payload-config";
import { Order } from "@/payload-types";
import { notFound } from "next/navigation";
import { OrderItem } from "@/components/order/OrderItem";

const Orders = async () => {
	const headers = await getHeaders();
	const payload = await getPayload({ config: configPromise });

	const { user } = await payload.auth({ headers });

	let orders: Order[] | null = null;

	if (!user) {
		notFound();
	}

	try {
		const ordersResult = await payload.find({
			collection: "orders",
			limit: 0,
			pagination: false,
			user,
			overrideAccess: false,
			where: {
				customer: {
					equals: user.id,
				},
			},
		});

		orders = ordersResult?.docs || [];
	} catch (error) {}

	return (
		<div
			className={"rounded border border-slate-400 bg-slate-50 px-4 py-6"}
		>
			<h1 className={"mb-6 text-center text-3xl font-medium"}>Orders</h1>
			{(!orders || !Array.isArray(orders) || orders?.length === 0) && (
				<p className={""}>You have no orders.</p>
			)}
			{orders && orders.length > 0 && (
				<ul className={"flex flex-col gap-4"}>
					{orders?.map((order, index) => (
						<li key={index}>
							<OrderItem order={order} />
						</li>
					))}
				</ul>
			)}
		</div>
	);
};

export default Orders;
