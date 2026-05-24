export interface TourReview {
  id: string;
  userName: string;
  userAvatar: string;
  rating: number;
  comment: string;
  date: string;
}

export interface ItineraryDay {
  day: number;
  title: string;
  description: string;
  activity: string;
}

export interface TourGuide {
  name: string;
  role: string;
  avatar: string;
  bio: string;
}

export interface Tour {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  location: string;
  country: string;
  duration: number;
  price: number;
  rating: number;
  category: 'Wellness' | 'Eco-Tourism' | 'Tea Ceremony' | 'Adventure';
  images: string[];
  difficulty: 'Easy' | 'Moderate' | 'Challenging';
  groupSize: number;
  nextDates: string[];
  highlights: string[];
  itinerary: ItineraryDay[];
  guide: TourGuide;
  reviews: TourReview[];
  featured: boolean;
}

export interface TeaJourneyStep {
  id: string;
  step: string;
  title: string;
  tagline: string;
  description: string;
  icon: string;
  image: string;
}

export const teaJourneySteps: TeaJourneyStep[] = [
  {
    id: 'step-1',
    step: '01',
    title: 'Thu Hoạch Sương Mai',
    tagline: 'Hái tay thủ công trong sương sớm',
    description: 'Dạo bước qua những đồi chè cổ thụ phủ sương lúc 5:00 sáng. Học nghệ thuật hái chè tinh tế đạt chuẩn "một búp hai lá" cùng các nghệ nhân bản địa, những người đã truyền lại kỹ năng này qua nhiều thế hệ.',
    icon: 'Leaf',
    image: 'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'step-2',
    step: '02',
    title: 'Làm Héo & Lên Men',
    tagline: 'Giải phóng hương thơm tự nhiên',
    description: 'Tìm hiểu cách nhiệt độ, độ ẩm và lưu thông không khí đánh thức các hợp chất hương vị trong lá chè. Cảm nhận mùi hương trái cây chín ngọt lan tỏa trong phòng sấy gỗ tuyết tùng truyền thống.',
    icon: 'Wind',
    image: 'https://images.unsplash.com/photo-1563822249548-9a72b6353cd1?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'step-3',
    step: '03',
    title: 'Thiền Trà Tĩnh Lặng',
    tagline: 'Sự giao thoa của nước và lửa',
    description: 'Trải nghiệm trà đạo truyền thống đầy tôn kính. Làm chủ nhiệt độ nước suối tự nhiên chính xác để khai phóng vị ngọt thanh, umami và hương hoa tao nhã của những búp chè thượng hạng.',
    icon: 'CupSoda',
    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'step-4',
    step: '04',
    title: 'Dạo Bước Chánh Niệm',
    tagline: 'Giao hòa tâm hồn với đất trời',
    description: 'Một lối mòn thiền chè nơi ta học cách sống chậm lại. Trải nghiệm trị liệu âm thanh chuông xoay trong thung lũng, thưởng thức ẩm thực hữu cơ chế biến từ chè, và nghỉ ngơi tại các khu lưu trú sinh thái mộc mạc.',
    icon: 'Compass',
    image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=80'
  }
];

