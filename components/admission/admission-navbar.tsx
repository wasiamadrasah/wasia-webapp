"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import AppBar from "@mui/material/AppBar"
import Toolbar from "@mui/material/Toolbar"
import Container from "@mui/material/Container"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import Button from "@mui/material/Button"
import IconButton from "@mui/material/IconButton"
import Drawer from "@mui/material/Drawer"
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import ListItemButton from "@mui/material/ListItemButton"
import ListItemIcon from "@mui/material/ListItemIcon"
import ListItemText from "@mui/material/ListItemText"
import Divider from "@mui/material/Divider"
import {
  Menu as MenuIcon,
  Close as CloseIcon,
  HomeOutlined as HomeIcon,
  MenuBookOutlined as ProspectusIcon,
  AssignmentOutlined as GuidelineIcon,
  NotificationsActiveOutlined as NoticeIcon,
  SupportAgentOutlined as ContactIcon,
  OpenInNewOutlined as ApplyIcon,
} from "@mui/icons-material"

const internalNavItems = [
  { label: "Prospectus", href: "/prospectus", icon: ProspectusIcon },
  { label: "Guideline", href: "/guideline", icon: GuidelineIcon },
  { label: "Notice", href: "/notice", icon: NoticeIcon },
  { label: "Contact", href: "/contact", icon: ContactIcon },
]

const DEFAULT_NAME = "Purba Bakalia City Corporation High School"
const DEFAULT_LOGO = "/favicon.ico"

