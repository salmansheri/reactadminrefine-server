import mongoose from "mongoose";

const propertySchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, reqquired: true },
  propertyType: { type: String, required: true },
  location: { type: String, required: true },
  price: { type: Number, required: true },
  photo: { type: String, required: true },
  creator: { type: String, required: true },
});

const propertyModel = mongoose.model("Property", propertySchema);

export default propertyModel;
