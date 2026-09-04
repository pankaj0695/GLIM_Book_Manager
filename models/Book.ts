import mongoose, { Schema, model, models } from "mongoose";

export const BOOK_STATUSES = ["want-to-read", "reading", "completed"] as const;

export type BookStatus = (typeof BOOK_STATUSES)[number];

export interface BookDocument extends mongoose.Document {
  user: mongoose.Types.ObjectId;
  title: string;
  author: string;
  tags: string[];
  status: BookStatus;
  rating: number;
  createdAt: Date;
  updatedAt: Date;
}

const bookSchema = new Schema<BookDocument>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: 160,
    },
    author: {
      type: String,
      required: [true, "Author is required"],
      trim: true,
      maxlength: 120,
    },
    tags: {
      type: [String],
      default: [],
      validate: {
        validator: (tags: string[]) => tags.length <= 8,
        message: "A book can have at most 8 tags",
      },
    },
    status: {
      type: String,
      enum: BOOK_STATUSES,
      default: "want-to-read",
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
  },
  { timestamps: true }
);

bookSchema.index({ user: 1, createdAt: -1 });

export const Book = models.Book || model<BookDocument>("Book", bookSchema);
