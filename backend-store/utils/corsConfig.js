export const allowedOrigins = [
  "https://styllin.onrender.com",
  "http://localhost:3000",
  "http://localhost:3001",
  "http://localhost:3002",
];

export const corsOptions = {
  origin: allowedOrigins,
  methods: "GET,POST,PUT,DELETE",
};
