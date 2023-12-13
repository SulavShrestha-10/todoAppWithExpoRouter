import * as yup from "yup";

export const generateLoginSchema = (labels: Record<"email" | "password", string>) => {
	return yup.object().shape({
		email: yup.string().required().label(labels.email),
		password: yup.string().label(labels.password),
	});
};
