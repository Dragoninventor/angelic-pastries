"use server";

import { getPayload } from "payload";
import configPromise from "@payload-config";

export async function sendContactEmail(
	formData: FormData,
	captchaToken: string,
) {
	const payload = await getPayload({ config: configPromise });

	const hcaptchaSecret = process.env.HCAPTCHA_SECRET_KEY;
	const hcaptchaSiteKey = process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY;

	if (!hcaptchaSecret) {
		console.error("HCAPTCHA_SECRET_KEY is not set");
		return { error: "Captcha verification failed (server error)." };
	}

	if (!hcaptchaSiteKey) {
		console.error("NEXT_PUBLIC_HCAPTCHA_SITE_KEY is not set");
		return { error: "Captcha verification failed (server error)." };
	}

	const isProduction = process.env.NODE_ENV === "production";

	const params = new URLSearchParams({
		sitekey: hcaptchaSiteKey,
		secret: hcaptchaSecret,
		response: captchaToken,
	});

	const verify = await fetch("https://api.hcaptcha.com/siteverify", {
		method: "POST",
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
		},
		body: `secret=${hcaptchaSecret}&response=${captchaToken}&sitekey=${process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY || ""}`,
	});

	const data = await verify.json();
	console.log(data);
	if (!data.success) {
		return { error: "Captcha verification failed." };
	}

	const name = formData.get("name");
	const email = formData.get("email");
	const message = formData.get("message");

	if (!name || !email || !message) {
		return { error: "Please fill out all fields." };
	}

	try {
		const business = await payload.findGlobal({ slug: "business" });
		const toEmail = business.businessEmail;

		await payload.sendEmail({
			to: toEmail,
			from: process.env.EMAIL_FROM_ADDRESS,
			replyTo: email,
			subject: `New Contact Form Submission from ${name}`,
			text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
		});

		return { success: true };
	} catch (error) {
		console.error("Error sending contact email:", error);
		return { error: "Failed to send message. Please try again later." };
	}
}
