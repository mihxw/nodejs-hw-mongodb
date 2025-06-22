import mongoose, { model, Schema } from 'mongoose';

const sessionSchema = new Schema(
  {
    userId: {
      type: String,
      require: true,
    },
    accessToken: {
      type: String,
      require: true,
    },
    refreshToken: {
      type: String,
      require: true,
    },
    accessTokenValidUntil: {
      type: Date,
      require: true,
    },
    refreshTokenValidUntil: {
      type: Date,
      require: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const SessionCollection = mongoose.model('session', sessionSchema);