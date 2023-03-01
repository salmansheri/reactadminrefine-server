import propertyModel from "../mongodb/models/propertyModel.js";
import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";
import mongoose from "mongoose";
dotenv.config();
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

import userModel from "../mongodb/models/userModel.js";

const getAllProperties = async (req, res) => {
  const {
    _end,
    _order,
    _start,
    _sort,
    title_like = "",
    propertyType = "",
  } = req.query;

  const query = {};
  if (propertyType !== "") {
    query.propertyType = propertyType;
  }

  if (title_like) {
    query.title = { $regex: title_like, $options: "i" };
  }
  try {
    const count = await propertyModel.countDocuments({ query });
    const properties = await propertyModel
      .find(query)
      .limit(_end)
      .skip(_start)
      .sort({ [_sort]: _order });

    res.header("x-total-count", count);
    res.header("Access-Control-Expose-Headers", "x-total-count");

    res.status(200).json(properties);
  } catch (err) {
    res.status(500).json({ message: err.message });
    console.log(err);
  }
};

const getPropertyDetail = async (req, res) => {
  const { id } = req.params;
  const propertyExists = await propertyModel
    .findOne({ _id: id })
    .populate("creator");

  if (propertyExists) {
    res.status(200).json(propertyExists);
  } else {
    res.status(404).json({ message: "property not found" });
  }
};

const createProperty = async (req, res) => {
  try {
    const { title, description, propertyType, location, price, photo, email } =
      req.body;

    /* start a new session */
    const session = await mongoose.startSession();
    session.startTransaction();
    const user = await userModel.findOne({ email });

    if (!user) throw new Error("User not Found");

    const photoUrl = await cloudinary.uploader.upload(photo);

    const newProperty = await propertyModel.create({
      title,
      description,
      propertyType,
      location,
      price,
      price,
      photo: photoUrl.url,
      creator: user._id,
    });

    user.allProperties.push(newProperty._id);
    await user.save({ session });

    await session.commitTransaction();

    res.status(200).json({ message: "property saved successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateProperty = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, propertyType, location, price, photo } =
      req.body;

    const photoUrl = await cloudinary.uploader.upload(photo);

    await propertyModel.findByIdAndUpdate(
      { _id: id },
      {
        title,
        description,
        propertyType,
        location,
        price,
        photo: photoUrl.url || photo,
      }
    );
    res.status(200).json({ message: "property updated Successfully" });
    console.log("property updated successfully");
  } catch (err) {
    res.status(500).json({ message: err.message });
    console.log(err);
  }
};

const deleteProperty = async (req, res) => {
  try {
    const { id } = req.params;
    const propertyToDelete = await propertyModel
      .findById({
        _id: id,
      })
      .populate("creator");

    if (!propertyToDelete) throw new Error("Property not found");

    const session = await mongoose.startSession();
    session.startTransaction();

    propertyToDelete.remove({ session });
    propertyToDelete.creator.allProperties.pull(propertyToDelete);

    await propertyToDelete.creator.save({ session });
    await session.commitTransaction();
    res.status(200).json({ message: "property Deleted successfully" });
  } catch (err) {
    res.status(500).json(erro);
    console.log(err);
  }
};

export {
  getAllProperties,
  getPropertyDetail,
  createProperty,
  updateProperty,
  deleteProperty,
};
