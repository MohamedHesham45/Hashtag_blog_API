const { model, Schema } = require("mongoose");
const bcrypt = require("bcrypt");


const userSchema = new Schema({
    name:{
        type:String
    },
    email:{
        type:String
    },
    password:{
        type:String
    },
    image:{
      type: String, 
      default: "https://cdn-icons-png.flaticon.com/512/147/147144.png",
    }, 
    role: {
        type: String,
        default: "user",
      },
},
{
    timestamps: true,
    toJSON: {
        transform(doc, ret) {
          delete ret.password;
        },
      },
}
)
userSchema.pre("save", async function () {
    if (this.isModified("password")) {
      this.password = await bcrypt.hash(this.password, 10);
    }
  });

const User = model("User", userSchema);


module.exports = User;