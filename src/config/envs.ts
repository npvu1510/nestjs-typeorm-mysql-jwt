import * as dotenv from 'dotenv';
dotenv.config({ path: '.env' });

import * as z from 'zod';

import { IEnvs } from 'src/common/interfaces';

const envsSchema = z
  .object({
    // Server
    PORT: z
      .string()
      .transform((val) => parseInt(val, 10))
      .refine((val) => !isNaN(val), { message: 'Port must be a number' }),

    // Database
    DB_TYPE: z.string(),
    DB_HOST: z.string(),
    DB_PORT: z
      .string()
      .transform((val) => parseInt(val, 10))
      .refine((val) => !isNaN(val), {
        message: 'Port of database must be a number',
      }),
    DB_USERNAME: z.string(),
    DB_PASSWORD: z.string(),
    DB_NAME: z.string(),

    // Jwt
    JWT_ACCESS_SECRET: z.string(),
    JWT_REFRESH_SECRET: z.string(),
  })
  .transform((val) => val as IEnvs);

const { error, data } = envsSchema.safeParse({ ...process.env });

if (error) {
  console.log('ERROR WHEN VALIDATING ENVIRONMENTS');
  console.log(error);
}

export { data as envs };
