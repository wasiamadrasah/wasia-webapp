"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import Box from "@mui/material/Box"
import Container from "@mui/material/Container"
import Grid from "@mui/material/Grid"
import Typography from "@mui/material/Typography"
import Button from "@mui/material/Button"
import IconButton from "@mui/material/IconButton"
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import ListItemIcon from "@mui/material/ListItemIcon"
import ListItemText from "@mui/material/ListItemText"
import {
  Place as PlaceIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Facebook as FacebookIcon,
  YouTube as YouTubeIcon,
  Instagram as InstagramIcon,
  ChevronRight as ChevronRightIcon,
  Launch as LaunchIcon,
  ArrowForward as ArrowForwardIcon,
} from "@mui/icons-material"

type SchoolBranding = {
  instituteName: string
  logo: string | null
  address: string
  phone: string
  email: string
  facebook: string
  youtube: string
  instagram: string
}

const DEFAULT_BRANDING: SchoolBranding = {
  instituteName: "Purba Bakalia City Corporation High School",
  logo: null,
  address: "Purba Bakalia, Chattogram, Bangladesh",
  phone: "01309-131385",
  email: "",
  facebook: "#",
  youtube: "#",
  instagram: "#",
}

const portalLinks = [
  { label: "Main Home", href: "/" },
  { label: "Prospectus", href: "/prospectus" },
  { label: "Guideline", href: "/guideline" },
  { label: "Notice", href: "/notice" },
  { label: "Contact", href: "/contact" },
]

const admissionLinks = [
  { label: "How to Apply", href: "/guideline" },
  { label: "Required Documents", href: "/guideline#documents" },
  { label: "Important Dates", href: "/guideline#dates" },
  { label: "Fee Structure", href: "/prospectus#fees" },
  { label: "Apply Online", href: "/apply" },
]

