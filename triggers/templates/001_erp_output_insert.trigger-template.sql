CREATE TRIGGER IF NOT EXISTS erp_output_insert AFTER INSERT
    ON experiment_erp_entity
BEGIN

    {BEGIN}INSERT INTO experiment_erp_output_entity(experimentId, orderId, type, pulseUp, pulseDown, distribution, brightness) VALUES (new.id, {INDEX}, 1, 1, 1, 0, 100);{END}

END;
