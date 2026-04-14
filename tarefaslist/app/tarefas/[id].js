import { useEffect, useState } from "react";
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
import { useLocalSearchParams, useRouter } from "expo-router";
import { atualizarTarefa, deletarTarefa, getTarefas } from "@/api";

export default function TarefaDetalhePage() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: tarefas, isFetching } = useQuery({
    queryKey: ["tarefas"],
    queryFn: getTarefas,
  });

  const tarefa = tarefas?.find((t) => t.objectId === id);

  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [concluida, setConcluida] = useState(false);

  useEffect(() => {
    if (tarefa) {
      setTitulo(tarefa.titulo ?? "");
      setDescricao(tarefa.descricao ?? "");
      setConcluida(tarefa.concluida ?? false);
    }
  }, [tarefa]);

  const mutationAtualizar = useMutation({
    mutationFn: atualizarTarefa,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tarefas"] });
      queryClient.invalidateQueries({ queryKey: ["tarefa", id] });
      Alert.alert("Sucesso", "Tarefa atualizada com sucesso!", [{ text: "OK" }]);
    },
    onError: () => {
      Alert.alert("Erro", "Não foi possível atualizar a tarefa.");
    },
  });

  const mutationDeletar = useMutation({
    mutationFn: deletarTarefa,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tarefas"] });
      router.back();
    },
    onError: () => {
      Alert.alert("Erro", "Não foi possível excluir a tarefa.");
    },
  });

  const isLoading =
    isFetching || mutationAtualizar.isPending || mutationDeletar.isPending;

  function handleSalvar() {
    if (titulo.trim() === "") {
      Alert.alert("Título inválido", "Preencha o título da tarefa", [
        { text: "OK" },
      ]);
      return;
    }
    mutationAtualizar.mutate({
      objectId: id,
      dados: { titulo: titulo.trim(), descricao: descricao.trim(), concluida },
    });
  }

  function handleDeletar() {
    Alert.alert(
      "Excluir tarefa",
      "Tem certeza que deseja excluir esta tarefa?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: () => mutationDeletar.mutate(id),
        },
      ],
    );
  }

  if (isFetching && !tarefa) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!tarefa) {
    return (
      <View style={styles.container}>
        <Text>Tarefa não encontrada.</Text>
        <Button title="Voltar" onPress={() => router.back()} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {isLoading && <ActivityIndicator size="large" />}

      <Text style={styles.idText}>ID: {id}</Text>

      <View style={styles.hr} />

      <TextInput
        style={[styles.input, concluida && styles.strikethroughText]}
        placeholder="Título"
        value={titulo}
        onChangeText={setTitulo}
      />

      <TextInput
        style={[styles.input, styles.inputMultiline]}
        placeholder="Descrição"
        value={descricao}
        onChangeText={setDescricao}
        multiline
      />

      <View style={styles.switchRow}>
        <Text style={[styles.switchLabel, concluida && styles.strikethroughText]}>
          {concluida ? "Concluída" : "Pendente"}
        </Text>
        <Switch
          value={concluida}
          onValueChange={setConcluida}
          disabled={isLoading}
        />
      </View>

      <View style={styles.hr} />

      <Button
        title="Salvar alterações"
        onPress={handleSalvar}
        disabled={isLoading}
      />

      <View style={styles.hr} />

      <TouchableOpacity
        style={styles.deleteButton}
        onPress={handleDeletar}
        disabled={isLoading}
      >
        <Text style={styles.deleteButtonText}>Excluir tarefa</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 10,
  },
  idText: {
    fontSize: 12,
    color: "gray",
    alignSelf: "flex-start",
    paddingHorizontal: 4,
    marginBottom: 4,
  },
  hr: {
    height: 1,
    backgroundColor: "black",
    width: "95%",
    marginVertical: 10,
  },
  input: {
    borderColor: "black",
    borderWidth: 1,
    width: "90%",
    marginBottom: 5,
    paddingHorizontal: 8,
  },
  inputMultiline: {
    minHeight: 100,
    textAlignVertical: "top",
    paddingVertical: 6,
  },
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "90%",
    marginVertical: 8,
  },
  switchLabel: {
    fontSize: 15,
  },
  strikethroughText: {
    textDecorationLine: "line-through",
    textDecorationStyle: "solid",
    textDecorationColor: "red",
    color: "gray",
  },
  deleteButton: {
    backgroundColor: "#e53935",
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  deleteButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },
});