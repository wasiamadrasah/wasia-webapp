"use client"

import * as React from "react"
import Link from "next/link"
import Box from "@mui/material/Box"
import Container from "@mui/material/Container"
import Typography from "@mui/material/Typography"
import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"
import {
  Error as ErrorIcon,
  Refresh as RefreshIcon,
  Home as HomeIcon,
} from "@mui/icons-material"

export default function AdmissionError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  React.useEffect(() => {
    console.error("[Admission Portal] Page error:", error)
  }, [error])

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: "calc(100vh - 200px)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          py: 10,
        }}
      >
        <Box
          sx={{
            width: 64,
            height: 64,
            borderRadius: 1,
            bgcolor: "rgba(239, 68, 68, 0.1)",
            color: "error.main",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mb: 2.5,
          }}
        >
          <ErrorIcon sx={{ fontSize: 36 }} />
        </Box>

        <Typography variant="h4" sx={{ fontWeight: 800, color: "text.primary", mb: 1 }}>
          Something Went Wrong
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary", maxWidth: 420, mx: "auto" }}>
          An unexpected error occurred while loading this page. You can try refreshing or navigate to the portal home.
        </Typography>

        {error.digest && (
          <Typography variant="caption" sx={{ color: "text.secondary", fontFamily: "monospace", mt: 1 }}>
            Error ID: {error.digest}
          </Typography>
        )}

        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mt: 4 }}>
          <Button
            onClick={reset}
            variant="contained"
            color="primary"
            startIcon={<RefreshIcon />}
            sx={{ px: 3 }}
          >
            Try Again
          </Button>
          <Link href="/" style={{ textDecoration: "none" }}>
            <Button
              variant="outlined"
              color="primary"
              startIcon={<HomeIcon />}
              sx={{ px: 3 }}
            >
              Portal Home
            </Button>
          </Link>
        </Stack>
      </Box>
    </Container>
  )
}
