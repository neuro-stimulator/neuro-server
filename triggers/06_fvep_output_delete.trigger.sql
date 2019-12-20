CREATE TRIGGER IF NOT EXISTS fvep_output_delete BEFORE DELETE
    ON experiment_fvep_entity
BEGIN
    DELETE FROM experiment_fvep_output_entity WHERE experimentId = old.id;
END;
