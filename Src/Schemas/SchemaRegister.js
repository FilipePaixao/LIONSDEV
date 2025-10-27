import mongoose from "mongoose";

const SchemaRegister = new mongoose.Schema({
    Nome: {
        type: String,
        required: true
    },
    Email:{
        type: String,
        required: true,
        unique: true
    },
    Senha: {
        type: String,
        required: true
    },
    Role:{
        type: [String],
        enum: ["ADMIN", "USER"],
        default: "USER",
        required: true
    }
});

const RegisterUserMGS = mongoose.model("Register", SchemaRegister);

export default RegisterUserMGS;