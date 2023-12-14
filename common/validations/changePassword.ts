import * as yup from "yup";

export const generateChangePasswordSchema = (
	labels: Record<"currentPassword" | "newPassword" | "confirmPassword", string>
) => {
	return yup.object().shape({
		currentPassword: yup
			.string()
			.required(labels.currentPassword + " is required")
			.min(8, labels.currentPassword + " must be at least 8 characters long")
			.label(labels.currentPassword),
		newPassword: yup
			.string()
			.required(labels.newPassword + " is required")
			.min(8, labels.newPassword + " must be at least 8 characters long")
			.matches(
				/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
				labels.newPassword + " must contain at least one uppercase letter, one lowercase letter, and one number"
			)
			.label(labels.newPassword),
		confirmPassword: yup
			.string()
			.required(labels.confirmPassword + " is required")
			.oneOf([yup.ref("newPassword")], "Passwords must match")
			.label(labels.confirmPassword),
	});
};
