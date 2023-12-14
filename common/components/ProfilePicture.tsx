import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface ProfilePictureProps {
	firstName: string | undefined;
	lastName: string | undefined;
}

function ProfilePicture({ firstName, lastName }: ProfilePictureProps) {
	const initials = `${firstName?.charAt(0)}${lastName?.charAt(0)}`;

	return (
		<View style={styles.profilePicContainer}>
			<Text style={styles.profilePicText}>{initials}</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	profilePicContainer: {
		width: 40,
		height: 40,
		borderRadius: 20,
		backgroundColor: "#3498db",
		alignItems: "center",
		justifyContent: "center",
		marginRight: 10,
	},
	profilePicText: {
		fontSize: 16,
		color: "#fff",
	},
});

export default ProfilePicture;
