import React from "react";
import { View, Text, StyleSheet, ViewStyle, TouchableOpacity } from "react-native";
import { COLORS, FONTS } from "../constants/theme";
import { Entypo } from "@expo/vector-icons";

interface HeaderProps {
	title: string;
	subTitle?: string;
	style?: ViewStyle;
}

function Header({ title, subTitle, style }: HeaderProps) {
	return (
		<View style={[style]}>
			<Text style={styles.title}>{title}</Text>
			{subTitle && <Text style={styles.subTitle}>{subTitle}</Text>}
		</View>
	);
}

const styles = StyleSheet.create({
	title: {
		fontSize: 24,
		fontWeight: "700",
		fontFamily: FONTS.roboto,
	},
	subTitle: {
		fontSize: 16,
		marginTop: 5,
		fontFamily: FONTS.roboto,
		fontWeight: "300",
		color: "#808080",
	},
});

export default Header;
