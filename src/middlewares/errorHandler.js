import { HttpError } from 'http-errors';

export const errorHandler = (err, req, res, next) => {
  console.error('Error in PATCH request:', err);
  if (err instanceof HttpError) {
    res
      .status(err.status)
      .json({ status: err.status, message: err.name, error: err.message });
  }

  res.status(500).json({
    status: 500,
    message: 'Someth',
    data: err.message,
  });
};

export const notFoundHandler = (req, res, next) => {
  res.status(404).json({
    message: 'Route not found',
  });
};