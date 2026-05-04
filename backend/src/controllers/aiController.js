const aiService = require("../services/aiService");
const { successResponse } = require("../utils/response");

class AIController {
  async chat(req, res, next) {
    try {
      const { message, history } = req.body;
      const response = await aiService.chat(message, history || []);
      return successResponse(res, "AI response generated", { response });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AIController();
