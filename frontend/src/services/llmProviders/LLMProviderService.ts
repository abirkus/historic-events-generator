import { ApiClient } from "../api/ApiClient";

type queryParams = {
  provider: string;
  messages: Array<{ role: string; content: string }>;
};

type userInput = {
  date: string; // Format: YYYY-MM-DD
  provider: string;
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

  private generateParams = ({ date, provider }: userInput): queryParams => {
    return {
      messages: [
        {
          role: "developer",
          content:
            "You are acting as a global historian that knows world history really well.  You are to provide brief and concise responses to user requests with no preference for the location of the event.  You can use a mix of political, cultural, social, or technological events that occurred.  Make sure to randomize events and locations of events to keep the user entertained. Provide only the list of events and no additional text.",
        },
        {
          role: "user",
          content: `List top historic events that occurred on ${date}`,
        },
      ],
      provider,
    };
  };

  async queryForModel(q: userInput): Promise<any> {
    const query = this.generateParams(q);
    return this.apiClient.post<string[]>("/chat", query);
  }
}
