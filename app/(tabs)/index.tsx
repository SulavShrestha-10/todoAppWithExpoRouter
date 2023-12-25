import { AntDesign, Entypo } from "@expo/vector-icons";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { addDays, format, isAfter, isBefore, isSameDay, isToday, isTomorrow } from "date-fns";
import { collection, deleteDoc, doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import React, { useEffect, useRef, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View, SafeAreaView } from "react-native";
import { ScrollView } from "react-native-virtualized-view";
import { useAuth } from "../../AuthContext";
import TodoForm from "../../common/components/TodoForm";
import { Todo } from "../../common/models/Todo";
import { FIREBASE_DB } from "../../firebaseConfig";
import { COLORS, FONTS } from "../../common/constants/theme";
import Header from "../../common/components/Header";
import { Greeting } from "../../common/components/Greeting";
import { UserInfo } from "../../common/models/User";

const initialTodoState: Todo = {
	id: "",
	title: "",
	description: "",
	date: new Date().toISOString(),
	userId: "",
	done: false,
};

const List = () => {
	const { user, getUserDetails } = useAuth();
	const [userData, setUserData] = useState<UserInfo | null>(null);
	const [fetching, setfetching] = useState(true);
	const [todos, setTodos] = useState<Todo[]>([]);
	const [editing, setEditing] = useState(false);
	const [todo, setTodo] = useState<Todo>(initialTodoState);
	const [id, setId] = useState("");
	const bottomSheetRef = useRef<BottomSheetModal>(null);
	const [isFormVisible, setIsFormVisible] = useState(false);
	const [loading, setLoading] = useState(true);
	useEffect(() => {
		const fetchData = async () => {
			try {
				const data = await getUserDetails();
				setUserData(data);
			} finally {
				setLoading(false);
			}
		};
		fetchData();
	}, [getUserDetails]);
	useEffect(() => {
		if (isFormVisible) {
			bottomSheetRef.current?.present();
		}
	}, [isFormVisible]);

	useEffect(() => {
		setfetching(true);
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
				setfetching(false);
			},
			error: (error) => {
				console.error("Error fetching data:", error);
				setfetching(false);
			},
		});
		return () => subscriber();
	}, []);

	const handleOpenModal = () => {
		setEditing(false);
		setId("");
		setTodo(initialTodoState);
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
				setIsFormVisible(true);
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
					{!item.done && (
						<AntDesign name="edit" size={30} color="black" style={{ marginRight: 5 }} onPress={() => editItem()} />
					)}
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
	const today = new Date();
	const todayTodos = todos.filter(
		(todo) => isSameDay(new Date(todo.date), today) || (isSameDay(new Date(todo.date), today) && todo.done === true)
	);

	const tomorrowTodos = todos.filter((todo) => isSameDay(new Date(todo.date), addDays(today, 1)));
	const remainingTodos = todos.filter(
		(todo) => isBefore(new Date(todo.date), today) && !isBefore(new Date(todo.date), addDays(today, 1))
	);
	const incompleteTodos = todos.filter((todo) => isBefore(new Date(todo.date), today) && todo.done !== true);

	const allTodos = [
		{ title: "Today", data: todayTodos },
		{ title: "Tomorrow", data: tomorrowTodos },
		{ title: "Later", data: remainingTodos },
		{ title: "Incomplete", data: incompleteTodos },
	];
	const emptyView = () => {
		return !fetching ? (
			<View style={{ flex: 1, alignItems: "center" }}>
				<Text>No todos available!</Text>
			</View>
		) : null;
	};
	const renderData = () => {
		return (
			<View>
				{fetching ? (
					<ActivityIndicator animating={fetching} size="large" color={COLORS.button} />
				) : (
					<>
						{allTodos.map(
							(category) =>
								category.data.length > 0 && (
									<View key={category.title} style={{ marginBottom: 15 }}>
										<Text style={{ fontSize: 18, fontWeight: "bold" }}>{category.title}</Text>
										<FlatList
											data={category.data}
											renderItem={renderTodos}
											keyExtractor={(item) => item.id}
											ListEmptyComponent={emptyView}
										/>
									</View>
								)
						)}
						{todos.length === 0 && (
							<Text style={{ fontSize: 18, fontWeight: "bold", textAlign: "center", fontFamily: FONTS.roboto }}>
								Add your todos to view them in the list.
							</Text>
						)}
					</>
				)}
			</View>
		);
	};

	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
			<ScrollView showsVerticalScrollIndicator={true}>
				<View style={styles.greetingContainer}>
					{loading ? (
						<ActivityIndicator size="large" color={COLORS.button} />
					) : (
						<Greeting firstName={userData?.firstName ?? ""} lastName={userData?.lastName ?? ""} />
					)}
					<View style={{ flexDirection: "row", alignItems: "center", paddingVertical: 10 }}>
						<Header style={{ flex: 1 }} title="My Todos" />
						<TouchableOpacity style={styles.button} onPress={() => handleOpenModal()}>
							<Entypo name="add-to-list" size={24} color="white" />
						</TouchableOpacity>
					</View>
				</View>
				<View style={styles.container}>
					{renderData()}
					{isFormVisible && (
						<TodoForm
							setFetching={setfetching}
							editing={editing}
							todoData={todo}
							ref={bottomSheetRef}
							onDismiss={() => setIsFormVisible(false)}
						/>
					)}
				</View>
			</ScrollView>
		</SafeAreaView>
	);
};
const styles = StyleSheet.create({
	greetingContainer: {
		flexDirection: "column",
		backgroundColor: COLORS.box,
		padding: 20,
		borderBottomEndRadius: 10,
		borderBottomStartRadius: 10,
	},
	container: {
		flex: 1,
		padding: 20,
	},
	addButton: {
		position: "absolute",
		bottom: 0,
		right: 20,
		backgroundColor: COLORS.button,
		borderRadius: 30,
		padding: 10,
		alignItems: "center",
		justifyContent: "center",
		zIndex: 1,
	},
	todoContainer: {
		flexDirection: "row",
		alignItems: "center",
		marginVertical: 5,
		backgroundColor: COLORS.box,
		padding: 10,
		borderRadius: 20,
		borderColor: "grey",
	},
	todo: {
		flexDirection: "row",
		alignItems: "center",
		flex: 1,
		color: COLORS.text,
	},
	contentContainer: {
		flex: 1,
		alignItems: "center",
	},
	button: {
		backgroundColor: COLORS.button,
		borderRadius: 10,
		padding: 10,
		alignItems: "center",
		justifyContent: "center",
		marginTop: 15,
	},
	buttonText: {
		color: "#fff",
		textAlign: "center",
		fontFamily: FONTS.roboto,
	},
});
export default List;
