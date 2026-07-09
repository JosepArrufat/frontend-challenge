import type { ReactNode } from 'react'
import styled from 'styled-components'

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.625rem;
  padding: 1.75rem 1.25rem;
  text-align: center;
`

const Mark = styled.div`
  display: grid;
  place-items: center;
  width: 2.75rem;
  height: 2.75rem;
  border-radius: ${({ theme }) => theme.radius.lg};
  color: ${({ theme }) => theme.color.mutedForeground};
  background: ${({ theme }) => theme.color.muted};
  border: 1px solid ${({ theme }) => theme.color.border};
`

const Title = styled.p`
  font-size: 0.9375rem;
  font-weight: 600;
  color: ${({ theme }) => theme.color.foreground};
`

const Description = styled.p`
  max-width: 22rem;
  font-size: 0.8125rem;
  color: ${({ theme }) => theme.color.mutedForeground};
`

export interface EmptyStateProps {
  icon: ReactNode
  title: string
  description?: string
  action?: ReactNode
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <Wrap>
      <Mark aria-hidden>{icon}</Mark>
      <Title>{title}</Title>
      {description && <Description>{description}</Description>}
      {action}
    </Wrap>
  )
}
