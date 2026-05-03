import { ImageProps as NextImageProps } from "next/image";
import { Media } from "@/payload-types";

export type ImagePropsPayload = {
	payloadImage: Media | string | number;
} & Partial<Omit<NextImageProps, keyof Media>>;
export type ImagePropsNext = Omit<NextImageProps, "payloadImage">;
export type ImageProps = ImagePropsPayload | ImagePropsNext;

const isPayloadImage = (image: ImageProps): image is ImagePropsPayload => {
	return "payloadImage" in image;
};

/**
 * Parses either PayloadCMS image props and or Next.js image props into a single usable output for images.
 *
 * Solution loosely based on this comment on an issue regarding resolving type errors with PayloadCMS media types: https://github.com/payloadcms/payload/issues/9549#issuecomment-2659419185.
 */
export const parseImage = (image: ImageProps): NextImageProps | null => {
	// If the image includes the payloadImage prop and is valid, convert to and return Next.js image props, otherwise return null.
	if (isPayloadImage(image)) {
		const { payloadImage } = image;

		if (typeof payloadImage !== "object" || !payloadImage?.url) {
			console.error(
				`parseImage: ${typeof payloadImage !== "object" ? `Expected type 'object', received '${typeof payloadImage}'` : `Required argument 'url' is not defined`}`,
			);

			return null;
		}

		return {
			...image,
			src: payloadImage.url,
			alt: payloadImage.alt,
			width: payloadImage.width ? payloadImage.width : undefined,
			height: payloadImage.height ? payloadImage.height : undefined,
		};
	}

	return {
		...image,
	};
};
