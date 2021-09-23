CREATE TRIGGER IF NOT EXISTS sequence_insert AFTER INSERT
  ON sequence_entity
  WHEN (SELECT enabled FROM trigger_control WHERE trigger_control.name = 'sequence_insert')=1
BEGIN

  INSERT INTO sequence_groups_entity(sequenceEntityId, groupEntityId) VALUES (NEW.id, NEW.userId);

END;
