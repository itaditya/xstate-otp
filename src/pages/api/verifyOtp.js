module.exports = (req, res) => {
  console.log('verifyOtp');
  const { otp } = req.body;
  setTimeout(() => {
    if (otp === '1111') {
      res.json({
        message: 'success',
      });
    } else {
      res.status(500).json({
        message: 'error',
      });
    }
  }, 800);
};
