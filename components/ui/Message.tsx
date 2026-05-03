import { ReactNode } from "react";
import { cn } from "@/utils/cn";

type Props = {
	message: ReactNode;
	type?: "info" | "success" | "warning" | "error";
	className?: string;
};

export const Message = ({ message, type, className }: Props) => {
	return (
		<div
			className={cn(
				"my-8 rounded-lg p-4",
				{
					"bg-gray-100": type === "info",
					"bg-success": type === "success",
					"bg-warning": type === "warning",
					"bg-error": type === "error",
				},
				className,
			)}
		>
			{message}
		</div>
	);
};
