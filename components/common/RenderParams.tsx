"use client";

import { useSearchParams } from "next/navigation";
import React, { Suspense, useEffect } from "react";
import { Message } from "@/components/ui/Message";

export type RenderParamsProps = {
	className?: string;
	onParams?: (
		paramValues: ((null | string | undefined) | string[])[],
	) => void;
	params?: string[];
};

const RenderParamsComponent: React.FC<RenderParamsProps> = ({
	className,
	onParams,
	params = ["error", "warning", "success", "message"],
}) => {
	const searchParams = useSearchParams();
	const paramValues = params.map((param) => searchParams?.get(param));

	useEffect(() => {
		if (paramValues.length && onParams) {
			onParams(paramValues);
		}
	}, [paramValues, onParams]);

	if (paramValues.length) {
		return (
			<div className={className}>
				{paramValues.map((paramValue, index) => {
					if (!paramValue) return null;

					return (
						<Message
							className={"mb-8"}
							message={paramValue}
							key={paramValue as string}
						/>
					);
				})}
			</div>
		);
	}

	return null;
};

export const RenderParams: React.FC<RenderParamsProps> = (props) => {
	return (
		<Suspense fallback={null}>
			<RenderParamsComponent {...props} />
		</Suspense>
	);
};
