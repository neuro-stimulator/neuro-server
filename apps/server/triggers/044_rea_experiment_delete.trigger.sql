CREATE TRIGGER IF NOT EXISTS rea_experiment_delete BEFORE DELETE
    ON experiment_rea_entity
BEGIN
    DELETE FROM experiment_result_entity WHERE experimentID = old.id;
END;
