import { CurrenciesConfig } from "@payloadcms/plugin-ecommerce/types";
import { USD } from "@payloadcms/plugin-ecommerce";

export const Currencies: CurrenciesConfig = {
	defaultCurrency: "USD",
	supportedCurrencies: [USD],
};
