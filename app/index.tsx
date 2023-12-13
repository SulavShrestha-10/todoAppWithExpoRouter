import { useRouter } from "expo-router";
import { useFormik } from "formik";
import React from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { generateLoginSchema } from "../common/validations/LoginForm";
import { FIREBASE_AUTH } from "../firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";

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
			<TouchableOpacity style={styles.button} onPress={() => router.push("/register")}>
				<Text style={styles.buttonText}>Register</Text>
			</TouchableOpacity>
		</View>
	);
};
const styles = StyleSheet.create({
	container: {
		flex: 1,
		marginHorizontal: 20,
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
export default Page;
