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
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import {
  Place as PlaceIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Language as LanguageIcon,
  AccessTime as AccessTimeIcon,
  Launch as LaunchIcon,
} from "@mui/icons-material"
import { getInstituteSettings } from "@/lib/institute-settings-store"

export const metadata = {
  title: "Admission Enquiries & Contact | Admission Portal",
  description: "Contact Purba Bakalia City Corporation High School for admission help and office hours.",
}

const officeHours = [
  { day: "Saturday – Thursday", time: "9:00 AM – 3:00 PM" },
  { day: "Friday", time: "Closed" },
  { day: "Government Holidays", time: "Closed" },
]

const quickLinks = [
  { label: "Admission Guideline", href: "/guideline" },
  { label: "School Prospectus", href: "/prospectus" },
  { label: "Circulars & Notices", href: "/notice" },
  { label: "Government Portal", href: "https://gsa.teletalk.com.bd" },
]

export default async function ContactPage() {
  const settings = await getInstituteSettings().catch(() => null)
  const primary = settings?.primary
  const contact = settings?.contact

  const name = primary?.instituteName ?? "Purba Bakalia City Corporation High School"
  const address = contact?.address ?? "Purba Bakalia, Chattogram, Bangladesh"
  const phone = contact?.mobile || contact?.telephone || "01309-131385"
  const email = contact?.email ?? ""
  const website = contact?.website ?? ""
  const mapUrl = contact?.googleMapEmbed ?? ""

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
            label="Admission Help Desk"
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
            Contact Admissions Desk
          </Typography>
          <Typography variant="subtitle1" sx={{ color: "text.secondary", maxWidth: 680, mx: "auto" }}>
            Reach out to our admission help desk or visit the campus during official office hours for inquiries and assistance.
          </Typography>
        </Container>
      </Box>

      {/* Info Cards Grid */}
      <Container maxWidth="lg" sx={{ mt: { xs: 6, md: 8 } }}>
        <Grid container spacing={3}>
          {/* Address Card */}
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Card variant="outlined" sx={{ height: "100%" }}>
              <CardContent sx={{ p: 3.5 }}>
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
                  <PlaceIcon />
                </Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "text.primary", mb: 0.5 }}>
                  School Campus
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary", lineHeight: 1.6 }}>
                  {address}
                </Typography>
                <Typography variant="caption" sx={{ color: "primary.main", fontWeight: 600, mt: 1.5, display: "block" }}>
                  {name}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Phone Card */}
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Card variant="outlined" sx={{ height: "100%" }}>
              <CardContent sx={{ p: 3.5 }}>
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
                  <PhoneIcon />
                </Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "text.primary", mb: 0.5 }}>
                  Helpline Phone
                </Typography>
                <Box
                  component="a"
                  href={`tel:${phone}`}
                  sx={{
                    display: "block",
                    fontWeight: 700,
                    color: "primary.main",
                    textDecoration: "none",
                    fontSize: "1.1rem",
                    "&:hover": { textDecoration: "underline" },
                  }}
                >
                  {phone}
                </Box>
                <Typography variant="caption" sx={{ color: "text.secondary", mt: 1.5, display: "block" }}>
                  Call between 9:00 AM – 3:00 PM (Sat–Thu)
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Office Hours */}
          <Grid size={{ xs: 12, sm: 12, md: 4 }}>
            <Card variant="outlined" sx={{ height: "100%" }}>
              <CardContent sx={{ p: 3.5 }}>
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
                  <AccessTimeIcon />
                </Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "text.primary", mb: 1.5 }}>
                  Admission Office Hours
                </Typography>

                <List dense disablePadding>
                  {officeHours.map(({ day, time }) => (
                    <ListItem key={day} disableGutters sx={{ py: 0.4, display: "flex", justifyContent: "space-between" }}>
                      <Typography variant="body2" sx={{ color: "text.secondary" }}>
                        {day}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 700,
                          color: time === "Closed" ? "error.main" : "primary.main",
                        }}
                      >
                        {time}
                      </Typography>
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>

          {/* Email Card (if available) */}
          {email && (
            <Grid size={{ xs: 12, sm: website ? 6 : 12 }}>
              <Card variant="outlined" sx={{ height: "100%" }}>
                <CardContent sx={{ p: 3.5 }}>
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
                    <EmailIcon />
                  </Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "text.primary", mb: 0.5 }}>
                    Email Address
                  </Typography>
                  <Box
                    component="a"
                    href={`mailto:${email}`}
                    sx={{
                      display: "block",
                      fontWeight: 600,
                      color: "primary.main",
                      textDecoration: "none",
                      fontSize: "0.95rem",
                      "&:hover": { textDecoration: "underline" },
                    }}
                  >
                    {email}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          )}

          {/* Website Card (if available) */}
          {website && (
            <Grid size={{ xs: 12, sm: email ? 6 : 12 }}>
              <Card variant="outlined" sx={{ height: "100%" }}>
                <CardContent sx={{ p: 3.5 }}>
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
                    <LanguageIcon />
                  </Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "text.primary", mb: 0.5 }}>
                    Main Website
                  </Typography>
                  <Box
                    component="a"
                    href={website}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      display: "block",
                      fontWeight: 600,
                      color: "primary.main",
                      textDecoration: "none",
                      fontSize: "0.95rem",
                      "&:hover": { textDecoration: "underline" },
                    }}
                  >
                    {website}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          )}
        </Grid>

        {/* Quick Links */}
        <Paper variant="outlined" sx={{ p: { xs: 3, md: 4 }, mt: 4, borderRadius: 1, bgcolor: "#ffffff" }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "text.primary", mb: 2.5 }}>
            Helpful Admission Shortcuts
          </Typography>
          <Grid container spacing={2.5}>
            {quickLinks.map(({ label, href }) => (
              <Grid key={href} size={{ xs: 12, sm: 6, md: 3 }}>
                {href.startsWith("http") ? (
                  <Button
                    component="a"
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="outlined"
                    color="primary"
                    fullWidth
                    endIcon={<LaunchIcon sx={{ fontSize: 16 }} />}
                    sx={{ py: 1.2, fontSize: "0.875rem", justifyContent: "space-between" }}
                  >
                    {label}
                  </Button>
                ) : (
                  <Link href={href} style={{ textDecoration: "none", width: "100%", display: "block" }}>
                    <Button
                      variant="outlined"
                      color="primary"
                      fullWidth
                      endIcon={<LaunchIcon sx={{ fontSize: 16 }} />}
                      sx={{ py: 1.2, fontSize: "0.875rem", justifyContent: "space-between" }}
                    >
                      {label}
                    </Button>
                  </Link>
                )}
              </Grid>
            ))}
          </Grid>
        </Paper>

        {/* Google Map Embed */}
        {mapUrl && (
          <Paper variant="outlined" sx={{ mt: 4, borderRadius: 1, overflow: "hidden" }}>
            <iframe
              src={mapUrl}
              width="100%"
              height="380"
              style={{ border: 0, display: "block" }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="School Campus Location"
            />
          </Paper>
        )}
      </Container>
    </Box>
  )
}
