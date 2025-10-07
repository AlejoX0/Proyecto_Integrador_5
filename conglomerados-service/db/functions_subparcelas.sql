CREATE OR REPLACE FUNCTION crear_subparcelas_automaticas(p_id_conglomerado INT)
RETURNS VOID AS $$
DECLARE
  categorias TEXT[] := ARRAY['brinzales', 'latizales', 'fustales', 'fustales grandes'];
  radios NUMERIC[] := ARRAY[1.5, 3.0, 7.0, 15.0];
  areas NUMERIC[] := ARRAY[7.07, 28.27, 154.0, 707.0];
  i INT;
BEGIN
  FOR i IN 1..4 LOOP
    INSERT INTO subparcela (id_conglomerado, categoria, radio, area)
    VALUES (p_id_conglomerado, categorias[i], radios[i], areas[i]);
  END LOOP;
END;
$$ LANGUAGE plpgsql;
