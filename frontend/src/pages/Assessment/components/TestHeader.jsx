import React from 'react';
import { Search, Filter, Layers, Send, BookmarkCheck } from 'lucide-react';

export default function TestHeader({
  activeType,
  setActiveType,
  activeSection,
  setActiveSection,
  searchQuery,
  setSearchQuery,
  onOpenPalette,
  onSubmitTest,
  isSubmitting,
  counts
}) {
  return (
    <div style={{
      background: '#ffffff',
      borderBottom: '1px solid var(--border-color)',
      padding: '12px 24px',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.02)'
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '14px'
      }}>
        {/* Filters Removed */}

        {/* Search & Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Search Box Removed */}

          {/* Question Grid Drawer Toggle */}
          <button onClick={onOpenPalette} className="btn btn-secondary btn-sm">
            <Layers size={16} />
            <span>Question Palette</span>
          </button>

          {/* Permanent Submit Test Button */}
          <button onClick={onSubmitTest} disabled={isSubmitting} className="btn btn-success btn-sm" style={{ padding: '6px 16px', fontWeight: 700, opacity: isSubmitting ? 0.6 : 1, pointerEvents: isSubmitting ? 'none' : 'auto' }}>
            {isSubmitting ? (
              <>
                <div className="pulse-dot" style={{ width: '8px', height: '8px' }} />
                <span>Submitting...</span>
              </>
            ) : (
              <>
                <Send size={15} />
                <span>Submit Test</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
