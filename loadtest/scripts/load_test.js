import http from 'k6/http';
import { sleep } from 'k6';

// Configuración de la prueba
export const options = {
  vus: 10,          // 10 usuarios concurrentes
  duration: '15s',  // 15 segundos
};

// Lista de cuentas simuladas
const accounts = ["acc_12345", "acc_67890", "acc_54321", "acc_98765"];

// Mapa global para almacenar messageIds generados (para duplicados)
const sentMessages = [];

// Función para generar un message_id único
function generateMessageId(vu, iter) {
  return `msg_${vu}_${iter}_${Math.random().toString(36).substring(2, 8)}`;
}

// Función para obtener un timestamp aleatorio en los últimos 5 días
function randomCreatedAt() {
  const now = Date.now();
  const fiveDaysAgo = now - 5 * 24 * 60 * 60 * 1000;
  const randomTime = Math.floor(Math.random() * (now - fiveDaysAgo)) + fiveDaysAgo;
  return new Date(randomTime).toISOString();
}

export default function () {
  const url = 'http://kafka-message-counter-api-gateway:8080/api/webhook/message';

  let messageId;
  const iter = __ITER;

  // Cada 10 mensajes, usar un message_id ya enviado (duplicado)
  if (iter % 10 === 0 && sentMessages.length > 0) {
    messageId = sentMessages[Math.floor(Math.random() * sentMessages.length)];
  } else {
    messageId = generateMessageId(__VU, iter);
    sentMessages.push(messageId);
  }

  const payload = JSON.stringify({
    message_id: messageId,
    account_id: accounts[Math.floor(Math.random() * accounts.length)], // selecciona cuenta aleatoria
    created_at: randomCreatedAt(),
    metadata: {
      channel: "whatsapp",
      source: "inbound",
      tags: ["camp:septiembre", "mx"]
    }
  });

  const params = { headers: { 'Content-Type': 'application/json' } };

  http.post(url, payload, params);

  sleep(0.1);
}

