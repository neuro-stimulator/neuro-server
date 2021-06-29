CREATE TRIGGER IF NOT EXISTS tvep_output_insert AFTER INSERT
    ON experiment_tvep_entity
    WHEN (SELECT enabled FROM trigger_control WHERE trigger_control.name = 'tvep_output_insert')=1
BEGIN

    {BEGIN}INSERT INTO experiment_tvep_output_entity(experimentId, orderId, type, patternLength, pattern, out, wait, brightness, x, y, width, height, manualAlignment, horizontalAlignment, verticalAlignment) VALUES (new.id, {INDEX}, 1, 1, 0, 1000, 1000, 100, null, null, null, null, false, 1, 1);{END}

END;
