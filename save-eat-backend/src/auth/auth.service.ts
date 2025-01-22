import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../users/schemas/user.schema';
import * as Twilio from 'twilio';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  private readonly twilioClient: Twilio.Twilio;

  constructor(
    @InjectModel(User.name) private userModel: Model<User>, // Inject the User model
  ) {
    // Initialize Twilio client
    this.twilioClient = Twilio(
      process.env.TWILIO_SID,
      process.env.TWILIO_AUTH_TOKEN,
    );
  }

  // Validate Uzbek phone number format (starts with +998)
  validatePhoneNumber(phone: string): boolean {
    const phoneRegex = /^998[0-9]{9}$/;
    return phoneRegex.test(phone);
  }

  // Generate OTP
  generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
  }

  // Send OTP via SMS (using Twilio)
  async sendOTP(phone: string): Promise<void> {
    const otp = this.generateOTP();
    const message = `Your OTP code is ${otp}`;

    // Save OTP temporarily in a cache (Redis or DB) for verification
    // We'll use a Redis store or database to store OTP temporarily for 5 minutes.
    // For simplicity, we'll skip this in this example.

    // Send OTP using Twilio
    await this.twilioClient.messages.create({
      to: phone,
      from: process.env.TWILIO_PHONE_NUMBER, // Your Twilio number
      body: message,
    });

    console.log(`Sent OTP ${otp} to ${phone}`);
  }

  // Verify OTP (in this case, OTP is stored temporarily)
  async verifyOTP(phone: string, otp: string): Promise<boolean> {
    // In a real application, you'd fetch the stored OTP from Redis or DB
    // Here, we'll just simulate OTP validation.
    const storedOTP = '123456'; // Temporary, should be replaced by cache or DB retrieval

    return otp === storedOTP;
  }

  // Generate JWT token after OTP verification
  async generateToken(userId: string): Promise<string> {
    return jwt.sign({ userId }, process.env.JWT_SECRET!, { expiresIn: '1h' });
  }

  // Register user (for first-time users)
  async registerUser(phone: string): Promise<any> {
    const existingUser = await this.userModel.findOne({ phone });
    if (existingUser) {
      throw new Error('User with this phone number already exists');
    }

    const newUser = new this.userModel({
      phone,
    });

    await newUser.save();
    return { message: 'User registered successfully' };
  }

  // Login or verify user with OTP
  async loginUser(phone: string, otp: string): Promise<any> {
    const user = await this.userModel.findOne({ phone });
    if (!user) {
      throw new Error('User not found');
    }

    const isOtpValid = await this.verifyOTP(phone, otp);
    if (!isOtpValid) {
      throw new Error('Invalid OTP');
    }

    const token = await this.generateToken(user._id!.toString()); // _id should be of type ObjectId

    return { message: 'Login successful', token };
  }
}
