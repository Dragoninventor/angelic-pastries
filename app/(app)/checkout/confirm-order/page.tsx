import { ConfirmOrder } from "@/components/checkout/ConfirmOrder";
import { Suspense } from "react";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

const ConfirmOrderPage = async ({
	searchParams: searchParamsPromise,
}: {
	searchParams: SearchParams;
}) => {
	return (
		<div className={"container flex min-h-[90vh] py-12"}>
			<Suspense>
				<ConfirmOrder />
			</Suspense>
		</div>
	);
};

export default ConfirmOrderPage;
