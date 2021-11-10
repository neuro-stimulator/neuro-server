CREATE TRIGGER IF NOT EXISTS rea_output_insert AFTER INSERT
    ON experiment_rea_entity
    WHEN (SELECT enabled FROM trigger_control WHERE trigger_control.name = 'rea_output_insert')=1
BEGIN

    {BEGIN}INSERT INTO experiment_rea_output_entity(experimentId, orderId, type, brightness, x, y, width, height, manualAlignment, horizontalAlignment, verticalAlignment) VALUES (new.id, {INDEX}, 1, 100, 0, 0, 0, 0, false, 1, 1);{END}

END;

