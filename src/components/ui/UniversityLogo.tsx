import React, { useState, useEffect } from 'react';
import { University } from '@/lib/data/universities';

interface UniversityLogoProps {
  university: University;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const UniversityLogo: React.FC<UniversityLogoProps> = ({
  university,
  size = 'md',
  className = ''
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  const containerSizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-14 h-14'
  };

  const getProxyUrl = (url: string) => {
    if (url.includes('upload.wikimedia.org')) {
      // Remover protocolo para images.weserv.nl
      const noProtocol = url.replace(/^https?:\/\//, '');
      return `https://images.weserv.nl/?url=${encodeURIComponent(noProtocol)}`;
    }
    return url;
  };

  // Preload da imagem (com proxy se necessário)
  useEffect(() => {
    const img = new Image();
    img.onload = () => setImageLoaded(true);
    img.onerror = () => setImageError(true);
    img.src = getProxyUrl(university.logo);
  }, [university.logo]);

  const getFallbackIcon = () => {
    if (university.type === 'publica') {
      return '🏛️';
    } else {
      return '🎓';
    }
  };

  return (
    <div className={`${containerSizeClasses[size]} bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg flex items-center justify-center overflow-hidden ${className}`}>
      {!imageError && imageLoaded ? (
        <img
          src={getProxyUrl(university.logo)}
          alt={`Logo ${university.shortName}`}
          className={`${sizeClasses[size]} object-contain`}
          loading="lazy"
          onError={() => setImageError(true)}
        />
      ) : (
        <div className={`${sizeClasses[size]} flex items-center justify-center text-2xl`}>
          {getFallbackIcon()}
        </div>
      )}
    </div>
  );
};

export default UniversityLogo;
