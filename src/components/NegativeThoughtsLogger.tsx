import React, { useState, useEffect } from 'react';
import { PlusCircle, Plus, Minus, Trash2 } from 'lucide-react';

interface Thought {
  id: string;
  text: string;
  positiveReframe: string;
  date: Date;
  count: number;
}

interface NegativeThoughtsLoggerProps {
  darkMode: boolean;
}

const NegativeThoughtsLogger: React.FC<NegativeThoughtsLoggerProps> = ({ darkMode }) => {
  const [thoughts, setThoughts] = useState<Thought[]>(() => {
    const savedThoughts = localStorage.getItem('negativeThoughts');
    return savedThoughts ? JSON.parse(savedThoughts) : [];
  });
  
  const [newThought, setNewThought] = useState('');
  const [positiveReframe, setPositiveReframe] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('negativeThoughts', JSON.stringify(thoughts));
  }, [thoughts]);

  const handleAddThought = () => {
    if (newThought.trim() === '') return;
    
    // Check if the same thought already exists
    const existingThoughtIndex = thoughts.findIndex(
      thought => thought.text.toLowerCase() === newThought.toLowerCase()
    );
    
    if (existingThoughtIndex >= 0) {
      // Increment count for existing thought
      const updatedThoughts = [...thoughts];
      updatedThoughts[existingThoughtIndex] = {
        ...updatedThoughts[existingThoughtIndex],
        count: updatedThoughts[existingThoughtIndex].count + 1,
        date: new Date() // Update the date to the most recent occurrence
      };
      setThoughts(updatedThoughts);
    } else {
      // Add new thought
      const thought: Thought = {
        id: Date.now().toString(),
        text: newThought,
        positiveReframe: positiveReframe,
        date: new Date(),
        count: 1
      };
      
      setThoughts([...thoughts, thought]);
    }
    
    setNewThought('');
    setPositiveReframe('');
  };

  const handleEditThought = (id: string, updatedPositiveReframe: string) => {
    setThoughts(thoughts.map(thought => 
      thought.id === id 
        ? { ...thought, positiveReframe: updatedPositiveReframe } 
        : thought
    ));
    setEditingId(null);
  };

  const handleDeleteThought = (id: string) => {
    setThoughts(thoughts.filter(thought => thought.id !== id));
  };

  const handleIncrementCount = (id: string) => {
    setThoughts(thoughts.map(thought => 
      thought.id === id 
        ? { ...thought, count: thought.count + 1, date: new Date() } 
        : thought
    ));
  };

  const handleDecrementCount = (id: string) => {
    setThoughts(thoughts.map(thought => {
      if (thought.id === id) {
        const newCount = Math.max(1, thought.count - 1); // Ensure count doesn't go below 1
        return { ...thought, count: newCount };
      }
      return thought;
    }));
  };

  const getTotalOccurrences = () => {
    return thoughts.reduce((total, thought) => total + thought.count, 0);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Negative Thoughts Logger</h1>
      <p className={`mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
        Record negative thoughts, fears, or regrets, then reframe them with positive thinking.
      </p>
      
      <div className={`${darkMode ? 'bg-gray-800 text-gray-100' : 'bg-white'} rounded-lg shadow-md p-6 mb-8`}>
        <h2 className="text-xl font-semibold mb-4">Add New Entry</h2>
        <div className="mb-4">
          <label htmlFor="thought" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
            Negative Thought
          </label>
          <textarea
            id="thought"
            className={`w-full p-3 border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'} rounded-md focus:ring-indigo-500 focus:border-indigo-500`}
            rows={3}
            value={newThought}
            onChange={(e) => setNewThought(e.target.value)}
            placeholder="What negative thought, fear, or regret are you experiencing?"
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="reframe" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
            Positive Reframe
          </label>
          <textarea
            id="reframe"
            className={`w-full p-3 border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'} rounded-md focus:ring-indigo-500 focus:border-indigo-500`}
            rows={3}
            value={positiveReframe}
            onChange={(e) => setPositiveReframe(e.target.value)}
            placeholder="How can you reframe this thought in a more positive or constructive way?"
          />
        </div>
        
        <button
          onClick={handleAddThought}
          className="flex items-center justify-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
        >
          <PlusCircle size={18} className="mr-2" />
          Add Entry
        </button>
      </div>
      
      <div className={`${darkMode ? 'bg-gray-800 text-gray-100' : 'bg-white'} rounded-lg shadow-md p-6`}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Thought Log</h2>
          <div className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
            Total entries: {thoughts.length} (Total occurrences: {getTotalOccurrences()})
          </div>
        </div>
        
        {thoughts.length === 0 ? (
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} italic`}>No entries yet. Add your first thought above.</p>
        ) : (
          <div className="space-y-4">
            {thoughts.map((thought) => (
              <div key={thought.id} className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} pb-4`}>
                <div className="flex justify-between">
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {new Date(thought.date).toLocaleDateString()} at {new Date(thought.date).toLocaleTimeString()}
                  </p>
                  <button 
                    onClick={() => handleDeleteThought(thought.id)}
                    className="text-red-500 text-sm hover:text-red-700"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                
                <div className="flex items-center mt-2">
                  <p className="font-medium flex-grow">{thought.text}</p>
                  <div className="flex items-center ml-4">
                    <button
                      onClick={() => handleDecrementCount(thought.id)}
                      className={`p-1 rounded-l ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
                    >
                      <Minus size={16} />
                    </button>
                    <span className={`px-3 py-1 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                      {thought.count}
                    </span>
                    <button
                      onClick={() => handleIncrementCount(thought.id)}
                      className={`p-1 rounded-r ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
                
                {editingId === thought.id ? (
                  <div className="mt-2">
                    <textarea
                      className={`w-full p-2 border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'} rounded-md focus:ring-indigo-500 focus:border-indigo-500`}
                      rows={2}
                      defaultValue={thought.positiveReframe}
                      onChange={(e) => setPositiveReframe(e.target.value)}
                    />
                    <div className="flex justify-end mt-2">
                      <button
                        onClick={() => handleEditThought(thought.id, positiveReframe)}
                        className="px-3 py-1 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-sm"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="mt-2">
                    <p className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                      <span className="font-medium">Positive reframe: </span>
                      {thought.positiveReframe || (
                        <span className={`italic ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>No reframe added</span>
                      )}
                    </p>
                    {!thought.positiveReframe && (
                      <button
                        onClick={() => setEditingId(thought.id)}
                        className="text-indigo-600 text-sm mt-1 hover:text-indigo-800"
                      >
                        Add reframe
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NegativeThoughtsLogger;