
import { TeachingMaterial, DevelopmentField } from '../types';

export const MOCK_MATERIALS: TeachingMaterial[] = [
  {
    id: '1',
    name: 'Bài thơ: Đàn gà con',
    ageGroup: '3-4T',
    field: DevelopmentField.NGON_NGU,
    description: 'Video dạy trẻ đọc thơ diễn cảm, có minh họa bằng tranh vẽ màu sắc sinh động giúp trẻ phát triển ngôn ngữ.',
    link: 'https://www.youtube.com/watch?v=sample1',
    qrCode: 'MD-34-NN-001',
    type: 'video'
  },
  {
    id: '2',
    name: 'Trò chơi: Nhảy qua suối nhỏ',
    ageGroup: '4-5T',
    field: DevelopmentField.THE_CHAT,
    description: 'Hướng dẫn tổ chức trò chơi vận động giúp trẻ rèn luyện sự khéo léo, sức bền và phát triển thể chất.',
    link: 'https://picsum.photos/id/10/800/600',
    qrCode: 'MD-45-TC-002',
    type: 'video'
  },
  {
    id: '3',
    name: 'Kể chuyện: Chú thỏ thông minh',
    ageGroup: '24-36T',
    field: DevelopmentField.NGON_NGU,
    description: 'Bộ tranh kể chuyện giúp trẻ nhà trẻ phát triển khả năng lắng nghe và làm quen với các con vật.',
    link: 'https://picsum.photos/id/11/800/600',
    qrCode: 'MD-24-NN-003',
    type: 'image'
  },
  {
    id: '4',
    name: 'Bé tập phân biệt màu sắc',
    ageGroup: '3-4T',
    field: DevelopmentField.NHAN_THUC,
    description: 'Tài liệu hướng dẫn trẻ nhận biết các màu cơ bản: Đỏ, Vàng, Xanh qua các đồ vật quen thuộc.',
    link: 'https://picsum.photos/id/12/800/600',
    qrCode: 'MD-34-NT-004',
    type: 'file'
  },
  {
    id: '5',
    name: 'Dạy hát: Cháu đi mẫu giáo',
    ageGroup: '5-6T',
    field: DevelopmentField.THAM_MY,
    description: 'File âm thanh và giáo án dạy hát kết hợp vận động minh họa cho trẻ chuẩn bị vào lớp 1.',
    link: 'https://picsum.photos/id/13/800/600',
    qrCode: 'MD-56-TM-005',
    type: 'video'
  },
  {
    id: '6',
    name: 'Làm quen chữ cái O, Ô, Ơ',
    ageGroup: '5-6T',
    field: DevelopmentField.NGON_NGU,
    description: 'Trò chơi chữ cái sinh động giúp trẻ ghi nhớ mặt chữ một cách tự nhiên và hứng thú.',
    link: 'https://picsum.photos/id/14/800/600',
    qrCode: 'MD-56-NN-006',
    type: 'image'
  }
];
