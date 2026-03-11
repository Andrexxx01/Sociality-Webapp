const MAX_FILE_SIZE = 5 * 1024 * 1024;

const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export function validatePostImage(file: File | null | undefined) {
  if (!file) {
    return "Image is required";
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return "Only JPG, PNG, or WEBP files are allowed";
  }

  if (file.size > MAX_FILE_SIZE) {
    return "Image size must be 5MB or less";
  }

  return null;
}
