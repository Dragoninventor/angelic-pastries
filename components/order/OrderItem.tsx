import { Order } from "@/payload-types";
import { formatDateTime } from "@/payload/utilities/formatDateTime";
import { OrderStatus } from "@/components/order/OrderStatus";
import { Price } from "@/components/ui/Price";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ReceiptText } from "lucide-react";

type Props = {
	order: Order;
};
export const OrderItem = ({ order }: Props) => {
	const itemsLabel = order.items?.length === 1 ? "Item" : "Items";

	return (
		<div
			className={
				"flex flex-col gap-4 rounded-lg border border-slate-300 bg-slate-200 px-4 py-2.5 sm:flex-row sm:items-center sm:justify-between md:px-6 md:py-4"
			}
		>
			<div className={"flex flex-col gap-2"}>
				<h3
					className={
						"max-w-32 truncate font-mono text-sm uppercase tracking-widest text-gray-800 sm:max-w-none"
					}
				>{`#${order.id}`}</h3>
				<div
					className={
						"flex flex-col-reverse gap-2 sm:flex-row sm:items-center"
					}
				>
					<p className={"text-lg"}>
						<time dateTime={order.createdAt}>
							{formatDateTime({
								date: order.createdAt,
								format: "MMMM dd, yyyy",
							})}
						</time>
					</p>
					{order.status && <OrderStatus status={order.status} />}
				</div>
				<p className={"flex gap-2 text-sm text-gray-600"}>
					<span>
						{order.items?.length} {itemsLabel}
					</span>
					{order.amount && (
						<>
							<span>•</span>
							<Price as={"span"} amount={order.amount} />
						</>
					)}
				</p>
			</div>
			<Button
				variant={"secondary"}
				className={"self-start sm:self-auto"}
				asChild
			>
				<Link
					href={`/orders/${order.id}`}
					className={"inline-flex gap-1.5 text-sm"}
				>
					<ReceiptText className={"size-4"} />
					View Order
				</Link>
			</Button>
		</div>
	);
};
