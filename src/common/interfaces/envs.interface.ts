export interface IEnvs {
  PORT: number;

  // Database
  DB_TYPE: string;
  DB_HOST: string;
  DB_PORT: number;
  DB_USERNAME: string;
  DB_PASSWORD: string;
  DB_NAME: string;

  // JWT
  JWT_ACCESS_SECRET: string;
  JWT_REFRESH_SECRET: string;
}
