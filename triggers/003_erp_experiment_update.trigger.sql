CREATE TRIGGER IF NOT EXISTS erp_experiment AFTER UPDATE
    ON experiment_erp_entity
BEGIN

    UPDATE experiment_entity SET usedOutputs =
        (SELECT led_available | (audio_available << 1) | (image_available << 2) AS used_types
         FROM (
                  SELECT (SELECT COUNT(id) > 0
                          FROM experiment_erp_output_entity
                          WHERE experimentId = new.id AND orderId > 0 AND orderId <= new.outputCount AND type & 1) AS led_available,
                         (SELECT COUNT(id) > 0
                          FROM experiment_erp_output_entity
                          WHERE experimentId = new.id AND orderId > 0 AND orderId <= new.outputCount AND type & 2) AS audio_available,
                         (SELECT COUNT(id) > 0
                          FROM experiment_erp_output_entity
                          WHERE experimentId = new.id AND orderId > 0 AND orderId <= new.outputCount AND type & 4) AS image_available
              )
        )
    WHERE id = new.id;

end;
