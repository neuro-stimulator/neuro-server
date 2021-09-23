CREATE TRIGGER IF NOT EXISTS experiment_result_insert AFTER INSERT
  ON experiment_result_entity
  WHEN (SELECT enabled FROM trigger_control WHERE trigger_control.name = 'experiment_result_insert')=1
BEGIN

  INSERT INTO experiment_result_groups_entity(experimentResultEntityId, groupEntityId) VALUES (NEW.id, NEW.userId);

END;
