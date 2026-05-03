"use client";

import React, { useEffect, useRef, useState } from "react";
import { ChevronRight } from "lucide-react";
import styles from "./ActiveOrders.module.scss";

interface CollapsibleSectionProps {
	title: string;
	count: number;
	children: React.ReactNode;
}

export const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({
	title,
	count,
	children,
}) => {
	// TODO: Set and remember user preferences for collapsed state

	const contentRef = useRef<HTMLDivElement>(null);

	const [isOpen, setIsOpen] = useState<boolean>(true);
	const [maxHeight, setMaxHeight] = useState<string | number>(
		isOpen ? "none" : 0,
	);

	useEffect(() => {
		if (isOpen) {
			setMaxHeight(contentRef.current?.scrollHeight || "none");

			// After animation finishes, set to none to allow for dynamic content resizing
			const timer = setTimeout(() => {
				if (isOpen) setMaxHeight("none");
			}, 300);

			return () => clearTimeout(timer);
		} else {
			setMaxHeight(contentRef.current?.scrollHeight || 0);

			// Force a reflow
			contentRef.current?.offsetHeight;

			setMaxHeight(0);
		}
	}, [isOpen]);

	return (
		<div className={styles.section}>
			<button
				type="button"
				className={styles.subHeading}
				onClick={() => setIsOpen(!isOpen)}
			>
				<ChevronRight
					className={`${styles.chevron} ${isOpen ? styles.open : ""}`}
					size={16}
				/>
				{title} ({count})
			</button>
			<div
				ref={contentRef}
				className={`${styles.collapsibleContent} ${!isOpen ? styles.collapsed : ""}`}
				style={{ maxHeight }}
			>
				{children}
			</div>
		</div>
	);
};
