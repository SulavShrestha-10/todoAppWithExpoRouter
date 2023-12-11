import React, { useEffect, useState } from "react";
import { TextInput, Pressable, Text, Keyboard } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { AntDesign } from "@expo/vector-icons";

interface DatePickerProps {
	selectedDate: Date;
	onDateChange: (date: Date) => void;
}

function DatePicker({ selectedDate, onDateChange }: DatePickerProps) {
	const [datePickerVisible, setDatePickerVisible] = useState(false);

	const showDatePicker = () => {
		setDatePickerVisible(true);
	};

	const hideDatePicker = () => {
		setDatePickerVisible(false);
	};

	const handleConfirm = (date: Date) => {
		console.log(date);
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
				<TextInput value={selectedDate.toLocaleString()} style={{ flex: 1 }} editable={false} />
				<AntDesign name="calendar" size={24} color="black" />
			</Pressable>
			<DateTimePickerModal
				date={selectedDate}
				minimumDate={new Date()}
				isVisible={datePickerVisible}
				mode="datetime"
				onConfirm={handleConfirm}
				onCancel={hideDatePicker}
			/>
		</>
	);
}

export default DatePicker;
