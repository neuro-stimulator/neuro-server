CREATE TRIGGER IF NOT EXISTS erp_output_insert AFTER INSERT
    ON experiment_erp_entity
BEGIN

    INSERT INTO experiment_erp_output_entity(experimentId, orderId, type, pulseUp, pulseDown, distribution, brightness) VALUES (new.id, 0, 1, 0, 0, 0, 100);
    INSERT INTO experiment_erp_output_entity(experimentId, orderId, type, pulseUp, pulseDown, distribution, brightness) VALUES (new.id, 1, 1, 0, 0, 0, 100);
    INSERT INTO experiment_erp_output_entity(experimentId, orderId, type, pulseUp, pulseDown, distribution, brightness) VALUES (new.id, 2, 1, 0, 0, 0, 100);
    INSERT INTO experiment_erp_output_entity(experimentId, orderId, type, pulseUp, pulseDown, distribution, brightness) VALUES (new.id, 3, 1, 0, 0, 0, 100);
    INSERT INTO experiment_erp_output_entity(experimentId, orderId, type, pulseUp, pulseDown, distribution, brightness) VALUES (new.id, 4, 1, 0, 0, 0, 100);
    INSERT INTO experiment_erp_output_entity(experimentId, orderId, type, pulseUp, pulseDown, distribution, brightness) VALUES (new.id, 5, 1, 0, 0, 0, 100);
    INSERT INTO experiment_erp_output_entity(experimentId, orderId, type, pulseUp, pulseDown, distribution, brightness) VALUES (new.id, 6, 1, 0, 0, 0, 100);
    INSERT INTO experiment_erp_output_entity(experimentId, orderId, type, pulseUp, pulseDown, distribution, brightness) VALUES (new.id, 7, 1, 0, 0, 0, 100);
    INSERT INTO experiment_erp_output_entity(experimentId, orderId, type, pulseUp, pulseDown, distribution, brightness) VALUES (new.id, 8, 1, 0, 0, 0, 100);

END;
