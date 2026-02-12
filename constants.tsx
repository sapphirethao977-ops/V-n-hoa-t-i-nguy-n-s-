
import React from 'react';
import { Heart, Brain, MessageCircle, Users, Palette, Baby, GraduationCap, School, BookOpen } from 'lucide-react';
import { DevelopmentField, AgeGroup } from './types';

export const FIELD_ICONS: Record<DevelopmentField, React.ReactNode> = {
  [DevelopmentField.THE_CHAT]: <Heart className="w-8 h-8 text-rose-400" />,
  [DevelopmentField.NHAN_THUC]: <Brain className="w-8 h-8 text-blue-400" />,
  [DevelopmentField.NGON_NGU]: <MessageCircle className="w-8 h-8 text-amber-400" />,
  [DevelopmentField.TC_XH]: <Users className="w-8 h-8 text-emerald-400" />,
  [DevelopmentField.THAM_MY]: <Palette className="w-8 h-8 text-purple-400" />
};

export const AGE_LABELS: Record<AgeGroup, string> = {
  '24-36T': 'Nhà trẻ (24-36 tháng)',
  '3-4T': 'Mầm (3-4 tuổi)',
  '4-5T': 'Chồi (4-5 tuổi)',
  '5-6T': 'Lá (5-6 tuổi)'
};

export const AGE_ICONS: Record<AgeGroup, React.ReactNode> = {
  '24-36T': <Baby className="w-12 h-12 text-pink-500" />,
  '3-4T': <School className="w-12 h-12 text-blue-500" />,
  '4-5T': <GraduationCap className="w-12 h-12 text-green-500" />,
  '5-6T': <BookOpen className="w-12 h-12 text-purple-500" />
};

export const FIELD_COLORS: Record<DevelopmentField, string> = {
  [DevelopmentField.THE_CHAT]: 'bg-rose-50 border-rose-100',
  [DevelopmentField.NHAN_THUC]: 'bg-blue-50 border-blue-100',
  [DevelopmentField.NGON_NGU]: 'bg-amber-50 border-amber-100',
  [DevelopmentField.TC_XH]: 'bg-emerald-50 border-emerald-100',
  [DevelopmentField.THAM_MY]: 'bg-purple-50 border-purple-100'
};
