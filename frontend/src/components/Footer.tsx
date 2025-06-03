import { Box, Typography, Container, Divider } from "@mui/material";
import { Copyright } from "@mui/icons-material";

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

const Footer = () => {
  const footerSx = {
    width: "100%",
    backgroundColor: VINTAGE_COLORS.darkBrown,
    borderTop: `4px solid ${VINTAGE_COLORS.gold}`,
    backgroundImage: `
      linear-gradient(90deg, transparent 1px, rgba(218,165,32,0.1) 1px, rgba(218,165,32,0.1) 2px, transparent 2px),
      linear-gradient(180deg, #3D2518 0%, ${VINTAGE_COLORS.darkBrown} 100%)
    `,
    backgroundSize: "20px 20px",
    boxShadow: "0 -4px 8px rgba(0,0,0,0.3)",
    mt: "auto",
    position: "relative",
    "&::before": {
      content: '""',
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: `
        radial-gradient(circle at 30% 50%, rgba(218,165,32,0.1) 1px, transparent 1px),
        radial-gradient(circle at 70% 50%, rgba(218,165,32,0.1) 1px, transparent 1px)
      `,
      backgroundSize: "80px 80px",
      pointerEvents: "none",
      opacity: 0.6,
    },
  };

  const footerContentSx = {
    display: "flex",
    flexDirection: { xs: "column", md: "row" },
    justifyContent: "space-between",
    alignItems: "center",
    py: 3,
    gap: 2,
    position: "relative",
    zIndex: 1,
  };

  const footerTextSx = {
    fontFamily: VINTAGE_FONTS.serif,
    color: VINTAGE_COLORS.paper,
    fontSize: "0.9rem",
    letterSpacing: "0.05em",
    textAlign: { xs: "center", md: "left" },
  };

  const decorativeTextSx = {
    fontFamily: VINTAGE_FONTS.decorative,
    color: VINTAGE_COLORS.gold,
    fontSize: "1rem",
    fontStyle: "italic",
    letterSpacing: "0.1em",
    textAlign: "center",
    textShadow: "1px 1px 2px rgba(0,0,0,0.5)",
  };

  const copyrightSx = {
    fontFamily: VINTAGE_FONTS.serif,
    color: VINTAGE_COLORS.accent,
    fontSize: "0.8rem",
    display: "flex",
    alignItems: "center",
    gap: 1,
    letterSpacing: "0.05em",
  };

  return (
    <Box sx={footerSx}>
      <Container maxWidth="xl">
        <Box sx={footerContentSx}>
          {/* Left side - Mission statement */}
          <Box>
            <Typography sx={footerTextSx}>
              Preserving the chronicles of yesteryear for tomorrow's historians
            </Typography>
          </Box>

          {/* Center - Decorative text */}
          <Box>
            <Typography sx={decorativeTextSx}>
              "Through time's pages, wisdom flows"
            </Typography>
          </Box>

          {/* Right side - Copyright */}
          <Box>
            <Typography sx={copyrightSx}>
              <Copyright fontSize="small" />
              {new Date().getFullYear()} Chronicle Explorer
            </Typography>
          </Box>
        </Box>

        {/* Decorative divider */}
        <Divider
          sx={{
            borderColor: VINTAGE_COLORS.gold,
            opacity: 0.3,
            mb: 1,
          }}
        />

        {/* Bottom text */}
        <Box sx={{ textAlign: "center", pb: 1 }}>
          <Typography
            sx={{
              fontFamily: VINTAGE_FONTS.serif,
              color: VINTAGE_COLORS.accent,
              fontSize: "0.75rem",
              letterSpacing: "0.1em",
              fontStyle: "italic",
            }}
          >
            Powered by the wisdom of artificial scribes and Andre Birkus
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
