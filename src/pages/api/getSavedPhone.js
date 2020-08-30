module.exports = (req, res) => {
  console.log('getSavedPhone');
  res.json({
    message: 'success',
    data: {
      phone: '9988776655',
    },
  });
};
