import Activity from "../models/Activity.js";
import Workspace from "../models/Workspace.js";
export const getWorkspaceActivity = async (req,res)=>{
  try{

    const {workspaceId} = req.params;

    const activity = await Activity.find({workspace:workspaceId})
      .sort({createdAt:-1})
      .limit(20);

    res.json(activity);

  }catch(err){
    res.status(500).json({message:"Failed to fetch activity"});
  }
};

export const clearWorkspaceActivity = async (req, res) => {
  try {

    const { workspaceId } = req.params;

    await Activity.deleteMany({ workspace: workspaceId });

    res.json({ message: "Activity cleared" });

  } catch (err) {
    res.status(500).json({ message: "Failed to clear activity" });
  }
};

export const getRecentActivity = async (req, res) => {
  try {
    const userId = req.user.id;

    // find all workspaces this user belongs to
    const userWorkspaces = await Workspace.find({
      $or: [
        { owner: userId },
        { "members.user": userId }
      ]
    }).select("_id");

    const workspaceIds = userWorkspaces.map((w) => w._id);

    const activity = await Activity.find({
      workspace: { $in: workspaceIds }
    })
      .populate("workspace", "name")
      .sort({ createdAt: -1 })
      .limit(15);

    res.json(activity);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch recent activity" });
  }
};