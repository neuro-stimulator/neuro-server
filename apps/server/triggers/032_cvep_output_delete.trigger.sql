CREATE TRIGGER IF NOT EXISTS cvep_output_delete BEFORE DELETE
    ON experiment_cvep_entity
BEGIN
    DELETE FROM experiment_cvep_output_entity WHERE experimentId = old.id;
    DELETE FROM experiment_result_entity WHERE experimentID = old.id;
END;
