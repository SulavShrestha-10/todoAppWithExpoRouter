import React from "react";
import { View, Text, StyleSheet, ViewStyle } from "react-native";
import { FONTS } from "../constants/theme";

interface HeaderProps {
	title: string;
	subTitle?: string;
	style?: ViewStyle;
}

function Header({ title, subTitle, style }: HeaderProps): JSX.Element {
	return (
		<View style={[styles.container, style]}>
			<Text style={styles.title}>{title}</Text>
			{subTitle && <Text style={styles.subTitle}>{subTitle}</Text>}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		paddingVertical: 75,
	},
	title: {
		fontSize: 24,
		fontWeight: "bold",
		fontFamily: FONTS.roboto,
	},
	subTitle: {
		fontSize: 16,
		marginTop: 5,
		fontFamily:FONTS.roboto,
		fontWeight: "300",
		color: "#808080",
	},
});

export default Header;
