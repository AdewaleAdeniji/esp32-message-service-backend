exports.logAction = async (type, description) => {
  return await LogModel.create({
    type,
    description,
  });
};
