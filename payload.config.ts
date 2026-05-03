import { mongooseAdapter } from "@payloadcms/db-mongodb";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import path from "path";
import { Users } from "@/payload/collections/Users";
import dotenv from "dotenv";
import sharp from "sharp";
import { Products } from "@/payload/collections/Products";
import { buildConfig } from "payload";
import { fileURLToPath } from "node:url";
import { ecommercePlugin } from "@payloadcms/plugin-ecommerce";
import { Media } from "@/payload/collections/Media";
import { Addresses } from "@/payload/collections/Addresses";
import { Delivery } from "@/payload/globals/Delivery";
import { Business } from "@/payload/globals/Business";
import { Homepage } from "@/payload/globals/Homepage";
import { adminOnlyFieldAccess } from "@/payload/access/adminOnlyFieldAccess";
import { adminOrPublishedStatus } from "@/payload/access/adminOrPublishedStatus";
import { isCustomer } from "@/payload/access/isCustomer";
import { isAdmin } from "@/payload/access/isAdmin";
import { isDocumentOwner } from "@/payload/access/isDocumentOwner";
import { Orders } from "@/payload/collections/Orders";
import { Variants } from "@/payload/collections/Variants";
import { Currencies } from "@/payload/collections/Currencies";
import { Discounts } from "@/payload/collections/Discounts";
import { VariantTypes } from "@/payload/collections/Variants/VariantTypes";
import { VariantOptions } from "@/payload/collections/Variants/VariantOptions";
import { stripeAdapter } from "@payloadcms/plugin-ecommerce/payments/stripe";
import { nodemailerAdapter } from "@payloadcms/email-nodemailer";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

try {
	dotenv.config({
		path: path.resolve(__dirname, ".env"),
	});
} catch (error) {
	console.error(error);
}

export default buildConfig({
	admin: {
		user: Users.slug,
		autoRefresh: true,
		suppressHydrationWarning: true,
		components: {},
		dashboard: {
			defaultLayout: ({ req }) => {
				return [
					{
						widgetSlug: "active-orders",
						width: "full",
					},
					{
						widgetSlug: "collections",
						width: "full",
					},
				];
			},
			widgets: [
				{
					slug: "active-orders",
					Component: "/payload/ui/ActiveOrders#ActiveOrders",
					minWidth: "medium",
					maxWidth: "full",
				},
			],
		},
	},
	collections: [Users, Media, Discounts],
	globals: [Homepage, Business, Delivery],
	editor: lexicalEditor({}),
	secret: process.env.PAYLOAD_SECRET || "",
	typescript: {},
	db: mongooseAdapter({
		url: process.env.DATABASE_URI || "",
	}),
	email: nodemailerAdapter({
		defaultFromAddress:
			process.env.EMAIL_FROM_ADDRESS || "admin@angelicpastries.com",
		defaultFromName: process.env.EMAIL_FROM_NAME || "Angelic Pastries",
		transportOptions: {
			host: process.env.SMTP_HOST || "admin@example.com",
			port: Number(process.env.SMTP_PORT) || 587,
			auth: {
				user: process.env.SMTP_USER,
				pass: process.env.SMTP_TOKEN,
			},
			secure: false,
			tls: {
				rejectUnauthorized: false,
			},
		},
	}),
	jobs: {
		tasks: [
			{
				slug: "sendOrderReceiptEmail",
				retries: 3,
				inputSchema: [
					{
						name: "userEmail",
						type: "email",
						required: true,
					},
				],
				handler: async ({ input, req }) => {
					await req.payload.sendEmail({
						to: input.userEmail,
						subject: `Order Receipt${process.env.NEXT_PUBLIC_BUSINESS_NAME ? ` — ${process.env.NEXT_PUBLIC_BUSINESS_NAME}` : ""}`,
						text: `Thank you for your order! I'll get back to you in 24-48 hours.`,
					});

					return {
						output: {
							emailSent: true,
						},
					};
				},
			},
		],
	},
	plugins: [
		ecommercePlugin({
			access: {
				adminOnlyFieldAccess,
				adminOrPublishedStatus,
				isCustomer,
				isAdmin,
				isDocumentOwner,
			},
			customers: {
				slug: "users",
			},
			payments: {
				paymentMethods: [
					stripeAdapter({
						secretKey: process.env.STRIPE_SECRET_KEY!,
						publishableKey:
							process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
						webhookSecret:
							process.env.STRIPE_WEBHOOKS_SIGNING_SECRET!,
						webhooks: {
							// "payment_intent.created": ({ event, req }) => {
							// 	console.log({ event, data: event.data.object });
							// 	req.payload.logger.info(
							// 		`Stripe event: ${event.data.object}`,
							// 	);
							// },
						},
					}),
				],
			},
			currencies: Currencies,
			products: {
				productsCollectionOverride: Products,
				variants: {
					variantsCollectionOverride: Variants,
					variantTypesCollectionOverride: VariantTypes,
					variantOptionsCollectionOverride: VariantOptions,
				},
			},
			addresses: {
				addressesCollectionOverride: Addresses,
			},
			inventory: false,
			carts: {
				allowGuestCarts: true,
			},
			orders: {
				ordersCollectionOverride: Orders,
			},
		}),
	],
	sharp,
});
