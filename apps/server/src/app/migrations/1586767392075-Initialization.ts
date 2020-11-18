import { Logger } from '@nestjs/common';
import { MigrationInterface, QueryRunner } from 'typeorm';

// noinspection JSUnusedGlobalSymbols
export class Initialization1586767392075 implements MigrationInterface {
  name = 'Initialization1586767392075';

  public async up(queryRunner: QueryRunner): Promise<any> {
    Logger.log('Inicializuji databázi...', 'Migrations');
    await queryRunner.query(
      `CREATE TABLE "experiment_entity" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" text(255) NOT NULL, "description" text(255), "type" text(255) NOT NULL, "usedOutputs" integer NOT NULL DEFAULT (1), "created" integer NOT NULL, "outputCount" integer NOT NULL DEFAULT (1), "tags" text, CONSTRAINT "UQ_ee4079d2bef9920490019a9c619" UNIQUE ("name"))`,
      undefined
    );
    await queryRunner.query(
      `CREATE TABLE "experiment_cvep_entity" ("id" integer PRIMARY KEY NOT NULL, "outputCount" integer NOT NULL, "audioFile" text, "imageFile" text, "out" integer NOT NULL, "wait" integer NOT NULL, "pattern" integer NOT NULL, "bitShift" integer NOT NULL, "brightness" integer NOT NULL)`,
      undefined
    );
    await queryRunner.query(
      `CREATE TABLE "experiment_erp_entity" ("id" integer PRIMARY KEY NOT NULL, "outputCount" integer NOT NULL, "maxDistribution" integer NOT NULL, "out" integer NOT NULL, "wait" integer NOT NULL, "edge" integer NOT NULL, "random" integer NOT NULL, "sequenceId" integer)`,
      undefined
    );
    await queryRunner.query(
      `CREATE TABLE "experiment_erp_output_entity" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "experimentId" integer NOT NULL, "orderId" integer NOT NULL, "type" integer NOT NULL, "audioFile" text, "imageFile" text, "pulseUp" integer NOT NULL, "pulseDown" integer NOT NULL, "distribution" integer NOT NULL, "brightness" integer NOT NULL, "experimentIdId" integer)`,
      undefined
    );
    await queryRunner.query(
      `CREATE TABLE "experiment_erp_output_dependency_entity" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "experimentId" integer NOT NULL, "sourceOutput" integer NOT NULL, "destOutput" integer NOT NULL, "count" integer NOT NULL, "experimentIdId" integer, "orderId" integer, CONSTRAINT "UQ_df8413927e003d6950c3445b13c" UNIQUE ("experimentId", "sourceOutput", "destOutput"))`,
      undefined
    );
    await queryRunner.query(`CREATE TABLE "experiment_fvep_entity" ("id" integer PRIMARY KEY NOT NULL, "outputCount" integer NOT NULL)`, undefined);
    await queryRunner.query(
      `CREATE TABLE "experiment_fvep_output_entity" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "experimentId" integer NOT NULL, "orderId" integer NOT NULL, "type" integer NOT NULL, "audioFile" text, "imageFile" text, "timeOn" integer NOT NULL, "timeOff" integer NOT NULL, "frequency" integer NOT NULL, "dutyCycle" integer NOT NULL, "brightness" integer NOT NULL, "experimentIdId" integer)`,
      undefined
    );
    await queryRunner.query(
      `CREATE TABLE "experiment_rea_entity" ("id" integer PRIMARY KEY NOT NULL, "outputCount" integer NOT NULL, "audioFile" text, "imageFile" text, "cycleCount" integer NOT NULL, "waitTimeMin" integer NOT NULL, "waitTimeMax" integer NOT NULL, "missTime" integer NOT NULL, "onFail" integer NOT NULL, "brightness" integer NOT NULL)`,
      undefined
    );
    await queryRunner.query(
      `CREATE TABLE "experiment_tvep_entity" ("id" integer PRIMARY KEY NOT NULL, "sharePatternLength" boolean NOT NULL, "outputCount" integer NOT NULL)`,
      undefined
    );
    await queryRunner.query(
      `CREATE TABLE "experiment_tvep_output_entity" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "experimentId" integer NOT NULL, "orderId" integer NOT NULL, "type" integer NOT NULL, "audioFile" text, "imageFile" text, "patternLength" integer NOT NULL, "pattern" integer NOT NULL, "out" integer NOT NULL, "wait" integer NOT NULL, "brightness" integer NOT NULL, "experimentIdId" integer)`,
      undefined
    );
    await queryRunner.query(
      `CREATE TABLE "experiment_result_entity" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "experimentID" integer NOT NULL, "name" text(255), "type" text(255) NOT NULL, "outputCount" integer NOT NULL, "date" integer NOT NULL, "filename" text NOT NULL, "experimentIDId" integer)`,
      undefined
    );
    await queryRunner.query(
      `CREATE TABLE "sequence_entity" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "experimentId" integer, "name" text(255) NOT NULL, "created" integer NOT NULL, "data" text NOT NULL, "size" integer NOT NULL, "tags" text NOT NULL, "experimentIdId" integer)`,
      undefined
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    Logger.log('Mažu všechny tabulky z databáze...', 'Migrations');
    await queryRunner.query(`DROP TABLE "sequence_entity"`, undefined);
    await queryRunner.query(`DROP TABLE "experiment_result_entity"`, undefined);
    await queryRunner.query(`DROP TABLE "experiment_tvep_output_entity"`, undefined);
    await queryRunner.query(`DROP TABLE "experiment_tvep_entity"`, undefined);
    await queryRunner.query(`DROP TABLE "experiment_rea_entity"`, undefined);
    await queryRunner.query(`DROP TABLE "experiment_fvep_output_entity"`, undefined);
    await queryRunner.query(`DROP TABLE "experiment_fvep_entity"`, undefined);
    await queryRunner.query(`DROP TABLE "experiment_erp_output_dependency_entity"`, undefined);
    await queryRunner.query(`DROP TABLE "experiment_erp_output_entity"`, undefined);
    await queryRunner.query(`DROP TABLE "experiment_erp_entity"`, undefined);
    await queryRunner.query(`DROP TABLE "experiment_cvep_entity"`, undefined);
    await queryRunner.query(`DROP TABLE "experiment_entity"`, undefined);
  }
}
