import { BottomSheetBackdrop, BottomSheetModal } from "@gorhom/bottom-sheet";
import { addHours } from "date-fns";
import { addDoc, collection, doc, setDoc, updateDoc } from "firebase/firestore";
import { useFormik } from "formik";
import React, { forwardRef, useCallback, useMemo, useState } from "react";
import {
	ActivityIndicator,
	KeyboardAvoidingView,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";
import "react-native-get-random-values";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "../../AuthContext";
import { FIREBASE_DB } from "../../firebaseConfig";
import { Todo } from "../models/Todo";
import { generateTodoSchema } from "../validations/TodoForm";
import DatePicker from "./DatePicker";
import { COLORS, FONTS } from "../constants/theme";

interface TodoFormProps {
	onDismiss: () => void;
	todoData: Todo;
	editing: boolean;
	setFetching: (value: boolean) => void;
}

const TodoForm = forwardRef<BottomSheetModal | null, TodoFormProps>(
	({ onDismiss, todoData, editing, setFetching }, ref) => {
		const { user } = useAuth();
		const inset = useSafeAreaInsets();
		const [loading, setLoading] = useState(false);
		const renderBackdrop = useCallback(
			(props: any) => <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} />,
			[]
		);
		const [selectedDate, setSelectedDate] = useState(new Date());
		const snapPoints = useMemo(() => ["50%"], []);

		// const onSubmit = async () => {
		// 	await addDoc(collection(FIREBASE_DB, "todos"), {});
		// };
		const fieldLabels = {
			title: "Title",
			description: "Description",
			date: "Date",
		};
		const { handleChange, handleSubmit, handleBlur, values, errors, touched, setFieldValue, resetForm } = useFormik({
			validationSchema: generateTodoSchema(fieldLabels),
			initialValues: {
				title: todoData?.title ?? "",
				description: todoData?.description ?? "",
				date: todoData?.date ?? new Date().toISOString(),
				done: todoData?.done ?? false,
			},
			onSubmit: async (values) => {
				setLoading(true);
				setFetching(true);
				try {
					if (editing) {
						const todoRef = doc(FIREBASE_DB, `todos/${todoData.id}`);
						await updateDoc(todoRef, {
							title: values.title,
							description: values.description,
							date: values.date,
							done: values.done,
						});
						onDismiss();
					} else {
						const docRef = await addDoc(collection(FIREBASE_DB, "todos"), values);
						const payload: Todo = {
							id: docRef.id,
							userId: user?.uid,
							title: values.title,
							date: values.date,
							description: values.description,
							done: false,
						};
						onDismiss();
						await setDoc(docRef, payload, { merge: true });
						console.log(payload);
					}
				} catch (error) {
					console.error("Error submitting form:", error);
				} finally {
					setLoading(false);
					setFetching(false);
				}
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
					backgroundStyle={{ backgroundColor: COLORS.background }}
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
							{touched.title && errors.title && <Text style={styles.errorText}>{errors.title}</Text>}
							<Text style={styles.label}>{fieldLabels.description}</Text>
							<TextInput
								placeholder="Add description"
								style={styles.input}
								onChangeText={handleChange("description")}
								onBlur={handleBlur("description")}
								value={values.description}
							/>
							{touched.description && errors.description && <Text style={styles.errorText}>{errors.description}</Text>}
							<Text style={styles.label}>{fieldLabels.date}</Text>
							<DatePicker
								minimumDate={addHours(new Date(), 2)}
								selectedDate={new Date(values?.date)}
								mode="datetime"
								onDateChange={(date) => {
									setSelectedDate(date);
									setFieldValue("date", date.toISOString());
								}}
							/>
							{touched.date && errors.date && <Text style={styles.errorText}>{errors.date}</Text>}
						</View>
						{loading ? (
							<ActivityIndicator animating={loading} size="large" color="#0000ff" />
						) : (
							<TouchableOpacity style={styles.button} onPress={() => handleSubmit()}>
								<Text style={styles.buttonText}>Add</Text>
							</TouchableOpacity>
						)}
					</View>
				</BottomSheetModal>
			</KeyboardAvoidingView>
		);
	}
);

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
		marginVertical: 5,
		fontFamily: FONTS.roboto,
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
		fontFamily: FONTS.roboto,
	},
	button: {
		backgroundColor: COLORS.button,
		borderRadius: 10,
		padding: 10,
		alignItems: "center",
		justifyContent: "center",
		width: "100%",
		marginTop: 15,
	},
	buttonText: {
		color: "#fff",
		textAlign: "center",
		fontFamily: FONTS.roboto,
	},
	errorText: {
		color: "red",
		fontFamily: FONTS.roboto,
	},
});

export default TodoForm;
