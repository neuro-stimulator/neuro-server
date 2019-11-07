CREATE TRIGGER IF NOT EXISTS erp_output_insert AFTER INSERT
    ON experiment_erp_entity
BEGIN

    INSERT INTO experiment_erp_output_entity(experimentIdId, orderId, pulseUp, pulseDown, distribution, brightness) VALUES (new.id, 1, 0, 0, 0, 0);
    INSERT INTO experiment_erp_output_entity(experimentIdId, orderId, pulseUp, pulseDown, distribution, brightness) VALUES (new.id, 2, 0, 0, 0, 0);
    INSERT INTO experiment_erp_output_entity(experimentIdId, orderId, pulseUp, pulseDown, distribution, brightness) VALUES (new.id, 3, 0, 0, 0, 0);
    INSERT INTO experiment_erp_output_entity(experimentIdId, orderId, pulseUp, pulseDown, distribution, brightness) VALUES (new.id, 4, 0, 0, 0, 0);
    INSERT INTO experiment_erp_output_entity(experimentIdId, orderId, pulseUp, pulseDown, distribution, brightness) VALUES (new.id, 5, 0, 0, 0, 0);
    INSERT INTO experiment_erp_output_entity(experimentIdId, orderId, pulseUp, pulseDown, distribution, brightness) VALUES (new.id, 6, 0, 0, 0, 0);
    INSERT INTO experiment_erp_output_entity(experimentIdId, orderId, pulseUp, pulseDown, distribution, brightness) VALUES (new.id, 7, 0, 0, 0, 0);
    INSERT INTO experiment_erp_output_entity(experimentIdId, orderId, pulseUp, pulseDown, distribution, brightness) VALUES (new.id, 8, 0, 0, 0, 0);

END;

CREATE TRIGGER IF NOT EXISTS erp_output_delete BEFORE DELETE
    ON experiment_erp_entity
BEGIN
    DELETE FROM experiment_erp_output_entity WHERE experimentIdId = old.id;
--     DELETE FROM experiment_erp_output_dependency_entity WHERE
END;
