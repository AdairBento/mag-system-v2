/**
 * Estrutura padrão de erro da API
 */
export interface ApiError {
  message?: string;
  status?: number;
  response?: {
    status?: number;
    data?: unknown;
  };
  details?: unknown;
}

/**
 * Converte qualquer erro para o formato ApiError
 */
export function toApiLikeError(err: unknown): ApiError {
  if (!err) {
    return { message: "Erro desconhecido" };
  }

  // Já é um objeto com estrutura de erro
  if (typeof err === "object") {
    const error = err as Record<string, unknown>;
    return {
      message: typeof error.message === "string" ? error.message : undefined,
      status: typeof error.status === "number" ? error.status : undefined,
      response: error.response as ApiError["response"],
      details: error.details,
    };
  }

  // String
  if (typeof err === "string") {
    return { message: err };
  }

  return { message: "Erro desconhecido" };
}

/**
 * Extrai mensagem de erro de forma segura
 */
export function getErrorMessage(err: unknown): string {
  const apiErr = toApiLikeError(err);

  // Tentar extrair mensagem de response.data
  if (apiErr.response?.data) {
    const data = apiErr.response.data as Record<string, unknown>;
    if (typeof data.message === "string") {
      return data.message;
    }
  }

  // Tentar mensagem direta
  if (apiErr.message) {
    return apiErr.message;
  }

  return "Erro ao processar solicitação";
}
