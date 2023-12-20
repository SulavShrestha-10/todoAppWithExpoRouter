import { addHours } from "date-fns";
import * as yup from "yup";

export const generateTodoSchema = (labels: Record<"title" | "description" | "date", string>) => {
	return yup.object().shape({
		title: yup.string().required().label(labels.title),
		description: yup.string().label(labels.description),
		date: yup
			.date()
			.label(labels.date)
			.test("is-future-date", "Expiry date should be at least 1 hour ahead", (value) => {
				if (!value) {
					return true;
				}
				const currentDate = new Date();
				const oneHourAhead = addHours(currentDate, 1);
				return value >= oneHourAhead;
			}),
	});
};
