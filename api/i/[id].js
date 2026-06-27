module.exports = async (req, res) => {
  const id = req.query.id || req.url.split('/').pop();
  if (!id || !global._imageCache || !global._imageCache[id]) {
    return res.status(404).send('Image not found');
  }

  const { image } = global._imageCache[id];
  const buf = Buffer.from(image.split(',')[1] || image, 'base64');
  res.setHeader('Content-Type', 'image/png');
  res.setHeader('Cache-Control', 'public, max-age=3600');
  res.send(buf);
};
