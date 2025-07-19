import {
  Card,
  CardContent,
  Typography,
  Box,
  Divider,
  Stack,
  Alert,
  Skeleton,
  Link,
} from "@mui/material";
import { Article } from "@mui/icons-material";
import { memo } from "react";
import { Dayjs } from "dayjs";

/**
 * @name HistoricEventsCard
 * @description Component to display notable historic events in a vintage newspaper format.
 * Features aged paper styling, drop cap years, and classic newspaper typography.
 */

interface HistoricEventsCardProps {
  eventsList: string[];
  selectedDate: Dayjs | null;
  isLoading?: boolean;
  error?: string | null;
}

// Shared styling constants
const NEWSPAPER_COLORS = {
  paper: "#F5F1E8",
  border: "#8B4513",
  darkText: "#2F1B14",
  mediumText: "#654321",
  lightText: "#D2B48C",
  accent: "#E8DCC6",
} as const;

const NEWSPAPER_FONTS = {
  serif: "'Old Standard TT', 'Times New Roman', serif",
} as const;

// Base card styling
const newspaperCardSx = {
  margin: "0 auto",
  mt: 4,
  p: { xs: 0, md: 3 },
  backgroundColor: NEWSPAPER_COLORS.paper,
  backgroundImage: `
    linear-gradient(90deg, transparent 1px, rgba(0,0,0,0.03) 1px, rgba(0,0,0,0.03) 2px, transparent 2px),
    linear-gradient(180deg, transparent 1px, rgba(0,0,0,0.03) 1px, rgba(0,0,0,0.03) 2px, transparent 2px)
  `,
  backgroundSize: "20px 20px",
  border: `3px solid ${NEWSPAPER_COLORS.border}`,
  borderRadius: 0,
  boxShadow: `
    0 0 20px rgba(0,0,0,0.3),
    inset 0 0 120px rgba(101,67,33,0.1)
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
      radial-gradient(circle at 20% 20%, rgba(101,67,33,0.1) 1px, transparent 1px),
      radial-gradient(circle at 80% 80%, rgba(101,67,33,0.1) 1px, transparent 1px),
      radial-gradient(circle at 40% 60%, rgba(101,67,33,0.05) 2px, transparent 2px)
    `,
    backgroundSize: "60px 60px, 40px 40px, 80px 80px",
    pointerEvents: "none",
    opacity: 0.7,
  },
};

// Simplified card for loading/error states
const simpleCardSx = {
  minWidth: 300,
  margin: "0 auto",
  mt: 4,
  p: 3,
  backgroundColor: NEWSPAPER_COLORS.paper,
  border: `3px solid ${NEWSPAPER_COLORS.border}`,
  borderRadius: 0,
};

// Typography styles
const headerTitleSx = {
  fontFamily: NEWSPAPER_FONTS.serif,
  fontWeight: "bold",
  color: NEWSPAPER_COLORS.darkText,
  textTransform: "uppercase" as const,
  letterSpacing: "0.1em",
  borderTop: `3px solid ${NEWSPAPER_COLORS.darkText}`,
  borderBottom: `3px solid ${NEWSPAPER_COLORS.darkText}`,
  py: 1,
  mb: 1,
};

const subtitleSx = {
  fontFamily: NEWSPAPER_FONTS.serif,
  color: NEWSPAPER_COLORS.mediumText,
  fontSize: "0.75rem",
  letterSpacing: "0.2em",
};

const dateTitleSx = {
  fontFamily: NEWSPAPER_FONTS.serif,
  fontWeight: "bold",
  color: NEWSPAPER_COLORS.darkText,
  textAlign: "center" as const,
};

const dropCapSx = {
  fontSize: "3em",
  lineHeight: 1,
  float: "left" as const,
  marginRight: "0.15em",
  marginTop: "0.1em",
  fontWeight: "bold",
  color: NEWSPAPER_COLORS.mediumText,
  fontFamily: NEWSPAPER_FONTS.serif,
  textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
};

const eventTextSx = {
  fontFamily: NEWSPAPER_FONTS.serif,
  lineHeight: 1.8,
  color: NEWSPAPER_COLORS.darkText,
  fontSize: "1rem",
  textAlign: "justify" as const,
  columnCount: 1,
  columnGap: 3,
  columnRule: `1px solid ${NEWSPAPER_COLORS.lightText}`,
};

const footerTextSx = {
  fontFamily: NEWSPAPER_FONTS.serif,
  color: NEWSPAPER_COLORS.mediumText,
  fontSize: "0.7rem",
  letterSpacing: "0.1em",
};

// Utility functions
const extractYearAndText = (eventText: string) => {
  const yearMatch = eventText.match(/^(\d{4})/);
  const year = yearMatch ? yearMatch[1] : eventText.substring(0, 4);
  const remainingText = yearMatch
    ? eventText.substring(4)
    : eventText.substring(4);
  return { year, remainingText };
};

// Sub-components
const NewspaperHeader = memo(() => (
  <Box textAlign="center" mb={3}>
    <Typography variant="h3" component="h1" sx={headerTitleSx}>
      The Historic Times
    </Typography>
    <Typography variant="caption" sx={subtitleSx}>
      ALL THE NEWS THAT WAS FIT TO PRINT
    </Typography>
  </Box>
));

NewspaperHeader.displayName = "NewspaperHeader";

