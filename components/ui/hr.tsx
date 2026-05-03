type Props = {
	variant?: "default" | "bold";
};
export const Hr = ({ variant = "default" }: Props) => {
	return (
		<hr
			className={`border-b border-t-0 ${variant === "bold" ? "border-gray-500" : "border-gray-300"}`}
		/>
	);
};
