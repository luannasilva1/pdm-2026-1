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
      Alert.alert("✦ sucesso", "tarefa atualizada!");
      router.back();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: removerTarefa,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tarefas"] });
      Alert.alert("✦ pronto", "tarefa removida.");
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
      Alert.alert("ops", "a descrição não pode estar vazia.");
      return;
    }
    updateMutation.mutate({ objectId: id, descricao, concluida });
  }

  function handleDelete() {
    Alert.alert(
      "excluir tarefa?",
      "essa ação não pode ser desfeita.",
      [
        { text: "cancelar", style: "cancel" },
        {
          text: "excluir",
          style: "destructive",
          onPress: () => deleteMutation.mutate(id),
        },
      ],
    );
  }

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#D96FA0" />
      </View>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: `✦ tarefa #${id}`,
          headerTintColor: "#7B2D5E",
          headerStyle: { backgroundColor: "#FDF6F9" },
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
          <Text style={styles.fieldLabel}>descrição</Text>
          <TextInput
            style={styles.input}
            value={descricao}
            onChangeText={setDescricao}
            multiline
            placeholderTextColor="#C991AE"
          />
        </View>

        <View style={styles.toggleRow}>
          <Text style={styles.toggleLabel}>concluída</Text>
          <Switch
            value={concluida}
            onValueChange={setConcluida}
            trackColor={{ false: "#F2C9DA", true: "#E8A0C0" }}
            thumbColor={concluida ? "#D96FA0" : "#fff"}
          />
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.btnSave}
            onPress={handleUpdate}
            disabled={updateMutation.isPending}
          >
            <Text style={styles.btnSaveText}>
              {updateMutation.isPending ? "salvando..." : "salvar alterações"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.btnDelete}
            onPress={handleDelete}
            disabled={deleteMutation.isPending}
          >
            <Text style={styles.btnDeleteText}>
              {deleteMutation.isPending ? "excluindo..." : "excluir tarefa"}
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
    backgroundColor: "#FDF6F9",
    gap: 16,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FDF6F9",
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    marginRight: 4,
  },
  badgePending: {
    backgroundColor: "#FDE8F3",
    borderWidth: 1,
    borderColor: "#F2C9DA",
  },
  badgeDone: {
    backgroundColor: "#EDE8FD",
    borderWidth: 1,
    borderColor: "#C9BAF2",
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "500",
    letterSpacing: 0.3,
  },
  badgeTextPending: {
    color: "#B04280",
  },
  badgeTextDone: {
    color: "#6B3FB0",
  },
  field: {
    gap: 6,
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: "500",
    color: "#C991AE",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  input: {
    borderWidth: 1,
    borderColor: "#E8B4C8",
    borderRadius: 16,
    padding: 14,
    fontSize: 15,
    backgroundColor: "#fff",
    minHeight: 80,
    textAlignVertical: "top",
    color: "#3D1F2E",
  },
  toggleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#F2C9DA",
    backgroundColor: "#fff",
  },
  toggleLabel: {
    fontSize: 15,
    color: "#3D1F2E",
  },
  actions: {
    marginTop: "auto",
    gap: 10,
  },
  btnSave: {
    height: 48,
    borderRadius: 20,
    backgroundColor: "#D96FA0",
    justifyContent: "center",
    alignItems: "center",
  },
  btnSaveText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "500",
    letterSpacing: 0.3,
  },
  btnDelete: {
    height: 48,
    borderRadius: 20,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#F2C9DA",
    justifyContent: "center",
    alignItems: "center",
  },
  btnDeleteText: {
    color: "#C45C7A",
    fontSize: 15,
    fontWeight: "500",
    letterSpacing: 0.3,
  },
});