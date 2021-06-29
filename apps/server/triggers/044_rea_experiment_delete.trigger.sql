CREATE TRIGGER IF NOT EXISTS rea_experiment_delete BEFORE DELETE
    ON experiment_rea_entity
    WHEN (SELECT enabled FROM trigger_control WHERE trigger_control.name = 'rea_experiment_delete')=1
BEGIN
    DELETE FROM experiment_result_entity WHERE experimentID = old.id;
END;
