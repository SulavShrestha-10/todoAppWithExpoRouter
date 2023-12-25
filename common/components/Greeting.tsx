import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { FONTS } from "../constants/theme";

interface GreetingProps {
	firstName: string;
	lastName: string;
}

export function Greeting({ firstName, lastName }: GreetingProps) {
	// Get the current hour
	const currentHour = new Date().getHours();

	// Define the greeting based on the current time
	let greeting;
	if (currentHour >= 5 && currentHour < 12) {
		greeting = "Good Morning";
	} else if (currentHour >= 12 && currentHour < 18) {
		greeting = "Good Afternoon";
	} else {
		greeting = "Good Evening";
	}

	return (
		<View>
			<Text style={styles.greeting}>{`${greeting},`}</Text>
			<Text style={styles.user}>{`${firstName} ${lastName}!`}</Text>
		</View>
	);
}
const styles = StyleSheet.create({
	greeting: { fontSize: 28, fontWeight: "500", fontFamily: FONTS.roboto },
	user: { fontSize: 24, fontWeight: "500", fontFamily: FONTS.roboto },
});
