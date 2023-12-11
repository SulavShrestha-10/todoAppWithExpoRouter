import { Tabs } from "expo-router";
import React from "react";
import { Entypo } from "@expo/vector-icons";

const Layout = () => {
	return (
		<Tabs>
			<Tabs.Screen
				name="List"
				options={{
					headerShown: false,
					tabBarIcon: ({ size, color }) => <Entypo name="home" size={size} color={color} />,
					title: "Home",
				}}
			/>
			<Tabs.Screen
				name="Menu"
				options={{
					headerShown: false,
					tabBarIcon: ({ size, color }) => <Entypo name="menu" size={size} color={color} />,
					title: "Menu",
				}}
			/>
		</Tabs>
	);
};

export default Layout;
