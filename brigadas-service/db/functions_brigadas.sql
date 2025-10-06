-- ===============================================
-- FUNCIONES Y PROCEDIMIENTOS PARA GESTIONAR BRIGADAS
-- ===============================================

-- 🔹 Caso de uso: Crear brigada (Actor: Administrador)
CREATE OR REPLACE FUNCTION crear_brigada(
    p_nombre VARCHAR,
    p_fecha_asignacion DATE,
    p_id_conglomerado INT,
    p_lider INT
)
RETURNS VOID AS $$
BEGIN
    INSERT INTO brigada (nombre, fecha_asignacion, id_conglomerado, lider)
    VALUES (p_nombre, p_fecha_asignacion, p_id_conglomerado, p_lider);
END;
$$ LANGUAGE plpgsql;

-- 🔹 Caso de uso: Asignar conglomerado a brigada
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

-- 🔹 Caso de uso: Listar brigadas
CREATE OR REPLACE FUNCTION listar_brigadas()
RETURNS TABLE (
    id_brigada INT,
    nombre TEXT,
    fecha_asignacion DATE,
    lider_nombre TEXT,
    conglomerado_codigo TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT b.id_brigada, b.nombre, b.fecha_asignacion,
           CONCAT(u.nombre, ' ', u.apellido) AS lider_nombre,
           c.codigo AS conglomerado_codigo
    FROM brigada b
    LEFT JOIN usuario u ON b.lider = u.id_usuario
    LEFT JOIN conglomerado c ON b.id_conglomerado = c.id_conglomerado;
END;
$$ LANGUAGE plpgsql;
