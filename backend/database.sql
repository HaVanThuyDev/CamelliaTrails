-- =========================================================================
-- SQL SETUP SCRIPT FOR CAMELLIA TOURS DASHBOARD & VINOICE INTEGRATION
-- Run this script inside your MySQL Client (phpMyAdmin, Workbench, Navicat, etc.)
-- =========================================================================

-- 1. Create and Use the Database
CREATE DATABASE IF NOT EXISTS `camellia_tours`
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE `camellia_tours`;

-- =========================================================================
-- 2. CREATE TABLES
-- =========================================================================

-- A. Invoices Table (vInvoice Viettel Integration)
CREATE TABLE IF NOT EXISTS `invoices` (
  `id` VARCHAR(50) NOT NULL COMMENT 'Mã định danh hóa đơn nháp (transactionUuid)',
  `template_code` VARCHAR(20) NOT NULL COMMENT 'Mẫu số hóa đơn (ví dụ: 2/LKD3)',
  `invoice_series` VARCHAR(20) NOT NULL COMMENT 'Ký hiệu hóa đơn (ví dụ: C26MTM)',
  `created_date` DATE NOT NULL COMMENT 'Ngày tạo hóa đơn',
  `buyer_name` VARCHAR(250) NOT NULL COMMENT 'Tên khách hàng / người mua',
  `buyer_legal_name` VARCHAR(250) NULL COMMENT 'Tên công ty / đơn vị pháp lý',
  `buyer_tax_code` VARCHAR(50) NULL COMMENT 'Mã số thuế người mua',
  `total_pre_tax` DECIMAL(15,2) NOT NULL COMMENT 'Tổng số tiền trước thuế',
  `total_tax` DECIMAL(15,2) NOT NULL COMMENT 'Tổng số tiền thuế GTGT',
  `total_amount` DECIMAL(15,2) NOT NULL COMMENT 'Tổng số tiền thanh toán sau thuế',
  `currency_code` VARCHAR(10) NOT NULL COMMENT 'Loại tiền tệ (VND, USD...)',
  `status` VARCHAR(50) NOT NULL COMMENT 'Trạng thái phát hành (Chưa phát hành, Đã phát hành, Lỗi)',
  `payload_json` LONGTEXT NOT NULL COMMENT 'Chuỗi JSON chứa toàn bộ schema payload gửi Viettel',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- B. Tours Table (Tour management)
CREATE TABLE IF NOT EXISTS `tours` (
  `id` VARCHAR(100) NOT NULL PRIMARY KEY,
  `title` VARCHAR(250) NOT NULL,
  `location` VARCHAR(250) NOT NULL,
  `duration` VARCHAR(50) NOT NULL,
  `price` INT NOT NULL,
  `max_guests` INT NOT NULL,
  `description` TEXT NOT NULL,
  `image` VARCHAR(500) NOT NULL,
  `rating` DECIMAL(3,2) DEFAULT 5.00,
  `featured` TINYINT(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- C. Bookings Table (Bookings / Orders)
CREATE TABLE IF NOT EXISTS `bookings` (
  `id` VARCHAR(50) NOT NULL PRIMARY KEY,
  `tour_id` VARCHAR(100) NOT NULL,
  `tour_title` VARCHAR(250) NOT NULL,
  `date` DATE NOT NULL,
  `guests` INT NOT NULL,
  `total_price` INT NOT NULL,
  `status` VARCHAR(50) NOT NULL,
  `user_email` VARCHAR(150) NOT NULL,
  `user_name` VARCHAR(250) NOT NULL,
  `booked_at` DATE NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- D. Rooms Table (Hotel Rooms & Accommodations)
CREATE TABLE IF NOT EXISTS `rooms` (
  `id` VARCHAR(50) NOT NULL PRIMARY KEY,
  `name` VARCHAR(150) NOT NULL,
  `type` VARCHAR(100) NOT NULL,
  `price` INT NOT NULL,
  `status` VARCHAR(50) NOT NULL,
  `amenities` TEXT NOT NULL COMMENT 'JSON array of room amenities',
  `image` VARCHAR(500) NOT NULL,
  `current_booking` TEXT NULL COMMENT 'JSON details of room booking info'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- E. Staff Table (Staff members)
CREATE TABLE IF NOT EXISTS `staff` (
  `id` VARCHAR(50) NOT NULL PRIMARY KEY,
  `name` VARCHAR(250) NOT NULL,
  `email` VARCHAR(150) NOT NULL,
  `role` VARCHAR(100) NOT NULL,
  `avatar` VARCHAR(500) NOT NULL,
  `status` VARCHAR(50) NOT NULL,
  `checked_in_at` VARCHAR(100) NULL,
  `checked_out_at` VARCHAR(100) NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- F. Customers Table (Customer ledger)
CREATE TABLE IF NOT EXISTS `customers` (
  `id` VARCHAR(50) NOT NULL PRIMARY KEY,
  `name` VARCHAR(250) NOT NULL,
  `email` VARCHAR(150) NOT NULL,
  `phone` VARCHAR(50) NOT NULL,
  `bookings_count` INT DEFAULT 0,
  `status` VARCHAR(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- G. Reviews Table (Reviews and ratings)
CREATE TABLE IF NOT EXISTS `reviews` (
  `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `tour_id` VARCHAR(100) NOT NULL,
  `user_name` VARCHAR(250) NOT NULL,
  `rating` INT NOT NULL,
  `comment` TEXT NOT NULL,
  `date` DATE NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- H. Transactions Table (Cash / Payment logs)
CREATE TABLE IF NOT EXISTS `transactions` (
  `id` VARCHAR(50) NOT NULL PRIMARY KEY,
  `date` DATE NOT NULL,
  `amount` INT NOT NULL,
  `method` VARCHAR(50) NOT NULL,
  `status` VARCHAR(50) NOT NULL,
  `customer` VARCHAR(250) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- I. Audit Logs Table (Security and action logs)
CREATE TABLE IF NOT EXISTS `audit_logs` (
  `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `timestamp` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `user` VARCHAR(150) NOT NULL,
  `action` VARCHAR(250) NOT NULL,
  `details` TEXT NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- J. Users Table (System profiles & credentials)
CREATE TABLE IF NOT EXISTS `users` (
  `id` VARCHAR(50) NOT NULL PRIMARY KEY,
  `name` VARCHAR(250) NOT NULL,
  `email` VARCHAR(150) NOT NULL UNIQUE,
  `password_hash` VARCHAR(250) NOT NULL,
  `role` VARCHAR(50) NOT NULL DEFAULT 'user',
  `avatar` VARCHAR(500) NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- =========================================================================
-- 3. INSERT MOCK SEED DATA FOR TESTING
-- =========================================================================

-- Invoices Mock
INSERT INTO `invoices` (`id`, `template_code`, `invoice_series`, `created_date`, `buyer_name`, `buyer_legal_name`, `buyer_tax_code`, `total_pre_tax`, `total_tax`, `total_amount`, `currency_code`, `status`, `payload_json`) VALUES 
('DRAFT-001', '2/LKD3', 'C26MTM', '2026-07-14', 'khách hàng a', 'Công ty TNHH Giải Pháp Phần Mềm A', '0109283746', 10000.00, 0.00, 10000.00, 'VND', 'Chưa phát hành', '{}'),
('DRAFT-002', '2/LKD3', 'C26MTM', '2026-07-13', 'Nguyễn Văn B', '', '', 250000.00, 20000.00, 270000.00, 'VND', 'Chưa phát hành', '{}');

-- Tours Mock
INSERT INTO `tours` (`id`, `title`, `location`, `duration`, `price`, `max_guests`, `description`, `image`, `rating`, `featured`) VALUES
('sapa-emerald-terraces', 'Hành Trình Ruộng Bậc Thang Sapa', 'Lào Cai, Việt Nam', '3 Ngày 2 Đêm', 1500000, 12, 'Khám phá ruộng bậc thang kỳ vĩ.', 'https://images.unsplash.com/photo-1528127269322-539801943592', 4.90, 1),
('ha-long-bay-cruising', 'Du Thuyền Di Sản Vịnh Hạ Long', 'Quảng Ninh, Việt Nam', '2 Ngày 1 Đêm', 2500000, 20, 'Trải nghiệm du thuyền 5 sao đẳng cấp.', 'https://images.unsplash.com/photo-1528127269322-539801943592', 4.80, 1);

-- Bookings Mock
INSERT INTO `bookings` (`id`, `tour_id`, `tour_title`, `date`, `guests`, `total_price`, `status`, `user_email`, `user_name`, `booked_at`) VALUES
('B-9021', 'sapa-emerald-terraces', 'Hành Trình Ruộng Bậc Thang Sapa', '2026-08-15', 2, 3000000, 'Đã xác nhận', 'traveler@tea.com', 'Aveline Moreau', '2026-07-14'),
('B-3829', 'ha-long-bay-cruising', 'Du Thuyền Di Sản Vịnh Hạ Long', '2026-09-01', 1, 2500000, 'Đã xác nhận', 'client-b@gmail.com', 'Nguyễn Văn B', '2026-07-13');

-- Rooms Mock
INSERT INTO `rooms` (`id`, `name`, `type`, `price`, `status`, `amenities`, `image`, `current_booking`) VALUES
('R-101', 'Phòng Bungalow Hướng Thung Lũng', 'Bungalow', 1200000, 'Occupied', '["Wifi","Điều hòa","Tủ lạnh","Bồn tắm"]', 'https://images.unsplash.com/photo-1618773928121-c32242e63f39', '{"id":"B-9021","guestName":"Aveline Moreau","checkIn":"2026-08-15","checkOut":"2026-08-17"}'),
('R-102', 'Phòng Suite Gia Đình View Đỉnh Núi', 'Suite', 2200000, 'Available', '["Wifi","Ban công","Bồn tắm","Mini bar"]', 'https://images.unsplash.com/photo-1582719508461-905c673771fd', NULL);

-- Staff Mock
INSERT INTO `staff` (`id`, `name`, `email`, `role`, `avatar`, `status`, `checked_in_at`, `checked_out_at`) VALUES
('ST-001', 'Trần Thị Thu Trang', 'thutrang@camelliatrails.vn', 'Quản lý Điều hành', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330', 'Active', '08:00 AM', NULL),
('ST-002', 'Hoàng Văn Huy', 'vanhuy@camelliatrails.vn', 'Hướng dẫn viên chính', 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde', 'Offline', NULL, '05:30 PM');

-- Customers Mock
INSERT INTO `customers` (`id`, `name`, `email`, `phone`, `bookings_count`, `status`) VALUES
('C-001', 'Aveline Moreau', 'traveler@tea.com', '0901234567', 3, 'Active'),
('C-002', 'Nguyễn Văn B', 'client-b@gmail.com', '0912345678', 1, 'Active');

-- Reviews Mock
INSERT INTO `reviews` (`id`, `tour_id`, `user_name`, `rating`, `comment`, `date`) VALUES
(1, 'sapa-emerald-terraces', 'Aveline Moreau', 5, 'Chuyến đi tuyệt vời, hướng dẫn viên rất chu đáo!', '2026-07-10'),
(2, 'ha-long-bay-cruising', 'Nguyễn Văn B', 4, 'Cảnh đẹp xuất sắc, phòng sạch sẽ tiện nghi.', '2026-07-09');

-- Transactions Mock
INSERT INTO `transactions` (`id`, `date`, `amount`, `method`, `status`, `customer`) VALUES
('TX-9902', '2026-07-14', 3000000, 'Chuyển khoản (CK)', 'Completed', 'Aveline Moreau'),
('TX-1209', '2026-07-13', 2500000, 'Chuyển khoản (CK)', 'Completed', 'Nguyễn Văn B');

-- Audit Logs Mock
INSERT INTO `audit_logs` (`id`, `timestamp`, `user`, `action`, `details`) VALUES
(1, CURRENT_TIMESTAMP, 'Giám đốc Sáng tạo (Admin)', 'Đăng nhập', 'Đăng nhập thành công từ IP 192.168.1.10'),
(2, CURRENT_TIMESTAMP, 'Giám đốc Sáng tạo (Admin)', 'Xuất hóa đơn', 'Đã lập hóa đơn nháp DRAFT-001 cho khách hàng a');

-- Users Mock (admin password: adminpassword, traveler password: travelerpassword)
INSERT INTO `users` (`id`, `name`, `email`, `password_hash`, `role`, `avatar`) VALUES
('U-001', 'Giám đốc Sáng tạo (Admin)', 'admin@tea.com', '7e26bf49e917d23d8c11e3b6d2cb1e3b2e5a7d760773d57d59cf71490212e3e5', 'admin', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&q=80'),
('U-002', 'Aveline Moreau', 'traveler@tea.com', '3be969c3a3b50c05df1176b6a031b26f584b4231bcfbbce86bbba9e65839735d', 'user', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80');
