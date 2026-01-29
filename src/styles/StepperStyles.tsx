import { getFontSize } from '../../font';
import { useTheme } from '../theme/ThemeContext';

export const StepperStyles = (currentStep: number) => {
    const { theme } = useTheme();
    return {
      stepIndicatorSize: 25,
      currentStepIndicatorSize: 25,
      separatorStrokeWidth: 2,
      currentStepStrokeWidth: 2,
      stepStrokeCurrentColor: theme.primary,
      stepStrokeWidth: 2,
      stepStrokeFinishedColor: theme.primary,
      stepStrokeUnFinishedColor: theme.border,
      separatorFinishedColor: currentStep > 0 ? theme.primary : theme.border,
      separatorUnFinishedColor: theme.border,
      stepIndicatorFinishedColor: theme.primary,
      stepIndicatorUnFinishedColor: theme.primaryLight,
      stepIndicatorCurrentColor: theme.primary,
      stepIndicatorLabelFontSize: getFontSize(12),
      currentStepIndicatorLabelFontSize:getFontSize(12),
      stepIndicatorLabelCurrentColor: '#ffffff',
      stepIndicatorLabelFinishedColor: theme.border,
      stepIndicatorLabelUnFinishedColor: '#ffffff',
      labelSize: 10,
      currentStepLabelColor: theme.primary,
    };
  };