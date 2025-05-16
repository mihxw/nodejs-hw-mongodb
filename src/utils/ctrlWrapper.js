export const ctrlWrapper = async (controler) => {
  return async (req, res, next) => {
    try {
      await controler(req, res, next);
    } catch (error) {
      next(error);
    }
  };
};