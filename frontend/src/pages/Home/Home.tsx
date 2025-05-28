import Header from "../../components/Header/Header";

import { AxiosApiClient } from "../../services/api/AxiosApiClient";
import dayjs, { Dayjs } from "dayjs";
import { LLMProviderService } from "../../services/llmProviders/LLMProviderService";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { useEffect, useState } from "react";
import type { SelectChangeEvent } from "@mui/material/Select";
import HistoricEventsCard from "../../components/Header/EventCard";

const apiClient = new AxiosApiClient(import.meta.env.VITE_SERVER_API_BASE_URL);
const llmService = new LLMProviderService(apiClient);

const Home = () => {
  const [availableModels, setAvailableModels] = useState<string[]>([]);
  const [selectedModel, setSelectedModel] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(
    dayjs(Date.now())
  );

  const [response, setResponse] = useState<string>("");

  useEffect(() => {
    const getAllModels = async () => {
      const data = await llmService.fetchAvailableModels();
      console.log(data);
      if (!data || data.length === 0) {
        return [];
      }
      return data;
    };

    getAllModels()
      .then((res) => {
        setAvailableModels(res);
      })
      .catch((error) => {
        console.error("Error fetching models:", error);
      });
  }, []);

  const handleModelChange = (event: SelectChangeEvent) => {
    setSelectedModel(event.target.value as string);
  };

  const handleSubmit = async () => {
    llmService
      .queryForModel({
        provider: selectedModel,
        date: selectedDate?.format("MM-DD") || "",
      })
      .then((response) => {
        console.log("Generated Events:", response);
        setResponse(response);
      })
      .catch((error) => {
        console.error("Error generating events:", error);
        // Handle the error, e.g., show a notification to the user
      });
  };

  return (
    <>
      <Header />
      <div className="flex flex-col items-center p-6">
        <div className="flex flex-col items-center  mb-4 w-1/2">
          <h1 className="text-black text-xl pl-4">
            Welcome to Historic Events Generator
          </h1>
          <h3 className="text-black text-lg pl-4">
            This site was built as an exercise for utilizing various AI models
            with the purpose of generating important historic events at a
            specific date in time. Go ahead make your selections for the desired
            AI model and the date of interest and see what you might learn. Who
            know, maybe your birthday is a special day after all?{" "}
          </h3>
        </div>

        <div className="flex items-center flex-col">
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">AI Model name</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label="Select Model"
              onChange={(e: SelectChangeEvent) => handleModelChange(e)}
            >
              {availableModels.map((model: string) => (
                <MenuItem key={model} value={model}>
                  {model}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={["DatePicker"]}>
              <DatePicker
                value={selectedDate}
                onChange={(newValue) => setSelectedDate(newValue)}
              />
            </DemoContainer>
          </LocalizationProvider>
          <Button variant="contained" sx={{ m: 2 }} onClick={handleSubmit}>
            Generate Events
          </Button>

          <div>{HistoricEventsCard(response)}</div>
        </div>
      </div>
    </>
  );
};

export default Home;
