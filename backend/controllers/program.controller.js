const programService = require("../services/program/program.service");
const programQueryService = require("../services/program/programQuery.service");
const programStructureService = require("../services/program/programStructure.service");
const programFileService = require("../services/program/programFile.service");
const programPublishService = require("../services/program/programPublish.service");
const programCloneService = require("../services/program/programClone.service");
const programImportService = require("../services/program/programImport.service");

class ProgramController {
  async create(req, res, next) {
    try {
      const program = await programService.createProgram(req.body.admin_id);
      return res.json(program);
    } catch (e) {
      next(e);
    }
  }

  async getAll(req, res, next) {
    try {
      const programs = await programQueryService.getAllPrograms();
      return res.json(programs);
    } catch (e) {
      next(e);
    }
  }

  async getAllPublishedPrograms(req, res, next) {
    try {
      const programs = await programQueryService.getPublishedPrograms();
      return res.json(programs);
    } catch (e) {
      next(e);
    }
  }

  async getAllDraftPrograms(req, res, next) {
    try {
      const programs = await programQueryService.getDraftPrograms();
      return res.json(programs);
    } catch (e) {
      next(e);
    }
  }

  async getOne(req, res, next) {
    try {
      const program = await programQueryService.getProgramFull(
          req.params.programId
      );

      return res.json(program);
    } catch (e) {
      next(e);
    }
  }

  async updatePartial(req, res, next) {
    try {
      const program = await programService.updateProgramPartial(
          req.params.programId,
          req.body
      );

      return res.json(program);
    } catch (e) {
      next(e);
    }
  }

  async deleteProgram(req, res, next) {
    try {
      const result = await programService.deleteProgram(
          req.params.programId
      );

      return res.json(result);
    } catch (e) {
      next(e);
    }
  }

  async importProgramZip(req, res, next) {
    try {
      const program = await programImportService.importProgramZip({
        programId: req.params.programId,
        zipFile: req.files?.zip,
        resetProgram: req.body.resetProgram === "true",
      });

      return res.json(program);
    } catch (e) {
      next(e);
    }
  }

  async duplicateProgram(req, res, next) {
    try {
      const program = await programCloneService.duplicateProgram(
          req.params.programId
      );

      return res.json(program);
    } catch (e) {
      next(e);
    }
  }

  async publishProgram(req, res, next) {
    try {
      const result = await programPublishService.publishProgram(
          req.params.programId
      );

      return res.json(result);
    } catch (e) {
      next(e);
    }
  }

  async updateImage(req, res, next) {
    try {
      const result = await programFileService.updateProgramImage(
          req.params.programId,
          req.files?.img
      );

      return res.json(result);
    } catch (e) {
      next(e);
    }
  }

  async destroyImage(req, res, next) {
    try {
      const result = await programFileService.deleteProgramImage(
          req.params.programId
      );

      return res.json(result);
    } catch (e) {
      next(e);
    }
  }

  async createTheme(req, res, next) {
    try {
      const theme = await programStructureService.createTheme(
          req.params.programId
      );

      return res.json(theme);
    } catch (e) {
      next(e);
    }
  }

  async getOneTheme(req, res, next) {
    try {
      const theme = await programStructureService.getOneTheme(
          req.params.themeId
      );

      return res.json(theme);
    } catch (e) {
      next(e);
    }
  }

  async updateThemeTitle(req, res, next) {
    try {
      const theme = await programStructureService.updateThemeTitle(
          req.params.themeId,
          req.body.title
      );

      return res.json(theme);
    } catch (e) {
      next(e);
    }
  }

  async deleteTheme(req, res, next) {
    try {
      const result = await programStructureService.deleteTheme(
          req.params.themeId
      );

      return res.json(result);
    } catch (e) {
      next(e);
    }
  }

  async createPunct(req, res, next) {
    try {

      const punct = await programStructureService.createPunct(
          req.params.themeId
      );

      return res.json(punct);
    } catch (e) {
      next(e);
    }
  }

  async getOnePunct(req, res, next) {
    try {
      const punct = await programStructureService.getOnePunct(
          req.params.punctId
      );

      return res.json(punct);
    } catch (e) {
      next(e);
    }
  }

  async updatePunctTitle(req, res, next) {
    try {
      const punct = await programStructureService.updatePunctTitle(
          req.params.punctId,
          req.body.title
      );

      return res.json(punct);
    } catch (e) {
      next(e);
    }
  }

  async updatePunctDescription(req, res, next) {
    try {
      const punct = await programStructureService.updatePunctDescription(
          req.params.punctId,
          req.body.description
      );

      return res.json(punct);
    } catch (e) {
      next(e);
    }
  }

  async deletePunct(req, res, next) {
    try {
      const result = await programStructureService.deletePunct(
          req.params.punctId
      );

      return res.json(result);
    } catch (e) {
      next(e);
    }
  }

  async movePunct(req, res, next) {
    try {
      const result = await programStructureService.movePunct({
        punctId: req.params.punctId,
        themeId: req.body.themeId,
        newIndex: req.body.newIndex,
      });

      return res.json(result);
    } catch (e) {
      next(e);
    }
  }

  async addFileToPunctOrTheme(req, res, next) {
    try {
      const result = await programFileService.addFileToPunctOrTheme({
        body: req.body,
        files: req.files,
      });

      return res.json(result);
    } catch (e) {
      next(e);
    }
  }

  async getFile(req, res, next) {
    try {
      console.log('первое')
      const file = await programFileService.getFile(req.params.fileId);
      return res.json(file);
    } catch (e) {
      next(e);
    }
  }

  async updateFileName(req, res, next) {
    try {
      const result = await programFileService.updateFileName(
          req.params.fileId,
          req.body.original_name
      );

      return res.json(result);
    } catch (e) {
      next(e);
    }
  }

  async moveFile(req, res, next) {
    try {
      const result = await programFileService.moveFile({
        fileId: req.params.fileId,
        newIndex: req.body.newIndex,
        targetType: req.body.targetType,
        targetId: req.body.targetId,
      });

      return res.json(result);
    } catch (e) {
      next(e);
    }
  }

  async deleteFile(req, res, next) {
    try {
      const result = await programFileService.deleteFile(
          req.params.fileId
      );

      return res.json(result);
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new ProgramController();