import { useFormik } from "formik";
import React, { useState } from "react";
import { ActivityIndicator, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import DatePicker from "../common/components/DatePicker";
import { generateRegisterSchema } from "../common/validations/RegisterForm";
import { Register } from "../common/models/Register";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { FIREBASE_AUTH, FIREBASE_DB } from "../firebaseConfig";
import { doc, setDoc } from "firebase/firestore";
import { useRouter } from "expo-router";
import Header from "../common/components/Header";
import { COLORS, FONTS } from "../common/constants/theme";
import { Entypo } from "@expo/vector-icons";

const RegisterPage = () => {
	const auth = FIREBASE_AUTH;
	const router = useRouter();
	const [showPassword, setShowPassword] = useState(false);
	const [selectedDate, setSelectedDate] = useState(new Date());
	const [loading, setLoading] = useState(false);
	const fieldLabels = {
		firstName: "First Name",
		lastName: "Last Name",
		email: "Email",
		password: "Password",
		dateOfBirth: "Date of Birth",
	};
	const { handleChange, handleSubmit, handleBlur, values, errors, touched, setFieldValue, resetForm } = useFormik({
		validationSchema: generateRegisterSchema(fieldLabels),
		initialValues: {
			firstName: "",
			lastName: "",
			email: "",
			password: "",
			dateOfBirth: new Date().toDateString(),
		},
		onSubmit: async (values) => {
			const payload: Register = {
				firstName: values.firstName,
				lastName: values.lastName,
				email: values.email,
				password: values.password,
				dateOfBirth: values.dateOfBirth,
			};
			try {
				const userCredentials = await createUserWithEmailAndPassword(auth, payload.email, payload.password);

				const { firstName, lastName, dateOfBirth } = payload;
				const userDocRef = doc(FIREBASE_DB, `users/${userCredentials.user.uid}`);

				try {
					await setDoc(userDocRef, {
						firstName,
						lastName,
						dateOfBirth,
					});
					console.log("User data set successfully");
				} catch (error: any) {
					console.error("Error setting user data:", error.message);
				}
				router.replace("/");
				console.log("User Created!");
			} catch (error: any) {
				alert("Sign up failed: " + error.message);
			}
		},
	});
	return (
		<View style={styles.container}>
			<Header
				title="Create an account"
				subTitle="Please enter your information to create your account"
				style={{ paddingVertical: 60 }}
			/>
			<Text style={styles.label}>{fieldLabels.firstName}</Text>
			<TextInput
				placeholder={fieldLabels.firstName}
				style={styles.input}
				onChangeText={handleChange("firstName")}
				onBlur={handleBlur("firstName")}
				value={values.firstName}
			/>
			<Text style={styles.label}>{fieldLabels.lastName}</Text>
			<TextInput
				placeholder={fieldLabels.lastName}
				style={styles.input}
				onChangeText={handleChange("lastName")}
				onBlur={handleBlur("lastName")}
				value={values.lastName}
			/>
			<Text style={styles.label}>{fieldLabels.dateOfBirth}</Text>
			<DatePicker
				selectedDate={new Date(values?.dateOfBirth)}
				mode="date"
				onDateChange={(date) => {
					setSelectedDate(date);
					setFieldValue("dateOfBirth", date.toDateString());
				}}
			/>
			<Text style={styles.label}>{fieldLabels.email}</Text>
			<TextInput
				placeholder={fieldLabels.email}
				style={styles.input}
				onChangeText={handleChange("email")}
				onBlur={handleBlur("email")}
				value={values.email}
				autoCapitalize="none"
			/>

			<Text style={styles.label}>{fieldLabels.password}</Text>
			<View style={styles.input}>
				<TextInput
					placeholder={fieldLabels.password}
					style={{ flex: 1, fontFamily: FONTS.roboto }}
					onChangeText={handleChange("password")}
					onBlur={handleBlur("password")}
					value={values.password}
					autoCapitalize="none"
					secureTextEntry={!showPassword}
				/>
				<TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
					{showPassword ? (
						<Entypo name="eye-with-line" size={24} color="black" />
					) : (
						<Entypo name="eye" size={24} color="black" />
					)}
				</TouchableOpacity>
			</View>
			<TouchableOpacity style={styles.button} onPress={() => handleSubmit()}>
				{!loading ? (
					<Text style={styles.buttonText}>Register</Text>
				) : (
					<ActivityIndicator animating={loading} size="small" color="#fff" />
				)}
			</TouchableOpacity>
			<View style={styles.registerContainer}>
				<Text style={styles.registerText}>Already have an account?</Text>
				<TouchableOpacity style={styles.registerButton} onPress={() => router.replace("/")}>
					<Text style={styles.registerButtonText}>Sign in</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
};
const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingHorizontal: 20,
		backgroundColor: COLORS.background,
	},
	contentContainer: {
		flex: 1,
		alignItems: "center",
		justifyContent: "space-between",
		paddingBottom: 20,
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
	datePicker: {
		flexDirection: "row",
		borderWidth: 1,
		borderRadius: 5,
		padding: 10,
		marginVertical: 10,
	},
	label: {
		fontSize: 16,
		fontFamily: FONTS.roboto,
		fontWeight: "bold",
	},
	button: {
		backgroundColor: COLORS.button,
		borderRadius: 10,
		padding: 10,
		alignItems: "center",
		justifyContent: "center",
		width: "100%",
		marginTop: 15,
	},
	buttonText: {
		color: "#fff",
		textAlign: "center",
		fontFamily: FONTS.roboto,
	},
	registerContainer: {
		flexDirection: "row",
		justifyContent: "center",
		marginTop: 15,
	},
	registerText: {
		fontSize: 16,
		fontFamily: FONTS.roboto,
	},
	registerButton: {
		marginLeft: 5,
	},
	registerButtonText: {
		fontSize: 16,
		color: COLORS.button,
		fontWeight: "bold",
	},
});
export default RegisterPage;
