import { Schema, model } from "mongoose";

const contactSchema = new Schema({
name:{
    type:String,
    required: true,
},
phoneNumber:{
    type: String,
    required:true,
},
 email:{
    type: String,
    required:false,
},
isFavourite:{
    type: Boolean,
    default:false,
},
contactType:{
    type:String,
    enum:["work", "home", "personal"],
    required:true,
    default: "personal",
},

},
{
    timestamps:true,
    versionKey: false,
},)
const ContactCollection = model("contact", contactSchema);
export default  ContactCollection;



// Для автоматичного створення полів createdAt та updatedAt, можна використати параметр timestamps: true при створенні моделі. Це додає до об'єкту два поля: createdAt (дата створення) та updatedAt (дата оновлення), і їх не потрібно додавати вручну.