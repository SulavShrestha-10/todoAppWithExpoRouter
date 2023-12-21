import { User, onAuthStateChanged } from "firebase/auth";
import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import { FIREBASE_AUTH, FIREBASE_DB } from "./firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { UserInfo } from "./common/models/User";

interface AuthContextProps {
	user: User | null;
	getUserDetails: () => Promise<UserInfo | null>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
	const [user, setUser] = useState<User | null>(null);

	const getUserDetails = async (): Promise<UserInfo | null> => {
		if (user) {
			try {
				const userDocRef = doc(FIREBASE_DB, "users", user.uid);
				const userDocSnap = await getDoc(userDocRef);

				if (userDocSnap.exists()) {
					const userInfo = userDocSnap.data() as UserInfo;
					console.log("User Detail:", userInfo);
					return userInfo;
				} else {
					console.log("User details not found");
					return null;
				}
			} catch (error) {
				console.error("Error fetching user details:", error);
				return null;
			}
		}

		return null;
	};

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, (user) => {
			setUser(user);
		});

		return () => {
			unsubscribe();
		};
	}, [user]);

	return <AuthContext.Provider value={{ user, getUserDetails }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
	const context = useContext(AuthContext);

	if (!context) {
		throw new Error("useAuth must be used within an AuthProvider");
	}

	return context;
};
