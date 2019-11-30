CREATE TRIGGER IF NOT EXISTS erp_output_insert AFTER INSERT
    ON experiment_erp_entity
BEGIN

    INSERT INTO experiment_erp_output_entity(experimentId, orderId, pulseUp, pulseDown, distribution, brightness) VALUES (new.id, 0, 0, 0, 0, 100);
    INSERT INTO experiment_erp_output_entity(experimentId, orderId, pulseUp, pulseDown, distribution, brightness) VALUES (new.id, 1, 0, 0, 0, 100);
    INSERT INTO experiment_erp_output_entity(experimentId, orderId, pulseUp, pulseDown, distribution, brightness) VALUES (new.id, 2, 0, 0, 0, 100);
    INSERT INTO experiment_erp_output_entity(experimentId, orderId, pulseUp, pulseDown, distribution, brightness) VALUES (new.id, 3, 0, 0, 0, 100);
    INSERT INTO experiment_erp_output_entity(experimentId, orderId, pulseUp, pulseDown, distribution, brightness) VALUES (new.id, 4, 0, 0, 0, 100);
    INSERT INTO experiment_erp_output_entity(experimentId, orderId, pulseUp, pulseDown, distribution, brightness) VALUES (new.id, 5, 0, 0, 0, 100);
    INSERT INTO experiment_erp_output_entity(experimentId, orderId, pulseUp, pulseDown, distribution, brightness) VALUES (new.id, 6, 0, 0, 0, 100);
    INSERT INTO experiment_erp_output_entity(experimentId, orderId, pulseUp, pulseDown, distribution, brightness) VALUES (new.id, 7, 0, 0, 0, 100);
    INSERT INTO experiment_erp_output_entity(experimentId, orderId, pulseUp, pulseDown, distribution, brightness) VALUES (new.id, 8, 0, 0, 0, 100);

END;
