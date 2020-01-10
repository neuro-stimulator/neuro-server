CREATE TRIGGER IF NOT EXISTS tvep_experiment_output_count AFTER UPDATE
    ON experiment_tvep_entity
BEGIN

    UPDATE experiment_entity SET outputCount = new.outputCount
    WHERE id = new.id;

end;
