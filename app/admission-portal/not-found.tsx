"use client"

import * as React from "react"
import Link from "next/link"
import Box from "@mui/material/Box"
import Container from "@mui/material/Container"
import Typography from "@mui/material/Typography"
import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"
import {
  Home as HomeIcon,
  Description as DescriptionIcon,
  ArrowBack as ArrowBackIcon,
} from "@mui/icons-material"

export default function AdmissionNotFound() {
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
        <Typography
          variant="h1"
          sx={{
            fontSize: { xs: "7rem", sm: "10rem" },
            fontWeight: 900,
            lineHeight: 1,
            color: "rgba(37, 99, 235, 0.1)",
            userSelect: "none",
            letterSpacing: "-0.05em",
          }}
        >
          404
        </Typography>

        <Box sx={{ mt: -3 }}>
          <Typography variant="h4" sx={{ fontWeight: 800, color: "text.primary", mb: 1 }}>
            Page Not Found
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary", maxWidth: 400, mx: "auto" }}>
            The admission portal page you are looking for does not exist or has been relocated.
          </Typography>
        </Box>

        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mt: 4 }}>
          <Link href="/" style={{ textDecoration: "none" }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<HomeIcon />}
              sx={{ px: 3 }}
            >
              Portal Home
            </Button>
          </Link>
          <Link href="/guideline" style={{ textDecoration: "none" }}>
            <Button
              variant="outlined"
              color="primary"
              startIcon={<DescriptionIcon />}
              sx={{ px: 3 }}
            >
              Admission Guideline
            </Button>
          </Link>
        </Stack>

        <Button
          onClick={() => window.history.back()}
          startIcon={<ArrowBackIcon />}
          sx={{ mt: 3, color: "text.secondary", fontSize: "0.85rem" }}
        >
          Go Back
        </Button>
      </Box>
    </Container>
  )
}
