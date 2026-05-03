import { ReactNode } from "react";
import { headers } from "next/headers";
import { getPayload } from "payload";

import configPromise from "@payload-config";
import { RenderParams } from "@/components/common/RenderParams";

const RootLayout = async ({ children }: { children: ReactNode }) => {
	const headersList = await headers();
	const payload = await getPayload({
		config: configPromise,
	});

	const { user } = await payload.auth({ headers: headersList });

	return (
		<div className={""}>
			<div className={"relative"}>
				<RenderParams className={""} />
			</div>
			<div className={"container mt-16 flex gap-8 pb-8 sm:mx-auto"}>
				{/*{user && <div>account nav</div>}*/}
				<div className={"flex grow flex-col gap-12"}>{children}</div>
			</div>
		</div>
	);
};

export default RootLayout;
