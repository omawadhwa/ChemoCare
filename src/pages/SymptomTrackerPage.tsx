import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, Calendar, BarChart, ArrowLeft, Plus, X, Save, Trash2, AlertCircle, ThumbsUp, ThumbsDown, ChevronDown, ChevronUp, Edit, Clock } from 'lucide-react';

interface Symptom {
  id: string;
  name: string;
  severity: number;
  date: string;
  time: string;
  notes: string;
}

interface SymptomOption {
  id: string;
  name: string;
  description: string;
}

const SymptomTrackerPage: React.FC = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [symptoms, setSymptoms] = useState<Symptom[]>(() => {
    const saved = localStorage.getItem('symptomTracker');
    return saved ? JSON.parse(saved) : [];
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedSymptom, setSelectedSymptom] = useState<SymptomOption | null>(null);
  const [severity, setSeverity] = useState(1);
  const [notes, setNotes] = useState('');
  const [filterPeriod, setFilterPeriod] = useState('7days');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [editingSymptom, setEditingSymptom] = useState<Symptom | null>(null);
  const [expandedSymptom, setExpandedSymptom] = useState<string | null>(null);

  // Common symptoms for cancer patients during chemotherapy
  const symptomOptions: SymptomOption[] = [
    { id: 'fatigue', name: 'Fatigue', description: 'Feeling tired or exhausted beyond normal tiredness' },
    { id: 'nausea', name: 'Nausea', description: 'Feeling of sickness with an urge to vomit' },
    { id: 'pain', name: 'Pain', description: 'Physical discomfort in any area of the body' },
    { id: 'headache', name: 'Headache', description: 'Pain or discomfort in the head or neck area' },
    { id: 'dizziness', name: 'Dizziness', description: 'Feeling faint, woozy, or unbalanced' },
    { id: 'chills', name: 'Chills', description: 'Feeling of coldness with shivering' },
    { id: 'fever', name: 'Fever', description: 'Elevated body temperature often related to infection' },
    { id: 'appetite_loss', name: 'Appetite Loss', description: 'Reduced desire or interest in eating' },
    { id: 'mouth_sores', name: 'Mouth Sores', description: 'Painful ulcers in the mouth or throat' },
    { id: 'taste_changes', name: 'Taste Changes', description: 'Altered taste perception or sensitivity' },
    { id: 'hair_loss', name: 'Hair Loss', description: 'Thinning or loss of hair on the scalp or body' },
    { id: 'numbness', name: 'Numbness/Tingling', description: 'Loss of sensation or pins-and-needles feeling' },
    { id: 'skin_changes', name: 'Skin Changes', description: 'Rash, dryness, or color changes to the skin' },
    { id: 'constipation', name: 'Constipation', description: 'Difficulty having bowel movements' },
    { id: 'diarrhea', name: 'Diarrhea', description: 'Loose, watery stools' },
    { id: 'sleep_problems', name: 'Sleep Problems', description: 'Difficulty falling or staying asleep' },
    { id: 'anxiety', name: 'Anxiety', description: 'Feeling nervous, worried, or on edge' },
    { id: 'depression', name: 'Depression', description: 'Persistent feelings of sadness or loss of interest' },
    { id: 'brain_fog', name: 'Brain Fog', description: 'Feeling mentally unclear or having trouble focusing' },
    { id: 'breathing_difficulty', name: 'Breathing Difficulty', description: 'Shortness of breath or trouble breathing' },
  ];

  // Save symptoms to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('symptomTracker', JSON.stringify(symptoms));
  }, [symptoms]);

  // Initialize form for editing
  useEffect(() => {
    if (editingSymptom) {
      const symptomToEdit = symptomOptions.find(option => option.id === editingSymptom.name);
      setSelectedSymptom(symptomToEdit || null);
      setSeverity(editingSymptom.severity);
      setNotes(editingSymptom.notes);
    } else {
      setSelectedSymptom(null);
      setSeverity(1);
      setNotes('');
    }
  }, [editingSymptom]);

  const handleAddSymptom = () => {
    if (!selectedSymptom) return;
    
    const now = new Date();
    const date = now.toISOString().split('T')[0];
    const time = now.toTimeString().slice(0, 5);
    
    const newSymptom: Symptom = {
      id: Date.now().toString(),
      name: selectedSymptom.id,
      severity,
      date,
      time,
      notes
    };
    
    setSymptoms(prev => [newSymptom, ...prev]);
    setShowAddForm(false);
    resetForm();
  };

  const handleUpdateSymptom = () => {
    if (!editingSymptom || !selectedSymptom) return;
    
    setSymptoms(prev => prev.map(s => 
      s.id === editingSymptom.id 
        ? { ...s, name: selectedSymptom.id, severity, notes }
        : s
    ));
    
    setEditingSymptom(null);
    resetForm();
  };

  const handleDeleteSymptom = (id: string) => {
    setSymptoms(prev => prev.filter(s => s.id !== id));
    if (editingSymptom?.id === id) {
      setEditingSymptom(null);
    }
  };

  const resetForm = () => {
    setSelectedSymptom(null);
    setSeverity(1);
    setNotes('');
  };

  const cancelEdit = () => {
    setEditingSymptom(null);
    resetForm();
  };

  const getFilteredSymptoms = () => {
    let filtered = [...symptoms];
    
    // Apply date filter
    if (filterPeriod !== 'all') {
      const now = new Date();
      const cutoff = new Date();
      
      if (filterPeriod === '7days') {
        cutoff.setDate(now.getDate() - 7);
      } else if (filterPeriod === '30days') {
        cutoff.setDate(now.getDate() - 30);
      } else if (filterPeriod === '90days') {
        cutoff.setDate(now.getDate() - 90);
      }
      
      filtered = filtered.filter(s => new Date(s.date) >= cutoff);
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      if (sortBy === 'date') {
        const dateA = new Date(`${a.date}T${a.time}`);
        const dateB = new Date(`${b.date}T${b.time}`);
        return sortOrder === 'asc' ? dateA.getTime() - dateB.getTime() : dateB.getTime() - dateA.getTime();
      } else if (sortBy === 'severity') {
        return sortOrder === 'asc' ? a.severity - b.severity : b.severity - a.severity;
      } else {
        const nameA = getSymptomName(a.name);
        const nameB = getSymptomName(b.name);
        return sortOrder === 'asc' ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
      }
    });
    
    return filtered;
  };

  const getSymptomName = (id: string) => {
    const option = symptomOptions.find(o => o.id === id);
    return option ? option.name : id;
  };

  const getSeverityLabel = (level: number) => {
    switch (level) {
      case 1: return 'Mild';
      case 2: return 'Moderate';
      case 3: return 'Severe';
      case 4: return 'Very Severe';
      default: return 'Unknown';
    }
  };

  const getSeverityColor = (level: number) => {
    switch (level) {
      case 1: return 'bg-green-100 text-green-800';
      case 2: return 'bg-yellow-100 text-yellow-800';
      case 3: return 'bg-orange-100 text-orange-800';
      case 4: return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const toggleExpandSymptom = (id: string) => {
    setExpandedSymptom(expandedSymptom === id ? null : id);
  };

  const formatDate = (dateStr: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateStr).toLocaleDateString(undefined, options);
  };

  return (
    <div className="min-h-screen bg-sage-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm fixed top-0 left-0 right-0 z-50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <Brain className="h-8 w-8 text-sage-600" />
              <span className="ml-2 text-xl font-semibold text-sage-900">ChemoCare</span>
            </div>
            <button onClick={() => navigate('/')} className="bg-sage-600 text-white px-4 py-2 rounded-md hover:bg-sage-700">
              Back Home
            </button>
          </div>
        </div>
      </nav>

      {/* Header */}
      <div className="pt-24 pb-8 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl tracking-tight font-extrabold text-sage-900 sm:text-5xl md:text-6xl">
              <span className="block">Symptom Tracker</span>
              <span className="block text-sage-600">Monitor Your Journey</span>
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-warm-600 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Track your symptoms over time to identify patterns and share insights with your healthcare team.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Controls */}
          <div className="p-6 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex gap-2">
              <select 
                className="border border-gray-300 rounded-md px-3 py-2 text-gray-700"
                value={filterPeriod}
                onChange={(e) => setFilterPeriod(e.target.value)}
              >
                <option value="7days">Last 7 days</option>
                <option value="30days">Last 30 days</option>
                <option value="90days">Last 90 days</option>
                <option value="all">All time</option>
              </select>
              
              <select 
                className="border border-gray-300 rounded-md px-3 py-2 text-gray-700"
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [newSortBy, newSortOrder] = e.target.value.split('-');
                  setSortBy(newSortBy);
                  setSortOrder(newSortOrder);
                }}
              >
                <option value="date-desc">Newest first</option>
                <option value="date-asc">Oldest first</option>
                <option value="severity-desc">Most severe first</option>
                <option value="severity-asc">Least severe first</option>
                <option value="name-asc">Name (A-Z)</option>
                <option value="name-desc">Name (Z-A)</option>
              </select>
            </div>
            
            <button 
              onClick={() => setShowAddForm(true)}
              className="bg-sage-600 text-white px-4 py-2 rounded-md hover:bg-sage-700 flex items-center"
            >
              <Plus className="h-4 w-4 mr-2" />
              Log New Symptom
            </button>
          </div>
          
          {/* Symptoms List */}
          <div className="divide-y divide-gray-200">
            {getFilteredSymptoms().length === 0 ? (
              <div className="p-8 text-center">
                <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900">No symptoms logged yet</h3>
                <p className="mt-1 text-gray-500">
                  Start tracking your symptoms by clicking the "Log New Symptom" button above.
                </p>
              </div>
            ) : (
              getFilteredSymptoms().map(symptom => (
                <div key={symptom.id} className="p-6 hover:bg-gray-50">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start space-x-3">
                      <div className={`mt-0.5 px-3 py-1 rounded-full text-xs font-medium ${getSeverityColor(symptom.severity)}`}>
                        {getSeverityLabel(symptom.severity)}
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">
                          {getSymptomName(symptom.name)}
                        </h3>
                        <div className="flex items-center text-sm text-gray-500 mt-1">
                          <Calendar className="h-4 w-4 mr-1" />
                          {formatDate(symptom.date)}
                          <Clock className="h-4 w-4 ml-3 mr-1" />
                          {symptom.time}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2 mt-2 sm:mt-0">
                      <button 
                        onClick={() => setEditingSymptom(symptom)}
                        className="text-sage-600 hover:text-sage-700"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button 
                        onClick={() => handleDeleteSymptom(symptom.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                      <button 
                        onClick={() => toggleExpandSymptom(symptom.id)}
                        className="text-sage-600 hover:text-sage-700"
                      >
                        {expandedSymptom === symptom.id ? 
                          <ChevronUp className="h-5 w-5" /> : 
                          <ChevronDown className="h-5 w-5" />
                        }
                      </button>
                    </div>
                  </div>
                  
                  {expandedSymptom === symptom.id && symptom.notes && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <h4 className="text-sm font-medium text-gray-700 mb-1">Notes:</h4>
                      <p className="text-gray-600 whitespace-pre-line">{symptom.notes}</p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
        
        {/* Add/Edit Symptom Modal */}
        {(showAddForm || editingSymptom) && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-lg w-full p-6 shadow-xl">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-sage-900">
                  {editingSymptom ? 'Edit Symptom' : 'Log New Symptom'}
                </h2>
                <button 
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingSymptom(null);
                    resetForm();
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                {/* Symptom Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    What symptom are you experiencing?
                  </label>
                  <select 
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-700"
                    value={selectedSymptom?.id || ''}
                    onChange={(e) => {
                      const selected = symptomOptions.find(option => option.id === e.target.value);
                      setSelectedSymptom(selected || null);
                    }}
                  >
                    <option value="">Select a symptom</option>
                    {symptomOptions.map(option => (
                      <option key={option.id} value={option.id}>
                        {option.name}
                      </option>
                    ))}
                  </select>
                  {selectedSymptom && (
                    <p className="text-sm text-gray-500 mt-1">{selectedSymptom.description}</p>
                  )}
                </div>
                
                {/* Severity */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    How severe is it?
                  </label>
                  <div className="flex space-x-2">
                    {[1, 2, 3, 4].map(level => (
                      <button
                        key={level}
                        type="button"
                        onClick={() => setSeverity(level)}
                        className={`flex-1 py-2 rounded-md text-center text-sm font-medium ${
                          severity === level 
                            ? `ring-2 ring-offset-2 ring-sage-600 ${getSeverityColor(level)}`
                            : `bg-gray-100 text-gray-700 hover:bg-gray-200`
                        }`}
                      >
                        {getSeverityLabel(level)}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Additional notes (optional)
                  </label>
                  <textarea
                    rows={3}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-700"
                    placeholder="Describe how you're feeling, any triggers, or other details that might be helpful..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowAddForm(false);
                    cancelEdit();
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={editingSymptom ? handleUpdateSymptom : handleAddSymptom}
                  disabled={!selectedSymptom}
                  className={`px-4 py-2 rounded-md text-white flex items-center ${
                    selectedSymptom ? 'bg-sage-600 hover:bg-sage-700' : 'bg-gray-300 cursor-not-allowed'
                  }`}
                >
                  <Save className="h-4 w-4 mr-2" />
                  {editingSymptom ? 'Update' : 'Save'}
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Statistics Section */}
        {symptoms.length > 0 && (
          <div className="mt-8 bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-sage-900 flex items-center">
                <BarChart className="h-5 w-5 mr-2 text-sage-600" />
                Symptom Insights
              </h2>
            </div>
            
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Most Common Symptom */}
              <div className="bg-sage-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-sage-700 mb-2">Most Common Symptom</h3>
                {(() => {
                  const counts: Record<string, number> = {};
                  symptoms.forEach(s => {
                    counts[s.name] = (counts[s.name] || 0) + 1;
                  });
                  
                  const mostCommon = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
                  if (!mostCommon) return <p className="text-gray-500">No data yet</p>;
                  
                  return (
                    <div className="flex items-center">
                      <span className="text-lg font-bold text-sage-900">{getSymptomName(mostCommon[0])}</span>
                      <span className="ml-auto bg-sage-200 text-sage-800 px-2 py-1 rounded-full text-xs font-medium">
                        {mostCommon[1]} times
                      </span>
                    </div>
                  );
                })()}
              </div>
              
              {/* Most Severe Symptom */}
              <div className="bg-sage-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-sage-700 mb-2">Most Severe Symptom</h3>
                {(() => {
                  const severities: Record<string, number> = {};
                  symptoms.forEach(s => {
                    severities[s.name] = Math.max(severities[s.name] || 0, s.severity);
                  });
                  
                  const mostSevere = Object.entries(severities).sort((a, b) => b[1] - a[1])[0];
                  if (!mostSevere) return <p className="text-gray-500">No data yet</p>;
                  
                  return (
                    <div className="flex items-center">
                      <span className="text-lg font-bold text-sage-900">{getSymptomName(mostSevere[0])}</span>
                      <span className={`ml-auto px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(mostSevere[1] as number)}`}>
                        {getSeverityLabel(mostSevere[1] as number)}
                      </span>
                    </div>
                  );
                })()}
              </div>
              
              {/* Recent Trend */}
              <div className="bg-sage-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-sage-700 mb-2">Last 7 Days</h3>
                {(() => {
                  const last7Days = symptoms.filter(s => {
                    const date = new Date(s.date);
                    const now = new Date();
                    const weekAgo = new Date();
                    weekAgo.setDate(now.getDate() - 7);
                    return date >= weekAgo;
                  });
                  
                  if (last7Days.length === 0) return <p className="text-gray-500">No data from last 7 days</p>;
                  
                  return (
                    <div className="flex items-center">
                      <span className="text-lg font-bold text-sage-900">{last7Days.length}</span>
                      <span className="ml-2 text-gray-600">symptoms logged</span>
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Export/Print Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-sage-700 rounded-lg shadow-md overflow-hidden">
          <div className="p-6 text-white">
            <h2 className="text-xl font-bold mb-2">Share with Your Healthcare Team</h2>
            <p className="mb-4">
              Tracking your symptoms regularly helps your healthcare team provide better care. Consider bringing this data to your next appointment.
            </p>
            <div className="flex flex-wrap gap-4">
              <button 
                className="bg-white text-sage-700 px-4 py-2 rounded-md hover:bg-sage-100 inline-flex items-center"
                onClick={() => {
                  window.print();
                }}
              >
                <Calendar className="h-4 w-4 mr-2" />
                Print Report
              </button>
              
              <button 
                className="bg-white text-sage-700 px-4 py-2 rounded-md hover:bg-sage-100 inline-flex items-center"
                onClick={() => {
                  const jsonStr = JSON.stringify(symptoms, null, 2);
                  const blob = new Blob([jsonStr], { type: 'application/json' });
                  const href = URL.createObjectURL(blob);
                  
                  const link = document.createElement('a');
                  link.href = href;
                  link.download = `symptom-data-${new Date().toISOString().split('T')[0]}.json`;
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
              >
                <Save className="h-4 w-4 mr-2" />
                Export Data
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SymptomTrackerPage;
