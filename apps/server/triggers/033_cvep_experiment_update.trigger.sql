CREATE TRIGGER IF NOT EXISTS cvep_experiment AFTER UPDATE
    ON experiment_cvep_entity
    WHEN (SELECT enabled FROM trigger_control WHERE trigger_control.name = 'cvep_experiment')=1
BEGIN

    UPDATE experiment_entity SET outputCount = new.outputCount
    WHERE id = new.id;

end;
