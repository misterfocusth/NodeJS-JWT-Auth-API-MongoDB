declare global {
    namespace NodeJS {
      interface ProcessEnv {
        API_PORT: number;
        MONGO_URI: string;
        TOKEN_KEY: string;
      }
    }
  }
  
  export {}