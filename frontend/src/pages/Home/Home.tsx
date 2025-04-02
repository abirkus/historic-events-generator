import Header from "../../components/Header/Header";

import { AxiosApiClient } from "../../services/api/AxiosApiClient";
import { LLMProviderService } from "../../services/llmProviders/LLMProviderService";
import { Box, InputAdornment, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
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
      <div className="p-6">
        <div className="flex justify-between mb-4">
          <h1 className="text-black text-xl pl-4">Devices</h1>
        </div>

        <div className="flex items-center w-full  md:flex-row flex-col">
          <TextField
            placeholder="Search"
            aria-label="search"
            size="small"
            id="outlined-start-adornment"
            sx={{ m: 1, width: 300 }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              },
            }}
            onChange={(e) => console.log(e.target.value)}
          />
        </div>
        <Box>Data goes here</Box>
      </div>
    </>
  );
};

export default Home;
