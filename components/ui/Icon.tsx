import React from 'react';

import Logo from '../../public/static/images/logo.svg';

const icons = {
    "logo" : Logo
}

export enum IconTypes {
    Logo = "logo"
}

interface IconProps {
    icon: IconTypes;
}

const Icon: React.FC<IconProps> = ({icon = IconTypes.Logo}) => {
    const IconElement = icons[icon];
    return <IconElement />;
}

export default Icon