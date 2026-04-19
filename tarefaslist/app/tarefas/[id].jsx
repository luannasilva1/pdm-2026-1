import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { atualizarTarefa, getTarefa, removerTarefa } from "@/api";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TarefaDetalhesPage() {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: tarefa, isLoading } = useQuery({
    queryKey: ["tarefa", id],
    queryFn: () => getTarefa(id),
  });

  const updateMutation = useMutation({
    mutationFn: atualizarTarefa,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tarefas"] });
      queryClient.invalidateQueries({ queryKey: ["tarefa", id] });
      Alert.alert("Sucesso", "Tarefa atualizada com sucesso!");
      router.back();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: removerTarefa,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tarefas"] });
      Alert.alert("Sucesso", "Tarefa removida com sucesso!");
      router.back();
    },
  });

  const [descricao, setDescricao] = useState("");
  const [concluida, setConcluida] = useState(false);

  useEffect(() => {
    if (tarefa) {
      setDescricao(tarefa.descricao);
      setConcluida(tarefa.concluida || false);
    }
  }, [tarefa]);

  function handleUpdate() {
    if (descricao.trim() === "") {
      Alert.alert("Erro", "A descrição não pode estar vazia.");
      return;
    }
    updateMutation.mutate({ objectId: id, descricao, concluida });
  }

  function handleDelete() {
    Alert.alert(
      "Confirmar exclusão",
      "Tem certeza que deseja excluir esta tarefa?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: () => deleteMutation.mutate(id),
        },
      ],
    );
  }

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#534AB7" />
      </View>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: `Tarefa #${id}`,
          headerRight: () => (
            <View
              style={[
                styles.badge,
                concluida ? styles.badgeDone : styles.badgePending,
              ]}
            >
              <Text
                style={[
                  styles.badgeText,
                  concluida ? styles.badgeTextDone : styles.badgeTextPending,
                ]}
              >
                {concluida ? "concluída" : "pendente"}
              </Text>
            </View>
          ),
        }}
      />
      <View style={[styles.container, { paddingBottom: insets.bottom + 20 }]}>
        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Descrição</Text>
          <TextInput
            style={styles.input}
            value={descricao}
            onChangeText={setDescricao}
            multiline
          />
        </View>

        <View style={styles.toggleRow}>
          <Text style={styles.toggleLabel}>Concluída</Text>
          <Switch
            value={concluida}
            onValueChange={setConcluida}
            trackColor={{ false: "#e0e0e0", true: "#AFA9EC" }}
            thumbColor={concluida ? "#534AB7" : "#fff"}
          />
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.btnSave}
            onPress={handleUpdate}
            disabled={updateMutation.isPending}
          >
            <Text style={styles.btnSaveText}>
              {updateMutation.isPending ? "Salvando..." : "Salvar alterações"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.btnDelete}
            onPress={handleDelete}
            disabled={deleteMutation.isPending}
          >
            <Text style={styles.btnDeleteText}>
              {deleteMutation.isPending ? "Excluindo..." : "Excluir tarefa"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
    gap: 16,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: 4,
  },
  badgePending: {
    backgroundColor: "#FAEEDA",
  },
  badgeDone: {
    backgroundColor: "#EAF3DE",
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "500",
  },
  badgeTextPending: {
    color: "#854F0B",
  },
  badgeTextDone: {
    color: "#3B6D11",
  },
  field: {
    gap: 6,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: "500",
    color: "#888",
    letterSpacing: 0.4,
    textTransform: "uppercase",
  },
  input: {
    borderWidth: 0.5,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 12,
    fontSize: 15,
    backgroundColor: "#f9f9f9",
    minHeight: 72,
    textAlignVertical: "top",
  },
  toggleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 14,
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: "#e0e0e0",
    backgroundColor: "#f9f9f9",
  },
  toggleLabel: {
    fontSize: 15,
    color: "#1a1a1a",
  },
  actions: {
    marginTop: "auto",
    gap: 10,
  },
  btnSave: {
    height: 48,
    borderRadius: 12,
    backgroundColor: "#534AB7",
    justifyContent: "center",
    alignItems: "center",
  },
  btnSaveText: {
    color: "#EEEDFE",
    fontSize: 15,
    fontWeight: "500",
  },
  btnDelete: {
    height: 48,
    borderRadius: 12,
    backgroundColor: "#FCEBEB",
    borderWidth: 0.5,
    borderColor: "#F09595",
    justifyContent: "center",
    alignItems: "center",
  },
  btnDeleteText: {
    color: "#A32D2D",
    fontSize: 15,
    fontWeight: "500",
  },
});