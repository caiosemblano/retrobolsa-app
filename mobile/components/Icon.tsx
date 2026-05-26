import React from 'react';
import * as Lucide from 'lucide-react-native';

export type IconName =
  | 'Percent'
  | 'TrendingUp'
  | 'BarChart3'
  | 'DollarSign'
  | 'GraduationCap'
  | 'Trophy'
  | 'Award'
  | 'Medal'
  | 'Crown'
  | 'Calculator'
  | 'Globe'
  | 'Home'
  | 'User'
  | 'Clock'
  | 'Eye'
  | 'Wallet'
  | 'AlertCircle'
  | 'ChevronLeft'
  | 'ArrowRight'
  | 'Target'
  | 'Heart'
  | 'Building2'
  | 'ChevronRight'
  | 'CheckCircle';

interface IconProps {
  name: string;
  size?: number;
  color?: string;
  style?: any;
}

export function Icon({ name, size = 24, color = '#64748b', style }: IconProps) {
  // Resolve icon component dynamically
  const IconComponent = (Lucide as any)[name];

  if (!IconComponent) {
    // Fallback icon
    return <Lucide.HelpCircle size={size} color={color} style={style} />;
  }

  return <IconComponent size={size} color={color} style={style} />;
}
