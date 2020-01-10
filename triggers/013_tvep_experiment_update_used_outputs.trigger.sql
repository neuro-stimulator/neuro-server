CREATE TRIGGER IF NOT EXISTS tvep_experiment_used_outputs AFTER UPDATE
    ON experiment_tvep_entity
BEGIN

    UPDATE experiment_entity SET usedOutputs =
        (SELECT led_available | (audio_available << 1) | (image_available << 2) AS used_types
         FROM (
                  SELECT (SELECT COUNT(id) > 0
                          FROM experiment_tvep_output_entity
                          WHERE experimentId = new.id AND orderId < new.outputCount AND type & 1) AS led_available,
                         (SELECT COUNT(id) > 0
                          FROM experiment_tvep_output_entity
                          WHERE experimentId = new.id AND orderId < new.outputCount AND type & 2) AS audio_available,
                         (SELECT COUNT(id) > 0
                          FROM experiment_tvep_output_entity
                          WHERE experimentId = new.id AND orderId < new.outputCount AND type & 4) AS image_available
              )
        )
    WHERE id = new.id;

end;
