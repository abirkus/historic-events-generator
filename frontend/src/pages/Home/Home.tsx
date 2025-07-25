import { AxiosApiClient } from "../../services/api/AxiosApiClient";
import { LLMProviderService } from "../../services/llmProviders/LLMProviderService";
import dayjs, { Dayjs } from "dayjs";
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

// Date options
const MONTHS = [
  { value: "01", label: "January" },
  { value: "02", label: "February" },
  { value: "03", label: "March" },
  { value: "04", label: "April" },
  { value: "05", label: "May" },
  { value: "06", label: "June" },
  { value: "07", label: "July" },
  { value: "08", label: "August" },
  { value: "09", label: "September" },
  { value: "10", label: "October" },
  { value: "11", label: "November" },
  { value: "12", label: "December" },
];

const DAYS = Array.from({ length: 31 }, (_, i) => {
  const day = i + 1;
  return {
    value: day.toString().padStart(2, "0"),
    label: day.toString(),
  };
});

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
  p: { xs: 1, md: 4 },
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
  gap: 3,
};

const promptTextSx = {
  fontFamily: VINTAGE_FONTS.serif,
  fontWeight: "bold",
  color: VINTAGE_COLORS.darkBrown,
  fontSize: { xs: "1.2rem", md: "1.5rem" },
  textAlign: "center",
  letterSpacing: "0.05em",
};

const dateSelectorsContainerSx = {
  display: "flex",
  flexDirection: { xs: "column", sm: "row" },
  gap: 2,
  alignItems: "center",
  justifyContent: "center",
  width: "100%",
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
  const [selectedDate, setSelectedDate] = useState<Dayjs>(
    dayjs().month(0).date(1) // January 1st, current year
  );

  const [eventsList, setEventsList] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Get current month and day from the Dayjs object
  const selectedMonth = selectedDate.format("MM");
  const selectedDay = selectedDate.format("DD");

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

  const handleMonthChange = (event: SelectChangeEvent) => {
    const month = parseInt(event.target.value) - 1; // Dayjs months are 0-indexed
    let newDate = selectedDate.month(month);

    // Validate day for the selected month
    const daysInMonth = newDate.daysInMonth();
    if (selectedDate.date() > daysInMonth) {
      newDate = newDate.date(daysInMonth);
    }

    setSelectedDate(newDate);
  };

  const handleDayChange = (event: SelectChangeEvent) => {
    const day = parseInt(event.target.value);
    const newDate = selectedDate.date(day);
    setSelectedDate(newDate);
  };

  const getValidDays = (): typeof DAYS => {
    const maxDays = selectedDate.daysInMonth();
    return DAYS.slice(0, maxDays);
  };

  const getFormattedDate = (): string => {
    return selectedDate.format("MM-DD");
  };

  const getDisplayDate = (): string => {
    return selectedDate.format("MMMM D");
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
        date: getFormattedDate(),
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
              Discover the Journey Through Time
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

              {/* Month and Day Selectors */}
              <Box sx={dateSelectorsContainerSx}>
                <FormControl sx={{ ...formControlSx, minWidth: 140 }}>
                  <InputLabel id="month-select-label" size="small">
                    Month
                  </InputLabel>
                  <Select
                    labelId="month-select-label"
                    id="month-select"
                    label="Month"
                    size="small"
                    value={selectedMonth}
                    onChange={handleMonthChange}
                  >
                    {MONTHS.map((month) => (
                      <MenuItem
                        key={month.value}
                        value={month.value}
                        sx={{ fontFamily: VINTAGE_FONTS.serif }}
                      >
                        {month.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl sx={{ ...formControlSx, minWidth: 100 }}>
                  <InputLabel id="day-select-label" size="small">
                    Day
                  </InputLabel>
                  <Select
                    labelId="day-select-label"
                    id="day-select"
                    label="Day"
                    size="small"
                    value={selectedDay}
                    onChange={handleDayChange}
                  >
                    {getValidDays().map((day) => (
                      <MenuItem
                        key={day.value}
                        value={day.value}
                        sx={{ fontFamily: VINTAGE_FONTS.serif }}
                      >
                        {day.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              {/* Selected Date Display */}
              <Typography
                variant="body1"
                sx={{
                  fontFamily: VINTAGE_FONTS.serif,
                  color: VINTAGE_COLORS.mediumBrown,
                  fontSize: "1.1rem",
                  fontStyle: "italic",
                  textAlign: "center",
                }}
              >
                Selected: {getDisplayDate()}
              </Typography>

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
