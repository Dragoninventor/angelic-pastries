import { useState } from "react";

type OrderNote = {
	orderNote: string;
	setOrderNote: (note: string) => void;
};
export const OrderNote = ({ orderNote, setOrderNote }: OrderNote) => {
	const [addNote, setAddNote] = useState(false);

	return (
		<>
			{/*/!* Order note toggle *!/*/}
			<div className={"flex flex-col gap-2.5"}>
				<label className={"inline-flex items-center gap-2"}>
					<input
						type={"checkbox"}
						className={"h-4 w-4"}
						checked={addNote}
						onChange={(e) => setAddNote(e.target.checked)}
					/>
					<span className={"text-sm"}>Add an order note</span>
				</label>
				{addNote && (
					<div className={"flex flex-col gap-2.5"}>
						<label htmlFor={"order-note"} className={"sr-only"}>
							Order notes
						</label>
						<textarea
							id={"order-note"}
							className={
								"w-full rounded border border-gray-300 bg-gray-50 p-4 leading-6"
							}
							placeholder={
								"Add delivery instructions or a note for the shop"
							}
							rows={4}
							value={orderNote}
							onChange={(event) =>
								setOrderNote(event.target.value)
							}
						/>
					</div>
				)}
			</div>
		</>
	);
};
