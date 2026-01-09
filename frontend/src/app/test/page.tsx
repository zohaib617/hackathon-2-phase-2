/**
 * Test page for TodoApp functionality.
 *
 * This page is used to test all the enhanced features we've implemented.
 */

"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { VoiceRecognition, parseVoiceCommand } from "@/lib/voiceRecognition";

export default function TestPage() {
  const [voiceActive, setVoiceActive] = useState(false);
  const [voiceMessage, setVoiceMessage] = useState("");
  const [voiceRecognition, setVoiceRecognition] = useState<VoiceRecognition | null>(null);
  const [testResults, setTestResults] = useState<string[]>([]);

  useEffect(() => {
    const vr = new VoiceRecognition();
    if (vr.isVoiceRecognitionSupported()) {
      setVoiceRecognition(vr);
    } else {
      setTestResults(prev => [...prev, "❌ Voice recognition not supported in this browser"]);
    }
  }, []);

  const handleVoiceCommand = () => {
    if (!voiceRecognition) {
      setVoiceMessage("Voice recognition is not supported in your browser");
      setTestResults(prev => [...prev, "❌ Voice recognition initialization failed"]);
      return;
    }

    if (voiceActive) {
      // Stop listening
      voiceRecognition.stopListening();
      setVoiceActive(false);
      setVoiceMessage("");
      setTestResults(prev => [...prev, "✅ Voice recognition stopped"]);
      return;
    }

    setVoiceActive(true);
    setVoiceMessage("Listening... Speak now");
    setTestResults(prev => [...prev, "✅ Voice recognition started"]);

    voiceRecognition.startListening(
      (result) => {
        if (result.isFinal) {
          setVoiceMessage(`Heard: "${result.transcript}"`);

          const command = parseVoiceCommand(result.transcript);
          if (command) {
            setTestResults(prev => [...prev, `✅ Command recognized: ${command.action} - "${command.title}"`]);
          } else {
            setTestResults(prev => [...prev, `ℹ️ Command not recognized: "${result.transcript}"`]);
          }

          // Stop listening after processing
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
        setTestResults(prev => [...prev, `❌ Voice recognition error: ${error}`]);
      },
      () => {
        setVoiceActive(false);
        setTestResults(prev => [...prev, "✅ Voice recognition session ended"]);
      }
    );
  };

  // Test command parsing
  const testCommandParsing = () => {
    const testCommands = [
      "Add task Buy groceries",
      "Create task Complete project",
      "Complete task Buy groceries",
      "Mark task Complete project as complete",
      "Delete task Buy groceries",
      "Remove task Complete project",
      "Set priority high for Complete project",
      "Invalid command test"
    ];

    const results: string[] = [];
    testCommands.forEach(cmd => {
      const parsed = parseVoiceCommand(cmd);
      if (parsed) {
        results.push(`✅ "${cmd}" → ${parsed.action} "${parsed.title}"${parsed.priority ? ` (priority: ${parsed.priority})` : ''}`);
      } else {
        results.push(`❌ "${cmd}" → Not recognized`);
      }
    });

    setTestResults(prev => [...prev, "Command parsing tests:", ...results]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent dark:from-primary-400 dark:to-accent-400">
            TodoApp Functionality Test
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mt-2">
            Test all enhanced features of the TodoApp
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Voice Recognition Test */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-800 dark:text-white">
                  Voice Recognition Test
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button
                    type="button"
                    variant={voiceActive ? "danger" : "primary"}
                    onClick={handleVoiceCommand}
                    className="w-full"
                  >
                    {voiceActive ? "Stop Listening" : "Start Voice Test"}
                  </Button>

                  {voiceMessage && (
                    <div className="p-3 bg-blue-100 text-blue-700 rounded-lg dark:bg-blue-900/30 dark:text-blue-300">
                      {voiceMessage}
                    </div>
                  )}

                  <div className="mt-4">
                    <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Test Commands:</h3>
                    <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                      <li>• "Add task [title]" or "Create task [title]"</li>
                      <li>• "Complete task [title]" or "Mark task [title] as complete"</li>
                      <li>• "Delete task [title]" or "Remove task [title]"</li>
                      <li>• "Set priority [low|medium|high] for [title]"</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Command Parsing Test */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-800 dark:text-white">
                  Command Parsing Test
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={testCommandParsing}
                    className="w-full"
                  >
                    Run Command Parsing Tests
                  </Button>

                  <div className="mt-4">
                    <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Expected Commands:</h3>
                    <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                      <li>• Add/Create tasks</li>
                      <li>• Complete tasks</li>
                      <li>• Delete/Remove tasks</li>
                      <li>• Set priority for tasks</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Test Results */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2"
          >
            <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-800 dark:text-white">
                  Test Results
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="max-h-96 overflow-y-auto">
                  {testResults.length === 0 ? (
                    <p className="text-gray-500 dark:text-gray-400 italic">
                      No tests run yet. Click the buttons above to run tests.
                    </p>
                  ) : (
                    <ul className="space-y-2">
                      {testResults.map((result, index) => (
                        <motion.li
                          key={index}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className={`p-2 rounded text-sm ${
                            result.includes('✅')
                              ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300'
                              : result.includes('❌')
                              ? 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300'
                              : result.includes('ℹ️')
                              ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300'
                              : 'bg-gray-50 text-gray-700 dark:bg-gray-700/50 dark:text-gray-300'
                          }`}
                        >
                          {result}
                        </motion.li>
                      ))}
                    </ul>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-8 text-center"
        >
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Feature Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
              <h3 className="font-semibold text-lg text-primary-600 dark:text-primary-400 mb-2">Dark Mode</h3>
              <p className="text-gray-600 dark:text-gray-400">Enhanced dark mode with proper contrast and styling</p>
            </div>
            <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
              <h3 className="font-semibold text-lg text-primary-600 dark:text-primary-400 mb-2">Animations</h3>
              <p className="text-gray-600 dark:text-gray-400">Framer Motion animations for smooth transitions</p>
            </div>
            <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
              <h3 className="font-semibold text-lg text-primary-600 dark:text-primary-400 mb-2">Voice Commands</h3>
              <p className="text-gray-600 dark:text-gray-400">Voice-to-text functionality for task management</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}