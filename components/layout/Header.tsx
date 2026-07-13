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
				"bg-sage-200 sticky top-0 z-10 flex h-20 w-full items-center justify-between shadow-lg shadow-gray-700/15 md:h-32"
			}
		>
			{/* TODO: Move logo inside of Nav to allow for closing the nav on click without a smooth transition */}
			<Logo />
			<Nav authenticated={Boolean(user)} />
		</header>
	);
};

export default SiteHeader;
