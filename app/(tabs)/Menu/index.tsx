import { AntDesign } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { SetStateAction, useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useAuth } from "../../../AuthContext";
import ProfilePicture from "../../../common/components/ProfilePicture";
import { User } from "../../../common/models/User";
import { getUserData } from "../../../common/services/userService";
import { FIREBASE_AUTH } from "../../../firebaseConfig";
const initialUserState: User = {
	firstName: "",
	lastName: "",
	dateOfBirth: null,
};
const Menu = () => {
	const router = useRouter();
	const { user } = useAuth();
	const [userData, setUserData] = useState<User | null>(initialUserState);
	useEffect(() => {
		const fetchUserData = async () => {
			if (user) {
				const userInfo = await getUserData(user.uid);
				if (userInfo) {
					setUserData(userInfo as unknown as SetStateAction<User | null>);
				}
			}
		};
		fetchUserData();
	}, [user]);

	return (
		<View style={styles.container}>
			<TouchableOpacity style={styles.contentContainer} onPress={() => router.push("/(tabs)/Menu/details")}>
				<View style={styles.rowContainer}>
					<ProfilePicture firstName={userData?.firstName} lastName={userData?.lastName} />
					<View style={{ marginLeft: 5, flex: 1 }}>
						<Text style={{ fontSize: 18 }}>{`${userData?.firstName} ${userData?.lastName}`}</Text>
					</View>
					<AntDesign name="arrowright" size={24} color="black" />
				</View>
			</TouchableOpacity>

			<TouchableOpacity style={styles.contentContainer} onPress={() => router.push("/(tabs)/Menu/changePassword")}>
				<View style={styles.rowContainer}>
					<AntDesign name="unlock" size={28} color="black" style={{ marginRight: 20 }} />
					<Text style={{ flex: 1, fontSize: 18 }}>Change Password</Text>
					<AntDesign name="arrowright" size={24} color="black" />
				</View>
			</TouchableOpacity>

			<TouchableOpacity
				style={styles.contentContainer}
				onPress={() => {
					FIREBASE_AUTH.signOut();
					router.replace("/");
				}}>
				<View style={styles.rowContainer}>
					<AntDesign name="logout" size={24} color="black" style={{ marginRight: 25 }} />
					<Text style={{ flex: 1, fontSize: 18 }}>Logout</Text>
					<AntDesign name="arrowright" size={24} color="black" />
				</View>
			</TouchableOpacity>
		</View>
	);
};
const styles = StyleSheet.create({
	container: {
		flex: 1,
		margin: 20,
		
	},
	contentContainer: {
		flexDirection: "row",
		borderBottomWidth: 1,
		padding: 10,
		alignItems: "center",
	},
	rowContainer: {
		flexDirection: "row",
		alignItems: "center",
	},
	button: {
		backgroundColor: "#274690",
		borderRadius: 5,
		padding: 10,
		alignItems: "center",
		justifyContent: "center",
		marginVertical: 10,
	},
	buttonText: {
		color: "#fff",
		textAlign: "center",
	},
});
export default Menu;
