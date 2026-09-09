"use client"

import * as React from "react"
import Box from "@mui/material/Box"
import Paper from "@mui/material/Paper"
import Typography from "@mui/material/Typography"
import Button from "@mui/material/Button"
import Checkbox from "@mui/material/Checkbox"
import FormControlLabel from "@mui/material/FormControlLabel"
import Grid from "@mui/material/Grid"
import Alert from "@mui/material/Alert"
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import ListItemIcon from "@mui/material/ListItemIcon"
import ListItemText from "@mui/material/ListItemText"
import Divider from "@mui/material/Divider"
import {
  ArrowForward as ArrowForwardIcon,
  CheckCircleOutlined as CheckCircleIcon,
  GavelOutlined as RulesIcon,
  FolderSpecialOutlined as DocumentsIcon,
  ShieldOutlined as WarningIcon,
  AutoFixHigh as AutoFixHighIcon,
} from "@mui/icons-material"
import { useAdmissionFlow } from "./admission-flow-context"

export function Step1Conditions() {
  const { agreedToTerms, setAgreedToTerms, setStep, loadSampleData } = useAdmissionFlow()

  const handleContinue = () => {
    if (agreedToTerms) {
      setStep(2)
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  const handleQuickDemo = () => {
    loadSampleData()
    setStep(2)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <Box sx={{ maxWidth: 880, mx: "auto" }}>
      {/* Page Title & Intro */}
      <Box sx={{ mb: 4, textAlign: { xs: "left", sm: "center" } }}>
        <Typography
          variant="caption"
          sx={{
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.12em",
            color: "primary.main",
            display: "block",
            mb: 0.5,
          }}
        >
          Step 1 of 4
        </Typography>
        <Typography variant="h4" sx={{ fontWeight: 800, color: "text.primary", mb: 1 }}>
          Terms & Conditions
        </Typography>
        <Typography variant="body1" sx={{ color: "text.secondary", maxWidth: 600, mx: "auto" }}>
          Before proceeding, please read and accept the admission rules and application guidelines.
        </Typography>
      </Box>

      {/* Main Conditions Card */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, sm: 4 },
          borderRadius: "8px",
          border: "1px solid",
          borderColor: "divider",
          bgcolor: "#FFFFFF",
          mb: 4,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2.5 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 36,
              height: 36,
              borderRadius: "6px",
              bgcolor: "rgba(37, 99, 235, 0.1)",
              color: "primary.main",
            }}
          >
            <RulesIcon sx={{ fontSize: 20 }} />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 700, color: "text.primary" }}>
            General Admission Rules & Regulations
          </Typography>
        </Box>

        <List disablePadding sx={{ mb: 3 }}>
          {[
            {
              title: "Authenticity of Information",
              desc: "All personal, guardian, and academic records provided must be authentic. Any falsification or forged documentation will lead to immediate cancellation of admission and disciplinary actions.",
            },
            {
              title: "Eligibility & Age Criteria",
              desc: "The applicant must meet the required minimum age and educational qualifications for the selected grade as mandated by the Directorate of Secondary and Higher Education (DSHE).",
            },
            {
              title: "Single Application Policy",
              desc: "Only one application per student for a specific class and shift is permitted. Multiple submissions under identical birth registration numbers will be invalidated.",
            },
            {
              title: "Quota & Special Category Verification",
              desc: "Applicants claiming Freedom Fighter, Sibling, Disability, or Institutional Quota must present verified government certificates during the document verification stage.",
            },
            {
              title: "Lottery / Merit Selection Policy",
              desc: "Admission decisions are subject to the Central Government Digital Lottery / Institutional Selection Committee. Submission of this form does not guarantee guaranteed admission.",
            },
          ].map((item, idx) => (
            <ListItem key={idx} disableGutters sx={{ alignItems: "flex-start", py: 1.2 }}>
              <ListItemIcon sx={{ minWidth: 28, mt: 0.4 }}>
                <CheckCircleIcon sx={{ fontSize: 18, color: "primary.main" }} />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "text.primary", mb: 0.2 }}>
                    {item.title}
                  </Typography>
                }
                secondary={
                  <Typography variant="body2" sx={{ color: "text.secondary", lineHeight: 1.5 }}>
                    {item.desc}
                  </Typography>
                }
              />
            </ListItem>
          ))}
        </List>

        <Divider sx={{ my: 3 }} />

        {/* Required Documents Section */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 36,
              height: 36,
              borderRadius: "6px",
              bgcolor: "rgba(22, 163, 74, 0.1)",
              color: "#16A34A",
            }}
          >
            <DocumentsIcon sx={{ fontSize: 20 }} />
          </Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "text.primary" }}>
            Documents Required During Verification
          </Typography>
        </Box>

        <Grid container spacing={2} sx={{ mb: 3 }}>
          {[
            "Original & Photocopy of Online Birth Registration Certificate (17 Digits)",
            "Previous School Academic Transcript / Report Card / PSC / JSC Marksheet",
            "Original Transfer Certificate (TC) from the previous approved institution",
            "3 copies of recent Passport-size photographs of the student in white background",
            "Photocopy of Father's and Mother's National ID Cards (NID)",
            "Attested Quota Certificate from appropriate authority (if applicable)",
          ].map((doc, index) => (
            <Grid key={index} size={{ xs: 12, sm: 6 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.2,
                  p: 1.5,
                  borderRadius: "6px",
                  bgcolor: "#F8FAFC",
                  border: "1px solid #E2E8F0",
                  height: "100%",
                }}
              >
                <Box
                  sx={{
                    width: 20,
                    height: 20,
                    borderRadius: "50%",
                    bgcolor: "rgba(37, 99, 235, 0.15)",
                    color: "primary.main",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    flexShrink: 0,
                  }}
                >
                  {index + 1}
                </Box>
                <Typography variant="body2" sx={{ color: "text.primary", fontSize: "0.825rem", fontWeight: 500 }}>
                  {doc}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>

        <Alert
          icon={<WarningIcon fontSize="inherit" />}
          severity="info"
          sx={{
            borderRadius: "6px",
            fontSize: "0.85rem",
            mb: 3,
            "& .MuiAlert-icon": { color: "primary.main" },
          }}
        >
          Please keep digital copies or scans of your details ready to make form filling quick and error-free.
        </Alert>

        {/* Agreement Checkbox */}
        <Box
          sx={{
            p: 2,
            borderRadius: "6px",
            bgcolor: agreedToTerms ? "rgba(37, 99, 235, 0.05)" : "#F8FAFC",
            border: "1.5px solid",
            borderColor: agreedToTerms ? "primary.main" : "#CBD5E1",
            transition: "all 0.2s ease",
          }}
        >
          <FormControlLabel
            control={
              <Checkbox
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                color="primary"
                sx={{
                  "&.Mui-checked": {
                    color: "primary.main",
                  },
                }}
              />
            }
            label={
              <Typography sx={{ fontWeight: 600, fontSize: "0.925rem", color: "text.primary" }}>
                I have read, understood, and agree to the admission terms and conditions.
              </Typography>
            }
          />
        </Box>
      </Paper>

      {/* Action Navigation */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column-reverse", sm: "row" },
          justifyContent: "space-between",
          alignItems: "center",
          gap: 2,
        }}
      >
        <Button
          variant="outlined"
          color="secondary"
          startIcon={<AutoFixHighIcon />}
          onClick={handleQuickDemo}
          sx={{
            py: 1.2,
            px: 2.5,
            borderRadius: "6px",
            fontWeight: 600,
            fontSize: "0.875rem",
            width: { xs: "100%", sm: "auto" },
          }}
        >
          Fill Demo Data & Continue
        </Button>

        <Button
          variant="contained"
          color="primary"
          disabled={!agreedToTerms}
          onClick={handleContinue}
          endIcon={<ArrowForwardIcon />}
          sx={{
            py: 1.3,
            px: 4,
            borderRadius: "6px",
            fontWeight: 700,
            fontSize: "0.95rem",
            width: { xs: "100%", sm: "auto" },
            boxShadow: agreedToTerms ? "0 4px 14px rgba(37, 99, 235, 0.35)" : "none",
          }}
        >
          Continue to Form →
        </Button>
      </Box>
    </Box>
  )
}
