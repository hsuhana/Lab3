require("dotenv").config();
// Global configurations object contains Application Level variables such as:
// client secrets, passwords, connection strings, and misc flags
const configurations = {
  ConnectionStrings: {
    MongoDB: process.env.CONNECTION_STRING_MONGODB,
  },
  Authentication: {
    GitHub: {
      ClientId: process.env.GITHUB_CLIENTID,
      ClientSecret: process.env.GITHUB_CLIENTSECRET,
      CallbackUrl: "http://localhost:3000/github/callback"
    },
    Google: {
      ClientId: process.env.GOOGLE_CLIENTID,
      ClientSecret: process.env.GOOGLE_CLIENTSECRET,
      CallbackURL: "http://localhost:3000/google/callback"
    },
  },
};
module.exports = configurations;