const DateHeader = memo(({ selectedDate }: { selectedDate: Dayjs | null }) => (
  <Box
    display="flex"
    alignItems="center"
    justifyContent="center"
    gap={1}
    mb={3}
  >
    <Divider
      sx={{ flex: 1, borderColor: NEWSPAPER_COLORS.border, borderWidth: 1 }}
    />
    <Box display="flex" alignItems="center" gap={1} px={2}>
      <Article sx={{ color: NEWSPAPER_COLORS.mediumText, fontSize: 20 }} />
      <Typography variant="h5" component="h2" sx={dateTitleSx}>
        {selectedDate?.format("MMMM DD")}
      </Typography>
    </Box>
    <Divider
      sx={{ flex: 1, borderColor: NEWSPAPER_COLORS.border, borderWidth: 1 }}
    />
  </Box>
));

DateHeader.displayName = "DateHeader";

const EventItem = memo(
  ({ event, isLast }: { event: string; isLast: boolean }) => {
    const { year, remainingText } = extractYearAndText(event.trim());
    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(
      event.trim()
    )}`;
    return (
      <Box
        sx={{
          borderBottom: !isLast
            ? `1px solid ${NEWSPAPER_COLORS.lightText}`
            : "none",
          pb: !isLast ? 2 : 0,
        }}
      >
        <Link
          href={searchUrl}
          target="_blank"
          rel="noopener noreferrer"
          underline="hover"
          color="inherit"
        >
          <Typography variant="body1" component="p" sx={eventTextSx}>
            <Box component="span" sx={dropCapSx}>
              {year}
            </Box>
            {remainingText}
          </Typography>
        </Link>
      </Box>
    );
  }
);

EventItem.displayName = "EventItem";

const LoadingCard = memo(() => (
  <Card sx={simpleCardSx}>
    <CardContent>
      <Skeleton
        variant="text"
        width="60%"
        height={40}
        sx={{ backgroundColor: NEWSPAPER_COLORS.accent }}
      />
      <Skeleton
        variant="rectangular"
        width="100%"
        height={2}
        sx={{ my: 2, backgroundColor: NEWSPAPER_COLORS.lightText }}
      />
      <Stack spacing={2}>
        {[...Array(3)].map((_, index) => (
          <Skeleton
            key={index}
            variant="text"
            width="100%"
            height={20}
            sx={{ backgroundColor: NEWSPAPER_COLORS.accent }}
          />
        ))}
      </Stack>
    </CardContent>
  </Card>
));

LoadingCard.displayName = "LoadingCard";

const ErrorCard = memo(({ error }: { error: string }) => (
  <Card sx={simpleCardSx}>
    <CardContent>
      <Alert
        severity="error"
        sx={{
          mb: 2,
          backgroundColor: "#F4E4BC",
          color: NEWSPAPER_COLORS.mediumText,
          border: `1px solid ${NEWSPAPER_COLORS.border}`,
          "& .MuiAlert-icon": {
            color: NEWSPAPER_COLORS.mediumText,
          },
        }}
      >
        <Typography variant="h6" sx={{ fontFamily: NEWSPAPER_FONTS.serif }}>
          Error Loading Events
        </Typography>
        <Typography variant="body2" sx={{ fontFamily: NEWSPAPER_FONTS.serif }}>
          {error}
        </Typography>
      </Alert>
    </CardContent>
  </Card>
));

ErrorCard.displayName = "ErrorCard";

const EmptyStateCard = memo(
  ({ selectedDate }: { selectedDate: Dayjs | null }) => (
    <Card sx={{ ...simpleCardSx, textAlign: "center" }}>
      <CardContent>
        <Typography
          variant="h5"
          gutterBottom
          sx={{
            fontFamily: NEWSPAPER_FONTS.serif,
            color: NEWSPAPER_COLORS.mediumText,
            fontWeight: "bold",
          }}
        >
          No Historic Events Found
        </Typography>
        <Typography
          variant="body2"
          sx={{
            fontFamily: NEWSPAPER_FONTS.serif,
            color: NEWSPAPER_COLORS.mediumText,
          }}
        >
          {selectedDate
            ? `No events were recorded for ${selectedDate.format(
                "MMMM DD"
              )}. Perhaps history was taking a day off.`
            : "Please select a date to uncover the chronicles of yesteryear."}
        </Typography>
      </CardContent>
    </Card>
  )
);

EmptyStateCard.displayName = "EmptyStateCard";

// Main component
const HistoricEventsCard = memo(
  ({
    eventsList,
    selectedDate,
    isLoading = false,
    error = null,
  }: HistoricEventsCardProps) => {
    // Early returns for different states
    if (isLoading) return <LoadingCard />;
    if (error) return <ErrorCard error={error} />;

    // Sanitize and filter events list
    const validEvents =
      eventsList?.filter(
        (event) => event && typeof event === "string" && event.trim().length > 0
      ) || [];

    if (validEvents.length === 0) {
      return <EmptyStateCard selectedDate={selectedDate} />;
    }

    return (
      <Card sx={newspaperCardSx} elevation={0}>
        <CardContent sx={{ position: "relative", zIndex: 1 }}>
          <NewspaperHeader />
          <DateHeader selectedDate={selectedDate} />

          <Stack spacing={3}>
            {validEvents.map((event, index) => (
              <EventItem
                key={`event-${index}`}
                event={event}
                isLast={index === validEvents.length - 1}
              />
            ))}
          </Stack>

          <Box
            mt={4}
            pt={2}
            borderTop={`2px solid ${NEWSPAPER_COLORS.border}`}
            textAlign="center"
          >
            <Typography variant="caption" sx={footerTextSx}>
              {validEvents.length} HISTORIC EVENT
              {validEvents.length !== 1 ? "S" : ""} RECORDED
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }
);

HistoricEventsCard.displayName = "HistoricEventsCard";

export default HistoricEventsCard;
