"use client";

import { useFormFields } from "@payloadcms/ui/forms/Form";

const useField = (nameOfIDField: string) => {
	return useFormFields(([fields]) => fields[nameOfIDField]).value;
};

export default useField;
