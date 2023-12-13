import * as yup from "yup";


export const generateTodoSchema = (labels: Record<"title" | "description" | "date", string>) => {
	return yup.object().shape({
		title: yup.string().required().label(labels.title),
		description: yup.string().label(labels.description),
		date: yup
			.date()
			.label(labels.date)
	});
};
