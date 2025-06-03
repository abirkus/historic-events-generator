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
  Box,
  Paper,
  Container,
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

// Vintage styling constants
const VINTAGE_COLORS = {
  paper: "#F5F1E8",
  darkBrown: "#2F1B14",
  mediumBrown: "#654321",
  lightBrown: "#8B4513",
  accent: "#D2B48C",
  gold: "#DAA520",
} as const;

const VINTAGE_FONTS = {
  serif: "'Old Standard TT', 'Times New Roman', serif",
  decorative: "'Cinzel', 'Times New Roman', serif",
} as const;

// Vintage component styling
const vintageContainerSx = {
  minHeight: "100vh",
  background: `
    linear-gradient(45deg, ${VINTAGE_COLORS.paper} 0%, #F8F4E6 50%, ${VINTAGE_COLORS.paper} 100%),
    radial-gradient(circle at 20% 80%, rgba(218, 165, 32, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(139, 69, 19, 0.1) 0%, transparent 50%)
  `,
  backgroundAttachment: "fixed",
  py: 4,
};

const mainPaperSx = {
  maxWidth: 1000,
  mx: "auto",
  p: 4,
  backgroundColor: VINTAGE_COLORS.paper,
  backgroundImage: `
    linear-gradient(90deg, transparent 1px, rgba(0,0,0,0.02) 1px, rgba(0,0,0,0.02) 2px, transparent 2px),
    linear-gradient(180deg, transparent 1px, rgba(0,0,0,0.02) 1px, rgba(0,0,0,0.02) 2px, transparent 2px)
  `,
  backgroundSize: "25px 25px",
  border: `4px solid ${VINTAGE_COLORS.lightBrown}`,
  borderRadius: 0,
  boxShadow: `
    0 0 30px rgba(0,0,0,0.4),
    inset 0 0 100px rgba(101,67,33,0.1),
    0 0 0 1px rgba(218,165,32,0.3)
  `,
  position: "relative",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `
      radial-gradient(circle at 15% 25%, rgba(101,67,33,0.08) 1px, transparent 1px),
      radial-gradient(circle at 85% 75%, rgba(101,67,33,0.08) 1px, transparent 1px),
      radial-gradient(circle at 50% 50%, rgba(218,165,32,0.05) 2px, transparent 2px)
    `,
    backgroundSize: "80px 80px, 60px 60px, 120px 120px",
    pointerEvents: "none",
    opacity: 0.6,
  },
};

const headerSx = {
  textAlign: "center",
  mb: 6,
  position: "relative",
  zIndex: 1,
};

const mainTitleSx = {
  fontFamily: VINTAGE_FONTS.decorative,
  fontWeight: "bold",
  color: VINTAGE_COLORS.darkBrown,
  textShadow: "3px 3px 6px rgba(0,0,0,0.3)",
  fontSize: { xs: "2.5rem", md: "3.5rem" },
  letterSpacing: "0.05em",
  mb: 2,
  background: `linear-gradient(45deg, ${VINTAGE_COLORS.darkBrown}, ${VINTAGE_COLORS.gold})`,
  backgroundClip: "text",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
};

const subtitleSx = {
  fontFamily: VINTAGE_FONTS.serif,
  fontStyle: "italic",
  color: VINTAGE_COLORS.mediumBrown,
  fontSize: { xs: "1rem", md: "1.2rem" },
  letterSpacing: "0.1em",
  mb: 1,
};

const decorativeBorderSx = {
  width: "100%",
  height: "3px",
  background: `linear-gradient(90deg, transparent, ${VINTAGE_COLORS.gold}, ${VINTAGE_COLORS.lightBrown}, ${VINTAGE_COLORS.gold}, transparent)`,
  mb: 4,
};

const controlsSectionSx = {
  display: "flex",
  flexDirection: { xs: "column", md: "row" },
  alignItems: "center",
  justifyContent: "center",
  gap: 4,
  mb: 6,
  position: "relative",
  zIndex: 1,
};

const imageContainerSx = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: 3,
};

const vintageImageSx = {
  borderRadius: "8px",
  border: `3px solid ${VINTAGE_COLORS.lightBrown}`,
  boxShadow: "0 8px 16px rgba(0,0,0,0.3)",
  filter: "sepia(30%) contrast(110%) brightness(95%)",
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "scale(1.05)",
    filter: "sepia(40%) contrast(120%) brightness(100%)",
  },
};

const formControlSx = {
  "& .MuiOutlinedInput-root": {
    backgroundColor: "rgba(248, 244, 230, 0.8)",
    fontFamily: VINTAGE_FONTS.serif,
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: VINTAGE_COLORS.lightBrown,
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: VINTAGE_COLORS.gold,
    },
  },
  "& .MuiInputLabel-root": {
    fontFamily: VINTAGE_FONTS.serif,
    color: VINTAGE_COLORS.mediumBrown,
    "&.Mui-focused": {
      color: VINTAGE_COLORS.gold,
    },
  },
};

