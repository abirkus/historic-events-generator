import { AxiosApiClient } from "../../services/api/AxiosApiClient";
import dayjs, { Dayjs } from "dayjs";
import { LLMProviderService } from "../../services/llmProviders/LLMProviderService";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  CircularProgress,
  Typography,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { useEffect, useState } from "react";
import type { SelectChangeEvent } from "@mui/material/Select";
import CalendarImage from "../../assets/calendar-thinking.png";
import HistoricEventsCard from "../../components/EventCard";

const apiClient = new AxiosApiClient(import.meta.env.VITE_SERVER_API_BASE_URL);
const llmService = new LLMProviderService(apiClient);

const Home = () => {
  const [availableModels, setAvailableModels] = useState<string[]>([]);
  const [selectedModel, setSelectedModel] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(
    dayjs(Date.now())
  );

  const [eventsList, setEventsList] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

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
    setIsLoading(true);
    llmService
      .queryForModel({
        provider: selectedModel,
        date: selectedDate?.format("MM-DD") || "",
      })
      .then((res) => {
        console.log("Generated Events:", res);
        const eventsListArray = JSON.parse(res.response || "[]") as string[];
        setEventsList(eventsListArray);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error generating events:", error);
        setIsLoading(false);
        setError(error.message || "An error occurred while generating events.");
      });
  };

  return (
    <>
      <div className="flex flex-col items-center p-6">
        <div className="flex items-center flex-col">
          <div className="flex flex-row items-center justify-center w-full">
            <div className="flex flex-col items-center justify-center">
              {/* <CalendarMonth sx={{ fontSize: "10rem" }} /> */}
              <img
                src={CalendarImage}
                className="rounded-md p-2"
                alt="calendar-thinking-of-date"
                width={300}
                height={300}
              />
              <FormControl fullWidth>
                <InputLabel id="model-select-label" size="small">
                  Choose AI model
                </InputLabel>
                <Select
                  labelId="model-select-label"
                  id="model-select"
                  label="Select Model"
                  size="small"
                  onChange={(e: SelectChangeEvent) => handleModelChange(e)}
                >
                  {availableModels.map((model: string) => (
                    <MenuItem key={model} value={model}>
                      {model}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
            <div>
              <Typography variant="h5" sx={{ m: 2 }}>
                What happened on
              </Typography>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={["DatePicker"]}>
                  <DatePicker
                    value={selectedDate}
                    onChange={(newValue) => setSelectedDate(newValue)}
                  />
                </DemoContainer>
              </LocalizationProvider>
              <Button variant="contained" sx={{ m: 2 }} onClick={handleSubmit}>
                Discover Historic Events
                {isLoading && (
                  <CircularProgress color="info" size="30px" sx={{ mx: 2 }} />
                )}
              </Button>
            </div>
          </div>
          <div>
            <HistoricEventsCard
              eventsList={eventsList}
              selectedDate={selectedDate}
              isLoading={isLoading}
              error={error}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
