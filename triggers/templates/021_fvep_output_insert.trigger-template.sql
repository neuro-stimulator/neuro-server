CREATE TRIGGER IF NOT EXISTS fvep_output_insert AFTER INSERT
    ON experiment_fvep_entity
BEGIN

    {BEGIN}INSERT INTO experiment_fvep_output_entity(experimentId, orderId, type, timeOn, timeOff, frequency, dutyCycle, brightness) VALUES (new.id, {INDEX}, 1, 1, 1, 2, 2, 100);{END}

END;

