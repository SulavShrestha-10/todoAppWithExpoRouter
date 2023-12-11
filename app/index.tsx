import { View, Text, Button, StyleSheet } from "react-native";
import React from "react";
import { Link, useRouter } from "expo-router";
import { TouchableOpacity } from "react-native-gesture-handler";

const Page = () => {
	const router = useRouter();
	return (
		<View style={styles.container}>
			<TouchableOpacity style={styles.button} onPress={() => router.push("/register")}>
				<Text style={styles.buttonText}>Register</Text>
			</TouchableOpacity>
			<Link href="/register" style={styles.button} asChild>
				<Text style={styles.buttonText}>Register with Link Tag</Text>
			</Link>
			<TouchableOpacity style={styles.button} onPress={() => router.replace("/List/")}>
				<Text style={styles.buttonText}>Login</Text>
			</TouchableOpacity>
		</View>
	);
};
const styles = StyleSheet.create({
	container: {
		flex: 1,
		marginHorizontal: 20,
	},
	button: {
		backgroundColor: "#274690",
		borderRadius: 5,
		padding: 10,
		alignItems: "center",
		justifyContent: "center",
		marginVertical: 10,
	},
	buttonText: {
		color: "#fff",
		textAlign: "center",
	},
});
export default Page;
