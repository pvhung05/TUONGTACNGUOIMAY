const dashboardService = require('./dashboardService');
const logger = require('../../logger');

class DashboardController {
  async getDashboard(req, res, next) {
    try {
      const dashboardData = await dashboardService.getDashboardData(req.userId);

      res.status(200).json({
        success: true,
        message: 'Dashboard data retrieved',
        data: dashboardData,
      });
    } catch (error) {
      logger.error('Get dashboard controller error:', error.message);
      next(error);
    }
  }
}

module.exports = new DashboardController();
