// userService.js
import { User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { FIREBASE_DB } from "../../firebaseConfig";

export const getUserData = async (userId: string) => {
	const userRef = doc(FIREBASE_DB, `users/${userId}`);
	const docSnapshot = await getDoc(userRef);
	if (docSnapshot.exists()) {
		const userInfo = docSnapshot.data() as User;
		console.log("User data:", userInfo);
		return userInfo;
	} else {
		console.log("No such user!");
		return null;
	}
};
