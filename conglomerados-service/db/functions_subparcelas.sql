CREATE OR REPLACE FUNCTION crear_subparcelas_automaticas(p_id_conglomerado INT)
RETURNS VOID AS $$
DECLARE
  categorias TEXT[] := ARRAY['brinzales', 'latizales', 'fustales', 'fustales grandes'];
  radios NUMERIC[] := ARRAY[1.5, 3.0, 7.0, 15.0];
  areas NUMERIC[] := ARRAY[7.07, 28.27, 154.0, 707.0];
  bearings DOUBLE PRECISION[] := ARRAY[0, 90, 180, 270]; -- norte, este, sur, oeste
  base_lat DOUBLE PRECISION;
  base_lng DOUBLE PRECISION;
  new_lat DOUBLE PRECISION;
  new_lng DOUBLE PRECISION;
  i INT;
BEGIN
  -- 1️⃣ Obtener coordenadas base del conglomerado
  SELECT (ubicacion->>'lat')::double precision, (ubicacion->>'lng')::double precision
  INTO base_lat, base_lng
  FROM conglomerado
  WHERE id_conglomerado = p_id_conglomerado;

  -- 2️⃣ Crear las 4 subparcelas con coordenadas calculadas
  FOR i IN 1..4 LOOP
    SELECT lat, lng INTO new_lat, new_lng
    FROM geo_destination_latlng(base_lat, base_lng, bearings[i], radios[i]);

    INSERT INTO subparcela (id_conglomerado, categoria, radio, area, centro_lat, centro_lon, centro_lng)
    VALUES (
      p_id_conglomerado,
      TRIM(categorias[i]),
      radios[i],
      areas[i],
      new_lat,
      new_lng,
      new_lng  -- aseguramos que centro_lon y centro_lng tengan el mismo valor
    );
  END LOOP;
END;
$$ LANGUAGE plpgsql;
