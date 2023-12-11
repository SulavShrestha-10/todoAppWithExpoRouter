import { AntDesign, Entypo } from "@expo/vector-icons";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { addDays, format, isSameDay, isToday, isTomorrow } from "date-fns";
import { useRouter } from "expo-router";
import { collection, deleteDoc, doc, onSnapshot, updateDoc } from "firebase/firestore";
import React, { useEffect, useRef, useState } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ScrollView } from "react-native-virtualized-view";
import TodoForm from "../../../components/TodoForm";
import { FIREBASE_DB } from "../../../firebaseConfig";
import { Todo } from "../../../models/Todo";

const List = () => {
	const router = useRouter();
	const [todos, setTodos] = useState<Todo[]>([]);
	const bottomSheetRef = useRef<BottomSheetModal>(null);
	const [isFormVisible, setIsFormVisible] = useState(false);
	useEffect(() => {
		if (isFormVisible) {
			bottomSheetRef.current?.present();
		}
	}, [isFormVisible]);

	const handleOpenModal = () => {
		setIsFormVisible(true);
	};
	useEffect(() => {
		const todosRef = collection(FIREBASE_DB, "todos");
		const subscriber = onSnapshot(todosRef, {
			next: (snapshot) => {
				const todos: Todo[] = [];
				snapshot.docs.forEach((doc) => {
					const todoData = doc.data() as Todo;
					todos.push(todoData);
				});
				setTodos(todos);
			},
		});
		return () => subscriber();
	}, []);

	const renderTodos = ({ item }: { item: Todo }) => {
		const todoDate = new Date(item.date);
		let formattedDate;
		if (isToday(todoDate)) {
			formattedDate = `Today, ${format(todoDate, "hh:mm a")}`;
		} else if (isTomorrow(todoDate)) {
			formattedDate = `Tomorrow, ${format(todoDate, "hh:mm a")}`;
		} else {
			formattedDate = format(todoDate, "EEEE, MMMM dd, yyyy, hh:mm a");
		}
		const todoRef = doc(FIREBASE_DB, `todos/${item.id}`);
		const toggleDone = async () => {
			updateDoc(todoRef, { done: !item.done });
		};
		const deleteItem = async () => {
			deleteDoc(todoRef);
		};
		return (
			<View>
				<View style={styles.todoContainer}>
					<TouchableOpacity style={styles.todo} onPress={toggleDone}>
						{item.done && <AntDesign name="checkcircleo" size={30} color="green" />}
						{!item.done && <Entypo name="circle" size={30} color="black" />}
						<View style={{ flex: 1, marginLeft: 5 }}>
							<Text style={{ fontSize: 16 }}>{item.title}</Text>
							<Text style={{ fontSize: 12 }}>{formattedDate}</Text>
						</View>
					</TouchableOpacity>
					<AntDesign
						name="edit"
						size={30}
						color="black"
						style={{ marginRight: 5 }}
						onPress={() => console.log("Edit")}
					/>
					<AntDesign
						name="delete"
						size={30}
						color="red"
						onPress={() => {
							deleteItem();
						}}
					/>
				</View>
			</View>
		);
	};
	const todayTodos = todos.filter((todo) => isSameDay(new Date(todo.date), new Date()));
	const tomorrowTodos = todos.filter((todo) => isSameDay(new Date(todo.date), addDays(new Date(), 1)));
	const remainingTodos = todos.filter(
		(todo) => !isSameDay(new Date(todo.date), new Date()) && !isSameDay(new Date(todo.date), addDays(new Date(), 1))
	);
	return (
		<ScrollView showsVerticalScrollIndicator={true}>
			<View style={styles.container}>
				<View>
					{todayTodos.length > 0 && (
						<View style={{ marginBottom: 15 }}>
							<Text style={{ fontSize: 18, fontWeight: "bold" }}>Today</Text>
							<FlatList data={todayTodos} renderItem={renderTodos} keyExtractor={(item) => item.id} />
						</View>
					)}

					{tomorrowTodos.length > 0 && (
						<View style={{ marginBottom: 15 }}>
							<Text style={{ fontSize: 18, fontWeight: "bold" }}>Tomorrow</Text>
							<FlatList data={tomorrowTodos} renderItem={renderTodos} keyExtractor={(item) => item.id} />
						</View>
					)}
					{remainingTodos.length > 0 && (
						<View style={{ marginBottom: 15 }}>
							<Text style={{ fontSize: 18, fontWeight: "bold" }}>Later</Text>
							<FlatList data={remainingTodos} renderItem={renderTodos} keyExtractor={(item) => item.id} />
						</View>
					)}
				</View>
				<TouchableOpacity style={styles.button} onPress={() => handleOpenModal()}>
					<Text style={styles.buttonText}>Open</Text>
				</TouchableOpacity>
				{isFormVisible && <TodoForm ref={bottomSheetRef} onDismiss={() => setIsFormVisible(false)} />}
			</View>
		</ScrollView>
	);
};
const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingHorizontal: 20,
	},
	button: {
		backgroundColor: "#274690",
		borderRadius: 5,
		padding: 10,
		alignItems: "center",
		justifyContent: "center",
		marginVertical: 10,
	},
	todoContainer: {
		flexDirection: "row",
		alignItems: "center",
		marginVertical: 5,
		backgroundColor: "#fff",
		padding: 10,
		borderRadius: 5,
	},
	todo: {
		flexDirection: "row",
		alignItems: "center",
		flex: 1,
	},
	buttonText: {
		color: "#fff",
		textAlign: "center",
	},
	contentContainer: {
		flex: 1,
		alignItems: "center",
	},
});
export default List;
