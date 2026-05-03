import type { FieldAccess } from "payload";
import { checkRole } from "@/payload/access/utilities";

export const isCustomer: FieldAccess = ({ req: { user } }) => {
	if (user) return checkRole(["customer"], user);

	return false;
};
