import styled, { keyframes } from 'styled-components'

export interface SkeletonProps {
  width?: string
  height?: string
  radius?: string
  className?: string
}

export function Skeleton({ width = '100%', height = '1rem', radius, className }: SkeletonProps) {
  return (
    <Block $width={width} $height={height} $radius={radius} className={className} aria-hidden />
  )
}

const shimmer = keyframes`
  from { background-position: 200% 0; }
  to { background-position: -200% 0; }
`

const Block = styled.span<{ $width: string; $height: string; $radius?: string }>`
  display: block;
  width: ${({ $width }) => $width};
  height: ${({ $height }) => $height};
  border-radius: ${({ $radius, theme }) => $radius ?? theme.radius.sm};
  background: linear-gradient(
    90deg,
    oklch(1 0 0 / 0.05) 0%,
    oklch(1 0 0 / 0.11) 50%,
    oklch(1 0 0 / 0.05) 100%
  );
  background-size: 200% 100%;
  animation: ${shimmer} 1.4s ease-in-out infinite;
`
