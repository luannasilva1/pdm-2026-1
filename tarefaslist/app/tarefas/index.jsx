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
      Alert.alert("descrição inválida", "preencha a descrição da tarefa", [
        { text: "ok", onPress: () => {} },
      ]);
      return;
    }
    mutation.mutate({ descricao });
    setDescricao("");
  }

  return (
    <View style={styles.container}>
      {(isFetching || mutation.isPending) && (
        <ActivityIndicator size="large" color="#D96FA0" />
      )}

      <View style={styles.titleRow}>
        <Text style={styles.titleIcon}>✦</Text>
        <Text style={styles.titleText}>minhas tarefas</Text>
      </View>

      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="nova tarefa..."
          placeholderTextColor="#C991AE"
          value={descricao}
          onChangeText={setDescricao}
        />
        <TouchableOpacity
          style={styles.btnAdd}
          onPress={handleAdicionarTarefaPress}
          disabled={mutation.isPending}
        >
          <Text style={styles.btnAddText}>+ adicionar</Text>
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
    padding: 20,
    backgroundColor: "#FDF6F9",
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 20,
  },
  titleIcon: {
    fontSize: 18,
    color: "#D96FA0",
  },
  titleText: {
    fontSize: 17,
    fontWeight: "500",
    color: "#7B2D5E",
    letterSpacing: 0.3,
  },
  inputRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 14,
  },
  input: {
    flex: 1,
    height: 42,
    borderWidth: 1,
    borderColor: "#E8B4C8",
    borderRadius: 20,
    paddingHorizontal: 16,
    fontSize: 13,
    backgroundColor: "#fff",
    color: "#3D1F2E",
  },
  btnAdd: {
    height: 42,
    paddingHorizontal: 18,
    borderRadius: 20,
    backgroundColor: "#D96FA0",
    justifyContent: "center",
    alignItems: "center",
  },
  btnAddText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "500",
    letterSpacing: 0.3,
  },
  divider: {
    height: 1,
    backgroundColor: "#F2C9DA",
    marginBottom: 16,
    opacity: 0.8,
  },
  tasksContainer: {
    gap: 8,
  },
  taskItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 12,
    paddingHorizontal: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#F2C9DA",
    backgroundColor: "#fff",
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: "#D4A0BD",
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxDone: {
    backgroundColor: "#D96FA0",
    borderColor: "#D96FA0",
  },
  checkMark: {
    width: 5,
    height: 9,
    borderRightWidth: 2,
    borderBottomWidth: 2,
    borderColor: "#fff",
    transform: [{ rotate: "45deg" }, { translateX: -1 }, { translateY: -1 }],
  },
  taskText: {
    flex: 1,
    fontSize: 13.5,
    color: "#3D1F2E",
  },
  taskTextDone: {
    textDecorationLine: "line-through",
    color: "#C4A0B4",
  },
  chevron: {
    width: 6,
    height: 6,
    borderRightWidth: 1.5,
    borderTopWidth: 1.5,
    borderColor: "#D4A0BD",
    transform: [{ rotate: "45deg" }],
  },
});