import * as React from "react"
import Box from "@mui/material/Box"
import Container from "@mui/material/Container"
import Typography from "@mui/material/Typography"

export const metadata = {
  title: "Admission Portal | Purba Bakalia City Corporation High School",
  description: "Official Admission Portal for Purba Bakalia City Corporation High School.",
}

export default function AdmissionPortalPage() {
  return (
    <Box
      component="main"
      sx={{
        minHeight: "calc(100vh - 140px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
        py: 8,
      }}
    >
      <Container maxWidth="sm" sx={{ textAlign: "center" }}>
        <Typography
          variant="h2"
          sx={{
            fontWeight: 800,
            fontSize: { xs: "2rem", sm: "2.75rem" },
            color: "text.primary",
            mb: 1.5,
          }}
        >
          Content Coming Soon
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: "text.secondary",
            fontSize: { xs: "1rem", sm: "1.125rem" },
            maxWidth: 460,
            mx: "auto",
            lineHeight: 1.6,
          }}
        >
          Detailed admission information and session updates will be published here soon.
        </Typography>
      </Container>
    </Box>
  )
}
