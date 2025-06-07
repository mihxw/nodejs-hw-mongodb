export const errorHandler = (error, req, res, next) => {
  const { status = 500, message = 'Server error', data = null } = error;
  res.status(status).json({
    status,
    message,
    data,
  });
};