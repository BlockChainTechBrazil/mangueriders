import React from 'react';
import { useImage } from '../hooks/useImages';

interface SmartImageProps {
  src: string;
  alt: string;
  fallback?: string;
  className?: string;
  style?: React.CSSProperties;
  onLoad?: () => void;
  onError?: () => void;
  showLoading?: boolean;
  loadingComponent?: React.ReactNode;
}

const SmartImage: React.FC<SmartImageProps> = ({
  src,
  alt,
  fallback,
  className = '',
  style,
  onLoad,
  onError,
  showLoading = true,
  loadingComponent,
}) => {
  const { src: imageSrc, loaded, error } = useImage(src, fallback);

  React.useEffect(() => {
    if (loaded && !error && onLoad) {
      onLoad();
    }
    if (error && onError) {
      onError();
    }
  }, [loaded, error, onLoad, onError]);

  const LoadingSpinner = () => (
    <div className={`flex items-center justify-center bg-gray-200 animate-pulse ${className}`} style={style}>
      <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  if (!loaded && showLoading) {
    return loadingComponent || <LoadingSpinner />;
  }

  return (
    <img
      src={imageSrc}
      alt={alt}
      className={className}
      style={style}
      loading="lazy"
    />
  );
};

export default SmartImage;
