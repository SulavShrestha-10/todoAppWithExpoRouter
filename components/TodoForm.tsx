import { BottomSheetBackdrop, BottomSheetModal } from "@gorhom/bottom-sheet";
import { useFormik } from "formik";
import React, { forwardRef, useCallback, useMemo, useState } from "react";
import { KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { v4 as uuidv4 } from "uuid";
import { Todo } from "../models/Todo";
import { generateTodoSchema } from "../validations/TodoForm";
import DatePicker from "./DatePicker";
import { addDoc, collection, setDoc } from "firebase/firestore";
import { FIREBASE_DB } from "../firebaseConfig";
import "react-native-get-random-values";

interface TodoFormProps {
	onDismiss: () => void;
}

const TodoForm = forwardRef<BottomSheetModal | null, TodoFormProps>(({ onDismiss }, ref) => {
	const inset = useSafeAreaInsets();

	const renderBackdrop = useCallback(
		(props: any) => <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} />,
		[]
	);
	const [selectedDate, setSelectedDate] = useState(new Date());
	const snapPoints = useMemo(() => ["50%"], []);

	const onSubmit = async () => {
		await addDoc(collection(FIREBASE_DB, "todos"), {});
	};
	const fieldLabels = {
		title: "Title",
		description: "Description",
		date: "Date",
	};
	const { handleChange, handleSubmit, handleBlur, values, errors, touched, setFieldValue, resetForm } = useFormik({
		validationSchema: generateTodoSchema(fieldLabels),
		initialValues: {
			title: "",
			description: "",
			date: new Date().toISOString(),
			done: false,
		},
		onSubmit: async (values) => {
			const docRef = await addDoc(collection(FIREBASE_DB, "todos"), values);
			const payload: Todo = {
				id: docRef.id, 
				userId: uuidv4(),
				title: values.title,
				date: values.date,
				description: values.description,
				done: false,
			};
			onDismiss();
			await setDoc(docRef, payload, { merge: true }); 
			console.log(payload);
		},
	});
	return (
		<KeyboardAvoidingView behavior="padding">
			<BottomSheetModal
				style={styles.container}
				backdropComponent={renderBackdrop}
				topInset={inset.top}
				ref={ref}
				index={0}
				snapPoints={snapPoints}
				enablePanDownToClose={true}
				onDismiss={onDismiss}>
				<View style={styles.contentContainer}>
					<View style={{ width: "100%" }}>
						<Text style={styles.label}>{fieldLabels.title}</Text>
						<TextInput
							placeholder="Add new todo"
							style={styles.input}
							onChangeText={handleChange("title")}
							onBlur={handleBlur("title")}
							value={values.title}
						/>

						<Text style={styles.label}>{fieldLabels.description}</Text>
						<TextInput
							placeholder="Add description"
							style={styles.input}
							onChangeText={handleChange("description")}
							onBlur={handleBlur("description")}
							value={values.description}
						/>

						<Text style={styles.label}>{fieldLabels.date}</Text>
						<DatePicker
							selectedDate={selectedDate}
							onDateChange={(date) => {
								setSelectedDate(date);
								setFieldValue("date", date.toISOString());
							}}
						/>
					</View>
					<TouchableOpacity style={styles.button} onPress={() => handleSubmit()}>
						<Text style={styles.buttonText}>Add</Text>
					</TouchableOpacity>
				</View>
			</BottomSheetModal>
		</KeyboardAvoidingView>
	);
});

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingHorizontal: 20,
	},
	contentContainer: {
		flex: 1,
		alignItems: "center",
		justifyContent: "space-between",
		paddingBottom: 20,
	},
	input: {
		width: "100%",
		borderWidth: 1,
		borderRadius: 5,
		padding: 10,
		marginVertical: 10,
	},
	datePicker: {
		flexDirection: "row",
		borderWidth: 1,
		borderRadius: 5,
		padding: 10,
		marginVertical: 10,
	},
	label: {
		fontSize: 16,
		fontWeight: "bold",
	},
	button: {
		backgroundColor: "#274690",
		borderRadius: 5,
		padding: 10,
		alignItems: "center",
		justifyContent: "center",
		width: "100%",
	},
	buttonText: {
		color: "#fff",
		textAlign: "center",
	},
});

export default TodoForm;
