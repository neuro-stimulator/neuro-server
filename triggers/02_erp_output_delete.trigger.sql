CREATE TRIGGER IF NOT EXISTS erp_output_delete BEFORE DELETE
    ON experiment_erp_entity
BEGIN
    DELETE FROM experiment_erp_output_dependency_entity WHERE experimentId = old.id;
    DELETE FROM experiment_erp_output_entity WHERE experimentId = old.id;
END;