const dateControlsSx = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: 2,
};

const promptTextSx = {
  fontFamily: VINTAGE_FONTS.serif,
  fontWeight: "bold",
  color: VINTAGE_COLORS.darkBrown,
  fontSize: { xs: "1.2rem", md: "1.5rem" },
  textAlign: "center",
  letterSpacing: "0.05em",
};

const vintageButtonSx = {
  fontFamily: VINTAGE_FONTS.serif,
  fontWeight: "bold",
  fontSize: "1rem",
  letterSpacing: "0.05em",
  px: 4,
  py: 1.5,
  backgroundColor: VINTAGE_COLORS.lightBrown,
  color: VINTAGE_COLORS.paper,
  border: `2px solid ${VINTAGE_COLORS.darkBrown}`,
  borderRadius: 0,
  textTransform: "uppercase",
  boxShadow: "0 4px 8px rgba(0,0,0,0.3)",
  transition: "all 0.3s ease",
  "&:hover": {
    backgroundColor: VINTAGE_COLORS.darkBrown,
    transform: "translateY(-2px)",
    boxShadow: "0 6px 12px rgba(0,0,0,0.4)",
  },
  "&:active": {
    transform: "translateY(0)",
  },
};

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
    if (!selectedModel) {
      setError("Please select an AI model first.");
      return;
    }

    setIsLoading(true);
    setError(null);

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
    <Box sx={vintageContainerSx}>
      <Container maxWidth="lg">
        <Paper sx={mainPaperSx} elevation={0}>
          {/* Header Section */}
          <Box sx={headerSx}>
            <Typography variant="h1" sx={mainTitleSx}>
              Chronicle Explorer
            </Typography>
            <Typography variant="h6" sx={subtitleSx}>
              Uncover the Tapestry of Time
            </Typography>
            <Typography
              variant="body2"
              sx={{ ...subtitleSx, fontSize: "0.9rem", mb: 3 }}
            >
              Journey through the annals of history
            </Typography>
            <Box sx={decorativeBorderSx} />
          </Box>

          {/* Controls Section */}
          <Box sx={controlsSectionSx}>
            {/* Image and Model Selection */}
            <Box sx={imageContainerSx}>
              <Box
                component="img"
                src={CalendarImage}
                alt="Vintage Calendar - Contemplating History"
                sx={{
                  ...vintageImageSx,
                  width: { xs: 300, md: 400 },
                  height: { xs: 200, md: 300 },
                }}
              />
              <FormControl fullWidth sx={{ ...formControlSx, minWidth: 200 }}>
                <InputLabel id="model-select-label" size="small">
                  Choose AI Oracle
                </InputLabel>
                <Select
                  labelId="model-select-label"
                  id="model-select"
                  label="Choose AI Oracle"
                  size="small"
                  value={selectedModel}
                  onChange={handleModelChange}
                >
                  {availableModels.map((model: string) => (
                    <MenuItem
                      key={model}
                      value={model}
                      sx={{ fontFamily: VINTAGE_FONTS.serif }}
                    >
                      {model}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            {/* Date Selection */}
            <Box sx={dateControlsSx}>
              <Typography variant="h5" sx={promptTextSx}>
                What transpired on...
              </Typography>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={["DatePicker"]}>
                  <DatePicker
                    value={selectedDate}
                    onChange={(newValue) => setSelectedDate(newValue)}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        backgroundColor: "rgba(248, 244, 230, 0.8)",
                        fontFamily: VINTAGE_FONTS.serif,
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                          borderColor: VINTAGE_COLORS.lightBrown,
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          borderColor: VINTAGE_COLORS.gold,
                        },
                      },
                    }}
                  />
                </DemoContainer>
              </LocalizationProvider>
              <Button
                variant="contained"
                sx={vintageButtonSx}
                onClick={handleSubmit}
                disabled={isLoading || !selectedModel}
              >
                {isLoading
                  ? "Consulting the Archives..."
                  : "Discover Historic Events"}
                {isLoading && (
                  <CircularProgress
                    size={20}
                    sx={{
                      ml: 2,
                      color: VINTAGE_COLORS.paper,
                    }}
                  />
                )}
              </Button>
            </Box>
          </Box>

          {/* Results Section */}
          <Box sx={{ position: "relative", zIndex: 1 }}>
            <HistoricEventsCard
              eventsList={eventsList}
              selectedDate={selectedDate}
              isLoading={isLoading}
              error={error}
            />
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Home;
