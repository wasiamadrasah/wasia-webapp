"use client"

import * as React from "react"
import Box from "@mui/material/Box"
import Stepper from "@mui/material/Stepper"
import Step from "@mui/material/Step"
import StepLabel from "@mui/material/StepLabel"
import StepConnector, { stepConnectorClasses } from "@mui/material/StepConnector"
import { styled } from "@mui/material/styles"
import type { StepIconProps } from "@mui/material/StepIcon"
import CheckIcon from "@mui/icons-material/Check"
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined"
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined"
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined"
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined"

const ColorConnector = styled(StepConnector)(() => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 22,
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: "#2563EB",
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: "#16A34A",
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    borderColor: "#E2E8F0",
    borderTopWidth: 2,
    borderRadius: 1,
  },
}))

const StepIconRoot = styled("div")<{
  ownerState: { completed?: boolean; active?: boolean }
}>(({ ownerState }) => ({
  backgroundColor: ownerState.completed
    ? "#16A34A"
    : ownerState.active
      ? "#2563EB"
      : "#F1F5F9",
  zIndex: 1,
  color: ownerState.active || ownerState.completed ? "#FFFFFF" : "#64748B",
  width: 44,
  height: 44,
  display: "flex",
  borderRadius: "8px",
  justifyContent: "center",
  alignItems: "center",
  border: ownerState.active
    ? "2px solid #2563EB"
    : ownerState.completed
      ? "2px solid #16A34A"
      : "1px solid #CBD5E1",
  boxShadow: ownerState.active ? "0 4px 12px rgba(37, 99, 235, 0.25)" : "none",
  transition: "all 0.2s ease-in-out",
}))

function CustomStepIcon(props: StepIconProps) {
  const { active, completed, icon } = props

  const icons: Record<string, React.ReactElement> = {
    "1": <AssignmentOutlinedIcon sx={{ fontSize: 20 }} />,
    "2": <DescriptionOutlinedIcon sx={{ fontSize: 20 }} />,
    "3": <VisibilityOutlinedIcon sx={{ fontSize: 20 }} />,
    "4": <CheckCircleOutlinedIcon sx={{ fontSize: 20 }} />,
  }

  return (
    <StepIconRoot ownerState={{ completed, active }}>
      {completed ? <CheckIcon sx={{ fontSize: 22, fontWeight: 700 }} /> : icons[String(icon)]}
    </StepIconRoot>
  )
}

const steps = [
  { label: "Terms & Conditions", subtitle: "Rules & Guidelines" },
  { label: "Admission Form", subtitle: "Student & Academic Data" },
  { label: "Preview", subtitle: "Review & Verify" },
  { label: "Application Done", subtitle: "Download Slip & PDF" },
]

export function AdmissionStepper({ currentStep }: { currentStep: number }) {
  return (
    <Box sx={{ width: "100%", py: { xs: 2, md: 3 } }}>
      <Stepper
        alternativeLabel
        activeStep={currentStep - 1}
        connector={<ColorConnector />}
      >
        {steps.map((step) => (
          <Step key={step.label}>
            <StepLabel slots={{ stepIcon: CustomStepIcon }}>
              <Box sx={{ mt: 0.5 }}>
                <Box
                  sx={{
                    fontWeight: 700,
                    fontSize: { xs: "0.8rem", sm: "0.875rem" },
                    color: "text.primary",
                  }}
                >
                  {step.label}
                </Box>
                <Box
                  sx={{
                    display: { xs: "none", sm: "block" },
                    fontSize: "0.75rem",
                    color: "text.disabled",
                  }}
                >
                  {step.subtitle}
                </Box>
              </Box>
            </StepLabel>
          </Step>
        ))}
      </Stepper>
    </Box>
  )
}
