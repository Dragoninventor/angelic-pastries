import { CheckoutPage } from "@/components/checkout";

const Checkout = () => {
	return (
		<div
			className={
				"container mx-auto rounded bg-gray-50 p-4 shadow md:mx-auto"
			}
		>
			<h1 className={"my-2 text-center text-3xl"}>Checkout</h1>
			<CheckoutPage />
		</div>
	);
};

export default Checkout;
