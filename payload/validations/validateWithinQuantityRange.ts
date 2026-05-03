import { NumberField, Validate } from "payload";
import { number } from "payload/shared";

/**
 * Validates that a number or an array of numbers is within the product's quantity range.
 *
 * @returns A Payload validation function
 */
export const validateWithinQuantityRange = <TData = any>(): Validate<
	number | number[],
	any,
	TData,
	NumberField
> => {
	return (value, context) => {
		const { data } = context;
		const minimum = data?.quantities?.quantityMinimum;
		const maximum = data?.quantities?.quantityMaximum;

		if (value && minimum && maximum) {
			const valuesToValidate = Array.isArray(value) ? value : [value];
			const allValid = valuesToValidate.every(
				(num) => num >= minimum && num <= maximum,
			);

			if (!allValid) {
				return `Value must be within the range of ${minimum}–${maximum}.`;
			}
		}

		return number(value, context);
	};
};
