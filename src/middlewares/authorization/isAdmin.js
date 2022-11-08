const isAdmin = (req, res, next) => {
  req.currentUserRole === 'admin'
    ? next()
    : res
        .status(403)
        .json({ result: 'forbidden-approach', message: '요청을 처리할 권한이 없습니다.' });
};

export { isAdmin };
