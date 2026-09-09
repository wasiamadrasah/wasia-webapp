export type InstituteSettings = {
  primary: PrimaryInfo
  contact: ContactInfo
  social: SocialInfo
}

export type PrimaryInfo = {
  instituteName: string
  instituteNameBn?: string
  shortForm?: string
  motto?: string
  medium: "Bangla" | "English" | "Both"
  establishYear?: number
  eiin?: string
  mpoCode?: string
  instituteCode?: string
  instituteType?: "School" | "College" | "School & College"
  board?: string
  affiliation?: string
  logo?: string
  favicon?: string
}

export type ContactInfo = {
  telephone?: string
  mobile?: string
  fax?: string
  officeHours?: string
  website?: string
  email?: string
  address?: string
  googleMapEmbed?: string
}

export type SocialInfo = {
  facebook?: string
  twitter?: string
  linkedin?: string
  instagram?: string
  youtube?: string
  whatsapp?: string
  tiktok?: string
  telegram?: string
}

export const mediumOptions = ["Bangla", "English", "Both"] as const

export const instituteTypeOptions = ["School", "College", "School & College"] as const

export const defaultInstituteSettings: InstituteSettings = {
  primary: {
    instituteName: "",
    medium: "Both",
  },
  contact: {},
  social: {},
}
