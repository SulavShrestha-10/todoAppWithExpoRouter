import { Stack } from "expo-router";
import React from "react";

const Layout = () => {
	return (
		<Stack>
			<Stack.Screen name="index" options={{ title: "Menu" }} />
			<Stack.Screen name="details" options={{ title: "Detail Screen" }} />
			<Stack.Screen name="changePassword" options={{ title: "Change Password" }} />
		</Stack>
	);
};

export default Layout;
