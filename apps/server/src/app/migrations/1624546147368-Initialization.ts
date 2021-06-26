import { MigrationInterface, QueryRunner } from 'typeorm';
import { Logger } from '@nestjs/common';

export class Initialization1624546147368 implements MigrationInterface {
  name = 'Initialization1624546147368';

  public async up(queryRunner: QueryRunner): Promise<void> {
    Logger.log('Inicializuji databázi...', 'Migrations');

    await queryRunner.query(`CREATE TABLE "refresh_token_entity"
                             (
                               "id"        integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                               "uuid"      varchar                           NOT NULL,
                               "value"     text                              NOT NULL,
                               "userId"    integer                           NOT NULL,
                               "clientId"  text                              NOT NULL,
                               "expiresAt" integer                           NOT NULL,
                               "ipAddress" text                              NOT NULL
                             )`);
    await queryRunner.query(`CREATE TABLE "trigger_control"
                             (
                               "name"    varchar(64) PRIMARY KEY NOT NULL,
                               "enabled" boolean                 NOT NULL DEFAULT (1)
                             )`);
    await queryRunner.query(`CREATE TABLE "experiment_result_entity"
                             (
                               "id"           integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                               "userId"       integer                           NOT NULL,
                               "experimentID" integer                           NOT NULL,
                               "name"         text(255),
                               "type"         text(255)                         NOT NULL,
                               "outputCount"  integer                           NOT NULL,
                               "date"         integer                           NOT NULL,
                               "filename"     text                              NOT NULL
                             )`);
    await queryRunner.query(`CREATE TABLE "experiment_entity"
                             (
                               "id"               integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                               "userId"           integer                           NOT NULL,
                               "name"             text(255)                         NOT NULL,
                               "description"      text(255),
                               "type"             integer                           NOT NULL,
                               "usedOutputs"      integer                           NOT NULL DEFAULT (1),
                               "created"          integer                           NOT NULL,
                               "outputCount"      integer                           NOT NULL DEFAULT (1),
                               "tags"             text,
                               "supportSequences" boolean                           NOT NULL,
                               CONSTRAINT "UQ_ee4079d2bef9920490019a9c619" UNIQUE ("name")
                             )`);
    await queryRunner.query(`CREATE TABLE "experiment_cvep_entity"
                             (
                               "id"          integer PRIMARY KEY NOT NULL,
                               "outputCount" integer             NOT NULL,
                               "audioFile"   text,
                               "imageFile"   text,
                               "out"         integer             NOT NULL,
                               "wait"        integer             NOT NULL,
                               "pattern"     integer             NOT NULL,
                               "bitShift"    integer             NOT NULL,
                               "brightness"  integer             NOT NULL,
                               CONSTRAINT "REL_6d6d0acf4186a677ad03c20fad" UNIQUE ("id")
                             )`);
    await queryRunner.query(`CREATE TABLE "experiment_cvep_output_entity"
                             (
                               "id"                  integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                               "orderId"             integer                           NOT NULL,
                               "type"                integer                           NOT NULL,
                               "audioFile"           text,
                               "imageFile"           text,
                               "brightness"          integer                           NOT NULL,
                               "x"                   integer,
                               "y"                   integer,
                               "width"               integer,
                               "height"              integer,
                               "manualAlignment"     boolean,
                               "horizontalAlignment" integer                           NOT NULL DEFAULT (1),
                               "verticalAlignment"   integer                           NOT NULL DEFAULT (1),
                               "experimentId"        integer                           NOT NULL
                             )`);
    await queryRunner.query(`CREATE TABLE "experiment_erp_entity"
                             (
                               "id"              integer PRIMARY KEY NOT NULL,
                               "outputCount"     integer             NOT NULL,
                               "maxDistribution" integer             NOT NULL,
                               "out"             integer             NOT NULL,
                               "wait"            integer             NOT NULL,
                               "edge"            integer             NOT NULL,
                               "random"          integer             NOT NULL,
                               "sequenceId"      integer,
                               CONSTRAINT "REL_b14f52e0162faf28f9b66b7123" UNIQUE ("id")
                             )`);
    await queryRunner.query(`CREATE TABLE "experiment_erp_output_entity"
                             (
                               "id"                  integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                               "orderId"             integer                           NOT NULL,
                               "type"                integer                           NOT NULL,
                               "audioFile"           text,
                               "imageFile"           text,
                               "brightness"          integer                           NOT NULL,
                               "x"                   integer,
                               "y"                   integer,
                               "width"               integer,
                               "height"              integer,
                               "manualAlignment"     boolean,
                               "horizontalAlignment" integer                           NOT NULL DEFAULT (1),
                               "verticalAlignment"   integer                           NOT NULL DEFAULT (1),
                               "experimentId"        integer                           NOT NULL,
                               "pulseUp"             integer                           NOT NULL,
                               "pulseDown"           integer                           NOT NULL,
                               "distribution"        integer                           NOT NULL
                             )`);
    await queryRunner.query(`CREATE TABLE "experiment_erp_output_dependency_entity"
                             (
                               "id"           integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                               "experimentId" integer                           NOT NULL,
                               "sourceOutput" integer                           NOT NULL,
                               "destOutput"   integer                           NOT NULL,
                               "count"        integer                           NOT NULL,
                               "orderId"      integer,
                               CONSTRAINT "UQ_df8413927e003d6950c3445b13c" UNIQUE ("experimentId", "sourceOutput", "destOutput")
                             )`);
    await queryRunner.query(`CREATE TABLE "experiment_fvep_entity"
                             (
                               "id"          integer PRIMARY KEY NOT NULL,
                               "outputCount" integer             NOT NULL,
                               CONSTRAINT "REL_e1fae7b1c4f7514dd366c998a2" UNIQUE ("id")
                             )`);
    await queryRunner.query(`CREATE TABLE "experiment_fvep_output_entity"
                             (
                               "id"                  integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                               "orderId"             integer                           NOT NULL,
                               "type"                integer                           NOT NULL,
                               "audioFile"           text,
                               "imageFile"           text,
                               "brightness"          integer                           NOT NULL,
                               "x"                   integer,
                               "y"                   integer,
                               "width"               integer,
                               "height"              integer,
                               "manualAlignment"     boolean,
                               "horizontalAlignment" integer                           NOT NULL DEFAULT (1),
                               "verticalAlignment"   integer                           NOT NULL DEFAULT (1),
                               "experimentId"        integer                           NOT NULL,
                               "timeOn"              integer                           NOT NULL,
                               "timeOff"             integer                           NOT NULL,
                               "frequency"           integer                           NOT NULL,
                               "dutyCycle"           integer                           NOT NULL
                             )`);
    await queryRunner.query(`CREATE TABLE "experiment_rea_entity"
                             (
                               "id"          integer PRIMARY KEY NOT NULL,
                               "outputCount" integer             NOT NULL,
                               "audioFile"   text,
                               "imageFile"   text,
                               "cycleCount"  integer             NOT NULL,
                               "waitTimeMin" integer             NOT NULL,
                               "waitTimeMax" integer             NOT NULL,
                               "missTime"    integer             NOT NULL,
                               "onFail"      integer             NOT NULL,
                               "brightness"  integer             NOT NULL,
                               CONSTRAINT "REL_9804d980a06170e207556b2990" UNIQUE ("id")
                             )`);
    await queryRunner.query(`CREATE TABLE "experiment_rea_output_entity"
                             (
                               "id"                  integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                               "orderId"             integer                           NOT NULL,
                               "type"                integer                           NOT NULL,
                               "audioFile"           text,
                               "imageFile"           text,
                               "brightness"          integer                           NOT NULL,
                               "x"                   integer,
                               "y"                   integer,
                               "width"               integer,
                               "height"              integer,
                               "manualAlignment"     boolean,
                               "horizontalAlignment" integer                           NOT NULL DEFAULT (1),
                               "verticalAlignment"   integer                           NOT NULL DEFAULT (1),
                               "experimentId"        integer                           NOT NULL
                             )`);
    await queryRunner.query(`CREATE TABLE "experiment_tvep_entity"
                             (
                               "id"                 integer PRIMARY KEY NOT NULL,
                               "sharePatternLength" boolean             NOT NULL,
                               "outputCount"        integer             NOT NULL,
                               CONSTRAINT "REL_52cfe70d820cabed949681a46c" UNIQUE ("id")
                             )`);
    await queryRunner.query(`CREATE TABLE "experiment_tvep_output_entity"
                             (
                               "id"                  integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                               "orderId"             integer                           NOT NULL,
                               "type"                integer                           NOT NULL,
                               "audioFile"           text,
                               "imageFile"           text,
                               "brightness"          integer                           NOT NULL,
                               "x"                   integer,
                               "y"                   integer,
                               "width"               integer,
                               "height"              integer,
                               "manualAlignment"     boolean,
                               "horizontalAlignment" integer                           NOT NULL DEFAULT (1),
                               "verticalAlignment"   integer                           NOT NULL DEFAULT (1),
                               "experimentId"        integer                           NOT NULL,
                               "patternLength"       integer                           NOT NULL,
                               "pattern"             integer                           NOT NULL,
                               "out"                 integer                           NOT NULL,
                               "wait"                integer                           NOT NULL
                             )`);
    await queryRunner.query(`CREATE TABLE "experiment_stop_condition_entity"
                             (
                               "experimentType"              varchar NOT NULL,
                               "experimentStopConditionType" varchar NOT NULL,
                               PRIMARY KEY ("experimentType", "experimentStopConditionType")
                             )`);
    await queryRunner.query(`CREATE TABLE "sequence_entity"
                             (
                               "id"           integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                               "userId"       integer                           NOT NULL,
                               "experimentId" integer,
                               "name"         text(255)                         NOT NULL,
                               "created"      integer                           NOT NULL,
                               "data"         text                              NOT NULL,
                               "size"         integer                           NOT NULL,
                               "tags"         text                              NOT NULL
                             )`);
    await queryRunner.query(`CREATE TABLE "user_entity"
                             (
                               "id"            integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                               "uuid"          varchar                           NOT NULL,
                               "username"      text(255)                         NOT NULL,
                               "email"         text(255)                         NOT NULL,
                               "password"      text(255)                         NOT NULL,
                               "lastLoginDate" integer,
                               "createdAt"     integer                           NOT NULL,
                               "updatedAt"     integer                           NOT NULL
                             )`);
    await queryRunner.query(`CREATE TABLE "temporary_experiment_cvep_entity"
                             (
                               "id"          integer PRIMARY KEY NOT NULL,
                               "outputCount" integer             NOT NULL,
                               "audioFile"   text,
                               "imageFile"   text,
                               "out"         integer             NOT NULL,
                               "wait"        integer             NOT NULL,
                               "pattern"     integer             NOT NULL,
                               "bitShift"    integer             NOT NULL,
                               "brightness"  integer             NOT NULL,
                               CONSTRAINT "REL_6d6d0acf4186a677ad03c20fad" UNIQUE ("id"),
                               CONSTRAINT "FK_6d6d0acf4186a677ad03c20fad0" FOREIGN KEY ("id") REFERENCES "experiment_entity" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
                             )`);
    await queryRunner.query(`INSERT INTO "temporary_experiment_cvep_entity"("id", "outputCount", "audioFile", "imageFile", "out", "wait", "pattern", "bitShift", "brightness")
                             SELECT "id",
                                    "outputCount",
                                    "audioFile",
                                    "imageFile",
                                    "out",
                                    "wait",
                                    "pattern",
                                    "bitShift",
                                    "brightness"
                             FROM "experiment_cvep_entity"`);
    await queryRunner.query(`DROP TABLE "experiment_cvep_entity"`);
    await queryRunner.query(`ALTER TABLE "temporary_experiment_cvep_entity"
      RENAME TO "experiment_cvep_entity"`);
    await queryRunner.query(`CREATE TABLE "temporary_experiment_cvep_output_entity"
                             (
                               "id"                  integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                               "orderId"             integer                           NOT NULL,
                               "type"                integer                           NOT NULL,
                               "audioFile"           text,
                               "imageFile"           text,
                               "brightness"          integer                           NOT NULL,
                               "x"                   integer,
                               "y"                   integer,
                               "width"               integer,
                               "height"              integer,
                               "manualAlignment"     boolean,
                               "horizontalAlignment" integer                           NOT NULL DEFAULT (1),
                               "verticalAlignment"   integer                           NOT NULL DEFAULT (1),
                               "experimentId"        integer                           NOT NULL,
                               CONSTRAINT "FK_7b872d3edc633cc3e3a2e1dd481" FOREIGN KEY ("experimentId") REFERENCES "experiment_cvep_entity" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
                             )`);
    await queryRunner.query(`INSERT INTO "temporary_experiment_cvep_output_entity"("id", "orderId", "type", "audioFile", "imageFile", "brightness", "x", "y", "width", "height",
                                                                                   "manualAlignment", "horizontalAlignment", "verticalAlignment", "experimentId")
                             SELECT "id",
                                    "orderId",
                                    "type",
                                    "audioFile",
                                    "imageFile",
                                    "brightness",
                                    "x",
                                    "y",
                                    "width",
                                    "height",
                                    "manualAlignment",
                                    "horizontalAlignment",
                                    "verticalAlignment",
                                    "experimentId"
                             FROM "experiment_cvep_output_entity"`);
    await queryRunner.query(`DROP TABLE "experiment_cvep_output_entity"`);
    await queryRunner.query(`ALTER TABLE "temporary_experiment_cvep_output_entity"
      RENAME TO "experiment_cvep_output_entity"`);
    await queryRunner.query(`CREATE TABLE "temporary_experiment_erp_entity"
                             (
                               "id"              integer PRIMARY KEY NOT NULL,
                               "outputCount"     integer             NOT NULL,
                               "maxDistribution" integer             NOT NULL,
                               "out"             integer             NOT NULL,
                               "wait"            integer             NOT NULL,
                               "edge"            integer             NOT NULL,
                               "random"          integer             NOT NULL,
                               "sequenceId"      integer,
                               CONSTRAINT "REL_b14f52e0162faf28f9b66b7123" UNIQUE ("id"),
                               CONSTRAINT "FK_b14f52e0162faf28f9b66b7123a" FOREIGN KEY ("id") REFERENCES "experiment_entity" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
                             )`);
    await queryRunner.query(`INSERT INTO "temporary_experiment_erp_entity"("id", "outputCount", "maxDistribution", "out", "wait", "edge", "random", "sequenceId")
                             SELECT "id",
                                    "outputCount",
                                    "maxDistribution",
                                    "out",
                                    "wait",
                                    "edge",
                                    "random",
                                    "sequenceId"
                             FROM "experiment_erp_entity"`);
    await queryRunner.query(`DROP TABLE "experiment_erp_entity"`);
    await queryRunner.query(`ALTER TABLE "temporary_experiment_erp_entity"
      RENAME TO "experiment_erp_entity"`);
    await queryRunner.query(`CREATE TABLE "temporary_experiment_erp_output_entity"
                             (
                               "id"                  integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                               "orderId"             integer                           NOT NULL,
                               "type"                integer                           NOT NULL,
                               "audioFile"           text,
                               "imageFile"           text,
                               "brightness"          integer                           NOT NULL,
                               "x"                   integer,
                               "y"                   integer,
                               "width"               integer,
                               "height"              integer,
                               "manualAlignment"     boolean,
                               "horizontalAlignment" integer                           NOT NULL DEFAULT (1),
                               "verticalAlignment"   integer                           NOT NULL DEFAULT (1),
                               "experimentId"        integer                           NOT NULL,
                               "pulseUp"             integer                           NOT NULL,
                               "pulseDown"           integer                           NOT NULL,
                               "distribution"        integer                           NOT NULL,
                               CONSTRAINT "FK_9a7ca76f257b27f83ce2a75ad3c" FOREIGN KEY ("experimentId") REFERENCES "experiment_erp_entity" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
                             )`);
    await queryRunner.query(`INSERT INTO "temporary_experiment_erp_output_entity"("id", "orderId", "type", "audioFile", "imageFile", "brightness", "x", "y", "width", "height",
                                                                                  "manualAlignment", "horizontalAlignment", "verticalAlignment", "experimentId", "pulseUp",
                                                                                  "pulseDown", "distribution")
                             SELECT "id",
                                    "orderId",
                                    "type",
                                    "audioFile",
                                    "imageFile",
                                    "brightness",
                                    "x",
                                    "y",
                                    "width",
                                    "height",
                                    "manualAlignment",
                                    "horizontalAlignment",
                                    "verticalAlignment",
                                    "experimentId",
                                    "pulseUp",
                                    "pulseDown",
                                    "distribution"
                             FROM "experiment_erp_output_entity"`);
    await queryRunner.query(`DROP TABLE "experiment_erp_output_entity"`);
    await queryRunner.query(`ALTER TABLE "temporary_experiment_erp_output_entity"
      RENAME TO "experiment_erp_output_entity"`);
    await queryRunner.query(`CREATE TABLE "temporary_experiment_erp_output_dependency_entity"
                             (
                               "id"           integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                               "experimentId" integer                           NOT NULL,
                               "sourceOutput" integer                           NOT NULL,
                               "destOutput"   integer                           NOT NULL,
                               "count"        integer                           NOT NULL,
                               "orderId"      integer,
                               CONSTRAINT "UQ_df8413927e003d6950c3445b13c" UNIQUE ("experimentId", "sourceOutput", "destOutput"),
                               CONSTRAINT "FK_eba6314b053ffe74cf112d14783" FOREIGN KEY ("experimentId") REFERENCES "experiment_erp_entity" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
                               CONSTRAINT "FK_522169f3bcefed9f6de19330a36" FOREIGN KEY ("orderId") REFERENCES "experiment_erp_output_entity" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
                               CONSTRAINT "FK_522169f3bcefed9f6de19330a36" FOREIGN KEY ("orderId") REFERENCES "experiment_erp_output_entity" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
                             )`);
    await queryRunner.query(`INSERT INTO "temporary_experiment_erp_output_dependency_entity"("id", "experimentId", "sourceOutput", "destOutput", "count", "orderId")
                             SELECT "id", "experimentId", "sourceOutput", "destOutput", "count", "orderId"
                             FROM "experiment_erp_output_dependency_entity"`);
    await queryRunner.query(`DROP TABLE "experiment_erp_output_dependency_entity"`);
    await queryRunner.query(`ALTER TABLE "temporary_experiment_erp_output_dependency_entity"
      RENAME TO "experiment_erp_output_dependency_entity"`);
    await queryRunner.query(`CREATE TABLE "temporary_experiment_fvep_entity"
                             (
                               "id"          integer PRIMARY KEY NOT NULL,
                               "outputCount" integer             NOT NULL,
                               CONSTRAINT "REL_e1fae7b1c4f7514dd366c998a2" UNIQUE ("id"),
                               CONSTRAINT "FK_e1fae7b1c4f7514dd366c998a2c" FOREIGN KEY ("id") REFERENCES "experiment_entity" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
                             )`);
    await queryRunner.query(`INSERT INTO "temporary_experiment_fvep_entity"("id", "outputCount")
                             SELECT "id", "outputCount"
                             FROM "experiment_fvep_entity"`);
    await queryRunner.query(`DROP TABLE "experiment_fvep_entity"`);
    await queryRunner.query(`ALTER TABLE "temporary_experiment_fvep_entity"
      RENAME TO "experiment_fvep_entity"`);
    await queryRunner.query(`CREATE TABLE "temporary_experiment_fvep_output_entity"
                             (
                               "id"                  integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                               "orderId"             integer                           NOT NULL,
                               "type"                integer                           NOT NULL,
                               "audioFile"           text,
                               "imageFile"           text,
                               "brightness"          integer                           NOT NULL,
                               "x"                   integer,
                               "y"                   integer,
                               "width"               integer,
                               "height"              integer,
                               "manualAlignment"     boolean,
                               "horizontalAlignment" integer                           NOT NULL DEFAULT (1),
                               "verticalAlignment"   integer                           NOT NULL DEFAULT (1),
                               "experimentId"        integer                           NOT NULL,
                               "timeOn"              integer                           NOT NULL,
                               "timeOff"             integer                           NOT NULL,
                               "frequency"           integer                           NOT NULL,
                               "dutyCycle"           integer                           NOT NULL,
                               CONSTRAINT "FK_7d4ebe9b92276748f0c10b338c7" FOREIGN KEY ("experimentId") REFERENCES "experiment_fvep_entity" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
                             )`);
    await queryRunner.query(`INSERT INTO "temporary_experiment_fvep_output_entity"("id", "orderId", "type", "audioFile", "imageFile", "brightness", "x", "y", "width", "height",
                                                                                   "manualAlignment", "horizontalAlignment", "verticalAlignment", "experimentId", "timeOn",
                                                                                   "timeOff", "frequency", "dutyCycle")
                             SELECT "id",
                                    "orderId",
                                    "type",
                                    "audioFile",
                                    "imageFile",
                                    "brightness",
                                    "x",
                                    "y",
                                    "width",
                                    "height",
                                    "manualAlignment",
                                    "horizontalAlignment",
                                    "verticalAlignment",
                                    "experimentId",
                                    "timeOn",
                                    "timeOff",
                                    "frequency",
                                    "dutyCycle"
                             FROM "experiment_fvep_output_entity"`);
    await queryRunner.query(`DROP TABLE "experiment_fvep_output_entity"`);
    await queryRunner.query(`ALTER TABLE "temporary_experiment_fvep_output_entity"
      RENAME TO "experiment_fvep_output_entity"`);
    await queryRunner.query(`CREATE TABLE "temporary_experiment_rea_entity"
                             (
                               "id"          integer PRIMARY KEY NOT NULL,
                               "outputCount" integer             NOT NULL,
                               "audioFile"   text,
                               "imageFile"   text,
                               "cycleCount"  integer             NOT NULL,
                               "waitTimeMin" integer             NOT NULL,
                               "waitTimeMax" integer             NOT NULL,
                               "missTime"    integer             NOT NULL,
                               "onFail"      integer             NOT NULL,
                               "brightness"  integer             NOT NULL,
                               CONSTRAINT "REL_9804d980a06170e207556b2990" UNIQUE ("id"),
                               CONSTRAINT "FK_9804d980a06170e207556b2990f" FOREIGN KEY ("id") REFERENCES "experiment_entity" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
                             )`);
    await queryRunner.query(`INSERT INTO "temporary_experiment_rea_entity"("id", "outputCount", "audioFile", "imageFile", "cycleCount", "waitTimeMin", "waitTimeMax", "missTime",
                                                                           "onFail", "brightness")
                             SELECT "id",
                                    "outputCount",
                                    "audioFile",
                                    "imageFile",
                                    "cycleCount",
                                    "waitTimeMin",
                                    "waitTimeMax",
                                    "missTime",
                                    "onFail",
                                    "brightness"
                             FROM "experiment_rea_entity"`);
    await queryRunner.query(`DROP TABLE "experiment_rea_entity"`);
    await queryRunner.query(`ALTER TABLE "temporary_experiment_rea_entity"
      RENAME TO "experiment_rea_entity"`);
    await queryRunner.query(`CREATE TABLE "temporary_experiment_rea_output_entity"
                             (
                               "id"                  integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                               "orderId"             integer                           NOT NULL,
                               "type"                integer                           NOT NULL,
                               "audioFile"           text,
                               "imageFile"           text,
                               "brightness"          integer                           NOT NULL,
                               "x"                   integer,
                               "y"                   integer,
                               "width"               integer,
                               "height"              integer,
                               "manualAlignment"     boolean,
                               "horizontalAlignment" integer                           NOT NULL DEFAULT (1),
                               "verticalAlignment"   integer                           NOT NULL DEFAULT (1),
                               "experimentId"        integer                           NOT NULL,
                               CONSTRAINT "FK_590691268a24608febfdd54e174" FOREIGN KEY ("experimentId") REFERENCES "experiment_rea_entity" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
                             )`);
    await queryRunner.query(`INSERT INTO "temporary_experiment_rea_output_entity"("id", "orderId", "type", "audioFile", "imageFile", "brightness", "x", "y", "width", "height",
                                                                                  "manualAlignment", "horizontalAlignment", "verticalAlignment", "experimentId")
                             SELECT "id",
                                    "orderId",
                                    "type",
                                    "audioFile",
                                    "imageFile",
                                    "brightness",
                                    "x",
                                    "y",
                                    "width",
                                    "height",
                                    "manualAlignment",
                                    "horizontalAlignment",
                                    "verticalAlignment",
                                    "experimentId"
                             FROM "experiment_rea_output_entity"`);
    await queryRunner.query(`DROP TABLE "experiment_rea_output_entity"`);
    await queryRunner.query(`ALTER TABLE "temporary_experiment_rea_output_entity"
      RENAME TO "experiment_rea_output_entity"`);
    await queryRunner.query(`CREATE TABLE "temporary_experiment_tvep_entity"
                             (
                               "id"                 integer PRIMARY KEY NOT NULL,
                               "sharePatternLength" boolean             NOT NULL,
                               "outputCount"        integer             NOT NULL,
                               CONSTRAINT "REL_52cfe70d820cabed949681a46c" UNIQUE ("id"),
                               CONSTRAINT "FK_52cfe70d820cabed949681a46c3" FOREIGN KEY ("id") REFERENCES "experiment_entity" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
                             )`);
    await queryRunner.query(`INSERT INTO "temporary_experiment_tvep_entity"("id", "sharePatternLength", "outputCount")
                             SELECT "id", "sharePatternLength", "outputCount"
                             FROM "experiment_tvep_entity"`);
    await queryRunner.query(`DROP TABLE "experiment_tvep_entity"`);
    await queryRunner.query(`ALTER TABLE "temporary_experiment_tvep_entity"
      RENAME TO "experiment_tvep_entity"`);
    await queryRunner.query(`CREATE TABLE "temporary_experiment_tvep_output_entity"
                             (
                               "id"                  integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                               "orderId"             integer                           NOT NULL,
                               "type"                integer                           NOT NULL,
                               "audioFile"           text,
                               "imageFile"           text,
                               "brightness"          integer                           NOT NULL,
                               "x"                   integer,
                               "y"                   integer,
                               "width"               integer,
                               "height"              integer,
                               "manualAlignment"     boolean,
                               "horizontalAlignment" integer                           NOT NULL DEFAULT (1),
                               "verticalAlignment"   integer                           NOT NULL DEFAULT (1),
                               "experimentId"        integer                           NOT NULL,
                               "patternLength"       integer                           NOT NULL,
                               "pattern"             integer                           NOT NULL,
                               "out"                 integer                           NOT NULL,
                               "wait"                integer                           NOT NULL,
                               CONSTRAINT "FK_73e82e929a0cffaaf02ad5484da" FOREIGN KEY ("experimentId") REFERENCES "experiment_tvep_entity" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
                             )`);
    await queryRunner.query(`INSERT INTO "temporary_experiment_tvep_output_entity"("id", "orderId", "type", "audioFile", "imageFile", "brightness", "x", "y", "width", "height",
                                                                                   "manualAlignment", "horizontalAlignment", "verticalAlignment", "experimentId", "patternLength",
                                                                                   "pattern", "out", "wait")
                             SELECT "id",
                                    "orderId",
                                    "type",
                                    "audioFile",
                                    "imageFile",
                                    "brightness",
                                    "x",
                                    "y",
                                    "width",
                                    "height",
                                    "manualAlignment",
                                    "horizontalAlignment",
                                    "verticalAlignment",
                                    "experimentId",
                                    "patternLength",
                                    "pattern",
                                    "out",
                                    "wait"
                             FROM "experiment_tvep_output_entity"`);
    await queryRunner.query(`DROP TABLE "experiment_tvep_output_entity"`);
    await queryRunner.query(`ALTER TABLE "temporary_experiment_tvep_output_entity"
      RENAME TO "experiment_tvep_output_entity"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "experiment_tvep_output_entity"
      RENAME TO "temporary_experiment_tvep_output_entity"`);
    await queryRunner.query(`CREATE TABLE "experiment_tvep_output_entity"
                             (
                               "id"                  integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                               "orderId"             integer                           NOT NULL,
                               "type"                integer                           NOT NULL,
                               "audioFile"           text,
                               "imageFile"           text,
                               "brightness"          integer                           NOT NULL,
                               "x"                   integer,
                               "y"                   integer,
                               "width"               integer,
                               "height"              integer,
                               "manualAlignment"     boolean,
                               "horizontalAlignment" integer                           NOT NULL DEFAULT (1),
                               "verticalAlignment"   integer                           NOT NULL DEFAULT (1),
                               "experimentId"        integer                           NOT NULL,
                               "patternLength"       integer                           NOT NULL,
                               "pattern"             integer                           NOT NULL,
                               "out"                 integer                           NOT NULL,
                               "wait"                integer                           NOT NULL
                             )`);
    await queryRunner.query(`INSERT INTO "experiment_tvep_output_entity"("id", "orderId", "type", "audioFile", "imageFile", "brightness", "x", "y", "width", "height",
                                                                         "manualAlignment", "horizontalAlignment", "verticalAlignment", "experimentId", "patternLength", "pattern",
                                                                         "out", "wait")
                             SELECT "id",
                                    "orderId",
                                    "type",
                                    "audioFile",
                                    "imageFile",
                                    "brightness",
                                    "x",
                                    "y",
                                    "width",
                                    "height",
                                    "manualAlignment",
                                    "horizontalAlignment",
                                    "verticalAlignment",
                                    "experimentId",
                                    "patternLength",
                                    "pattern",
                                    "out",
                                    "wait"
                             FROM "temporary_experiment_tvep_output_entity"`);
    await queryRunner.query(`DROP TABLE "temporary_experiment_tvep_output_entity"`);
    await queryRunner.query(`ALTER TABLE "experiment_tvep_entity"
      RENAME TO "temporary_experiment_tvep_entity"`);
    await queryRunner.query(`CREATE TABLE "experiment_tvep_entity"
                             (
                               "id"                 integer PRIMARY KEY NOT NULL,
                               "sharePatternLength" boolean             NOT NULL,
                               "outputCount"        integer             NOT NULL,
                               CONSTRAINT "REL_52cfe70d820cabed949681a46c" UNIQUE ("id")
                             )`);
    await queryRunner.query(`INSERT INTO "experiment_tvep_entity"("id", "sharePatternLength", "outputCount")
                             SELECT "id", "sharePatternLength", "outputCount"
                             FROM "temporary_experiment_tvep_entity"`);
    await queryRunner.query(`DROP TABLE "temporary_experiment_tvep_entity"`);
    await queryRunner.query(`ALTER TABLE "experiment_rea_output_entity"
      RENAME TO "temporary_experiment_rea_output_entity"`);
    await queryRunner.query(`CREATE TABLE "experiment_rea_output_entity"
                             (
                               "id"                  integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                               "orderId"             integer                           NOT NULL,
                               "type"                integer                           NOT NULL,
                               "audioFile"           text,
                               "imageFile"           text,
                               "brightness"          integer                           NOT NULL,
                               "x"                   integer,
                               "y"                   integer,
                               "width"               integer,
                               "height"              integer,
                               "manualAlignment"     boolean,
                               "horizontalAlignment" integer                           NOT NULL DEFAULT (1),
                               "verticalAlignment"   integer                           NOT NULL DEFAULT (1),
                               "experimentId"        integer                           NOT NULL
                             )`);
    await queryRunner.query(`INSERT INTO "experiment_rea_output_entity"("id", "orderId", "type", "audioFile", "imageFile", "brightness", "x", "y", "width", "height",
                                                                        "manualAlignment", "horizontalAlignment", "verticalAlignment", "experimentId")
                             SELECT "id",
                                    "orderId",
                                    "type",
                                    "audioFile",
                                    "imageFile",
                                    "brightness",
                                    "x",
                                    "y",
                                    "width",
                                    "height",
                                    "manualAlignment",
                                    "horizontalAlignment",
                                    "verticalAlignment",
                                    "experimentId"
                             FROM "temporary_experiment_rea_output_entity"`);
    await queryRunner.query(`DROP TABLE "temporary_experiment_rea_output_entity"`);
    await queryRunner.query(`ALTER TABLE "experiment_rea_entity"
      RENAME TO "temporary_experiment_rea_entity"`);
    await queryRunner.query(`CREATE TABLE "experiment_rea_entity"
                             (
                               "id"          integer PRIMARY KEY NOT NULL,
                               "outputCount" integer             NOT NULL,
                               "audioFile"   text,
                               "imageFile"   text,
                               "cycleCount"  integer             NOT NULL,
                               "waitTimeMin" integer             NOT NULL,
                               "waitTimeMax" integer             NOT NULL,
                               "missTime"    integer             NOT NULL,
                               "onFail"      integer             NOT NULL,
                               "brightness"  integer             NOT NULL,
                               CONSTRAINT "REL_9804d980a06170e207556b2990" UNIQUE ("id")
                             )`);
    await queryRunner.query(`INSERT INTO "experiment_rea_entity"("id", "outputCount", "audioFile", "imageFile", "cycleCount", "waitTimeMin", "waitTimeMax", "missTime", "onFail",
                                                                 "brightness")
                             SELECT "id",
                                    "outputCount",
                                    "audioFile",
                                    "imageFile",
                                    "cycleCount",
                                    "waitTimeMin",
                                    "waitTimeMax",
                                    "missTime",
                                    "onFail",
                                    "brightness"
                             FROM "temporary_experiment_rea_entity"`);
    await queryRunner.query(`DROP TABLE "temporary_experiment_rea_entity"`);
    await queryRunner.query(`ALTER TABLE "experiment_fvep_output_entity"
      RENAME TO "temporary_experiment_fvep_output_entity"`);
    await queryRunner.query(`CREATE TABLE "experiment_fvep_output_entity"
                             (
                               "id"                  integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                               "orderId"             integer                           NOT NULL,
                               "type"                integer                           NOT NULL,
                               "audioFile"           text,
                               "imageFile"           text,
                               "brightness"          integer                           NOT NULL,
                               "x"                   integer,
                               "y"                   integer,
                               "width"               integer,
                               "height"              integer,
                               "manualAlignment"     boolean,
                               "horizontalAlignment" integer                           NOT NULL DEFAULT (1),
                               "verticalAlignment"   integer                           NOT NULL DEFAULT (1),
                               "experimentId"        integer                           NOT NULL,
                               "timeOn"              integer                           NOT NULL,
                               "timeOff"             integer                           NOT NULL,
                               "frequency"           integer                           NOT NULL,
                               "dutyCycle"           integer                           NOT NULL
                             )`);
    await queryRunner.query(`INSERT INTO "experiment_fvep_output_entity"("id", "orderId", "type", "audioFile", "imageFile", "brightness", "x", "y", "width", "height",
                                                                         "manualAlignment", "horizontalAlignment", "verticalAlignment", "experimentId", "timeOn", "timeOff",
                                                                         "frequency", "dutyCycle")
                             SELECT "id",
                                    "orderId",
                                    "type",
                                    "audioFile",
                                    "imageFile",
                                    "brightness",
                                    "x",
                                    "y",
                                    "width",
                                    "height",
                                    "manualAlignment",
                                    "horizontalAlignment",
                                    "verticalAlignment",
                                    "experimentId",
                                    "timeOn",
                                    "timeOff",
                                    "frequency",
                                    "dutyCycle"
                             FROM "temporary_experiment_fvep_output_entity"`);
    await queryRunner.query(`DROP TABLE "temporary_experiment_fvep_output_entity"`);
    await queryRunner.query(`ALTER TABLE "experiment_fvep_entity"
      RENAME TO "temporary_experiment_fvep_entity"`);
    await queryRunner.query(`CREATE TABLE "experiment_fvep_entity"
                             (
                               "id"          integer PRIMARY KEY NOT NULL,
                               "outputCount" integer             NOT NULL,
                               CONSTRAINT "REL_e1fae7b1c4f7514dd366c998a2" UNIQUE ("id")
                             )`);
    await queryRunner.query(`INSERT INTO "experiment_fvep_entity"("id", "outputCount")
                             SELECT "id", "outputCount"
                             FROM "temporary_experiment_fvep_entity"`);
    await queryRunner.query(`DROP TABLE "temporary_experiment_fvep_entity"`);
    await queryRunner.query(`ALTER TABLE "experiment_erp_output_dependency_entity"
      RENAME TO "temporary_experiment_erp_output_dependency_entity"`);
    await queryRunner.query(`CREATE TABLE "experiment_erp_output_dependency_entity"
                             (
                               "id"           integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                               "experimentId" integer                           NOT NULL,
                               "sourceOutput" integer                           NOT NULL,
                               "destOutput"   integer                           NOT NULL,
                               "count"        integer                           NOT NULL,
                               "orderId"      integer,
                               CONSTRAINT "UQ_df8413927e003d6950c3445b13c" UNIQUE ("experimentId", "sourceOutput", "destOutput")
                             )`);
    await queryRunner.query(`INSERT INTO "experiment_erp_output_dependency_entity"("id", "experimentId", "sourceOutput", "destOutput", "count", "orderId")
                             SELECT "id", "experimentId", "sourceOutput", "destOutput", "count", "orderId"
                             FROM "temporary_experiment_erp_output_dependency_entity"`);
    await queryRunner.query(`DROP TABLE "temporary_experiment_erp_output_dependency_entity"`);
    await queryRunner.query(`ALTER TABLE "experiment_erp_output_entity"
      RENAME TO "temporary_experiment_erp_output_entity"`);
    await queryRunner.query(`CREATE TABLE "experiment_erp_output_entity"
                             (
                               "id"                  integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                               "orderId"             integer                           NOT NULL,
                               "type"                integer                           NOT NULL,
                               "audioFile"           text,
                               "imageFile"           text,
                               "brightness"          integer                           NOT NULL,
                               "x"                   integer,
                               "y"                   integer,
                               "width"               integer,
                               "height"              integer,
                               "manualAlignment"     boolean,
                               "horizontalAlignment" integer                           NOT NULL DEFAULT (1),
                               "verticalAlignment"   integer                           NOT NULL DEFAULT (1),
                               "experimentId"        integer                           NOT NULL,
                               "pulseUp"             integer                           NOT NULL,
                               "pulseDown"           integer                           NOT NULL,
                               "distribution"        integer                           NOT NULL
                             )`);
    await queryRunner.query(`INSERT INTO "experiment_erp_output_entity"("id", "orderId", "type", "audioFile", "imageFile", "brightness", "x", "y", "width", "height",
                                                                        "manualAlignment", "horizontalAlignment", "verticalAlignment", "experimentId", "pulseUp", "pulseDown",
                                                                        "distribution")
                             SELECT "id",
                                    "orderId",
                                    "type",
                                    "audioFile",
                                    "imageFile",
                                    "brightness",
                                    "x",
                                    "y",
                                    "width",
                                    "height",
                                    "manualAlignment",
                                    "horizontalAlignment",
                                    "verticalAlignment",
                                    "experimentId",
                                    "pulseUp",
                                    "pulseDown",
                                    "distribution"
                             FROM "temporary_experiment_erp_output_entity"`);
    await queryRunner.query(`DROP TABLE "temporary_experiment_erp_output_entity"`);
    await queryRunner.query(`ALTER TABLE "experiment_erp_entity"
      RENAME TO "temporary_experiment_erp_entity"`);
    await queryRunner.query(`CREATE TABLE "experiment_erp_entity"
                             (
                               "id"              integer PRIMARY KEY NOT NULL,
                               "outputCount"     integer             NOT NULL,
                               "maxDistribution" integer             NOT NULL,
                               "out"             integer             NOT NULL,
                               "wait"            integer             NOT NULL,
                               "edge"            integer             NOT NULL,
                               "random"          integer             NOT NULL,
                               "sequenceId"      integer,
                               CONSTRAINT "REL_b14f52e0162faf28f9b66b7123" UNIQUE ("id")
                             )`);
    await queryRunner.query(`INSERT INTO "experiment_erp_entity"("id", "outputCount", "maxDistribution", "out", "wait", "edge", "random", "sequenceId")
                             SELECT "id",
                                    "outputCount",
                                    "maxDistribution",
                                    "out",
                                    "wait",
                                    "edge",
                                    "random",
                                    "sequenceId"
                             FROM "temporary_experiment_erp_entity"`);
    await queryRunner.query(`DROP TABLE "temporary_experiment_erp_entity"`);
    await queryRunner.query(`ALTER TABLE "experiment_cvep_output_entity"
      RENAME TO "temporary_experiment_cvep_output_entity"`);
    await queryRunner.query(`CREATE TABLE "experiment_cvep_output_entity"
                             (
                               "id"                  integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                               "orderId"             integer                           NOT NULL,
                               "type"                integer                           NOT NULL,
                               "audioFile"           text,
                               "imageFile"           text,
                               "brightness"          integer                           NOT NULL,
                               "x"                   integer,
                               "y"                   integer,
                               "width"               integer,
                               "height"              integer,
                               "manualAlignment"     boolean,
                               "horizontalAlignment" integer                           NOT NULL DEFAULT (1),
                               "verticalAlignment"   integer                           NOT NULL DEFAULT (1),
                               "experimentId"        integer                           NOT NULL
                             )`);
    await queryRunner.query(`INSERT INTO "experiment_cvep_output_entity"("id", "orderId", "type", "audioFile", "imageFile", "brightness", "x", "y", "width", "height",
                                                                         "manualAlignment", "horizontalAlignment", "verticalAlignment", "experimentId")
                             SELECT "id",
                                    "orderId",
                                    "type",
                                    "audioFile",
                                    "imageFile",
                                    "brightness",
                                    "x",
                                    "y",
                                    "width",
                                    "height",
                                    "manualAlignment",
                                    "horizontalAlignment",
                                    "verticalAlignment",
                                    "experimentId"
                             FROM "temporary_experiment_cvep_output_entity"`);
    await queryRunner.query(`DROP TABLE "temporary_experiment_cvep_output_entity"`);
    await queryRunner.query(`ALTER TABLE "experiment_cvep_entity"
      RENAME TO "temporary_experiment_cvep_entity"`);
    await queryRunner.query(`CREATE TABLE "experiment_cvep_entity"
                             (
                               "id"          integer PRIMARY KEY NOT NULL,
                               "outputCount" integer             NOT NULL,
                               "audioFile"   text,
                               "imageFile"   text,
                               "out"         integer             NOT NULL,
                               "wait"        integer             NOT NULL,
                               "pattern"     integer             NOT NULL,
                               "bitShift"    integer             NOT NULL,
                               "brightness"  integer             NOT NULL,
                               CONSTRAINT "REL_6d6d0acf4186a677ad03c20fad" UNIQUE ("id")
                             )`);
    await queryRunner.query(`INSERT INTO "experiment_cvep_entity"("id", "outputCount", "audioFile", "imageFile", "out", "wait", "pattern", "bitShift", "brightness")
                             SELECT "id",
                                    "outputCount",
                                    "audioFile",
                                    "imageFile",
                                    "out",
                                    "wait",
                                    "pattern",
                                    "bitShift",
                                    "brightness"
                             FROM "temporary_experiment_cvep_entity"`);
    await queryRunner.query(`DROP TABLE "temporary_experiment_cvep_entity"`);
    await queryRunner.query(`DROP TABLE "user_entity"`);
    await queryRunner.query(`DROP TABLE "sequence_entity"`);
    await queryRunner.query(`DROP TABLE "experiment_stop_condition_entity"`);
    await queryRunner.query(`DROP TABLE "experiment_tvep_output_entity"`);
    await queryRunner.query(`DROP TABLE "experiment_tvep_entity"`);
    await queryRunner.query(`DROP TABLE "experiment_rea_output_entity"`);
    await queryRunner.query(`DROP TABLE "experiment_rea_entity"`);
    await queryRunner.query(`DROP TABLE "experiment_fvep_output_entity"`);
    await queryRunner.query(`DROP TABLE "experiment_fvep_entity"`);
    await queryRunner.query(`DROP TABLE "experiment_erp_output_dependency_entity"`);
    await queryRunner.query(`DROP TABLE "experiment_erp_output_entity"`);
    await queryRunner.query(`DROP TABLE "experiment_erp_entity"`);
    await queryRunner.query(`DROP TABLE "experiment_cvep_output_entity"`);
    await queryRunner.query(`DROP TABLE "experiment_cvep_entity"`);
    await queryRunner.query(`DROP TABLE "experiment_entity"`);
    await queryRunner.query(`DROP TABLE "experiment_result_entity"`);
    await queryRunner.query(`DROP TABLE "trigger_control"`);
    await queryRunner.query(`DROP TABLE "refresh_token_entity"`);
  }

}
