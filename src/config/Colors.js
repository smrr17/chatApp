const Colors = {
    WhiteOpacity: (opacity) => `rgba(255, 255, 255, ${opacity})`,
    BlackOpacity: (opacity) => `rgba(0, 0, 0, ${opacity})`,
    Transparent: 'transparent',
    Black: '#000',
    White: '#fff',
    Green: 'green',
    Red: 'red',
    Grey: 'grey',
    Facebook:"#0174e6",
    Google:"#e43c3b",
    lightGrey: 'rgb(221,221,221)',
    primaryOpacity: (o = '') => `#FF5757${o}`,
    primary: '#D63D6C',
    color1: '#65B2C6',
    color2: '#D57275',
    color3: '#FFFFFF',
    color4: '#CFCFCF',
    color5: '#535353',
    color6: '#ACACAC',
    color7: '#CF268B',
};

export default Colors;
