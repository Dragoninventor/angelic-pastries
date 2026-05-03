import { getPayload } from "payload";
import config from "@payload-config";
import { FeaturedProduct } from "@/components/home/FeaturedProduct";
import { Products } from "@/components/product/ProductList";
import { getProducts } from "@/actions/getProducts";

const Home = async () => {
	const payload = await getPayload({ config });
	const products = await getProducts(payload);

	return (
		<main className="h-full w-full">
			<FeaturedProduct />
			{process.env.NODE_ENV === "development" && (
				<Products products={products} />
			)}
		</main>
	);
};

export default Home;
