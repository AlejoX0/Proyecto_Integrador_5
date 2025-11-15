-- ===============================================
-- FUNCIONES Y PROCEDIMIENTOS PARA GESTIONAR BRIGADAS
-- ===============================================

-- 🔹 Borrar versiones antiguas
DROP FUNCTION IF EXISTS crear_brigada(VARCHAR, DATE, INT, INT);
DROP FUNCTION IF EXISTS asignar_conglomerado_a_brigada(INT, INT);
DROP FUNCTION IF EXISTS listar_brigadas();

CREATE OR REPLACE FUNCTION crear_brigada(
    p_departamento VARCHAR,
    p_fecha_asignacion DATE,
    p_id_conglomerado INT,
    p_lider INT
)
RETURNS VOID AS $$
DECLARE
    v_dep_lider VARCHAR;
    v_region_conglomerado VARCHAR;
BEGIN
    -- =======================================
    -- 1️⃣ Validar que el líder no esté ya asignado a otra brigada
    -- =======================================
    IF EXISTS (
        SELECT 1 FROM brigada
        WHERE lider = p_lider
    ) THEN
        RAISE EXCEPTION 
            'El líder con ID % ya está asignado a otra brigada.', p_lider;
    END IF;

    -- =======================================
    -- 2️⃣ Obtener departamento del líder
    -- =======================================
    SELECT departamento INTO v_dep_lider
    FROM usuario
    WHERE id_usuario = p_lider;

    IF v_dep_lider IS NULL THEN
        RAISE EXCEPTION 'El líder con ID % no existe.', p_lider;
    END IF;

    -- =======================================
    -- 3️⃣ Obtener región del conglomerado
    -- =======================================
    SELECT ubicacion->>'region' INTO v_region_conglomerado
    FROM conglomerado
    WHERE id_conglomerado = p_id_conglomerado;

    IF v_region_conglomerado IS NULL THEN
        RAISE EXCEPTION 
            'El conglomerado con ID % no existe o no tiene región en su JSON.',
            p_id_conglomerado;
    END IF;

    -- =======================================
    -- 4️⃣ Validar coincidencia de los 3 departamentos
    -- =======================================
    IF v_region_conglomerado <> v_dep_lider
        OR v_region_conglomerado <> p_departamento THEN

        RAISE EXCEPTION
            'No coinciden los departamentos: líder=%, brigada=%, conglomerado=%.',
            v_dep_lider, p_departamento, v_region_conglomerado;
    END IF;

    -- =======================================
    -- 5️⃣ Crear la brigada
    -- =======================================
    INSERT INTO brigada (departamento, fecha_asignacion, id_conglomerado, lider)
    VALUES (p_departamento, p_fecha_asignacion, p_id_conglomerado, p_lider);

    -- =======================================
    -- 6️⃣ Actualizar estado del líder
    -- =======================================
    UPDATE usuario
    SET estado = 'asignado'
    WHERE id_usuario = p_lider;

    -- =======================================
    -- 7️⃣ Actualizar estado del conglomerado
    -- =======================================
    UPDATE conglomerado
    SET estado = 'en proceso'
    WHERE id_conglomerado = p_id_conglomerado;

END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION asignar_conglomerado_a_brigada(
    p_id_brigada INT,
    p_id_conglomerado INT
)
RETURNS VOID AS $$
DECLARE
    v_lider INT;
    v_dep_lider VARCHAR;
    v_dep_brigada VARCHAR;
    v_region_conglomerado VARCHAR;
    v_estado_conglomerado VARCHAR;
BEGIN
    -- =======================================
    -- 1️⃣ Verificar existencia de la brigada
    -- =======================================
    SELECT lider, departamento INTO v_lider, v_dep_brigada
    FROM brigada
    WHERE id_brigada = p_id_brigada;

    IF v_lider IS NULL THEN
        RAISE EXCEPTION 
            'La brigada con ID % no existe.', p_id_brigada;
    END IF;

    -- =======================================
    -- 2️⃣ Validar que el líder no esté en otra brigada
    -- =======================================
    IF EXISTS (
        SELECT 1 FROM brigada
        WHERE lider = v_lider
        AND id_brigada <> p_id_brigada
    ) THEN
        RAISE EXCEPTION 
            'El líder con ID % ya está asignado a otra brigada.', v_lider;
    END IF;

    -- =======================================
    -- 3️⃣ Obtener departamento del líder
    -- =======================================
    SELECT departamento INTO v_dep_lider
    FROM usuario
    WHERE id_usuario = v_lider;

    -- =======================================
    -- 4️⃣ Obtener datos del conglomerado
    -- =======================================
    SELECT 
        ubicacion->>'region',
        estado
    INTO
        v_region_conglomerado,
        v_estado_conglomerado
    FROM conglomerado
    WHERE id_conglomerado = p_id_conglomerado;

    IF v_region_conglomerado IS NULL THEN
        RAISE EXCEPTION 
            'El conglomerado con ID % no existe o no tiene región en su JSON.',
            p_id_conglomerado;
    END IF;

    -- =======================================
    -- 5️⃣ Validar que el conglomerado esté disponible
    -- =======================================
    IF v_estado_conglomerado <> 'pendiente' THEN
        RAISE EXCEPTION 
            'El conglomerado con ID % no está disponible. Estado actual: %.',
            p_id_conglomerado, v_estado_conglomerado;
    END IF;

    -- =======================================
    -- 6️⃣ Validar consistencia de departamentos
    -- =======================================
    IF v_region_conglomerado <> v_dep_lider
        OR v_region_conglomerado <> v_dep_brigada THEN

        RAISE EXCEPTION
            'No coinciden los departamentos: líder=%, brigada=%, conglomerado=%.',
            v_dep_lider, v_dep_brigada, v_region_conglomerado;
    END IF;

    -- =======================================
    -- 7️⃣ Actualizar la brigada
    -- =======================================
    UPDATE brigada
    SET id_conglomerado = p_id_conglomerado
    WHERE id_brigada = p_id_brigada;

    -- =======================================
    -- 8️⃣ Cambiar estado del conglomerado
    -- =======================================
    UPDATE conglomerado
    SET estado = 'en proceso'
    WHERE id_conglomerado = p_id_conglomerado;

END;
$$ LANGUAGE plpgsql;


-- ==========================================================
-- 🔹 Caso de uso: Listar brigadas
-- ==========================================================
CREATE OR REPLACE FUNCTION listar_brigadas()
RETURNS TABLE (
    id_brigada INT,
    departamento TEXT,
    fecha_asignacion DATE,
    lider_nombre TEXT,
    conglomerado_codigo TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        b.id_brigada, 
        b.departamento::TEXT,
        b.fecha_asignacion, 
        CONCAT(u.nombre, ' ', u.apellido)::TEXT AS lider_nombre,
        c.codigo::TEXT AS conglomerado_codigo
    FROM brigada b
    LEFT JOIN usuario u ON b.lider = u.id_usuario
    LEFT JOIN conglomerado c ON b.id_conglomerado = c.id_conglomerado;
END;
$$ LANGUAGE plpgsql;
