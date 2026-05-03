"use client";

import React, { createContext, useCallback, useContext, useState } from "react";
import { cn } from "@/utils/cn";
import { X } from "lucide-react";

type NotificationType = "success" | "error" | "info";

interface Notification {
	id: string;
	message: string;
	type: NotificationType;
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

	const showNotification = useCallback(
		(message: string, type: NotificationType = "info") => {
			const id = Math.random().toString(36).substring(2, 9);

			setNotifications((prev) => [...prev, { id, message, type }]);

			setTimeout(() => {
				setNotifications((prev) => prev.filter((n) => n.id !== id));
			}, 5000);
		},
		[],
	);

	const removeNotification = (id: string) => {
		setNotifications((prev) => prev.filter((n) => n.id !== id));
	};

	return (
		<NotificationContext.Provider value={{ showNotification }}>
			{children}
			<div className="z-100 fixed bottom-4 right-4 flex flex-col gap-2">
				{notifications.map((notification) => (
					<div
						key={notification.id}
						className={cn(
							"animate-in slide-in-from-right-full min-w-75 flex items-center justify-between rounded-lg border p-4 shadow-lg transition-all",
							notification.type === "success" &&
								"border-green-200 bg-green-50 text-green-800",
							notification.type === "error" &&
								"border-red-200 bg-red-50 text-red-800",
							notification.type === "info" &&
								"bg-sage-50 border-sage-200 text-sage-800",
						)}
					>
						<p className="text-sm font-medium">
							{notification.message}
						</p>
						<button
							onClick={() => removeNotification(notification.id)}
							className="ml-4 hover:opacity-70"
						>
							<X className="size-4" />
						</button>
					</div>
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
