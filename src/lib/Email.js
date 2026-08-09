
const express = require('express');
const router = express.Router();
const axios = require('axios');

router.post('/', async (req, res) => {
  try {
    const { email } = req.body;
    
    // Вызов внешнего API (замените на ваш API)
    const response = await axios.get('https://haveibeenpwned.com/api/v3/breachedaccount/' + email, {
      headers: {
        'hibp-api-key': process.env.HIBP_API_KEY,
        'user-agent': 'YourAppName'
      }
    });

    if (response.status === 200) {
      return res.json({
        valid: true,
        message: 'Email найден в утечках данных'
      });
    }

    if (response.status === 404) {
      return res.json({
        valid: true,
        message: 'Email чист'
      });
    }

    res.status(response.status).json({
      valid: false,
      message: 'Ошибка проверки'
    });

  } catch (error) {
    res.status(500).json({
      valid: false,
      message: 'Ошибка при проверке email'
    });
  }
});

module.exports = router;
