import React, { useState, useEffect } from 'react';
import { Calendar, CheckSquare, Brain, BarChart3, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface DashboardStats {
  negativeThoughts: number;
  negativeThoughtOccurrences: number;
  completedTodos: number;
  totalTodos: number;
  averageRating: number;
  weeklyPlanPublished: boolean;
  performanceScore: number;
}

interface DashboardProps {
  darkMode: boolean;
}

const Dashboard: React.FC<DashboardProps> = ({ darkMode }) => {
  const [stats, setStats] = useState<DashboardStats>({
    negativeThoughts: 0,
    negativeThoughtOccurrences: 0,
    completedTodos: 0,
    totalTodos: 0,
    averageRating: 0,
    weeklyPlanPublished: false,
    performanceScore: 0
  });
  
  useEffect(() => {
    // Load data from localStorage
    const negativeThoughts = JSON.parse(localStorage.getItem('negativeThoughts') || '[]');
    const todos = JSON.parse(localStorage.getItem('todos') || '[]');
    const dailyRatings = JSON.parse(localStorage.getItem('dailyRatings') || '[]');
    const weeklyPlans = JSON.parse(localStorage.getItem('weeklyPlans') || '[]');
    
    // Calculate stats
    const completedTodos = todos.filter((todo: any) => todo.completed).length;
    
    // Get current week's start date
    const today = new Date();
    const day = today.getDay(); // 0 is Sunday, 1 is Monday, etc.
    const diff = today.getDate() - day + (day === 0 ? -6 : 1); // Adjust to get Monday
    const weekStartDate = new Date(today.setDate(diff)).toISOString().split('T')[0];
    
    // Check if weekly plan is published
    const currentWeekPlan = weeklyPlans.find((plan: any) => plan.weekStartDate === weekStartDate);
    const weeklyPlanPublished = currentWeekPlan ? currentWeekPlan.published : false;
    
    // Calculate average rating from last 7 days
    const last7Days = [...Array(7)].map((_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    });
    
    const recentRatings = dailyRatings.filter((rating: any) => 
      last7Days.includes(rating.date)
    );
    
    const averageRating = recentRatings.length > 0
      ? recentRatings.reduce((acc: number, rating: any) => acc + rating.rating, 0) / recentRatings.length
      : 0;
    
    // Calculate performance score
    let performanceScore = 0;
    
    // 1. Todo completion (3 points)
    const todoCompletionRate = todos.length > 0 ? completedTodos / todos.length : 0;
    performanceScore += todoCompletionRate * 3;
    
    // 2. Weekly plan published (2 points)
    if (weeklyPlanPublished) performanceScore += 2;
    
    // 3. Manual rating (3 points - scaled from 0-10 to 0-3)
    const todayRating = dailyRatings.find((rating: any) => 
      rating.date === new Date().toISOString().split('T')[0]
    );
    if (todayRating) {
      performanceScore += (todayRating.rating / 10) * 3;
    }
    
    // 4. Planning for tomorrow (2 points)
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowDate = tomorrow.toISOString().split('T')[0];
    
    const plannedForTomorrow = todos.some((todo: any) => {
      const todoDate = new Date(todo.date).toISOString().split('T')[0];
      return todoDate === tomorrowDate;
    });
    
    if (plannedForTomorrow) performanceScore += 2;
    
    // Calculate total occurrences of negative thoughts
    const negativeThoughtOccurrences = negativeThoughts.reduce((total: number, thought: any) => 
      total + (thought.count || 1), 0
    );
    
    setStats({
      negativeThoughts: negativeThoughts.length,
      negativeThoughtOccurrences,
      completedTodos,
      totalTodos: todos.length,
      averageRating: parseFloat(averageRating.toFixed(1)),
      weeklyPlanPublished,
      performanceScore: parseFloat(performanceScore.toFixed(1))
    });
  }, []);

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className={`${darkMode ? 'bg-gray-800 text-white' : 'bg-white'} rounded-lg shadow-md p-6`}>
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-semibold mb-4">Today's Performance</h2>
              <div className="flex items-baseline">
                <span className="text-4xl font-bold">{stats.performanceScore}</span>
                <span className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-500'} ml-1`}>/10</span>
              </div>
              <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} mt-2`}>Your current performance score</p>
            </div>
            <div className={`${darkMode ? 'bg-indigo-900' : 'bg-indigo-100'} p-3 rounded-full`}>
              <BarChart3 className={`${darkMode ? 'text-indigo-300' : 'text-indigo-600'}`} size={24} />
            </div>
          </div>
          <Link 
            to="/performance" 
            className="mt-4 flex items-center text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
          >
            View detailed performance
            <ArrowRight size={16} className="ml-1" />
          </Link>
        </div>
        
        <div className={`${darkMode ? 'bg-gray-800 text-white' : 'bg-white'} rounded-lg shadow-md p-6`}>
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-semibold mb-4">Weekly Planning</h2>
              <div className="text-lg font-medium">
                {stats.weeklyPlanPublished ? (
                  <span className="text-green-600 dark:text-green-400">Published ✓</span>
                ) : (
                  <span className="text-yellow-600 dark:text-yellow-400">Not published yet</span>
                )}
              </div>
              <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} mt-2`}>
                {stats.weeklyPlanPublished 
                  ? "You've published your weekly plan" 
                  : "Don't forget to publish your weekly plan"}
              </p>
            </div>
            <div className={`${darkMode ? 'bg-indigo-900' : 'bg-indigo-100'} p-3 rounded-full`}>
              <Calendar className={`${darkMode ? 'text-indigo-300' : 'text-indigo-600'}`} size={24} />
            </div>
          </div>
          <Link 
            to="/weekly-planner" 
            className="mt-4 flex items-center text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
          >
            {stats.weeklyPlanPublished ? "View your plan" : "Create your plan"}
            <ArrowRight size={16} className="ml-1" />
          </Link>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className={`${darkMode ? 'bg-gray-800 text-white' : 'bg-white'} rounded-lg shadow-md p-6`}>
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-lg font-semibold mb-2">Todo Progress</h2>
              <div className="text-3xl font-bold">
                {stats.completedTodos}/{stats.totalTodos}
              </div>
              <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} mt-1`}>Tasks completed</p>
            </div>
            <div className={`${darkMode ? 'bg-indigo-900' : 'bg-indigo-100'} p-3 rounded-full`}>
              <CheckSquare className={`${darkMode ? 'text-indigo-300' : 'text-indigo-600'}`} size={20} />
            </div>
          </div>
          <Link 
            to="/todos" 
            className="mt-3 flex items-center text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 text-sm"
          >
            Manage tasks
            <ArrowRight size={14} className="ml-1" />
          </Link>
        </div>
        
        <div className={`${darkMode ? 'bg-gray-800 text-white' : 'bg-white'} rounded-lg shadow-md p-6`}>
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-lg font-semibold mb-2">Thought Log</h2>
              <div className="text-3xl font-bold">{stats.negativeThoughts}</div>
              <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} mt-1`}>
                Thoughts recorded ({stats.negativeThoughtOccurrences} occurrences)
              </p>
            </div>
            <div className={`${darkMode ? 'bg-indigo-900' : 'bg-indigo-100'} p-3 rounded-full`}>
              <Brain className={`${darkMode ? 'text-indigo-300' : 'text-indigo-600'}`} size={20} />
            </div>
          </div>
          <Link 
            to="/negative-thoughts" 
            className="mt-3 flex items-center text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 text-sm"
          >
            Log thoughts
            <ArrowRight size={14} className="ml-1" />
          </Link>
        </div>
        
        <div className={`${darkMode ? 'bg-gray-800 text-white' : 'bg-white'} rounded-lg shadow-md p-6`}>
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-lg font-semibold mb-2">Average Rating</h2>
              <div className="text-3xl font-bold">{stats.averageRating}</div>
              <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} mt-1`}>Last 7 days</p>
            </div>
            <div className={`${darkMode ? 'bg-indigo-900' : 'bg-indigo-100'} p-3 rounded-full`}>
              <BarChart3 className={`${darkMode ? 'text-indigo-300' : 'text-indigo-600'}`} size={20} />
            </div>
          </div>
          <Link 
            to="/daily-rating" 
            className="mt-3 flex items-center text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 text-sm"
          >
            Rate today
            <ArrowRight size={14} className="ml-1" />
          </Link>
        </div>
      </div>
      
      <div className={`${darkMode ? 'bg-gray-800 text-white' : 'bg-white'} rounded-lg shadow-md p-6`}>
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link 
            to="/todos" 
            className={`flex items-center p-4 border ${darkMode ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-200 hover:bg-gray-50'} rounded-md transition-colors`}
          >
            <div className={`${darkMode ? 'bg-indigo-900' : 'bg-indigo-100'} p-2 rounded-full mr-4`}>
              <CheckSquare className={`${darkMode ? 'text-indigo-300' : 'text-indigo-600'}`} size={20} />
            </div>
            <div>
              <h3 className="font-medium">Add New Task</h3>
              <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} text-sm`}>Create a new todo item</p>
            </div>
          </Link>
          
          <Link 
            to="/negative-thoughts" 
            className={`flex items-center p-4 border ${darkMode ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-200 hover:bg-gray-50'} rounded-md transition-colors`}
          >
            <div className={`${darkMode ? 'bg-indigo-900' : 'bg-indigo-100'} p-2 rounded-full mr-4`}>
              <Brain className={`${darkMode ? 'text-indigo-300' : 'text-indigo-600'}`} size={20} />
            </div>
            <div>
              <h3 className="font-medium">Log a Thought</h3>
              <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} text-sm`}>Record and reframe negative thoughts</p>
            </div>
          </Link>
          
          <Link 
            to="/daily-rating" 
            className={`flex items-center p-4 border ${darkMode ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-200 hover:bg-gray-50'} rounded-md transition-colors`}
          >
            <div className={`${darkMode ? 'bg-indigo-900' : 'bg-indigo-100'} p-2 rounded-full mr-4`}>
              <BarChart3 className={`${darkMode ? 'text-indigo-300' : 'text-indigo-600'}`} size={20} />
            </div>
            <div>
              <h3 className="font-medium">Rate Your Day</h3>
              <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} text-sm`}>Reflect on today's performance</p>
            </div>
          </Link>
          
          <Link 
            to="/weekly-planner" 
            className={`flex items-center p-4 border ${darkMode ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-200 hover:bg-gray-50'} rounded-md transition-colors`}
          >
            <div className={`${darkMode ? 'bg-indigo-900' : 'bg-indigo-100'} p-2 rounded-full mr-4`}>
              <Calendar className={`${darkMode ? 'text-indigo-300' : 'text-indigo-600'}`} size={20} />
            </div>
            <div>
              <h3 className="font-medium">Plan Your Week</h3>
              <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} text-sm`}>Set goals and intentions</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;