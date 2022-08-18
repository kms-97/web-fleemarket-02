import * as mysql from 'mysql2/promise';
import { Injectable, OnModuleInit } from '@nestjs/common';

@Injectable()
export class CommonService implements OnModuleInit {
  public CP: mysql.Pool;

  async onModuleInit() {
    this.CP = mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      port: parseInt(process.env.DB_PORT) ?? 3306,
      database: process.env.DB_NAME,
    });

    console.log(`✅ START CONNECTION 🚀 `);
  }

  getConnection() {
    return this.CP.getConnection();
  }
}
