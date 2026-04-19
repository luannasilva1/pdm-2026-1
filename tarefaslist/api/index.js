import axios from "axios";

const urlBase = "https://prog-aos-2026-dngr-hgbvs6noh.vercel.app/tarefas";


export async function getTarefas() {
  const response = await axios.get(urlBase);
  return response.data;
}

export async function getTarefa(id) {
  const response = await axios.get(`${urlBase}/${id}`);
  return response.data;
}

export async function adicionarTarefa(novaTarefa) {
  const response = await axios.post(urlBase, novaTarefa);
  return response.data;
}

export async function atualizarTarefa(tarefaAtualizada) {
  const response = await axios.put(
    `${urlBase}/${tarefaAtualizada.objectId}`,
    tarefaAtualizada,
  );
  return response.data;
}

export async function removerTarefa(id) {
  const response = await axios.delete(`${urlBase}/${id}`);
  return response.data;
}