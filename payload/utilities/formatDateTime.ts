import { format } from "date-fns";

// TODO: REWORK DATETIME FUNCTION

type Props = {
	date: string;
	format?: string;
};

export const formatDateTime = ({
	date,
	format: formatFromProps,
}: Props): string => {
	if (!date) return "";

	const dateFormat = formatFromProps ?? "dd/MM/yyyy";

	const formattedDate = format(new Date(date), dateFormat);

	return formattedDate;
};
