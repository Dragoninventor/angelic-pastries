import { WidgetServerProps } from "payload";

import styles from "./ActiveOrders.module.scss";
import { Order } from "@/payload-types";
import { OrderItem } from "./OrderItem";
import { CollapsibleSection } from "@/payload/ui/ActiveOrders/CollapsibleSection";

const MAX_RESPONSE_HOURS = 48;

export const ActiveOrders = async ({ req }: WidgetServerProps) => {
	const { payload } = req;
	const { config } = payload;

	const { docs: allOrders } = await payload.find({
		collection: "orders",
		where: {
			status: {
				in: ["processing", "completed"],
			},
		},
		limit: 100,
	});

	const pendingOrders = allOrders
		.filter((order) => order.status === "processing" && !order.responded)
		.sort(
			(a, b) =>
				new Date(a.createdAt).getTime() -
				new Date(b.createdAt).getTime(),
		);
	const respondedOrders = allOrders.filter(
		(order) => order.status === "processing" && order.responded,
	);
	const completedOrders = allOrders
		.filter((order) => order.status === "completed")
		.sort(
			(a, b) =>
				new Date(b.createdAt).getTime() -
				new Date(a.createdAt).getTime(),
		);

	const getUrgency = (createdAt: string) => {
		const now = new Date();
		const created = new Date(createdAt);
		const diffInMs = now.getTime() - created.getTime();
		const diffInHours = diffInMs / (1000 * 60 * 60);
		const remainingHours = MAX_RESPONSE_HOURS - diffInHours;

		if (remainingHours <= 0) {
			const overdueHours = Math.floor(Math.abs(remainingHours));
			let label = `Overdue by ${overdueHours}h`;

			if (overdueHours >= 24) {
				const overdueDays = Math.floor(overdueHours / 24);
				label = `Overdue by ${overdueDays}d`;
			}

			return {
				label,
				level: "critical",
			};
		}

		const hoursLeft = Math.floor(remainingHours);
		if (remainingHours <= 24) {
			return {
				label: `${hoursLeft}h remaining`,
				level: "high",
			};
		}

		return {
			label: `${hoursLeft}h remaining`,
			level: "low",
		};
	};

	const renderOrderList = (orders: Order[], showUrgency = false) => (
		<ul className={styles.orderList}>
			{orders.map((order) => {
				const urgency = showUrgency
					? getUrgency(order.createdAt)
					: null;

				return (
					<OrderItem
						key={order.id}
						order={order}
						urgency={urgency}
						adminRoute={config.routes.admin}
					/>
				);
			})}
		</ul>
	);

	return (
		<div className={styles.activeOrdersWidget}>
			<h2 className={styles.heading}>Active Orders</h2>

			<CollapsibleSection
				title={"Awaiting Response"}
				count={pendingOrders.length}
			>
				{pendingOrders.length > 0 ? (
					renderOrderList(pendingOrders, true)
				) : (
					<p className={styles.empty}>No pending orders.</p>
				)}
			</CollapsibleSection>

			<CollapsibleSection
				title={"Pending Delivery"}
				count={respondedOrders.length}
			>
				{respondedOrders.length > 0 ? (
					renderOrderList(respondedOrders)
				) : (
					<p className={styles.empty}>No orders pending delivery.</p>
				)}
			</CollapsibleSection>
		</div>
	);
};
