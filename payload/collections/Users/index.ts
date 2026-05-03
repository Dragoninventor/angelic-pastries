import { CollectionConfig } from "payload";
import { ensureFirstUserIsAdmin } from "@/payload/collections/Users/hooks/ensureFirstUserIsAdmin";
import { adminOnly } from "@/payload/access/adminOnly";
import { adminOrSelf } from "@/payload/access/adminOrSelf";
import { checkRole } from "@/payload/access/utilities";
import { adminOnlyFieldAccess } from "@/payload/access/adminOnlyFieldAccess";
import { publicAccess } from "@/payload/access/publicAccess";

export const Users: CollectionConfig = {
	slug: "users",
	admin: {
		useAsTitle: "name",
		defaultColumns: ["name", "email"],
	},
	access: {
		admin: ({ req: { user } }) => checkRole(["admin"], user),
		create: publicAccess,
		delete: adminOnly,
		read: adminOrSelf,
		update: adminOrSelf,
	},
	hooks: {},
	auth: true,
	fields: [
		{
			name: "name",
			type: "text",
		},
		{
			name: "email",
			type: "email",
		},
		{
			name: "roles",
			type: "select",
			access: {
				create: adminOnlyFieldAccess,
				read: adminOnlyFieldAccess,
				update: adminOnlyFieldAccess,
			},
			defaultValue: ["customer"],
			hasMany: true,
			hooks: {
				beforeChange: [ensureFirstUserIsAdmin],
			},
			options: [
				{
					label: "admin",
					value: "admin",
				},
				{
					label: "customer",
					value: "customer",
				},
			],
		},
		{
			name: "orders",
			type: "join",
			collection: "orders",
			on: "customer",
			admin: {
				allowCreate: false,
				defaultColumns: [
					"id",
					"createdAt",
					"total",
					"currency",
					"items",
				],
			},
		},
		{
			name: "cart",
			type: "join",
			collection: "carts",
			on: "customer",
			admin: {
				allowCreate: false,
				defaultColumns: [
					"id",
					"createdAt",
					"total",
					"currency",
					"items",
				],
			},
		},
		{
			name: "addresses",
			type: "join",
			collection: "addresses",
			on: "customer",
			admin: {
				allowCreate: false,
				defaultColumns: ["id"],
			},
		},
	],
	timestamps: true,
};
