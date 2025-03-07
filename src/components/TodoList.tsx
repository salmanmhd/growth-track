import React, { useState, useEffect } from 'react';
import { CheckCircle, Circle, Trash2, AlertCircle } from 'lucide-react';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  date: Date;
}

interface TodoListProps {
  darkMode: boolean;
}

const TodoList: React.FC<TodoListProps> = ({ darkMode }) => {
  const [todos, setTodos] = useState<Todo[]>(() => {
    const savedTodos = localStorage.getItem('todos');
    return savedTodos ? JSON.parse(savedTodos) : [];
  });
  
  const [newTodo, setNewTodo] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const handleAddTodo = () => {
    if (newTodo.trim() === '') return;
    
    const todo: Todo = {
      id: Date.now().toString(),
      text: newTodo,
      completed: false,
      priority,
      date: new Date()
    };
    
    setTodos([...todos, todo]);
    setNewTodo('');
    setPriority('medium');
  };

  const handleToggleTodo = (id: string) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const handleDeleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-500';
      case 'medium': return 'text-yellow-500';
      case 'low': return 'text-green-500';
      default: return darkMode ? 'text-gray-400' : 'text-gray-500';
    }
  };

  const getCompletedTodosCount = () => {
    return todos.filter(todo => todo.completed).length;
  };

  const sortedTodos = [...todos].sort((a, b) => {
    // First sort by completion status
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }
    
    // Then sort by priority
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Todo List</h1>
      
      <div className={`${darkMode ? 'bg-gray-800 text-white' : 'bg-white'} rounded-lg shadow-md p-6 mb-8`}>
        <h2 className="text-xl font-semibold mb-4">Add New Task</h2>
        <div className="flex items-end gap-4">
          <div className="flex-1">
            <label htmlFor="todo" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
              Task Description
            </label>
            <input
              type="text"
              id="todo"
              className={`w-full p-3 border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'} rounded-md focus:ring-indigo-500 focus:border-indigo-500`}
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              placeholder="What do you need to do?"
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleAddTodo();
              }}
            />
          </div>
          
          <div className="w-40">
            <label htmlFor="priority" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
              Priority
            </label>
            <select
              id="priority"
              className={`w-full p-3 border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'} rounded-md focus:ring-indigo-500 focus:border-indigo-500`}
              value={priority}
              onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          
          <button
            onClick={handleAddTodo}
            className="px-4 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            Add Task
          </button>
        </div>
      </div>
      
      <div className={`${darkMode ? 'bg-gray-800 text-white' : 'bg-white'} rounded-lg shadow-md p-6`}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Tasks</h2>
          <div className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
            Completed: {getCompletedTodosCount()}/{todos.length}
          </div>
        </div>
        
        {todos.length === 0 ? (
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} italic`}>No tasks yet. Add your first task above.</p>
        ) : (
          <div className="space-y-2">
            {sortedTodos.map((todo) => (
              <div 
                key={todo.id} 
                className={`flex items-center justify-between p-3 border rounded-md ${
                  todo.completed 
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
                    onClick={() => handleToggleTodo(todo.id)}
                    className="mr-3 focus:outline-none"
                  >
                    {todo.completed ? (
                      <CheckCircle className="text-green-500" size={20} />
                    ) : (
                      <Circle className={darkMode ? 'text-gray-500' : 'text-gray-400'} size={20} />
                    )}
                  </button>
                  
                  <div>
                    <p className={`${todo.completed ? 'line-through ' + (darkMode ? 'text-gray-400' : 'text-gray-500') : darkMode ? 'text-gray-100' : 'text-gray-800'}`}>
                      {todo.text}
                    </p>
                    <div className="flex items-center mt-1">
                      <AlertCircle size={14} className={`${getPriorityColor(todo.priority)} mr-1`} />
                      <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} capitalize`}>{todo.priority} priority</span>
                    </div>
                  </div>
                </div>
                
                <button 
                  onClick={() => handleDeleteTodo(todo.id)}
                  className={`${darkMode ? 'text-gray-400 hover:text-red-400' : 'text-gray-400 hover:text-red-500'} focus:outline-none`}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TodoList;