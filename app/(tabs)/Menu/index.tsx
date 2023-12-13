import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { FIREBASE_AUTH } from "../../../firebaseConfig";

const Menu = () => {
	const router = useRouter();
	return (
		<View style={styles.container}>
			<TouchableOpacity
				style={styles.button}
				onPress={() => {
					FIREBASE_AUTH.signOut();
					router.replace("/");
				}}>
				<Text style={styles.buttonText}>Logout</Text>
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
export default Menu;
