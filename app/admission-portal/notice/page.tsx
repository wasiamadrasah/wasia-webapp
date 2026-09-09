import * as React from "react"
import Link from "next/link"
import Box from "@mui/material/Box"
import Container from "@mui/material/Container"
import Typography from "@mui/material/Typography"
import Button from "@mui/material/Button"
import Chip from "@mui/material/Chip"
import Paper from "@mui/material/Paper"
import Table from "@mui/material/Table"
import TableHead from "@mui/material/TableHead"
import TableBody from "@mui/material/TableBody"
import TableCell from "@mui/material/TableCell"
import TableContainer from "@mui/material/TableContainer"
import TableRow from "@mui/material/TableRow"
import {
  NotificationsNone as NotificationsNoneIcon,
  CalendarMonth as CalendarMonthIcon,
  Download as DownloadIcon,
  Description as DescriptionIcon,
} from "@mui/icons-material"
import { getNoticesByCategory } from "@/lib/db"

export const metadata = {
  title: "Admission Notices & Circulars | Admission Portal",
  description: "Official circulars, merit lists, and announcements regarding student admissions.",
}

function formatDate(raw: string | null): string {
  if (!raw) return "—"
  const d = new Date(raw)
  if (isNaN(d.getTime())) return raw
  return d.toLocaleDateString("en-BD", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

export default async function NoticePage() {
  const notices = await getNoticesByCategory("admission", 50).catch(() => [])

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
            label="Official Circulars"
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
            Admission Notice Board
          </Typography>
          <Typography variant="subtitle1" sx={{ color: "text.secondary", maxWidth: 680, mx: "auto" }}>
            Official announcements, merit lists, interview dates, and guidelines published by the school administration.
          </Typography>
        </Container>
      </Box>

      {/* Notice Table / Empty State */}
      <Container maxWidth="lg" sx={{ mt: { xs: 6, md: 8 } }}>
        {notices.length === 0 ? (
          <Paper
            variant="outlined"
            sx={{
              p: 6,
              textAlign: "center",
              borderRadius: 1,
              bgcolor: "#ffffff",
            }}
          >
            <Box
              sx={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                bgcolor: "rgba(37, 99, 235, 0.08)",
                color: "primary.main",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mx: "auto",
                mb: 2.5,
              }}
            >
              <NotificationsNoneIcon sx={{ fontSize: 32 }} />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 700, color: "text.primary", mb: 1 }}>
              No Active Admission Notices
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary", maxWidth: 400, mx: "auto", mb: 3 }}>
              Admission circulars will be published here as soon as released. You can also contact the school office.
            </Typography>
            <Link href="/contact" style={{ textDecoration: "none" }}>
              <Button variant="outlined" color="primary">
                Contact School Office
              </Button>
            </Link>
          </Paper>
        ) : (
          <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 1, overflow: "hidden" }}>
            <Table>
              <TableHead sx={{ bgcolor: "primary.main" }}>
                <TableRow>
                  <TableCell sx={{ color: "#ffffff", fontWeight: 700 }}>Notice Title</TableCell>
                  <TableCell sx={{ color: "#ffffff", fontWeight: 700, display: { xs: "none", sm: "table-cell" } }}>
                    Date
                  </TableCell>
                  <TableCell align="right" sx={{ color: "#ffffff", fontWeight: 700 }}>
                    Attachment
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {notices.map((notice, idx) => {
                  const date = formatDate(notice.published_at ?? notice.publish_date)
                  const hasFile = !!notice.attachment_url

                  return (
                    <TableRow
                      key={notice.id}
                      sx={{
                        bgcolor: idx % 2 === 0 ? "#ffffff" : "rgba(248, 250, 252, 0.6)",
                        "&:hover": { bgcolor: "rgba(37, 99, 235, 0.04)" },
                      }}
                    >
                      <TableCell sx={{ py: 2.5 }}>
                        <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
                          <DescriptionIcon sx={{ color: "primary.main", fontSize: 20, mt: 0.2 }} />
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 600, color: "text.primary" }}>
                              {notice.title ?? "Untitled Circular"}
                            </Typography>
                            <Typography
                              variant="caption"
                              sx={{ color: "text.secondary", display: { xs: "block", sm: "none" }, mt: 0.5 }}
                            >
                              {date}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>

                      <TableCell sx={{ display: { xs: "none", sm: "table-cell" }, py: 2.5 }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.8, color: "text.secondary" }}>
                          <CalendarMonthIcon sx={{ fontSize: 16 }} />
                          <Typography variant="body2" sx={{ fontSize: "0.85rem" }}>
                            {date}
                          </Typography>
                        </Box>
                      </TableCell>

                      <TableCell align="right" sx={{ py: 2.5 }}>
                        {hasFile ? (
                          <Button
                            variant="outlined"
                            size="small"
                            color="primary"
                            component="a"
                            href={notice.attachment_url!}
                            target="_blank"
                            rel="noopener noreferrer"
                            startIcon={<DownloadIcon />}
                            sx={{ fontSize: "0.75rem", py: 0.5 }}
                          >
                            Download
                          </Button>
                        ) : (
                          <Chip label="No Attachment" size="small" variant="outlined" sx={{ color: "text.secondary" }} />
                        )}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Container>
    </Box>
  )
}
