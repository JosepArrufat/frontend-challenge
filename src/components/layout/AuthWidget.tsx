import { useState } from 'react'
import { LogIn, LogOut } from 'lucide-react'
import styled from 'styled-components'
import { useUser } from '../../hooks/useUser'
import { DEFAULT_USERNAME } from '../../context/userContext'

export function AuthWidget() {
  const { username, setUsername, logOut } = useUser()
  const [name, setName] = useState('')
  const isGuest = username === DEFAULT_USERNAME

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (name.trim()) {
      setUsername(name)
      setName('')
    }
  }

  if (!isGuest) {
    return (
      <LoggedIn>
        <Greeting>Hi, {username}</Greeting>
        <LogoutBtn type="button" onClick={logOut} aria-label="Log out">
          <LogOut size={15} />
        </LogoutBtn>
      </LoggedIn>
    )
  }

  return (
    <Form onSubmit={handleSubmit}>
      <NameField
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Your name"
        aria-label="Your name"
        maxLength={24}
      />
      <SubmitBtn type="submit" disabled={!name.trim()}>
        <LogIn size={15} />
        Log in
      </SubmitBtn>
    </Form>
  )
}

const LoggedIn = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${({ theme }) => theme.color.foreground};
`

const Greeting = styled.span`
  font-size: 0.875rem;
  font-weight: 600;
  white-space: nowrap;
`

const LogoutBtn = styled.button`
  display: grid;
  place-items: center;
  width: 2rem;
  height: 2rem;
  border-radius: ${({ theme }) => theme.radius.md};
  color: ${({ theme }) => theme.color.foreground};
  transition:
    color 0.15s ease,
    background 0.15s ease;

  &:hover {
    color: ${({ theme }) => theme.color.destructive};
    background: color-mix(in oklab, ${({ theme }) => theme.color.destructive} 12%, transparent);
  }
`

const Form = styled.form`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`

const NameField = styled.input`
  width: 6rem;
  padding: 0.4375rem 0.75rem;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.color.foreground};
  background: ${({ theme }) => theme.color.input};
  border: 1px solid ${({ theme }) => theme.color.border};
  border-radius: ${({ theme }) => theme.radius.md};

  @media (min-width: 1024px) {
    width: 8rem;
  }

  &::placeholder {
    color: ${({ theme }) => theme.color.foreground};
  }

  &:focus-visible {
    outline: none;
    border-color: ${({ theme }) => theme.color.primary};
    box-shadow: 0 0 0 3px
      color-mix(in oklab, ${({ theme }) => theme.color.primary} 35%, transparent);
  }
`

const SubmitBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.4375rem 0.75rem;
  border-radius: ${({ theme }) => theme.radius.md};
  font-size: 0.8125rem;
  font-weight: 600;
  color: ${({ theme }) => theme.color.foreground};
  background: ${({ theme }) => theme.color.primary};
  transition: opacity 0.15s ease;

  &:disabled {
    cursor: not-allowed;
  }
`
