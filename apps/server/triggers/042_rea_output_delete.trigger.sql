CREATE TRIGGER IF NOT EXISTS rea_output_delete BEFORE DELETE
    ON experiment_rea_entity
BEGIN
    DELETE FROM experiment_rea_output_entity WHERE experimentId = old.id;
    DELETE FROM experiment_result_entity WHERE experimentID = old.id;
END;
