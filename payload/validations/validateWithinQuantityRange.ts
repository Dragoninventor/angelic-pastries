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
		const step = data?.quantities?.quantityStep ?? 1;

		if (value && minimum && maximum) {
			const valuesToValidate = Array.isArray(value) ? value : [value];
			const allInRange = valuesToValidate.every(
				(num) => num >= minimum && num <= maximum,
			);

			if (!allInRange) {
				return `Value must be within the range of ${minimum}–${maximum}.`;
			}

			if (step > 1) {
				const allConformToStep = valuesToValidate.every(
					(num) => (num - minimum) % step === 0,
				);

				if (!allConformToStep) {
					return `Value must be a multiple of the batch size (${step}) starting from the minimum (${minimum}).`;
				}
			}
		}

		return number(value, context);
	};
};
