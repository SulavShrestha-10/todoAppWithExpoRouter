import React from "react";
import { StyleSheet, Text, View, StyleProp, ViewStyle } from "react-native";

interface ProfilePictureProps {
	firstName: string | undefined;
	lastName: string | undefined;
	style?: StyleProp<ViewStyle>;
}

function ProfilePicture({ firstName, lastName, style }: ProfilePictureProps) {
	const initials = `${firstName?.charAt(0)}${lastName?.charAt(0)}`;

	return (
		<View style={[styles.profilePicContainer, style]}>
			<Text style={styles.profilePicText}>{initials}</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	profilePicContainer: {
		width: 80,
		height: 80,
		borderRadius: 20,
		backgroundColor: "#E5922D",
		alignItems: "center",
		justifyContent: "center",
		marginRight: 10,
	},
	profilePicText: {
		fontSize: 28,
		color: "#fff",
	},
});

export default ProfilePicture;
