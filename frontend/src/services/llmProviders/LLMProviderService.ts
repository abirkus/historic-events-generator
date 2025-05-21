import { ApiClient } from "../api/ApiClient";

type queryParams = {
  model: string;
  messages: Array<{ role: string; content: string }>;
};

/**
 * @name LLMProviderService
 * @description api service that handles all the devices related API calls
 * Implementation allows swapping the HTTP client (Axios to Fetch or Mock API for testing).
 * */

export class LLMProviderService {
  private apiClient: ApiClient;

  constructor(apiClient: ApiClient) {
    this.apiClient = apiClient;
  }

  async fetchAvailableModels(): Promise<string[]> {
    return this.apiClient.get<string[]>("/models");
  }

  async queryForModel(q: queryParams): Promise<any> {
    return this.apiClient.post<string[]>("/chat", q);
  }
}
