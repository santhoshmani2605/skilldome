import React, { useState } from 'react';
import { CheckCircle2, ArrowRight, ArrowLeft, BookOpen, Zap, Flame } from 'lucide-react';

const LEVEL_OPTIONS = [
  { id: 'Basic', label: 'Easy', color: '#10b981', bg: 'rgba(16, 185, 129, 0.15)', border: 'rgba(16, 185, 129, 0.3)' },
  { id: 'Intermediate', label: 'Intermediate', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.15)', border: 'rgba(245, 158, 11, 0.3)' },
  { id: 'Advanced', label: 'Expert', color: '#ef4444', bg: 'rgba(239, 68, 68, 0.15)', border: 'rgba(239, 68, 68, 0.3)' }
];

export default function InterestTopicsPage({
  availableTopics = [],
  allQuestions = [],
  initialSelectedCategoryConfigs = {}, // { 'Java': 'Basic', 'Python': 'Advanced' }
  onStartAssessment,
  onBack
}) {
  // Map of category -> difficulty (e.g. { 'Java': 'Basic', 'React JS': 'Advanced' })
  const [categoryConfigs, setCategoryConfigs] = useState(initialSelectedCategoryConfigs);
  const [validationError, setValidationError] = useState('');

  const selectedCategories = Object.keys(categoryConfigs);

  // Categorize topics
  const codingTopics = [];
  const nonCodingTopics = [];
  availableTopics.forEach(topic => {
    const q = allQuestions.find(q => q.category === topic);
    if (q) {
      if ((q.domain || '').toLowerCase() === 'coding') {
        codingTopics.push(topic);
      } else {
        nonCodingTopics.push(topic);
      }
    }
  });

  const toggleCategory = (topic) => {
    setValidationError('');
    if (categoryConfigs[topic]) {
      const next = { ...categoryConfigs };
      delete next[topic];
      setCategoryConfigs(next);
    } else {
      if (selectedCategories.length >= 5) {
        setValidationError('You can select a maximum of 5 categories.');
        return;
      }
      // Default to 'Basic' (Easy) level when selected
      setCategoryConfigs(prev => ({
        ...prev,
        [topic]: 'Basic'
      }));
    }
  };

  const setCategoryLevel = (topic, level) => {
    setCategoryConfigs(prev => ({
      ...prev,
      [topic]: level
    }));
  };

  const handleProceed = () => {
    if (availableTopics.length >= 3 && selectedCategories.length < 3) {
      setValidationError('Please select at least 3 categories to proceed.');
      return;
    }
    if (selectedCategories.length > 5) {
      setValidationError('Please select no more than 5 categories.');
      return;
    }
    setValidationError('');
    onStartAssessment(categoryConfigs);
  };

  const renderTopic = (topic) => {
    const isSelected = Boolean(categoryConfigs[topic]);
    const currentLevel = categoryConfigs[topic] || 'Basic';
    const countForTopic = allQuestions.filter(q => q.category === topic).length;

    return (
      <div
        key={topic}
        style={{
          padding: '18px 20px',
          borderRadius: '14px',
          border: isSelected ? '2px solid var(--accent-primary)' : '1px solid var(--border-color)',
          background: isSelected ? 'rgba(99, 102, 241, 0.08)' : 'var(--bg-input)',
          transition: 'all 0.2s ease',
          boxShadow: isSelected ? '0 4px 16px rgba(99, 102, 241, 0.15)' : 'none'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
          {/* Topic Title & Checkbox */}
          <div 
            onClick={() => toggleCategory(topic)}
            style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: '200px' }}
          >
            <div style={{
              width: '24px',
              height: '24px',
              borderRadius: '6px',
              border: isSelected ? '2px solid var(--accent-primary)' : '2px solid var(--border-color)',
              background: isSelected ? 'var(--accent-primary)' : 'transparent',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease'
            }}>
              {isSelected && <CheckCircle2 size={16} color="#fff" />}
            </div>
            <div>
              <span style={{ fontWeight: 700, fontSize: '1.05rem', color: isSelected ? 'var(--accent-primary)' : 'var(--text-main)', display: 'block' }}>
                {topic}
              </span>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
                {countForTopic} Questions available in bank
              </span>
            </div>
          </div>

          {/* Per-Category Level Selector */}
          {isSelected && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginTop: '6px' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginRight: '4px', width: '100%', display: 'block', marginBottom: '4px' }}>
                Level:
              </span>
              {LEVEL_OPTIONS.map(lvl => {
                const isLvlSelected = currentLevel === lvl.id;
                return (
                  <button
                    key={lvl.id}
                    type="button"
                    onClick={() => setCategoryLevel(topic, lvl.id)}
                    style={{
                      padding: '8px 12px',
                      borderRadius: '8px',
                      fontSize: '0.78rem',
                      fontWeight: isLvlSelected ? 700 : 600,
                      border: isLvlSelected ? `2px solid ${lvl.color}` : '1px solid var(--border-color)',
                      background: isLvlSelected ? lvl.bg : 'var(--bg-card-solid)',
                      color: isLvlSelected ? lvl.color : 'var(--text-muted)',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      flex: '1',
                      textAlign: 'center'
                    }}
                  >
                    {lvl.label}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '32px 24px'
    }}>
      {/* Centered Container Card */}
      <div className="animate-fade-in" style={{
        width: '100%',
        maxWidth: '880px',
        background: '#ffffff',
        borderRadius: '24px',
        border: '1px solid rgba(226, 232, 240, 0.8)',
        boxShadow: '0 25px 60px rgba(15, 23, 42, 0.08)',
        overflow: 'hidden'
      }}>
        <div style={{ padding: '48px 42px', display: 'flex', flexDirection: 'column' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <span style={{
            background: 'rgba(99, 102, 241, 0.15)',
            color: 'var(--accent-primary)',
            fontSize: '0.8rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '1px',
            padding: '6px 16px',
            borderRadius: '20px',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            display: 'inline-block',
            marginBottom: '12px'
          }}>
            All Tracks Configuration
          </span>
          <h1 style={{ fontSize: '1.9rem', fontWeight: 800, marginBottom: '8px', color: 'var(--text-main)' }}>
            Select Categories & Specific Difficulty
          </h1>
          <p style={{ color: 'var(--text-dim)', fontSize: '0.95rem', lineHeight: '1.5' }}>
            Select <strong>minimum 3 and maximum 5 categories</strong>. Customize difficulty (Easy, Intermediate, Expert) for each category.
          </p>
        </div>

        {/* CATEGORY & PER-CATEGORY DIFFICULTY SECTION */}
        <div className="glass-panel" style={{ padding: '28px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)' }}>
                Select Assessment Subjects
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>
                Choose categories and set difficulty level per subject
              </p>
            </div>
            <div style={{
              fontSize: '0.85rem',
              fontWeight: 700,
              padding: '6px 14px',
              borderRadius: '20px',
              background: selectedCategories.length >= 3 && selectedCategories.length <= 5 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
              color: selectedCategories.length >= 3 && selectedCategories.length <= 5 ? '#10b981' : '#f59e0b',
              border: `1px solid ${selectedCategories.length >= 3 && selectedCategories.length <= 5 ? 'rgba(16, 185, 129, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`
            }}>
              Selected: {selectedCategories.length} / 5 (Min 3 required)
            </div>
          </div>

          {availableTopics.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '20px 0', color: 'var(--text-dim)' }}>
              No specific topics found. All available questions from the question bank will be included.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              
              {/* CODING SECTION */}
              {codingTopics.length > 0 && (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                    <Zap size={20} color="#4f46e5" />
                    <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#4f46e5' }}>Coding</h4>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {codingTopics.map(renderTopic)}
                  </div>
                </div>
              )}

              {/* NON-CODING SECTION */}
              {nonCodingTopics.length > 0 && (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                    <BookOpen size={20} color="#0284c7" />
                    <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#0284c7' }}>Non-Coding</h4>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {nonCodingTopics.map(renderTopic)}
                  </div>
                </div>
              )}

            </div>
          )}
        </div>

        {/* Validation Error Banner */}
        {validationError && (
          <div style={{
            padding: '14px 18px',
            borderRadius: '10px',
            background: 'rgba(239, 68, 68, 0.12)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: 'var(--accent-danger)',
            fontSize: '0.9rem',
            fontWeight: 600,
            marginBottom: '20px',
            textAlign: 'center'
          }}>
            {validationError}
          </div>
        )}

        {/* Exam Information Summary Box */}
        <div className="glass-panel" style={{
          padding: '16px 20px',
          marginBottom: '28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          borderRadius: '12px',
          borderColor: 'rgba(99, 102, 241, 0.3)',
          background: 'rgba(99, 102, 241, 0.05)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              background: 'var(--accent-primary)',
              boxShadow: '0 0 10px var(--accent-primary)'
            }} />
            <p style={{ color: 'var(--text-main)', fontSize: '0.9rem', margin: 0 }}>
              Assessment Structure: <strong style={{ color: 'var(--accent-primary)' }}>5 questions per selected category</strong> ({selectedCategories.length * 5} total questions for {selectedCategories.length} categories).
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
          <button
            onClick={onBack}
            className="btn btn-secondary"
            style={{
              padding: '14px 28px',
              fontSize: '0.95rem',
              fontWeight: 600,
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <ArrowLeft size={18} />
            <span>Back</span>
          </button>

          <button
            onClick={handleProceed}
            className="btn btn-primary"
            style={{
              flex: 1,
              padding: '12px 16px',
              fontSize: '0.95rem',
              fontWeight: 700,
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              boxShadow: '0 4px 20px rgba(99, 102, 241, 0.35)'
            }}
          >
            <span>Start Official Assessment</span>
            <ArrowRight size={20} />
          </button>
        </div>

        </div>
      </div>
    </div>
  );
}


