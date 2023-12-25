import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from "firebase/auth";
import { useFormik } from "formik";
import React, { useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useAuth } from "../../AuthContext";
import { generateChangePasswordSchema } from "../../common/validations/changePassword";
import Header from "../../common/components/Header";
import { COLORS, FONTS } from "../../common/constants/theme";
import { Entypo } from "@expo/vector-icons";

const ChangePassword = () => {
	const { user } = useAuth();
	const [loading, setLoading] = useState(false);
	const [showCurPassword, setCurShowPassword] = useState(false);
	const [showNewPassword, setNewShowPassword] = useState(false);
	const [showConfirmPassword, setConfirmShowPassword] = useState(false);
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
				await updatePassword(user, values.newPassword);
				Alert.alert("Success", "Password changed successfully!");
			} catch (error: any) {
				console.error("Error changing password: " + error.message);
				Alert.alert("Error", "Failed to change password. Please check your current password and try again.");
			}
		},
	});

	return (
		<View style={styles.container}>
			<Header
				title="Show Password"
				subTitle="Update your account security by changing your password"
				style={{ paddingVertical: 50 }}
			/>
			<View style={styles.inputContainer}>
				<Text style={styles.label}>{labels.currentPassword}</Text>
				<View style={styles.input}>
					<TextInput
						style={{ flex: 1, fontFamily: FONTS.roboto }}
						placeholder={`Enter ${labels.currentPassword}`}
						secureTextEntry={!showCurPassword}
						onChangeText={handleChange("currentPassword")}
						onBlur={handleBlur("currentPassword")}
						value={values.currentPassword}
					/>
					<TouchableOpacity onPress={() => setCurShowPassword(!showCurPassword)}>
						{showCurPassword ? (
							<Entypo name="eye-with-line" size={24} color="black" />
						) : (
							<Entypo name="eye" size={24} color="black" />
						)}
					</TouchableOpacity>
				</View>
				<Text style={styles.errorText}>{touched.currentPassword && errors.currentPassword}</Text>
			</View>

			<View style={styles.inputContainer}>
				<Text style={styles.label}>{labels.newPassword}</Text>
				<View style={styles.input}>
					<TextInput
						style={{ flex: 1, fontFamily: FONTS.roboto }}
						placeholder={`Enter ${labels.newPassword}`}
						secureTextEntry={!showNewPassword}
						onChangeText={handleChange("newPassword")}
						onBlur={handleBlur("newPassword")}
						value={values.newPassword}
					/>
					<TouchableOpacity onPress={() => setNewShowPassword(!showNewPassword)}>
						{showNewPassword ? (
							<Entypo name="eye-with-line" size={24} color="black" />
						) : (
							<Entypo name="eye" size={24} color="black" />
						)}
					</TouchableOpacity>
				</View>
				<Text style={styles.errorText}>{touched.newPassword && errors.newPassword}</Text>
			</View>

			<View style={styles.inputContainer}>
				<Text style={styles.label}>{labels.confirmPassword}</Text>
				<View style={styles.input}>
					<TextInput
						style={{ flex: 1, fontFamily: FONTS.roboto }}
						placeholder={`Enter ${labels.confirmPassword}`}
						secureTextEntry={!showConfirmPassword}
						onChangeText={handleChange("confirmPassword")}
						onBlur={handleBlur("confirmPassword")}
						value={values.confirmPassword}
					/>
					<TouchableOpacity onPress={() => setConfirmShowPassword(!showConfirmPassword)}>
						{showConfirmPassword ? (
							<Entypo name="eye-with-line" size={24} color="black" />
						) : (
							<Entypo name="eye" size={24} color="black" />
						)}
					</TouchableOpacity>
				</View>

				<Text style={styles.errorText}>{touched.confirmPassword && errors.confirmPassword}</Text>
			</View>

			<TouchableOpacity style={styles.button} onPress={() => handleSubmit()}>
				{!loading ? (
					<Text style={styles.buttonText}>Change Password</Text>
				) : (
					<ActivityIndicator animating={loading} size="small" color="#fff" />
				)}
			</TouchableOpacity>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingHorizontal: 20,
		backgroundColor: COLORS.background,
	},
	text: {
		fontSize: 18,
		marginBottom: 10,
		fontFamily: FONTS.roboto,
	},
	inputContainer: {
		width: "100%",
	},
	label: {
		fontSize: 16,
		fontFamily: FONTS.roboto,
	},
	input: {
		flexDirection: "row",
		width: "100%",
		borderWidth: 1,
		borderRadius: 10,
		padding: 10,
		marginVertical: 10,
		fontFamily: FONTS.roboto,
	},
	errorText: {
		color: "red",
		fontFamily: FONTS.roboto,
	},
	button: {
		backgroundColor: COLORS.button,
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
