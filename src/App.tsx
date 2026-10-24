import { useState } from 'react'
import { Button } from './components/button'
import './style.css'

const STANDARD_FONTS = [
  { name: 'System UI', value: 'system-ui, sans-serif' },
  { name: 'Monospace', value: 'monospace, "Courier New"' },
  { name: 'Serif (Georgia)', value: 'Georgia, serif' },
  { name: 'Impact', value: 'Impact, sans-serif' },
  { name: 'Trebuchet MS', value: '"Trebuchet MS", sans-serif' },
  { name: 'Cursive', value: 'cursive, "Comic Sans MS"' },
]

export default function App() {
  const [currentPage, setCurrentPage] = useState<1 | 2>(1)

  const [clickCount, setClickCount] = useState(0)

  const [buttonWidth, setButtonWidth] = useState(150)
  const [buttonHeight, setButtonHeight] = useState(120)
  const [buttonRadius, setButtonRadius] = useState(8)
  const [buttonDepth, setButtonDepth] = useState(10)
  const [buttonColor, setButtonColor] = useState('#3b669c')

  const [buttonLabel, setButtonLabel] = useState('PUSH')
  const [buttonFontFamily, setButtonFontFamily] = useState(STANDARD_FONTS[0].value)
  const [buttonFontSize, setButtonFontSize] = useState(28)
  const [adaptiveFont, setAdaptiveFont] = useState(false)
  const [buttonTextColor, setButtonTextColor] = useState('#ffffff')



  const switchPage = (targetPage: 1 | 2) => {
    if (currentPage === targetPage) return
    if (document.startViewTransition) {
      document.startViewTransition(() => setCurrentPage(targetPage))
    } else {
      setCurrentPage(targetPage)
    }
  }

  return (
    <div className="app-shell">
      {/* Navigation Bar */}
      <nav>
        <a
          className={currentPage === 1 ? 'active' : ''}
          onClick={() => switchPage(1)}
        >
          Button
        </a>
        <a
          className={currentPage === 2 ? 'active' : ''}
          onClick={() => switchPage(2)}
        >
          CheckBox
        </a>
      </nav>

      <main className="content">
        {currentPage === 1 ? (
          <div className="page-workspace">
        
            <div className="counter-badge">
              <span className="counter-label">Clicks</span>
              <span className="counter-value">{clickCount}</span>
            </div>

      
            <div className="button-stage">
              <Button
                width={buttonWidth}
                height={buttonHeight}
                radius={buttonRadius}
                depth={buttonDepth}
                fontSize={buttonFontSize}
                fontFamily={buttonFontFamily}
                adaptiveText={adaptiveFont}
                color={buttonColor}
                textColor={buttonTextColor}
                label={buttonLabel}
                onAction={() => setClickCount((previous) => previous + 1)}
              />

            </div>

  
            <div className="control-dock">
              {/*  Button Parameters ── */}
              <div className="dock-group">
                <span className="dock-group-title">Button</span>
                <div className="dock-group-items">
                  <div className="ctrl-item">
                    <label>
                      Width <span>{buttonWidth}px</span>
                    </label>
                    <input
                      type="range"
                      min="80"
                      max="600"
                      value={buttonWidth}
                      onChange={(e) => setButtonWidth(Number(e.target.value))}
                    />
                  </div>

                  <div className="ctrl-item">
                    <label>
                      Height <span>{buttonHeight}px</span>
                    </label>
                    <input
                      type="range"
                      min="60"
                      max="600"
                      value={buttonHeight}
                      onChange={(e) => setButtonHeight(Number(e.target.value))}
                    />
                  </div>

                  <div className="ctrl-item">
                    <label>
                      Radius <span>{buttonRadius}px</span>
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="360"
                      value={buttonRadius}
                      onChange={(e) => setButtonRadius(Number(e.target.value))}
                    />
                  </div>

                  <div className="ctrl-item">
                    <label>
                      3D Depth <span>{buttonDepth}px</span>
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="30"
                      value={buttonDepth}
                      onChange={(e) => setButtonDepth(Number(e.target.value))}
                    />
                  </div>

                  <div className="ctrl-item">
                    <label>Base Color</label>
                    <input
                      type="color"
                      value={buttonColor}
                      onChange={(e) => setButtonColor(e.target.value)}
                    />
                  </div>
                </div>
              </div>

   
              <div className="dock-divider" />

              {/* Text Parameters */}
              <div className="dock-group">
                <span className="dock-group-title">Text</span>
                <div className="dock-group-items">
                  <div className="ctrl-item">
                    <label>Label</label>
                    <input
                      type="text"
                      maxLength={12}
                      value={buttonLabel}
                      onChange={(e) => setButtonLabel(e.target.value)}
                    />
                  </div>

                  <div className="ctrl-item">
                    <label>Font Family</label>
                    <select
                      value={buttonFontFamily}
                      onChange={(e) => setButtonFontFamily(e.target.value)}
                    >
                      {STANDARD_FONTS.map((font) => (
                        <option key={font.name} value={font.value}>
                          {font.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="ctrl-item">
                    <label>
                      Font Size <span>{adaptiveFont ? 'Auto' : `${buttonFontSize}px`}</span>
                    </label>
                    <input
                      type="range"
                      min="12"
                      max="64"
                      disabled={adaptiveFont}
                      value={buttonFontSize}
                      onChange={(e) => setButtonFontSize(Number(e.target.value))}
                    />
                  </div>

                  <div className="ctrl-item ctrl-checkbox-item">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={adaptiveFont}
                        onChange={(e) => setAdaptiveFont(e.target.checked)}
                      />
                      <span>Adaptive</span>
                    </label>
                  </div>

                  <div className="ctrl-item">
                    <label>Text Color</label>
                    <input
                      type="color"
                      value={buttonTextColor || '#ffffff'}
                      onChange={(e) => setButtonTextColor(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="page-blank">
            <div className="showcase-box">
              <span className="empty-state">Template Showcase</span>
              
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
