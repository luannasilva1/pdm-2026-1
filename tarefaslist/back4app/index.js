import axios from "axios";

const urlBase = "https://parseapi.back4app.com/classes/Tarefa";
const headers = {
  "X-Parse-Application-Id": "Y7F65DorGXZOZUEBpnPL6nAn0sONX8joHmSlpkmu",
  "X-Parse-JavaScript-Key": "uAOFQLNP2MsznUdrebMbuTTZ7K2eHvP2eQVKuI7T",
};
const headersJson = {
  ...headers,
  "Content-Type": "application/json",
};

export async function getTarefas() {
  const response = await axios.get(urlBase, { headers });
  return response.data.results;
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