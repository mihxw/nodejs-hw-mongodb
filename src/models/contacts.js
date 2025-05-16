import mongoose from "mongoose";

const contactSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  favorite: Boolean,
});

const Contact = mongoose.model("Contact", contactSchema);

export default Contact;  // <--- саме default export