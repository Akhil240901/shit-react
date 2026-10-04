import React from 'react';
import { Search } from 'lucide-react';
import type { Challenge } from '../challenges/types';

interface SidebarProps {
  challenges: Challenge[];
  selectedId: string;
  onSelect: (id: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  categories: readonly string[];
}

export const Sidebar: React.FC<SidebarProps> = ({
  challenges,
  selectedId,
  onSelect,
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  categories
}) => {
  return (
    <aside className="sidebar">
      {/* Search and Category Filter */}
      <div className="sidebar-search-box">
        <div className="search-input-wrapper">
          <Search size={15} className="search-icon" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search exercises, tags..."
            className="search-input"
          />
        </div>

        <div className="category-filter-list">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`category-chip ${selectedCategory === cat ? 'active' : ''}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Challenges List */}
      <div className="sidebar-content">
        {challenges.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '32px 16px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            No challenges found for "{searchQuery}"
          </div>
        ) : (
          challenges.map((c) => {
            const isSelected = c.id === selectedId;
            const diffClass =
              c.difficulty === 'Beginner'
                ? 'difficulty-beginner'
                : c.difficulty === 'Intermediate'
                ? 'difficulty-intermediate'
                : 'difficulty-advanced';

            return (
              <button
                key={c.id}
                type="button"
                onClick={() => onSelect(c.id)}
                className={`challenge-item ${isSelected ? 'active' : ''}`}
              >
                <div className="challenge-item-header">
                  <span className="challenge-item-title">
                    {c.title}
                  </span>
                  <span className={`difficulty-badge ${diffClass}`}>
                    {c.difficulty}
                  </span>
                </div>

                <p className="challenge-item-desc">{c.description}</p>

                <div className="challenge-item-tags">
                  {c.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="tag-badge">
                      #{tag}
                    </span>
                  ))}
                  {c.tags.length > 3 && (
                    <span className="tag-badge">+{c.tags.length - 3}</span>
                  )}
                </div>
              </button>
            );
          })
        )}
      </div>
    </aside>
  );
};
