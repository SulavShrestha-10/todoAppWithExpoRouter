import React, { useEffect, useState } from "react";
import { TextInput, Pressable, Text, Keyboard } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { AntDesign } from "@expo/vector-icons";

interface DatePickerProps {
	minimumDate?: Date;
	selectedDate: Date;
	mode: "time" | "date" | "datetime" | undefined;
	onDateChange: (date: Date) => void;
}

function DatePicker({ minimumDate, selectedDate, onDateChange, mode }: DatePickerProps) {
	const [datePickerVisible, setDatePickerVisible] = useState(false);

	const showDatePicker = () => {
		setDatePickerVisible(true);
	};

	const hideDatePicker = () => {
		setDatePickerVisible(false);
	};

	const handleConfirm = (date: Date) => {
		onDateChange(date);
		hideDatePicker();
	};

	useEffect(() => {
		if (datePickerVisible) {
			Keyboard.dismiss();
		}
	}, [datePickerVisible]);

	return (
		<>
			<Pressable
				style={{
					flexDirection: "row",
					borderWidth: 1,
					borderRadius: 5,
					padding: 10,
					marginVertical: 10,
				}}
				onPress={showDatePicker}>
				<TextInput
					value={mode === "date" ? selectedDate.toLocaleDateString() : selectedDate.toLocaleDateString()}
					style={{ flex: 1 }}
					editable={false}
				/>
				<AntDesign name="calendar" size={24} color="black" />
			</Pressable>
			<DateTimePickerModal
				date={new Date(selectedDate)}
				minimumDate={minimumDate}
				isVisible={datePickerVisible}
				mode={mode}
				onConfirm={handleConfirm}
				onCancel={hideDatePicker}
			/>
		</>
	);
}

export default DatePicker;
