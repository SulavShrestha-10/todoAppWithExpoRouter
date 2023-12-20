import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { Stack, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { AuthProvider, useAuth } from "../AuthContext";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { ActivityIndicator } from "react-native";

SplashScreen.preventAutoHideAsync();
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
		<Stack screenOptions={{ headerShown: false }}>
			{!user ? (
				<Stack.Screen name="index" />
			) : (
				<Stack.Screen name="(tabs)"/>
			)}
		</Stack>
	);
};

const Layout = () => {
	const [fontsLoaded] = useFonts({
		"Roboto-Regular": require("../assets/fonts/Roboto-Regular.ttf"),
	});

	if (!fontsLoaded) {
		return <ActivityIndicator animating={!fontsLoaded} size="large" />;
	}

	return (
		<AuthProvider>
			<BottomSheetModalProvider>
				<AuthNavigator />
			</BottomSheetModalProvider>
		</AuthProvider>
	);
};

export default Layout;
