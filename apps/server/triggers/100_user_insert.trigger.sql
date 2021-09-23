CREATE TRIGGER IF NOT EXISTS user_insert AFTER INSERT
  ON user_entity
  WHEN (SELECT enabled FROM trigger_control WHERE trigger_control.name = 'user_insert')=1
BEGIN

  INSERT INTO group_entity(name) VALUES (NEW.username || '_group');
  INSERT INTO user_groups_entity(userEntityId, groupEntityId) VALUES (NEW.id, last_insert_rowid());

END;
