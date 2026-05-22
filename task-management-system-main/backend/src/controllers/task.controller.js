const Task = require('../models/Task.model');

// ================= GET ALL TASKS =================
const getTasks = async (req, res) => {
  try {

    let tasks;

    // Admin can see all tasks
    if (req.user.role === 'admin') {

      tasks = await Task.find()
        .populate('user', 'name email role');

    } else {

      // User sees only own tasks
      tasks = await Task.find({
        user: req.user.id
      });

    }

    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks
    });

  } catch (error) {

    console.error('Get Tasks Error:', error);

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ================= GET SINGLE TASK =================
const getTask = async (req, res) => {
  try {

    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    // Check ownership
    if (
      task.user.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    res.status(200).json({
      success: true,
      data: task
    });

  } catch (error) {

    console.error('Get Task Error:', error);

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ================= CREATE TASK =================
const createTask = async (req, res) => {
  try {

    const {
      title,
      description,
      status,
      priority,
      dueDate
    } = req.body;

    // Validation
    if (!title) {
      return res.status(400).json({
        success: false,
        message: 'Title is required'
      });
    }

    // Create task
    const task = await Task.create({

      title,

      description: description || '',

      status: status || 'pending',

      priority: priority || 'medium',

      dueDate: dueDate || null,

      user: req.user.id

    });

    console.log('Task created:', task._id);

    res.status(201).json({
      success: true,
      data: task
    });

  } catch (error) {

    console.error('Create Task Error:', error);

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ================= UPDATE TASK =================
const updateTask = async (req, res) => {
  try {

    let task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    // Check ownership
    if (
      task.user.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    // Update task
    task = await Task.findByIdAndUpdate(

      req.params.id,

      req.body,

      {
        new: true,
        runValidators: true
      }

    );

    res.status(200).json({
      success: true,
      data: task
    });

  } catch (error) {

    console.error('Update Task Error:', error);

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ================= DELETE TASK =================
const deleteTask = async (req, res) => {
  try {

    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    // Check ownership
    if (
      task.user.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    await task.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully'
    });

  } catch (error) {

    console.error('Delete Task Error:', error);

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask
};