import React from "react";
import { StyleSheet, View, Text } from "react-native";
import { useAuth } from "../../../AuthContext";

const Details = () => {
	const { user } = useAuth();

	return (
		<View style={styles.container}>
			<Text style={styles.text}>Change Password</Text>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		padding: 10,
	},
	text: {
		fontSize: 18,
		marginBottom: 10,
	},
});

export default Details;
