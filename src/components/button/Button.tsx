import React, { useState, useRef, useMemo } from 'react'
import type { CSSProperties } from 'react'
import './Button.css'

export interface ButtonProps {
  width?: number
  height?: number
  radius?: number
  depth?: number
  fontSize?: number
  fontFamily?: string
  adaptiveText?: boolean
  color?: string
  textColor?: string
  label?: string
  disabled?: boolean
  onAction?: () => void
}

export function Button(props: ButtonProps = {}) {
  const [isHovered, setIsHovered] = useState(false)
  const [isPressed, setIsPressed] = useState(false)

  const buttonRef = useRef<HTMLDivElement>(null)

  const styles = useMemo(() => new ButtonStyleModel(props), [props])

  const handlePressStart = (event: React.PointerEvent<HTMLDivElement>) => {
    if (props.disabled || event.button !== 0) return
    buttonRef.current?.setPointerCapture?.(event.pointerId)
    setIsPressed(true)
  }

  const handlePressEnd = () => {
    if (props.disabled || !isPressed) return
    setIsPressed(false)
    props.onAction?.()
  }

  const handleHoverStart = () => {
    if (!props.disabled) setIsHovered(true)
  }

  const handleHoverEnd = () => {
    setIsHovered(false)
    setIsPressed(false)
  }

  const classList = [
    'isometric-button-socket',
    styles.isFlat ? 'is-flat' : '',
    isPressed ? 'is-pressed' : '',
    isHovered ? 'is-hovered' : '',
    props.disabled ? 'is-disabled' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div
      ref={buttonRef}
      className={classList}
      style={styles.toCSSVariables(isPressed)}
      onPointerDown={handlePressStart}
      onPointerUp={handlePressEnd}
      onPointerEnter={handleHoverStart}
      onPointerLeave={handleHoverEnd}
    >
      <div className="isometric-button-face">
        <span>{styles.label}</span>
      </div>
    </div>
  )
}

export class ButtonStyleModel {
  readonly width: number
  readonly height: number
  readonly radius: number
  readonly depth: number
  readonly fontSize: number
  readonly fontFamily: string
  readonly adaptiveText: boolean
  readonly color: string
  readonly textColor?: string
  readonly label: string

  constructor(options: ButtonProps = {}) {
    this.width = options.width ?? 140
    this.height = options.height ?? 140
    this.radius = options.radius ?? 6
    this.depth = options.depth ?? 10
    this.fontSize = options.fontSize ?? 28
    this.fontFamily = options.fontFamily ?? 'system-ui, sans-serif'
    this.adaptiveText = options.adaptiveText ?? false
    this.color = options.color ?? '#3b669c'
    this.textColor = options.textColor ?? '#ffffff'
    this.label = options.label ?? 'Push'
  }

  get isFlat(): boolean {
    return this.depth <= 0
  }

  calculateFontSize(): number {
    if (!this.adaptiveText) {
      return this.fontSize
    }

    const availableWidth = this.width * 0.78
    const charactersCount = Math.max(this.label.length, 1)
    const letterWidth = charactersCount * 0.62

    const maxFontByWidth = Math.floor(availableWidth / letterWidth)
    const maxFontByHeight = Math.floor(this.height * 0.45)

    const bestFitSize = Math.min(maxFontByWidth, maxFontByHeight)
    return Math.max(11, Math.min(bestFitSize, 92))
  }

  generate3DShadow(isPressed: boolean): string {
    if (this.isFlat) {
      return '0 2px 8px rgba(0, 0, 0, 0.12)'
    }

    if (isPressed) {
      return `
        inset 0 2px 4px var(--dish-highlight),
        inset 0 -3px 5px var(--dish-shadow),
        -1px 1px 0 var(--side-color),
        -2px 2px 0 var(--side-color)
      `
    }
    const shadowLayers: string[] = [
      'inset 0 2px 4px var(--dish-highlight)',
      'inset 0 -3px 5px var(--dish-shadow)',
    ]

    for (let layer = 1; layer <= this.depth; layer++) {
      shadowLayers.push(`-${layer}px ${layer}px 0 var(--side-color)`)
    }

    return shadowLayers.join(',')
  }

  toCSSVariables(isPressed: boolean): CSSProperties {
    let buttonOffset = 'none'
    if (!this.isFlat) {
      buttonOffset = isPressed
        ? 'translate(2px, -2px)'
        : `translate(${this.depth}px, -${this.depth}px)`
    }

    const socketGap = this.isFlat
      ? '0px'
      : this.depth <= 4
        ? `${this.depth * 2 + 4}px`
        : '22px'

    return {
      '--btn-w': `${this.width}px`,
      '--btn-h': `${this.height}px`,
      '--btn-radius': `${this.radius}px`,
      '--btn-font-size': `${this.calculateFontSize()}px`,
      '--btn-font-family': this.fontFamily,
      '--btn-color': this.color,
      '--btn-text': this.textColor,
      '--face-transform': buttonOffset,
      '--face-shadow': this.generate3DShadow(isPressed),
      '--socket-gap': socketGap,
    } as CSSProperties
  }
}
