exports.sendOtp = async (req, res) => {
  console.log("otp sent");
  console.log(req.body);
  res.status(200);
};

exports.verifyOtp = async (req, res) => {
  console.log("otp verified");
  console.log(req.body);
  res.status(200);
};
