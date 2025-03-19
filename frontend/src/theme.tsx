import { createSystem, defaultConfig } from "@chakra-ui/react"

export const system = createSystem(defaultConfig, {
	globalCss: {
		html: {
			fontSize: "16px",
		},
		body: {
			fontSize: "0.875rem",
			color: "blue.800",
			margin: 0,
			padding: 0,
		},
		".main-link": {
			color: "ui.main",
			fontWeight: "bold",
		},
	},
	theme: {
		tokens: {
			colors: {
				brand: {
					50: { value: "#e6f2ff" },
					100: { value: "#e6f2ff" },
					200: { value: "#bfdeff" },
					300: { value: "#99caff" },
					950: { value: "#001a33" },
				},
				ui: {
					main: { value: "#009688" },
				}
			},
		},
		semanticTokens: {
			colors: {
				brand: {
					solid: { value: "{colors.brand.500}" },
					contrast: { value: "{colors.brand.100}" },
					fg: { value: "{colors.brand.700}" },
					muted: { value: "{colors.brand.100}" },
					subtle: { value: "{colors.brand.200}" },
					emphasized: { value: "{colors.brand.300}" },
					focusRing: { value: "{colors.brand.500}" },
				},
			},
		},
	},
})
