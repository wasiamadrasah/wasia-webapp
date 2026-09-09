import * as React from "react"

export interface AdmissionFormData {
  // Personal Information
  fullNameEn: string
  fullNameBn: string
  dateOfBirth: string
  gender: "Male" | "Female" | "Other" | ""
  bloodGroup: string
  religion: string
  nationality: string
  birthRegNo: string
  photoUrl: string

  // Contact Information
  mobileNo: string
  emergencyContact: string
  email: string

  // Guardian Information
  fatherNameEn: string
  fatherNameBn: string
  fatherNid: string
  fatherOccupation: string
  fatherPhone: string
  motherNameEn: string
  motherNameBn: string
  motherNid: string
  motherOccupation: string
  motherPhone: string
  guardianName: string
  guardianRelation: string
  guardianPhone: string
  annualIncome: string

  // Academic Information
  applyingClass: string
  version: "Bangla" | "English"
  shift: "Morning" | "Day"
  previousSchool: string
  previousExam: string
  passingYear: string
  previousRoll: string
  previousBoard: string
  previousGpa: string

  // Address Information
  presentDistrict: string
  presentThana: string
  presentPostOffice: string
  presentPostCode: string
  presentAddressLine: string

  sameAsPresent: boolean
  permanentDistrict: string
  permanentThana: string
  permanentPostOffice: string
  permanentPostCode: string
  permanentAddressLine: string

  // Other & Quota Information
  quota: string
  extracurricular: string[]
  medicalCondition: string

  // Application Meta
  applicationNo: string
  submittedAt: string
}

export const INITIAL_ADMISSION_DATA: AdmissionFormData = {
  fullNameEn: "",
  fullNameBn: "",
  dateOfBirth: "",
  gender: "",
  bloodGroup: "",
  religion: "Islam",
  nationality: "Bangladeshi",
  birthRegNo: "",
  photoUrl: "",

  mobileNo: "",
  emergencyContact: "",
  email: "",

  fatherNameEn: "",
  fatherNameBn: "",
  fatherNid: "",
  fatherOccupation: "",
  fatherPhone: "",
  motherNameEn: "",
  motherNameBn: "",
  motherNid: "",
  motherOccupation: "",
  motherPhone: "",
  guardianName: "",
  guardianRelation: "",
  guardianPhone: "",
  annualIncome: "",

  applyingClass: "Class 6",
  version: "Bangla",
  shift: "Morning",
  previousSchool: "",
  previousExam: "Primary Completion / Annual Exam",
  passingYear: "2025",
  previousRoll: "",
  previousBoard: "Chattogram",
  previousGpa: "",

  presentDistrict: "Chattogram",
  presentThana: "Bakalia",
  presentPostOffice: "Bakalia",
  presentPostCode: "4212",
  presentAddressLine: "",

  sameAsPresent: true,
  permanentDistrict: "Chattogram",
  permanentThana: "Bakalia",
  permanentPostOffice: "Bakalia",
  permanentPostCode: "4212",
  permanentAddressLine: "",

  quota: "General",
  extracurricular: [],
  medicalCondition: "None",

  applicationNo: "ADM-2026-001245",
  submittedAt: "",
}

export const DEMO_STATIC_DATA: AdmissionFormData = {
  fullNameEn: "MD. TANVIR AHMED",
  fullNameBn: "মোঃ তানভীর আহমেদ",
  dateOfBirth: "2012-04-15",
  gender: "Male",
  bloodGroup: "B+",
  religion: "Islam",
  nationality: "Bangladeshi",
  birthRegNo: "20121923456789012",
  photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80",

  mobileNo: "01819-123456",
  emergencyContact: "01711-987654",
  email: "tanvir.ahmed2026@gmail.com",

  fatherNameEn: "MD. RAFIQUL ISLAM",
  fatherNameBn: "মোঃ রফিকুল ইসলাম",
  fatherNid: "19801234567890123",
  fatherOccupation: "Businessman",
  fatherPhone: "01711-987654",
  motherNameEn: "NASIMA AKTER",
  motherNameBn: "নাসিমা আক্তার",
  motherNid: "19841234567890123",
  motherOccupation: "Govt. School Teacher",
  motherPhone: "01812-345678",
  guardianName: "MD. RAFIQUL ISLAM",
  guardianRelation: "Father",
  guardianPhone: "01711-987654",
  annualIncome: "480000",

  applyingClass: "Class 6",
  version: "Bangla",
  shift: "Morning",
  previousSchool: "Bakalia Model Government Primary School",
  previousExam: "Primary Annual / Scholarship Examination",
  passingYear: "2025",
  previousRoll: "104",
  previousBoard: "Chattogram",
  previousGpa: "5.00",

  presentDistrict: "Chattogram",
  presentThana: "Bakalia",
  presentPostOffice: "Bakalia",
  presentPostCode: "4212",
  presentAddressLine: "House #42, Road #05, Shantinagar, Purba Bakalia",

  sameAsPresent: true,
  permanentDistrict: "Chattogram",
  permanentThana: "Bakalia",
  permanentPostOffice: "Bakalia",
  permanentPostCode: "4212",
  permanentAddressLine: "House #42, Road #05, Shantinagar, Purba Bakalia",

  quota: "General",
  extracurricular: ["Scouting & Cub", "Debate Society", "Cricket"],
  medicalCondition: "None",

  applicationNo: "ADM-2026-001245",
  submittedAt: "08 September 2026, 10:30 AM",
}

