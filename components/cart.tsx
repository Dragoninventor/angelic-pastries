import { Cart as CartType } from "@/payload-types";
import { CartModal } from "@/components/cart/CartModal";

export type CartItem = NonNullable<CartType["items"]>[number];

export function Cart() {
	return <CartModal />;
}
