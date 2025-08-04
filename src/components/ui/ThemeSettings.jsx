import React from 'react';
import { useTheme } from '../../context/ThemeContext.jsx';
import { useUser } from '../../context/UserContext.jsx';

const ThemeSettings = () => {
  const { theme, setTheme, toggleTheme, setPrimaryColor, setFontSize, resetTheme } = useTheme();
  const { user } = useUser();

  const themeOptions = [
    { value: 'light', label: 'Light Theme', icon: '☀️' },
    { value: 'dark', label: 'Dark Theme', icon: '🌙' },
    { value: 'system', label: 'System Default', icon: '🖥️' }
  ];

  const fontSizeOptions = [
    { value: 'small', label: 'Small', icon: '🔤' },
    { value: 'medium', label: 'Medium', icon: '🔡' },
    { value: 'large', label: 'Large', icon: '🔠' }
  ];

  const colorOptions = [
    { value: '#007bff', label: 'Blue', color: '#007bff' },
    { value: '#28a745', label: 'Green', color: '#28a745' },
    { value: '#dc3545', label: 'Red', color: '#dc3545' },
    { value: '#6f42c1', label: 'Purple', color: '#6f42c1' },
    { value: '#fd7e14', label: 'Orange', color: '#fd7e14' },
    { value: '#20c997', label: 'Teal', color: '#20c997' }
  ];

  return (
    <div className="theme-settings-container">
      <div className="settings-header">
        <h2>🎨 Theme Settings</h2>
        <p>Customize your QMS app appearance, {user.username}!</p>
      </div>

      <div className="settings-sections">
        {/* Theme Mode Section */}
        <div className="settings-section">
          <h3>Theme Mode</h3>
          <div className="theme-options">
            {themeOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setTheme(option.value)}
                className={`theme-option ${theme.mode === option.value ? 'active' : ''}`}
              >
                <span className="theme-icon">{option.icon}</span>
                <span className="theme-label">{option.label}</span>
                {theme.mode === option.value && <span className="check-mark">✓</span>}
              </button>
            ))}
          </div>
          <button onClick={toggleTheme} className="toggle-button">
            🔄 Quick Toggle (Light/Dark)
          </button>
        </div>

        {/* Primary Color Section */}
        <div className="settings-section">
          <h3>Primary Color</h3>
          <div className="color-options">
            {colorOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setPrimaryColor(option.value)}
                className={`color-option ${theme.primaryColor === option.value ? 'active' : ''}`}
                style={{ backgroundColor: option.color }}
                title={option.label}
              >
                {theme.primaryColor === option.value && (
                  <span className="check-mark" style={{ color: 'white' }}>✓</span>
                )}
              </button>
            ))}
          </div>
          <div className="current-color">
            Current: <span style={{ color: theme.primaryColor }}>{theme.primaryColor}</span>
          </div>
        </div>

        {/* Font Size Section */}
        <div className="settings-section">
          <h3>Font Size</h3>
          <div className="font-size-options">
            {fontSizeOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setFontSize(option.value)}
                className={`font-size-option ${theme.fontSize === option.value ? 'active' : ''}`}
              >
                <span className="font-icon">{option.icon}</span>
                <span className="font-label">{option.label}</span>
                {theme.fontSize === option.value && <span className="check-mark">✓</span>}
              </button>
            ))}
          </div>
        </div>

        {/* Preview Section */}
        <div className="settings-section">
          <h3>Preview</h3>
          <div className="theme-preview" style={{ 
            '--preview-primary': theme.primaryColor,
            '--preview-font-size': theme.fontSize 
          }}>
            <div className="preview-card">
              <h4 style={{ color: theme.primaryColor }}>QMS Sample Card</h4>
              <p>This is how your theme will look across the application.</p>
              <button 
                className="preview-button" 
                style={{ backgroundColor: theme.primaryColor }}
              >
                Sample Button
              </button>
            </div>
          </div>
        </div>

        {/* Current Settings */}
        <div className="settings-section">
          <h3>Current Settings</h3>
          <div className="current-settings">
            <div className="setting-item">
              <strong>Theme Mode:</strong> {theme.mode}
            </div>
            <div className="setting-item">
              <strong>Primary Color:</strong> 
              <span style={{ color: theme.primaryColor }}>{theme.primaryColor}</span>
            </div>
            <div className="setting-item">
              <strong>Font Size:</strong> {theme.fontSize}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="settings-actions">
          <button onClick={resetTheme} className="reset-button">
            🔄 Reset to Defaults
          </button>
        </div>
      </div>

      <style jsx>{`
        .theme-settings-container {
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
        }

        .settings-header {
          text-align: center;
          margin-bottom: 30px;
        }

        .settings-header h2 {
          color: var(--primary-color, ${theme.primaryColor});
          margin-bottom: 10px;
        }

        .settings-section {
          margin-bottom: 30px;
          padding: 20px;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          background: white;
        }

        .settings-section h3 {
          margin-bottom: 15px;
          color: #333;
        }

        .theme-options, .font-size-options {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          margin-bottom: 15px;
        }

        .theme-option, .font-size-option {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 15px;
          border: 2px solid #e0e0e0;
          border-radius: 6px;
          background: white;
          cursor: pointer;
          transition: all 0.2s;
        }

        .theme-option:hover, .font-size-option:hover {
          border-color: ${theme.primaryColor};
        }

        .theme-option.active, .font-size-option.active {
          border-color: ${theme.primaryColor};
          background: ${theme.primaryColor}20;
        }

        .color-options {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          margin-bottom: 10px;
        }

        .color-option {
          width: 40px;
          height: 40px;
          border: 3px solid transparent;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }

        .color-option:hover {
          transform: scale(1.1);
        }

        .color-option.active {
          border-color: #333;
          transform: scale(1.15);
        }

        .toggle-button, .reset-button {
          padding: 10px 20px;
          border: 1px solid ${theme.primaryColor};
          border-radius: 6px;
          background: white;
          color: ${theme.primaryColor};
          cursor: pointer;
          transition: all 0.2s;
        }

        .toggle-button:hover, .reset-button:hover {
          background: ${theme.primaryColor};
          color: white;
        }

        .preview-card {
          padding: 20px;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          background: white;
        }

        .preview-button {
          padding: 8px 16px;
          border: none;
          border-radius: 4px;
          color: white;
          cursor: pointer;
          margin-top: 10px;
        }

        .current-settings {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .setting-item {
          padding: 8px;
          background: #f8f9fa;
          border-radius: 4px;
        }

        .check-mark {
          color: ${theme.primaryColor};
          font-weight: bold;
        }
      `}</style>
    </div>
  );
};

export default ThemeSettings;