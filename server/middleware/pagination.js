module.exports = function (req, res, next) {
  if (req.query.page_size && req.query.page_size.match(/^\d+$/)) {
    req.pagination = {
      page_number: req.query.page_number ? +req.query.page_number : 1,
      page_size: req.query.page_size ? +req.query.page_size : 10 //default page size
    };
  }
  next();
};