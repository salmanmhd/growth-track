import React, { useState, useEffect } from 'react';
import { Calendar, Save, Edit, Check, X } from 'lucide-react';

interface WeeklyGoal {
  id: string;
  text: string;
  completed: boolean;
  category: string;
}

interface WeeklyPlan {
  id: string;
  weekStartDate: string;
  goals: WeeklyGoal[];
  notes: string;
  published: boolean;
}

interface WeeklyPlannerProps {
  darkMode: boolean;
}

const WeeklyPlanner: React.FC<WeeklyPlannerProps> = ({ darkMode }) => {
  const [plans, setPlans] = useState<WeeklyPlan[]>(() => {
    const savedPlans = localStorage.getItem('weeklyPlans');
    return savedPlans ? JSON.parse(savedPlans) : [];
  });
  
  const [currentWeekStartDate, setCurrentWeekStartDate] = useState<string>(() => {
    const today = new Date();
    const day = today.getDay(); // 0 is Sunday, 1 is Monday, etc.
    const diff = today.getDate() - day + (day === 0 ? -6 : 1); // Adjust to get Monday
    const monday = new Date(today.setDate(diff));
    return monday.toISOString().split('T')[0];
  });
  
  const [newGoal, setNewGoal] = useState('');
  const [goalCategory, setGoalCategory] = useState('personal');
  const [notes, setNotes] = useState('');
  const [currentPlan, setCurrentPlan] = useState<WeeklyPlan | null>(null);
  
  // Load current week's plan or create a new one
  useEffect(() => {
    const existingPlan = plans.find(plan => plan.weekStartDate === currentWeekStartDate);
    
    if (existingPlan) {
      setCurrentPlan(existingPlan);
      setNotes(existingPlan.notes);
    } else {
      const newPlan: WeeklyPlan = {
        id: Date.now().toString(),
        weekStartDate: currentWeekStartDate,
        goals: [],
        notes: '',
        published: false
      };
      setCurrentPlan(newPlan);
      setNotes('');
    }
  }, [currentWeekStartDate, plans]);

  useEffect(() => {
    localStorage.setItem('weeklyPlans', JSON.stringify(plans));
  }, [plans]);

  const handleAddGoal = () => {
    if (!newGoal.trim() || !currentPlan) return;
    
    const goal: WeeklyGoal = {
      id: Date.now().toString(),
      text: newGoal,
      completed: false,
      category: goalCategory
    };
    
    const updatedPlan = {
      ...currentPlan,
      goals: [...currentPlan.goals, goal]
    };
    
    updatePlan(updatedPlan);
    setNewGoal('');
  };

  const handleToggleGoal = (id: string) => {
    if (!currentPlan) return;
    
    const updatedGoals = currentPlan.goals.map(goal => 
      goal.id === id ? { ...goal, completed: !goal.completed } : goal
    );
    
    updatePlan({
      ...currentPlan,
      goals: updatedGoals
    });
  };

  const handleDeleteGoal = (id: string) => {
    if (!currentPlan) return;
    
    const updatedGoals = currentPlan.goals.filter(goal => goal.id !== id);
    
    updatePlan({
      ...currentPlan,
      goals: updatedGoals
    });
  };

  const handleSaveNotes = () => {
    if (!currentPlan) return;
    
    updatePlan({
      ...currentPlan,
      notes
    });
    
    alert('Notes saved successfully!');
  };

  const handlePublishPlan = () => {
    if (!currentPlan) return;
    
    updatePlan({
      ...currentPlan,
      published: true
    });
    
    alert('Weekly plan published successfully!');
  };

  const updatePlan = (updatedPlan: WeeklyPlan) => {
    const planIndex = plans.findIndex(plan => plan.weekStartDate === currentWeekStartDate);
    
    if (planIndex >= 0) {
      const updatedPlans = [...plans];
      updatedPlans[planIndex] = updatedPlan;
      setPlans(updatedPlans);
      setCurrentPlan(updatedPlan);
    } else {
      setPlans([...plans, updatedPlan]);
      setCurrentPlan(updatedPlan);
    }
  };

  const handleWeekChange = (direction: 'prev' | 'next') => {
    const currentDate = new Date(currentWeekStartDate);
    const newDate = new Date(currentDate);
    
    if (direction === 'prev') {
      newDate.setDate(currentDate.getDate() - 7);
    } else {
      newDate.setDate(currentDate.getDate() + 7);
    }
    
    setCurrentWeekStartDate(newDate.toISOString().split('T')[0]);
  };

  const getWeekDateRange = () => {
    const start = new Date(currentWeekStartDate);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    
    const formatDate = (date: Date) => {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };
    
    return `${formatDate(start)} - ${formatDate(end)}`;
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'personal': return darkMode ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-800';
      case 'work': return darkMode ? 'bg-purple-900 text-purple-200' : 'bg-purple-100 text-purple-800';
      case 'health': return darkMode ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-800';
      case 'learning': return darkMode ? 'bg-yellow-900 text-yellow-200' : 'bg-yellow-100 text-yellow-800';
      default: return darkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Weekly Planner</h1>
      
      <div className={`${darkMode ? 'bg-gray-800 text-white' : 'bg-white'} rounded-lg shadow-md p-6 mb-8`}>
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <Calendar className="mr-2" size={20} />
            <h2 className="text-xl font-semibold">Week of {getWeekDateRange()}</h2>
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={() => handleWeekChange('prev')}
              className={`px-3 py-1 border ${darkMode ? 'border-gray-600 hover:bg-gray-700' : 'border-gray-300 hover:bg-gray-50'} rounded-md`}
            >
              Previous Week
            </button>
            <button
              onClick={() => handleWeekChange('next')}
              className={`px-3 py-1 border ${darkMode ? 'border-gray-600 hover:bg-gray-700' : 'border-gray-300 hover:bg-gray-50'} rounded-md`}
            >
              Next Week
            </button>
          </div>
        </div>
        
        {currentPlan?.published && (
          <div className={`mb-6 p-3 ${darkMode ? 'bg-green-900 border-green-800 text-green-200' : 'bg-green-50 border-green-200 text-green-700'} border rounded-md flex items-center`}>
            <Check className="mr-2" size={18} />
            This week's plan has been published and finalized.
          </div>
        )}
        
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-3">Weekly Goals</h3>
          
          {!currentPlan?.published && (
            <div className="flex items-end gap-4 mb-4">
              <div className="flex-1">
                <label htmlFor="goal" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                  New Goal
                </label>
                <input
                  type="text"
                  id="goal"
                  className={`w-full p-3 border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'} rounded-md focus:ring-indigo-500 focus:border-indigo-500`}
                  value={newGoal}
                  onChange={(e) => setNewGoal(e.target.value)}
                  placeholder="Add a new goal for this week"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleAddGoal();
                  }}
                />
              </div>
              
              <div className="w-40">
                <label htmlFor="category" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                  Category
                </label>
                <select
                  id="category"
                  className={`w-full p-3 border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'} rounded-md focus:ring-indigo-500 focus:border-indigo-500`}
                  value={goalCategory}
                  onChange={(e) => setGoalCategory(e.target.value)}
                >
                  <option value="personal">Personal</option>
                  <option value="work">Work</option>
                  <option value="health">Health</option>
                  <option value="learning">Learning</option>
                </select>
              </div>
              
              <button
                onClick={handleAddGoal}
                className="px-4 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                disabled={currentPlan?.published}
              >
                Add Goal
              </button>
            </div>
          )}
          
          {currentPlan && currentPlan.goals.length === 0 ? (
            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} italic`}>No goals set for this week yet.</p>
          ) : (
            <div className="space-y-2">
              {currentPlan?.goals.map((goal) => (
                <div 
                  key={goal.id} 
                  className={`flex items-center justify-between p-3 border rounded-md ${
                    goal.completed 
                      ? darkMode 
                        ? 'bg-gray-700 border-gray-600' 
                        : 'bg-gray-50 border-gray-200'
                      : darkMode 
                        ? 'border-gray-600' 
                        : 'border-gray-300'
                  }`}
                >
                  <div className="flex items-center">
                    <button 
                      onClick={() => handleToggleGoal(goal.id)}
                      className="mr-3 focus:outline-none"
                      disabled={currentPlan.published}
                    >
                      {goal.completed ? (
                        <Check className="text-green-500" size={20} />
                      ) : (
                        <div className={`w-5 h-5 border-2 ${darkMode ? 'border-gray-500' : 'border-gray-300'} rounded-full`} />
                      )}
                    </button>
                    
                    <div>
                      <p className={`${goal.completed ? 'line-through ' + (darkMode ? 'text-gray-400' : 'text-gray-500') : ''}`}>
                        {goal.text}
                      </p>
                      <span className={`text-xs px-2 py-1 rounded-full mt-1 inline-block ${getCategoryColor(goal.category)}`}>
                        {goal.category}
                      </span>
                    </div>
                  </div>
                  
                  {!currentPlan.published && (
                    <button 
                      onClick={() => handleDeleteGoal(goal.id)}
                      className={`${darkMode ? 'text-gray-400 hover:text-red-400' : 'text-gray-400 hover:text-red-500'} focus:outline-none`}
                    >
                      <X size={18} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-medium">Notes & Reflections</h3>
            {!currentPlan?.published && (
              <button
                onClick={handleSaveNotes}
                className="flex items-center text-sm text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
              >
                <Save size={16} className="mr-1" />
                Save Notes
              </button>
            )}
          </div>
          
          <textarea
            className={`w-full p-3 border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'} rounded-md focus:ring-indigo-500 focus:border-indigo-500`}
            rows={5}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add notes, reflections, or additional details about your weekly plan..."
            disabled={currentPlan?.published}
          />
        </div>
        
        {!currentPlan?.published && (
          <button
            onClick={handlePublishPlan}
            className="w-full py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center justify-center"
          >
            <Check size={18} className="mr-2" />
            Publish & Finalize Weekly Plan
          </button>
        )}
      </div>
      
      <div className={`${darkMode ? 'bg-gray-800 text-white' : 'bg-white'} rounded-lg shadow-md p-6`}>
        <h2 className="text-xl font-semibold mb-4">Previous Weekly Plans</h2>
        
        {plans.filter(plan => plan.published).length === 0 ? (
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} italic`}>No published weekly plans yet.</p>
        ) : (
          <div className="space-y-4">
            {plans
              .filter(plan => plan.published)
              .sort((a, b) => new Date(b.weekStartDate).getTime() - new Date(a.weekStartDate).getTime())
              .map((plan) => {
                const start = new Date(plan.weekStartDate);
                const end = new Date(start);
                end.setDate(start.getDate() + 6);
                
                const formatDate = (date: Date) => {
                  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                };
                
                const weekRange = `${formatDate(start)} - ${formatDate(end)}`;
                const completedGoals = plan.goals.filter(goal => goal.completed).length;
                
                return (
                  <div key={plan.id} className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} pb-4`}>
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium">Week of {weekRange}</h3>
                      <button
                        onClick={() => setCurrentWeekStartDate(plan.weekStartDate)}
                        className="text-indigo-600 text-sm hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
                      >
                        <Edit size={16} className="inline mr-1" />
                        View
                      </button>
                    </div>
                    
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
                      Completed {completedGoals} of {plan.goals.length} goals
                    </p>
                  </div>
                );
              })}
          </div>
        )}
      </div>
    </div>
  );
};

export default WeeklyPlanner;