import Logo from "./Header/Logo";
import Nav from "./Header/Nav";

const SiteHeader = () => {
	return (
		<header
			className={
				"bg-sage-200 flex h-32 items-center justify-between overflow-x-hidden px-8"
			}
		>
			<Logo />
			<Nav />
		</header>
	);
};

export default SiteHeader;
