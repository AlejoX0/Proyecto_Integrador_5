const axios = require('axios');
require('dotenv').config();

// Sincronizar usuario nuevo con base relacional (brigadas, usuario_brigada, etc.)
async function syncUserToPostgres(usuario) {
  try {
    const response = await axios.post(`${process.env.BRIGADAS_SERVICE_URL}/sync-user`, {
      id_usuario: usuario._id,
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      correo: usuario.correo,
      nro_documento: usuario.nro_documento,
      rol: usuario.rol
    });
    console.log('🔁 Usuario sincronizado con PostgreSQL:', response.data);
  } catch (err) {
    console.error('❌ Error sincronizando usuario con brigadas-service:', err.message);
  }
}

module.exports = { syncUserToPostgres };
