const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is require"],
      minLength: [3, "Username must be atleast 3 character long"],
      unique: true,
    },
    passwordHash: { type: String, required: true },
    refreshTokens: [{ tokenHash: String, createdAt: Date, expiredAt: Date }],
  },
  { timestamps: true },
);

userSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.passwordHash;
  },
});

module.exports = mongoose.model("User", userSchema);
