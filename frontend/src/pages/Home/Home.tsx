import Header from "../../components/Header/Header";

import { AxiosApiClient } from "../../services/api/AxiosApiClient";
import dayjs from "dayjs";
import { LLMProviderService } from "../../services/llmProviders/LLMProviderService";
import { Box } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { useEffect } from "react";

const apiClient = new AxiosApiClient(import.meta.env.VITE_SERVER_API_BASE_URL);
const llmService = new LLMProviderService(apiClient);

const Home = () => {
  useEffect(() => {
    getAllModels();
  }, []);

  const getAllModels = async () => {
    const data = await llmService.fetchAvailableModels();
    console.log(data);
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

        <div className="flex items-center ">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={["DatePicker"]}>
              <DatePicker defaultValue={dayjs(Date.now())} />
            </DemoContainer>
          </LocalizationProvider>
        </div>
      </div>
    </>
  );
};

export default Home;
