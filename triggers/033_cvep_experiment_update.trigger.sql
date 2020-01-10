CREATE TRIGGER IF NOT EXISTS cvep_experiment AFTER UPDATE
    ON experiment_cvep_entity
BEGIN

    UPDATE experiment_entity SET outputCount = new.outputCount
    WHERE id = new.id;

end;
