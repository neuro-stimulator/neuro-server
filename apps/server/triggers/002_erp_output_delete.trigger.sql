CREATE TRIGGER IF NOT EXISTS erp_output_delete BEFORE DELETE
    ON experiment_erp_entity
    WHEN (SELECT enabled FROM trigger_control WHERE trigger_control.name = 'erp_output_delete')=1
BEGIN
    DELETE FROM experiment_erp_output_dependency_entity WHERE experimentId = old.id;
    DELETE FROM experiment_erp_output_entity WHERE experimentId = old.id;
    DELETE FROM experiment_result_entity WHERE experimentID = old.id;
    DELETE FROM sequence_entity WHERE experimentId = old.id;
END;
