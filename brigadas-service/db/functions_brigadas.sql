-- ===============================================
-- FUNCIONES Y PROCEDIMIENTOS PARA GESTIONAR BRIGADAS
-- ===============================================

-- 🔹 Borrar versiones antiguas
DROP FUNCTION IF EXISTS crear_brigada(VARCHAR, DATE, INT, INT);
DROP FUNCTION IF EXISTS asignar_conglomerado_a_brigada(INT, INT);
DROP FUNCTION IF EXISTS listar_brigadas();

-- ==========================================================
-- 🔹 Caso de uso: Crear brigada (Actor: Administrador)
-- ==========================================================
CREATE OR REPLACE FUNCTION crear_brigada(
    p_departamento VARCHAR,
    p_fecha_asignacion DATE,
    p_id_conglomerado INT,
    p_lider INT
)
RETURNS VOID AS $$
BEGIN
    INSERT INTO brigada (departamento, fecha_asignacion, id_conglomerado, lider)
    VALUES (p_departamento, p_fecha_asignacion, p_id_conglomerado, p_lider);
END;
$$ LANGUAGE plpgsql;

-- ==========================================================
-- 🔹 Caso de uso: Asignar conglomerado a brigada
-- ==========================================================
CREATE OR REPLACE FUNCTION asignar_conglomerado_a_brigada(
    p_id_brigada INT,
    p_id_conglomerado INT
)
RETURNS VOID AS $$
BEGIN
    UPDATE brigada
    SET id_conglomerado = p_id_conglomerado
    WHERE id_brigada = p_id_brigada;
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
