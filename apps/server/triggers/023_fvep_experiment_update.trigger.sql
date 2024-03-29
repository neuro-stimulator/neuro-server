CREATE TRIGGER IF NOT EXISTS fvep_experiment_update AFTER UPDATE
    ON experiment_fvep_entity
    WHEN (SELECT enabled FROM trigger_control WHERE trigger_control.name = 'fvep_experiment_update')=1
BEGIN

    UPDATE experiment_entity SET usedOutputs =
        (SELECT led_available | (audio_available << 1) | (image_available << 2) AS used_types
         FROM (
                  SELECT (SELECT COUNT(id) > 0
                          FROM experiment_fvep_output_entity
                          WHERE experimentId = new.id AND orderId < new.outputCount AND type & 1) AS led_available,
                         (SELECT COUNT(id) > 0
                          FROM experiment_fvep_output_entity
                          WHERE experimentId = new.id AND orderId < new.outputCount AND type & 2) AS audio_available,
                         (SELECT COUNT(id) > 0
                          FROM experiment_fvep_output_entity
                          WHERE experimentId = new.id AND orderId < new.outputCount AND type & 4) AS image_available
              )
        ), outputCount = new.outputCount
    WHERE id = new.id;

end;
