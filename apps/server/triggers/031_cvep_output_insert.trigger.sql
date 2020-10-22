CREATE TRIGGER IF NOT EXISTS fvep_output_insert AFTER INSERT
    ON experiment_fvep_entity
BEGIN

    {BEGIN}INSERT INTO experiment_cvep_output_entity(experimentId, orderId, type, brightness, x, y, width, height, manualAlignment, horizontalAlignment, verticalAlignment) VALUES (new.id, {INDEX}, 1, 100, null, null, null, null, null, null, null);{END}

END;

