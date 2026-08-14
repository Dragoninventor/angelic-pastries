import Script from "next/script";

type Props = {
	orderId: string;
	amount: number;
	currency?: string | null;
};

export const GoogleAdsConversion = ({
	orderId,
	amount,
	currency = "USD",
}: Props) => {
	// Google Ads expects the value in base units (e.g. dollars), but it's stored in cents
	const valueInBaseUnit = amount / 100;

	return (
		<Script id="google-ads-conversion" strategy="afterInteractive">
			{`
				gtag('event', 'conversion', {
					'send_to': 'AW-18311865890/Mz_sCKCijM4cEKLM45tE',
					'value': ${valueInBaseUnit},
					'currency': '${currency || "USD"}',
					'transaction_id': '${orderId}'
				});
			`}
		</Script>
	);
};
