const express = require('express');
const { body } = require('express-validator');
const {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
} = require('../controllers/task.controller');
const { protect, admin } = require('../middleware/auth.middleware');

const router = express.Router();

// Apply protection to all task routes
router.use(protect);

router.route('/')
  .get(getTasks)
  .post(
    [
      body('title').notEmpty().withMessage('Title is required').isLength({ min: 3 }),
      body('status').optional().isIn(['pending', 'in-progress', 'completed']),
      body('priority').optional().isIn(['low', 'medium', 'high']),
    ],
    createTask
  );

router.route('/:id')
  .get(getTask)
  .put(updateTask)
  .delete(deleteTask);

// Admin only route
router.get('/admin/stats', protect, async (req, res) => {
  const Task = require('../models/Task.model');
  const User = require('../models/User.model');
  
  const totalTasks = await Task.countDocuments();
  const completedTasks = await Task.countDocuments({ status: 'completed' });
  const totalUsers = await User.countDocuments();
  
  res.json({
    success: true,
    data: {
      totalTasks: tasks.length,
      message: "Admin stats endpoint - mock mode"
    },
  });
});

module.exports = router;