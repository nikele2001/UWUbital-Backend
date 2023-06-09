require("dotenv").config();

// import statements for models and object TODO

const getMyTasksUser = async (req, res, next) => {
  const { user_id } = req.body;
  if (!user_id) {
    return res.status(403).json({
      error: "user_id is required for getting your tasks!",
    });
  }
  try {
    // add gettask logic
  } catch (err) {
    return res.status(401).json({ error: err });
  }
};

module.exports = { getMyTasksUser };
