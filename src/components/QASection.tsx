import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Send, Clock, Edit3 } from 'lucide-react';
import { useReflections } from '../hooks/useReflections';

const QASection: React.FC = () => {
  const { reflections, loading, addReflection, updateReflection } = useReflections();
  const [answers, setAnswers] = useState<{[key: string]: string}>({});
  const [editingId, setEditingId] = useState<string | null>(null);

  const questions = [
    "What did you learn about yourself today?",
    "What challenge pushed you outside your comfort zone this week?",
    "How has your mindset evolved since starting your kaizen journey?",
    "What would you tell someone just beginning their transformation?",
    "Which daily practice has had the most impact on your life?",
    "What breakthrough moment are you most proud of?",
    "How do you maintain discipline when motivation fades?",
    "What does mastery mean to you personally?"
  ];

  const handleAnswerChange = (question: string, value: string) => {
    setAnswers(prev => ({ ...prev, [question]: value }));
  };

  const handleSubmit = async (question: string) => {
    const answer = answers[question];
    if (!answer?.trim()) return;

    await addReflection(question, answer.trim());
    setAnswers(prev => ({ ...prev, [question]: '' }));
  };

  const handleEdit = async (id: string, newAnswer: string) => {
    if (!newAnswer?.trim()) return;
    
    await updateReflection(id, newAnswer.trim());
    setEditingId(null);
  };

  const getReflectionsForQuestion = (question: string) => {
    return reflections.filter(r => r.question === question);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-xl">
          <MessageCircle className="h-6 w-6 text-white" />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-white">Reflection Questions</h2>
          <p className="text-gray-400">Deepen your kaizen journey through thoughtful reflection</p>
        </div>
      </div>

      <div className="space-y-8">
        {questions.map((question, index) => {
          const questionReflections = getReflectionsForQuestion(question);
          
          return (
            <motion.div
              key={question}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="p-6 bg-gradient-to-br from-gray-900/50 to-slate-900/20 border border-cyan-500/20 rounded-2xl"
            >
              <h3 className="text-xl font-bold text-white mb-4">{question}</h3>
              
              {/* Answer Input */}
              <div className="mb-6">
                <textarea
                  value={answers[question] || ''}
                  onChange={(e) => handleAnswerChange(question, e.target.value)}
                  placeholder="Share your thoughts..."
                  className="w-full p-4 bg-gray-800/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors resize-none"
                  rows={4}
                />
                <div className="flex justify-end mt-3">
                  <button
                    onClick={() => handleSubmit(question)}
                    disabled={!answers[question]?.trim()}
                    className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold rounded-lg transition-all duration-200"
                  >
                    <Send className="h-4 w-4" />
                    Save Reflection
                  </button>
                </div>
              </div>

              {/* Previous Reflections */}
              {questionReflections.length > 0 && (
                <div>
                  <h4 className="text-lg font-semibold text-cyan-400 mb-4">Your Previous Reflections</h4>
                  <div className="space-y-4">
                    {questionReflections.map((reflection) => (
                      <div
                        key={reflection.id}
                        className="p-4 bg-black/20 border border-gray-600/30 rounded-lg"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2 text-sm text-gray-400">
                            <Clock className="h-4 w-4" />
                            {new Date(reflection.created_at).toLocaleDateString()}
                          </div>
                          <button
                            onClick={() => setEditingId(reflection.id)}
                            className="p-1 hover:bg-gray-700 rounded transition-colors"
                          >
                            <Edit3 className="h-4 w-4 text-gray-400 hover:text-white" />
                          </button>
                        </div>
                        
                        {editingId === reflection.id ? (
                          <div className="space-y-3">
                            <textarea
                              defaultValue={reflection.answer}
                              className="w-full p-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors resize-none"
                              rows={3}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' && e.ctrlKey) {
                                  handleEdit(reflection.id, e.currentTarget.value);
                                }
                              }}
                            />
                            <div className="flex gap-2">
                              <button
                                onClick={(e) => {
                                  const textarea = e.currentTarget.parentElement?.previousElementSibling as HTMLTextAreaElement;
                                  handleEdit(reflection.id, textarea.value);
                                }}
                                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg transition-colors"
                              >
                                Save
                              </button>
                              <button
                                onClick={() => setEditingId(null)}
                                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white text-sm rounded-lg transition-colors"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <p className="text-gray-300 leading-relaxed">{reflection.answer}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default QASection;