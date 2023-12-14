import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { Stack, useRouter } from "expo-router";
import React, { useEffect } from "react";
import { AuthProvider, useAuth } from "../AuthContext";

const AuthNavigator = () => {
	const { user } = useAuth();
	const router = useRouter();
	console.log("User: ", user);
	useEffect(() => {
		if (user) {
			router.replace("/(tabs)/List");
		}
	}, [user, router]);

	return (
		<Stack>
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
