import React, { ReactNode } from "react";
import {
	Dialog as RACDialog,
	type DialogProps as RADialogProps,
} from "react-aria-components/Dialog";
import { cn } from "@/utils/cn";

type DialogProps = {
	children?: ReactNode;
} & RADialogProps;

export const Dialog = ({ children, ...props }: DialogProps) => {
	return (
		<RACDialog
			{...props}
			className={cn(
				"relative box-border max-h-[inherit] overflow-scroll",
				props.className,
			)}
		>
			{children}
		</RACDialog>
	);
};
