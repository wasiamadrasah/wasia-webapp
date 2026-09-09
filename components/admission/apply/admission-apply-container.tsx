"use client"

import * as React from "react"
import Container from "@mui/material/Container"
import Box from "@mui/material/Box"
import { AdmissionFlowProvider, useAdmissionFlow } from "./admission-flow-context"
import { AdmissionStepper } from "./admission-stepper"
import { Step1Conditions } from "./step1-conditions"
import { Step2Form } from "./step2-form"
import { Step3Preview } from "./step3-preview"
import { Step4Success } from "./step4-success"

function AdmissionFlowContent() {
  const { currentStep } = useAdmissionFlow()

  return (
    <Box
      component="main"
      sx={{
        bgcolor: "#F8FAFC",
        minHeight: "calc(100vh - 140px)",
        py: { xs: 4, md: 6 },
      }}
    >
      <Container maxWidth="lg">
        {/* Stepper only shown on steps 1, 2, 3 */}
        {currentStep <= 4 && (
          <Box sx={{ mb: { xs: 3, md: 4 } }} className="no-print">
            <AdmissionStepper currentStep={currentStep} />
          </Box>
        )}

        {/* Step Views */}
        {currentStep === 1 && <Step1Conditions />}
        {currentStep === 2 && <Step2Form />}
        {currentStep === 3 && <Step3Preview />}
        {currentStep === 4 && <Step4Success />}
      </Container>
    </Box>
  )
}

export function AdmissionApplyContainer() {
  return (
    <AdmissionFlowProvider>
      <AdmissionFlowContent />
    </AdmissionFlowProvider>
  )
}
