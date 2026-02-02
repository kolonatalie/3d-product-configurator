import React from 'react';

interface IconProps {
  className?: string;
  size?: number;
  color?: string;
}

interface BaseIconProps extends IconProps {
  viewBox?: string;
  children: React.ReactNode;
}

const BaseIcon: React.FC<BaseIconProps> = ({
  size = 24,
  color = 'currentColor',
  className,
  viewBox = "0 0 24 24",
  children
}) => (
  <svg
    width={size}
    height={size}
    viewBox={viewBox}
    fill={color}
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    {children}
  </svg>
);

export const ScreenshotIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <path 
      d="M17,4.5C18.325,4.5 19.41,5.532 19.495,6.836L19.5,7L19.5,16.5L21,16.5C21.828,16.5 22.5,17.172 22.5,18C22.5,18.78 21.905,19.42 21.144,19.493L21,19.5L19.5,19.5L19.5,21C19.5,21.828 18.828,22.5 18,22.5C17.22,22.5 16.58,21.905 16.507,21.144L16.5,21L16.5,7.5L9.5,7.5L9.5,4.5L17,4.5ZM6,1.5C6.828,1.5 7.5,2.172 7.5,3L7.5,16.5L14.5,16.5L14.5,19.5L7,19.5C5.619,19.5 4.5,18.381 4.5,17L4.5,7.5L3,7.5C2.172,7.5 1.5,6.828 1.5,6C1.5,5.172 2.172,4.5 3,4.5L4.5,4.5L4.5,3C4.5,2.172 5.172,1.5 6,1.5Z"
      fill={'currentColor'}
      fillRule="nonzero" 
    />
  </BaseIcon>
);

export const LogoIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props} viewBox="-1 -1 18 18">
    <path 
      d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"
      fill={'currentColor'}
      fillRule="nonzero" 
    />
  </BaseIcon>
);