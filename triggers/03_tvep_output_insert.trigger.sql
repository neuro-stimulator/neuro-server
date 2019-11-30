CREATE TRIGGER IF NOT EXISTS tvep_output_insert AFTER INSERT
    ON experiment_tvep_entity
BEGIN

    INSERT INTO experiment_tvep_output_entity(experimentId, patternLength, pattern, out, wait, brightness) VALUES (new.id, 0, 0, 0, 0, 0);
    INSERT INTO experiment_tvep_output_entity(experimentId, patternLength, pattern, out, wait, brightness) VALUES (new.id, 1, 0, 0, 0, 0);
    INSERT INTO experiment_tvep_output_entity(experimentId, patternLength, pattern, out, wait, brightness) VALUES (new.id, 2, 0, 0, 0, 0);
    INSERT INTO experiment_tvep_output_entity(experimentId, patternLength, pattern, out, wait, brightness) VALUES (new.id, 3, 0, 0, 0, 0);
    INSERT INTO experiment_tvep_output_entity(experimentId, patternLength, pattern, out, wait, brightness) VALUES (new.id, 4, 0, 0, 0, 0);
    INSERT INTO experiment_tvep_output_entity(experimentId, patternLength, pattern, out, wait, brightness) VALUES (new.id, 5, 0, 0, 0, 0);
    INSERT INTO experiment_tvep_output_entity(experimentId, patternLength, pattern, out, wait, brightness) VALUES (new.id, 6, 0, 0, 0, 0);
    INSERT INTO experiment_tvep_output_entity(experimentId, patternLength, pattern, out, wait, brightness) VALUES (new.id, 7, 0, 0, 0, 0);
    INSERT INTO experiment_tvep_output_entity(experimentId, patternLength, pattern, out, wait, brightness) VALUES (new.id, 8, 0, 0, 0, 0);

END;
