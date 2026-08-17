import React, { useState } from 'react';
import { X, Save, Check, Database, Bot, Sparkles, Cpu, Key } from 'lucide-react';
import { getSavedAppsScriptUrl, saveAppsScriptUrl } from '../../../services/googleSheetService';
import { 
  getSavedAIApiKey, saveAIApiKey, 
  getSavedAIEngine, saveAIEngine, 
  getSavedAIStrictness, saveAIStrictness 
} from '../../../services/aiCodeEvaluatorService';

export default function SettingsModal({ isOpen, onClose, onRefreshQuestions }) {
  const [scriptUrl, setScriptUrl] = useState(getSavedAppsScriptUrl());
  const [aiEngine, setAiEngine] = useState(getSavedAIEngine());
  const [aiApiKey, setAiApiKey] = useState(getSavedAIApiKey());
  const [aiStrictness, setAiStrictness] = useState(getSavedAIStrictness());
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    saveAppsScriptUrl(scriptUrl);
    saveAIEngine(aiEngine);
    saveAIApiKey(aiApiKey);
    saveAIStrictness(aiStrictness);

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
    if (onRefreshQuestions) {
      onRefreshQuestions();
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content animate-fade-in" style={{ padding: '28px', maxWidth: '650px' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Bot size={24} color="var(--accent-primary)" />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Engine & Integration Settings</h3>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {/* Section 1: AI Agent Evaluator Engine */}
        <div style={{
          background: 'rgba(99, 102, 241, 0.05)',
          border: '1px solid rgba(99, 102, 241, 0.2)',
          borderRadius: '12px',
          padding: '18px',
          marginBottom: '20px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <Sparkles size={18} color="var(--accent-primary)" />
            <h4 style={{ fontSize: '0.98rem', fontWeight: 700 }}>🤖 AI Agent Code Evaluator Configuration</h4>
          </div>

          <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '14px' }}>
            Evaluates code logic, time/space complexity, test cases, and rubric scores without requiring Docker or external servers.
          </p>

          {/* Engine Selection */}
          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px' }}>
              Primary Evaluation Engine:
            </label>
            <select
              value={aiEngine}
              onChange={(e) => setAiEngine(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '8px',
                background: 'var(--bg-input)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-main)',
                fontSize: '0.85rem',
                fontWeight: 600,
                outline: 'none'
              }}
            >
              <option value="builtin">🤖 Built-in Smart Neural AI Engine (100% Free, Client-side AST/Trace Simulator)</option>
              <option value="gemini">⚡ Google Gemini Free Tier API (Requires Gemini API Key)</option>
            </select>
          </div>

          {/* Gemini API Key input (shown if engine === 'gemini') */}
          {aiEngine === 'gemini' && (
            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px' }}>
                Google Gemini API Key (Free):
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Key size={16} color="var(--text-dim)" />
                <input
                  type="password"
                  value={aiApiKey}
                  onChange={(e) => setAiApiKey(e.target.value)}
                  placeholder="AIzaSy..."
                  style={{
                    flex: 1,
                    padding: '10px 12px',
                    borderRadius: '8px',
                    background: 'var(--bg-input)',
                    border: '1px solid var(--border-color)',
                    color: 'var(--text-main)',
                    fontSize: '0.85rem',
                    fontFamily: 'var(--font-code)',
                    outline: 'none'
                  }}
                />
              </div>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '4px' }}>
                Get a free API key at <a href="https://aistudio.google.com/" target="_blank" rel="noreferrer" style={{ color: 'var(--accent-primary)' }}>Google AI Studio</a>.
              </p>
            </div>
          )}

          {/* AI Strictness */}
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px' }}>
              AI Grading Persona / Strictness:
            </label>
            <select
              value={aiStrictness}
              onChange={(e) => setAiStrictness(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '8px',
                background: 'var(--bg-input)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-main)',
                fontSize: '0.85rem',
                outline: 'none'
              }}
            >
              <option value="balanced">Balanced (Evaluates logic, complexity & edge cases fairly)</option>
              <option value="strict">Strict (High standard for Big-O performance & clean code)</option>
              <option value="mentor">Helpful Mentor (Provides detailed code suggestions & guidance)</option>
            </select>
          </div>
        </div>

        {/* Section 2: Google Apps Script Question Bank */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <Database size={16} color="var(--accent-secondary)" />
            <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)' }}>
              Google Apps Script Question Bank Endpoint:
            </label>
          </div>
          <input
            type="text"
            value={scriptUrl}
            onChange={(e) => setScriptUrl(e.target.value)}
            placeholder="https://script.google.com/macros/s/.../exec"
            style={{
              width: '100%',
              padding: '10px 14px',
              borderRadius: '8px',
              background: 'var(--bg-input)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-main)',
              fontFamily: 'var(--font-code)',
              fontSize: '0.82rem',
              outline: 'none',
              marginBottom: '6px'
            }}
          />
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', paddingTop: '16px', borderTop: '1px solid var(--border-color)' }}>
          <button onClick={onClose} className="btn btn-outline">
            Cancel
          </button>
          
          <button onClick={handleSave} className="btn btn-primary">
            {savedSuccess ? <Check size={16} /> : <Save size={16} />}
            <span>{savedSuccess ? 'Settings Saved!' : 'Save & Apply Config'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
