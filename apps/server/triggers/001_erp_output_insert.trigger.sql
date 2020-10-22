CREATE TRIGGER IF NOT EXISTS erp_output_insert AFTER INSERT
    ON experiment_erp_entity
BEGIN

    {BEGIN}INSERT INTO experiment_erp_output_entity(experimentId, orderId, type, pulseUp, pulseDown, distribution, brightness, x, y, width, height, manualAlignment, horizontalAlignment, verticalAlignment) VALUES (new.id, {INDEX}, 1, 1000, 1000, 0, 100, 0, 0, 0, 0, true, "CENTER", "CENTER");{END}

END;
