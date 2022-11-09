import { validationResult } from 'express-validator';

const validationErrorChecker = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return res.status(400).json({ result: 'error', reason: errors.errors[0].msg });
  }
  next();
};

export { validationErrorChecker };
