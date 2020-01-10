CREATE TRIGGER IF NOT EXISTS erp_experiment_output_count AFTER UPDATE
    ON experiment_erp_entity
BEGIN

    UPDATE experiment_entity SET outputCount = new.outputCount
    WHERE id = new.id;

end;
