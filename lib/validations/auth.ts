import { z } from "zod";

// Common validation patterns
const emailSchema = z
  .string()
  .min(1, "Email is required")
  .email("Please enter a valid email address")
  .max(255, "Email must be less than 255 characters");

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(72, "Password must be less than 72 characters")
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    "Password must contain at least one uppercase letter, one lowercase letter, and one number"
  );

const nameSchema = z
  .string()
  .min(2, "Name must be at least 2 characters")
  .max(100, "Name must be less than 100 characters")
  .regex(
    /^[a-zA-Z\s'-]+$/,
    "Name can only contain letters, spaces, hyphens, and apostrophes"
  );

const phoneSchema = z
  .string()
  .regex(
    /^[\d\s\-+()]{10,20}$/,
    "Please enter a valid phone number"
  )
  .optional()
  .or(z.literal(""));

// Login schema
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required"),
});

export type LoginFormData = z.infer<typeof loginSchema>;

// Signup schema
export const signupSchema = z
  .object({
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Please confirm your password"),
    fullName: nameSchema,
    department: z.string().optional(),
    phone: phoneSchema,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type SignupFormData = z.infer<typeof signupSchema>;

// Patient admission schema
export const patientAdmissionSchema = z.object({
  name: nameSchema,
  age: z
    .number()
    .min(0, "Age must be a positive number")
    .max(150, "Please enter a valid age"),
  gender: z.enum(["Male", "Female", "Other"], {
    error: "Please select a gender",
  }),
  ward: z.string().min(1, "Ward is required"),
  contactPhone: phoneSchema,
  emergencyContact: z
    .object({
      name: nameSchema.optional(),
      phone: phoneSchema,
      relationship: z.string().optional(),
    })
    .optional(),
});

export type PatientAdmissionData = z.infer<typeof patientAdmissionSchema>;

// Profile update schema
export const profileUpdateSchema = z.object({
  fullName: nameSchema.optional(),
  phone: phoneSchema,
  department: z.string().max(100).optional(),
});

export type ProfileUpdateData = z.infer<typeof profileUpdateSchema>;

// Helper function to format Zod errors for display
export function formatZodErrors(
  error: z.ZodError
): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const issue of error.issues) {
    const path = issue.path.join(".");
    if (!errors[path]) {
      errors[path] = issue.message;
    }
  }
  return errors;
}

// Helper to safely parse with Zod
export function safeParse<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; errors: Record<string, string> } {
  const result = schema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return { success: false, errors: formatZodErrors(result.error) };
}
