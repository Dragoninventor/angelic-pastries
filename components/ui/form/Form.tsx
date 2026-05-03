import { DetailedHTMLProps, FormHTMLAttributes } from "react";

type Props = DetailedHTMLProps<
	FormHTMLAttributes<HTMLFormElement>,
	HTMLFormElement
>;

export const Form = (props: Props) => {
	const { className } = props;

	return (
		<form
			className={`flex flex-col gap-4${className ? ` ${className}` : ""}`}
			{...props}
		>
			{props.children}
		</form>
	);
};
