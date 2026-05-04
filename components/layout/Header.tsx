import Logo from "./Header/Logo";
import Nav from "./Header/Nav";

const SiteHeader = async () => {
	// const headersList = await headers();
	// const payload = await getPayload({
	// 	config: configPromise,
	// });

	// const { user } = await payload.auth({ headers: headersList });

	return (
		<header
			className={
				"bg-sage-200 flex h-32 items-center justify-between overflow-x-hidden px-8"
			}
		>
			<Logo />
			{/*<Nav authenticated={Boolean(user)} />*/}
			<Nav authenticated={false} />
		</header>
	);
};

export default SiteHeader;
