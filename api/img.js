module.exports = async (req, res) => {
  // GET /api/img?id=xxx — serve stored image
  if (req.method === 'GET' && req.query.id) {
    const { id } = req.query;
    if (!global._imgCache || !global._imgCache[id]) {
      return res.status(404).send('Image not found');
    }
    const { image } = global._imgCache[id];
    const buf = Buffer.from(image.split(',')[1] || image, 'base64');
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Cache-Control', 'public, max-age=86400');
    return res.send(buf);
  }

  // POST /api/img — upload image, return URL
  if (req.method === 'POST') {
    const { image } = req.body;
    if (!image) {
      return res.status(400).json({ error: 'No image data' });
    }
    const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
    if (!global._imgCache) global._imgCache = {};
    global._imgCache[id] = { image, createdAt: Date.now() };
    return res.json({ url: `https://${req.headers.host}/api/img?id=${id}` });
  }

  res.status(405).json({ error: 'Method not allowed' });
};
