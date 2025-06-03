import { Link } from "react-router-dom";
import { Box, Typography, Container } from "@mui/material";
import { Schedule, Info } from "@mui/icons-material";
import aiLogo from "../assets/chronicle-explorer.png";

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

// Header component
const Header = () => {
  const headerSx = {
    width: "100%",
    backgroundColor: VINTAGE_COLORS.darkBrown,
    borderBottom: `4px solid ${VINTAGE_COLORS.gold}`,
    backgroundImage: `
      linear-gradient(90deg, transparent 1px, rgba(218,165,32,0.1) 1px, rgba(218,165,32,0.1) 2px, transparent 2px),
      linear-gradient(180deg, ${VINTAGE_COLORS.darkBrown} 0%, #3D2518 100%)
    `,
    backgroundSize: "20px 20px",
    boxShadow: "0 4px 8px rgba(0,0,0,0.3)",
    position: "relative",
    "&::before": {
      content: '""',
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: `
        radial-gradient(circle at 20% 50%, rgba(218,165,32,0.1) 1px, transparent 1px),
        radial-gradient(circle at 80% 50%, rgba(218,165,32,0.1) 1px, transparent 1px)
      `,
      backgroundSize: "60px 60px",
      pointerEvents: "none",
      opacity: 0.7,
    },
  };

  const logoSx = {
    width: 45,
    height: 45,
    borderRadius: "50%",
    border: `3px solid ${VINTAGE_COLORS.gold}`,
    filter: "sepia(20%) contrast(110%)",
    transition: "all 0.3s ease",
    "&:hover": {
      transform: "scale(1.1)",
      filter: "sepia(30%) contrast(120%)",
    },
  };

  const brandTextSx = {
    fontFamily: VINTAGE_FONTS.decorative,
    fontWeight: "bold",
    color: VINTAGE_COLORS.gold,
    fontSize: "1.5rem",
    letterSpacing: "0.1em",
    textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
    ml: 2,
  };

  const navLinkSx = {
    fontFamily: VINTAGE_FONTS.serif,
    color: VINTAGE_COLORS.paper,
    textDecoration: "none",
    fontSize: "1rem",
    fontWeight: "500",
    letterSpacing: "0.05em",
    px: 2,
    py: 1,
    borderRadius: 0,
    border: `1px solid transparent`,
    transition: "all 0.3s ease",
    display: "flex",
    alignItems: "center",
    gap: 1,
    "&:hover": {
      color: VINTAGE_COLORS.gold,
      borderColor: VINTAGE_COLORS.gold,
      backgroundColor: "rgba(218,165,32,0.1)",
      transform: "translateY(-1px)",
    },
  };

  return (
    <Box sx={headerSx}>
      <Container maxWidth="xl">
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            py: 1.5,
            position: "relative",
            zIndex: 1,
          }}
        >
          {/* Logo and Brand */}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box
              component="img"
              src={aiLogo}
              alt="Chronicle Explorer Logo"
              sx={logoSx}
            />
            <Typography variant="h6" sx={brandTextSx}>
              Chronicle Explorer
            </Typography>
          </Box>

          {/* Navigation */}
          <Box
            component="nav"
            sx={{ display: "flex", alignItems: "center", gap: 1 }}
          >
            <Box component={Link} to="/" sx={navLinkSx}>
              <Schedule fontSize="small" />
              Chronicles
            </Box>
            <Box component={Link} to="/about" sx={navLinkSx}>
              <Info fontSize="small" />
              About the Archives
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Header;
