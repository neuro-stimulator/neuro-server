CREATE TRIGGER IF NOT EXISTS experiment_insert AFTER INSERT
  ON experiment_entity
  WHEN (SELECT enabled FROM trigger_control WHERE trigger_control.name = 'experiment_insert')=1
BEGIN

  INSERT INTO experiment_groups_entity(experimentEntityId, groupEntityId) VALUES (NEW.id, NEW.userId);

END;
