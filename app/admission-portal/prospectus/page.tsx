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
import Stack from "@mui/material/Stack"
import Paper from "@mui/material/Paper"
import Table from "@mui/material/Table"
import TableHead from "@mui/material/TableHead"
import TableBody from "@mui/material/TableBody"
import TableCell from "@mui/material/TableCell"
import TableContainer from "@mui/material/TableContainer"
import TableRow from "@mui/material/TableRow"
import {
  MenuBook as MenuBookIcon,
  Groups as GroupsIcon,
  EmojiEvents as EmojiEventsIcon,
  Schedule as ScheduleIcon,
  Launch as LaunchIcon,
  Description as DescriptionIcon,
} from "@mui/icons-material"

export const metadata = {
  title: "School Prospectus | Admission Portal",
  description: "Academic programs, facilities, and fee details for prospective students.",
}

const programs = [
  { grade: "Class VI", seats: "~150", age: "11–12 years", note: "Primary to secondary transition foundation" },
  { grade: "Class VII", seats: "Limited", age: "12–13 years", note: "Transfer admission subject to vacancy" },
  { grade: "Class VIII", seats: "Limited", age: "13–14 years", note: "Transfer admission subject to vacancy" },
  { grade: "Class IX", seats: "~100", age: "14–15 years", note: "Science, Humanities & Business streams" },
  { grade: "Class X", seats: "Limited", age: "15–16 years", note: "SSC candidates — subject to vacancy" },
]

const facilities = [
  { icon: MenuBookIcon, title: "Rich Library", desc: "Curated collection of textbooks, reference guides, and literature for all grades." },
  { icon: GroupsIcon, title: "Dedicated Faculty", desc: "Experienced educators fostering student intellect and character development." },
  { icon: EmojiEventsIcon, title: "Co-Curriculars", desc: "Annual sports, debating clubs, science fairs, and cultural festivities." },
  { icon: ScheduleIcon, title: "Morning Shift", desc: "Structured timetable designed to maximize focused learning hours." },
]

const stats = [
  { value: "50+", label: "Years of Heritage" },
  { value: "1000+", label: "Active Students" },
  { value: "40+", label: "Qualified Teachers" },
  { value: "SSC", label: "Board Affiliated" },
]

const feeItems = [
  { item: "Application Fee", amount: "As per Teletalk circular" },
  { item: "Admission Fee", amount: "BDT 500 – 1,000 (approx.)" },
  { item: "Monthly Tuition", amount: "BDT 200 – 500 (class-wise)" },
  { item: "Session Fee", amount: "Annual fee per session" },
  { item: "Exam Fee", amount: "As notified by academic calendar" },
]

