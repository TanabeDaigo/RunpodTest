import styled from "styled-components";

export const LoginContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f6f8fc 0%, #f1f4f9 100%);
  padding: 2rem;
`;

export const LoginView = styled.div`
  width: 100%;
  max-width: 480px;
  margin: 0 auto;
`;

export const LoginBox = styled.div`
  background: rgba(255, 255, 255, 0.9);
  padding: 2.5rem;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
  }
`;

export const Title = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

export const TitleText = styled.span`
  font-size: 2rem;
  font-weight: 700;
  background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: -0.02em;
`;

export const LoginBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

export const ErrorMessage = styled.div`
  color: #ef4444;
  font-size: 0.875rem;
  text-align: center;
  padding: 0.5rem;
  background: rgba(239, 68, 68, 0.1);
  border-radius: 8px;
  border: 1px solid rgba(239, 68, 68, 0.2);
`;

export const InputWrapper = styled.div`
  position: relative;
`;

export const Input = styled.input`
  width: 100%;
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  background: rgba(255, 255, 255, 0.8);
  font-size: 1rem;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

export const Button = styled.button`
  width: 100%;
  padding: 1rem;
  border-radius: 8px;
  border: none;
  background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
  color: white;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(99, 102, 241, 0.2);

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(99, 102, 241, 0.3);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;
