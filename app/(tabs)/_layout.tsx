import { Drawer } from "expo-router/drawer";
import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AntDesign } from "@expo/vector-icons";
import CustomDrawerComponent from "../../common/components/CustomeDrawerComponent";
import { COLORS, FONTS } from "../../common/constants/theme";
import { Text } from "react-native";
const Layout = () => {
	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
			<Drawer
				screenOptions={{
					headerTitle: "",
					headerStyle: { backgroundColor: COLORS.background },
					drawerActiveBackgroundColor: COLORS.box,
					drawerActiveTintColor: COLORS.text,
				}}
				drawerContent={CustomDrawerComponent}>
				<Drawer.Screen
					name="index"
					options={{
						drawerLabel: ({ focused, color }) => (
							<Text
								style={{
									fontFamily: FONTS.roboto,
									fontWeight: focused ? "bold" : "normal",
									color: color,
								}}>
								Home
							</Text>
						),
						drawerIcon: ({ color, size }) => <AntDesign name="home" size={size} color={color} />,
					}}
				/>
				<Drawer.Screen
					name="changePassword"
					options={{
						drawerLabel: ({ focused, color }) => (
							<Text
								style={{
									fontFamily: FONTS.roboto,
									fontWeight: focused ? "bold" : "normal",
									color: color,
								}}>
								Change Password
							</Text>
						),
						drawerIcon: ({ color, size }) => <AntDesign name="unlock" size={size} color={color} />,
					}}
				/>
				<Drawer.Screen
					name="details"
					options={{
						drawerLabel: ({ focused, color }) => (
							<Text
								style={{
									fontFamily: FONTS.roboto,
									fontWeight: focused ? "bold" : "normal",
									color: color,
								}}>
								Details
							</Text>
						),
						drawerIcon: ({ color, size }) => <AntDesign name="profile" size={size} color={color} />,
					}}
				/>
			</Drawer>
		</GestureHandlerRootView>
	);
};

export default Layout;
