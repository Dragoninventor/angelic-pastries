import { OrderStatus as StatusOptions } from "@/payload-types";
import { cn } from "@/utils/cn";

type Props = {
	status: StatusOptions;
	className?: string;
};

export const OrderStatus = ({ status, className }: Props) => {
	return (
		<div
			className={cn(
				"flex w-fit items-center rounded px-2 py-1 font-mono text-sm uppercase tracking-tight",
				className,
				{
					"bg-vanilla-200 text-vanilla-950": status === "processing",
					"text-sage-900 bg-sage-200": status === "completed",
				},
			)}
		>
			{status}
		</div>
	);
};
