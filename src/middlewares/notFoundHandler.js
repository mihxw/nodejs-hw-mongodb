export const notFoundHandler = async (req, res, next) => {
  res.status(404).json({ status: 404, message: 'Not found', data: {} });
};