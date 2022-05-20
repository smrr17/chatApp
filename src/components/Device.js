
import { Dimensions, Platform } from 'react-native';

const { width, height } = Dimensions.get('window');

export const isIphoneX =
    Platform.OS === 'ios' &&
    !Platform.isPad &&
    !Platform.isTVOS &&
    (height >= 812 || width >= 812);

export const ToolbarHeight = isIphoneX ? 35 : 0