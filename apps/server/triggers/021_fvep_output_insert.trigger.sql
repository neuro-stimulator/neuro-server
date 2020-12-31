CREATE TRIGGER IF NOT EXISTS fvep_output_insert AFTER INSERT
    ON experiment_fvep_entity
BEGIN

    {BEGIN}INSERT INTO experiment_fvep_output_entity(experimentId, orderId, type, timeOn, timeOff, frequency, dutyCycle, brightness, x, y, width, height, manualAlignment, horizontalAlignment, verticalAlignment) VALUES (new.id, {INDEX}, 1, 1000, 1000, 2000, 2, 100, null, null, null, null, null, 1, 1);{END}

END;

