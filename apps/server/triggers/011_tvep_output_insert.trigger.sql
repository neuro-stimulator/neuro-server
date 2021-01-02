CREATE TRIGGER IF NOT EXISTS tvep_output_insert AFTER INSERT
    ON experiment_tvep_entity
BEGIN

    {BEGIN}INSERT INTO experiment_tvep_output_entity(experimentId, orderId, type, patternLength, pattern, out, wait, brightness, x, y, width, height, manualAlignment, horizontalAlignment, verticalAlignment) VALUES (new.id, {INDEX}, 1, 1, 0, 1000, 1000, 100, null, null, null, null, false, 1, 1);{END}

END;
