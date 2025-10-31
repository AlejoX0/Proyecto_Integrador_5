-- ====================================================
-- 🌿 FUNCIONES SQL PARA MICRO SERVICIO DE MUESTRAS
-- ====================================================
--------------------------------------------------------
-- ✅ 0. LIMPIEZA DE TABLAS MAL ESCRITAS
--------------------------------------------------------
DROP TABLE IF EXISTS muestra_bottanica CASCADE;


--------------------------------------------------------
-- ✅ 1. FUNCIONES EXISTENTES (TU CÓDIGO ORIGINAL)
--------------------------------------------------------

-- CU17 - Crear muestra
CREATE OR REPLACE FUNCTION crear_muestra(
  p_id_subparcela INT,
  p_tipo VARCHAR,
  p_cantidad NUMERIC,
  p_codigo_envio VARCHAR,
  p_estado_envio VARCHAR,
  p_fecha_recoleccion DATE,
  p_responsable INT
)
RETURNS VOID AS $$
BEGIN
  INSERT INTO muestra (id_subparcela, tipo, cantidad, codigo_envio, estado_envio, fecha_recoleccion, responsable)
  VALUES (p_id_subparcela, p_tipo, p_cantidad, p_codigo_envio, p_estado_envio, p_fecha_recoleccion, p_responsable);
END;
$$ LANGUAGE plpgsql;


-- Listar muestras
CREATE OR REPLACE FUNCTION listar_muestras()
RETURNS TABLE (
  id_muestra INT,
  tipo VARCHAR,
  cantidad NUMERIC,
  codigo_envio VARCHAR,
  estado_envio VARCHAR,
  fecha_recoleccion DATE,
  responsable INT
) AS $$
BEGIN
  RETURN QUERY SELECT id_muestra, tipo, cantidad, codigo_envio, estado_envio, fecha_recoleccion, responsable FROM muestra;
END;
$$ LANGUAGE plpgsql;


-- CU18a - Crear muestra botánica
CREATE OR REPLACE FUNCTION crear_muestra_botanica(
  p_id_muestra INT,
  p_id_especie INT,
  p_condicion VARCHAR,
  p_id_herbario INT,
  p_observaciones TEXT
)
RETURNS VOID AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM tbl_herbario WHERE id_herbario = p_id_herbario) THEN
    RAISE EXCEPTION 'El herbario con id % no existe', p_id_herbario;
  END IF;

  INSERT INTO muestra_botanica (
    id_muestra,
    id_especie,
    condicion,
    id_herbario,
    herbario_destino,
    observaciones
  )
  VALUES (
    p_id_muestra,
    p_id_especie,
    p_condicion,
    p_id_herbario,
    (SELECT nombre FROM tbl_herbario WHERE id_herbario = p_id_herbario),
    p_observaciones
  );
END;
$$ LANGUAGE plpgsql;


-- CU18b - Crear muestra de suelo
CREATE OR REPLACE FUNCTION crear_muestra_suelo(
  p_id_muestra INT,
  p_profundidad_inicio NUMERIC,
  p_profundidad_fin NUMERIC,
  p_peso_muestra NUMERIC,
  p_codigo_laboratorio VARCHAR,
  p_condiciones_transporte TEXT,
  p_id_laboratorio INT
)
RETURNS VOID AS $$
BEGIN
  INSERT INTO muestra_suelo (id_muestra, profundidad_inicio, profundidad_fin, peso_muestra, codigo_laboratorio, condiciones_transporte, id_laboratorio)
  VALUES (p_id_muestra, p_profundidad_inicio, p_profundidad_fin, p_peso_muestra, p_codigo_laboratorio, p_condiciones_transporte, p_id_laboratorio);
END;
$$ LANGUAGE plpgsql;


-- CU18c - Crear muestra de detrito
CREATE OR REPLACE FUNCTION crear_muestra_detrito(
  p_id_muestra INT,
  p_diametro NUMERIC,
  p_longitud NUMERIC,
  p_peso NUMERIC,
  p_estado_descomposicion VARCHAR,
  p_uso VARCHAR
)
RETURNS VOID AS $$
BEGIN
  INSERT INTO muestra_detrito (id_muestra, diametro, longitud, peso, estado_descomposicion, uso)
  VALUES (p_id_muestra, p_diametro, p_longitud, p_peso, p_estado_descomposicion, p_uso);
END;
$$ LANGUAGE plpgsql;


--------------------------------------------------------
-- ✅ 2. ELIMINAR TRIGGERS Y FUNCIONES VIEJAS
--------------------------------------------------------

