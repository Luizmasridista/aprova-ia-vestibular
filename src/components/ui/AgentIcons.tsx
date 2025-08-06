import React from 'react';

interface IconProps {
  className?: string;
}

export const Apru1bIcon: React.FC<IconProps> = ({ className = "w-16 h-16" }) => (
  <svg
    viewBox="0 0 100 100"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="apru1b-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#3B82F6" />
        <stop offset="100%" stopColor="#8B5CF6" />
      </linearGradient>
    </defs>
    
    {/* Círculo de fundo */}
    <circle cx="50" cy="50" r="45" fill="url(#apru1b-gradient)" />
    
    {/* Relógio */}
    <circle cx="50" cy="40" r="18" fill="white" stroke="#1E293B" strokeWidth="2" />
    
    {/* Ponteiros do relógio */}
    <line x1="50" y1="40" x2="50" y2="28" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" />
    <line x1="50" y1="40" x2="58" y2="40" stroke="#1E293B" strokeWidth="1.5" strokeLinecap="round" />
    
    {/* Centro do relógio */}
    <circle cx="50" cy="40" r="2" fill="#1E293B" />
    
    {/* Texto "1b" */}
    <text x="50" y="75" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold" fontFamily="Arial, sans-serif">
      1b
    </text>
  </svg>
);

export const ApruReasoningIcon: React.FC<IconProps> = ({ className = "w-16 h-16" }) => (
  <svg
    viewBox="0 0 100 100"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="reasoning-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#8B5CF6" />
        <stop offset="100%" stopColor="#EC4899" />
      </linearGradient>
    </defs>
    
    {/* Círculo de fundo */}
    <circle cx="50" cy="50" r="45" fill="url(#reasoning-gradient)" />
    
    {/* Cérebro */}
    <path
      d="M35 35 Q30 30 35 25 Q40 20 50 25 Q60 20 65 25 Q70 30 65 35 Q70 40 65 45 Q60 50 50 45 Q40 50 35 45 Q30 40 35 35 Z"
      fill="white"
      stroke="#1E293B"
      strokeWidth="1.5"
    />
    
    {/* Conexões neurais */}
    <circle cx="40" cy="32" r="2" fill="#3B82F6" />
    <circle cx="50" cy="35" r="2" fill="#10B981" />
    <circle cx="60" cy="32" r="2" fill="#F59E0B" />
    <circle cx="45" cy="42" r="2" fill="#EF4444" />
    <circle cx="55" cy="42" r="2" fill="#8B5CF6" />
    
    {/* Linhas de conexão */}
    <line x1="40" y1="32" x2="50" y2="35" stroke="#64748B" strokeWidth="1" opacity="0.6" />
    <line x1="50" y1="35" x2="60" y2="32" stroke="#64748B" strokeWidth="1" opacity="0.6" />
    <line x1="45" y1="42" x2="55" y2="42" stroke="#64748B" strokeWidth="1" opacity="0.6" />
    
    {/* Texto "AI" */}
    <text x="50" y="75" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold" fontFamily="Arial, sans-serif">
      AI
    </text>
  </svg>
);

export const ApruExerciseIcon: React.FC<IconProps> = ({ className = "w-16 h-16" }) => (
  <svg
    viewBox="0 0 100 100"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="exercise-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#F97316" />
        <stop offset="100%" stopColor="#EF4444" />
      </linearGradient>
    </defs>
    
    {/* Círculo de fundo */}
    <circle cx="50" cy="50" r="45" fill="url(#exercise-gradient)" />
    
    {/* Caderno */}
    <rect x="35" y="25" width="25" height="30" fill="white" stroke="#1E293B" strokeWidth="2" rx="2" />
    
    {/* Linhas do caderno */}
    <line x1="38" y1="32" x2="57" y2="32" stroke="#64748B" strokeWidth="1" />
    <line x1="38" y1="37" x2="57" y2="37" stroke="#64748B" strokeWidth="1" />
    <line x1="38" y1="42" x2="57" y2="42" stroke="#64748B" strokeWidth="1" />
    <line x1="38" y1="47" x2="57" y2="47" stroke="#64748B" strokeWidth="1" />
    
    {/* Checkmark */}
    <path d="M40 40 L44 44 L52 36" stroke="#10B981" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    
    {/* Lápis */}
    <rect x="62" y="30" width="3" height="15" fill="#FCD34D" transform="rotate(45 63.5 37.5)" />
    <polygon points="65,28 67,30 65,32" fill="#F59E0B" transform="rotate(45 66 30)" />
    
    {/* Estrela de conquista */}
    <path d="M70 45 L72 50 L77 50 L73 53 L75 58 L70 55 L65 58 L67 53 L63 50 L68 50 Z" fill="#FCD34D" stroke="#F59E0B" strokeWidth="1" />
    
    {/* Texto "EX" */}
    <text x="50" y="75" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold" fontFamily="Arial, sans-serif">
      EX
    </text>
  </svg>
);