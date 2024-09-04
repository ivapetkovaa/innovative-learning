import crypto from "crypto";

const SECRET = "INNOVARIVE_LEARNING_BACKEND_API";

export const COOKIE_HEADER = "INNOVATIVE-LEARNING-AUTH";
export const random = () => crypto.randomBytes(128).toString("base64");

// sha256 is a specific algorith, this one is used to create a HMAC of the salt and the password
export const authentication = (salt: string, password: string) => {
  return crypto
    .createHmac("sha256", [salt, password].join("/"))
    .update(SECRET)
    .digest("hex");
};

export function giveCurrentDateTime() {
  const currentDate = new Date();

  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, "0");
  const day = String(currentDate.getDate()).padStart(2, "0");
  const hours = String(currentDate.getHours()).padStart(2, "0");
  const minutes = String(currentDate.getMinutes()).padStart(2, "0");
  const seconds = String(currentDate.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}