DROP TRIGGER IF EXISTS trg_validar_tipo_muestra_botanica ON muestra_botanica;
DROP TRIGGER IF EXISTS trg_validar_tipo_muestra_suelo ON muestra_suelo;
DROP TRIGGER IF EXISTS trg_validar_tipo_muestra_detrito ON muestra_detrito;

DROP FUNCTION IF EXISTS validar_tipo_muestra_botanica() CASCADE;
DROP FUNCTION IF EXISTS validar_tipo_muestra_suelo() CASCADE;
DROP FUNCTION IF EXISTS validar_tipo_muestra_detrito() CASCADE;


--------------------------------------------------------
-- ✅ 3. NUEVAS VALIDACIONES POR TIPO
--------------------------------------------------------

-- 🌿 Validar botánica
CREATE OR REPLACE FUNCTION validar_tipo_muestra_botanica()
RETURNS TRIGGER AS $$
DECLARE tipo_muestra VARCHAR(20);
BEGIN
  SELECT tipo INTO tipo_muestra FROM muestra WHERE id_muestra = NEW.id_muestra;
  IF tipo_muestra <> 'botanica' THEN
    RAISE EXCEPTION 'Solo muestras tipo botanica pueden insertarse aquí. Actual: %', tipo_muestra;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_validar_tipo_muestra_botanica
BEFORE INSERT OR UPDATE ON muestra_botanica
FOR EACH ROW EXECUTE FUNCTION validar_tipo_muestra_botanica();


-- 🌎 Validar suelo
CREATE OR REPLACE FUNCTION validar_tipo_muestra_suelo()
RETURNS TRIGGER AS $$
DECLARE tipo_muestra VARCHAR(20);
BEGIN
  SELECT tipo INTO tipo_muestra FROM muestra WHERE id_muestra = NEW.id_muestra;
  IF tipo_muestra <> 'suelo' THEN
    RAISE EXCEPTION 'Solo muestras tipo suelo pueden insertarse aquí. Actual: %', tipo_muestra;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_validar_tipo_muestra_suelo
BEFORE INSERT OR UPDATE ON muestra_suelo
FOR EACH ROW EXECUTE FUNCTION validar_tipo_muestra_suelo();


-- 🍂 Validar detrito
CREATE OR REPLACE FUNCTION validar_tipo_muestra_detrito()
RETURNS TRIGGER AS $$
DECLARE tipo_muestra VARCHAR(20);
BEGIN
  SELECT tipo INTO tipo_muestra FROM muestra WHERE id_muestra = NEW.id_muestra;
  IF tipo_muestra <> 'detrito' THEN
    RAISE EXCEPTION 'Solo muestras tipo detrito pueden insertarse aquí. Actual: %', tipo_muestra;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_validar_tipo_muestra_detrito
BEFORE INSERT OR UPDATE ON muestra_detrito
FOR EACH ROW EXECUTE FUNCTION validar_tipo_muestra_detrito();


--------------------------------------------------------
-- ✅ 4. RESTRICCIONES UNIQUE COMPATIBLES CON NEON
--------------------------------------------------------

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'unica_muestra_botanica') THEN
    ALTER TABLE muestra_botanica
      ADD CONSTRAINT unica_muestra_botanica UNIQUE (id_muestra);
  END IF;
END$$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'unica_muestra_suelo') THEN
    ALTER TABLE muestra_suelo
      ADD CONSTRAINT unica_muestra_suelo UNIQUE (id_muestra);
  END IF;
END$$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'unica_muestra_detrito') THEN
    ALTER TABLE muestra_detrito
      ADD CONSTRAINT unica_muestra_detrito UNIQUE (id_muestra);
  END IF;
END$$;


-- ====================================================
-- 📦 CU19a - Actualizar envío
-- ====================================================
CREATE OR REPLACE FUNCTION actualizar_envio(p_id_muestra INT, p_codigo_herbario VARCHAR)
RETURNS VOID AS $$
BEGIN
  UPDATE muestra
  SET estado_envio = 'enviada',
      fecha_envio = CURRENT_DATE,
      codigo_herbario = p_codigo_herbario
  WHERE id_muestra = p_id_muestra;
END;
$$ LANGUAGE plpgsql;

-- ====================================================
-- 📬 CU19b - Registrar recepción
-- ====================================================
CREATE OR REPLACE FUNCTION registrar_recepcion(p_id_muestra INT)
RETURNS VOID AS $$
BEGIN
  UPDATE muestra
  SET estado_envio = 'recibida',
      fecha_recepcion = CURRENT_DATE
  WHERE id_muestra = p_id_muestra;
END;
$$ LANGUAGE plpgsql;

