import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from "firebase/auth";
import { useFormik } from "formik";
import React from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useAuth } from "../../../AuthContext";
import { generateChangePasswordSchema } from "../../../common/validations/changePassword";

const ChangePassword = () => {
	const { user } = useAuth();
	const labels = {
		currentPassword: "Current Password",
		newPassword: "New Password",
		confirmPassword: "New Password Again",
	};

	const validationSchema = generateChangePasswordSchema(labels);

	const { handleChange, handleSubmit, handleBlur, values, errors, touched } = useFormik({
		initialValues: {
			currentPassword: "",
			newPassword: "",
			confirmPassword: "",
		},
		validationSchema: validationSchema,
		onSubmit: async (values) => {
			try {
				if (!user || !user.email) {
					throw new Error("User is not available");
				}
				const credential = EmailAuthProvider.credential(user.email, values.currentPassword);
				await reauthenticateWithCredential(user, credential);

				// Update the user's password
				await updatePassword(user, values.newPassword);
				// Password successfully changed
				Alert.alert("Success", "Password changed successfully!");
			} catch (error: any) {
				console.error("Error changing password: " + error.message);
				Alert.alert("Error", "Failed to change password. Please check your current password and try again.");
			}
		},
	});

	return (
		<View style={styles.container}>
			<Text style={styles.text}>Change Password</Text>

			<View style={styles.inputContainer}>
				<Text style={styles.label}>{labels.currentPassword}</Text>
				<TextInput
					style={styles.input}
					placeholder={`Enter ${labels.currentPassword}`}
					secureTextEntry
					onChangeText={handleChange("currentPassword")}
					onBlur={handleBlur("currentPassword")}
					value={values.currentPassword}
				/>
				<Text style={styles.errorText}>{touched.currentPassword && errors.currentPassword}</Text>
			</View>

			<View style={styles.inputContainer}>
				<Text style={styles.label}>{labels.newPassword}</Text>
				<TextInput
					style={styles.input}
					placeholder={`Enter ${labels.newPassword}`}
					secureTextEntry
					onChangeText={handleChange("newPassword")}
					onBlur={handleBlur("newPassword")}
					value={values.newPassword}
				/>
				<Text style={styles.errorText}>{touched.newPassword && errors.newPassword}</Text>
			</View>

			<View style={styles.inputContainer}>
				<Text style={styles.label}>{labels.confirmPassword}</Text>
				<TextInput
					style={styles.input}
					placeholder={`Enter ${labels.confirmPassword}`}
					secureTextEntry
					onChangeText={handleChange("confirmPassword")}
					onBlur={handleBlur("confirmPassword")}
					value={values.confirmPassword}
				/>
				<Text style={styles.errorText}>{touched.confirmPassword && errors.confirmPassword}</Text>
			</View>

			<TouchableOpacity style={styles.button} onPress={() => handleSubmit()}>
				<Text style={styles.buttonText}>Change Password</Text>
			</TouchableOpacity>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		padding: 20,
	},
	text: {
		fontSize: 18,
		marginBottom: 10,
	},
	inputContainer: {
		width: "100%",
		marginBottom: 10,
	},
	label: {
		fontSize: 16,
		marginBottom: 5,
	},
	input: {
		height: 40,
		borderColor: "gray",
		borderWidth: 1,
		padding: 10,
		width: "100%",
	},
	errorText: {
		color: "red",
	},
	button: {
		backgroundColor: "#274690",
		borderRadius: 5,
		padding: 10,
		alignItems: "center",
		justifyContent: "center",
		width: "100%",
		marginTop: 15,
	},
	buttonText: {
		color: "#fff",
		textAlign: "center",
	},
});

export default ChangePassword;
