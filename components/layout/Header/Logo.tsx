import Link from "next/link";
import { font_logo } from "@/styles/fonts";

const Logo = () => {
	return (
		<Link href={"/"}>
			<h1
				className={`${font_logo.className} text-sage-950 text-4xl md:text-6xl lg:text-7xl`}
			>
				Angelic Pastries
			</h1>
		</Link>
	);
};

export default Logo;
