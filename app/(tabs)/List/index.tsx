import { AntDesign, Entypo } from "@expo/vector-icons";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { addDays, format, isSameDay, isToday, isTomorrow } from "date-fns";
import { collection, deleteDoc, doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import React, { useEffect, useRef, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ScrollView } from "react-native-virtualized-view";
import TodoForm from "../../../common/components/TodoForm";
import { Todo } from "../../../common/models/Todo";
import { FIREBASE_DB } from "../../../firebaseConfig";
import { useAuth } from "../../../AuthContext";

const initialTodoState: Todo = {
	id: "",
	title: "",
	description: "",
	date: new Date().toISOString(),
	userId: "",
	done: false,
};

const List = () => {
	const { user } = useAuth();
	const [loading, setLoading] = useState(true);
	const [todos, setTodos] = useState<Todo[]>([]);
	const [editing, setEditing] = useState(false);
	const [todo, setTodo] = useState<Todo>(initialTodoState);
	const [id, setId] = useState("");
	const bottomSheetRef = useRef<BottomSheetModal>(null);
	const [isFormVisible, setIsFormVisible] = useState(false);

	useEffect(() => {
		if (isFormVisible) {
			bottomSheetRef.current?.present();
		}
	}, [isFormVisible]);

	useEffect(() => {
		const todosRef = collection(FIREBASE_DB, "todos");
		const subscriber = onSnapshot(todosRef, {
			next: (snapshot) => {
				const todos: Todo[] = [];
				snapshot.docs.forEach((doc) => {
					const todoData = doc.data() as Todo;
					if (todoData.userId === user?.uid) {
						todos.push(todoData);
					}
				});
				setTodos(todos);
				setLoading(false);
			},
		});
		return () => subscriber();
	}, []);

	const handleOpenModal = () => {
		setIsFormVisible(true);
	};
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

		const editItem = async () => {
			setEditing(true);
			setId(item.id);
			const docSnapshot = await getDoc(todoRef);
			if (docSnapshot.exists()) {
				const todoData = docSnapshot.data() as Todo;
				setTodo(todoData);
				handleOpenModal();
				console.log("Todo data:", todoData);
			} else {
				console.log("No such document!");
			}
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
					<AntDesign name="edit" size={30} color="black" style={{ marginRight: 5 }} onPress={() => editItem()} />
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
	const allTodos = [
		{ title: "Today", data: todayTodos },
		{ title: "Tomorrow", data: tomorrowTodos },
		{ title: "Later", data: remainingTodos },
	];
	const emptyView = () => {
		return loading ? (
			<ActivityIndicator animating={loading} size="large" color="#0000ff" />
		) : (
			<View style={{ flex: 1, alignItems: "center" }}>
				<Text>No todos available!</Text>
			</View>
		);
	};
	return (
		<ScrollView showsVerticalScrollIndicator={true}>
			<View style={styles.container}>
				{allTodos.map((category) => (
					<View key={category.title} style={{ marginBottom: 15 }}>
						<Text style={{ fontSize: 18, fontWeight: "bold" }}>{category.title}</Text>
						<FlatList
							data={category.data}
							renderItem={renderTodos}
							keyExtractor={(item) => item.id}
							ListEmptyComponent={emptyView}
						/>
					</View>
				))}
				<TouchableOpacity style={styles.button} onPress={() => handleOpenModal()}>
					<Text style={styles.buttonText}>Open</Text>
				</TouchableOpacity>
				{isFormVisible && (
					<TodoForm editing={editing} todoData={todo} ref={bottomSheetRef} onDismiss={() => setIsFormVisible(false)} />
				)}
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
