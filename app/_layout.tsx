import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { useFonts } from "expo-font";
import { Stack, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { ActivityIndicator } from "react-native";
import "react-native-gesture-handler";
import { AuthProvider, useAuth } from "../AuthContext";

SplashScreen.preventAutoHideAsync();
const AuthNavigator = () => {
	const { user } = useAuth();
	const router = useRouter();
	console.log("User: ", user);
	useEffect(() => {
		if (user) {
			router.replace("/(tabs)");
		}
	}, [user, router]);

	return (
		<Stack screenOptions={{ headerShown: false }}>
			{!user ? <Stack.Screen name="index" /> : <Stack.Screen name="(tabs)" />}
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
