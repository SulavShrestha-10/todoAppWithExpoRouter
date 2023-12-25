import { User, onAuthStateChanged } from "firebase/auth";
import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import { FIREBASE_AUTH, FIREBASE_DB } from "./firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { UserInfo } from "./common/models/User";

interface AuthContextProps {
	user: User | null;
	authStatus: "loading" | "success" | "idle" | "error" | undefined;
	getUserDetails: () => Promise<UserInfo | null>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
	const [user, setUser] = useState<User | null>(null);
	const [authStatus, setAuthStatus] = useState<"loading" | "success" | "idle" | "error" | undefined>(undefined);

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
		const fetchData = async () => {
			try {
				setAuthStatus("loading"); 
				const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, async (user) => {
					setUser(user);
					if (user) {
						setAuthStatus("success");
					} else {
						setAuthStatus("idle");
					}
				});
				return () => {
					unsubscribe();
				};
			} catch (error) {
				console.error("Error setting auth status:", error);
				setAuthStatus("error");
			}
		};

		fetchData();
	}, []);

	return <AuthContext.Provider value={{ user, authStatus, getUserDetails }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
	const context = useContext(AuthContext);

	if (!context) {
		throw new Error("useAuth must be used within an AuthProvider");
	}

	return context;
};
