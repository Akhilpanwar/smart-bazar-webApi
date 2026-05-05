import dotenv from "dotenv";
import Joi from "joi";

// Only attempt to load .env if we aren't on Vercel/Production
if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

const options = {
  NODE_ENV: Joi.string()
    .default("development")
    .valid("development", "test", "production"), // Use .valid() instead of .allow() for strictness
  PORT: Joi.number().default(3000), 
  // Add other critical vars here, e.g., MONGODB_URI: Joi.string().required(),
};

const schema = Joi.object(options).unknown(true);

const { error, value: config } = schema.validate(process.env, { abortEarly: false });

if (error) {
  // Log the specific missing variables so you can see them in Vercel Logs
  console.error("❌ Invalid configuration:", error.details.map(i => i.message).join(', '));
  
  // In production/Vercel, exiting can cause a 501. 
  // Consider throwing an error or letting it fail later to see better logs.
  if (process.env.NODE_ENV === "production") {
    console.warn("⚠️ App starting with invalid config in production!");
  } else {
    process.exit(1);
  }
}

export default config;
