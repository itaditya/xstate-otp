let i = 1;

module.exports = (req, res) => {
  console.log('sendOtp');
  i += 1;
  setTimeout(() => {
    if (i % 2 === 0) {
      res.json({
        message: 'success',
        data: i,
      });
    } else {
      res.status(500).json({
        message: 'error',
      });
    }
  }, 600);
};
