import { PaymentsProvider } from "@/components/Providers/PaymentsProvider";
import { NotificationProvider } from "@/components/Providers/NotificationProvider";
import { ReactNode } from "react";

export const Providers = ({ children }: { children: ReactNode }) => {
	return (
		<PaymentsProvider>
			<NotificationProvider>{children}</NotificationProvider>
		</PaymentsProvider>
	);
};
