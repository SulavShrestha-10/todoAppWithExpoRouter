import { useFormik } from "formik";
import React, { useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import DatePicker from "../common/components/DatePicker";
import { generateRegisterSchema } from "../common/validations/RegisterForm";
import { Register } from "../common/models/Register";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { FIREBASE_AUTH, FIREBASE_DB } from "../firebaseConfig";
import { doc, setDoc } from "firebase/firestore";
import { useRouter } from "expo-router";

const RegisterPage = () => {
	const auth = FIREBASE_AUTH;
	const router = useRouter();
	const [selectedDate, setSelectedDate] = useState(new Date());
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
			<TextInput
				placeholder={fieldLabels.password}
				style={styles.input}
				onChangeText={handleChange("password")}
				onBlur={handleBlur("password")}
				value={values.password}
				secureTextEntry
				autoCapitalize="none"
			/>
			<TouchableOpacity style={styles.button} onPress={() => handleSubmit()}>
				<Text style={styles.buttonText}>Register</Text>
			</TouchableOpacity>
		</View>
	);
};
const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingHorizontal: 20,
	},
	contentContainer: {
		flex: 1,
		alignItems: "center",
		justifyContent: "space-between",
		paddingBottom: 20,
	},
	input: {
		width: "100%",
		borderWidth: 1,
		borderRadius: 5,
		padding: 10,
		marginVertical: 10,
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
		fontWeight: "bold",
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
export default RegisterPage;
