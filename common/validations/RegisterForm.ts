import * as yup from "yup";

export const generateRegisterSchema = (
	labels: Record<"email" | "password" | "firstName" | "lastName" | "dateOfBirth", string>
) => {
	return yup.object().shape({
		email: yup.string().required().label(labels.email),
		password: yup.string().label(labels.password),
		firstName: yup.string().label(labels.firstName),
		lastName: yup.string().label(labels.lastName),
		dateOfBirth: yup.date().label(labels.dateOfBirth),
	});
};
