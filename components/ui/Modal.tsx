"use client";

import React, { ReactNode } from "react";
import {
	Modal as RAModal,
	ModalOverlay,
	type ModalOverlayProps,
} from "react-aria-components";

export type ModalProps = {
	onClose?: () => void;
	children?: ReactNode;
	title?: string;
	footer?: ReactNode;
} & ModalOverlayProps;

export const Modal = ({
	onClose,
	title,
	children,
	footer,
	...props
}: ModalProps) => {
	return (
		<>
			<ModalOverlay
				{...props}
				className={
					"h-vh absolute left-0 top-0 isolate z-50 w-full bg-black/50"
				}
			>
				<div
					className={
						"sticky left-0 top-0 box-border flex h-dvh w-full items-center justify-center"
					}
				>
					<RAModal
						{...props}
						className={
							"container mx-auto my-7 max-h-dvh w-full overflow-scroll rounded-lg bg-slate-50 shadow-2xl"
						}
					>
						<header
							className={
								"sticky top-0 z-20 flex items-center justify-between border-b border-slate-300 bg-slate-50 px-6 py-4"
							}
						>
							{title && <h2 className={"text-lg"}>{title}</h2>}
							{onClose && (
								<button
									aria-label={"Close"}
									className={
										"cursor-pointer text-3xl text-slate-500 transition-colors duration-200 hover:text-slate-700"
									}
									onClick={onClose}
								>
									&times;
								</button>
							)}
						</header>
						<div className={"bg-slate-100"}>{children}</div>
						{footer && (
							<div
								className={
									"flex w-full items-center justify-end px-6 py-4"
								}
							>
								{footer}
							</div>
						)}
					</RAModal>
				</div>
			</ModalOverlay>
		</>
	);
};
