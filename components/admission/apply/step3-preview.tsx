"use client"

import * as React from "react"
import Box from "@mui/material/Box"
import Paper from "@mui/material/Paper"
import Typography from "@mui/material/Typography"
import Button from "@mui/material/Button"
import Checkbox from "@mui/material/Checkbox"
import FormControlLabel from "@mui/material/FormControlLabel"
import Grid from "@mui/material/Grid"
import Divider from "@mui/material/Divider"
import Avatar from "@mui/material/Avatar"
import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableCell from "@mui/material/TableCell"
import TableRow from "@mui/material/TableRow"
import Chip from "@mui/material/Chip"
import {
  ArrowBack as ArrowBackIcon,
  CheckCircle as SubmitIcon,
  EditOutlined as EditIcon,
  VerifiedUserOutlined as VerifiedIcon,
  AccountCircle as PhotoPlaceholderIcon,
} from "@mui/icons-material"
import { useAdmissionFlow } from "./admission-flow-context"

export function Step3Preview() {
  const { formData, setStep, confirmedPreview, setConfirmedPreview, submitApplication } = useAdmissionFlow()

  const handleEdit = () => {
    setStep(2)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleSubmit = () => {
    if (confirmedPreview) {
      submitApplication()
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  return (
    <Box sx={{ maxWidth: 960, mx: "auto" }}>
      {/* Step Heading */}
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
          Step 3 of 4
        </Typography>
        <Typography variant="h4" sx={{ fontWeight: 800, color: "text.primary", mb: 1 }}>
          Application Preview
        </Typography>
        <Typography variant="body1" sx={{ color: "text.secondary", maxWidth: 640, mx: "auto" }}>
          Please review the details below carefully before final submission. Click Edit on any section to make corrections.
        </Typography>
      </Box>

      {/* Official Form Sheet Preview */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, sm: 5 },
          borderRadius: "8px",
          border: "2px solid #CBD5E1",
          bgcolor: "#FFFFFF",
          mb: 4,
          position: "relative",
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.04)",
        }}
      >
        {/* Institutional Application Header */}
        <Box
          sx={{
            textAlign: "center",
            pb: 3,
            mb: 3,
            borderBottom: "2px solid #0F172A",
          }}
        >
          <Typography
            variant="caption"
            sx={{
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.15em",
              color: "primary.main",
              display: "block",
            }}
          >
            Government Approved Secondary Institution
          </Typography>
          <Typography variant="h5" sx={{ fontWeight: 800, color: "#0F172A", mt: 0.5, mb: 0.5 }}>
            PURBA BAKALIA CITY CORPORATION HIGH SCHOOL
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary", mb: 1.5 }}>
            Bakalia, Chattogram, Bangladesh • EIIN: 131385
          </Typography>

          <Box
            sx={{
              display: "inline-block",
              px: 3,
              py: 0.8,
              borderRadius: "4px",
              bgcolor: "#0F172A",
              color: "#FFFFFF",
              fontWeight: 700,
              fontSize: "0.85rem",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            Admission Application Form — Academic Session 2026-2027
          </Box>
        </Box>

        {/* Top Summary & Passport Photo */}
        <Grid container spacing={3} sx={{ mb: 4, alignItems: "center" }}>
          <Grid size={{ xs: 12, sm: 8 }}>
            <Box sx={{ p: 2, bgcolor: "#F8FAFC", borderRadius: "6px", border: "1px solid #E2E8F0" }}>
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 6 }}>
                  <Typography variant="caption" sx={{ color: "text.secondary", display: "block" }}>
                    Applying For Grade:
                  </Typography>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "primary.main" }}>
                    {formData.applyingClass || "Class 6"}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Typography variant="caption" sx={{ color: "text.secondary", display: "block" }}>
                    Curriculum & Shift:
                  </Typography>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "text.primary" }}>
                    {formData.version} Medium • {formData.shift} Shift
                  </Typography>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Typography variant="caption" sx={{ color: "text.secondary", display: "block" }}>
                    Application Tracking:
                  </Typography>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "text.primary" }}>
                    Draft (Auto Generated upon Submit)
                  </Typography>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Typography variant="caption" sx={{ color: "text.secondary", display: "block" }}>
                    Quota Category:
                  </Typography>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "text.primary" }}>
                    {formData.quota || "General"}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </Grid>

          <Grid size={{ xs: 12, sm: 4 }} sx={{ display: "flex", justifyContent: { xs: "flex-start", sm: "flex-end" } }}>
            <Box
              sx={{
                width: 120,
                height: 140,
                border: "2px solid #CBD5E1",
                borderRadius: "6px",
                p: 0.5,
                bgcolor: "#FFFFFF",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              }}
            >
              {formData.photoUrl ? (
                <Avatar
                  src={formData.photoUrl}
                  variant="rounded"
                  sx={{ width: "100%", height: "100%", borderRadius: "4px" }}
                />
              ) : (
                <Box sx={{ textAlign: "center", color: "text.disabled", p: 1 }}>
                  <PhotoPlaceholderIcon sx={{ fontSize: 44, mb: 0.5 }} />
                  <Typography sx={{ fontSize: "0.68rem", fontWeight: 600, color: "text.secondary" }}>
                    PHOTO
                  </Typography>
                </Box>
              )}
            </Box>
          </Grid>
        </Grid>

        {/* SECTION 1: Personal Information */}
        <Box sx={{ mb: 3.5 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              bgcolor: "#0F172A",
              color: "#FFFFFF",
              px: 2,
              py: 0.8,
              borderRadius: "4px 4px 0 0",
            }}
          >
            <Typography variant="subtitle2" sx={{ fontWeight: 700, textTransform: "uppercase", fontSize: "0.8rem", letterSpacing: "0.05em" }}>
              1. Personal Information
            </Typography>
            <Button
              size="small"
              startIcon={<EditIcon sx={{ fontSize: 14 }} />}
              onClick={handleEdit}
              sx={{
                color: "#38BDF8",
                fontSize: "0.75rem",
                p: 0,
                minWidth: "auto",
                "&:hover": { color: "#FFFFFF" },
              }}
            >
              Edit
            </Button>
          </Box>

          <Table size="small" sx={{ border: "1px solid #E2E8F0", borderTop: "none" }}>
            <TableBody>
              <TableRow>
                <TableCell sx={{ width: "25%", fontWeight: 600, color: "text.secondary", bgcolor: "#F8FAFC" }}>Full Name (English)</TableCell>
                <TableCell sx={{ width: "25%", fontWeight: 700 }}>{formData.fullNameEn || "—"}</TableCell>
                <TableCell sx={{ width: "25%", fontWeight: 600, color: "text.secondary", bgcolor: "#F8FAFC" }}>Full Name (Bangla)</TableCell>
                <TableCell sx={{ width: "25%", fontWeight: 600 }}>{formData.fullNameBn || "—"}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ fontWeight: 600, color: "text.secondary", bgcolor: "#F8FAFC" }}>Date of Birth</TableCell>
                <TableCell>{formData.dateOfBirth || "—"}</TableCell>
                <TableCell sx={{ fontWeight: 600, color: "text.secondary", bgcolor: "#F8FAFC" }}>Gender / Blood Group</TableCell>
                <TableCell>{formData.gender || "—"} / {formData.bloodGroup || "—"}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ fontWeight: 600, color: "text.secondary", bgcolor: "#F8FAFC" }}>Religion / Nationality</TableCell>
                <TableCell>{formData.religion} / {formData.nationality}</TableCell>
                <TableCell sx={{ fontWeight: 600, color: "text.secondary", bgcolor: "#F8FAFC" }}>Birth Registration No</TableCell>
                <TableCell sx={{ fontFamily: "monospace", fontWeight: 600 }}>{formData.birthRegNo || "—"}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Box>

        {/* SECTION 2: Contact Information */}
        <Box sx={{ mb: 3.5 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              bgcolor: "#0F172A",
              color: "#FFFFFF",
              px: 2,
              py: 0.8,
              borderRadius: "4px 4px 0 0",
            }}
          >
            <Typography variant="subtitle2" sx={{ fontWeight: 700, textTransform: "uppercase", fontSize: "0.8rem", letterSpacing: "0.05em" }}>
              2. Contact Information
            </Typography>
            <Button
              size="small"
              startIcon={<EditIcon sx={{ fontSize: 14 }} />}
              onClick={handleEdit}
              sx={{
                color: "#38BDF8",
                fontSize: "0.75rem",
                p: 0,
                minWidth: "auto",
                "&:hover": { color: "#FFFFFF" },
              }}
            >
              Edit
            </Button>
          </Box>

          <Table size="small" sx={{ border: "1px solid #E2E8F0", borderTop: "none" }}>
            <TableBody>
              <TableRow>
                <TableCell sx={{ width: "25%", fontWeight: 600, color: "text.secondary", bgcolor: "#F8FAFC" }}>Primary Mobile No</TableCell>
                <TableCell sx={{ width: "25%", fontWeight: 700, color: "primary.main" }}>{formData.mobileNo || "—"}</TableCell>
                <TableCell sx={{ width: "25%", fontWeight: 600, color: "text.secondary", bgcolor: "#F8FAFC" }}>Emergency Contact</TableCell>
                <TableCell sx={{ width: "25%" }}>{formData.emergencyContact || "—"}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ fontWeight: 600, color: "text.secondary", bgcolor: "#F8FAFC" }}>Email Address</TableCell>
                <TableCell colSpan={3}>{formData.email || "—"}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Box>

        {/* SECTION 3: Guardian Information */}
        <Box sx={{ mb: 3.5 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              bgcolor: "#0F172A",
              color: "#FFFFFF",
              px: 2,
              py: 0.8,
              borderRadius: "4px 4px 0 0",
            }}
          >
            <Typography variant="subtitle2" sx={{ fontWeight: 700, textTransform: "uppercase", fontSize: "0.8rem", letterSpacing: "0.05em" }}>
              3. Guardian Information
            </Typography>
            <Button
              size="small"
              startIcon={<EditIcon sx={{ fontSize: 14 }} />}
              onClick={handleEdit}
              sx={{
                color: "#38BDF8",
                fontSize: "0.75rem",
                p: 0,
                minWidth: "auto",
                "&:hover": { color: "#FFFFFF" },
              }}
            >
              Edit
            </Button>
          </Box>

          <Table size="small" sx={{ border: "1px solid #E2E8F0", borderTop: "none" }}>
            <TableBody>
              <TableRow>
                <TableCell sx={{ width: "25%", fontWeight: 600, color: "text.secondary", bgcolor: "#F8FAFC" }}>Father's Name (EN/BN)</TableCell>
                <TableCell sx={{ width: "25%", fontWeight: 600 }}>{formData.fatherNameEn} {formData.fatherNameBn && `(${formData.fatherNameBn})`}</TableCell>
                <TableCell sx={{ width: "25%", fontWeight: 600, color: "text.secondary", bgcolor: "#F8FAFC" }}>Father's Occupation / Phone</TableCell>
                <TableCell sx={{ width: "25%" }}>{formData.fatherOccupation || "—"} • {formData.fatherPhone || "—"}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ fontWeight: 600, color: "text.secondary", bgcolor: "#F8FAFC" }}>Mother's Name (EN/BN)</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>{formData.motherNameEn} {formData.motherNameBn && `(${formData.motherNameBn})`}</TableCell>
                <TableCell sx={{ fontWeight: 600, color: "text.secondary", bgcolor: "#F8FAFC" }}>Mother's Occupation / Phone</TableCell>
                <TableCell>{formData.motherOccupation || "—"} • {formData.motherPhone || "—"}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ fontWeight: 600, color: "text.secondary", bgcolor: "#F8FAFC" }}>Guardian / Relation</TableCell>
                <TableCell>{formData.guardianName || formData.fatherNameEn} ({formData.guardianRelation || "Father"})</TableCell>
                <TableCell sx={{ fontWeight: 600, color: "text.secondary", bgcolor: "#F8FAFC" }}>Annual Family Income</TableCell>
                <TableCell>{formData.annualIncome ? `BDT ${Number(formData.annualIncome).toLocaleString()}` : "—"}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Box>

        {/* SECTION 4: Academic Information */}
        <Box sx={{ mb: 3.5 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              bgcolor: "#0F172A",
              color: "#FFFFFF",
              px: 2,
              py: 0.8,
              borderRadius: "4px 4px 0 0",
            }}
          >
            <Typography variant="subtitle2" sx={{ fontWeight: 700, textTransform: "uppercase", fontSize: "0.8rem", letterSpacing: "0.05em" }}>
              4. Academic Information
            </Typography>
            <Button
              size="small"
              startIcon={<EditIcon sx={{ fontSize: 14 }} />}
              onClick={handleEdit}
              sx={{
                color: "#38BDF8",
                fontSize: "0.75rem",
                p: 0,
                minWidth: "auto",
                "&:hover": { color: "#FFFFFF" },
              }}
            >
              Edit
            </Button>
          </Box>

          <Table size="small" sx={{ border: "1px solid #E2E8F0", borderTop: "none" }}>
            <TableBody>
              <TableRow>
                <TableCell sx={{ width: "25%", fontWeight: 600, color: "text.secondary", bgcolor: "#F8FAFC" }}>Previous School Name</TableCell>
                <TableCell sx={{ width: "25%", fontWeight: 600 }}>{formData.previousSchool || "—"}</TableCell>
                <TableCell sx={{ width: "25%", fontWeight: 600, color: "text.secondary", bgcolor: "#F8FAFC" }}>Previous Exam / Year</TableCell>
                <TableCell sx={{ width: "25%" }}>{formData.previousExam || "—"} ({formData.passingYear || "2025"})</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ fontWeight: 600, color: "text.secondary", bgcolor: "#F8FAFC" }}>Education Board</TableCell>
                <TableCell>{formData.previousBoard || "Chattogram"}</TableCell>
                <TableCell sx={{ fontWeight: 600, color: "text.secondary", bgcolor: "#F8FAFC" }}>GPA / Roll No</TableCell>
                <TableCell sx={{ fontWeight: 700, color: "#16A34A" }}>GPA: {formData.previousGpa || "5.00"} {formData.previousRoll && `(Roll: ${formData.previousRoll})`}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Box>

        {/* SECTION 5: Address Information */}
        <Box sx={{ mb: 3.5 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              bgcolor: "#0F172A",
              color: "#FFFFFF",
              px: 2,
              py: 0.8,
              borderRadius: "4px 4px 0 0",
            }}
          >
            <Typography variant="subtitle2" sx={{ fontWeight: 700, textTransform: "uppercase", fontSize: "0.8rem", letterSpacing: "0.05em" }}>
              5. Address Information
            </Typography>
            <Button
              size="small"
              startIcon={<EditIcon sx={{ fontSize: 14 }} />}
              onClick={handleEdit}
              sx={{
                color: "#38BDF8",
                fontSize: "0.75rem",
                p: 0,
                minWidth: "auto",
                "&:hover": { color: "#FFFFFF" },
              }}
            >
              Edit
            </Button>
          </Box>

          <Table size="small" sx={{ border: "1px solid #E2E8F0", borderTop: "none" }}>
            <TableBody>
              <TableRow>
                <TableCell sx={{ width: "25%", fontWeight: 600, color: "text.secondary", bgcolor: "#F8FAFC" }}>Present Address</TableCell>
                <TableCell colSpan={3}>
                  {formData.presentAddressLine}, Thana: {formData.presentThana}, District: {formData.presentDistrict} - {formData.presentPostCode}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ width: "25%", fontWeight: 600, color: "text.secondary", bgcolor: "#F8FAFC" }}>Permanent Address</TableCell>
                <TableCell colSpan={3}>
                  {formData.sameAsPresent
                    ? `${formData.presentAddressLine}, Thana: ${formData.presentThana}, District: ${formData.presentDistrict} - ${formData.presentPostCode}`
                    : `${formData.permanentAddressLine}, Thana: ${formData.permanentThana}, District: ${formData.permanentDistrict} - ${formData.permanentPostCode}`}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Box>

        {/* SECTION 6: Quota & Extracurricular */}
        <Box sx={{ mb: 4 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              bgcolor: "#0F172A",
              color: "#FFFFFF",
              px: 2,
              py: 0.8,
              borderRadius: "4px 4px 0 0",
            }}
          >
            <Typography variant="subtitle2" sx={{ fontWeight: 700, textTransform: "uppercase", fontSize: "0.8rem", letterSpacing: "0.05em" }}>
              6. Quota & Extracurricular
            </Typography>
            <Button
              size="small"
              startIcon={<EditIcon sx={{ fontSize: 14 }} />}
              onClick={handleEdit}
              sx={{
                color: "#38BDF8",
                fontSize: "0.75rem",
                p: 0,
                minWidth: "auto",
                "&:hover": { color: "#FFFFFF" },
              }}
            >
              Edit
            </Button>
          </Box>

          <Table size="small" sx={{ border: "1px solid #E2E8F0", borderTop: "none" }}>
            <TableBody>
              <TableRow>
                <TableCell sx={{ width: "25%", fontWeight: 600, color: "text.secondary", bgcolor: "#F8FAFC" }}>Applied Quota</TableCell>
                <TableCell sx={{ width: "25%", fontWeight: 700 }}>{formData.quota}</TableCell>
                <TableCell sx={{ width: "25%", fontWeight: 600, color: "text.secondary", bgcolor: "#F8FAFC" }}>Extracurricular Activities</TableCell>
                <TableCell sx={{ width: "25%" }}>
                  {formData.extracurricular && formData.extracurricular.length > 0 ? (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {formData.extracurricular.map((item) => (
                        <Chip key={item} label={item} size="small" sx={{ fontSize: "0.72rem", height: 22 }} />
                      ))}
                    </Box>
                  ) : (
                    "—"
                  )}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Box>

        {/* Declaration Box */}
        <Box
          sx={{
            p: 2.5,
            borderRadius: "6px",
            bgcolor: confirmedPreview ? "rgba(22, 163, 74, 0.05)" : "#F8FAFC",
            border: "1.5px solid",
            borderColor: confirmedPreview ? "#16A34A" : "#CBD5E1",
            mb: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
            <VerifiedIcon sx={{ color: confirmedPreview ? "#16A34A" : "primary.main", mt: 0.3 }} />
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "text.primary", mb: 0.5 }}>
                Applicant & Guardian Declaration
              </Typography>
              <Typography variant="caption" sx={{ color: "text.secondary", display: "block", mb: 1.5, lineHeight: 1.5 }}>
                I hereby solemnly declare that all the information furnished in this application form is true, correct, and complete to the best of my knowledge and belief. If any information is found false or inaccurate, my application and admission shall be liable to immediate cancellation.
              </Typography>

              <FormControlLabel
                control={
                  <Checkbox
                    checked={confirmedPreview}
                    onChange={(e) => setConfirmedPreview(e.target.checked)}
                    color="primary"
                  />
                }
                label={
                  <Typography sx={{ fontWeight: 700, fontSize: "0.9rem", color: "text.primary" }}>
                    I confirm that all information provided is accurate and complete.
                  </Typography>
                }
              />
            </Box>
          </Box>
        </Box>
      </Paper>

      {/* Action Buttons */}
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
          startIcon={<ArrowBackIcon />}
          onClick={handleEdit}
          sx={{
            py: 1.2,
            px: 3,
            borderRadius: "6px",
            fontWeight: 600,
            width: { xs: "100%", sm: "auto" },
          }}
        >
          ← Go Back & Edit
        </Button>

        <Button
          variant="contained"
          color="primary"
          disabled={!confirmedPreview}
          onClick={handleSubmit}
          endIcon={<SubmitIcon />}
          sx={{
            py: 1.3,
            px: 4,
            borderRadius: "6px",
            fontWeight: 700,
            fontSize: "0.95rem",
            width: { xs: "100%", sm: "auto" },
            boxShadow: confirmedPreview ? "0 4px 14px rgba(37, 99, 235, 0.35)" : "none",
          }}
        >
          Submit Application ✓
        </Button>
      </Box>
    </Box>
  )
}
