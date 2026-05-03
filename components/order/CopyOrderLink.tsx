"use client";

import React, { useState } from "react";
import { Check, Link } from "lucide-react";
import { cn } from "@/utils/cn";

export const CopyOrderLink = ({ orderId }: { orderId: string }) => {
	const [copied, setCopied] = useState(false);

	const copyToClipboard = async () => {
		try {
			await navigator.clipboard.writeText(window.location.href);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		} catch (err) {
			console.error("Failed to copy: ", err);
		}
	};

	return (
		<button
			onClick={copyToClipboard}
			className={cn(
				`text-sage-700 group flex cursor-pointer items-center gap-1.5 text-sm`,
			)}
			title={"Click to copy order link"}
		>
			<span>
				Order:{" "}
				<span className={"group-hover:underline"}>#{orderId}</span>
			</span>
			<span className={"text-sage-900"}>
				{copied ? (
					<Check className={"size-3.5"} />
				) : (
					<Link className={"size-3.5"} />
				)}
			</span>
		</button>
	);
};
