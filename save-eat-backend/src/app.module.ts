import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(), // Load .env configuration
    MongooseModule.forRoot(process.env.MONGO_URI!), // MongoDB URI from .env
  ],
})
export class AppModule {}
