const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const sharp = require("sharp");
const jwt = require("jsonwebtoken");
const Task = require("./task");

const userSchema = new mongoose.Schema(
  {
    name: {
      required: true,
      type: String,
      lowercase: true,
      trim: true,
    },
    age: {
      default: 0,
      type: Number,
      validate(value) {
        if (value < 0) {
          throw new Error("Age must be a positive number!!");
        }
      },
    },
    password: {
      required: true,
      type: String,
      trim: true,
      validate(value) {
        if (value.length < 6) {
          throw new Error("Password must have at least 6 characters!");
        } else if (value.includes("password")) {
          throw new Error('Pasword cant contain "password" string');
        }
      },
    },
    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Email is invalid!");
        }
      },
    },
    tokens: [{ token: { type: String, required: true } }],
    avatar: {
      type: Buffer,
    },
  },

  {
    timestamps: true,
  }
);

userSchema.virtual("tasks", {
  ref: "Task",
  localField: "_id",
  foreignField: "owner",
});

userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_TOKEN);

  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
};

userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();

  delete userObject.password;
  delete userObject.tokens;
  delete userObject.avatar;

  return userObject;
};

userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("Nije dobro uopste");
  }
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Nije dobro uopste");
  }
  return user;
};

userSchema.pre("save", async function (next) {
  const user = this;

  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }

  next();
});

userSchema.pre("remove", async function (next) {
  const user = this;
  await Task.deleteMany({ owner: user._id });

  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
