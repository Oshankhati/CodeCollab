import mongoose from "mongoose";

const activitySchema = new mongoose.Schema(
{
  workspace:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Workspace",
    required:true
  },

  user:{
    type:String,
    required:true
  },

  action:{
    type:String,
    enum:["create","edit","rename","delete"],
    required:true
  },

  file:{
    type:String,
    required:true
  }

},
{timestamps:true}
);

export default mongoose.model("Activity",activitySchema);