export function AdmissionNavbar() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = React.useState(false)
  const [logo, setLogo] = React.useState<string | null>(null)
  const [schoolName, setSchoolName] = React.useState(DEFAULT_NAME)
  const [scrolled, setScrolled] = React.useState(false)
  const [mainSiteHref, setMainSiteHref] = React.useState("#")

  React.useEffect(() => {
    setMainSiteHref(window.location.origin.replace(/^(https?:\/\/)admission\./, "$1"))
  }, [])

  React.useEffect(() => {
    const fetchBranding = async () => {
      try {
        const res = await fetch("/api/public/home-feed")
        const data = await res.json()
        const primary = data?.institute_settings?.primary
        if (primary?.logo) setLogo(primary.logo)
        if (primary?.instituteName) setSchoolName(primary.instituteName)
      } catch {
        /* keep defaults */
      }
    }
    fetchBranding()
  }, [])

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname?.startsWith(href)

  return (
    <>
      <AppBar
        position="sticky"
        elevation={scrolled ? 3 : 0}
        sx={{
          backgroundColor: scrolled ? "rgba(255, 255, 255, 0.95)" : "#ffffff",
          backdropFilter: scrolled ? "blur(12px)" : "none",
          borderBottom: "1px solid",
          borderColor: "divider",
          color: "text.primary",
          transition: "all 0.3s ease",
        }}
      >
        {/* Top Accent Strip */}
        <Box sx={{ height: 3, width: "100%", bgcolor: "primary.main" }} />

        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ height: 64, justifyContent: "space-between" }}>
            {/* Branding */}
            <Box
              component={Link}
              href="/"
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                textDecoration: "none",
                color: "inherit",
                minWidth: 0,
              }}
              onClick={() => setMobileOpen(false)}
            >
              <Box
                sx={{
                  position: "relative",
                  width: 40,
                  height: 40,
                  flexShrink: 0,
                }}
              >
                <Image
                  src={logo ?? DEFAULT_LOGO}
                  alt="School Logo"
                  fill
                  style={{ objectFit: "contain" }}
                  sizes="40px"
                  unoptimized
                />
              </Box>
              <Box sx={{ minWidth: 0 }}>
                <Typography
                  variant="caption"
                  sx={{
                    display: "block",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.15em",
                    color: "primary.main",
                    fontSize: "0.68rem",
                    lineHeight: 1.1,
                  }}
                >
                  Admission Portal
                </Typography>
                <Typography
                  variant="subtitle2"
                  sx={{
                    fontWeight: 700,
                    color: "text.primary",
                    fontSize: "0.9rem",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    maxWidth: { xs: 180, sm: 320, md: 400 },
                  }}
                >
                  {schoolName}
                </Typography>
              </Box>
            </Box>

            {/* Desktop Navigation Links */}
            <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center", gap: 0.5 }}>
              {/* External Main Site Link */}
              <Button
                component="a"
                href={mainSiteHref}
                startIcon={<HomeIcon />}
                sx={{
                  color: "text.secondary",
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  px: 1.5,
                  py: 0.8,
                  "& .MuiButton-startIcon": { mr: 0.75 },
                  "& .MuiButton-startIcon > *:nth-of-type(1)": { fontSize: "1.125rem" },
                  "&:hover": { color: "text.primary", bgcolor: "rgba(0, 0, 0, 0.04)" },
                }}
              >
                Main Home
              </Button>

              {internalNavItems.map(({ label, href, icon: Icon }) => {
                const active = isActive(href)
                return (
                  <Button
                    key={href}
                    component={Link}
                    href={href}
                    startIcon={<Icon />}
                    sx={{
                      color: active ? "primary.main" : "text.secondary",
                      bgcolor: active ? "rgba(37, 99, 235, 0.08)" : "transparent",
                      fontWeight: active ? 700 : 600,
                      fontSize: "0.875rem",
                      px: 1.5,
                      py: 0.8,
                      position: "relative",
                      "& .MuiButton-startIcon": { mr: 0.75 },
                      "& .MuiButton-startIcon > *:nth-of-type(1)": { fontSize: "1.125rem" },
                      "&:hover": {
                        bgcolor: active ? "rgba(37, 99, 235, 0.12)" : "rgba(0, 0, 0, 0.04)",
                        color: active ? "primary.dark" : "text.primary",
                      },
                    }}
                  >
                    {label}
                  </Button>
                )
              })}
            </Box>

            {/* Apply CTA Button */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Button
                variant="contained"
                color="primary"
                component={Link}
                href="/apply"
                endIcon={<ApplyIcon />}
                sx={{
                  display: { xs: "none", sm: "inline-flex" },
                  px: 2.5,
                  py: 0.9,
                  fontSize: "0.875rem",
                  fontWeight: 700,
                  "& .MuiButton-endIcon": { ml: 0.75 },
                  "& .MuiButton-endIcon > *:nth-of-type(1)": { fontSize: "1rem" },
                }}
              >
                Apply Now
              </Button>

              {/* Mobile Menu Button */}
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="end"
                onClick={() => setMobileOpen(true)}
                sx={{ display: { md: "none" } }}
              >
                <MenuIcon />
              </IconButton>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        slotProps={{
          paper: {
            sx: { width: 290, p: 2, display: "flex", flexDirection: "column" },
          },
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", pb: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Box
              sx={{
                position: "relative",
                width: 32,
                height: 32,
                flexShrink: 0,
              }}
            >
              <Image
                src={logo ?? DEFAULT_LOGO}
                alt="School Logo"
                fill
                style={{ objectFit: "contain" }}
                sizes="32px"
                unoptimized
              />
            </Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
              Admission Menu
            </Typography>
          </Box>
          <IconButton onClick={() => setMobileOpen(false)} size="small">
            <CloseIcon />
          </IconButton>
        </Box>

        <Divider sx={{ mb: 1.5 }} />

        <List sx={{ flexGrow: 1, p: 0 }}>
          <ListItem disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              component="a"
              href={mainSiteHref}
              onClick={() => setMobileOpen(false)}
              sx={{ borderRadius: 1 }}
            >
              <ListItemIcon sx={{ minWidth: 32, color: "text.secondary", "& > svg": { fontSize: "1.15rem" } }}>
                <HomeIcon />
              </ListItemIcon>
              <ListItemText primary={<Typography sx={{ fontSize: "0.875rem", fontWeight: 500 }}>Main Home</Typography>} />
            </ListItemButton>
          </ListItem>

          {internalNavItems.map(({ label, href, icon: Icon }) => {
            const active = isActive(href)
            return (
              <ListItem key={href} disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  component={Link}
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  selected={active}
                  sx={{
                    borderRadius: 1,
                    "&.Mui-selected": {
                      bgcolor: "rgba(37, 99, 235, 0.08)",
                      color: "primary.main",
                      "& .MuiListItemIcon-root": { color: "primary.main" },
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 32, color: active ? "primary.main" : "text.secondary", "& > svg": { fontSize: "1.15rem" } }}>
                    <Icon />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography sx={{ fontSize: "0.875rem", fontWeight: active ? 700 : 500 }}>
                        {label}
                      </Typography>
                    }
                  />
                </ListItemButton>
              </ListItem>
            )
          })}
        </List>

        <Box sx={{ pt: 2, borderTop: "1px solid", borderColor: "divider" }}>
          <Typography variant="caption" sx={{ display: "block", color: "text.secondary", mb: 1.5 }}>
            {schoolName}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            component={Link}
            href="/apply"
            endIcon={<ApplyIcon />}
            onClick={() => setMobileOpen(false)}
            sx={{
              py: 1,
              "& .MuiButton-endIcon": { ml: 0.75 },
              "& .MuiButton-endIcon > *:nth-of-type(1)": { fontSize: "1rem" },
            }}
          >
            Apply Now
          </Button>
        </Box>
      </Drawer>
    </>
  )
}
