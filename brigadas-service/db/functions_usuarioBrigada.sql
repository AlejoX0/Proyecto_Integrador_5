-- ===============================================
-- FUNCIONES DE ASIGNACIÓN DE USUARIOS A BRIGADAS
-- ===============================================

-- 🔹 Caso de uso: Agregar usuario a brigada
CREATE OR REPLACE FUNCTION asignar_usuario_a_brigada(
    p_id_usuario INT,
    p_id_brigada INT,
    p_rol_en_brigada VARCHAR
)
RETURNS VOID AS $$
BEGIN
    INSERT INTO brigada_usuario (id_usuario, id_brigada, rol_en_brigada, fecha_inicio)
    VALUES (p_id_usuario, p_id_brigada, p_rol_en_brigada, CURRENT_DATE);
END;
$$ LANGUAGE plpgsql;

-- 🔹 Caso de uso: Listar usuarios de una brigada
CREATE OR REPLACE FUNCTION listar_usuarios_de_brigada(p_id_brigada INT)
RETURNS TABLE (
    id_usuario INT,
    nombre TEXT,
    apellido TEXT,
    rol_en_brigada TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT u.id_usuario, u.nombre, u.apellido, bu.rol_en_brigada
    FROM brigada_usuario bu
    JOIN usuario u ON bu.id_usuario = u.id_usuario
    WHERE bu.id_brigada = p_id_brigada;
END;
$$ LANGUAGE plpgsql;

-- 🔹 Caso de uso: Remover usuario de brigada
CREATE OR REPLACE FUNCTION remover_usuario_de_brigada(
    p_id_usuario INT,
    p_id_brigada INT
)
RETURNS VOID AS $$
BEGIN
    DELETE FROM brigada_usuario
    WHERE id_usuario = p_id_usuario AND id_brigada = p_id_brigada;
END;
$$ LANGUAGE plpgsql;
