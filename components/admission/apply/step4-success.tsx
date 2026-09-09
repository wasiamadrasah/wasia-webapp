"use client"

import * as React from "react"
import Link from "next/link"
import Box from "@mui/material/Box"
import Paper from "@mui/material/Paper"
import Typography from "@mui/material/Typography"
import Button from "@mui/material/Button"
import Grid from "@mui/material/Grid"
import Divider from "@mui/material/Divider"
import Avatar from "@mui/material/Avatar"
import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableCell from "@mui/material/TableCell"
import TableRow from "@mui/material/TableRow"
import Chip from "@mui/material/Chip"
import Alert from "@mui/material/Alert"
import {
  CheckCircle as SuccessIcon,
  Print as PrintIcon,
  Download as DownloadIcon,
  Home as HomeIcon,
  Add as AddIcon,
  QrCode2 as QrCodeIcon,
  Verified as VerifiedIcon,
  PhoneInTalk as PhoneIcon,
  Email as EmailIcon,
} from "@mui/icons-material"
import { useAdmissionFlow } from "./admission-flow-context"

export function Step4Success() {
  const { formData, resetForm } = useAdmissionFlow()

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print()
    }
  }

  return (
    <Box sx={{ maxWidth: 960, mx: "auto" }}>
      {/* Non-printable Success Banner */}
      <Box
        className="no-print"
        sx={{
          textAlign: "center",
          py: 4,
          px: 2,
          mb: 4,
          borderRadius: "8px",
          bgcolor: "rgba(22, 163, 74, 0.08)",
          border: "1px solid rgba(22, 163, 74, 0.2)",
        }}
      >
        <Box
          sx={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: 72,
            height: 72,
            borderRadius: "50%",
            bgcolor: "#16A34A",
            color: "#FFFFFF",
            mb: 2,
            boxShadow: "0 6px 20px rgba(22, 163, 74, 0.35)",
          }}
        >
          <SuccessIcon sx={{ fontSize: 44 }} />
        </Box>

        <Typography variant="h4" sx={{ fontWeight: 800, color: "#16A34A", mb: 1 }}>
          Application Submitted Successfully!
        </Typography>

        <Typography variant="body1" sx={{ color: "text.secondary", maxWidth: 540, mx: "auto", mb: 3 }}>
          Your online admission application has been registered. Please save and print this confirmation slip for document verification.
        </Typography>

        {/* Application Number Badge */}
        <Box
          sx={{
            display: "inline-flex",
            flexDirection: "column",
            alignItems: "center",
            p: 2,
            px: 4,
            borderRadius: "8px",
            bgcolor: "#FFFFFF",
            border: "2px dashed #16A34A",
            boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
          }}
        >
          <Typography variant="caption" sx={{ fontWeight: 700, color: "text.secondary", textTransform: "uppercase", letterSpacing: "0.1em" }}>
            Application Tracking Number
          </Typography>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 900,
              color: "#0F172A",
              fontFamily: "monospace",
              letterSpacing: "0.08em",
              my: 0.5,
            }}
          >
            {formData.applicationNo || "ADM-2026-001245"}
          </Typography>
          <Typography variant="caption" sx={{ color: "#16A34A", fontWeight: 700 }}>
            Submitted On: {formData.submittedAt || "08 September 2026"}
          </Typography>
        </Box>

        {/* Action Buttons Top Bar */}
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: 1.5,
            mt: 4,
          }}
        >
          <Button
            variant="contained"
            color="primary"
            startIcon={<PrintIcon />}
            onClick={handlePrint}
            sx={{
              py: 1.2,
              px: 3.5,
              borderRadius: "6px",
              fontWeight: 700,
              boxShadow: "0 4px 14px rgba(37, 99, 235, 0.3)",
            }}
          >
            Print Application Form
          </Button>

          <Button
            variant="outlined"
            color="primary"
            startIcon={<DownloadIcon />}
            onClick={handlePrint}
            sx={{
              py: 1.2,
              px: 3,
              borderRadius: "6px",
              fontWeight: 600,
              bgcolor: "#FFFFFF",
            }}
          >
            Download PDF
          </Button>

          <Button
            component={Link}
            href="/"
            variant="outlined"
            color="secondary"
            startIcon={<HomeIcon />}
            sx={{
              py: 1.2,
              px: 3,
              borderRadius: "6px",
              fontWeight: 600,
              bgcolor: "#FFFFFF",
            }}
          >
            Done ✓ Return to Portal
          </Button>

          <Button
            variant="text"
            color="primary"
            startIcon={<AddIcon />}
            onClick={resetForm}
            sx={{
              py: 1.2,
              px: 2,
              borderRadius: "6px",
              fontWeight: 600,
            }}
          >
            Apply Another Student
          </Button>
        </Box>
      </Box>

      {/* PRINTABLE OFFICIAL ADMISSION FORM SHEET */}
      <Paper
        id="printable-admission-sheet"
        elevation={0}
        sx={{
          p: { xs: 3, sm: 5 },
          borderRadius: "8px",
          border: "2px solid #0F172A",
          bgcolor: "#FFFFFF",
          mb: 4,
          position: "relative",
          "@media print": {
            border: "none",
            p: 2,
            m: 0,
            boxShadow: "none",
          },
        }}
      >
        {/* Official School Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            pb: 2.5,
            mb: 3,
            borderBottom: "2px solid #0F172A",
          }}
        >
          <Box sx={{ flex: 1 }}>
            <Typography variant="caption" sx={{ fontWeight: 700, letterSpacing: "0.15em", color: "primary.main", textTransform: "uppercase" }}>
              Government of the People's Republic of Bangladesh
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 800, color: "#0F172A", mt: 0.5, mb: 0.3 }}>
              PURBA BAKALIA CITY CORPORATION HIGH SCHOOL
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              Purba Bakalia, Chattogram • EIIN: 131385 • Phone: 01309-131385
            </Typography>
            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "#16A34A", mt: 0.5 }}>
              OFFICIAL ADMISSION APPLICATION SLIP (STUDENT COPY)
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 0.5,
              p: 1,
              border: "1px solid #CBD5E1",
              borderRadius: "4px",
              bgcolor: "#F8FAFC",
            }}
          >
            <QrCodeIcon sx={{ fontSize: 54, color: "#0F172A" }} />
            <Typography variant="caption" sx={{ fontFamily: "monospace", fontWeight: 700, fontSize: "0.65rem" }}>
              {formData.applicationNo || "ADM-2026-001245"}
            </Typography>
          </Box>
        </Box>

        {/* Application Meta Bar */}
        <Grid container spacing={2} sx={{ mb: 3, alignItems: "center" }}>
          <Grid size={{ xs: 12, sm: 9 }}>
            <Table size="small" sx={{ border: "1px solid #CBD5E1" }}>
              <TableBody>
                <TableRow>
                  <TableCell sx={{ bgcolor: "#F8FAFC", fontWeight: 700, width: "25%", fontSize: "0.8rem" }}>Application No</TableCell>
                  <TableCell sx={{ fontWeight: 800, color: "primary.main", fontFamily: "monospace", fontSize: "0.95rem" }}>
                    {formData.applicationNo || "ADM-2026-001245"}
                  </TableCell>
                  <TableCell sx={{ bgcolor: "#F8FAFC", fontWeight: 700, width: "25%", fontSize: "0.8rem" }}>Submission Date</TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: "0.85rem" }}>{formData.submittedAt || "08 September 2026"}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ bgcolor: "#F8FAFC", fontWeight: 700, fontSize: "0.8rem" }}>Applying Grade</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>{formData.applyingClass || "Class 6"}</TableCell>
                  <TableCell sx={{ bgcolor: "#F8FAFC", fontWeight: 700, fontSize: "0.8rem" }}>Version & Shift</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>{formData.version} Medium / {formData.shift} Shift</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ bgcolor: "#F8FAFC", fontWeight: 700, fontSize: "0.8rem" }}>Application Status</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: "#16A34A" }}>✓ SUBMITTED (Ready for Verification)</TableCell>
                  <TableCell sx={{ bgcolor: "#F8FAFC", fontWeight: 700, fontSize: "0.8rem" }}>Quota</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>{formData.quota || "General"}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Grid>

          <Grid size={{ xs: 12, sm: 3 }} sx={{ display: "flex", justifyContent: { xs: "flex-start", sm: "flex-end" } }}>
            <Box
              sx={{
                width: 100,
                height: 120,
                border: "2px solid #CBD5E1",
                borderRadius: "4px",
                p: 0.3,
                bgcolor: "#FFFFFF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
              }}
            >
              {formData.photoUrl ? (
                <Avatar
                  src={formData.photoUrl}
                  variant="rounded"
                  sx={{ width: "100%", height: "100%", borderRadius: "2px" }}
                />
              ) : (
                <Typography variant="caption" sx={{ color: "text.disabled", fontWeight: 700, fontSize: "0.7rem" }}>
                  PHOTO
                </Typography>
              )}
            </Box>
          </Grid>
        </Grid>

        {/* Student & Guardian Details Tables */}
        <Typography variant="subtitle2" sx={{ bgcolor: "#0F172A", color: "#FFFFFF", px: 1.5, py: 0.5, fontWeight: 700, fontSize: "0.78rem", textTransform: "uppercase" }}>
          1. Student & Demographic Profile
        </Typography>
        <Table size="small" sx={{ border: "1px solid #CBD5E1", mb: 2 }}>
          <TableBody>
            <TableRow>
              <TableCell sx={{ width: "20%", bgcolor: "#F8FAFC", fontWeight: 600, fontSize: "0.8rem" }}>Full Name (EN)</TableCell>
              <TableCell sx={{ width: "30%", fontWeight: 700 }}>{formData.fullNameEn || "—"}</TableCell>
              <TableCell sx={{ width: "20%", bgcolor: "#F8FAFC", fontWeight: 600, fontSize: "0.8rem" }}>Full Name (BN)</TableCell>
              <TableCell sx={{ width: "30%", fontWeight: 600 }}>{formData.fullNameBn || "—"}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ bgcolor: "#F8FAFC", fontWeight: 600, fontSize: "0.8rem" }}>Date of Birth</TableCell>
              <TableCell>{formData.dateOfBirth || "—"}</TableCell>
              <TableCell sx={{ bgcolor: "#F8FAFC", fontWeight: 600, fontSize: "0.8rem" }}>Gender / Blood Group</TableCell>
              <TableCell>{formData.gender || "—"} / {formData.bloodGroup || "—"}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ bgcolor: "#F8FAFC", fontWeight: 600, fontSize: "0.8rem" }}>Birth Reg No</TableCell>
              <TableCell sx={{ fontFamily: "monospace", fontWeight: 600 }}>{formData.birthRegNo || "—"}</TableCell>
              <TableCell sx={{ bgcolor: "#F8FAFC", fontWeight: 600, fontSize: "0.8rem" }}>Religion / Nationality</TableCell>
              <TableCell>{formData.religion} / {formData.nationality}</TableCell>
            </TableRow>
          </TableBody>
        </Table>

        <Typography variant="subtitle2" sx={{ bgcolor: "#0F172A", color: "#FFFFFF", px: 1.5, py: 0.5, fontWeight: 700, fontSize: "0.78rem", textTransform: "uppercase" }}>
          2. Parent & Contact Details
        </Typography>
        <Table size="small" sx={{ border: "1px solid #CBD5E1", mb: 2 }}>
          <TableBody>
            <TableRow>
              <TableCell sx={{ width: "20%", bgcolor: "#F8FAFC", fontWeight: 600, fontSize: "0.8rem" }}>Father's Name</TableCell>
              <TableCell sx={{ width: "30%", fontWeight: 600 }}>{formData.fatherNameEn} ({formData.fatherOccupation || "—"})</TableCell>
              <TableCell sx={{ width: "20%", bgcolor: "#F8FAFC", fontWeight: 600, fontSize: "0.8rem" }}>Mother's Name</TableCell>
              <TableCell sx={{ width: "30%", fontWeight: 600 }}>{formData.motherNameEn} ({formData.motherOccupation || "—"})</TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ bgcolor: "#F8FAFC", fontWeight: 600, fontSize: "0.8rem" }}>Primary Contact</TableCell>
              <TableCell sx={{ fontWeight: 700, color: "primary.main" }}>{formData.mobileNo || "—"}</TableCell>
              <TableCell sx={{ bgcolor: "#F8FAFC", fontWeight: 600, fontSize: "0.8rem" }}>Emergency Mobile</TableCell>
              <TableCell>{formData.emergencyContact || "—"}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ bgcolor: "#F8FAFC", fontWeight: 600, fontSize: "0.8rem" }}>Present Address</TableCell>
              <TableCell colSpan={3}>
                {formData.presentAddressLine}, Thana: {formData.presentThana}, District: {formData.presentDistrict} - {formData.presentPostCode}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>

        <Typography variant="subtitle2" sx={{ bgcolor: "#0F172A", color: "#FFFFFF", px: 1.5, py: 0.5, fontWeight: 700, fontSize: "0.78rem", textTransform: "uppercase" }}>
          3. Previous Academic Records
        </Typography>
        <Table size="small" sx={{ border: "1px solid #CBD5E1", mb: 3 }}>
          <TableBody>
            <TableRow>
              <TableCell sx={{ width: "20%", bgcolor: "#F8FAFC", fontWeight: 600, fontSize: "0.8rem" }}>Previous School</TableCell>
              <TableCell sx={{ width: "40%", fontWeight: 600 }}>{formData.previousSchool || "—"}</TableCell>
              <TableCell sx={{ width: "20%", bgcolor: "#F8FAFC", fontWeight: 600, fontSize: "0.8rem" }}>Board / Passing Year</TableCell>
              <TableCell sx={{ width: "20%" }}>{formData.previousBoard} ({formData.passingYear})</TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ bgcolor: "#F8FAFC", fontWeight: 600, fontSize: "0.8rem" }}>Exam & Result</TableCell>
              <TableCell colSpan={3} sx={{ fontWeight: 700, color: "#16A34A" }}>
                {formData.previousExam} — GPA: {formData.previousGpa || "5.00"}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>

        {/* Verification Instructions */}
        <Box sx={{ p: 2, bgcolor: "#F8FAFC", border: "1px dashed #CBD5E1", borderRadius: "4px", mb: 4 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "text.primary", mb: 0.5 }}>
            Important Instructions for Verification:
          </Typography>
          <Typography variant="caption" sx={{ color: "text.secondary", display: "block", lineHeight: 1.6 }}>
            1. Bring this printed application slip along with original Birth Certificate, Previous School TC, and 3 passport photos.
            <br />
            2. For admission updates and lottery schedules, monitor the Notice Board on the official admission portal.
          </Typography>
        </Box>

        {/* Official Signatures Row */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            pt: 4,
            mt: 2,
            borderTop: "1px dashed #CBD5E1",
          }}
        >
          <Box sx={{ textAlign: "center", width: 180 }}>
            <Box sx={{ borderBottom: "1px solid #0F172A", height: 32, mb: 0.5 }} />
            <Typography variant="caption" sx={{ fontWeight: 700, color: "text.primary" }}>
              Applicant / Guardian Signature
            </Typography>
          </Box>

          <Box sx={{ textAlign: "center", width: 180 }}>
            <Box sx={{ borderBottom: "1px solid #0F172A", height: 32, mb: 0.5 }} />
            <Typography variant="caption" sx={{ fontWeight: 700, color: "text.primary" }}>
              Admission Committee Officer
            </Typography>
          </Box>

          <Box sx={{ textAlign: "center", width: 180 }}>
            <Box sx={{ borderBottom: "1px solid #0F172A", height: 32, mb: 0.5 }} />
            <Typography variant="caption" sx={{ fontWeight: 700, color: "text.primary" }}>
              Headmaster / Principal Signature
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Box>
  )
}
