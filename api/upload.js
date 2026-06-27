module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { image } = req.body;
  if (!image) {
    return res.status(400).json({ error: 'No image data' });
  }

  const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  const data = { id, image, createdAt: Date.now() };

  // Store in global cache (Vercel function - persists per instance for a while)
  if (!global._imageCache) global._imageCache = {};
  global._imageCache[id] = data;

  res.json({ url: `https://${req.headers.host}/api/i/${id}` });
};
