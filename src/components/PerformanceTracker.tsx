import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

interface DailyEntry {
  id: string;
  date: string;
  rating: number;
  wentWell: string;
  wentWrong: string;
  improvements: string;
  journal: string;
}

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  date: Date;
}

interface WeeklyPlan {
  id: string;
  weekStartDate: string;
  goals: {
    id: string;
    text: string;
    completed: boolean;
    category: string;
  }[];
  notes: string;
  published: boolean;
}

interface PerformanceData {
  date: string;
  score: number;
  plannedNextDay: boolean;
  todoCompletionRate: number;
  weeklyPlanPublished: boolean;
  manualRating: number;
}

interface PerformanceTrackerProps {
  darkMode: boolean;
}

const PerformanceTracker: React.FC<PerformanceTrackerProps> = ({ darkMode }) => {
  const [performanceData, setPerformanceData] = useState<PerformanceData[]>([]);
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('week');
  
  useEffect(() => {
    // Load data from localStorage
    const dailyRatings: DailyEntry[] = JSON.parse(localStorage.getItem('dailyRatings') || '[]');
    const todos: Todo[] = JSON.parse(localStorage.getItem('todos') || '[]');
    const weeklyPlans: WeeklyPlan[] = JSON.parse(localStorage.getItem('weeklyPlans') || '[]');
    
    // Calculate performance data
    const data: PerformanceData[] = calculatePerformanceData(dailyRatings, todos, weeklyPlans);
    setPerformanceData(data);
  }, []);

  const calculatePerformanceData = (
    dailyRatings: DailyEntry[],
    todos: Todo[],
    weeklyPlans: WeeklyPlan[]
  ): PerformanceData[] => {
    // Get date range (last 30 days)
    const today = new Date();
    const dates: string[] = [];
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      dates.push(date.toISOString().split('T')[0]);
    }
    
    return dates.map(date => {
      // Check if there's a daily rating for this date
      const dailyRating = dailyRatings.find(entry => entry.date === date);
      
      // Check if todos were completed on this date
      const dayTodos = todos.filter(todo => {
        const todoDate = new Date(todo.date).toISOString().split('T')[0];
        return todoDate === date;
      });
      
      const todoCompletionRate = dayTodos.length > 0
        ? dayTodos.filter(todo => todo.completed).length / dayTodos.length
        : 0;
      
      // Check if there was planning for the next day
      const nextDayDate = new Date(date);
      nextDayDate.setDate(nextDayDate.getDate() + 1);
      const nextDay = nextDayDate.toISOString().split('T')[0];
      
      const plannedNextDay = todos.some(todo => {
        const todoDate = new Date(todo.date).toISOString().split('T')[0];
        return todoDate === nextDay;
      });
      
      // Check if weekly plan was published for the week containing this date
      const dateObj = new Date(date);
      const day = dateObj.getDay(); // 0 is Sunday, 1 is Monday, etc.
      const diff = dateObj.getDate() - day + (day === 0 ? -6 : 1); // Adjust to get Monday
      const weekStartDate = new Date(new Date(date).setDate(diff)).toISOString().split('T')[0];
      
      const weeklyPlan = weeklyPlans.find(plan => plan.weekStartDate === weekStartDate);
      const weeklyPlanPublished = weeklyPlan ? weeklyPlan.published : false;
      
      // Calculate performance score (out of 10)
      let score = 0;
      
      // 1. Daily planning in advance (2 points)
      if (plannedNextDay) score += 2;
      
      // 2. Todo completion rate (3 points)
      score += todoCompletionRate * 3;
      
      // 3. Weekly plan published (2 points)
      if (weeklyPlanPublished) score += 2;
      
      // 4. Manual rating (3 points - scaled from 0-10 to 0-3)
      const manualRating = dailyRating ? dailyRating.rating : 0;
      score += (manualRating / 10) * 3;
      
      return {
        date,
        score: parseFloat(score.toFixed(1)),
        plannedNextDay,
        todoCompletionRate,
        weeklyPlanPublished,
        manualRating: dailyRating ? dailyRating.rating : 0
      };
    });
  };

  const getFilteredData = () => {
    const today = new Date();
    let startDate: Date;
    
    switch (timeRange) {
      case 'week':
        startDate = new Date(today);
        startDate.setDate(today.getDate() - 7);
        break;
      case 'month':
        startDate = new Date(today);
        startDate.setDate(today.getDate() - 30);
        break;
      case 'year':
        startDate = new Date(today);
        startDate.setDate(today.getDate() - 365);
        break;
      default:
        startDate = new Date(today);
        startDate.setDate(today.getDate() - 7);
    }
    
    return performanceData.filter(data => {
      const dataDate = new Date(data.date);
      return dataDate >= startDate && dataDate <= today;
    });
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const calculateAverageScore = () => {
    const filteredData = getFilteredData();
    if (filteredData.length === 0) return 0;
    
    const sum = filteredData.reduce((acc, data) => acc + data.score, 0);
    return (sum / filteredData.length).toFixed(1);
  };

  const calculateScoreTrend = () => {
    const filteredData = getFilteredData();
    if (filteredData.length < 2) return 'neutral';
    
    const firstHalf = filteredData.slice(0, Math.floor(filteredData.length / 2));
    const secondHalf = filteredData.slice(Math.floor(filteredData.length / 2));
    
    const firstHalfAvg = firstHalf.reduce((acc, data) => acc + data.score, 0) / firstHalf.length;
    const secondHalfAvg = secondHalf.reduce((acc, data) => acc + data.score, 0) / secondHalf.length;
    
    if (secondHalfAvg > firstHalfAvg + 0.5) return 'up';
    if (secondHalfAvg < firstHalfAvg - 0.5) return 'down';
    return 'neutral';
  };

  const getTrendColor = () => {
    const trend = calculateScoreTrend();
    if (trend === 'up') return darkMode ? 'text-green-400' : 'text-green-500';
    if (trend === 'down') return darkMode ? 'text-red-400' : 'text-red-500';
    return darkMode ? 'text-gray-400' : 'text-gray-500';
  };

  const getTrendIcon = () => {
    const trend = calculateScoreTrend();
    if (trend === 'up') return '↑';
    if (trend === 'down') return '↓';
    return '→';
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Performance Tracker</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className={`${darkMode ? 'bg-gray-800 text-white' : 'bg-white'} rounded-lg shadow-md p-6`}>
          <h2 className={`text-lg font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} mb-2`}>Average Score</h2>
          <div className="flex items-baseline">
            <span className="text-4xl font-bold">{calculateAverageScore()}</span>
            <span className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-500'} ml-1`}>/10</span>
          </div>
          <div className={`mt-2 ${getTrendColor()}`}>
            <span className="font-medium">{getTrendIcon()}</span>
            <span className="ml-1">
              {calculateScoreTrend() === 'up' ? 'Improving' : 
               calculateScoreTrend() === 'down' ? 'Declining' : 'Stable'}
            </span>
          </div>
        </div>
        
        <div className={`${darkMode ? 'bg-gray-800 text-white' : 'bg-white'} rounded-lg shadow-md p-6`}>
          <h2 className={`text-lg font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} mb-2`}>Todo Completion</h2>
          <div className="flex items-baseline">
            <span className="text-4xl font-bold">
              {getFilteredData().length > 0 
                ? Math.round(getFilteredData().reduce((acc, data) => acc + data.todoCompletionRate, 0) / getFilteredData().length * 100) 
                : 0}%
            </span>
          </div>
          <div className={`mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            <span>Average completion rate</span>
          </div>
        </div>
        
        <div className={`${darkMode ? 'bg-gray-800 text-white' : 'bg-white'} rounded-lg shadow-md p-6`}>
          <h2 className={`text-lg font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} mb-2`}>Planning Rate</h2>
          <div className="flex items-baseline">
            <span className="text-4xl font-bold">
              {getFilteredData().length > 0 
                ? Math.round(getFilteredData().filter(data => data.plannedNextDay).length / getFilteredData().length * 100) 
                : 0}%
            </span>
          </div>
          <div className={`mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            <span>Days with advance planning</span>
          </div>
        </div>
      </div>
      
      <div className={`${darkMode ? 'bg-gray-800 text-white' : 'bg-white'} rounded-lg shadow-md p-6 mb-8`}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Performance Score Trend</h2>
          <div className="flex space-x-2">
            <button
              onClick={() => setTimeRange('week')}
              className={`px-3 py-1 rounded-md ${
                timeRange === 'week' 
                  ? darkMode ? 'bg-indigo-900 text-indigo-300' : 'bg-indigo-100 text-indigo-700'
                  : darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Week
            </button>
            <button
              onClick={() => setTimeRange('month')}
              className={`px-3 py-1 rounded-md ${
                timeRange === 'month' 
                  ? darkMode ? 'bg-indigo-900 text-indigo-300' : 'bg-indigo-100 text-indigo-700'
                  : darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Month
            </button>
            <button
              onClick={() => setTimeRange('year')}
              className={`px-3 py-1 rounded-md ${
                timeRange === 'year' 
                  ? darkMode ? 'bg-indigo-900 text-indigo-300' : 'bg-indigo-100 text-indigo-700'
                  : darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Year
            </button>
          </div>
        </div>
        
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={getFilteredData()}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#e5e7eb'} />
              <XAxis 
                dataKey="date" 
                tickFormatter={formatDate}
                interval={timeRange === 'week' ? 0 : 'preserveEnd'}
                stroke={darkMode ? '#9ca3af' : '#6b7280'}
              />
              <YAxis 
                domain={[0, 10]} 
                stroke={darkMode ? '#9ca3af' : '#6b7280'}
              />
              <Tooltip 
                formatter={(value: number) => [`${value}`, 'Score']}
                labelFormatter={(label) => formatDate(label)}
                contentStyle={darkMode ? { backgroundColor: '#1f2937', borderColor: '#374151', color: 'white' } : undefined}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="score" 
                stroke={darkMode ? '#818cf8' : '#6366F1'} 
                activeDot={{ r: 8 }} 
                name="Performance Score"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div className={`${darkMode ? 'bg-gray-800 text-white' : 'bg-white'} rounded-lg shadow-md p-6`}>
        <h2 className="text-xl font-semibold mb-6">Performance Breakdown</h2>
        
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={getFilteredData()}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#e5e7eb'} />
              <XAxis 
                dataKey="date" 
                tickFormatter={formatDate}
                interval={timeRange === 'week' ? 0 : 'preserveEnd'}
                stroke={darkMode ? '#9ca3af' : '#6b7280'}
              />
              <YAxis stroke={darkMode ? '#9ca3af' : '#6b7280'} />
              <Tooltip 
                formatter={(value: number, name: string) => {
                  const formattedName = {
                    todoCompletionRate: 'Todo Completion',
                    manualRating: 'Self Rating',
                    plannedNextDay: 'Next Day Planning',
                    weeklyPlanPublished: 'Weekly Plan'
                  }[name] || name;
                  
                  if (name === 'todoCompletionRate') {
                    return [`${Math.round(value * 100)}%`, formattedName];
                  }
                  if (name === 'plannedNextDay' || name === 'weeklyPlanPublished') {
                    return [value ? 'Yes' : 'No', formattedName];
                  }
                  return [value, formattedName];
                }}
                labelFormatter={(label) => formatDate(label)}
                contentStyle={darkMode ? { backgroundColor: '#1f2937', borderColor: '#374151', color: 'white' } : undefined}
              />
              <Legend />
              <Bar dataKey="todoCompletionRate" name="Todo Completion" fill={darkMode ? '#a78bfa' : '#8884d8'} />
              <Bar dataKey="manualRating" name="Self Rating" fill={darkMode ? '#6ee7b7' : '#82ca9d'} />
              <Bar dataKey="plannedNextDay" name="Next Day Planning" fill={darkMode ? '#fcd34d' : '#ffc658'} />
              <Bar dataKey="weeklyPlanPublished" name="Weekly Plan" fill={darkMode ? '#f87171' : '#ff8042'} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default PerformanceTracker;