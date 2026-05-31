/** Copied from PDF Uploader's lib/constants.ts */

export const MAX_FILE_SIZE   = 50 * 1024 * 1024  // 50 MB
export const MAX_IMAGE_SIZE  = 10 * 1024 * 1024  // 10 MB
export const ACCEPTED_PDF_TYPES   = ["application/pdf"]
export const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"]

export const voiceOptions = {
  // SIX Financial Information
  jacob:     { id: "onwK4e9ZLuTAKqWW03F9", name: "Jacob Gertel",      description: "Content Management — Legal & Compliance Data" },
  mirko:     { id: "CYw3kZ02Hs0563khs1Fj", name: "Mirko Silvestri",   description: "Real-Time Services & Customer Service Transformation" },
  katharina: { id: "21m00Tcm4TlvDq8ikWAM", name: "Katharina Voegtle", description: "Customer Service Transformation" },
  // Innovation Hub
  jennifer:  { id: "EXAVITQu4vr4xnSDxMaL", name: "Jennifer Chang",    description: "Innovation Hub" },
  magdalena: { id: "XrExE9yKIg1WjnnlVkGX", name: "Magdalena Tuta",    description: "Innovation Hub" },
}

export const voiceCategories = {
  financialInformation: ["jacob", "mirko", "katharina"] as const,
  innovationHub:        ["jennifer", "magdalena"]        as const,
}

export const DEFAULT_VOICE = "katharina"
