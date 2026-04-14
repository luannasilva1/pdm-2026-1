import axios from "axios";

const urlBase = "https://prog-aos-2026-dngr-hgbvs6noh.vercel.app";


export async function getTarefas() {
  const response = await axios.get(urlBase, { headers });
  return response.data;
}

export async function getTarefa(id) {
  const response = await axios.get(`${urlBase}/${id}`);
  return response.data;
}

export async function adicionarTarefa(novaTarefa) {
  const response = await axios.post(urlBase, novaTarefa, {
    headers: headersJson,
  });
  return response.data;
}

export async function atualizarTarefa({ objectId, dados }) {
  const response = await axios.put(`${urlBase}/${objectId}`, dados, {
    headers: headersJson,
  });
  return response.data;
}

export async function deletarTarefa(objectId) {
  const response = await axios.delete(`${urlBase}/${objectId}`, { headers });
  return response.data;
}