const requiredEnv = [
  "PORT",
  "MONGODB_URI",
  "JWT_SECRET",
  "FRONTEND_URL",
  "GOOGLE_CLIENT_ID",
  "GOOGLE_CLIENT_SECRET",
  "GOOGLE_CALLBACK_URL",
  "CLOUDINARY_CLOUD_NAME",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET",
  "EMAIL_USER",
  "EMAIL_PASS"
];

export const validateEnv = () => {
  const missing = requiredEnv.filter(env => !process.env[env]);
  if (missing.length > 0) {
    console.error("❌ Missing required environment variables:", missing.join(", "));
    process.exit(1);
  }
  console.log("✅ Environment variables validated.");
};
