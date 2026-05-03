"use client";

import { FormInput } from "@/components/ui/form/FormInput";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import { SyntheticEvent, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Message } from "@/components/ui/Message";
import { Form } from "@/components/ui/form/Form";
import { sendContactEmail } from "@/actions/sendContactEmail";

export const ContactForm = () => {
	const [token, setToken] = useState<string | null>(null);
	const [status, setStatus] = useState<{
		success?: boolean;
		error?: string;
	} | null>(null);
	const [loading, setLoading] = useState(false);
	const captchaRef = useRef<HCaptcha>(null);

	const handleSubmit = async (event: SyntheticEvent<HTMLFormElement>) => {
		event.preventDefault();

		setLoading(true);
		setStatus(null);

		if (!token) {
			captchaRef.current?.execute();

			return;
		}

		const formData = new FormData(event.currentTarget);
		const result = await sendContactEmail(formData, token);

		setLoading(false);

		if (result.success) {
			setStatus({ success: true });
			setToken(null);
			captchaRef.current?.resetCaptcha();
			(event.target as HTMLFormElement).reset();
		} else {
			setStatus({ error: result.error });
		}
	};

	return (
		<Form onSubmit={handleSubmit}>
			<FormInput
				label="Name"
				name="name"
				id="name"
				type="text"
				required
				placeholder="Your Name"
			/>
			<FormInput
				label="Email"
				name="email"
				id="email"
				type="email"
				required
				placeholder="your@email.com"
			/>
			<div className="flex flex-col gap-2.5">
				<label htmlFor="message" className="text-sm">
					Message
				</label>
				<textarea
					id="message"
					name="message"
					required
					rows={5}
					className="focus:ring-sage-500 w-full rounded border border-gray-300 bg-gray-50 p-4 leading-6 focus:outline-none focus:ring-1"
					placeholder="How can we help?"
				/>
			</div>
			<div className="my-2 overflow-hidden">
				{process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY ? (
					<HCaptcha
						sitekey={
							process.env.NODE_ENV === "production"
								? process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY
								: "10000000-ffff-ffff-ffff-000000000001"
						}
						onVerify={(token) => setToken(token)}
						onError={(error) => {
							console.error(`hCaptcha Error: ${error}`);

							setToken(null);
						}}
						onExpire={() => setToken(null)}
						ref={captchaRef}
					/>
				) : (
					<Message
						message={
							"Captcha site key is unset; please contact the site admin if you see this."
						}
						type={"info"}
					/>
				)}
			</div>

			<Button type="submit" disabled={loading}>
				{loading ? "Sending..." : "Send Message"}
			</Button>

			{status?.success && (
				<Message
					type="success"
					message="Thank you! Your message has been sent. I'll get back to you soon."
					className="mb-6"
				/>
			)}

			{status?.error && (
				<Message type="error" message={status.error} className="mb-6" />
			)}
		</Form>
	);
};
