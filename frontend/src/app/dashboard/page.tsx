/**
 * Dashboard page for TodoApp.
 * Enhanced with Professional UI/UX and Advanced Framer Motion Animations.
 */

"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
import { 
  LayoutDashboard, 
  CheckCircle2, 
  Clock, 
  Mic, 
  MicOff, 
  LogOut, 
  Search, 
  Calendar as CalendarIcon,
  AlertCircle
} from "lucide-react";

export default function DashboardPage() {
  const { user, isLoading, signOut } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [taskSubmitting, setTaskSubmitting] = useState(false);
  const [newTask, setNewTask] = useState({ title: "", description: "", priority: "medium" as TaskPriority });
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [voiceActive, setVoiceActive] = useState(false);
  const [voiceRecognition, setVoiceRecognition] = useState<VoiceRecognition | null>(null);
  const [voiceMessage, setVoiceMessage] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Initializations
  useEffect(() => {
    const vr = new VoiceRecognition();
    if (vr.isVoiceRecognitionSupported()) setVoiceRecognition(vr);
    fetchTasks();
  }, []);

  // Stats Logic
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.completed).length;
  const pendingTasks = totalTasks - completedTasks;

  const filteredTasks = tasks.filter(task => {
    const matchesFilter = filter === "all" ||
                         (filter === "active" && !task.completed) ||
                         (filter === "completed" && task.completed);
    if (!searchQuery) return matchesFilter;
    return matchesFilter && (
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await taskService.getTasks();
      setTasks(response.tasks);
    } catch (err) {
      setError("Failed to load tasks. Please refresh.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTaskSubmitting(true);
    try {
      if (editingTask) {
        const updated = await taskService.updateTask(editingTask.id, newTask);
        setTasks(tasks.map(t => t.id === updated.id ? updated : t));
        setEditingTask(null);
      } else {
        const created = await taskService.createTask(newTask);
        setTasks([created, ...tasks]);
      }
      setNewTask({ title: "", description: "", priority: "medium" });
    } catch (err) {
      setError("Submission failed.");
    } finally {
      setTaskSubmitting(false);
    }
  };

  const handleDelete = async (taskId: string) => {
    try {
      await taskService.deleteTask(taskId);
      setTasks(tasks.filter(t => t.id !== taskId));
    } catch (err) { setError("Delete failed."); }
  };

  const handleToggleComplete = async (task: Task) => {
    try {
      const updated = await taskService.toggleTaskCompletion(task.id, !task.completed);
      setTasks(tasks.map(t => t.id === task.id ? updated : t));
    } catch (err) { setError("Toggle failed."); }
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setNewTask({ title: task.title, description: task.description || "", priority: task.priority });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleVoiceCommand = () => {
    if (!voiceRecognition) return;
    if (voiceActive) {
      voiceRecognition.stopListening();
      setVoiceActive(false);
      return;
    }
    setVoiceActive(true);
    setVoiceMessage("Listening...");
    voiceRecognition.startListening(
      (result) => {
        if (result.isFinal) {
          const command = parseVoiceCommand(result.transcript);
          if (command?.action === 'add') {
            setNewTask(p => ({ ...p, title: command.title }));
            setVoiceMessage(`Added: ${command.title}`);
          }
          setTimeout(() => setVoiceActive(false), 1500);
        }
      },
      () => setVoiceActive(false),
      () => setVoiceActive(false)
    );
  };

  // Professional Loading State
  if (isLoading || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#fafafa] dark:bg-[#09090b]">
        <div className="flex flex-col items-center gap-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            className="h-12 w-12 rounded-full border-4 border-indigo-100 border-t-indigo-600"
          />
          <p className="text-sm font-medium text-gray-500 animate-pulse uppercase tracking-widest">Organizing Workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthWrapper requireAuth={true} redirectTo="/login">
      <div className="min-h-screen bg-[#fafafa] dark:bg-[#0b0b0f] text-gray-900 dark:text-gray-100">
        
        {/* Modern Glass Nav */}
        <nav className="sticky top-0 z-50 w-full border-b border-gray-200/50 dark:border-gray-800/50 bg-white/70 dark:bg-gray-950/70 backdrop-blur-xl">
          <div className="container mx-auto px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <LayoutDashboard className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-xl tracking-tight hidden sm:block">TodoApp <span className="text-indigo-600">Pro</span></span>
            </div>

            <div className="flex items-center gap-6">
              <div className="hidden md:flex flex-col items-end">
                <span className="text-sm font-bold leading-none">{user?.name || "Premium User"}</span>
                <span className="text-[10px] text-gray-500 font-medium uppercase tracking-tighter">Gold Plan</span>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => signOut()} 
                className="rounded-full hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30 transition-colors"
              >
                <LogOut className="h-4 w-4 mr-2" /> Logout
              </Button>
            </div>
          </div>
        </nav>

        <main className="container mx-auto px-6 py-10 max-w-7xl">
          
          {/* Stats Section with Hover Effects */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {[
              { label: "Total Tasks", val: totalTasks, icon: <CalendarIcon />, color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-950/30" },
              { label: "Completed", val: completedTasks, icon: <CheckCircle2 />, color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-950/30" },
              { label: "Pending", val: pendingTasks, icon: <Clock />, color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-950/30" },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -4 }}
              >
                <Card className="border-none shadow-sm ring-1 ring-gray-200 dark:ring-gray-800 bg-white dark:bg-gray-900/50">
                  <CardContent className="p-6 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">{stat.label}</p>
                      <h3 className={`text-3xl font-black mt-1 ${stat.color}`}>{stat.val}</h3>
                    </div>
                    <div className={`h-12 w-12 rounded-2xl ${stat.bg} flex items-center justify-center ${stat.color}`}>
                      {stat.icon}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            {/* Left Column: Fixed Creator */}
            <div className="lg:col-span-4">
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                <Card className="sticky top-28 border-none shadow-2xl bg-white dark:bg-gray-900 ring-1 ring-gray-200 dark:ring-gray-800">
                  <CardHeader className="border-b border-gray-100 dark:border-gray-800">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-indigo-600" />
                      {editingTask ? "Edit Workspace" : "Quick Add"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase text-gray-400 ml-1">Task Title</label>
                  <Input 
                    placeholder="What's the plan?" 
                    value={newTask.title} 
                    onChange={(e) => setNewTask({...newTask, title: e.target.value})} 
                    className="h-12 bg-gray-50 dark:bg-gray-950 border-none text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-indigo-500/50 transition-all"
                    required 
                  />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase text-gray-400 ml-1">Description</label>
                        <textarea
                          placeholder="Add more details..."
                          className="w-full rounded-xl border-none bg-gray-50 dark:bg-gray-950 p-4 text-sm focus:ring-2 focus:ring-indigo-500/50 min-h-[120px] transition-all outline-none"
                          value={newTask.description}
                          onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase text-gray-400 ml-1">Urgency</label>
                        <select
                          value={newTask.priority}
                          onChange={(e) => setNewTask({...newTask, priority: e.target.value as TaskPriority})}
                          className="w-full rounded-xl border-none bg-gray-50 dark:bg-gray-950 p-3 text-sm focus:ring-2 focus:ring-indigo-500 appearance-none cursor-pointer"
                        >
                          <option value="low">Low Priority</option>
                          <option value="medium">Medium Priority</option>
                          <option value="high">High Priority</option>
                        </select>
                      </div>
                      <Button className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-500/20 rounded-xl font-bold" isLoading={taskSubmitting}>
                        {editingTask ? "Update Task" : "Launch Task"}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Right Column: Dynamic Task Board */}
            <div className="lg:col-span-8">
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <div className="relative flex-1 group">
                   <Search className="absolute left-4 top-3.5 h-4 w-4 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                   <div className="w-full">
                     <SearchBar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
                   </div>
                </div>
                <div className="flex gap-2">
                  <FilterControls filter={filter} onFilterChange={setFilter} />
                  <Button 
                    variant={voiceActive ? "danger" : "outline"} 
                    onClick={handleVoiceCommand} 
                    className={`rounded-xl h-11 px-5 border-gray-200 dark:border-gray-800 ${voiceActive ? 'animate-pulse' : ''}`}
                  >
                    {voiceActive ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4 mr-2" />}
                    {!voiceActive && "Voice"}
                  </Button>
                </div>
              </div>

              {voiceMessage && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 flex items-center gap-2 text-xs font-bold text-indigo-600 bg-indigo-50 dark:bg-indigo-950/30 p-3 rounded-xl border border-indigo-100 dark:border-indigo-900/50">
                  <div className="h-1.5 w-1.5 rounded-full bg-indigo-600 animate-ping" />
                  {voiceMessage}
                </motion.div>
              )}

              {error && (
                <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl flex items-center gap-3 border border-red-100 text-sm font-medium">
                  <AlertCircle className="h-4 w-4" /> {error}
                </div>
              )}

              <AnimatePresence mode="popLayout">
                <motion.div
                  key={filter + searchQuery}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                >
                  <TaskList
                    tasks={filteredTasks}
                    filter={filter}
                    loading={loading}
                    onToggleComplete={handleToggleComplete}
                    onDelete={handleDelete}
                    onEdit={handleEdit}
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </main>
      </div>
    </AuthWrapper>
  );
}