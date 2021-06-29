CREATE TRIGGER IF NOT EXISTS fvep_output_delete BEFORE DELETE
    ON experiment_fvep_entity
    WHEN (SELECT enabled FROM trigger_control WHERE trigger_control.name = 'fvep_output_delete')=1
BEGIN
    DELETE FROM experiment_fvep_output_entity WHERE experimentId = old.id;
    DELETE FROM experiment_result_entity WHERE experimentID = old.id;
END;
