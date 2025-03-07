import React, { useState, useEffect } from 'react';
import { Star, Save } from 'lucide-react';

interface DailyEntry {
  id: string;
  date: string;
  rating: number;
  wentWell: string;
  wentWrong: string;
  improvements: string;
  journal: string;
}

interface DailyRatingProps {
  darkMode: boolean;
}

const DailyRating: React.FC<DailyRatingProps> = ({ darkMode }) => {
  const [entries, setEntries] = useState<DailyEntry[]>(() => {
    const savedEntries = localStorage.getItem('dailyRatings');
    return savedEntries ? JSON.parse(savedEntries) : [];
  });
  
  const [currentDate, setCurrentDate] = useState(new Date().toISOString().split('T')[0]);
  const [rating, setRating] = useState(5);
  const [wentWell, setWentWell] = useState('');
  const [wentWrong, setWentWrong] = useState('');
  const [improvements, setImprovements] = useState('');
  const [journal, setJournal] = useState('');
  const [hoveredRating, setHoveredRating] = useState(0);
  
  // Check if there's already an entry for today
  useEffect(() => {
    const todayEntry = entries.find(entry => entry.date === currentDate);
    if (todayEntry) {
      setRating(todayEntry.rating);
      setWentWell(todayEntry.wentWell);
      setWentWrong(todayEntry.wentWrong);
      setImprovements(todayEntry.improvements);
      setJournal(todayEntry.journal);
    } else {
      // Reset form for a new day
      setRating(5);
      setWentWell('');
      setWentWrong('');
      setImprovements('');
      setJournal('');
    }
  }, [currentDate, entries]);

  useEffect(() => {
    localStorage.setItem('dailyRatings', JSON.stringify(entries));
  }, [entries]);

  const handleSaveEntry = () => {
    const existingEntryIndex = entries.findIndex(entry => entry.date === currentDate);
    
    const newEntry: DailyEntry = {
      id: existingEntryIndex >= 0 ? entries[existingEntryIndex].id : Date.now().toString(),
      date: currentDate,
      rating,
      wentWell,
      wentWrong,
      improvements,
      journal
    };
    
    if (existingEntryIndex >= 0) {
      // Update existing entry
      const updatedEntries = [...entries];
      updatedEntries[existingEntryIndex] = newEntry;
      setEntries(updatedEntries);
    } else {
      // Add new entry
      setEntries([...entries, newEntry]);
    }
    
    alert('Daily rating saved successfully!');
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentDate(e.target.value);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Daily Self-Rating</h1>
      
      <div className={`${darkMode ? 'bg-gray-800 text-white' : 'bg-white'} rounded-lg shadow-md p-6 mb-8`}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Rate Your Day</h2>
          <input
            type="date"
            value={currentDate}
            onChange={handleDateChange}
            className={`p-2 border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'} rounded-md`}
          />
        </div>
        
        <div className="mb-6">
          <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
            How would you rate your day? (1-10)
          </label>
          <div className="flex items-center">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setRating(value)}
                onMouseEnter={() => setHoveredRating(value)}
                onMouseLeave={() => setHoveredRating(0)}
                className="mr-1 focus:outline-none"
              >
                <Star
                  size={24}
                  fill={(hoveredRating || rating) >= value ? '#FBBF24' : 'none'}
                  stroke={(hoveredRating || rating) >= value ? '#FBBF24' : darkMode ? '#9CA3AF' : '#9CA3AF'}
                />
              </button>
            ))}
            <span className="ml-2 text-lg font-medium">{rating}/10</span>
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="wentWell" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
              What went well today?
            </label>
            <textarea
              id="wentWell"
              className={`w-full p-3 border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'} rounded-md focus:ring-indigo-500 focus:border-indigo-500`}
              rows={3}
              value={wentWell}
              onChange={(e) => setWentWell(e.target.value)}
              placeholder="List things that went well..."
            />
          </div>
          
          <div>
            <label htmlFor="wentWrong" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
              What didn't go as planned?
            </label>
            <textarea
              id="wentWrong"
              className={`w-full p-3 border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'} rounded-md focus:ring-indigo-500 focus:border-indigo-500`}
              rows={3}
              value={wentWrong}
              onChange={(e) => setWentWrong(e.target.value)}
              placeholder="List things that didn't go well..."
            />
          </div>
          
          <div>
            <label htmlFor="improvements" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
              What could be improved?
            </label>
            <textarea
              id="improvements"
              className={`w-full p-3 border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'} rounded-md focus:ring-indigo-500 focus:border-indigo-500`}
              rows={3}
              value={improvements}
              onChange={(e) => setImprovements(e.target.value)}
              placeholder="What would you do differently next time?"
            />
          </div>
          
          <div>
            <label htmlFor="journal" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
              Journal Entry
            </label>
            <textarea
              id="journal"
              className={`w-full p-3 border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'} rounded-md focus:ring-indigo-500 focus:border-indigo-500`}
              rows={5}
              value={journal}
              onChange={(e) => setJournal(e.target.value)}
              placeholder="Write your thoughts, feelings, or anything else you want to remember about today..."
            />
          </div>
        </div>
        
        <button
          onClick={handleSaveEntry}
          className="mt-6 flex items-center justify-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
        >
          <Save size={18} className="mr-2" />
          Save Entry
        </button>
      </div>
      
      <div className={`${darkMode ? 'bg-gray-800 text-white' : 'bg-white'} rounded-lg shadow-md p-6`}>
        <h2 className="text-xl font-semibold mb-4">Previous Entries</h2>
        
        {entries.length === 0 ? (
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} italic`}>No entries yet. Rate your first day above.</p>
        ) : (
          <div className="space-y-4">
            {[...entries].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((entry) => (
              <div key={entry.id} className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} pb-4`}>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <h3 className="font-medium">{new Date(entry.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</h3>
                    <div className="ml-4 flex items-center">
                      <Star size={16} fill="#FBBF24" stroke="#FBBF24" />
                      <span className="ml-1">{entry.rating}/10</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setCurrentDate(entry.date)}
                    className="text-indigo-600 text-sm hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
                  >
                    Edit
                  </button>
                </div>
                
                {entry.journal && (
                  <p className={`mt-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'} line-clamp-2`}>{entry.journal}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DailyRating;