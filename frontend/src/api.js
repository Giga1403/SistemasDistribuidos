export async function fetchCandidatos() {
  try {
    const response = await fetch("http://localhost:8080/candidatos");
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
    const response = await fetch("http://localhost:8080/votos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      throw new Error("Erro ao registrar voto");
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function fetchResultados() {
  try {
    const response = await fetch("http://localhost:4000/resultados");
    if (!response.ok) {
      throw new Error("Erro ao buscar resultados");
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}