export const mockTours: Tour[] = [
  {
    id: 'sapa-emerald-terraces',
    title: 'Hành Trình Trà Shan Tuyết & Ruộng Bậc Thang Sapa',
    subtitle: 'Chinh phục trà cổ thụ tuyết shan bản địa & Trị liệu thảo dược Dao đỏ',
    description: 'Đắm mình trong thung lũng sương mờ của Sa Pa, Việt Nam. Nơi những cây trà cổ thụ Shan Tuyết hàng trăm năm tuổi phát triển ở độ cao hơn 1.500m. Tour kết hợp leo núi ngắm cảnh ruộng bậc thang kỳ vĩ cùng văn hóa độc đáo của người Hmong, người Dao đỏ, hái trà cổ thụ hữu cơ và tắm lá thuốc phục hồi sức khỏe.',
    location: 'Sa Pa, Lào Cai',
    country: 'Việt Nam',
    duration: 5,
    price: 1250,
    rating: 4.95,
    category: 'Eco-Tourism',
    images: [
      'https://i.pinimg.com/1200x/17/04/d3/1704d3663c3776f215abc751f3fee1e7.jpg',
      'https://i.pinimg.com/736x/bd/3a/12/bd3a129c1c7675aea3974d6ef8ae2296.jpg',
      'https://i.pinimg.com/736x/80/66/b9/8066b9202e6af3062feea1b498153041.jpg'
    ],
    difficulty: 'Moderate',
    groupSize: 8,
    nextDates: ['2026-06-15', '2026-07-02', '2026-08-10'],
    highlights: [
      'Thu hoạch chè Shan Tuyết hoang dã từ cây cổ thụ hơn 300 năm tuổi tại Tả Van',
      'Thư giãn với bồn ngâm thảo dược truyền thống Dao đỏ nhìn ra thung lũng mây',
      'Trekking ngắm bình minh trên đỉnh núi Hoàng Liên Sơn hùng vĩ',
      'Trải nghiệm ẩm thực hữu cơ cao cấp với món cá hồi hun khói lá chè rừng'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Đến Với Xứ Sở Sương Mù',
        description: 'Đến Sa Pa và nhận phòng eco-lodge vách kính tràn viền. Thưởng thức trà tươi nóng chào mừng và tham gia buổi định hướng tối nhìn ra thung lũng Mường Hoa.',
        activity: 'Thư giãn buổi tối & Tiệc tối kết hợp hương vị trà'
      },
      {
        day: 2,
        title: 'Săn Chè Cổ Thụ & Trekking Tả Van',
        description: 'Đi bộ 10km qua rừng trúc nguyên sinh đến bản Tả Van. Gặp gỡ các bô lão người Dao và học cách leo lên các cành cây chè hoang dã khổng lồ để hái búp.',
        activity: 'Thu hoạch chè Shan Tuyết hoang dã'
      },
      {
        day: 3,
        title: 'Xưởng Làm Héo Chè & Tắm Thảo Dược Dao Đỏ',
        description: 'Tự tay chế biến lá chè bạn đã hái tại hợp tác xã bản địa. Buổi chiều, ngâm mình phục hồi trong bồn gỗ tuyết tùng nóng với 14 loại lá thuốc rừng.',
        activity: 'Lớp học làm héo chè & Tắm thảo dược thải độc'
      },
      {
        day: 4,
        title: 'Đón Bình Minh Trên Đỉnh Đèo & Thiền Trà',
        description: 'Leo núi sớm lên điểm ngắm cảnh ngắm nhìn toàn cảnh ruộng bậc thang rực rỡ trong nắng mai. Tổ chức buổi thiền trà tĩnh lặng bên dòng thác.',
        activity: 'Ngồi thiền đón bình minh & Pha trà dã ngoại'
      },
      {
        day: 5,
        title: 'Hộp Trà Kỷ Niệm & Trả Phòng',
        description: 'Tự trộn hương vị chè Shan Tuyết của riêng bạn kết hợp với hoa nhài hoặc hoa sen khô. Nhận hộp lưu niệm, trả phòng và xe đưa về Hà Nội.',
        activity: 'Tự phối trộn hương chè & Trả phòng'
      }
    ],
    guide: {
      name: 'Giang Thị Mảy',
      role: 'Chuyên gia Trà Bản Địa',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
      bio: 'Mảy là chuyên gia hái chè Hmong thế hệ thứ ba. Cô đã trekking các đỉnh núi Sapa từ nhỏ và am hiểu sâu sắc về thực vật cũng như văn hóa trà tuyết bản địa.'
    },
    reviews: [
      {
        id: 'rev-1',
        userName: 'Aveline Moreau',
        userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80',
        rating: 5,
        comment: 'Đây không đơn thuần là kỳ nghỉ; đó là trải nghiệm đánh thức mọi giác quan. Cảm giác hái trà trong sương sớm trên những cây cổ thụ 300 tuổi thật kỳ diệu.',
        date: '2026-05-10'
      },
      {
        id: 'rev-2',
        userName: 'Minh Tuấn',
        userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80',
        rating: 4.9,
        comment: 'Tắm thuốc Dao Đỏ sau một ngày trekking dốc đồi thật sự rất sảng khoái. Đồ ăn hữu cơ có hương vị rất tinh tế.',
        date: '2026-04-28'
      }
    ],
    featured: true
  },
  {
    id: 'shizuoka-zen-sanctuary',
    title: 'Thiền Trà Shizuoka & Ngắm Núi Phú Sĩ',
    subtitle: 'Học pha chè Gyokuro thượng hạng, nghỉ dưỡng cabin tối giản & Vườn Zen',
    description: 'Hành trình tìm về tĩnh lặng tại vùng sườn đồi Shizuoka, thủ phủ chè danh tiếng của Nhật Bản. Nghỉ dưỡng trong các cabin kính thiết kế tối giản nhìn ra những luống chè uốn lượn tuyệt đẹp. Tour bao gồm các lớp học pha chè matcha dã ngoại, thiền viện Zen và ngắm cảnh Phú Sĩ mờ sương.',
    location: 'Tỉnh Shizuoka',
    country: 'Nhật Bản',
    duration: 6,
    price: 2450,
    rating: 4.98,
    category: 'Tea Ceremony',
    images: [
      'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1480796927426-f609979314bd?auto=format&fit=crop&w=800&q=80'
    ],
    difficulty: 'Easy',
    groupSize: 6,
    nextDates: ['2026-06-20', '2026-07-15', '2026-09-05'],
    highlights: [
      'Nghỉ dưỡng tại các villa kính phong cách Zen tối giản thượng hạng',
      'Học pha trà Gyokuro và Sencha 1-1 cùng các nghệ nhân trà đạo Nhật Bản',
      'Thiền hành buổi chiều tĩnh lặng trên thềm gỗ hướng núi Phú Sĩ',
      'Thưởng thức đại tiệc ẩm thực Kaiseki 9 món tẩm ướp tinh chất chè xanh'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Bước Vào Không Gian Tĩnh Lặng',
        description: 'Đón tại ga Shinkansen Shizuoka. Di chuyển đến khu bảo tồn hữu cơ. Nhận phòng và tham dự nghi thức thưởng chè Hojicha rang chào mừng.',
        activity: 'Nhận phòng & Thưởng thức chè hojicha dã ngoại'
      },
      {
        day: 2,
        title: 'Vườn Chè Che Bóng & Vị Ngọt Gyokuro',
        description: 'Khám phá khu vườn chè che bóng Gyokuro. Tìm hiểu cách nông dân che rơm rạ trước thu hoạch 20 ngày để giảm chát, tăng lượng axit amin umami ngọt ngào.',
        activity: 'Đi dạo đồi chè & Thử vị lá chè tươi'
      },
      {
        day: 3,
        title: 'Một Ngày Tại Thiền Viện & Nghi Thức Matcha',
        description: 'Dành cả buổi sáng tại ngôi chùa cổ bản địa. Đi bộ trên lối đi lát đá vườn thiền và thực hành cách đánh bông chè matcha bằng chổi tre chasen.',
        activity: 'Thực hành matcha & Đi bộ chánh niệm'
      },
      {
        day: 4,
        title: 'Bình Minh Phú Sĩ & Yoga Khí Công',
        description: 'Dậy sớm di chuyển lên sàn gỗ cao nhất. Thực hành thở khí công điều hòa năng lượng cơ thể trước khung cảnh Phú Sĩ, nhấp từng ngụm trà ấm.',
        activity: 'Thiền khí công đón bình minh & Uống trà ấm'
      },
      {
        day: 5,
        title: 'Ẩm Thực Kaiseki Kết Hợp Chè Thượng Hạng',
        description: 'Trải nghiệm ẩm thực Kaiseki nghệ thuật đỉnh cao. Mỗi món ăn đều kết hợp chè: lá chè chiên tempura, bò wagyu tẩm matcha, và kem chè sencha lạnh.',
        activity: 'Tiệc tối ẩm thực chè kết hợp rượu sake nhẹ'
      },
      {
        day: 6,
        title: 'Trở Về Trong Chánh Niệm',
        description: 'Thiền hành ngắn buổi sáng quanh đồi chè, thu hoạch hộp quà chè hữu cơ kỷ niệm và di chuyển trở lại Tokyo.',
        activity: 'Thiền hành chia tay & Trả phòng'
      }
    ],
    guide: {
      name: 'Kenji Sato',
      role: 'Nghệ Nhân Trà Đạo Cấp Cao',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
      bio: 'Thầy Sato đã nghiên cứu trà đạo Nhật Bản hơn 30 năm. Ông hiện điều hành hợp tác xã nông nghiệp hữu cơ tại Shizuoka và cống hiến để bảo tồn nghi thức trà đạo cổ.'
    },
    reviews: [
      {
        id: 'rev-3',
        userName: 'Yuki Tanaka',
        userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80',
        rating: 5,
        comment: 'Được thức dậy ngắm đồi chè xanh mướt mờ sương với núi Phú Sĩ phía sau giống như bước vào bức tranh vẽ. Lớp học Gyokuro thật đáng giá!',
        date: '2026-05-18'
      },
      {
        id: 'rev-4',
        userName: 'Christopher Bell',
        userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80',
        rating: 4.95,
        comment: 'Thiết kế tinh tế, tĩnh lặng và đồ ăn ngon tuyệt vời. Một trải nghiệm chữa lành sâu sắc cho tâm hồn.',
        date: '2026-05-02'
      }
    ],
    featured: true
  },
  {
    id: 'munnar-misty-valleys',
    title: 'Thung Lũng Sương Mờ Munnar & Trị Liệu Ayurveda',
    subtitle: 'Đồi gia vị Cardamom, Vườn chè organic Nam Ấn & Spa thải độc cơ thể',
    description: 'Khám phá vùng đồi núi Munnar xanh mát tại Kerala, Ấn Độ. Nằm ở ngã ba của ba dòng suối núi cao, Munnar sở hữu những đồi chè uốn lượn đan xen đồi thảo mộc hoang dã. Chuyến đi kết hợp thưởng trà hữu cơ cùng chẩn trị sức khỏe Ayurvedic, massage dầu thảo dược truyền thống và khám phá động vật hoang dã.',
    location: 'Munnar, Kerala',
    country: 'Ấn Độ',
    duration: 5,
    price: 1420,
    rating: 4.88,
    category: 'Wellness',
    images: [
      'https://images.unsplash.com/photo-1550950158-d0d960dff51b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1545244193-221267bb301b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1616036740257-9449ea1f6605?auto=format&fit=crop&w=800&q=80'
    ],
    difficulty: 'Moderate',
    groupSize: 10,
    nextDates: ['2026-07-10', '2026-08-01', '2026-10-12'],
    highlights: [
      'Nghỉ ngơi tại các biệt thự cổ thời thuộc địa nằm giữa đồi chè mờ sương',
      'Chẩn đoán thể trạng cơ thể (dosha) riêng biệt cùng Bác sĩ Ayurveda',
      'Trị liệu thải độc Shirodhara (rót dầu ấm lên trán) và đắp thảo dược mỗi ngày',
      'Safari khám phá vườn quốc gia Eravikulam ngắm loài dê núi Nilgiri Tahr quý hiếm'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Chào Mừng Đến Thung Lũng Gia Vị',
        description: 'Đón tại sân bay Cochin. Lái xe qua các thung lũng bạch đậu khấu mờ sương lên Munnar. Nhận phòng và khám sức khỏe ban đầu với bác sĩ Ayurveda.',
        activity: 'Khám sức khỏe & Pha chế trà thảo mộc thể trạng'
      },
      {
        day: 2,
        title: 'Hành Trình Lockhart & Chè CTC Đen',
        description: 'Thức dậy cùng tiếng chim hót nhiệt đới. Hướng dẫn viên dắt đi bộ đồi Lockhart, học quy trình làm chè CTC (Nghiền, Xé, Cuộn) trong nhà máy 100 tuổi.',
        activity: 'Học làm chè nhà máy cổ & Thử vị chè đen'
      },
      {
        day: 3,
        title: 'Trị Liệu Dầu Ấm & Tự Trộn Trà Spiced Chai',
        description: 'Thực hiện liệu trình massage dầu ấm thảo dược phục hồi hệ cơ xương. Buổi chiều, tham gia xưởng tự pha trộn lá chè đen với đinh hương, gừng, quế.',
        activity: 'Massage Abhyanga toàn thân & Phối trộn Masala Chai'
      },
      {
        day: 4,
        title: 'Trekking Eravikulam & Hoàng Hôn Thung Lũng',
        description: 'Ghé thăm công viên quốc gia ngắm nhìn các đỉnh núi đá cỏ tranh và đàn dê núi Nilgiri Tahr dạo bước dạn dĩ. Picnic chiều nhẹ trên đỉnh đồi lộng gió.',
        activity: 'Trekking ngắm dê núi & Dã ngoại thưởng trà chiều'
      },
      {
        day: 5,
        title: 'Thực Hành Yoga Thở & Trở Về',
        description: 'Tập thở Pranayama điều hòa tâm trí. Đóng gói chè gia vị Kerala tự làm. Trở lại Cochin làm thủ tục chuyến bay về.',
        activity: 'Thực hành Pranayama & Trả phòng'
      }
    ],
    guide: {
      name: 'Dr. Anand Pillai',
      role: 'Giám Đốc Trị Liệu Ayurveda',
      avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=150&q=80',
      bio: 'Bác sĩ Anand có hơn 15 năm thực hành y học Ayurvedic cổ truyền, chuyên sâu về điều hòa dinh dưỡng, yoga và chè thảo dược cân bằng thể chất.'
    },
    reviews: [
      {
        id: 'rev-5',
        userName: 'Isabella Ross',
        userAvatar: 'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?auto=format&fit=crop&w=100&q=80',
        rating: 4.8,
        comment: 'Khu biệt thự cổ kính rất thanh tao, liệu pháp massage dầu ấm làm cơ thể tôi nhẹ bẫng đi. Trải nghiệm trộn chè masala chai cay nồng rất thú vị!',
        date: '2026-05-09'
      }
    ],
    featured: true
  },
  {
    id: 'darjeeling-himalayan-rails',
    title: 'Trà Di Sản Darjeeling & Tàu Hơi Nước Himalaya',
    subtitle: 'Nghỉ dưỡng Glenburn Estate cổ kính, thưởng thức búp xuân và ngắm đỉnh tuyết sơn',
    description: 'Hành trình tới Darjeeling, nơi được mệnh danh là xứ sở tạo ra "Champagne của các loại trà" nép mình dưới chân dãy Himalaya. Trải nghiệm cuộc sống thanh nhã của các chủ đồn điền chè xưa. Nghỉ tại Glenburn Tea Estate nổi tiếng toàn cầu, trekking xuyên rừng thông ôn đới, đi tàu hơi nước cổ và đón bình minh rực hồng trên đỉnh núi tuyết Kanchenjunga khổng lồ.',
    location: 'Darjeeling, Tây Bengal',
    country: 'Ấn Độ',
    duration: 5,
    price: 1850,
    rating: 4.92,
    category: 'Adventure',
    images: [
      'https://i.pinimg.com/1200x/ad/ce/cc/adcecc4d0c5db7330b05c7e8a801a6c0.jpg',
      'https://i.pinimg.com/736x/5e/5f/bf/5e5fbf9ae270c1796b5ca227e61caf7d.jpg',
      'https://i.pinimg.com/1200x/64/d1/50/64d1501091fa5c27ea06a405061e3d80.jpg'
    ],
    difficulty: 'Moderate',
    groupSize: 8,
    nextDates: ['2026-06-05', '2026-08-20', '2026-10-01'],
    highlights: [
      'Nghỉ dưỡng tại các suite bungalow thế kỷ 19 cổ xưa của đồn điền Glenburn',
      'Thưởng chè Darjeeling "First Flush" (đợt hái búp xuân đầu tiên đắt giá nhất năm)',
      'Scenic ride trên tàu hơi nước cổ Darjeeling Himalayan Railway được UNESCO công nhận',
      'Trekking ngắm bình minh nhuộm sắc hồng vàng lên rặng tuyết sơn Kanchenjunga cao thứ 3 thế giới'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Hơi Thở Glenburn Bên Lò Sưởi',
        description: 'Đón tại Bagdogra. Lái xe men theo thung lũng sông Rangneet dốc núi lên Glenburn Estate. Buổi tối thưởng chè ấm và trò chuyện bên lò sưởi phòng khách.',
        activity: 'Thưởng trà đồn điền chào mừng & Giao lưu lò sưởi'
      },
      {
        day: 2,
        title: 'Trekking Lòng Sông & Thử Vị Búp Xuân',
        description: 'Trekking dốc núi xuống các cầu treo Rangneet. Học phương pháp làm phân hữu cơ sinh học của đồn điền và thưởng thức các loại chè trắng, chè xanh búp xuân đầu mùa.',
        activity: 'Trekking thung lũng sông & Nếm chè First Flush'
      },
      {
        day: 3,
        title: 'Tàu Hơi Nước UNESCO & Phố Núi Darjeeling',
        description: 'Trải nghiệm đầu tàu hơi nước cổ xưa kéo toa gỗ chạy qua các sườn cua núi sát mép nhà dân. Ghé thăm thiền viện Tây Tạng và chợ trung tâm.',
        activity: 'Đi tàu hơi nước cổ & Khám phá thị trấn Darjeeling'
      },
      {
        day: 4,
        title: 'Bình Minh Tiger Hill Rực Hồng & Tiệc Tối Chủ Đồn Điền',
        description: 'Xuất phát lúc 4:30 sáng đón bình minh nhuộm hồng rực rỡ lên đỉnh tuyết Kanchenjunga. Thời gian còn lại dạo bước chánh niệm trong rừng thông đồn điền.',
        activity: 'Đón bình minh Tiger Hill & Tiệc tối nến ấm áp'
      },
      {
        day: 5,
        title: 'Bữa Trưa Trên Bãi Sỏi Sông & Chia Tay',
        description: 'Bữa trưa dã ngoại độc đáo được chuẩn bị trực tiếp trên bãi sỏi lòng sông mát lạnh. Nhận hộp quà kỷ niệm và di chuyển ra sân bay.',
        activity: 'Bữa trưa dã ngoại lòng sông & Trả phòng'
      }
    ],
    guide: {
      name: 'Rohan Banerjee',
      role: 'Nhà Sử Học Trà & Hướng Dẫn Viên Leo Núi',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80',
      bio: 'Rohan là nhà leo núi kỳ cựu và sử học bản địa. Anh chuyên sâu về lịch sử chè thuộc địa, thực vật ôn đới và các cung đường trekking an toàn vùng núi Sikkim & Bengal.'
    },
    reviews: [
      {
        id: 'rev-6',
        userName: 'Liam Cooper',
        userAvatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=100&q=80',
        rating: 5,
        comment: 'Glenburn giống như một cỗ máy thời gian. Dịch vụ hoàn hảo, tầm nhìn thung lũng sông tuyệt đẹp và vị chè búp xuân xuân ngọt hậu dịu kỳ.',
        date: '2026-05-15'
      }
    ],
    featured: true
  }
];

export const mockBookings = [
  {
    id: 'B-8472',
    tourId: 'sapa-emerald-terraces',
    tourTitle: 'Hành Trình Trà Shan Tuyết & Ruộng Bậc Thang Sapa',
    date: '2026-06-15',
    guests: 2,
    totalPrice: 2500,
    status: 'Đã xác nhận',
    userEmail: 'traveler@tea.com',
    userName: 'Aveline Moreau',
    bookedAt: '2026-05-20'
  },
  {
    id: 'B-9201',
    tourId: 'shizuoka-zen-sanctuary',
    tourTitle: 'Thiền Trà Shizuoka & Ngắm Núi Phú Sĩ',
    date: '2026-07-15',
    guests: 1,
    totalPrice: 2450,
    status: 'Đã xác nhận',
    userEmail: 'traveler@tea.com',
    userName: 'Aveline Moreau',
    bookedAt: '2026-05-22'
  }
];
