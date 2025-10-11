-- ===============================================
-- FUNCIONES DE GESTIÓN Y USO DE HERRAMIENTAS
-- ===============================================

-- 🔹 Crear herramienta
CREATE OR REPLACE FUNCTION crear_herramienta(
  p_nombre TEXT,
  p_descripcion TEXT,
  p_cantidad_disponible INT DEFAULT 0
) RETURNS JSON AS $$
DECLARE
  nueva JSON;
BEGIN
  INSERT INTO herramienta(nombre, descripcion, cantidad_disponible)
  VALUES (p_nombre, p_descripcion, p_cantidad_disponible)
  RETURNING row_to_json(herramienta.*) INTO nueva;

  RETURN nueva;
END;
$$ LANGUAGE plpgsql;


-- 🔹 Obtener todas las herramientas
CREATE OR REPLACE FUNCTION obtener_herramientas()
RETURNS TABLE(
  id_herramienta INT,
  nombre TEXT,
  descripcion TEXT,
  cantidad_disponible INT
) AS $$
BEGIN
  RETURN QUERY
  SELECT h.id_herramienta, h.nombre, h.descripcion, h.cantidad_disponible
  FROM herramienta h
  ORDER BY h.id_herramienta;
END;
$$ LANGUAGE plpgsql;


-- 🔹 Registrar uso de herramienta
CREATE OR REPLACE FUNCTION registrar_uso_herramienta(
  p_id_herramienta INT,
  p_id_brigada INT,
  p_estado TEXT DEFAULT 'activo'
) RETURNS JSON AS $$
DECLARE
  nuevo_uso JSON;
BEGIN
  -- Verificar existencia de herramienta
  IF NOT EXISTS (SELECT 1 FROM herramienta WHERE id_herramienta = p_id_herramienta) THEN
    RAISE EXCEPTION 'La herramienta con ID % no existe', p_id_herramienta;
  END IF;

  -- Registrar uso
  INSERT INTO uso_herramienta (id_brigada, id_herramienta, fecha_uso, estado)
  VALUES (p_id_brigada, p_id_herramienta, CURRENT_DATE, p_estado)
  RETURNING row_to_json(uso_herramienta.*) INTO nuevo_uso;

  -- Disminuir cantidad disponible
  UPDATE herramienta
  SET cantidad_disponible = GREATEST(cantidad_disponible - 1, 0)
  WHERE id_herramienta = p_id_herramienta;

  RETURN nuevo_uso;
END;
$$ LANGUAGE plpgsql;


-- 🔹 Obtener uso de herramientas por brigada
CREATE OR REPLACE FUNCTION obtener_uso_por_brigada(p_id_brigada INT)
RETURNS TABLE(
  id_brigada INT,
  id_herramienta INT,
  nombre_herramienta TEXT,
  fecha_uso DATE,
  estado TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT u.id_brigada,
         u.id_herramienta,
         h.nombre AS nombre_herramienta,
         u.fecha_uso,
         u.estado
  FROM uso_herramienta u
  JOIN herramienta h ON u.id_herramienta = h.id_herramienta
  WHERE u.id_brigada = p_id_brigada
  ORDER BY u.fecha_uso DESC;
END;
$$ LANGUAGE plpgsql;
