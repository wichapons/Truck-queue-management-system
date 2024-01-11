const cookieParams = {
  httpOnly: true, //enhances security by preventing potential XSS (Cross-Site Scripting) attacks.
  secure: process.env.NODE_ENV === "PROD", //When secure is true, it means the cookie should only be sent over secure (HTTPS) connections.
  sameSite: "strict", //helps mitigate the risk of CSRF (Cross-Site Request Forgery) attacks.
  domain: process.env.NODE_ENV === "PROD" ? "truck-queue-uat.onrender.com":"localhost" 
};

module.export= cookieParams;
