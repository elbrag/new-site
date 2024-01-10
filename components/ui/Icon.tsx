import React from 'react';

import Logo from '../../public/static/images/logo.svg';

const icons = {
    "logo" : Logo
}

export enum IconTypes {
    Logo = "logo"
}

export enum IconColors {
    Black = "black"
}

interface IconProps {
    icon: IconTypes;
    color?: IconColors;
    width?: number;
    height?: number;
    smallScaleFactor?: number;
    mediumScaleFactor?: number;
}

const Icon: React.FC<IconProps> = ({icon = IconTypes.Logo, color = IconColors.Black, width = 24, height = 24, smallScaleFactor, mediumScaleFactor}) => {
    const IconElement = icons[icon];
    return <div className='icon flex items-center justify-center' style={{width: `${width}px`, height: `${height}px`}}><IconElement className={`text-${color} scale-${smallScaleFactor} md:scale-${mediumScaleFactor} lg:scale-100`} /></div>;
}

export default Icon