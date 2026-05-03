import { ComponentPropsWithoutRef } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/utils/cn";

type ButtonProps = {
	// type?: ButtonHTMLAttributes<HTMLButtonElement>["type"];
	variant?: "primary" | "secondary" | "secondary-outline" | "vibrant";
	size?: "sm" | "md" | "lg";
	processing?: boolean;
	disabled?: boolean;
};

type Props = ComponentPropsWithoutRef<"button"> &
	ButtonProps & {
		asChild?: boolean;
	};

export const Button = ({
	className,
	variant = "primary",
	size = "md",
	asChild = false,
	disabled,
	...props
}: Props) => {
	const variants = {
		primary:
			"cursor-pointer bg-sage-600 text-gray-50 border-transparent hover:bg-sage-700",
		secondary:
			"cursor-pointer bg-slate-600 text-slate-50 border-transparent hover:bg-slate-700",
		"secondary-outline":
			"cursor-pointer bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100",
		vibrant:
			"cursor-pointer bg-vanilla-600 text-gray-50 border-transparent hover:bg-vanilla-700",
		disabled: "bg-gray-200 text-gray-500 border-transparent",
	};
	const sizes = {
		sm: "px-3 py-1.5 text-sm gap-0.5",
		md: "px-4 py-2 gap-1",
		lg: "px-8 py-3 gap-1",
	};

	const Component = asChild ? Slot : "button";

	return (
		<Component
			{...props}
			data-slot={"button"}
			className={cn(
				"flex w-fit items-center justify-center rounded border text-center transition-colors",
				!disabled ? variants[variant] : variants["disabled"],
				sizes[size],
				className,
			)}
		/>
	);
};
