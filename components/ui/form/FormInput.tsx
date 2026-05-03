import {
	DetailedHTMLProps,
	HTMLInputTypeAttribute,
	InputHTMLAttributes,
} from "react";

type FormInput = {
	type: HTMLInputTypeAttribute;
	id: string;
	label: string;
	invalid?: boolean;
};
type FormInputProps = FormInput &
	DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;

export const FormInput = (props: FormInputProps) => {
	return (
		<div className={"flex flex-col gap-2.5"}>
			<label className={"text-sm"} htmlFor={props.id}>
				{props.label}
			</label>
			<input
				{...props}
				className={
					"w-full rounded border border-gray-300 bg-gray-50 p-4 leading-6"
				}
			/>
		</div>
	);
};
