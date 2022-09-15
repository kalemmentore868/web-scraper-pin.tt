import mongoose from "mongoose";

const iphoneSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  color: {
    type: String,
  },
  storge: {
    type: String,
  },
  condition: {
    type: String,
  },
  images: {
    type: [String],
    required: true,
  },
  link: {
    type: String,
  },
});

const Iphone = mongoose.model("iphones", iphoneSchema);

export default Iphone;
