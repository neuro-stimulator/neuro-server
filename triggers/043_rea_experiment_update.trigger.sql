CREATE TRIGGER IF NOT EXISTS rea_experiment AFTER UPDATE
    ON experiment_rea_entity
BEGIN

    UPDATE experiment_entity SET outputCount = new.outputCount
    WHERE id = new.id;

end;
