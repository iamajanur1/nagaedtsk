function validEmail(email) {
  if (typeof email !== 'string') return false;

  const value = email.trim();
  return value.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function validateRegistration(data) {
  const { username, email, password, address } = data || {};

  if (typeof username !== 'string' || !/^[a-zA-Z0-9_]{3,40}$/.test(username.trim())) {
    return 'Username must be 3–40 characters (letters, numbers, underscores)';
  }
  if (!validEmail(email)) {
    return 'A valid email address is required';
  }
  if (typeof password !== 'string' || password.length < 8 || Buffer.byteLength(password, 'utf8') > 72) {
    return 'Password must be at least 8 characters and no more than 72 bytes';
  }
  if (typeof address !== 'string' || address.trim().length < 5 || address.trim().length > 255) {
    return 'Address must be between 5 and 255 characters';
  }
  return null;
}

function validateLogin(data) {
  const { email, password } = data || {};

  if (!validEmail(email)) {
    return 'A valid email address is required';
  }
  if (typeof password !== 'string' || password.length === 0) {
    return 'Password is required';
  }
  return null;
}

module.exports = { validateRegistration, validateLogin };
