"use client"

import * as React from "react"
import Box from "@mui/material/Box"
import Paper from "@mui/material/Paper"
import Typography from "@mui/material/Typography"
import Button from "@mui/material/Button"
import TextField from "@mui/material/TextField"
import MenuItem from "@mui/material/MenuItem"
import Grid from "@mui/material/Grid"
import FormControlLabel from "@mui/material/FormControlLabel"
import Checkbox from "@mui/material/Checkbox"
import Divider from "@mui/material/Divider"
import Avatar from "@mui/material/Avatar"
import Chip from "@mui/material/Chip"
import Alert from "@mui/material/Alert"
import Snackbar from "@mui/material/Snackbar"
import {
  PersonOutlined as PersonIcon,
  PhoneInTalkOutlined as ContactIcon,
  FamilyRestroomOutlined as FamilyIcon,
  SchoolOutlined as SchoolIcon,
  HomeOutlined as HomeIcon,
  StarsOutlined as OtherIcon,
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
  AutoFixHigh as AutoFixHighIcon,
  AddPhotoAlternateOutlined as PhotoIcon,
} from "@mui/icons-material"
import { useAdmissionFlow } from "./admission-flow-context"

const bloodGroups = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"]
const religions = ["Islam", "Hinduism", "Christianity", "Buddhism", "Other"]
const applyingClasses = ["Class 6", "Class 7", "Class 8", "Class 9", "Class 11"]
const educationBoards = [
  "Chattogram",
  "Dhaka",
  "Rajshahi",
  "Cumilla",
  "Jashore",
  "Barishal",
  "Sylhet",
  "Dinajpur",
  "Mymensingh",
  "Madrasah",
  "Technical",
]
const quotaOptions = [
  "General",
  "Freedom Fighter (FF)",
  "Disability / Special Needs",
  "Sibling / Institutional",
  "Government Employee Transfer",
]
const extracurricularOptions = [
  "Scouting & Cub",
  "Debate Society",
  "Cricket",
  "Football",
  "Science Club",
  "Cultural & Singing",
  "Art & Drawing",
  "Chess Club",
]

