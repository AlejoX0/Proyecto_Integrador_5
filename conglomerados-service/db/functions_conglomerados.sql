-- db/functions_conglomerados.sql

-- 1) Añadir columnas centro_lat centro_lng en subparcela si no existen
ALTER TABLE IF EXISTS subparcela
  ADD COLUMN IF NOT EXISTS centro_lat double precision,
  ADD COLUMN IF NOT EXISTS centro_lng double precision;

-- 2) Función para calcular punto destino (en PL/pgSQL)
CREATE OR REPLACE FUNCTION geo_destination_latlng(
  p_lat double precision,
  p_lng double precision,
  p_bearing_degrees double precision,
  p_distance_m double precision
) RETURNS TABLE(lat double precision, lng double precision) AS
$$
DECLARE
  R CONSTANT double precision := 6371000; -- Earth radius m
  br double precision := radians(p_bearing_degrees);
  lat1 double precision := radians(p_lat);
  lon1 double precision := radians(p_lng);
  lat2 double precision;
  lon2 double precision;
BEGIN
  lat2 := asin( sin(lat1)*cos(p_distance_m/R) + cos(lat1)*sin(p_distance_m/R)*cos(br) );
  lon2 := lon1 + atan2( sin(br)*sin(p_distance_m/R)*cos(lat1), cos(p_distance_m/R) - sin(lat1)*sin(lat2) );
  lat := degrees(lat2);
  lng := (degrees(lon2)+540) % 360 - 180;
  RETURN NEXT;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- 3) Función listar_conglomerados (útil)
CREATE OR REPLACE FUNCTION listar_conglomerados()
RETURNS TABLE (
  id_conglomerado INT,
  codigo TEXT,
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  estado TEXT,
  fecha_inicio DATE,
  fecha_fin DATE
) AS $$
BEGIN
  RETURN QUERY
  SELECT id_conglomerado, codigo, (ubicacion->>'lat')::double precision, (ubicacion->>'lng')::double precision, estado, fecha_inicio, fecha_fin
  FROM conglomerado ORDER BY id_conglomerado DESC;
END;
$$ LANGUAGE plpgsql;

-- 4) listar_subparcelas_por_conglomerado
CREATE OR REPLACE FUNCTION listar_subparcelas_por_conglomerado(p_id INT)
RETURNS TABLE (
  id_subparcela INT,
  id_conglomerado INT,
  categoria TEXT,
  radio NUMERIC,
  centro_lat DOUBLE PRECISION,
  centro_lng DOUBLE PRECISION,
  area NUMERIC
) AS $$
BEGIN
  RETURN QUERY SELECT id_subparcela, id_conglomerado, categoria, radio, centro_lat, centro_lng, area
  FROM subparcela WHERE id_conglomerado = p_id ORDER BY id_subparcela;
END;
$$ LANGUAGE plpgsql;