export default function ProspectusPage() {
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
            label="Academic Prospectus"
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
          <Typography variant="h2" sx={{ fontWeight: 800, fontSize: { xs: "1.85rem", sm: "2.5rem" }, mb: 1.5, color: "text.primary" }}>
            School Academic Prospectus
          </Typography>
          <Typography variant="subtitle1" sx={{ color: "text.secondary", maxWidth: 620, mx: "auto", mb: 3.5 }}>
            Purba Bakalia City Corporation High School provides comprehensive education from Class VI through SSC under the NCTB national curriculum.
          </Typography>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ justifyContent: "center" }}>
            <Button
              variant="contained"
              color="primary"
              component="a"
              href="https://gsa.teletalk.com.bd"
              target="_blank"
              rel="noopener noreferrer"
              endIcon={<LaunchIcon />}
              sx={{ px: 3, py: 1.1 }}
            >
              Apply Online
            </Button>
            <Link href="/guideline" style={{ textDecoration: "none" }}>
              <Button
                variant="outlined"
                color="primary"
                startIcon={<DescriptionIcon />}
                sx={{ px: 3, py: 1.1 }}
              >
                Admission Guideline
              </Button>
            </Link>
          </Stack>
        </Container>
      </Box>

      {/* Stats Quick Grid */}
      <Container maxWidth="lg" sx={{ mt: -4 }}>
        <Grid container spacing={2.5}>
          {stats.map(({ value, label }) => (
            <Grid key={label} size={{ xs: 6, sm: 3 }}>
              <Paper
                elevation={0}
                variant="outlined"
                sx={{
                  p: 3,
                  textAlign: "center",
                  bgcolor: "#ffffff",
                }}
              >
                <Typography variant="h4" sx={{ fontWeight: 800, color: "primary.main", mb: 0.5 }}>
                  {value}
                </Typography>
                <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 600 }}>
                  {label}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Academic Programs Table */}
      <Container maxWidth="lg" sx={{ mt: { xs: 8, md: 10 } }}>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 1, color: "text.primary" }}>
          Academic Programs Offered
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary", mb: 3 }}>
          Classes offered under the Chittagong Education Board curriculum.
        </Typography>

        <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 1, overflow: "hidden" }}>
          <Table>
            <TableHead sx={{ bgcolor: "primary.main" }}>
              <TableRow>
                <TableCell sx={{ color: "#ffffff", fontWeight: 700 }}>Grade</TableCell>
                <TableCell sx={{ color: "#ffffff", fontWeight: 700 }}>Seat Capacity</TableCell>
                <TableCell sx={{ color: "#ffffff", fontWeight: 700 }}>Age Range</TableCell>
                <TableCell sx={{ color: "#ffffff", fontWeight: 700 }}>Stream / Curriculum Note</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {programs.map((p, idx) => (
                <TableRow
                  key={p.grade}
                  sx={{
                    bgcolor: idx % 2 === 0 ? "#ffffff" : "rgba(248, 250, 252, 0.6)",
                  }}
                >
                  <TableCell sx={{ fontWeight: 700, color: "text.primary" }}>{p.grade}</TableCell>
                  <TableCell>
                    <Chip label={p.seats} size="small" variant="outlined" color="primary" sx={{ fontWeight: 600 }} />
                  </TableCell>
                  <TableCell sx={{ color: "text.secondary" }}>{p.age}</TableCell>
                  <TableCell sx={{ color: "text.secondary" }}>{p.note}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>

      {/* Facilities Grid */}
      <Container maxWidth="lg" sx={{ mt: { xs: 8, md: 10 } }}>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 1, color: "text.primary" }}>
          Facilities & Learning Environment
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary", mb: 3 }}>
          Key highlights of our campus infrastructure and academic ecosystem.
        </Typography>

        <Grid container spacing={3}>
          {facilities.map(({ icon: Icon, title, desc }) => (
            <Grid key={title} size={{ xs: 12, sm: 6, md: 3 }}>
              <Card variant="outlined" sx={{ height: "100%" }}>
                <CardContent sx={{ p: 3 }}>
                  <Box
                    sx={{
                      width: 44,
                      height: 44,
                      borderRadius: 1,
                      bgcolor: "rgba(37, 99, 235, 0.08)",
                      color: "primary.main",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mb: 2,
                    }}
                  >
                    <Icon />
                  </Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0.5, color: "text.primary" }}>
                    {title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary", lineHeight: 1.6 }}>
                    {desc}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Fee Structure */}
      <Container maxWidth="md" sx={{ mt: { xs: 8, md: 10 } }}>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 1, color: "text.primary" }}>
          Fee Structure Estimate
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary", mb: 3 }}>
          Official fee estimates announced annually as per government regulations.
        </Typography>

        <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 1, overflow: "hidden" }}>
          <Table>
            <TableBody>
              {feeItems.map(({ item, amount }, idx) => (
                <TableRow
                  key={item}
                  sx={{
                    bgcolor: idx % 2 === 0 ? "#ffffff" : "rgba(248, 250, 252, 0.6)",
                  }}
                >
                  <TableCell sx={{ fontWeight: 600, color: "text.primary", py: 2 }}>{item}</TableCell>
                  <TableCell align="right" sx={{ py: 2 }}>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: "primary.main" }}>
                      {amount}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </Box>
  )
}
