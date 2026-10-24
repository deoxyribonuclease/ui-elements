# Custom UI Elements 

A lightweight library of custom, accessible UI components built completely from scratch **without** native elements and zero third-party UI dependencies.

---

## Key Features

- **No Native Inputs / Zero Library Inheritance:** Pure `<div>` components powered by hardware Pointer Events (`setPointerCapture`, bounding-box hit-testing).
- **OOP Architecture:** Clean separation of concerns using TypeScript classes:
  - `ButtonStyleModel` & `CheckBoxModel`: encapsulate geometry, dynamic 3D shadows, and CSS variable exports.
  - `CheckBoxGroupController`: handles tri-state derivation (`checked`, `unchecked`, `indeterminate`) and parent-child two-way synchronization.
- **Adaptive Typography:** Algorithmic auto-fitting font size for buttons based on container dimensions.
- **Modern CSS:** Native CSS nesting, CSS custom properties, and zero visual artifacts or residual shadows.
- **Live Customization:** Interactive parameter docks for dimensions, radiuses, 3D depths, and color palettes in real-time.

---

## Project Structure

```text
src/
├── components/
│   ├── button/           # Button component + ButtonStyleModel + CSS
│   └── checkbox/         # CheckBox component + CheckBoxModel + CheckBoxGroupController + CSS
├── pages/
│   ├── ButtonPage.tsx    # Page 1: 3D Button showcase with parameter dock
│   └── CheckBoxPage.tsx  # Page 2: File manager table with parent-child checkboxes
├── App.tsx               # Main shell & tab navigation
└── style.css             # Global styling & layout