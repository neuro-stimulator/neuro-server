CREATE TRIGGER IF NOT EXISTS tvep_output_insert AFTER INSERT
    ON experiment_tvep_entity
BEGIN

    {BEGIN}INSERT INTO experiment_tvep_output_entity(experimentId, orderId, type, patternLength, pattern, out, wait, brightness) VALUES (new.id, {INDEX}, 1, 1, 0, 1, 1, 100);{END}

END;