export function Step2Form() {
  const { formData, updateFormField, setStep, loadSampleData } = useAdmissionFlow()
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null)

  const handlePhotoUploadMock = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        if (typeof reader.result === "string") {
          updateFormField("photoUrl", reader.result)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const toggleExtracurricular = (item: string) => {
    const current = formData.extracurricular || []
    if (current.includes(item)) {
      updateFormField(
        "extracurricular",
        current.filter((i) => i !== item)
      )
    } else {
      updateFormField("extracurricular", [...current, item])
    }
  }

  const handlePreview = () => {
    // Basic validation
    if (!formData.fullNameEn.trim()) {
      setErrorMessage("Please enter applicant's Full Name in English.")
      return
    }
    if (!formData.dateOfBirth) {
      setErrorMessage("Please select applicant's Date of Birth.")
      return
    }
    if (!formData.gender) {
      setErrorMessage("Please select applicant's Gender.")
      return
    }
    if (!formData.mobileNo.trim()) {
      setErrorMessage("Please provide a contact Mobile Number.")
      return
    }
    if (!formData.fatherNameEn.trim()) {
      setErrorMessage("Please provide Father's Name.")
      return
    }
    if (!formData.presentAddressLine.trim()) {
      setErrorMessage("Please enter Present Address.")
      return
    }

    setStep(3)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <Box sx={{ maxWidth: 960, mx: "auto" }}>
      {/* Page Header */}
      <Box
        sx={{
          mb: 4,
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", sm: "center" },
          gap: 2,
        }}
      >
        <Box>
          <Typography
            variant="caption"
            sx={{
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              color: "primary.main",
              display: "block",
            }}
          >
            Step 2 of 4
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 800, color: "text.primary" }}>
            Admission Form
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            Fill in the applicant details carefully. All sections marked with * are required.
          </Typography>
        </Box>

        <Button
          variant="outlined"
          color="primary"
          startIcon={<AutoFixHighIcon />}
          onClick={loadSampleData}
          sx={{
            borderRadius: "6px",
            fontWeight: 600,
            textTransform: "none",
            bgcolor: "rgba(37, 99, 235, 0.04)",
          }}
        >
          ⚡ Fill Demo Sample Data
        </Button>
      </Box>

      {/* SECTION 1: Personal Information */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2.5, sm: 3.5 },
          borderRadius: "8px",
          border: "1px solid",
          borderColor: "divider",
          bgcolor: "#FFFFFF",
          mb: 3,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2.5 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 34,
              height: 34,
              borderRadius: "6px",
              bgcolor: "rgba(37, 99, 235, 0.1)",
              color: "primary.main",
            }}
          >
            <PersonIcon sx={{ fontSize: 20 }} />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, color: "text.primary", lineHeight: 1.2 }}>
              1. Personal Information
            </Typography>
            <Typography variant="caption" sx={{ color: "text.secondary" }}>
              Student identity and demographic records
            </Typography>
          </Box>
        </Box>

        {/* Photo Upload Row */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2.5,
            p: 2,
            mb: 3,
            borderRadius: "6px",
            bgcolor: "#F8FAFC",
            border: "1px dashed #CBD5E1",
          }}
        >
          <Avatar
            src={formData.photoUrl || undefined}
            variant="rounded"
            sx={{
              width: 72,
              height: 84,
              bgcolor: "#E2E8F0",
              color: "#64748B",
              borderRadius: "6px",
              border: "1px solid #CBD5E1",
            }}
          >
            <PhotoIcon sx={{ fontSize: 32 }} />
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "text.primary" }}>
              Applicant Photograph
            </Typography>
            <Typography variant="caption" sx={{ color: "text.secondary", display: "block", mb: 1 }}>
              Passport size (300x300 px), white background, max 2MB (JPG/PNG).
            </Typography>
            <Button
              variant="outlined"
              size="small"
              component="label"
              startIcon={<PhotoIcon />}
              sx={{ borderRadius: "4px", fontSize: "0.8rem", textTransform: "none" }}
            >
              Upload Photo
              <input type="file" accept="image/*" hidden onChange={handlePhotoUploadMock} />
            </Button>
          </Box>
        </Box>

        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              required
              label="Full Name (English - BLOCK Letters)"
              placeholder="e.g. MD. TANVIR AHMED"
              value={formData.fullNameEn}
              onChange={(e) => updateFormField("fullNameEn", e.target.value.toUpperCase())}
              size="small"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Full Name (Bangla)"
              placeholder="e.g. মোঃ তানভীর আহমেদ"
              value={formData.fullNameBn}
              onChange={(e) => updateFormField("fullNameBn", e.target.value)}
              size="small"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              fullWidth
              required
              type="date"
              label="Date of Birth"
              value={formData.dateOfBirth}
              onChange={(e) => updateFormField("dateOfBirth", e.target.value)}
              size="small"
              slotProps={{ inputLabel: { shrink: true } }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              fullWidth
              required
              select
              label="Gender"
              value={formData.gender}
              onChange={(e) => updateFormField("gender", e.target.value as any)}
              size="small"
            >
              <MenuItem value="Male">Male</MenuItem>
              <MenuItem value="Female">Female</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </TextField>
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              fullWidth
              select
              label="Blood Group"
              value={formData.bloodGroup}
              onChange={(e) => updateFormField("bloodGroup", e.target.value)}
              size="small"
            >
              {bloodGroups.map((bg) => (
                <MenuItem key={bg} value={bg}>
                  {bg}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              fullWidth
              select
              label="Religion"
              value={formData.religion}
              onChange={(e) => updateFormField("religion", e.target.value)}
              size="small"
            >
              {religions.map((rel) => (
                <MenuItem key={rel} value={rel}>
                  {rel}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              fullWidth
              label="Nationality"
              value={formData.nationality}
              onChange={(e) => updateFormField("nationality", e.target.value)}
              size="small"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              fullWidth
              label="Online Birth Reg. No (17 Digits)"
              placeholder="e.g. 20121923456789012"
              value={formData.birthRegNo}
              onChange={(e) => updateFormField("birthRegNo", e.target.value)}
              size="small"
            />
          </Grid>
        </Grid>
      </Paper>

      {/* SECTION 2: Contact Information */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2.5, sm: 3.5 },
          borderRadius: "8px",
          border: "1px solid",
          borderColor: "divider",
          bgcolor: "#FFFFFF",
          mb: 3,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2.5 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 34,
              height: 34,
              borderRadius: "6px",
              bgcolor: "rgba(37, 99, 235, 0.1)",
              color: "primary.main",
            }}
          >
            <ContactIcon sx={{ fontSize: 20 }} />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, color: "text.primary", lineHeight: 1.2 }}>
              2. Contact Information
            </Typography>
            <Typography variant="caption" sx={{ color: "text.secondary" }}>
              Mobile and communication channels for SMS updates
            </Typography>
          </Box>
        </Box>

        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              fullWidth
              required
              label="Primary Mobile No"
              placeholder="e.g. 01819-123456"
              value={formData.mobileNo}
              onChange={(e) => updateFormField("mobileNo", e.target.value)}
              size="small"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              fullWidth
              label="Emergency Contact No"
              placeholder="e.g. 01711-987654"
              value={formData.emergencyContact}
              onChange={(e) => updateFormField("emergencyContact", e.target.value)}
              size="small"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              fullWidth
              type="email"
              label="Email Address (Optional)"
              placeholder="student@example.com"
              value={formData.email}
              onChange={(e) => updateFormField("email", e.target.value)}
              size="small"
            />
          </Grid>
        </Grid>
      </Paper>

      {/* SECTION 3: Guardian Information */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2.5, sm: 3.5 },
          borderRadius: "8px",
          border: "1px solid",
          borderColor: "divider",
          bgcolor: "#FFFFFF",
          mb: 3,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2.5 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 34,
              height: 34,
              borderRadius: "6px",
              bgcolor: "rgba(37, 99, 235, 0.1)",
              color: "primary.main",
            }}
          >
            <FamilyIcon sx={{ fontSize: 20 }} />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, color: "text.primary", lineHeight: 1.2 }}>
              3. Guardian Information
            </Typography>
            <Typography variant="caption" sx={{ color: "text.secondary" }}>
              Parents and legal guardian profiles
            </Typography>
          </Box>
        </Box>

        {/* Father's Info */}
        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "primary.main", mb: 1.5 }}>
          Father's Details
        </Typography>
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              required
              label="Father's Name (English)"
              value={formData.fatherNameEn}
              onChange={(e) => updateFormField("fatherNameEn", e.target.value.toUpperCase())}
              size="small"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Father's Name (Bangla)"
              value={formData.fatherNameBn}
              onChange={(e) => updateFormField("fatherNameBn", e.target.value)}
              size="small"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              fullWidth
              label="Father's NID No"
              value={formData.fatherNid}
              onChange={(e) => updateFormField("fatherNid", e.target.value)}
              size="small"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              fullWidth
              label="Father's Occupation"
              value={formData.fatherOccupation}
              onChange={(e) => updateFormField("fatherOccupation", e.target.value)}
              size="small"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              fullWidth
              label="Father's Phone"
              value={formData.fatherPhone}
              onChange={(e) => updateFormField("fatherPhone", e.target.value)}
              size="small"
            />
          </Grid>
        </Grid>

        <Divider sx={{ my: 2.5 }} />

        {/* Mother's Info */}
        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "primary.main", mb: 1.5 }}>
          Mother's Details
        </Typography>
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              required
              label="Mother's Name (English)"
              value={formData.motherNameEn}
              onChange={(e) => updateFormField("motherNameEn", e.target.value.toUpperCase())}
              size="small"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Mother's Name (Bangla)"
              value={formData.motherNameBn}
              onChange={(e) => updateFormField("motherNameBn", e.target.value)}
              size="small"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              fullWidth
              label="Mother's NID No"
              value={formData.motherNid}
              onChange={(e) => updateFormField("motherNid", e.target.value)}
              size="small"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              fullWidth
              label="Mother's Occupation"
              value={formData.motherOccupation}
              onChange={(e) => updateFormField("motherOccupation", e.target.value)}
              size="small"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              fullWidth
              label="Mother's Phone"
              value={formData.motherPhone}
              onChange={(e) => updateFormField("motherPhone", e.target.value)}
              size="small"
            />
          </Grid>
        </Grid>

        <Divider sx={{ my: 2.5 }} />

        {/* Guardian Extra */}
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              fullWidth
              label="Legal Guardian's Name (If other)"
              value={formData.guardianName}
              onChange={(e) => updateFormField("guardianName", e.target.value)}
              size="small"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              fullWidth
              label="Relation with Guardian"
              value={formData.guardianRelation}
              onChange={(e) => updateFormField("guardianRelation", e.target.value)}
              size="small"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              fullWidth
              label="Annual Family Income (BDT)"
              placeholder="e.g. 480000"
              value={formData.annualIncome}
              onChange={(e) => updateFormField("annualIncome", e.target.value)}
              size="small"
            />
          </Grid>
        </Grid>
      </Paper>

      {/* SECTION 4: Academic Information */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2.5, sm: 3.5 },
          borderRadius: "8px",
          border: "1px solid",
          borderColor: "divider",
          bgcolor: "#FFFFFF",
          mb: 3,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2.5 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 34,
              height: 34,
              borderRadius: "6px",
              bgcolor: "rgba(37, 99, 235, 0.1)",
              color: "primary.main",
            }}
          >
            <SchoolIcon sx={{ fontSize: 20 }} />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, color: "text.primary", lineHeight: 1.2 }}>
              4. Academic Information
            </Typography>
            <Typography variant="caption" sx={{ color: "text.secondary" }}>
              Target admission grade and previous educational records
            </Typography>
          </Box>
        </Box>

        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "primary.main", mb: 1.5 }}>
          Target Grade & Stream
        </Typography>
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              fullWidth
              required
              select
              label="Applying for Class"
              value={formData.applyingClass}
              onChange={(e) => updateFormField("applyingClass", e.target.value)}
              size="small"
            >
              {applyingClasses.map((cls) => (
                <MenuItem key={cls} value={cls}>
                  {cls}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              fullWidth
              required
              select
              label="Curriculum Version"
              value={formData.version}
              onChange={(e) => updateFormField("version", e.target.value as any)}
              size="small"
            >
              <MenuItem value="Bangla">Bangla Medium</MenuItem>
              <MenuItem value="English">English Version</MenuItem>
            </TextField>
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              fullWidth
              required
              select
              label="Preferred Shift"
              value={formData.shift}
              onChange={(e) => updateFormField("shift", e.target.value as any)}
              size="small"
            >
              <MenuItem value="Morning">Morning Shift (Girls / Primary)</MenuItem>
              <MenuItem value="Day">Day Shift (Boys)</MenuItem>
            </TextField>
          </Grid>
        </Grid>

        <Divider sx={{ my: 2.5 }} />

        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "primary.main", mb: 1.5 }}>
          Previous School Records
        </Typography>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 8 }}>
            <TextField
              fullWidth
              label="Previous School / Institute Name"
              placeholder="e.g. Bakalia Model Govt. Primary School"
              value={formData.previousSchool}
              onChange={(e) => updateFormField("previousSchool", e.target.value)}
              size="small"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              fullWidth
              label="Previous Exam / Class Passed"
              value={formData.previousExam}
              onChange={(e) => updateFormField("previousExam", e.target.value)}
              size="small"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              fullWidth
              label="Passing Year"
              value={formData.passingYear}
              onChange={(e) => updateFormField("passingYear", e.target.value)}
              size="small"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              fullWidth
              select
              label="Education Board"
              value={formData.previousBoard}
              onChange={(e) => updateFormField("previousBoard", e.target.value)}
              size="small"
            >
              {educationBoards.map((b) => (
                <MenuItem key={b} value={b}>
                  {b}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              fullWidth
              label="GPA / Obtained Marks"
              placeholder="e.g. 5.00"
              value={formData.previousGpa}
              onChange={(e) => updateFormField("previousGpa", e.target.value)}
              size="small"
            />
          </Grid>
        </Grid>
      </Paper>

      {/* SECTION 5: Address Information */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2.5, sm: 3.5 },
          borderRadius: "8px",
          border: "1px solid",
          borderColor: "divider",
          bgcolor: "#FFFFFF",
          mb: 3,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2.5 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 34,
              height: 34,
              borderRadius: "6px",
              bgcolor: "rgba(37, 99, 235, 0.1)",
              color: "primary.main",
            }}
          >
            <HomeIcon sx={{ fontSize: 20 }} />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, color: "text.primary", lineHeight: 1.2 }}>
              5. Address Information
            </Typography>
            <Typography variant="caption" sx={{ color: "text.secondary" }}>
              Present residence and permanent address
            </Typography>
          </Box>
        </Box>

        {/* Present Address */}
        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "primary.main", mb: 1.5 }}>
          Present Address
        </Typography>
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              fullWidth
              label="District"
              value={formData.presentDistrict}
              onChange={(e) => updateFormField("presentDistrict", e.target.value)}
              size="small"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              fullWidth
              label="Thana / Upazila"
              value={formData.presentThana}
              onChange={(e) => updateFormField("presentThana", e.target.value)}
              size="small"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              fullWidth
              label="Post Code"
              value={formData.presentPostCode}
              onChange={(e) => updateFormField("presentPostCode", e.target.value)}
              size="small"
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              required
              label="Village / House / Road / Area Details"
              placeholder="e.g. House #42, Road #05, Block B, Shantinagar, Bakalia"
              value={formData.presentAddressLine}
              onChange={(e) => updateFormField("presentAddressLine", e.target.value)}
              size="small"
            />
          </Grid>
        </Grid>

        <Divider sx={{ my: 2.5 }} />

        {/* Permanent Address */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            mb: 1.5,
          }}
        >
          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "primary.main" }}>
            Permanent Address
          </Typography>
          <FormControlLabel
            control={
              <Checkbox
                checked={formData.sameAsPresent}
                onChange={(e) => updateFormField("sameAsPresent", e.target.checked)}
                size="small"
                color="primary"
              />
            }
            label={<Typography variant="body2" sx={{ fontWeight: 600 }}>Same as Present Address</Typography>}
          />
        </Box>

        {!formData.sameAsPresent && (
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                fullWidth
                label="Permanent District"
                value={formData.permanentDistrict}
                onChange={(e) => updateFormField("permanentDistrict", e.target.value)}
                size="small"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                fullWidth
                label="Permanent Thana"
                value={formData.permanentThana}
                onChange={(e) => updateFormField("permanentThana", e.target.value)}
                size="small"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                fullWidth
                label="Permanent Post Code"
                value={formData.permanentPostCode}
                onChange={(e) => updateFormField("permanentPostCode", e.target.value)}
                size="small"
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Permanent Address Line"
                value={formData.permanentAddressLine}
                onChange={(e) => updateFormField("permanentAddressLine", e.target.value)}
                size="small"
              />
            </Grid>
          </Grid>
        )}
      </Paper>

      {/* SECTION 6: Other Information & Quota */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2.5, sm: 3.5 },
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
              width: 34,
              height: 34,
              borderRadius: "6px",
              bgcolor: "rgba(37, 99, 235, 0.1)",
              color: "primary.main",
            }}
          >
            <OtherIcon sx={{ fontSize: 20 }} />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, color: "text.primary", lineHeight: 1.2 }}>
              6. Quota & Extracurricular Information
            </Typography>
            <Typography variant="caption" sx={{ color: "text.secondary" }}>
              Special quotas, talents, and co-curricular involvement
            </Typography>
          </Box>
        </Box>

        <Grid container spacing={2.5}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              select
              label="Special Quota Category"
              value={formData.quota}
              onChange={(e) => updateFormField("quota", e.target.value)}
              size="small"
            >
              {quotaOptions.map((q) => (
                <MenuItem key={q} value={q}>
                  {q}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Medical Conditions / Allergies"
              value={formData.medicalCondition}
              onChange={(e) => updateFormField("medicalCondition", e.target.value)}
              size="small"
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: "text.primary", mb: 1 }}>
              Extracurricular Activities & Interests:
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {extracurricularOptions.map((item) => {
                const isSelected = formData.extracurricular?.includes(item)
                return (
                  <Chip
                    key={item}
                    label={item}
                    clickable
                    color={isSelected ? "primary" : "default"}
                    variant={isSelected ? "filled" : "outlined"}
                    onClick={() => toggleExtracurricular(item)}
                    sx={{
                      borderRadius: "6px",
                      fontWeight: isSelected ? 700 : 500,
                    }}
                  />
                )
              })}
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Form Action Buttons */}
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
          onClick={() => {
            setStep(1)
            window.scrollTo({ top: 0, behavior: "smooth" })
          }}
          sx={{
            py: 1.2,
            px: 3,
            borderRadius: "6px",
            fontWeight: 600,
            width: { xs: "100%", sm: "auto" },
          }}
        >
          Back to Terms
        </Button>

        <Button
          variant="contained"
          color="primary"
          endIcon={<ArrowForwardIcon />}
          onClick={handlePreview}
          sx={{
            py: 1.3,
            px: 4,
            borderRadius: "6px",
            fontWeight: 700,
            fontSize: "0.95rem",
            width: { xs: "100%", sm: "auto" },
            boxShadow: "0 4px 14px rgba(37, 99, 235, 0.35)",
          }}
        >
          Preview Application →
        </Button>
      </Box>

      {/* Validation Error Toast */}
      <Snackbar
        open={!!errorMessage}
        autoHideDuration={4000}
        onClose={() => setErrorMessage(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={() => setErrorMessage(null)} severity="error" sx={{ width: "100%", borderRadius: "6px" }}>
          {errorMessage}
        </Alert>
      </Snackbar>
    </Box>
  )
}