interface AdmissionFlowContextType {
  currentStep: number
  setStep: (step: number) => void
  agreedToTerms: boolean
  setAgreedToTerms: (agreed: boolean) => void
  confirmedPreview: boolean
  setConfirmedPreview: (confirmed: boolean) => void
  formData: AdmissionFormData
  updateFormField: <K extends keyof AdmissionFormData>(field: K, value: AdmissionFormData[K]) => void
  setFormData: React.Dispatch<React.SetStateAction<AdmissionFormData>>
  loadSampleData: () => void
  resetForm: () => void
  submitApplication: () => void
}

const AdmissionFlowContext = React.createContext<AdmissionFlowContextType | undefined>(undefined)

export function AdmissionFlowProvider({ children }: { children: React.ReactNode }) {
  const [currentStep, setCurrentStep] = React.useState(1)
  const [agreedToTerms, setAgreedToTerms] = React.useState(false)
  const [confirmedPreview, setConfirmedPreview] = React.useState(false)
  const [formData, setFormData] = React.useState<AdmissionFormData>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("admission_app_data")
        if (saved) return JSON.parse(saved)
      } catch {
        /* ignore */
      }
    }
    return INITIAL_ADMISSION_DATA
  })

  React.useEffect(() => {
    try {
      localStorage.setItem("admission_app_data", JSON.stringify(formData))
    } catch {
      /* ignore */
    }
  }, [formData])

  const updateFormField = <K extends keyof AdmissionFormData>(field: K, value: AdmissionFormData[K]) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value }
      if (field === "sameAsPresent" && value === true) {
        updated.permanentDistrict = prev.presentDistrict
        updated.permanentThana = prev.presentThana
        updated.permanentPostOffice = prev.presentPostOffice
        updated.permanentPostCode = prev.presentPostCode
        updated.permanentAddressLine = prev.presentAddressLine
      }
      return updated
    })
  }

  const loadSampleData = () => {
    setFormData(DEMO_STATIC_DATA)
    setAgreedToTerms(true)
  }

  const resetForm = () => {
    setFormData(INITIAL_ADMISSION_DATA)
    setAgreedToTerms(false)
    setConfirmedPreview(false)
    setCurrentStep(1)
    if (typeof window !== "undefined") {
      localStorage.removeItem("admission_app_data")
    }
  }

  const submitApplication = () => {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000)
    const appNo = `ADM-2026-00${randomSuffix}`
    const now = new Date()
    const submittedStr = now.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }) + `, ${now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}`

    setFormData((prev) => ({
      ...prev,
      applicationNo: appNo,
      submittedAt: submittedStr,
    }))
    setCurrentStep(4)
  }

  return (
    <AdmissionFlowContext.Provider
      value={{
        currentStep,
        setStep: setCurrentStep,
        agreedToTerms,
        setAgreedToTerms,
        confirmedPreview,
        setConfirmedPreview,
        formData,
        updateFormField,
        setFormData,
        loadSampleData,
        resetForm,
        submitApplication,
      }}
    >
      {children}
    </AdmissionFlowContext.Provider>
  )
}

export function useAdmissionFlow() {
  const context = React.useContext(AdmissionFlowContext)
  if (!context) {
    throw new Error("useAdmissionFlow must be used within an AdmissionFlowProvider")
  }
  return context
}
