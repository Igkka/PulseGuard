import { useState, useEffect } from 'react';
import axios from 'axios';
import "@/lib/Email.js"

const EmailValidator = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle | checking | valid | invalid
  const [message, setMessage] = useState('');
  
  // Функция для проверки формата email
  const isValidFormat = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
  };

  // Обработка ввода email
  const handleChange = (e) => {
    setEmail(e.target.value);
    setStatus('idle');
    setMessage('');
  };

  // Проверка через API
  const validateEmail = async () => {
    if (!isValidFormat(email)) {
      setStatus('invalid');
      setMessage('Некорректный формат email');
      return;
    }

    setStatus('checking');
    setMessage('Проверяем...');

    try {
      const response = await axios.post('/api/validate-email', { email });
      
      if (response.data.valid) {
        setStatus('valid');
        setMessage('');
      } else {
        setStatus('invalid');
        setMessage(response.data.message || 'Email не прошел проверку');
      }
    } catch (error) {
      setStatus('error');
      setMessage('Ошибка при проверке email');
    }
  };

  return (
    <div>
      <input 
        type="email" 
        value={email} 
        onChange={handleChange} 
        disabled={status === 'checking'}
      />
      <button onClick={validateEmail} disabled={!email || status === 'checking'}>
        Проверить
      </button>
      
      {status === 'valid' && <div className="success">Email валиден</div>}
      {status === 'invalid' && <div className="error">{message}</div>}
      {status === 'checking' && <div>Проверка...</div>}
    </div>
  );
};

export default EmailValidator;
