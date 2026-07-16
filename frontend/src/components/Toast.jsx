import { useEffect, useState } from 'react';
import { FiCheckCircle, FiX, FiAlertCircle } from 'react-icons/fi';

let toastQueue = [];
let setToastFn = null;

export const toast = (message, type = 'success') => {
  if (setToastFn) setToastFn({ message, type, id: Date.now() });
};

export default function Toast() {
  const [current, setCurrent] = useState(null);

  useEffect(() => {
    setToastFn = setCurrent;
    return () => { setToastFn = null; };
  }, []);

  useEffect(() => {
    if (!current) return;
    const timer = setTimeout(() => setCurrent(null), 3200);
    return () => clearTimeout(timer);
  }, [current]);

  if (!current) return null;

  return (
    <div className={`toast toast--${current.type}`}>
      {current.type === 'success' ? <FiCheckCircle /> : <FiAlertCircle />}
      <span>{current.message}</span>
      <button className="toast__close" onClick={() => setCurrent(null)}>
        <FiX />
      </button>
    </div>
  );
}
