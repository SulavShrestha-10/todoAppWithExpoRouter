import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { initializeApp } from "firebase/app";
// * Have add a path in the tsconfig file to use getReactNativePersistence
// * "paths": {
// *		"@firebase/auth": ["./node_modules/@firebase/auth/dist/index.rn.d.ts"]
// *	}
import { getReactNativePersistence, initializeAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Initialize Firebase
const firebaseConfig = {
	apiKey: "AIzaSyDnjpisORJA5xpNIyHU8h8xgZZ2ENeUQkM",
	authDomain: "todoexporouter.firebaseapp.com",
	projectId: "todoexporouter",
	storageBucket: "todoexporouter.appspot.com",
	messagingSenderId: "670628242753",
	appId: "1:670628242753:web:3590275e53fdff1b1eedc0",
};

export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_DB = getFirestore(FIREBASE_APP);
export const FIREBASE_AUTH = initializeAuth(FIREBASE_APP, {
	persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});
