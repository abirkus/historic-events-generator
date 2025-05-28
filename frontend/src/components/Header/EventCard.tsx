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
  const eventRegex = /\d+\.\s(\d{4})\s-\s([^–\n]+?)\.\s*/g;

  const events: HistoricEvent[] = [];
  let match: RegExpExecArray | null;

  while ((match = eventRegex.exec(response)) !== null) {
    const [fullMatch, year, eventSummary] = match;
    const nextStart = match.index + fullMatch.length;
    const nextMatch = eventRegex.exec(response);

    const description = response
      .slice(nextStart, nextMatch ? nextMatch.index : undefined)
      .trim();
    events.push({
      year,
      title: eventSummary.trim(),
      description: description.replace(/\s+/g, " ").replace(/\.*$/, "") + ".",
    });

    if (nextMatch) {
      eventRegex.lastIndex = nextMatch.index;
    }
  }

  return events;
};

const HistoricEventsCard = (serverResponse: string) => {
  console.log("serverResponse string input:", serverResponse);
  const data = parseHistoricEventsResponse(serverResponse);

  console.log("Parsed Historic Events:", data);
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
