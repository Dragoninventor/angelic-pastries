import { headers as getHeaders } from "next/headers";
import { getPayload } from "payload";
import type { Order } from "@/payload-types";

import configPromise from "@payload-config";
import { notFound } from "next/navigation";
import { formatDateTime } from "@/payload/utilities/formatDateTime";
import { Price } from "@/components/ui/Price";
import { OrderStatus } from "@/components/order/OrderStatus";
import { ProductItem } from "@/components/product/ProductItem";
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon } from "lucide-react";
import Link from "next/link";
import { CopyOrderLink } from "@/components/order/CopyOrderLink";

export const dynamic = "force-dynamic";

type PageProps = {
	params: Promise<{ id: string }>;
	searchParams: Promise<{ email?: string }>;
};

const Order = async ({ params, searchParams }: PageProps) => {
	const headers = await getHeaders();
	const payload = await getPayload({ config: configPromise });
	const { user } = await payload.auth({ headers });

	const { id } = await params;
	const { email = "" } = await searchParams;

	const labelClassName =
		"font-mono text-sm uppercase text-gray-600 mb-2 tracking-tight";

	let order: Order | null = null;

	try {
		const {
			docs: [orderResult],
		} = await payload.find({
			collection: "orders",
			user,
			overrideAccess: !Boolean(user),
			depth: 2,
			where: {
				and: [
					{
						id: {
							equals: id,
						},
					},
					{
						or: [
							...(user
								? [
										{
											customer: {
												equals: user.id,
											},
										},
									]
								: []),
							...(email
								? [
										{
											customerEmail: {
												equals: email,
											},
										},
									]
								: []),
						],
					},
				],
			},
			select: {
				amount: true,
				currency: true,
				items: true,
				customerEmail: true,
				customer: true,
				status: true,
				createdAt: true,
				updatedAt: true,
				shippingAddress: true,
			},
		});

		const canAccessAsGuest =
			!user &&
			email &&
			orderResult &&
			orderResult.customerEmail &&
			orderResult.customerEmail === email;

		const canAccessAsUser =
			user &&
			orderResult &&
			orderResult.customer &&
			(typeof orderResult.customer === "object"
				? orderResult.customer.id
				: orderResult.customer) === user.id;

		if (orderResult && (canAccessAsGuest || canAccessAsUser)) {
			order = orderResult;
		}
	} catch (error) {
		console.error(error);
	}

	if (!order) {
		notFound();
	}

	return (
		<div className={""}>
			<div
				className={
					"mb-2.5 flex w-full flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between"
				}
			>
				{user && (
					<Button size={"md"} variant={"secondary-outline"} asChild>
						<Link href={"/orders"}>
							<ChevronLeftIcon className={"size-4"} />
							All orders
						</Link>
					</Button>
				)}
				<h1
					className={
						"bg-sage-200 text-sage-800 w-fit rounded px-4 py-1.5 text-sm sm:ml-auto"
					}
				>
					<CopyOrderLink orderId={order.id} />
				</h1>
			</div>
			<div
				className={
					"flex flex-col gap-6 rounded border border-slate-400 bg-slate-50 px-4 py-6"
				}
			>
				{/* Order Date */}
				<div
					className={
						"flex flex-col gap-6 lg:flex-row lg:justify-between"
					}
				>
					<div>
						<p className={labelClassName}>Order Date</p>
						<p className={"text-lg"}>
							<time dateTime={order.createdAt}>
								{formatDateTime({
									date: order.createdAt,
									format: "MMMM dd, yyyy",
								})}
							</time>
						</p>
					</div>
				</div>
				{/* Order Price */}
				<div>
					<p className={labelClassName}>Total</p>
					{order.amount && (
						<Price className={"text-lg"} amount={order.amount} />
					)}
				</div>
				{/*	Order Status*/}
				{order.status && (
					<div className={"max-w-1/3 grow"}>
						<p className={labelClassName}>Status</p>
						<OrderStatus
							className={"text-base"}
							status={order.status}
						/>
					</div>
				)}
				{/*	Order Items*/}
				{order.items && (
					<div>
						<h2 className={labelClassName}>Items</h2>
						<ul className={"flex flex-col gap-2"}>
							{order.items?.map((item, index) => {
								if (typeof item.product === "string")
									return null;

								if (
									!item.product ||
									typeof item.product !== "object"
								) {
									return (
										<div key={item.product}>
											This item is no longer available.
										</div>
									);
								}

								const variant =
									item.variant &&
									typeof item.variant === "object"
										? item.variant
										: undefined;

								return (
									<li key={index}>
										<ProductItem
											product={item.product}
											quantity={item.quantity}
											variant={variant}
											style={"compact"}
										/>
									</li>
								);
							})}
						</ul>
					</div>
				)}
			</div>
		</div>
	);
};

export default Order;
