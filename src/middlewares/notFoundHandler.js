export const notFoundHandler = async (req, res, next) => {
  res
    .status(404)
    .json({ status: 404, message: 'Contact not found', data: err.message });
};