import Logo from "./Header/Logo";
import Nav from "./Header/Nav";
import { headers } from "next/headers";
import { getPayload } from "payload";
import configPromise from "@payload-config";

const SiteHeader = async () => {
	const headersList = await headers();
	const payload = await getPayload({
		config: configPromise,
	});

	const { user } = await payload.auth({ headers: headersList });

	return (
		<header
			className={
				"bg-sage-200 flex h-32 items-center justify-between overflow-x-hidden px-8"
			}
		>
			<Logo />
			<Nav authenticated={Boolean(user)} />
		</header>
	);
};

export default SiteHeader;
