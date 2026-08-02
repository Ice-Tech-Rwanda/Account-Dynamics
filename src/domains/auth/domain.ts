export type AuthProvider = "credentials" | "google" | "github"

export interface LoginInput {
  email: string
  password: string
}

export interface RegisterInput {
  name: string
  email: string
  password: string
}

export interface AuthResult {
  success: boolean
  error?: string
  redirectTo?: string
}
