import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import * as mysql from 'mysql2/promise';

import { envs } from './config';
import { AuthModule } from './auth/auth.module';
import { User } from './typeorm/User';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      async useFactory() {
        // Kiểm tra và tạo database nếu chưa tồn tại
        const connection = await mysql.createConnection({
          host: envs.DB_HOST,
          port: envs.DB_PORT,
          user: envs.DB_USERNAME,
          password: envs.DB_PASSWORD,
        });

        await connection.query(
          `CREATE DATABASE IF NOT EXISTS \`${envs.DB_NAME}\`;`,
        );
        await connection.end();

        // Trả về cấu hình kết nối cho TypeOrmModule sau khi database đã được tạo
        return {
          type: 'mysql',
          host: 'localhost',
          port: envs.DB_PORT,
          username: envs.DB_USERNAME,
          password: envs.DB_PASSWORD,
          database: envs.DB_NAME,
          entities: [User],
          synchronize: true,
        };
      },
    }),
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
