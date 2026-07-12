"use client";

import { PaymentsProvider } from "@/components/Providers/PaymentsProvider";
import { NotificationProvider } from "@/components/Providers/NotificationProvider";
import { ReactNode } from "react";
import { I18nProvider } from "react-aria-components/I18nProvider";

export const Providers = ({ children }: { children: ReactNode }) => {
	return (
		<PaymentsProvider>
			<NotificationProvider>
				<I18nProvider>{children}</I18nProvider>
			</NotificationProvider>
		</PaymentsProvider>
	);
};
