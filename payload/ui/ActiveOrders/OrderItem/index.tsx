"use client";

import { ChangeEvent, FC, useState } from "react";
import { useRouter } from "next/navigation";
import { Order } from "@/payload-types";
import styles from "../ActiveOrders.module.scss";
import { Price } from "@/components/ui/Price";
import { updateOrderAction } from "../actions";
import Link from "next/link";
import { toast } from "@payloadcms/ui";

interface OrderItemProps {
	order: Order;
	urgency?: {
		label: string;
		level: string;
	} | null;
	adminRoute: string;
}

export const OrderItem: FC<OrderItemProps> = ({
	order,
	urgency,
	adminRoute,
}) => {
	const router = useRouter();

	const [isResponded, setIsResponded] = useState(!!order.responded);
	const [isCompleted, setIsCompleted] = useState(
		order.status === "completed",
	);
	const [isLoading, setIsLoading] = useState(false);

	const updateOrder = async (updates: Partial<Order>, message: string) => {
		setIsLoading(true);

		try {
			await updateOrderAction(order.id, updates);

			toast.success(message);

			router.refresh();
		} catch (error) {
			console.error("Error updating order:", error);
			toast.error(`Error updating order: ${error}`);

			if (updates.hasOwnProperty("responded"))
				setIsResponded(!!order.responded);
			if (updates.hasOwnProperty("status"))
				setIsCompleted(order.status === "completed");
		} finally {
			setIsLoading(false);
		}
	};

	const handleRespondedChange = (e: ChangeEvent<HTMLInputElement>) => {
		const newValue = e.target.checked;

		setIsResponded(newValue);

		void updateOrder(
			{ responded: newValue },
			newValue
				? `Order marked as responded to.`
				: `Order unmarked as responded to.`,
		);
	};

	const handleCompletedChange = (e: ChangeEvent<HTMLInputElement>) => {
		const newValue = e.target.checked;

		setIsCompleted(newValue);

		void updateOrder(
			{ status: newValue ? "completed" : "processing" },
			`Order marked as ${newValue ? "completed" : "processing"}.`,
		);
	};

	return (
		<li className={styles.order}>
			<div className={styles.orderDetails}>
				<div className={styles.orderHeader}>
					<div className={styles.info}>
						{order.customerEmail && (
							<p className={styles.customerEmail}>
								{order.customerEmail}
							</p>
						)}
						<p className={styles.orderDate}>
							{new Date(order.createdAt).toLocaleDateString()}
						</p>
					</div>
					{urgency && (
						<div
							className={`${styles.urgency} ${styles[urgency.level]}`}
						>
							{urgency.label}
						</div>
					)}
				</div>
				<Link
					href={`${adminRoute}/collections/orders/${order.id}`}
					className={styles.orderSummary}
				>
					<ul className={styles.orderItemsList}>
						{order.items?.map((item) => {
							const productTitle =
								typeof item.product === "object"
									? item.product?.title
									: item.product;
							const variantTitle =
								typeof item.variant === "object"
									? item.variant?.title
									: item.variant;

							const label = variantTitle
								? variantTitle
								: productTitle
									? productTitle
									: "Unknown Product";

							return (
								<li
									key={item.id}
									className={styles.orderItem}
								>{`${label} × ${item.quantity}`}</li>
							);
						})}
					</ul>
					<Price
						amount={order.amount || 0}
						className={styles.orderPrice}
					/>
				</Link>
			</div>
			<hr className={styles.orderDivider} />
			<div className={styles.orderActions}>
				<label className={styles.checkboxLabel}>
					<input
						type="checkbox"
						checked={isResponded}
						onChange={handleRespondedChange}
						disabled={isLoading}
					/>
					Responded
				</label>
				<label className={styles.checkboxLabel}>
					<input
						type="checkbox"
						checked={isCompleted}
						onChange={handleCompletedChange}
						disabled={isLoading}
					/>
					Complete
				</label>
			</div>
		</li>
	);
};
