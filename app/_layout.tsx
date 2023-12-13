import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { Stack } from "expo-router";
import React from "react";
import { AuthProvider, useAuth } from "../AuthContext";

const AuthNavigator = () => {
	const { user } = useAuth();
	console.log("User: ", user);

	return (
		<Stack initialRouteName="index">
			{!user ? (
				<Stack.Screen name="index" options={{ title: "Login" }} />
			) : (
				<Stack.Screen name="(tabs)" options={{ headerShown: false }} />
			)}
		</Stack>
	);
};
const Layout = () => {
	return (
		<AuthProvider>
			<BottomSheetModalProvider>
				<AuthNavigator />
			</BottomSheetModalProvider>
		</AuthProvider>
	);
};

export default Layout;
