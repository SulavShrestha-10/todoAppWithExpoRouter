import React, { SetStateAction, useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useAuth } from "../../../AuthContext";
import { User } from "../../../common/models/User";
import { getUserData } from "../../../common/services/userService";
const initialUserState: User = {
	firstName: "",
	lastName: "",
	dateOfBirth: null,
};
const Details = () => {
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
			<View style={styles.innerContainer}>
				<Text style={styles.text}>Full Name: {`${userData?.firstName} ${userData?.lastName}`}</Text>
				<Text style={styles.text}>Date Of Birth: {userData?.dateOfBirth}</Text>
				<Text style={styles.text}>Email: {user?.email}</Text>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		padding: 10,
	},
	innerContainer: {
		backgroundColor: "#fff",
		borderRadius: 10,
		padding: 20,
		width: "90%",
	},
	text: {
		fontSize: 18,
		marginBottom: 10,
	},
});

export default Details;
