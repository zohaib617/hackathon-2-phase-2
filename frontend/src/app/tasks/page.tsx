/**
 * Tasks page for TodoApp.
 *
 * Displays user's tasks with CRUD operations and filtering capabilities.
 */

"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { taskService, Task, TaskPriority } from "@/services";
import AuthWrapper from "@/components/AuthWrapper";
import Spinner from "@/components/ui/Spinner";

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTask, setNewTask] = useState({ title: "", description: "", priority: "medium" as TaskPriority });
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");

  // Load tasks on component mount
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await taskService.getTasks();
      setTasks(response.tasks);
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editingTask) {
      // Update existing task
      try {
        const updatedTask = await taskService.updateTask(editingTask.id, {
          title: newTask.title,
          description: newTask.description,
          priority: newTask.priority
        });

        setTasks(tasks.map(t => t.id === updatedTask.id ? updatedTask : t));
        setEditingTask(null);
        setNewTask({ title: "", description: "", priority: "medium" });
      } catch (error) {
        console.error("Failed to update task:", error);
      }
    } else {
      // Create new task
      try {
        const createdTask = await taskService.createTask({
          title: newTask.title,
          description: newTask.description,
          priority: newTask.priority
        });

        setTasks([...tasks, createdTask]);
        setNewTask({ title: "", description: "", priority: "medium" });
      } catch (error) {
        console.error("Failed to create task:", error);
      }
    }
  };

  const handleDelete = async (taskId: string) => {
    try {
      await taskService.deleteTask(taskId);
      setTasks(tasks.filter(task => task.id !== taskId));
    } catch (error) {
        console.error("Failed to delete task:", error);
    }
  };

  const handleToggleComplete = async (task: Task) => {
    try {
      const updatedTask = await taskService.toggleTaskCompletion(task.id, !task.completed);
      setTasks(tasks.map(t => t.id === task.id ? updatedTask : t));
    } catch (error) {
      console.error("Failed to toggle task completion:", error);
    }
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setNewTask({
      title: task.title,
      description: task.description || "",
      priority: task.priority
    });
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === "active") return !task.completed;
    if (filter === "completed") return task.completed;
    return true;
  });

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <AuthWrapper requireAuth={true} redirectTo="/login">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">My Tasks</h1>
          <p className="text-gray-600 dark:text-gray-300">
            Manage your tasks efficiently
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Task Creation Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>{editingTask ? "Edit Task" : "Create New Task"}</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit}>
                  <div className="space-y-4">
                    <Input
                      label="Task Title"
                      value={newTask.title}
                      onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                      placeholder="What needs to be done?"
                      required
                    />
                    <Input
                      label="Description"
                      value={newTask.description}
                      onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                      placeholder="Add details..."
                    />
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Priority
                      </label>
                      <select
                        value={newTask.priority}
                        onChange={(e) => setNewTask({...newTask, priority: e.target.value as TaskPriority})}
                        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </div>
                    <div className="flex space-x-2 pt-4">
                      <Button type="submit" className="flex-1">
                        {editingTask ? "Update Task" : "Add Task"}
                      </Button>
                      {editingTask && (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setEditingTask(null);
                            setNewTask({ title: "", description: "", priority: "medium" });
                          }}
                        >
                          Cancel
                        </Button>
                      )}
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          {/* Task List */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Task List</CardTitle>
                <div className="flex space-x-2">
                  <Button
                    variant={filter === "all" ? "primary" : "outline"}
                    size="sm"
                    onClick={() => setFilter("all")}
                  >
                    All
                  </Button>
                  <Button
                    variant={filter === "active" ? "primary" : "outline"}
                    size="sm"
                    onClick={() => setFilter("active")}
                  >
                    Active
                  </Button>
                  <Button
                    variant={filter === "completed" ? "primary" : "outline"}
                    size="sm"
                    onClick={() => setFilter("completed")}
                  >
                    Completed
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <AnimatePresence>
                    {filteredTasks.length === 0 ? (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="py-8 text-center text-gray-500 dark:text-gray-400"
                      >
                        {filter === "completed"
                          ? "No completed tasks yet"
                          : filter === "active"
                          ? "No active tasks - great job!"
                          : "No tasks yet - add one above!"}
                      </motion.div>
                    ) : (
                      filteredTasks.map((task) => (
                        <motion.div
                          key={task.id}
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          layout
                          className={`rounded-lg border p-4 ${
                            task.completed
                              ? "border-green-200 bg-green-50 dark:border-green-800/50 dark:bg-green-900/20"
                              : "border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800"
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-start space-x-3">
                              <input
                                type="checkbox"
                                checked={task.completed}
                                onChange={() => handleToggleComplete(task)}
                                className="mt-1 h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                              />
                              <div>
                                <h3
                                  className={`font-medium ${
                                    task.completed
                                      ? "text-gray-500 line-through dark:text-gray-400"
                                      : "text-gray-800 dark:text-gray-200"
                                  }`}
                                >
                                  {task.title}
                                </h3>
                                {task.description && (
                                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                    {task.description}
                                  </p>
                                )}
                                <div className="mt-2 flex items-center space-x-4">
                                  <span
                                    className={`rounded-full px-2 py-1 text-xs font-medium ${
                                      task.priority === "high"
                                        ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                                        : task.priority === "medium"
                                        ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                                        : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                    }`}
                                  >
                                    {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} priority
                                  </span>
                                  <span className="text-xs text-gray-500 dark:text-gray-400">
                                    Due: {task.due_date ? new Date(task.due_date).toLocaleDateString() : "No due date"}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEdit(task)}
                              >
                                Edit
                              </Button>
                              <Button
                                variant="danger"
                                size="sm"
                                onClick={() => handleDelete(task.id)}
                              >
                                Delete
                              </Button>
                            </div>
                          </div>
                        </motion.div>
                      ))
                    )}
                  </AnimatePresence>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </AuthWrapper>
  );
}