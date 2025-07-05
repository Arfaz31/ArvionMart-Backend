import mongoose, { Schema, Document, model } from 'mongoose';
import { IPromoBanner } from './promoBanner.interface';



const PromoBannerSchema= new Schema<IPromoBanner>(
  {
    bannerImage: {
      type: String,
      required: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    subtitle: {
      type: String,
      required: true,
      trim: true,
    },
    discount: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    timestamps: true, 
  }
);

export const PromoBanner = model<IPromoBanner>('PromoBanner', PromoBannerSchema);


