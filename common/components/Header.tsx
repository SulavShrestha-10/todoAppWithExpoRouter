import React from "react";
import { View, Text, StyleSheet, ViewStyle, TouchableOpacity } from "react-native";
import { COLORS, FONTS } from "../constants/theme";
import { Entypo } from "@expo/vector-icons";

interface HeaderProps {
	title: string;
	subTitle?: string;
	style?: ViewStyle;
	onButtonPress?: () => void;
}

function Header({ title, subTitle, style, onButtonPress }: HeaderProps): JSX.Element {
	return (
		<View style={[styles.container, style]}>
			<View style={{ flexDirection: "row", alignItems: "center" }}>
				<Text style={styles.title}>{title}</Text>
				{onButtonPress && (
					<TouchableOpacity style={styles.button} onPress={onButtonPress}>
						<Entypo name="add-to-list" size={24} color="white" />
					</TouchableOpacity>
				)}
			</View>
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
		flex: 1,
	},
	subTitle: {
		fontSize: 16,
		marginTop: 5,
		fontFamily: FONTS.roboto,
		fontWeight: "300",
		color: "#808080",
	},
	button: {
		backgroundColor: COLORS.button,
		borderRadius: 30,
		padding: 10,
		alignItems: "center",
		justifyContent: "center",
	},
});

export default Header;
