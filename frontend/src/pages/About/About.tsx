import {
  Box,
  Typography,
  Container,
  Paper,
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import {
  AutoStories,
  Psychology,
  Timeline,
  School,
  Lightbulb,
  Star,
} from "@mui/icons-material";

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

const About = () => {
  // Main container styling
  const containerSx = {
    minHeight: "100vh",
    background: `
      linear-gradient(45deg, ${VINTAGE_COLORS.paper} 0%, #F8F4E6 50%, ${VINTAGE_COLORS.paper} 100%),
      radial-gradient(circle at 20% 80%, rgba(218, 165, 32, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(139, 69, 19, 0.1) 0%, transparent 50%)
    `,
    backgroundAttachment: "fixed",
    py: 6,
  };

  // Main paper styling
  const mainPaperSx = {
    maxWidth: 900,
    mx: "auto",
    p: 5,
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

  // Typography styles
  const mainTitleSx = {
    fontFamily: VINTAGE_FONTS.decorative,
    fontWeight: "bold",
    color: VINTAGE_COLORS.darkBrown,
    textAlign: "center",
    fontSize: { xs: "2.5rem", md: "3.5rem" },
    letterSpacing: "0.05em",
    mb: 2,
    textShadow: "3px 3px 6px rgba(0,0,0,0.3)",
    background: `linear-gradient(45deg, ${VINTAGE_COLORS.darkBrown}, ${VINTAGE_COLORS.gold})`,
    backgroundClip: "text",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  };

  const subtitleSx = {
    fontFamily: VINTAGE_FONTS.serif,
    fontStyle: "italic",
    color: VINTAGE_COLORS.mediumBrown,
    textAlign: "center",
    fontSize: { xs: "1.1rem", md: "1.3rem" },
    letterSpacing: "0.1em",
    mb: 4,
  };

  const bodyTextSx = {
    fontFamily: VINTAGE_FONTS.serif,
    color: VINTAGE_COLORS.darkBrown,
    fontSize: "1.1rem",
    lineHeight: 1.8,
    textAlign: "justify",
    textIndent: "2em",
    mb: 3,
  };

  const sectionTitleSx = {
    fontFamily: VINTAGE_FONTS.decorative,
    fontWeight: "bold",
    color: VINTAGE_COLORS.mediumBrown,
    fontSize: "1.8rem",
    letterSpacing: "0.05em",
    mb: 2,
    textAlign: "center",
  };

  const decorativeBorderSx = {
    width: "100%",
    height: "3px",
    background: `linear-gradient(90deg, transparent, ${VINTAGE_COLORS.gold}, ${VINTAGE_COLORS.lightBrown}, ${VINTAGE_COLORS.gold}, transparent)`,
    my: 4,
  };

  // Feature card styling
  const featureCardSx = {
    backgroundColor: "rgba(248, 244, 230, 0.8)",
    border: `2px solid ${VINTAGE_COLORS.accent}`,
    borderRadius: 0,
    height: "100%",
    transition: "all 0.3s ease",
    "&:hover": {
      transform: "translateY(-4px)",
      boxShadow: "0 8px 16px rgba(0,0,0,0.2)",
      borderColor: VINTAGE_COLORS.gold,
    },
  };

  const iconSx = {
    fontSize: "3rem",
    color: VINTAGE_COLORS.mediumBrown,
    mb: 2,
  };

  const features = [
    {
      icon: <Psychology sx={iconSx} />,
      title: "AI-Powered Exploration",
      description:
        "Harness the power of multiple artificial intelligence models to uncover historical events with unprecedented accuracy and depth.",
    },
    {
      icon: <Timeline sx={iconSx} />,
      title: "Temporal Discovery",
      description:
        "Journey through any date in history and discover the significant events that shaped our world on that very day.",
    },
    {
      icon: <AutoStories sx={iconSx} />,
      title: "Rich Narratives",
      description:
        "Experience history through compelling stories and detailed accounts that bring the past to life in vivid detail.",
    },
    {
      icon: <School sx={iconSx} />,
      title: "Educational Journey",
      description:
        "Transform learning into an adventure of discovery, making history engaging and accessible for scholars of all ages.",
    },
    {
      icon: <Lightbulb sx={iconSx} />,
      title: "Innovative Technology",
      description:
        "Built as an exploration of cutting-edge AI capabilities, demonstrating the potential of machine learning in historical research.",
    },
    {
      icon: <Star sx={iconSx} />,
      title: "Personal Connections",
      description:
        "Discover the historical significance of your special dates - birthdays, anniversaries, and memorable moments.",
    },
  ];

  return (
    <Box sx={containerSx}>
      <Container maxWidth="lg">
        <Paper sx={mainPaperSx} elevation={0}>
          {/* Header Section */}
          <Box sx={{ position: "relative", zIndex: 1, mb: 6 }}>
            <Typography variant="h1" sx={mainTitleSx}>
              About the Archives
            </Typography>
            <Typography variant="h6" sx={subtitleSx}>
              Chronicling the Tapestry of Human History
            </Typography>
            <Box sx={decorativeBorderSx} />
          </Box>

          {/* Introduction */}
          <Box sx={{ position: "relative", zIndex: 1, mb: 6 }}>
            <Typography sx={bodyTextSx}>
              Welcome, fellow seeker of knowledge, to the Chronicle Explorer—a
              digital sanctuary where the threads of time converge into a
              magnificent tapestry of human experience. Within these virtual
              halls, we have assembled a remarkable collection of artificial
              scribes, each trained in the ancient arts of historical research
              and storytelling.
            </Typography>

            <Typography sx={bodyTextSx}>
              This noble endeavor was conceived as an exploration into the
              boundless capabilities of artificial intelligence, specifically
              examining how these digital minds might serve as custodians of our
              collective memory. Through careful orchestration of various AI
              models, we have created a portal that allows you to peer through
              the mists of time and witness the pivotal moments that have shaped
              our world.
            </Typography>

            <Typography sx={bodyTextSx}>
              Whether you seek to understand the grand sweep of history or
              discover the hidden significance of a particular date—perhaps your
              own birthday holds secrets yet untold—the Chronicle Explorer
              stands ready to illuminate the path of discovery. Choose your
              preferred artificial oracle, select a date that calls to your
              curiosity, and prepare to embark upon a journey through the annals
              of time.
            </Typography>
          </Box>

          {/* Features Section */}
          <Box sx={{ position: "relative", zIndex: 1 }}>
            <Typography variant="h2" sx={sectionTitleSx}>
              Features of Our Digital Archive
            </Typography>
            <Box sx={decorativeBorderSx} />

            <Grid container spacing={4} sx={{ mt: 2 }}>
              {features.map((feature, index) => (
                <Grid item xs={12} md={6} lg={4} key={index}>
                  <Card sx={featureCardSx}>
                    <CardContent sx={{ textAlign: "center", p: 3 }}>
                      {feature.icon}
                      <Typography
                        variant="h6"
                        sx={{
                          fontFamily: VINTAGE_FONTS.decorative,
                          fontWeight: "bold",
                          color: VINTAGE_COLORS.darkBrown,
                          mb: 2,
                        }}
                      >
                        {feature.title}
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{
                          fontFamily: VINTAGE_FONTS.serif,
                          color: VINTAGE_COLORS.mediumBrown,
                          lineHeight: 1.6,
                        }}
                      >
                        {feature.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* Closing Message */}
          <Box
            sx={{ position: "relative", zIndex: 1, mt: 6, textAlign: "center" }}
          >
            <Box sx={decorativeBorderSx} />
            <Typography
              sx={{
                fontFamily: VINTAGE_FONTS.decorative,
                fontStyle: "italic",
                color: VINTAGE_COLORS.mediumBrown,
                fontSize: "1.2rem",
                letterSpacing: "0.1em",
                textShadow: "1px 1px 2px rgba(0,0,0,0.3)",
              }}
            >
              &quot;In every date lies a story, in every story lies wisdom,
              <br />
              and in every wisdom lies the key to understanding our shared
              humanity.&quot;
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default About;
