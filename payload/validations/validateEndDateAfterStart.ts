import { DateField, Validate } from "payload";

/**
 * Validates that the end date is after the start date.
 *
 * @param startDateField The name of the field to compare against (default: "startDate")
 * @returns A Payload validation function
 */
export const validateEndDateAfterStart = <TData = any>(
	startDateField: keyof TData = "startDate" as keyof TData,
): Validate<Date | null, unknown, TData, DateField> => {
	return (value, { siblingData }) => {
		const startDate = (siblingData as any)[startDateField as string];

		if (value && startDate) {
			const start = new Date(startDate);
			const end = new Date(value);

			if (end <= start) {
				return "End date must be after start date";
			}
		}
		return true;
	};
};
