const express = require('express');
const router = express.Router();

/**
 * In-memory task storage.
 * Initialized with a default task as specified in Practical 4 requirements.
 */
let tasks = [
  { id: 1, title: 'Learn Node.js', completed: false }
];

/**
 * Auto-incrementing identifier counter to ensure IDs are unique
 * and never reused even after task deletion.
 */
let nextId = 2;

/**
 * Helper function to validate and parse task IDs from URL parameters.
 * Returns the parsed integer if valid, or null if invalid.
 */
function parseAndValidateId(idParam) {
  if (!idParam || !/^\d+$/.test(idParam.trim())) {
    return null;
  }
  const id = parseInt(idParam.trim(), 10);
  if (id <= 0 || !Number.isSafeInteger(id)) {
    return null;
  }
  return id;
}

/**
 * GET /tasks
 * Return all tasks.
 */
router.get('/', (req, res) => {
  return res.status(200).json({
    success: true,
    count: tasks.length,
    data: tasks
  });
});

/**
 * GET /tasks/:id
 * Return a specific task by its unique ID.
 */
router.get('/:id', (req, res) => {
  const id = parseAndValidateId(req.params.id);
  if (id === null) {
    return res.status(400).json({
      success: false,
      message: 'Invalid task ID. ID must be a positive integer.'
    });
  }

  const task = tasks.find((t) => t.id === id);
  if (!task) {
    return res.status(404).json({
      success: false,
      message: `Task with ID ${id} not found.`
    });
  }

  return res.status(200).json({
    success: true,
    data: task
  });
});

/**
 * POST /tasks
 * Create a new task.
 */
router.post('/', (req, res) => {
  const { title, completed } = req.body || {};

  // Validate title: required, must be string, cannot be empty or whitespace only
  if (title === undefined || typeof title !== 'string' || title.trim().length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Title is required and must be a non-empty string.'
    });
  }

  // Validate completed: optional, but if provided must be boolean
  if (completed !== undefined && typeof completed !== 'boolean') {
    return res.status(400).json({
      success: false,
      message: 'Completed status must be a boolean (true or false).'
    });
  }

  const newTask = {
    id: nextId++,
    title: title.trim(),
    completed: completed === true
  };

  tasks.push(newTask);

  return res.status(201).json({
    success: true,
    message: 'Task created successfully.',
    data: newTask
  });
});

/**
 * PUT /tasks/:id
 * Update an existing task.
 */
router.put('/:id', (req, res) => {
  const id = parseAndValidateId(req.params.id);
  if (id === null) {
    return res.status(400).json({
      success: false,
      message: 'Invalid task ID. ID must be a positive integer.'
    });
  }

  const taskIndex = tasks.findIndex((t) => t.id === id);
  if (taskIndex === -1) {
    return res.status(404).json({
      success: false,
      message: `Task with ID ${id} not found.`
    });
  }

  const { title, completed } = req.body || {};

  // Check that at least one field to update is provided
  if (title === undefined && completed === undefined) {
    return res.status(400).json({
      success: false,
      message: "At least one field ('title' or 'completed') must be provided to update."
    });
  }

  // Validate title if provided
  if (title !== undefined) {
    if (typeof title !== 'string' || title.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Title must be a non-empty string.'
      });
    }
  }

  // Validate completed if provided
  if (completed !== undefined) {
    if (typeof completed !== 'boolean') {
      return res.status(400).json({
        success: false,
        message: 'Completed status must be a boolean (true or false).'
      });
    }
  }

  // Apply updates
  if (title !== undefined) {
    tasks[taskIndex].title = title.trim();
  }
  if (completed !== undefined) {
    tasks[taskIndex].completed = completed;
  }

  return res.status(200).json({
    success: true,
    message: 'Task updated successfully.',
    data: tasks[taskIndex]
  });
});

/**
 * DELETE /tasks/:id
 * Delete an existing task.
 */
router.delete('/:id', (req, res) => {
  const id = parseAndValidateId(req.params.id);
  if (id === null) {
    return res.status(400).json({
      success: false,
      message: 'Invalid task ID. ID must be a positive integer.'
    });
  }

  const taskIndex = tasks.findIndex((t) => t.id === id);
  if (taskIndex === -1) {
    return res.status(404).json({
      success: false,
      message: `Task with ID ${id} not found.`
    });
  }

  const [deletedTask] = tasks.splice(taskIndex, 1);

  return res.status(200).json({
    success: true,
    message: 'Task deleted successfully.',
    data: deletedTask
  });
});

module.exports = router;
