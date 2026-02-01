import React from 'react';

interface IconProps {
  className?: string;
  size?: number;
  color?: string;
}

export const ScreenshotIcon: React.FC<IconProps> = ({
  size = 24,
  color = 'currentColor',
  className
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M17,4.5C18.325,4.5 19.41,5.532 19.495,6.836L19.5,7L19.5,16.5L21,16.5C21.828,16.5 22.5,17.172 22.5,18C22.5,18.78 21.905,19.42 21.144,19.493L21,19.5L19.5,19.5L19.5,21C19.5,21.828 18.828,22.5 18,22.5C17.22,22.5 16.58,21.905 16.507,21.144L16.5,21L16.5,7.5L9.5,7.5L9.5,4.5L17,4.5ZM6,1.5C6.828,1.5 7.5,2.172 7.5,3L7.5,16.5L14.5,16.5L14.5,19.5L7,19.5C5.619,19.5 4.5,18.381 4.5,17L4.5,7.5L3,7.5C2.172,7.5 1.5,6.828 1.5,6C1.5,5.172 2.172,4.5 3,4.5L4.5,4.5L4.5,3C4.5,2.172 5.172,1.5 6,1.5Z"
      fill={color}
      fillRule="nonzero" />
  </svg>
);