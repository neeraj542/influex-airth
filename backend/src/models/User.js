const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

/**
 * User Schema for MongoDB using Mongoose.
 * 
 * This schema defines the structure of the `User` model, including fields for
 * the user's name, email, and hashed password. It also includes middleware for
 * password hashing and a method for password comparison.
 */
const userSchema = new mongoose.Schema({
  /**
   * The name of the user.
   * @type {String}
   * @required
   */
  name: { type: String, required: true },

  /**
   * The email address of the user.
   * Must be unique.
   * @type {String}
   * @required
   * @unique
   */
  email: { type: String, required: true, unique: true },

  /**
   * The hashed password of the user.
   * @type {String}
   * @required
   */
  password: { type: String, required: true },
});

/**
 * Middleware to hash the user's password before saving it to the database.
 * 
 * This runs automatically before the `save` operation. If the password field
 * has not been modified, it skips the hashing process.
 * 
 * @param {Function} next - Callback to proceed to the next middleware.
 */
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next(); // Skip hashing if password is not modified
  const salt = await bcrypt.genSalt(10); // Generate a salt with 10 rounds
  this.password = await bcrypt.hash(this.password, salt); // Hash the password
  next();
});

/**
 * Method to compare a plain text password with the hashed password in the database.
 * 
 * @param {String} password - The plain text password to compare.
 * @returns {Promise<Boolean>} - Returns `true` if passwords match, otherwise `false`.
 */
userSchema.methods.matchPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

/**
 * User model based on the user schema.
 * 
 * @type {mongoose.Model}
 */
module.exports = mongoose.model('User', userSchema);
