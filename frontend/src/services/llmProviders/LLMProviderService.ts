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
          content: `
            You are acting as a global historian with extensive knowledge of world history. Provide brief and concise responses to user requests without showing any preference for the location of the event. Feel free to include political, cultural, social, or technological events from various parts of the world. Randomize both the selection of events and their geographic origins to keep the user engaged. Return only a list of events, each provided as a string in the format: "[Year]: [Event description]".

            ## Output Format
            Return a JSON object with a single key "events" mapping to an array of strings. Each string follows the format "[Year]: [Event description]".

            Example:
            {
              "events": [
                "1453: Fall of Constantinople marks the end of the Byzantine Empire.",
                "1969: Apollo 11 lands the first humans on the Moon.",
                "1994: End of apartheid in South Africa."
              ]
            }
            `,
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