export function AdmissionFooter() {
  const [branding, setBranding] = React.useState<SchoolBranding>(DEFAULT_BRANDING)

  React.useEffect(() => {
    const fetchBranding = async () => {
      try {
        const res = await fetch("/api/public/home-feed")
        const data = await res.json()
        const primary = data?.institute_settings?.primary
        const contact = data?.institute_settings?.contact
        const social = data?.institute_settings?.social
        setBranding({
          instituteName: primary?.instituteName ?? DEFAULT_BRANDING.instituteName,
          logo: primary?.logo ?? null,
          address: contact?.address ?? DEFAULT_BRANDING.address,
          phone: contact?.mobile || contact?.telephone || DEFAULT_BRANDING.phone,
          email: contact?.email ?? DEFAULT_BRANDING.email,
          facebook: social?.facebook ?? DEFAULT_BRANDING.facebook,
          youtube: social?.youtube ?? DEFAULT_BRANDING.youtube,
          instagram: social?.instagram ?? DEFAULT_BRANDING.instagram,
        })
      } catch {
        /* keep defaults */
      }
    }
    fetchBranding()
  }, [])

  const year = new Date().getFullYear()

  return (
    <Box
      component="footer"
      sx={{
        background: "linear-gradient(180deg, #0F172A 0%, #0A0F1D 100%)",
        color: "#94A3B8",
        borderTop: "2px solid #2563EB",
        boxShadow: "0 -4px 20px rgba(0, 0, 0, 0.2)",
        mt: "auto",
      }}
    >
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 7 } }}>
        <Grid container spacing={{ xs: 4, md: 5 }}>
          {/* Col 1: Identity & Contact */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
              <Box
                sx={{
                  position: "relative",
                  width: 46,
                  height: 46,
                  flexShrink: 0,
                }}
              >
                <Image
                  src={branding.logo ?? "/favicon.ico"}
                  alt="School Logo"
                  fill
                  style={{ objectFit: "contain" }}
                  sizes="46px"
                  unoptimized
                />
              </Box>
              <Box>
                <Typography
                  variant="caption"
                  sx={{
                    display: "block",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.12em",
                    color: "#38BDF8",
                    fontSize: "0.7rem",
                  }}
                >
                  Admission Portal
                </Typography>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#F8FAFC", lineHeight: 1.25 }}>
                  {branding.instituteName}
                </Typography>
              </Box>
            </Box>

            <Typography variant="body2" sx={{ color: "#94A3B8", mb: 2.5, lineHeight: 1.6, fontSize: "0.875rem" }}>
              Official admission portal for online application, guidelines, fee structures, and circulars.
            </Typography>

            <List dense disablePadding sx={{ mb: 3 }}>
              {branding.address && (
                <ListItem disableGutters sx={{ py: 0.6, alignItems: "flex-start" }}>
                  <ListItemIcon
                    sx={{
                      minWidth: 32,
                      color: "#38BDF8",
                      mt: 0.2,
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: 24,
                        height: 24,
                        borderRadius: "4px",
                        bgcolor: "rgba(56, 189, 248, 0.1)",
                      }}
                    >
                      <PlaceIcon sx={{ fontSize: 15 }} />
                    </Box>
                  </ListItemIcon>
                  <ListItemText
                    primary={<Typography sx={{ fontSize: "0.85rem", color: "#CBD5E1", lineHeight: 1.4 }}>{branding.address}</Typography>}
                  />
                </ListItem>
              )}
              {branding.phone && (
                <ListItem disableGutters sx={{ py: 0.6 }}>
                  <ListItemIcon
                    sx={{
                      minWidth: 32,
                      color: "#38BDF8",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: 24,
                        height: 24,
                        borderRadius: "4px",
                        bgcolor: "rgba(56, 189, 248, 0.1)",
                      }}
                    >
                      <PhoneIcon sx={{ fontSize: 14 }} />
                    </Box>
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Box
                        component="a"
                        href={`tel:${branding.phone}`}
                        sx={{
                          color: "#CBD5E1",
                          textDecoration: "none",
                          fontSize: "0.85rem",
                          transition: "color 0.2s",
                          "&:hover": { color: "#38BDF8" },
                        }}
                      >
                        {branding.phone}
                      </Box>
                    }
                  />
                </ListItem>
              )}
              {branding.email && (
                <ListItem disableGutters sx={{ py: 0.6 }}>
                  <ListItemIcon
                    sx={{
                      minWidth: 32,
                      color: "#38BDF8",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: 24,
                        height: 24,
                        borderRadius: "4px",
                        bgcolor: "rgba(56, 189, 248, 0.1)",
                      }}
                    >
                      <EmailIcon sx={{ fontSize: 14 }} />
                    </Box>
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Box
                        component="a"
                        href={`mailto:${branding.email}`}
                        sx={{
                          color: "#CBD5E1",
                          textDecoration: "none",
                          fontSize: "0.85rem",
                          transition: "color 0.2s",
                          "&:hover": { color: "#38BDF8" },
                        }}
                      >
                        {branding.email}
                      </Box>
                    }
                  />
                </ListItem>
              )}
            </List>

            {/* Social Links */}
            <Box sx={{ display: "flex", gap: 1 }}>
              {[
                { href: branding.facebook, Icon: FacebookIcon, label: "Facebook" },
                { href: branding.youtube, Icon: YouTubeIcon, label: "YouTube" },
                { href: branding.instagram, Icon: InstagramIcon, label: "Instagram" },
              ]
                .filter(({ href }) => href && href !== "#")
                .map(({ href, Icon, label }) => (
                  <IconButton
                    key={label}
                    component="a"
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    size="small"
                    aria-label={label}
                    sx={{
                      color: "#94A3B8",
                      bgcolor: "rgba(255, 255, 255, 0.04)",
                      border: "1px solid rgba(255, 255, 255, 0.08)",
                      borderRadius: "6px",
                      transition: "all 0.2s ease-in-out",
                      "&:hover": {
                        color: "#FFFFFF",
                        bgcolor: "#2563EB",
                        borderColor: "#2563EB",
                        transform: "translateY(-2px)",
                      },
                    }}
                  >
                    <Icon fontSize="small" />
                  </IconButton>
                ))}
            </Box>
          </Grid>

          {/* Col 2: Portal Navigation */}
          <Grid size={{ xs: 6, sm: 3, md: 2 }}>
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 700,
                color: "#F8FAFC",
                mb: 2.5,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                fontSize: "0.8rem",
              }}
            >
              Portal
            </Typography>
            <List dense disablePadding>
              {portalLinks.map(({ label, href }) => (
                <ListItem key={href} disableGutters sx={{ py: 0.5 }}>
                  <Box
                    component={Link}
                    href={href}
                    sx={{
                      display: "inline-flex",
                      alignItems: "center",
                      color: "#94A3B8",
                      textDecoration: "none",
                      fontSize: "0.875rem",
                      transition: "all 0.2s ease",
                      "&:hover": {
                        color: "#38BDF8",
                        transform: "translateX(4px)",
                      },
                    }}
                  >
                    <ChevronRightIcon sx={{ fontSize: 16, mr: 0.5, color: "#2563EB" }} />
                    {label}
                  </Box>
                </ListItem>
              ))}
            </List>
          </Grid>

          {/* Col 3: Admission Links */}
          <Grid size={{ xs: 6, sm: 3, md: 3 }}>
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 700,
                color: "#F8FAFC",
                mb: 2.5,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                fontSize: "0.8rem",
              }}
            >
              Admission
            </Typography>
            <List dense disablePadding>
              {admissionLinks.map(({ label, href }) => (
                <ListItem key={href} disableGutters sx={{ py: 0.5 }}>
                  <Box
                    component={Link}
                    href={href}
                    {...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    sx={{
                      display: "inline-flex",
                      alignItems: "center",
                      color: "#94A3B8",
                      textDecoration: "none",
                      fontSize: "0.875rem",
                      transition: "all 0.2s ease",
                      "&:hover": {
                        color: "#38BDF8",
                        transform: "translateX(4px)",
                      },
                    }}
                  >
                    <ChevronRightIcon sx={{ fontSize: 16, mr: 0.5, color: "#2563EB" }} />
                    {label}
                  </Box>
                </ListItem>
              ))}
            </List>
          </Grid>

          {/* Col 4: Apply CTA */}
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 700,
                color: "#F8FAFC",
                mb: 2.5,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                fontSize: "0.8rem",
              }}
            >
              Apply Online
            </Typography>
            <Typography variant="body2" sx={{ color: "#94A3B8", mb: 2.5, lineHeight: 1.6, fontSize: "0.875rem" }}>
              Submit your application through the official government portal using Teletalk SMS fee payment.
            </Typography>
            <Button
              variant="contained"
              fullWidth
              component={Link}
              href="/apply"
              endIcon={<LaunchIcon sx={{ fontSize: 16 }} />}
              sx={{
                py: 1.1,
                mb: 2.5,
                bgcolor: "#2563EB",
                fontWeight: 600,
                borderRadius: "6px",
                boxShadow: "0 4px 14px rgba(37, 99, 235, 0.35)",
                "&:hover": {
                  bgcolor: "#1D4ED8",
                  boxShadow: "0 6px 20px rgba(37, 99, 235, 0.5)",
                },
              }}
            >
              Apply Online Now
            </Button>

            <Box
              sx={{
                p: 1.5,
                borderRadius: "6px",
                bgcolor: "rgba(255, 255, 255, 0.03)",
                border: "1px solid rgba(255, 255, 255, 0.06)",
              }}
            >
              <Typography variant="caption" sx={{ color: "#64748B", display: "block", fontSize: "0.75rem" }}>
                Main school website:
              </Typography>
              <Box
                component="a"
                href="/"
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 0.5,
                  mt: 0.5,
                  color: "#38BDF8",
                  textDecoration: "none",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  transition: "color 0.2s",
                  "&:hover": { color: "#93C5FD" },
                }}
              >
                Visit main site <ArrowForwardIcon sx={{ fontSize: 14 }} />
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* Bottom Bar */}
      <Box sx={{ borderTop: "1px solid rgba(255, 255, 255, 0.06)", bgcolor: "#060A12", py: 2.5 }}>
        <Container maxWidth="lg">
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              justifyContent: "space-between",
              alignItems: "center",
              gap: 1,
              textAlign: { xs: "center", sm: "left" },
            }}
          >
            <Typography variant="caption" sx={{ color: "#64748B", fontSize: "0.8rem" }}>
              Official Online Admission Management System
            </Typography>
            <Typography variant="caption" sx={{ color: "#64748B", fontSize: "0.8rem" }}>
              Developed by{" "}
              <Box component="span" sx={{ color: "#94A3B8", fontWeight: 600 }}>
                OGIT
              </Box>{" "}
              and{" "}
              <Box
                component="a"
                href="https://web.sadi.com.bd"
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  color: "#38BDF8",
                  textDecoration: "none",
                  fontWeight: 600,
                  "&:hover": { textDecoration: "underline", color: "#93C5FD" },
                }}
              >
                Sadi
              </Box>
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  )
}
