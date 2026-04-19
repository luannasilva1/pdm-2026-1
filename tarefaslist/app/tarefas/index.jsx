import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adicionarTarefa, getTarefas } from "@/api";
import { useRouter } from "expo-router";

export default function TarefasPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data, isFetching } = useQuery({
    queryKey: ["tarefas"],
    queryFn: getTarefas,
  });
  const mutation = useMutation({
    mutationFn: adicionarTarefa,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tarefas"] });
    },
  });
  const [descricao, setDescricao] = useState("");

  async function handleAdicionarTarefaPress() {
    if (descricao.trim() === "") {
      Alert.alert("Descrição inválida", "Preencha a descrição da tarefa", [
        { text: "OK", onPress: () => {} },
      ]);
      return;
    }
    mutation.mutate({ descricao });
    setDescricao("");
  }

  return (
    <View style={styles.container}>
      {(isFetching || mutation.isPending) && (
        <ActivityIndicator size="large" color="#534AB7" />
      )}

      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Nova tarefa..."
          placeholderTextColor="#888"
          value={descricao}
          onChangeText={setDescricao}
        />
        <TouchableOpacity
          style={styles.btnAdd}
          onPress={handleAdicionarTarefaPress}
          disabled={mutation.isPending}
        >
          <Text style={styles.btnAddText}>+ Adicionar</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.divider} />

      <View style={styles.tasksContainer}>
        {data?.map((t) => (
          <Pressable
            key={t.objectId}
            style={styles.taskItem}
            onPress={() => router.push(`/tarefas/${t.objectId}`)}
          >
            <View style={[styles.checkbox, t.concluida && styles.checkboxDone]}>
              {t.concluida && <View style={styles.checkMark} />}
            </View>
            <Text style={[styles.taskText, t.concluida && styles.taskTextDone]}>
              {t.descricao}
            </Text>
            <View style={styles.chevron} />
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  inputRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 12,
  },
  input: {
    flex: 1,
    height: 42,
    borderWidth: 0.5,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 12,
    fontSize: 14,
    backgroundColor: "#f9f9f9",
  },
  btnAdd: {
    height: 42,
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: "#534AB7",
    justifyContent: "center",
    alignItems: "center",
  },
  btnAddText: {
    color: "#EEEDFE",
    fontSize: 13,
    fontWeight: "500",
  },
  divider: {
    height: 0.5,
    backgroundColor: "#e0e0e0",
    marginBottom: 12,
  },
  tasksContainer: {
    gap: 8,
  },
  taskItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 12,
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: "#e0e0e0",
    backgroundColor: "#fff",
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxDone: {
    backgroundColor: "#534AB7",
    borderColor: "#534AB7",
  },
  checkMark: {
    width: 5,
    height: 9,
    borderRightWidth: 2,
    borderBottomWidth: 2,
    borderColor: "#EEEDFE",
    transform: [{ rotate: "45deg" }, { translateX: -1 }, { translateY: -1 }],
  },
  taskText: {
    flex: 1,
    fontSize: 14,
    color: "#1a1a1a",
  },
  taskTextDone: {
    textDecorationLine: "line-through",
    color: "#999",
  },
  chevron: {
    width: 6,
    height: 6,
    borderRightWidth: 1.5,
    borderTopWidth: 1.5,
    borderColor: "#bbb",
    transform: [{ rotate: "45deg" }],
  },
});