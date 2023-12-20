import { useRouter } from "expo-router";
import { useFormik } from "formik";
import React from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { generateLoginSchema } from "../common/validations/LoginForm";
import { FIREBASE_AUTH } from "../firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import Header from "../common/components/Header";

const Page = () => {
	const router = useRouter();
	const auth = FIREBASE_AUTH;
	const fieldLabels = {
		email: "Email",
		password: "Password",
	};
	const { handleChange, handleSubmit, handleBlur, values } = useFormik({
		validationSchema: generateLoginSchema(fieldLabels),
		initialValues: {
			email: "",
			password: "",
		},
		onSubmit: async (values) => {
			try {
				const res = await signInWithEmailAndPassword(auth, values.email, values.password);
				router.replace("/(tabs)/List");
				console.log("User Logged in!");
			} catch (error: any) {
				alert("Login up failed: " + error.message);
			}
		},
	});
	return (
		<View style={styles.container}>
			<Header
				style={{ marginTop: 100,}}
				title="Welcome Back"
				subTitle="Please enter you e-mail and password to login"
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
				autoCapitalize="none"
				secureTextEntry
			/>

			<TouchableOpacity style={styles.button} onPress={() => handleSubmit()}>
				<Text style={styles.buttonText}>Login</Text>
			</TouchableOpacity>

			<View style={styles.registerContainer}>
				<Text style={styles.registerText}>Not registered yet?</Text>
				<TouchableOpacity style={styles.registerButton} onPress={() => router.push("/register")}>
					<Text style={styles.registerButtonText}>Sign up</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
};
const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingHorizontal: 20,
		backgroundColor: "#FFFAF6",
		
	},
	input: {
		width: "100%",
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
		backgroundColor: "#3A6789",
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
	},
	registerContainer: {
		flexDirection: "row",
		justifyContent: "center",
		marginTop: 15,
	},
	registerText: {
		fontSize: 16,
	},
	registerButton: {
		marginLeft: 5,
	},
	registerButtonText: {
		fontSize: 16,
		color: "#274690",
		fontWeight: "bold",
	},
});
export default Page;
