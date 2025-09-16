export async function fetchCandidatos() {
  try {
    const response = await fetch("http://172.20.10.4:8080/candidatos");
    if (!response.ok) {
      throw new Error("Erro ao buscar candidatos");
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function registrarVoto(payload) {
  try {
    const response = await fetch("http://172.20.10.4:8080/votos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || "Erro ao registrar voto");
    }
    return data;
  } catch (error) {
    console.log("erroisisis", error);
    throw error;
  }
}

export async function fetchResultados() {
  try {
    const response = await fetch("http://172.20.10.2:4000/apurar");
    if (!response.ok) {
      throw new Error("Erro ao buscar resultados");
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}
