import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { useFonts } from "expo-font";
import { Stack, router, useRouter } from "expo-router";
import React, { useEffect } from "react";
import { ActivityIndicator } from "react-native";
import "react-native-gesture-handler";
import { AuthProvider, useAuth } from "../AuthContext";

const AuthNavigator = () => {
	const { authStatus } = useAuth();
	const router = useRouter();
	console.log("Auth Status: ", authStatus);
	useEffect(() => {
		if (authStatus === "success") {
			router.replace("/(tabs)");
		}
	}, [authStatus, router]);
	
	return (
		<Stack screenOptions={{ headerShown: false }}>
			{authStatus === "idle" ? <Stack.Screen name="index" /> : <Stack.Screen name="(tabs)" />}
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
