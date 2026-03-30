import { Text, View } from "react-native";
import { Link } from "expo-router";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Olá, Turma!</Text>
      <View style={{ width: 100, backgroundColor: "blue", flex: 0.1 }} />
      <View style={{ width: 100, backgroundColor: "red", flex: 0.4 }} />
      <Link href="/about">About</Link>
      <Link href="/tarefas">Tarefas</Link>
    </View>
  );
}
