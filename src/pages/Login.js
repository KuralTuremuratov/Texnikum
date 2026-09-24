"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "../lib/supabase"
import styled from "styled-components"

const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    // Foydalanuvchi allaqachon autentifikatsiya qilinganligini tekshirish
    const checkExistingSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (session) {
        navigate("/admin", { replace: true })
      }
    }

    checkExistingSession()
  }, [navigate])

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      navigate("/admin")
    } catch (error) {
      setError("Kirish xatoligi: " + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <LoginWrapper>
      <LoginCard>
        <LogoContainer>
          <img src="/logo.png" alt="Texnikum logotipi" />
        </LogoContainer>
        
        <LoginTitle>Login to your Account</LoginTitle>
        <LoginSubtitle>Get started with our app, just start section and enjoy experience.</LoginSubtitle>
        
        <LoginForm onSubmit={handleLogin}>
          <FormGroup>
            <Label>Username</Label>
            <Input
              type="email"
              placeholder="Username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </FormGroup>
          
          <FormGroup>
            <Label>Password</Label>
            <Input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </FormGroup>
          
          <LoginButton type="submit" disabled={loading}>
            {loading ? "Kirish..." : "Login"}
          </LoginButton>
          
          {error && <ErrorMessage>{error}</ErrorMessage>}
        </LoginForm>
      </LoginCard>
    </LoginWrapper>
  )
}

const LoginWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #e3e8ef 0%, #f5f7fa 100%);
  padding: 20px;
`

const LoginCard = styled.div`
  background: white;
  border-radius: 24px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
  padding: 48px 40px;
  width: 100%;
  max-width: 480px;
  
  @media (max-width: 640px) {
    padding: 36px 24px;
    border-radius: 16px;
  }
`

const LogoContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 32px;
  
  img {
    width: 80px;
    height: 80px;
    object-fit: contain;
    
    @media (max-width: 640px) {
      width: 64px;
      height: 64px;
    }
  }
`

const LoginTitle = styled.h1`
  font-size: 28px;
  font-weight: 600;
  color: #1e293b;
  text-align: center;
  margin: 0 0 12px 0;
  
  @media (max-width: 640px) {
    font-size: 24px;
  }
`

const LoginSubtitle = styled.p`
  font-size: 15px;
  color: #64748b;
  text-align: center;
  margin: 0 0 32px 0;
  line-height: 1.6;
  
  @media (max-width: 640px) {
    font-size: 14px;
    margin-bottom: 28px;
  }
`

const LoginForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

const Label = styled.label`
  font-size: 14px;
  font-weight: 500;
  color: #475569;
`

const Input = styled.input`
  width: 100%;
  padding: 14px 16px;
  font-size: 15px;
  color: #1e293b;
  background: #f8fafc;
  border: 1.5px solid #e2e8f0;
  border-radius: 12px;
  outline: none;
  transition: all 0.2s ease;
  font-family: inherit;
  
  &::placeholder {
    color: #94a3b8;
  }
  
  &:focus {
    background: white;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  @media (max-width: 640px) {
    padding: 12px 14px;
    font-size: 16px; /* Prevent zoom on mobile */
  }
`

const LoginButton = styled.button`
  width: 100%;
  padding: 14px 24px;
  font-size: 16px;
  font-weight: 600;
  color: white;
  background: #3b82f6;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 8px;
  font-family: inherit;
  
  &:hover:not(:disabled) {
    background: #2563eb;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
  }
  
  &:active:not(:disabled) {
    transform: translateY(0);
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
  
  @media (max-width: 640px) {
    padding: 12px 20px;
  }
`

const ErrorMessage = styled.p`
  color: #ef4444;
  font-size: 14px;
  text-align: center;
  margin: 8px 0 0 0;
  padding: 12px;
  background: #fee2e2;
  border-radius: 8px;
  border: 1px solid #fecaca;
`

export default Login
