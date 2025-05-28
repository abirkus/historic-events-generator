import {
  Card,
  CardContent,
  Typography,
  Box,
  Divider,
  Stack,
} from "@mui/material";

type HistoricEvent = {
  year: string;
  title: string;
  description: string;
};

const parseHistoricEventsResponse = (response: string): HistoricEvent[] => {
  const eventRegex = /\d{4}\s-\s(.+?):\s([\s\S]*?)(?=\n\d{4}\s-\s|\n*$)/g;
  const matches = [...response.matchAll(eventRegex)];

  return matches.map((match) => {
    const [fullMatch, title, description] = match;
    const yearMatch = fullMatch.match(/^(\d{4})/);
    return {
      year: yearMatch ? yearMatch[1] : "Unknown",
      title: title.trim(),
      description: description.trim().replace(/\n/g, " "),
    };
  });
};

const HistoricEventsCard = (serverResponse: string) => {
  const data = parseHistoricEventsResponse(serverResponse);
  if (!data || data.length === 0) {
    return (
      <Card sx={{ maxWidth: 800, margin: "0 auto", mt: 4, p: 2 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            No Historic Events Found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Please try a different date or check the server response.
          </Typography>
        </CardContent>
      </Card>
    );
  }
  return (
    <Card sx={{ maxWidth: 800, margin: "0 auto", mt: 4, p: 2 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Notable Historic Events on May 1
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Stack spacing={3}>
          {data.map((event, index) => (
            <Box key={index}>
              <Typography variant="subtitle1" color="text.secondary">
                {event.year} – <strong>{event.title}</strong>
              </Typography>
              <Typography variant="body2">{event.description}</Typography>
            </Box>
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default HistoricEventsCard;
