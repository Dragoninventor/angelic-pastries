import NextImage from "next/image";
import { ImageProps, parseImage } from "@/utils/parseImage";

export const Image = (props: ImageProps) => {
	const image = parseImage(props);
	if (!image) return null;

	const fill = props.fill || (image.fill ?? !(image.width && image.height));

	return (
		<NextImage
			src={image.src}
			alt={image.alt}
			className={`${image.className ? `${image.className}` : "overflow-hidden rounded-sm"}`}
			width={!fill ? image.width : undefined}
			height={!fill ? image.height : undefined}
			fill={fill}
		/>
	);
};
