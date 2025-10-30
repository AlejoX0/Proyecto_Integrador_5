-- ====================================================
-- 🌿 FUNCIONES SQL PARA MICRO SERVICIO INDIVIDUOS Y ESPECIES
-- ====================================================

-- ====================================================
-- CU14 - Crear individuo
-- ====================================================
CREATE OR REPLACE FUNCTION crear_individuo(
  p_id_subparcela INT,
  p_id_especie INT,
  p_diametro NUMERIC,
  p_altura NUMERIC,
  p_estado TEXT,
  p_observaciones TEXT
)
RETURNS VOID AS $$
BEGIN
  INSERT INTO individuo (id_subparcela, id_especie, diametro, altura, estado, observaciones)
  VALUES (p_id_subparcela, p_id_especie, p_diametro, p_altura, p_estado, p_observaciones);
END;
$$ LANGUAGE plpgsql;

-- ====================================================
-- CU16 - Consultar individuos por subparcela
-- ====================================================

-- Eliminamos la versión anterior (por si existe en caché)
DROP FUNCTION IF EXISTS listar_individuos_por_subparcela(INT);

-- Recreamos la función corregida
CREATE OR REPLACE FUNCTION listar_individuos_por_subparcela(p_id_subparcela INT)
RETURNS TABLE (
  id_individuo INT,
  id_subparcela INT,
  especie TEXT,
  diametro NUMERIC(5,2),
  altura NUMERIC(5,2),
  estado VARCHAR(50),
  observaciones TEXT
) 
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    i.id_individuo,
    i.id_subparcela,
    e.nombre_cientifico::TEXT AS especie,   -- 🔹 Conversión explícita a TEXT
    i.diametro,
    i.altura,
    i.estado,
    i.observaciones
  FROM individuo i
  JOIN especie e ON e.id_especie = i.id_especie
  WHERE i.id_subparcela = p_id_subparcela
  ORDER BY i.id_individuo;
END;
$$ LANGUAGE plpgsql;


-- ====================================================
-- 🔁 Actualizar individuo (CU nuevo)
-- ====================================================
CREATE OR REPLACE FUNCTION actualizar_individuo(
  p_id_individuo INT,
  p_id_especie INT,
  p_diametro NUMERIC,
  p_altura NUMERIC,
  p_estado TEXT,
  p_observaciones TEXT
)
RETURNS VOID AS $$
BEGIN
  UPDATE individuo
  SET id_especie = p_id_especie,
      diametro = p_diametro,
      altura = p_altura,
      estado = p_estado,
      observaciones = p_observaciones
  WHERE id_individuo = p_id_individuo;
END;
$$ LANGUAGE plpgsql;

-- ====================================================
-- ❌ Eliminar individuo (solo Admin)
-- ====================================================
CREATE OR REPLACE FUNCTION eliminar_individuo(p_id_individuo INT)
RETURNS VOID AS $$
BEGIN
  DELETE FROM individuo WHERE id_individuo = p_id_individuo;
END;
$$ LANGUAGE plpgsql;

-- ====================================================
-- 🌿 Crear especie (CU15)
-- ====================================================
CREATE OR REPLACE FUNCTION crear_especie(
  p_nombre_cientifico TEXT,
  p_nombre_comun TEXT,
  p_estado_conservacion TEXT,
  p_uso TEXT
)
RETURNS VOID AS $$
BEGIN
  INSERT INTO especie (nombre_cientifico, nombre_comun, estado_conservacion, uso)
  VALUES (p_nombre_cientifico, p_nombre_comun, p_estado_conservacion, p_uso);
END;
$$ LANGUAGE plpgsql;

-- ====================================================
-- 📖 Listar especies
-- ====================================================
-- ====================================================
-- 🌿 CU15 - Listar especies (corregida y funcional)
-- ====================================================

DROP FUNCTION IF EXISTS listar_especies();

CREATE OR REPLACE FUNCTION listar_especies()
RETURNS TABLE (
  id_especie INT,
  nombre_cientifico TEXT,
  nombre_comun TEXT,
  estado_conservacion TEXT,
  uso TEXT
)
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    e.id_especie,
    e.nombre_cientifico::TEXT,
    e.nombre_comun::TEXT,
    e.estado_conservacion::TEXT,
    e.uso::TEXT
  FROM especie e
  ORDER BY e.id_especie;
END;
$$ LANGUAGE plpgsql;


-- ====================================================
-- ✏️ Actualizar especie
-- ====================================================
CREATE OR REPLACE FUNCTION actualizar_especie(
  p_id_especie INT,
  p_nombre_cientifico TEXT,
  p_nombre_comun TEXT,
  p_estado_conservacion TEXT,
  p_uso TEXT
)
RETURNS VOID AS $$
BEGIN
  UPDATE especie
  SET nombre_cientifico = p_nombre_cientifico,
      nombre_comun = p_nombre_comun,
      estado_conservacion = p_estado_conservacion,
      uso = p_uso
  WHERE id_especie = p_id_especie;
END;
$$ LANGUAGE plpgsql;

-- ====================================================
-- ❌ Eliminar especie
-- ====================================================
CREATE OR REPLACE FUNCTION eliminar_especie(p_id_especie INT)
RETURNS VOID AS $$
BEGIN
  DELETE FROM especie WHERE id_especie = p_id_especie;
END;
$$ LANGUAGE plpgsql;
