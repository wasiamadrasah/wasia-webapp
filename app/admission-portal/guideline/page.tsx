import * as React from "react"
import Link from "next/link"
import Box from "@mui/material/Box"
import Container from "@mui/material/Container"
import Typography from "@mui/material/Typography"
import Button from "@mui/material/Button"
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import Grid from "@mui/material/Grid"
import Chip from "@mui/material/Chip"
import Paper from "@mui/material/Paper"
import Stack from "@mui/material/Stack"
import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableCell from "@mui/material/TableCell"
import TableContainer from "@mui/material/TableContainer"
import TableRow from "@mui/material/TableRow"
import Accordion from "@mui/material/Accordion"
import AccordionSummary from "@mui/material/AccordionSummary"
import AccordionDetails from "@mui/material/AccordionDetails"
import Alert from "@mui/material/Alert"
import AlertTitle from "@mui/material/AlertTitle"
import {
  Assignment as AssignmentIcon,
  Payment as PaymentIcon,
  EmojiEvents as EmojiEventsIcon,
  School as SchoolIcon,
  CheckCircle as CheckCircleIcon,
  ExpandMore as ExpandMoreIcon,
  Launch as LaunchIcon,
} from "@mui/icons-material"

export const metadata = {
  title: "Admission Guideline | Admission Portal",
  description: "Step-by-step admission guideline, required documents, important dates, and FAQs.",
}

const steps = [
  {
    icon: AssignmentIcon,
    title: "Complete the Online Application",
    detail:
      "Visit the official government school admission portal (gsa.teletalk.com.bd) and fill in the student's details accurately. Submit the form before the deadline.",
  },
  {
    icon: PaymentIcon,
    title: "Pay the Application Fee",
    detail:
      "After successful form submission, you will receive an applicant ID. Use it to pay the application fee via Teletalk SMS from a Teletalk SIM.",
  },
  {
    icon: EmojiEventsIcon,
    title: "Wait for Lottery / Merit Result",
    detail:
      "The government publishes selection results centrally. Students are selected by lottery or merit. Check the result on the official portal or school notice board.",
  },
  {
    icon: SchoolIcon,
    title: "Complete Final Admission",
    detail:
      "Selected students must report to the school within the specified dates with all original documents for verification and complete the final admission process.",
  },
]

const documents = [
  "Online application confirmation print-out",
  "Student birth certificate (original + 1 photocopy)",
  "3 recent passport-size photographs",
  "Guardian's National ID card (photocopy)",
  "Previous school final exam result / marksheet",
  "School leaving / transfer certificate (if applicable)",
  "Testimonial / character certificate from previous school",
]

const schedule = [
  { event: "Online Application Window", date: "As per government notification" },
  { event: "Application Fee Payment", date: "Within 72 hours of form submission" },
  { event: "Merit / Lottery Result", date: "Official government publication date" },
  { event: "1st Merit Final Admission", date: "17, 18 & 21 December" },
  { event: "2nd Merit Admission", date: "As announced by school" },
  { event: "3rd Merit Admission", date: "As announced by school" },
]

const faqs = [
  {
    q: "Who is eligible to apply for Class VI admission?",
    a: "Students who have completed Class V (Primary) and are 11–12 years old are eligible. They must apply through the national online admission system.",
  },
  {
    q: "Can I apply without a Teletalk SIM?",
    a: "No. The application fee payment is mandatory via Teletalk SMS. You must use a Teletalk SIM to pay the fee and complete the application.",
  },
  {
    q: "What happens if I miss the final admission date?",
    a: "If a selected student fails to complete admission within the specified dates, their seat may be forfeited. Always check the school notice board for exact dates.",
  },
  {
    q: "Is there a written entrance exam?",
    a: "For Class VI, selection is through the centralized government lottery/merit process — no school-level written exam. For other classes, availability and process vary.",
  },
  {
    q: "Where do I check results?",
    a: "Results are published on the official government admission portal and on the school's official notice board. You can also check the school's notice section on this portal.",
  },
]

