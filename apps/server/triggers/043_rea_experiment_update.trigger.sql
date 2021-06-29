CREATE TRIGGER IF NOT EXISTS rea_experiment AFTER UPDATE
    ON experiment_rea_entity
    WHEN (SELECT enabled FROM trigger_control WHERE trigger_control.name = 'rea_experiment')=1
BEGIN

    UPDATE experiment_entity SET outputCount = new.outputCount
    WHERE id = new.id;

end;
