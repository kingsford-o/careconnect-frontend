import { useState, useEffect } from 'react';

const AVATARS = [
  '🐱', '🐶', '🦊', '🐼', '🐨', '🦁',
  '🐯', '🐸', '🐧', '🦉', '🦄', '🦥',
  '🦦', '🦜', '🐢', '🐰'
];

export default function AvatarPicker({ selectedAvatar, onSelect, label = 'Choose your avatar' }) {
  const [focusedIndex, setFocusedIndex] = useState(-1);

  const handleKeyDown = (e, index) => {
    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        e.preventDefault();
        setFocusedIndex((index + 1) % AVATARS.length);
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        e.preventDefault();
        setFocusedIndex((index - 1 + AVATARS.length) % AVATARS.length);
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        onSelect(AVATARS[index]);
        break;
      case 'Escape':
        e.preventDefault();
        setFocusedIndex(-1);
        break;
    }
  };

  useEffect(() => {
    if (focusedIndex >= 0) {
      const element = document.getElementById(`avatar-${focusedIndex}`);
      element?.focus();
    }
  }, [focusedIndex]);

  return (
    <div className="avatar-picker">
      <label className="avatar-picker-label">{label}</label>
      <div className="avatar-grid" role="radiogroup" aria-label={label}>
        {AVATARS.map((avatar, index) => (
          <button
            key={avatar}
            id={`avatar-${index}`}
            type="button"
            className={`avatar-option ${selectedAvatar === avatar ? 'selected' : ''}`}
            onClick={() => onSelect(avatar)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            onFocus={() => setFocusedIndex(index)}
            aria-label={`Select ${avatar} avatar`}
            aria-checked={selectedAvatar === avatar}
            role="radio"
          >
            <span className="avatar-emoji">{avatar}</span>
            {selectedAvatar === avatar && (
              <span className="avatar-checkmark" aria-hidden="true">✓</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
