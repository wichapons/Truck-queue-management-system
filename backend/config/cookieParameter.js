const cookieParams = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "PROD",
  sameSite: "strict",
  domain: process.env.NODE_ENV === "PROD" ? "truck-queue-uat.onrender.com":"localhost"
};

module.export= cookieParams;
