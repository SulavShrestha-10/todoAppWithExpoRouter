import { Stack } from "expo-router";
import React from "react";

const Layout = () => {
	return (
		<Stack>
			<Stack.Screen name="index" options={{ title: "My Todos" }} />	
		</Stack>
	);
};

export default Layout;