export default function GuidelinePage() {
  return (
    <Box component="main" sx={{ minHeight: "calc(100vh - 64px)", pb: { xs: 8, md: 12 } }}>
      {/* Hero Header */}
      <Box
        sx={{
          bgcolor: "#ffffff",
          borderBottom: "1px solid",
          borderColor: "divider",
          py: { xs: 7, md: 9 },
          textAlign: "center",
        }}
      >
        <Container maxWidth="lg">
          <Chip
            label="Step-by-Step Instructions"
            color="primary"
            variant="outlined"
            size="small"
            sx={{
              fontWeight: 700,
              fontSize: "0.75rem",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              bgcolor: "rgba(37, 99, 235, 0.05)",
              mb: 2,
            }}
          />
          <Typography variant="h2" sx={{ fontWeight: 800, fontSize: { xs: "1.85rem", sm: "2.75rem" }, mb: 1.5, color: "text.primary" }}>
            Admission Guidelines
          </Typography>
          <Typography variant="subtitle1" sx={{ color: "text.secondary", maxWidth: 680, mx: "auto" }}>
            Follow these instructions carefully to apply and complete admission for Purba Bakalia City Corporation High School.
          </Typography>
        </Container>
      </Box>

      {/* Steps List */}
      <Container maxWidth="lg" sx={{ mt: { xs: 6, md: 8 } }}>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 3, color: "text.primary" }}>
          Application Procedure
        </Typography>

        <Stack spacing={2.5}>
          {steps.map(({ icon: Icon, title, detail }, index) => (
            <Card key={title} variant="outlined" sx={{ p: 1 }}>
              <CardContent sx={{ display: "flex", gap: 2.5, alignItems: "flex-start", p: 2, "&:last-child": { pb: 2 } }}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 1,
                    bgcolor: "primary.main",
                    color: "primary.contrastText",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Icon />
                </Box>
                <Box>
                  <Typography
                    variant="caption"
                    sx={{
                      fontWeight: 800,
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      color: "primary.main",
                      fontSize: "0.7rem",
                    }}
                  >
                    Step 0{index + 1}
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 700, fontSize: "1.1rem", mt: 0.2, mb: 0.5, color: "text.primary" }}>
                    {title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary", lineHeight: 1.6 }}>
                    {detail}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Stack>

        <Box sx={{ textAlign: "center", mt: 4 }}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            component="a"
            href="https://gsa.teletalk.com.bd"
            target="_blank"
            rel="noopener noreferrer"
            endIcon={<LaunchIcon />}
            sx={{ px: 4, py: 1.2 }}
          >
            Go to Government Application Portal
          </Button>
        </Box>
      </Container>

      {/* Required Documents Section */}
      <Container maxWidth="lg" sx={{ mt: { xs: 8, md: 10 } }}>
        <Paper variant="outlined" sx={{ p: { xs: 4, md: 5 }, bgcolor: "#ffffff", borderRadius: 1 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 1, color: "text.primary" }}>
            Required Documents for Verification
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary", mb: 3.5 }}>
            Bring original copies and one set of photocopies on the scheduled admission verification day.
          </Typography>

          <Grid container spacing={2}>
            {documents.map((doc) => (
              <Grid key={doc} size={{ xs: 12, sm: 6, md: 4 }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    p: 2,
                    borderRadius: 1,
                    bgcolor: "rgba(248, 250, 252, 0.9)",
                    border: "1px solid",
                    borderColor: "divider",
                    height: "100%",
                  }}
                >
                  <CheckCircleIcon sx={{ color: "primary.main", fontSize: 20, flexShrink: 0 }} />
                  <Typography variant="body2" sx={{ fontWeight: 500, color: "text.primary" }}>
                    {doc}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Paper>
      </Container>

      {/* Schedule Table */}
      <Container maxWidth="lg" sx={{ mt: { xs: 8, md: 10 } }}>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 1, color: "text.primary" }}>
          Important Admission Dates
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary", mb: 3 }}>
          Official timeline for the ongoing student intake cycle.
        </Typography>

        <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 1, overflow: "hidden" }}>
          <Table>
            <TableBody>
              {schedule.map(({ event, date }, idx) => (
                <TableRow
                  key={event}
                  sx={{
                    bgcolor: idx % 2 === 0 ? "#ffffff" : "rgba(248, 250, 252, 0.6)",
                  }}
                >
                  <TableCell sx={{ fontWeight: 600, color: "text.primary", py: 2 }}>{event}</TableCell>
                  <TableCell align="right" sx={{ py: 2 }}>
                    <Chip label={date} size="small" color="primary" variant="outlined" sx={{ fontWeight: 600 }} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Alert severity="info" sx={{ mt: 2.5 }}>
          <AlertTitle sx={{ fontWeight: 700 }}>Notice regarding schedule</AlertTitle>
          Dates are subject to change as per Ministry of Education circulars. Please check the notice board for updates.
        </Alert>
      </Container>

      {/* FAQs Accordion */}
      <Container maxWidth="lg" sx={{ mt: { xs: 8, md: 10 } }}>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 1, color: "text.primary" }}>
          Frequently Asked Questions
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary", mb: 3 }}>
          Common answers to parent and applicant questions.
        </Typography>

        <Box sx={{ "& .MuiAccordion-root": { mb: 1.5 } }}>
          {faqs.map(({ q, a }) => (
            <Accordion key={q} disableGutters>
              <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: "primary.main" }} />}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "text.primary" }}>
                  {q}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2" sx={{ color: "text.secondary", lineHeight: 1.6 }}>
                  {a}
                </Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      </Container>

      {/* Help CTA Box */}
      <Container maxWidth="lg" sx={{ mt: { xs: 8, md: 10 } }}>
        <Paper
          sx={{
            p: { xs: 4, md: 5 },
            bgcolor: "primary.main",
            color: "#ffffff",
            borderRadius: 1,
            textAlign: "center",
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>
            Have Additional Questions?
          </Typography>
          <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.85)", maxWidth: 500, mx: "auto", mb: 3 }}>
            Our admissions office is ready to help during regular working hours.
          </Typography>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ justifyContent: "center" }}>
            <Link href="/contact" style={{ textDecoration: "none" }}>
              <Button
                variant="contained"
                sx={{ bgcolor: "#ffffff", color: "primary.main", fontWeight: 700, "&:hover": { bgcolor: "#f1f5f9" } }}
              >
                Contact School Office
              </Button>
            </Link>
            <Link href="/notice" style={{ textDecoration: "none" }}>
              <Button
                variant="outlined"
                sx={{ borderColor: "rgba(255, 255, 255, 0.5)", color: "#ffffff", "&:hover": { borderColor: "#ffffff" } }}
              >
                View Notices
              </Button>
            </Link>
          </Stack>
        </Paper>
      </Container>
    </Box>
  )
}
