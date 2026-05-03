import {
	DefaultNodeTypes,
	type DefaultTypedEditorState,
	SerializedUploadNode,
} from "@payloadcms/richtext-lexical";
import {
	JSXConvertersFunction,
	RichText as ConvertRichText,
} from "@payloadcms/richtext-lexical/react";
import React, { HTMLAttributes } from "react";
import { Image } from "@/components/ui/Image";

type NodeTypes = DefaultNodeTypes;

const CustomUploadComponent: React.FC<{
	node: SerializedUploadNode;
}> = ({ node }) => {
	if (node.relationTo === "media") {
		return <Image payloadImage={node.value} />;
	}

	return null;
};

const jsxConverters: JSXConvertersFunction<NodeTypes> = ({
	defaultConverters,
}) => ({
	...defaultConverters,
	upload: ({ node }) => {
		return <CustomUploadComponent node={node} />;
	},
});

type Props = {
	data: DefaultTypedEditorState;
} & HTMLAttributes<HTMLDivElement>;

export const RichText = (props: Props) => {
	const { data, className } = props;

	return (
		<ConvertRichText
			converters={jsxConverters}
			className={`prose md:prose-md dark:prose-invert container mx-auto${className ? ` ${className}` : ""}`}
			data={data}
		/>
	);
};
