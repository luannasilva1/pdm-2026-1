import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Button,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { adicionarTarefa, atualizarTarefa, getTarefas } from "@/back4app";

export default function TarefasPage() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [titulo, setTitulo] = useState("");

  const { data, isFetching } = useQuery({
    queryKey: ["tarefas"],
    queryFn: getTarefas,
  });

  const mutationAdicionar = useMutation({
    mutationFn: adicionarTarefa,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tarefas"] }),
  });

  const mutationAtualizar = useMutation({
    mutationFn: atualizarTarefa,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tarefas"] }),
  });

  const isLoading =
    isFetching || mutationAdicionar.isPending || mutationAtualizar.isPending;

  async function handleAdicionarTarefaPress() {
    if (titulo.trim() === "") {
      Alert.alert("Título inválido", "Preencha o título da tarefa", [
        { text: "OK" },
      ]);
      return;
    }
    mutationAdicionar.mutate({ titulo, descricao: "", concluida: false });
    setTitulo("");
  }

  function handleToggleConcluida(tarefa) {
    mutationAtualizar.mutate({
      objectId: tarefa.objectId,
      dados: { concluida: !tarefa.concluida },
    });
  }

  return (
    <View style={styles.container}>
      {isLoading && <ActivityIndicator size="large" />}

      <TextInput
        style={styles.input}
        placeholder="Título"
        value={titulo}
        onChangeText={setTitulo}
      />
      <Button
        title="Adicionar Tarefa"
        onPress={handleAdicionarTarefaPress}
        disabled={mutationAdicionar.isPending}
      />

      <View style={styles.hr} />

      <View style={styles.tasksContainer}>
        {data?.map((t) => (
          <View key={t.objectId} style={styles.taskRow}>
            <TouchableOpacity
              style={styles.taskTextContainer}
              onPress={() => router.push(`/tarefas/${t.objectId}`)}
            >
              <Text
                style={[
                  styles.taskText,
                  t.concluida && styles.strikethroughText,
                ]}
              >
                {t.titulo || t.descricao}
              </Text>
            </TouchableOpacity>

            <Switch
              value={t.concluida ?? false}
              onValueChange={() => handleToggleConcluida(t)}
              disabled={mutationAtualizar.isPending}
            />
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 10,
  },
  input: {
    borderColor: "black",
    borderWidth: 1,
    width: "90%",
    marginBottom: 5,
    paddingHorizontal: 8,
  },
  hr: {
    height: 1,
    backgroundColor: "black",
    width: "95%",
    marginVertical: 10,
  },
  tasksContainer: {
    width: "100%",
    paddingHorizontal: 10,
    gap: 8,
  },
  taskRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  taskTextContainer: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  taskText: {
    fontSize: 15,
  },
  strikethroughText: {
    textDecorationLine: "line-through",
    textDecorationStyle: "solid",
    textDecorationColor: "red",
    color: "gray",
  },
});