-- ====================================================
-- 🌿 CU15 - Listar herbarios
-- ====================================================
CREATE OR REPLACE FUNCTION listar_herbarios()
RETURNS TABLE (
  id_herbario INT,
  sigla VARCHAR,
  nombre VARCHAR,
  institucion VARCHAR,
  region VARCHAR,
  ubicacion VARCHAR,
  correo VARCHAR,
  estado BOOLEAN
) AS $$
BEGIN
  RETURN QUERY 
  SELECT 
    h.id_herbario, 
    h.sigla, 
    h.nombre, 
    h.institucion, 
    h.region, 
    h.ubicacion, 
    h.correo, 
    h.estado
  FROM tbl_herbario h;
END;
$$ LANGUAGE plpgsql;


-- ====================================================
-- 🧪 CU20 - Listar laboratorios
-- ====================================================
-- ====================================================
-- 🧪 CU20 - Listar laboratorios
-- ====================================================
CREATE OR REPLACE FUNCTION listar_laboratorios()
RETURNS TABLE (
  id_laboratorio INT,
  sigla VARCHAR,
  nombre VARCHAR,
  institucion VARCHAR,
  region VARCHAR,
  ubicacion VARCHAR,
  correo VARCHAR,
  estado BOOLEAN
) AS $$
BEGIN
  RETURN QUERY 
  SELECT 
    l.id_laboratorio, 
    l.sigla, 
    l.nombre, 
    l.institucion, 
    l.region, 
    l.ubicacion, 
    l.correo, 
    l.estado
  FROM laboratorio l;
END;
$$ LANGUAGE plpgsql;


-- ====================================================
-- 🧩 CRUD ADMIN - HERBARIO
-- ====================================================
CREATE OR REPLACE FUNCTION crear_herbario(
  p_sigla VARCHAR,
  p_nombre VARCHAR,
  p_institucion VARCHAR,
  p_region VARCHAR,
  p_ubicacion VARCHAR,
  p_correo VARCHAR
)
RETURNS VOID AS $$
BEGIN
  INSERT INTO herbario (sigla, nombre, institucion, region, ubicacion, correo)
  VALUES (p_sigla, p_nombre, p_institucion, p_region, p_ubicacion, p_correo);
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION actualizar_herbario(
  p_id_herbario INT,
  p_sigla VARCHAR,
  p_nombre VARCHAR,
  p_institucion VARCHAR,
  p_region VARCHAR,
  p_ubicacion VARCHAR,
  p_correo VARCHAR,
  p_estado BOOLEAN
)
RETURNS VOID AS $$
BEGIN
  UPDATE herbario
  SET sigla = p_sigla,
      nombre = p_nombre,
      institucion = p_institucion,
      region = p_region,
      ubicacion = p_ubicacion,
      correo = p_correo,
      estado = p_estado
  WHERE id_herbario = p_id_herbario;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION eliminar_herbario(p_id_herbario INT)
RETURNS VOID AS $$
BEGIN
  DELETE FROM herbario WHERE id_herbario = p_id_herbario;
END;
$$ LANGUAGE plpgsql;

-- ====================================================
-- 🧩 CRUD ADMIN - LABORATORIO
-- ====================================================
CREATE OR REPLACE FUNCTION crear_laboratorio(
  p_sigla VARCHAR,
  p_nombre VARCHAR,
  p_institucion VARCHAR,
  p_region VARCHAR,
  p_ubicacion VARCHAR,
  p_correo VARCHAR
)
RETURNS VOID AS $$
BEGIN
  INSERT INTO laboratorio (sigla, nombre, institucion, region, ubicacion, correo)
  VALUES (p_sigla, p_nombre, p_institucion, p_region, p_ubicacion, p_correo);
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION actualizar_laboratorio(
  p_id_laboratorio INT,
  p_sigla VARCHAR,
  p_nombre VARCHAR,
  p_institucion VARCHAR,
  p_region VARCHAR,
  p_ubicacion VARCHAR,
  p_correo VARCHAR,
  p_estado BOOLEAN
)
RETURNS VOID AS $$
BEGIN
  UPDATE laboratorio
  SET sigla = p_sigla,
      nombre = p_nombre,
      institucion = p_institucion,
      region = p_region,
      ubicacion = p_ubicacion,
      correo = p_correo,
      estado = p_estado
  WHERE id_laboratorio = p_id_laboratorio;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION eliminar_laboratorio(p_id_laboratorio INT)
RETURNS VOID AS $$
BEGIN
  DELETE FROM laboratorio WHERE id_laboratorio = p_id_laboratorio;
END;
$$ LANGUAGE plpgsql;
