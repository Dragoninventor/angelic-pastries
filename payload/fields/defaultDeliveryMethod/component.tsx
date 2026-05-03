import { SelectInput, useField } from "@payloadcms/ui";
import { useEffect, useState } from "react";

export const DefaultDeliveryMethodComponent: React.FC<{ path: string }> = ({
	path,
}) => {
	const { value, setValue } = useField<string>({ path });
	const [options, setOptions] = useState([]);

	useEffect(() => {});

	return (
		<div>
			<label className={"field-label"}>Default Delivery Method</label>
			<SelectInput
				name={path}
				path={path}
				options={options}
				value={value}
				onChange={(e) => setValue(e.values)}
			/>
		</div>
	);
};
