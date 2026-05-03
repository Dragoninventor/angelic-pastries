import { draftMode } from "next/headers";
import { getPayload } from "payload";
import configPromise from "@payload-config";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ProductDescription } from "@/components/product/ProductDescription";
import { Gallery } from "@/components/product/Gallery";
import { VariantSelector } from "@/components/product/VariantSelector";
import { OrderControls } from "@/components/product/OrderControls";
import { Hr } from "@/components/ui/hr";
import { Button } from "@/components/ui/button";
import { Product } from "@/payload-types";

type Args = {
	params: Promise<{
		slug: string;
	}>;
};
const ProductPage = async ({ params }: Args) => {
	const { slug } = await params;
	const product = await getProductBySlug({ slug });

	if (!product) return notFound();

	const hasVariants =
		product.enableVariants && Boolean(product.variants?.docs?.length);

	let price = product.priceInUSD;
	if (product.enableVariants && product?.variants?.docs?.length) {
		price = product?.variants?.docs?.reduce((acc, variant) => {
			if (
				typeof variant === "object" &&
				variant?.priceInUSD &&
				acc &&
				variant?.priceInUSD > acc
			) {
				return variant.priceInUSD;
			}
		}, price);
	}

	return (
		<div className={"container py-8 sm:mx-auto"}>
			<Button asChild variant={"secondary-outline"} className={"mb-2"}>
				<Link href={"/"}>
					<ArrowLeft className={"mr-1 size-4"} />
					{/*All products*/}
					Back
				</Link>
			</Button>
			<div
				className={
					"bg-sage-50 flex flex-col gap-12 rounded-lg border border-slate-400 p-2 md:py-12 lg:flex-row lg:gap-8"
				}
			>
				<div className={"h-full w-full basis-full lg:basis-1/2"}>
					<Gallery product={product} />
				</div>
				<div className={"flex basis-full flex-col gap-6 lg:basis-1/2"}>
					<ProductDescription product={product} />
					{hasVariants && (
						<>
							<Hr />
							<VariantSelector product={product} />
						</>
					)}
					<Hr />
					<OrderControls product={product} />
				</div>
			</div>
		</div>
	);
};

export default ProductPage;

const getProductBySlug: ({
	slug,
}: {
	slug: string;
}) => Promise<Product | null> = async ({ slug }: { slug: string }) => {
	const { isEnabled: draft } = await draftMode();

	const payload = await getPayload({ config: configPromise });

	const result = await payload.find({
		collection: "products",
		depth: 3,
		draft,
		limit: 1,
		overrideAccess: draft,
		pagination: false,
		where: {
			and: [
				{
					slug: {
						equals: slug,
					},
				},
				...(draft ? [] : [{ _status: { equals: "published" } }]),
			],
		},
		populate: {
			variants: {
				title: true,
				priceInUSD: true,
				options: true,
			},
		},
	});

	return result.docs?.[0] || null;
};
