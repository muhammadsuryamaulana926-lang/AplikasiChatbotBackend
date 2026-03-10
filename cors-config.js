// CORS Configuration untuk Frontend yang berada di folder terpisah
const corsOptions = {
  origin: function (origin, callback) {
    // Daftar origin yang diizinkan
    const allowedOrigins = [
      // Development ports untuk React/Vite
      'http://localhost:3000',
      'http://localhost:3001', 
      'http://localhost:3002',
      'http://localhost:5173',
      'http://localhost:8080',
      'http://localhost:8081',
      'http://localhost:19006', // Expo web
      
      // React Native Expo - Local Network
      'exp://192.168.100.103:8081',
      'exp://192.168.100.108:8081',
      'http://192.168.100.103:8081',
      'http://192.168.100.108:8081',
      'http://192.168.100.103:5173',
      'http://192.168.100.108:5173',
      
      // DevTunnel URLs
      'https://jstlmtmc-3000.asse.devtunnels.ms',
      'https://jstlmtmc-5173.asse.devtunnels.ms',
      'https://jstlmtmc-8081.asse.devtunnels.ms',
    ];

    // Izinkan semua devtunnels subdomain
    if (!origin || allowedOrigins.includes(origin) || (origin && origin.includes('devtunnels.ms'))) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: 200
};

module.exports = corsOptions;
