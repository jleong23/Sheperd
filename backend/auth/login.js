export const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await pool.query(
    "SELECT id, password_hash FROM users WHERE email = $1",
    [email],
  );

  if (user.rows.length === 0) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const isValid = await bcrypt.compare(password, user.rows[0].password_hash);

  if (!isValid) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const token = jwt.sign({ userId: user.rows[0].id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  res.json({ token });
};
