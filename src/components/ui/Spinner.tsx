import { Loader2 } from 'lucide-react'
import styled, { keyframes } from 'styled-components'

const spin = keyframes`
  to { transform: rotate(360deg); }
`

const SpinningIcon = styled(Loader2)`
  animation: ${spin} 0.8s linear infinite;
`

export interface SpinnerProps {
  size?: number
  label?: string
}

export function Spinner({ size = 16, label = 'Loading' }: SpinnerProps) {
  return (
    <span role="status" aria-live="polite" style={{ display: 'inline-flex', alignItems: 'center' }}>
      <SpinningIcon size={size} aria-hidden />
      <span className="sr-only">{label}</span>
    </span>
  )
}
