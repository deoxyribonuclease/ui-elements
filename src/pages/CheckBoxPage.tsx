import { useState } from 'react'
import { Button } from '../components/button'
import { CheckBox, CheckBoxGroupController } from '../components/checkbox'

export interface FileItem {
  id: string
  filename: string
  size: number
  time: string
  checked: boolean
}

const INITIAL_FILES: FileItem[] = [
  { id: '1', filename: 'mock_01.json', size: 21886800, time: '2026-01-11 16:39:22', checked: true },
  { id: '2', filename: 'mock_02.dat', size: 620, time: '2026-12-22 18:21:22', checked: false },
  { id: '3', filename: 'mock_03.bin', size: 12402, time: '2026-01-12 20:59:08', checked: true },
]

const MOCK_EXTENSIONS = ['json', 'dat', 'bin', 'log', 'yaml', 'csv', 'lock']

export function CheckBoxPage() {
  const [files, setFiles] = useState<FileItem[]>(INITIAL_FILES)

  const [cbSize, setCbSize] = useState(20)
  const [cbRadius, setCbRadius] = useState(4)
  const [cbColor, setCbColor] = useState('#525252')
  const [cbSocketColor, setCbSocketColor] = useState('#525252')
  const [cbCheckColor, setCbCheckColor] = useState('#ffffff')

  const masterState = CheckBoxGroupController.deriveGroupState(
    files.map((f) => f.checked)
  )

  const handleMasterToggle = () => {
    const isChecked = CheckBoxGroupController.getNextGroupValue(masterState);
    setFiles((prevFiles) =>
      prevFiles.map((file) => ({ ...file, checked: isChecked }))
    );
    const selectedNames = isChecked ? files.map((file) => file.filename) : [];
    console.log(selectedNames);
};

 const handleChildToggle = (id: string) => {
  const updatedFiles = files.map((file) =>
    file.id === id ? { ...file, checked: !file.checked } : file
  );

  const selectedNames = updatedFiles.flatMap((file) =>
    file.checked ? [file.filename] : []
  );
  console.log(selectedNames);
  setFiles(updatedFiles);
};

  const handleAddRow = () => {
    const template = 'mock'
    const ext = MOCK_EXTENSIONS[Math.floor(Math.random() * MOCK_EXTENSIONS.length)]
    const suffix = String(files.length + 1).padStart(2, '0')
    const filename = `${template}_${suffix}.${ext}`

    const randomSize = Math.floor(Math.random() * 880000) + 1024

    const now = new Date()
    const pad = (n: number) => n.toString().padStart(2, '0')
    const timeStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`

    const newFile: FileItem = {
      id: `file_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      filename,
      size: randomSize,
      time: timeStr,
      checked: false,
    }
    const updated = [...files, newFile]
    setFiles(updated)
  }

  const handleDeleteLastRow = () => {
    if (files.length === 0) return
    const updated = files.slice(0, -1)
    const selected = updated.filter((f) => f.checked).map((f) => f.filename)
    console.log( selected )
    setFiles(updated)
  }

  return (
    <div className="page-workspace page-workspace-table">
      {/* Сувора таблиця файлів з переповненням та прокруткою */}
      <div className="file-table-card">
        {/* Панель дій таблиці з нашими кастомними кнопками Button */}
        <div className="file-table-toolbar">
          <span className="file-table-title">Files ({files.length})</span>
          <div className="file-table-actions">
            <Button
              label="+ Add Row"
              width={86}
              height={28}
              radius={5}
              depth={0}
              fontSize={12}
              color="#1e293b"
              textColor="#ffffff"
              onAction={handleAddRow}
            />
            <Button
              label="- Delete Row"
              width={96}
              height={28}
              radius={5}
              depth={0}
              fontSize={12}
              color="#be123c"
              textColor="#ffffff"
              disabled={files.length === 0}
              onAction={handleDeleteLastRow}
            />
          </div>
        </div>

        {/* Контейнер зі скролом при переповненні */}
        <div className="file-table-scroll-container">
          <table className="file-table">
            <thead>
              <tr>
                <th className="th-checkbox">
                  <CheckBox
                    state={masterState}
                    size={cbSize}
                    radius={cbRadius}
                    color={cbColor}
                    socketColor={cbSocketColor}
                    checkColor={cbCheckColor}
                    onToggle={handleMasterToggle}
                  />
                </th>
                <th>Filename</th>
                <th>Size</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {files.map((file) => (
                <tr
                  key={file.id}
                  className={file.checked ? 'is-selected' : ''}
                  onClick={() => handleChildToggle(file.id)}
                >
                  <td
                    className="td-checkbox"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <CheckBox
                      state={file.checked ? 'checked' : 'unchecked'}
                      size={cbSize}
                      radius={cbRadius}
                      color={cbColor}
                      socketColor={cbSocketColor}
                      checkColor={cbCheckColor}
                      onToggle={() => handleChildToggle(file.id)}
                    />
                  </td>
                  <td className="td-filename">{file.filename}</td>
                  <td className="td-size">{file.size}</td>
                  <td className="td-time">{file.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Панель налаштувань параметрів чекбокса */}
      <div className="control-dock">
        {/* Геометрія */}
        <div className="dock-group">
          <span className="dock-group-title">Geometry</span>
          <div className="dock-group-items">
            <div className="ctrl-item">
              <label>
                Size <span>{cbSize}px</span>
              </label>
              <input
                type="range"
                min="16"
                max="32"
                value={cbSize}
                onChange={(e) => setCbSize(Number(e.target.value))}
              />
            </div>

            <div className="ctrl-item">
              <label>
                Radius <span>{cbRadius}px</span>
              </label>
              <input
                type="range"
                min="0"
                max="16"
                value={cbRadius}
                onChange={(e) => setCbRadius(Number(e.target.value))}
              />
            </div>
          </div>
        </div>

        <div className="dock-divider" />

        {/* Кольори: грань, сокет (рамка), галочка */}
        <div className="dock-group">
          <span className="dock-group-title">Colors</span>
          <div className="dock-group-items">
            <div className="ctrl-item">
              <label>Fill</label>
              <input
                type="color"
                value={cbColor}
                onChange={(e) => setCbColor(e.target.value)}
              />
            </div>

            <div className="ctrl-item">
              <label>Socket/Border</label>
              <input
                type="color"
                value={cbSocketColor}
                onChange={(e) => setCbSocketColor(e.target.value)}
              />
            </div>

            <div className="ctrl-item">
              <label>Check</label>
              <input
                type="color"
                value={cbCheckColor}
                onChange={(e) => setCbCheckColor(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
