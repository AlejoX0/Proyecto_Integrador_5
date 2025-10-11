CREATE OR REPLACE FUNCTION sincronizar_usuario_desde_mongo(
  p_id_mongo TEXT,
  p_nro_documento BIGINT,
  p_nombre TEXT,
  p_apellido TEXT,
  p_correo TEXT,
  p_telefono TEXT,
  p_contrasena TEXT,
  p_rol TEXT
)
RETURNS VOID AS $$
BEGIN
  INSERT INTO usuario (id_usuario, id_mongo, nombre, apellido, correo, telefono, contrasena, rol)
  VALUES (p_nro_documento, p_id_mongo, p_nombre, p_apellido, p_correo, p_telefono, p_contrasena, p_rol)
  ON CONFLICT (id_mongo)
  DO UPDATE SET
    nombre = EXCLUDED.nombre,
    apellido = EXCLUDED.apellido,
    correo = EXCLUDED.correo,
    telefono = EXCLUDED.telefono,
    contrasena = EXCLUDED.contrasena,
    rol = EXCLUDED.rol;
END;
$$ LANGUAGE plpgsql;
