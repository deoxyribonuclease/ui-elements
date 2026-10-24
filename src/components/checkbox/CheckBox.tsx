import React, { useState, useRef, useMemo } from 'react'
import type { CSSProperties } from 'react'
import './CheckBox.css'

export type CheckBoxState = 'checked' | 'unchecked' | 'halfchecked' 

export interface CheckBoxProps {
  state?: CheckBoxState
  label?: string
  description?: string
  size?: number
  radius?: number
  color?: string        
  socketColor?: string   
  checkColor?: string   
  disabled?: boolean
  onToggle?: (nextState: CheckBoxState) => void
}


export function CheckBox(props: CheckBoxProps = {}) {
  const [isHovered, setIsHovered] = useState(false)
  const [isPressed, setIsPressed] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)

  const model = useMemo(() => new CheckBoxModel(props), [props])

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (props.disabled || e.button !== 0) return
    wrapperRef.current?.setPointerCapture?.(e.pointerId)
    setIsPressed(true)
  }

  const handlePointerUp = () => {
    if (props.disabled || !isPressed) return
    setIsPressed(false)
    props.onToggle?.(model.getNextState())
  }

  const iconSize = Math.max(10, Math.round(model.size * 0.62))

  return (
    <div
      ref={wrapperRef}
      className={`custom-checkbox-wrapper is-${model.state} ${isPressed ? 'is-pressed' : ''} ${isHovered ? 'is-hovered' : ''} ${props.disabled ? 'is-disabled' : ''}`}
      style={model.toCSSVariables()}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerEnter={() => !props.disabled && setIsHovered(true)}
      onPointerLeave={() => {
        setIsHovered(false)
        setIsPressed(false)
      }}
    >
      <div className="checkbox-socket">
        <div className="checkbox-face">
          {model.state === 'checked' && (
            <svg
              className="checkbox-icon"
              width={iconSize}
              height={iconSize}
              viewBox="0 0 16 16"
              fill="none"
            >
              <path
                d="M3 8.5L6.5 12L13 4"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}

          {model.state === 'halfchecked' && (
            <svg
              className="checkbox-icon"
              width={iconSize}
              height={iconSize}
              viewBox="0 0 16 16"
              fill="none"
            >
              <path
                d="M3 8H13"
                stroke="currentColor"
                strokeWidth="2.8"
                strokeLinecap="round"
              />
            </svg>
          )}
        </div>
      </div>

      {(model.label || props.description) && (
        <div className="checkbox-text-group">
          {model.label && <span className="checkbox-label">{model.label}</span>}
          {props.description && (
            <span className="checkbox-description">{props.description}</span>
          )}
        </div>
      )}
    </div>
  )
}


export class CheckBoxModel {
  readonly state: CheckBoxState
  readonly size: number
  readonly radius: number
  readonly color: string
  readonly socketColor: string
  readonly checkColor: string
  readonly label: string

  constructor(options: CheckBoxProps = {}) {
    this.state = options.state ?? 'unchecked'
    this.size = options.size ?? 20
    this.radius = options.radius ?? 4
    this.color = options.color ?? '#555a64'
    this.socketColor = options.socketColor ?? '#555a64'
    this.checkColor = options.checkColor ?? '#ffffff'
    this.label = options.label ?? ''
  }

  getNextState(): CheckBoxState {
    return this.state === 'checked' ? 'unchecked' : 'checked'
  }

  toCSSVariables(): CSSProperties {
    return {
      '--cb-size': `${this.size}px`,
      '--cb-radius': `${this.radius}px`,
      '--cb-color': this.color,
      '--cb-socket': this.socketColor,
      '--cb-check': this.checkColor,
    } as CSSProperties
  }
}

export class CheckBoxGroupController {
  static deriveGroupState(childStates: boolean[]): CheckBoxState {
    if (childStates.length === 0) return 'unchecked'

    const checkedCount = childStates.filter(Boolean).length

    if (checkedCount === childStates.length) return 'checked'
    if (checkedCount === 0) return 'unchecked'
    return 'halfchecked'
  }
  static getNextGroupValue(currentState: CheckBoxState): boolean {
    return currentState !== 'checked'
  }
}
