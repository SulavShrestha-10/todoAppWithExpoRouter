import { View, Text } from "react-native";
import React from "react";
import { Stack } from "expo-router";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";

const Layout = () => {
	return (
		<BottomSheetModalProvider>
			<Stack>
				<Stack.Screen name="index" options={{ title: "Login" }} />
				<Stack.Screen name="(tabs)" options={{ headerShown: false }} />
			</Stack>
		</BottomSheetModalProvider>
	);
};

export default Layout;
