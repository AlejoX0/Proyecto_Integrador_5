-- ===============================================
-- FUNCIONES DE GESTIÓN Y USO DE HERRAMIENTAS
-- ===============================================

-- 🔹 Caso de uso: Crear herramienta
CREATE OR REPLACE FUNCTION crear_herramienta(
  p_nombre TEXT,
  p_tipo TEXT,
  p_descripcion TEXT,
  p_cantidad_disponible INT
) RETURNS JSON AS $$
DECLARE
  nueva JSON;
BEGIN
  INSERT INTO herramientas (nombre, tipo, descripcion, cantidad_disponible)
  VALUES (p_nombre, p_tipo, p_descripcion, p_cantidad_disponible)
  RETURNING row_to_json(herramientas.*) INTO nueva;
  RETURN nueva;
END;
$$ LANGUAGE plpgsql;

-- 🔹 Caso de uso: Obtener todas las herramientas
CREATE OR REPLACE FUNCTION obtener_herramientas()
RETURNS TABLE(
  id_herramienta INT,
  nombre TEXT,
  tipo TEXT,
  descripcion TEXT,
  cantidad_disponible INT
) AS $$
BEGIN
  RETURN QUERY
  SELECT h.id_herramienta, h.nombre, h.tipo, h.descripcion, h.cantidad_disponible
  FROM herramientas h
  ORDER BY h.id_herramienta;
END;
$$ LANGUAGE plpgsql;

-- 🔹 Caso de uso: Registrar uso de herramienta
CREATE OR REPLACE FUNCTION registrar_uso_herramienta(
  p_id_herramienta INT,
  p_id_usuario INT,
  p_id_brigada INT,
  p_cantidad_usada INT
) RETURNS JSON AS $$
DECLARE
  nuevo_uso JSON;
BEGIN
  INSERT INTO uso_herramientas (id_herramienta, id_usuario, id_brigada, cantidad_usada, fecha_uso)
  VALUES (p_id_herramienta, p_id_usuario, p_id_brigada, p_cantidad_usada, NOW())
  RETURNING row_to_json(uso_herramientas.*) INTO nuevo_uso;

  UPDATE herramientas
  SET cantidad_disponible = cantidad_disponible - p_cantidad_usada
  WHERE id_herramienta = p_id_herramienta;

  RETURN nuevo_uso;
END;
$$ LANGUAGE plpgsql;

-- 🔹 Caso de uso: Obtener uso de herramientas por brigada
CREATE OR REPLACE FUNCTION obtener_uso_por_brigada(p_id_brigada INT)
RETURNS TABLE(
  id_uso INT,
  id_herramienta INT,
  nombre_herramienta TEXT,
  id_usuario INT,
  cantidad_usada INT,
  fecha_uso TIMESTAMP
) AS $$
BEGIN
  RETURN QUERY
  SELECT u.id_uso, u.id_herramienta, h.nombre, u.id_usuario, u.cantidad_usada, u.fecha_uso
  FROM uso_herramientas u
  JOIN herramientas h ON u.id_herramienta = h.id_herramienta
  WHERE u.id_brigada = p_id_brigada
  ORDER BY u.fecha_uso DESC;
END;
$$ LANGUAGE plpgsql;
