"use client";

import React from "react";
import { ContactForm } from "@/components/contact/ContactForm";

const Contact = () => {
	return (
		<main className="container mx-auto min-h-[80vh] max-w-2xl px-4 py-12">
			<h1 className="text-sage-900 mb-8 text-3xl font-bold">
				Contact Us
			</h1>
			<ContactForm />
		</main>
	);
};

export default Contact;
