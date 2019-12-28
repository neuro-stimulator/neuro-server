CREATE TRIGGER IF NOT EXISTS tvep_output_delete BEFORE DELETE
    ON experiment_tvep_entity
BEGIN
    DELETE FROM experiment_tvep_output_entity WHERE experimentId = old.id;
END;
