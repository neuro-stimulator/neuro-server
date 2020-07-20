CREATE TRIGGER IF NOT EXISTS tvep_output_delete BEFORE DELETE
    ON experiment_tvep_entity
BEGIN
    DELETE FROM experiment_tvep_output_entity WHERE experimentId = old.id;
    DELETE FROM experiment_result_entity WHERE experimentID = old.id;
END;
