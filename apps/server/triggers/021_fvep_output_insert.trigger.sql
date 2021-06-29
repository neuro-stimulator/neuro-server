CREATE TRIGGER IF NOT EXISTS fvep_output_insert AFTER INSERT
    ON experiment_fvep_entity
    WHEN (SELECT enabled FROM trigger_control WHERE trigger_control.name = 'fvep_output_insert')=1
BEGIN

    {BEGIN}INSERT INTO experiment_fvep_output_entity(experimentId, orderId, type, timeOn, timeOff, frequency, dutyCycle, brightness, x, y, width, height, manualAlignment, horizontalAlignment, verticalAlignment) VALUES (new.id, {INDEX}, 1, 1000, 1000, 2000, 2, 100, null, null, null, null, false, 1, 1);{END}

END;

