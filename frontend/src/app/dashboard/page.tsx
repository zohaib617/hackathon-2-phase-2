/**
 * Dashboard page for TodoApp.
 *FARMAR MOSTION aded
 * Protected route that displays user's tasks and overview.
 */

"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion" ; 
import { useAuth } from "@/context/AuthProvider";
import AuthWrapper from "@/components/AuthWrapper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { taskService, Task, TaskPriority } from "@/services";
import TaskList from "@/components/TaskList";
import FilterControls from "@/components/FilterControls";
import SearchBar from "@/components/SearchBar";
import { VoiceRecognition, parseVoiceCommand } from "@/lib/voiceRecognition";

export default function DashboardPage() {
  const { user, isLoading, signOut } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTask, setNewTask] = useState({ title: "", description: "", priority: "medium" as TaskPriority });
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [voiceActive, setVoiceActive] = useState(false);
  const [voiceRecognition, setVoiceRecognition] = useState<VoiceRecognition | null>(null);
  const [voiceMessage, setVoiceMessage] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Initialize voice recognition on component mount
  useEffect(() => {
    const vr = new VoiceRecognition();
    if (vr.isVoiceRecognitionSupported()) {
      setVoiceRecognition(vr);
    }
  }, []);

  // Load tasks on component mount
  useEffect(() => {
    fetchTasks();
  }, []);

  // Calculate task statistics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.completed).length;
  const pendingTasks = totalTasks - completedTasks;

  // Filter and search tasks
  const filteredTasks = tasks.filter(task => {
    const matchesFilter = filter === "all" ||
                         (filter === "active" && !task.completed) ||
                         (filter === "completed" && task.completed);

    if (!searchQuery) return matchesFilter;

    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesFilter && matchesSearch;
  });

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await taskService.getTasks();
      setTasks(response.tasks);
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
      setError("Failed to load tasks. Please try again.");
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
        setError("Failed to update task. Please try again.");
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
        setError("Failed to create task. Please try again.");
      }
    }
  };

  const handleDelete = async (taskId: string) => {
    try {
      await taskService.deleteTask(taskId);
      setTasks(tasks.filter(task => task.id !== taskId));
    } catch (error) {
      console.error("Failed to delete task:", error);
      setError("Failed to delete task. Please try again.");
    }
  };

  const handleToggleComplete = async (task: Task) => {
    try {
      const updatedTask = await taskService.toggleTaskCompletion(task.id, !task.completed);
      setTasks(tasks.map(t => t.id === task.id ? updatedTask : t));
    } catch (error) {
      console.error("Failed to toggle task completion:", error);
      setError("Failed to update task. Please try again.");
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

  const handleVoiceCommand = () => {
    if (!voiceRecognition) {
      setVoiceMessage("Voice recognition is not supported in your browser");
      return;
    }

    if (voiceActive) {
      // Stop listening
      voiceRecognition.stopListening();
      setVoiceActive(false);
      setVoiceMessage("");
      return;
    }

    setVoiceActive(true);
    setVoiceMessage("Listening... Speak now");

    voiceRecognition.startListening(
      (result) => {
        if (result.isFinal) {
          setVoiceMessage(`Heard: "${result.transcript}"`);

          const command = parseVoiceCommand(result.transcript);
          if (command) {
            if (command.action === 'add') {
              // Create a new task
              setNewTask(prev => ({ ...prev, title: command.title }));
              setVoiceMessage(`Adding task: "${command.title}"`);
            } else if (command.action === 'complete') {
              // Find and complete a task
              const taskToComplete = tasks.find(task =>
                task.title.toLowerCase().includes(command.title.toLowerCase())
              );

              if (taskToComplete && !taskToComplete.completed) {
                handleToggleComplete(taskToComplete);
                setVoiceMessage(`Completing task: "${command.title}"`);
              } else if (taskToComplete && taskToComplete.completed) {
                setVoiceMessage(`Task "${command.title}" is already completed`);
              } else {
                setVoiceMessage(`Could not find task: "${command.title}"`);
              }
            }
          } else {
            setVoiceMessage(`Command not recognized: "${result.transcript}"`);
          }

          // Stop listening after processing the command
          setTimeout(() => {
            voiceRecognition.stopListening();
            setVoiceActive(false);
          }, 1000);
        }
      },
      (error) => {
        console.error("Voice recognition error:", error);
        setVoiceMessage(`Error: ${error}`);
        setVoiceActive(false);
      },
      () => {
        setVoiceActive(false);
        if (!voiceMessage.includes("Heard:") && !voiceMessage.includes("Error:")) {
          setVoiceMessage("");
        }
      }
    );
  };

  if (isLoading || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <AuthWrapper requireAuth={true} redirectTo="/login">
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-8">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-10"
          >
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent dark:from-primary-400 dark:to-accent-400">
              Welcome back, {user?.name || user?.email}!
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 mt-2">
              Here's what's happening with your tasks today.
            </p>
          </motion.div>

          {/* Dashboard Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              whileHover={{ y: -5 }}
              className="cursor-pointer"
            >
              <Card className="h-full bg-white dark:bg-gray-800 border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="pb-2">
                  <CardTitle className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                    All your tasks
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-blue-600 dark:text-blue-400">
                    {totalTasks}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Total Tasks</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              whileHover={{ y: -5 }}
              className="cursor-pointer"
            >
              <Card className="h-full bg-white dark:bg-gray-800 border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="pb-2">
                  <CardTitle className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                    Tasks finished
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-green-600 dark:text-green-400">
                    {completedTasks}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Completed</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              whileHover={{ y: -5 }}
              className="cursor-pointer"
            >
              <Card className="h-full bg-white dark:bg-gray-800 border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="pb-2">
                  <CardTitle className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                    Pending tasks
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-yellow-600 dark:text-yellow-400">
                    {pendingTasks}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Pending</p>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Task Creation Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-8"
          >
            <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl font-semibold text-gray-800 dark:text-white">
                  {editingTask ? "Edit Task" : "Create New Task"}
                </CardTitle>
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
                      <Button
                        type="submit"
                        className="flex-1"
                        isLoading={loading}
                      >
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

          {/* Task List Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xl font-semibold text-gray-800 dark:text-white">
                  Your Tasks
                </CardTitle>
                <div className="flex space-x-2">
                  <FilterControls filter={filter} onFilterChange={setFilter} />
                </div>
              </CardHeader>
              <CardContent>
                {error && (
                  <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg dark:bg-red-900/30 dark:text-red-300">
                    {error}
                  </div>
                )}

                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row gap-2 mb-4">
                    <SearchBar
                      searchQuery={searchQuery}
                      onSearchChange={setSearchQuery}
                      placeholder="Search tasks by title or description..."
                    />
                    {voiceRecognition && (
                      <Button
                        type="button"
                        variant={voiceActive ? "danger" : "outline"}
                        onClick={handleVoiceCommand}
                        className="whitespace-nowrap"
                      >
                        {voiceActive ? "Stop Listening" : "Voice Command"}
                      </Button>
                    )}
                  </div>

                  {voiceMessage && (
                    <div className="mb-4 p-3 bg-blue-100 text-blue-700 rounded-lg dark:bg-blue-900/30 dark:text-blue-300">
                      {voiceMessage}
                    </div>
                  )}

                  <TaskList
                    tasks={filteredTasks}
                    filter={filter}
                    loading={loading}
                    onToggleComplete={handleToggleComplete}
                    onDelete={handleDelete}
                    onEdit={handleEdit}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* User Profile and Logout */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-8 flex justify-end"
          >
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-accent-500 text-sm font-medium text-white">
                  {user?.name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                </div>
                <span className="text-gray-700 dark:text-gray-300 font-medium">
                  {user?.name || user?.email}
                </span>
              </div>
              <Button
                variant="outline"
                onClick={async () => {
                  try {
                    await signOut();
                    window.location.href = "/login";
                  } catch (error) {
                    console.error("Logout failed:", error);
                    // Still redirect to login even if logout API call fails
                    window.location.href = "/login";
                  }
                }}
              >
                Logout
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </AuthWrapper>
  );
}