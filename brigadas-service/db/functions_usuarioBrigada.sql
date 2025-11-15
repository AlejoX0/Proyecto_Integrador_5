-- ===============================================
-- FUNCIONES DE ASIGNACIÓN DE USUARIOS A BRIGADAS
-- ===============================================

CREATE OR REPLACE FUNCTION asignar_usuario_a_brigada(
    p_id_usuario INT,
    p_id_brigada INT,
    p_rol_en_brigada VARCHAR
)
RETURNS VOID AS $$
DECLARE
    v_estado_usuario VARCHAR;
    v_dep_usuario VARCHAR;
    v_id_conglomerado INT;
    v_region_conglomerado VARCHAR;
BEGIN
    -- 1. Validar que el usuario existe
    SELECT estado, departamento
    INTO v_estado_usuario, v_dep_usuario
    FROM usuario
    WHERE id_usuario = p_id_usuario;

    IF v_estado_usuario IS NULL THEN
        RAISE EXCEPTION '❌ El usuario con ID % no existe.', p_id_usuario;
    END IF;

    -- 2. Validar que el usuario esté disponible
    IF v_estado_usuario <> 'disponible' THEN
        RAISE EXCEPTION 
            '❌ El usuario % no está disponible (estado actual: %).',
            p_id_usuario, v_estado_usuario;
    END IF;

    -- 3. Obtener conglomerado asignado a la brigada
    SELECT id_conglomerado INTO v_id_conglomerado
    FROM brigada
    WHERE id_brigada = p_id_brigada;

    IF v_id_conglomerado IS NULL THEN
        RAISE EXCEPTION '❌ La brigada % no existe o no tiene un conglomerado.', 
            p_id_brigada;
    END IF;

    -- 4. Obtener región del conglomerado
    SELECT ubicacion->>'region' INTO v_region_conglomerado
    FROM conglomerado
    WHERE id_conglomerado = v_id_conglomerado;

    IF v_region_conglomerado IS NULL THEN
        RAISE EXCEPTION 
            '❌ El conglomerado % no tiene región en su JSON.',
            v_id_conglomerado;
    END IF;

    -- 5. Validar departamento del usuario vs región del conglomerado
    IF v_dep_usuario <> v_region_conglomerado THEN
        RAISE EXCEPTION 
            '❌ No se puede asignar: el usuario % pertenece a %, pero la brigada está en %.',
            p_id_usuario, v_dep_usuario, v_region_conglomerado;
    END IF;

    -- 6. Evitar asignación duplicada
    IF EXISTS (
        SELECT 1 FROM brigada_usuario
        WHERE id_usuario = p_id_usuario
        AND id_brigada = p_id_brigada
    ) THEN
        RAISE EXCEPTION 
            '❌ El usuario % ya está asignado a la brigada %.',
            p_id_usuario, p_id_brigada;
    END IF;

    -- 7. Insertar asignación
    INSERT INTO brigada_usuario (id_usuario, id_brigada, rol_en_brigada, fecha_inicio)
    VALUES (p_id_usuario, p_id_brigada, p_rol_en_brigada, CURRENT_DATE);

    -- 8. Cambiar estado del usuario
    UPDATE usuario
    SET estado = 'asignado'
    WHERE id_usuario = p_id_usuario;

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

CREATE OR REPLACE FUNCTION remover_usuario_de_brigada(
    p_id_usuario INT,
    p_id_brigada INT
)
RETURNS VOID AS $$
BEGIN
    -- Validar que la asignación existe
    IF NOT EXISTS (
        SELECT 1 FROM brigada_usuario
        WHERE id_usuario = p_id_usuario
        AND id_brigada = p_id_brigada
    ) THEN
        RAISE EXCEPTION 
            '❌ El usuario % no está asignado a la brigada %.',
            p_id_usuario, p_id_brigada;
    END IF;

    -- Eliminar la asignación
    DELETE FROM brigada_usuario
    WHERE id_usuario = p_id_usuario
      AND id_brigada = p_id_brigada;

    -- Cambiar estado a disponible
    UPDATE usuario
    SET estado = 'disponible'
    WHERE id_usuario = p_id_usuario;
END;
$$ LANGUAGE plpgsql;
