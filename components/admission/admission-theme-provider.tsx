"use client"

import * as React from "react"
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter"
import { ThemeProvider, createTheme } from "@mui/material/styles"
import ScopedCssBaseline from "@mui/material/ScopedCssBaseline"
import GlobalStyles from "@mui/material/GlobalStyles"

export const admissionTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#2563EB",
      light: "#60A5FA",
      dark: "#1D4ED8",
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: "#0F172A",
      light: "#334155",
      dark: "#020617",
      contrastText: "#FFFFFF",
    },
    background: {
      default: "#F8FAFC",
      paper: "#FFFFFF",
    },
    success: {
      main: "#16A34A",
      light: "#4ADE80",
      dark: "#15803D",
      contrastText: "#FFFFFF",
    },
    warning: {
      main: "#F59E0B",
      light: "#FCD34D",
      dark: "#D97706",
      contrastText: "#FFFFFF",
    },
    error: {
      main: "#DC2626",
      light: "#F87171",
      dark: "#B91C1C",
      contrastText: "#FFFFFF",
    },
    text: {
      primary: "#0F172A",
      secondary: "#475569",
    },
    divider: "rgba(226, 232, 240, 0.8)",
  },
  typography: {
    fontFamily: [
      "Inter",
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
    ].join(","),
    button: {
      textTransform: "none",
      fontWeight: 600,
    },
    h1: {
      fontWeight: 800,
      letterSpacing: "-0.025em",
    },
    h2: {
      fontWeight: 700,
      letterSpacing: "-0.02em",
    },
    h3: {
      fontWeight: 700,
      letterSpacing: "-0.015em",
    },
    h4: {
      fontWeight: 700,
    },
    subtitle1: {
      fontSize: "1rem",
      lineHeight: 1.6,
    },
  },
  shape: {
    borderRadius: 6,
  },
  components: {
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          borderRadius: 6,
          padding: "7px 18px",
          fontWeight: 600,
          transition: "all 0.2s ease-in-out",
        },
        contained: {
          boxShadow: "none",
          "&:hover": {
            boxShadow: "0 2px 8px rgba(37, 99, 235, 0.2)",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.04)",
          border: "1px solid #e2e8f0",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        rounded: {
          borderRadius: 8,
        },
      },
    },
    MuiAccordion: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          border: "1px solid #e2e8f0",
          boxShadow: "none",
          "&:before": {
            display: "none",
          },
          "&.Mui-expanded": {
            margin: "6px 0",
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 4,
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 6,
        },
      },
    },
  },
})

export function AdmissionMaterialProvider({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AppRouterCacheProvider options={{ key: "admission-mui" }}>
      <ThemeProvider theme={admissionTheme}>
        <GlobalStyles
          styles={{
            "html, body, *": {
              scrollbarWidth: "thin",
              scrollbarColor: "#2563EB #F1F5F9",
            },
            "*::-webkit-scrollbar": {
              width: "8px",
              height: "8px",
            },
            "*::-webkit-scrollbar-track": {
              background: "#F1F5F9",
            },
            "*::-webkit-scrollbar-thumb": {
              backgroundColor: "#2563EB",
              borderRadius: "4px",
              border: "2px solid #F1F5F9",
              transition: "background-color 0.2s ease, border-color 0.2s ease",
            },
            "*::-webkit-scrollbar-thumb:hover": {
              backgroundColor: "#1D4ED8",
            },
            "*::-webkit-scrollbar-thumb:active": {
              backgroundColor: "#1E3A8A",
            },
            "*::-webkit-scrollbar-corner": {
              background: "#F1F5F9",
            },
          }}
        />
        <ScopedCssBaseline
          sx={{
            backgroundColor: "transparent",
            color: "inherit",
            fontFamily: "inherit",
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {children}
        </ScopedCssBaseline>
      </ThemeProvider>
    </AppRouterCacheProvider>
  )
}
