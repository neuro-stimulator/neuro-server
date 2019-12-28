CREATE TRIGGER IF NOT EXISTS tvep_output_insert AFTER INSERT
    ON experiment_tvep_entity
BEGIN

    INSERT INTO experiment_tvep_output_entity(experimentId, orderId, type, patternLength, pattern, out, wait, brightness) VALUES (new.id, 0, 1, 1, 0, 0, 0, 100);
    INSERT INTO experiment_tvep_output_entity(experimentId, orderId, type, patternLength, pattern, out, wait, brightness) VALUES (new.id, 1, 1, 1, 0, 0, 0, 100);
    INSERT INTO experiment_tvep_output_entity(experimentId, orderId, type, patternLength, pattern, out, wait, brightness) VALUES (new.id, 2, 1, 1, 0, 0, 0, 100);
    INSERT INTO experiment_tvep_output_entity(experimentId, orderId, type, patternLength, pattern, out, wait, brightness) VALUES (new.id, 3, 1, 1, 0, 0, 0, 100);
    INSERT INTO experiment_tvep_output_entity(experimentId, orderId, type, patternLength, pattern, out, wait, brightness) VALUES (new.id, 4, 1, 1, 0, 0, 0, 100);
    INSERT INTO experiment_tvep_output_entity(experimentId, orderId, type, patternLength, pattern, out, wait, brightness) VALUES (new.id, 5, 1, 1, 0, 0, 0, 100);
    INSERT INTO experiment_tvep_output_entity(experimentId, orderId, type, patternLength, pattern, out, wait, brightness) VALUES (new.id, 6, 1, 1, 0, 0, 0, 100);
    INSERT INTO experiment_tvep_output_entity(experimentId, orderId, type, patternLength, pattern, out, wait, brightness) VALUES (new.id, 7, 1, 1, 0, 0, 0, 100);

END;
