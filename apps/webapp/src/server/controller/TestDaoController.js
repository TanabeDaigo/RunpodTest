/**
 *
 * KronoMetro
 *
 * Copyright © 2024-present KronoMetro, Co. All rights reserved.
 *
 */
import { injectable } from "tsyringe";
import { AbstractObject as Abstract } from "@common/server";
import { logjs, models } from "@lib/server";

const log = new logjs("TestDaoController");

/**
 * DAOテスト用のコントローラークラス
 * 各DAOファイルのfind関数の動作確認を行う
 */
@injectable()
class TestDaoController extends Abstract {
  constructor() {
    super();
    log.debug("constructor START!!");
  }

  /**
   * AutoMakeItemsDaoのfind関数テスト
   */
  async find_AutoMakeItemsDao(req, dbjs) {
    log.debug("find_AutoMakeItemsDao");
    await this.useModules(["AutoMakeItemsDao"]);
    try {
      const result = await this.AutoMakeItemsDao.find(this.params);
      return { data: result, result: true };
    } catch (e) {
      log.error(e);
      return { error: e.message, result: false };
    }
  }

  /**
   * AutoMakeTestDaoのfind関数テスト
   */
  async find_AutoMakeTestDao(req, dbjs) {
    log.debug("find_AutoMakeTestDao");
    await this.useModules(["AutoMakeTestDao"]);
    try {
      const result = await this.AutoMakeTestDao.find(this.params);
      return { data: result, result: true };
    } catch (e) {
      log.error(e);
      return { error: e.message, result: false };
    }
  }

  /**
   * CategoriesDaoのfind関数テスト
   */
  async find_CategoriesDao(req, dbjs) {
    log.debug("find_CategoriesDao");
    await this.useModules(["CategoriesDao"]);
    try {
      const result = await this.CategoriesDao.find(this.params);
      return { data: result, result: true };
    } catch (e) {
      log.error(e);
      return { error: e.message, result: false };
    }
  }

  /**
   * CommonsDaoのfind関数テスト
   */
  async find_CommonsDao(req, dbjs) {
    log.debug("find_CommonsDao");
    await this.useModules(["CommonsDao"]);
    try {
      const result = await this.CommonsDao.find(this.params);
      return { data: result, result: true };
    } catch (e) {
      log.error(e);
      return { error: e.message, result: false };
    }
  }

  /**
   * ComponentExplansDaoのfind関数テスト
   */
  async find_ComponentExplansDao(req, dbjs) {
    log.debug("find_ComponentExplansDao");
    await this.useModules(["ComponentExplansDao"]);
    try {
      const result = await this.ComponentExplansDao.find(this.params);
      return { data: result, result: true };
    } catch (e) {
      log.error(e);
      return { error: e.message, result: false };
    }
  }

  /**
   * CompornentExplansDaoのfind関数テスト
   */
  async find_CompornentExplansDao(req, dbjs) {
    log.debug("find_CompornentExplansDao");
    await this.useModules(["CompornentExplansDao"]);
    try {
      const result = await this.CompornentExplansDao.find(this.params);
      return { data: result, result: true };
    } catch (e) {
      log.error(e);
      return { error: e.message, result: false };
    }
  }

  /**
   * DbmsDaoのfind関数テスト
   */
  async find_DbmsDao(req, dbjs) {
    log.debug("find_DbmsDao");
    await this.useModules(["DbmsDao"]);
    try {
      const result = await this.DbmsDao.find(this.params);
      return { data: result, result: true };
    } catch (e) {
      log.error(e);
      return { error: e.message, result: false };
    }
  }

  /**
   * IndustriesDaoのfind関数テスト
   */
  async find_IndustriesDao(req, dbjs) {
    log.debug("find_IndustriesDao");
    await this.useModules(["IndustriesDao"]);
    try {
      const result = await this.IndustriesDao.find(this.params);
      return { data: result, result: true };
    } catch (e) {
      log.error(e);
      return { error: e.message, result: false };
    }
  }

  /**
   * PrefecturesDaoのfind関数テスト
   */
  async find_PrefecturesDao(req, dbjs) {
    log.debug("find_PrefecturesDao");
    await this.useModules(["PrefecturesDao"]);
    try {
      const result = await this.PrefecturesDao.find(this.params);
      return { data: result, result: true };
    } catch (e) {
      log.error(e);
      return { error: e.message, result: false };
    }
  }

  /**
   * ProjectsDaoのfind関数テスト
   */
  async find_ProjectsDao(req, dbjs) {
    log.debug("find_ProjectsDao");
    await this.useModules(["ProjectsDao"]);
    try {
      const result = await this.ProjectsDao.find(this.params);
      return { data: result, result: true };
    } catch (e) {
      log.error(e);
      return { error: e.message, result: false };
    }
  }

  /**
   * SettingsDaoのfind関数テスト
   */
  async find_SettingsDao(req, dbjs) {
    log.debug("find_SettingsDao");
    await this.useModules(["SettingsDao"]);
    try {
      const result = await this.SettingsDao.find(this.params);
      return { data: result, result: true };
    } catch (e) {
      log.error(e);
      return { error: e.message, result: false };
    }
  }

  /**
   * SrcTemplatesDaoのfind関数テスト
   */
  async find_SrcTemplatesDao(req, dbjs) {
    log.debug("find_SrcTemplatesDao");
    await this.useModules(["SrcTemplatesDao"]);
    try {
      const result = await this.SrcTemplatesDao.find(this.params);
      return { data: result, result: true };
    } catch (e) {
      log.error(e);
      return { error: e.message, result: false };
    }
  }

  /**
   * StatusDaoのfind関数テスト
   */
  async find_StatusDao(req, dbjs) {
    log.debug("find_StatusDao");
    await this.useModules(["StatusDao"]);
    try {
      const result = await this.StatusDao.find(this.params);
      return { data: result, result: true };
    } catch (e) {
      log.error(e);
      return { error: e.message, result: false };
    }
  }

  /**
   * UnitTestDaoのfind関数テスト
   */
  async find_UnitTestDao(req, dbjs) {
    log.debug("find_UnitTestDao");
    await this.useModules(["UnitTestDao"]);
    try {
      const result = await this.UnitTestDao.find(this.params);
      return { data: result, result: true };
    } catch (e) {
      log.error(e);
      return { error: e.message, result: false };
    }
  }

  /**
   * UsersDaoのfind関数テスト
   */
  async find_UsersDao(req, dbjs) {
    log.debug("find_UsersDao");
    await this.useModules(["UsersDao"]);
    try {
      const result = await this.UsersDao.find(this.params);
      return { data: result, result: true };
    } catch (e) {
      log.error(e);
      return { error: e.message, result: false };
    }
  }
}

export default TestDaoController;
