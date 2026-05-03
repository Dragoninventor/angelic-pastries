import config from "@payload-config";
import { getPayload } from "payload";
import { Image } from "@/components/ui/Image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { RichText } from "@/components/common/RichText";
import { ArrowRight } from "lucide-react";

export const FeaturedProduct = async () => {
	const payload = await getPayload({ config });
	const homeConfig = await payload.findGlobal({
		slug: "homepage",
	});

	const productId =
		typeof homeConfig.featuredProduct !== "string"
			? homeConfig.featuredProduct?.id
			: undefined;

	if (!productId) return null;

	const featuredProduct = await payload.findByID({
		collection: "products",
		id: productId,
	});

	const productSlug = featuredProduct.slug || featuredProduct.id;

	const bannerImage = homeConfig.featuredProductBanner;
	const content = homeConfig.heroContent;

	return (
		<section className="bg-vanilla-50 relative">
			<div className="relative flex min-h-[calc(100dvh-8rem)] w-full flex-col items-center justify-start overflow-hidden bg-black px-4 pb-16 pt-16 text-white md:pb-24 md:pt-24">
				<Image
					payloadImage={bannerImage}
					className="absolute inset-0 h-full w-full object-cover opacity-80"
					fill
					preload
				/>
				<div className="bg-linear-to-b absolute inset-0 from-black/40 via-transparent to-black/60" />
				<div className="relative z-10 flex w-full max-w-5xl flex-col items-center">
					{/* Title Section */}
					<div className="font-hero mb-10 text-5xl md:mb-16 md:text-8xl lg:text-9xl">
						<h1 className="relative text-center">
							<span className="sr-only">
								{featuredProduct.title}
							</span>
							<span
								className="absolute inset-0 select-none text-white"
								aria-hidden="true"
								style={{
									clipPath: "url(#liquid-split-left)",
								}}
							>
								{featuredProduct.title}
							</span>
							<span
								className="relative block select-none text-white/30"
								aria-hidden="true"
								style={{
									WebkitTextStroke: "1px white",
									clipPath: "url(#liquid-split-right)",
								}}
							>
								{featuredProduct.title}
							</span>
						</h1>
					</div>
					{/* Content Card */}
					<div className="border-sage-100 text-sage-800 mx-auto flex w-full max-w-2xl flex-col items-center border bg-white px-4 py-6 text-center shadow-xl md:px-6 md:py-10">
						{featuredProduct.description && (
							<div className="mb-6 max-w-md font-light leading-relaxed md:text-lg">
								<RichText
									data={content}
									className="container-none prose-sage mx-0 max-w-none"
								/>
							</div>
						)}

						<Button
							variant="vibrant"
							size="lg"
							asChild
							className="px-10 font-medium tracking-wide"
						>
							<Link href={`/products/${productSlug}`}>
								Order now <ArrowRight className="ml-1 size-4" />
							</Link>
						</Button>
					</div>
				</div>
			</div>

			{/* Hidden SVG for Clip Paths */}
			<svg className="absolute h-0 w-0" aria-hidden="true">
				<defs>
					<clipPath
						id="liquid-split-left"
						clipPathUnits="objectBoundingBox"
					>
						<path d="M 0,0 L 0.8,0 C 0.7,0.1 0.6,0.5 0.5,0.5 C 0.4,0.5 0.3,0.9 0.2,1 L 0,1 Z" />
					</clipPath>
					<clipPath
						id="liquid-split-right"
						clipPathUnits="objectBoundingBox"
					>
						<path d="M 0.8,0 L 1,0 L 1,1 L 0.2,1 C 0.3,0.9 0.4,0.5 0.5,0.5 C 0.6,0.5 0.7,0.1 0.8,0 Z" />
					</clipPath>
				</defs>
			</svg>
		</section>
	);
};
