import { CartItem } from "@/components/cart";
import { EditItemQuantityButton } from "@/components/cart/EditItemQuantityButton";

export const EditItemQuantity = ({ item }: { item: CartItem }) => {
	return (
		<div
			className={
				"bg-sage-100 ml-auto flex h-8 flex-row items-center rounded-full"
			}
		>
			<EditItemQuantityButton item={item} type={"minus"} />
			<p className={"w-10 text-center"}>
				<span className={"w-full text-sm"}>{item.quantity}</span>
			</p>
			<EditItemQuantityButton item={item} type={"plus"} />
		</div>
	);
};
