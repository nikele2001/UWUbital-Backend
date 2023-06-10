require("dotenv").config();

const runUser = async (req, res, next) => {
  return res.status(201).json({ success: "fk u algo not up" });
};

module.exports = { runUser };
