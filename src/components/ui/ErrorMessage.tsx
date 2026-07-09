import { AlertTriangle, RotateCw } from 'lucide-react'
import styled from 'styled-components'

const Wrap = styled.div`
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.75rem 0.875rem;
  border-radius: ${({ theme }) => theme.radius.md};
  background: color-mix(in oklab, ${({ theme }) => theme.color.destructive} 12%, transparent);
  border: 1px solid color-mix(in oklab, ${({ theme }) => theme.color.destructive} 30%, transparent);
`

const Icon = styled(AlertTriangle)`
  flex-shrink: 0;
  color: ${({ theme }) => theme.color.destructive};
`

const Message = styled.p`
  flex: 1;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.color.foreground};
`

const Retry = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.3125rem 0.625rem;
  border-radius: ${({ theme }) => theme.radius.sm};
  font-size: 0.8125rem;
  font-weight: 500;
  color: ${({ theme }) => theme.color.foreground};
  background: ${({ theme }) => theme.color.secondary};
  border: 1px solid ${({ theme }) => theme.color.border};
  transition: background 0.15s ease;

  &:hover {
    background: ${({ theme }) => theme.color.accent};
  }
`

export interface ErrorMessageProps {
  message: string
  onRetry?: () => void
}

export function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <Wrap role="alert">
      <Icon size={16} aria-hidden />
      <Message>{message}</Message>
      {onRetry && (
        <Retry type="button" onClick={onRetry}>
          <RotateCw size={13} aria-hidden />
          Retry
        </Retry>
      )}
    </Wrap>
  )
}
