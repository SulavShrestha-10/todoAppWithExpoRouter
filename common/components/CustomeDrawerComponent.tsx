import { DrawerContentScrollView, DrawerItem, DrawerItemList } from "@react-navigation/drawer";
import { FIREBASE_AUTH } from "../../firebaseConfig";
import { useRouter } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import { View, Text, ActivityIndicator } from "react-native";
import { COLORS, FONTS } from "../constants/theme";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ProfilePicture from "./ProfilePicture";
import { useAuth } from "../../AuthContext";
import { useEffect, useState } from "react";
import { UserInfo } from "../models/User";

export default function CustomDrawerComponent(props: any) {
	const { top, bottom } = useSafeAreaInsets();
	const { getUserDetails } = useAuth();
	const router = useRouter();
	const [userData, setUserData] = useState<UserInfo | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const data = await getUserDetails();
				setUserData(data);
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, [getUserDetails]);

	return (
		<View style={{ flex: 1, backgroundColor: COLORS.background }}>
			<DrawerContentScrollView {...props} scrollEnabled={false} contentContainerStyle={{ paddingTop: 10 + top }}>
				<View style={{ alignItems: "center", marginBottom: 20 }}>
					{loading ? (
						<ActivityIndicator size="large" color={COLORS.button} />
					) : (
						<>
							<ProfilePicture firstName={userData?.firstName ?? ""} lastName={userData?.lastName ?? ""} />
							<Text style={{ fontFamily: FONTS.roboto, fontSize: 18, marginTop: 10 }}>
								{`${userData?.firstName} ${userData?.lastName}`}
							</Text>
						</>
					)}
				</View>
				<DrawerItemList {...props} />
				<DrawerItem
					onPress={() => {
						FIREBASE_AUTH.signOut();
						router.replace("/");
					}}
					label={({ focused, color }) => (
						<Text
							style={{
								fontFamily: FONTS.roboto,
								fontWeight: focused ? "bold" : "normal",
								color: color,
							}}>
							Logout
						</Text>
					)}
					icon={({ size, color }) => <AntDesign name="logout" size={size} color={color} />}
				/>
			</DrawerContentScrollView>
		</View>
	);
}
