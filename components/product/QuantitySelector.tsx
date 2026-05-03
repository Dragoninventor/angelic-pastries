import type { Product } from "@/payload-types";
import { Button } from "@/components/ui/button";
import {
	ChangeEventHandler,
	Dispatch,
	SetStateAction,
	useEffect,
	useRef,
	useState,
} from "react";

type Props = {
	product: Product;
	quantity: number;
	setQuantity: Dispatch<SetStateAction<number>>;
	onValidityChange?: (valid: boolean) => void;
};

export function QuantitySelector({
	product,
	quantity,
	setQuantity,
	onValidityChange,
}: Props) {
	const options = product.quantities.quantityOptions;
	const minimumQuantity = product.quantities.quantityMinimum;
	const maximumQuantity = product.quantities.quantityMaximum;
	const [customSelected, setCustomSelected] = useState(
		!options.includes(quantity),
	);
	const [inputString, setInputString] = useState(
		customSelected ? "" : String(quantity ?? options[0]),
	);
	const [hasError, setHasError] = useState(false);
	const customInputRef = useRef<HTMLInputElement | null>(null);

	useEffect(() => {
		if (customSelected) {
			customInputRef.current?.focus();
		}
	}, [customSelected]);

	const handleSelectOption = (quantity: number) => {
		setCustomSelected(false);
		setInputString("");
		setHasError(false);
		onValidityChange?.(true);
		setQuantity(quantity);
	};

	const onInputChange: ChangeEventHandler<HTMLInputElement> = (event) => {
		const rawInput = event.target.value;

		setInputString(rawInput);

		const number = Number(rawInput);
		let valid =
			Number.isInteger(number) &&
			rawInput.trim() !== "" &&
			number >= minimumQuantity &&
			number <= maximumQuantity;

		if (valid) {
			setQuantity(number);
		}

		setHasError(customSelected && !valid);
		onValidityChange?.(valid);
	};

	return (
		<div className="flex flex-col gap-3">
			<dt className="text-sm">Quantity</dt>
			<dd className="flex flex-col gap-2.5">
				{options.length > 0 && (
					<div className="flex flex-wrap gap-1">
						{options.map((option) => {
							const isActive =
								!customSelected && quantity === option;
							return (
								<Button
									key={option}
									size="sm"
									variant={
										isActive
											? "secondary"
											: "secondary-outline"
									}
									onClick={() => {
										handleSelectOption(option);
									}}
								>
									{option}
								</Button>
							);
						})}
						<Button
							size={"sm"}
							variant={
								customSelected
									? "secondary"
									: "secondary-outline"
							}
							onClick={() => {
								setCustomSelected(true);
								setInputString("");
								setHasError(false);
								onValidityChange?.(false);
							}}
							title={"Custom"}
						>
							Custom
						</Button>
					</div>
				)}
				{customSelected && (
					<div className={"flex flex-col items-start gap-2"}>
						<p
							id={"quantity-helper"}
							className={"text-sm text-gray-700"}
						>
							Enter a custom quantity between {minimumQuantity}{" "}
							and {maximumQuantity}.
						</p>
						<input
							aria-label={"Custom quantity"}
							className={
								"w-24 rounded border px-2 py-1 text-center"
							}
							type={"number"}
							min={minimumQuantity}
							max={maximumQuantity}
							value={inputString}
							onChange={onInputChange}
							ref={customInputRef}
							aria-invalid={hasError || undefined}
							aria-describedby={`${"quantity-helper"}${hasError ? " quantity-error" : ""}`}
						/>
					</div>
				)}
			</dd>
		</div>
	);
}
