"use client";

import React, { createContext, useCallback, useContext, useState } from "react";
import { cn } from "@/utils/cn";
import { X } from "lucide-react";

type NotificationType = "success" | "error" | "info";

interface Notification {
	id: string;
	message: string;
	type: NotificationType;
	state: "active" | "exiting";
}

interface NotificationContextType {
	showNotification: (message: string, type?: NotificationType) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
	undefined,
);

export const NotificationProvider = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	const [notifications, setNotifications] = useState<Notification[]>([]);

	const dismissNotification = useCallback((id: string) => {
		setNotifications((prev) =>
			prev.map((n) => (n.id === id ? { ...n, state: "exiting" } : n)),
		);

		setTimeout(() => {
			setNotifications((prev) => prev.filter((n) => n.id !== id));
		}, 500);
	}, []);

	const showNotification = useCallback(
		(message: string, type: NotificationType = "info") => {
			const id = Math.random().toString(36).substring(2, 9);

			setNotifications((prev) => [
				...prev,
				{ id, message, type, state: "active" },
			]);

			setTimeout(() => {
				dismissNotification(id);
			}, 3000);
		},
		[dismissNotification],
	);

	const toastHeight = 54;
	const toastGap = 6;

	// TODO: Implement support for animations with dynamic toast height based on toast content
	const getNotificationPosition = (id: string) => {
		const notification = notifications.find(
			(notification) => notification.id === id,
		);
		if (notification?.state === "exiting") return -1;

		return (
			notifications
				.filter((notification) => notification.state === "active")
				.findIndex((notification) => notification.id === id) + 1
		);
	};

	return (
		<NotificationContext.Provider value={{ showNotification }}>
			{children}
			<div className="pointer-events-none fixed left-0 top-0 z-20 flex h-dvh w-full justify-center overflow-hidden">
				{notifications.map((notification) => (
					// TODO: Make this more accessible with a "separate" close button
					<button
						key={notification.id}
						onClick={() => dismissNotification(notification.id)}
						className={cn(
							"min-w-75 starting:[translate:0_0] group/toast pointer-events-auto absolute mx-auto flex w-full cursor-pointer items-center justify-between rounded-lg border px-9 py-4 opacity-100 shadow-lg shadow-gray-300/15 transition-[translate,color,border-color] duration-[0.5s,0.2s,0.2s] [translate:0_var(--notify-y)] sm:max-w-lg sm:px-12",
							notification.state === "active" ? "z-20" : "z-10",
							notification.type === "success" &&
								"border-sage-400 text-sage-800 hover:border-sage-600 bg-sage-50",
							notification.type === "error" &&
								"border-rose-300 bg-rose-50 text-rose-800 hover:border-rose-400",
							notification.type === "info" &&
								"border-slate-400 bg-slate-100 text-slate-800 hover:border-slate-600",
						)}
						style={{
							top: `calc(${-toastHeight + toastGap}px)`,
							["--notify-y" as string]: `calc(${getNotificationPosition(notification.id) * (toastHeight + toastGap)}px)`,
						}}
					>
						<p className="w-full text-center text-xs font-medium sm:text-sm">
							{notification.message}
						</p>
						<X
							className={cn(
								"absolute right-2.5 size-4 transition-colors sm:right-4",
								notification.type === "success" &&
									"text-sage-600 group-hover/toast:text-sage-800",
								notification.type === "error" &&
									"text-rose-700 group-hover/toast:text-rose-800",
								notification.type === "info" &&
									"text-slate-600 group-hover/toast:text-slate-800",
							)}
						/>
					</button>
				))}
			</div>
		</NotificationContext.Provider>
	);
};

export const useNotification = () => {
	const context = useContext(NotificationContext);
	if (!context) {
		throw new Error(
			"useNotification must be used within a NotificationProvider",
		);
	}
	return context;
};
