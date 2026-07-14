(()=>{var e={};e.id=636,e.ids=[636],e.modules={2849:e=>{function t(e){var t=Error("Cannot find module '"+e+"'");throw t.code="MODULE_NOT_FOUND",t}t.keys=()=>[],t.resolve=t,t.id=2849,e.exports=t},399:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},517:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},8893:e=>{"use strict";e.exports=require("buffer")},4770:e=>{"use strict";e.exports=require("crypto")},7702:e=>{"use strict";e.exports=require("events")},2048:e=>{"use strict";e.exports=require("fs")},8216:e=>{"use strict";e.exports=require("net")},9801:e=>{"use strict";e.exports=require("os")},5315:e=>{"use strict";e.exports=require("path")},5816:e=>{"use strict";e.exports=require("process")},6162:e=>{"use strict";e.exports=require("stream")},4026:e=>{"use strict";e.exports=require("string_decoder")},5346:e=>{"use strict";e.exports=require("timers")},2452:e=>{"use strict";e.exports=require("tls")},7360:e=>{"use strict";e.exports=require("url")},1764:e=>{"use strict";e.exports=require("util")},1568:e=>{"use strict";e.exports=require("zlib")},2254:e=>{"use strict";e.exports=require("node:buffer")},5714:e=>{"use strict";e.exports=require("node:diagnostics_channel")},7758:(e,t,s)=>{"use strict";s.r(t),s.d(t,{originalPathname:()=>C,patchFetch:()=>d,requestAsyncStorage:()=>c,routeModule:()=>E,serverHooks:()=>U,staticGenerationAsyncStorage:()=>O});var r={};s.r(r),s.d(r,{GET:()=>n,OPTIONS:()=>R,POST:()=>u});var o=s(9303),a=s(8716),i=s(670),T=s(7070),A=s(9487);let N=!1;async function L(){N||(await (0,A.Dv)(),N=!0)}async function n(){try{await L();let e=await (0,A.IO)("SELECT * FROM customers ORDER BY bookings_count DESC, id ASC");return T.NextResponse.json(e)}catch(e){return T.NextResponse.json({error:e.message||e},{status:500})}}async function u(e){try{await L();let{id:t,name:s,email:r,phone:o,bookingsCount:a,status:i}=await e.json(),N=`
      INSERT INTO customers (id, name, email, phone, bookings_count, status)
      VALUES (?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        name = VALUES(name),
        email = VALUES(email),
        phone = VALUES(phone),
        bookings_count = VALUES(bookings_count),
        status = VALUES(status);
    `;return await (0,A.IO)(N,[t,s,r,o,a||0,i||"Active"]),T.NextResponse.json({status:"success",id:t})}catch(e){return T.NextResponse.json({error:e.message||e},{status:500})}}async function R(){return new T.NextResponse(null,{status:200,headers:{"Access-Control-Allow-Origin":"*","Access-Control-Allow-Methods":"GET, POST, OPTIONS","Access-Control-Allow-Headers":"Content-Type"}})}let E=new o.AppRouteRouteModule({definition:{kind:a.x.APP_ROUTE,page:"/api/customers/route",pathname:"/api/customers",filename:"route",bundlePath:"app/api/customers/route"},resolvedPagePath:"D:\\React\\TOUR\\backend\\app\\api\\customers\\route.ts",nextConfigOutput:"",userland:r}),{requestAsyncStorage:c,staticGenerationAsyncStorage:O,serverHooks:U}=E,C="/api/customers/route";function d(){return(0,i.patchFetch)({serverHooks:U,staticGenerationAsyncStorage:O})}},9487:(e,t,s)=>{"use strict";s.d(t,{Dv:()=>E,IO:()=>R});var r=s(3785),o=s(6636),a=s.n(o),i=s(5315),T=s.n(i);a().config({path:T().resolve(process.cwd(),".env")});let A=process.env.DB_HOST||"localhost",N=process.env.DB_USER||"root",L=process.env.DB_PASSWORD||"11032003",n=process.env.DB_NAME||"TANTAYDO",u=r.createPool({host:A,user:N,password:L,database:n,waitForConnections:!0,connectionLimit:10,queueLimit:0});async function R(e,t){let[s]=await u.execute(e,t);return s}async function E(){try{let e=await r.createConnection({host:A,user:N,password:L});await e.query(`CREATE DATABASE IF NOT EXISTS \`${n}\`;`),await e.end(),console.log(">>> Initializing all dashboard tables..."),await R(`
      CREATE TABLE IF NOT EXISTS \`invoices\` (
        \`id\` VARCHAR(50) NOT NULL PRIMARY KEY,
        \`template_code\` VARCHAR(20) NOT NULL,
        \`invoice_series\` VARCHAR(20) NOT NULL,
        \`created_date\` DATE NOT NULL,
        \`buyer_name\` VARCHAR(250) NOT NULL,
        \`buyer_legal_name\` VARCHAR(250) NULL,
        \`buyer_tax_code\` VARCHAR(50) NULL,
        \`total_pre_tax\` DECIMAL(15,2) NOT NULL,
        \`total_tax\` DECIMAL(15,2) NOT NULL,
        \`total_amount\` DECIMAL(15,2) NOT NULL,
        \`currency_code\` VARCHAR(10) NOT NULL,
        \`status\` VARCHAR(50) NOT NULL,
        \`payload_json\` LONGTEXT NOT NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `),await R(`
      CREATE TABLE IF NOT EXISTS \`tours\` (
        \`id\` VARCHAR(100) NOT NULL PRIMARY KEY,
        \`title\` VARCHAR(250) NOT NULL,
        \`location\` VARCHAR(250) NOT NULL,
        \`duration\` VARCHAR(50) NOT NULL,
        \`price\` INT NOT NULL,
        \`max_guests\` INT NOT NULL,
        \`description\` TEXT NOT NULL,
        \`image\` VARCHAR(500) NOT NULL,
        \`rating\` DECIMAL(3,2) DEFAULT 5.00,
        \`featured\` TINYINT(1) DEFAULT 0
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `),await R(`
      CREATE TABLE IF NOT EXISTS \`bookings\` (
        \`id\` VARCHAR(50) NOT NULL PRIMARY KEY,
        \`tour_id\` VARCHAR(100) NOT NULL,
        \`tour_title\` VARCHAR(250) NOT NULL,
        \`date\` DATE NOT NULL,
        \`guests\` INT NOT NULL,
        \`total_price\` INT NOT NULL,
        \`status\` VARCHAR(50) NOT NULL,
        \`user_email\` VARCHAR(150) NOT NULL,
        \`user_name\` VARCHAR(250) NOT NULL,
        \`booked_at\` DATE NOT NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `),await R(`
      CREATE TABLE IF NOT EXISTS \`rooms\` (
        \`id\` VARCHAR(50) NOT NULL PRIMARY KEY,
        \`name\` VARCHAR(150) NOT NULL,
        \`type\` VARCHAR(100) NOT NULL,
        \`price\` INT NOT NULL,
        \`status\` VARCHAR(50) NOT NULL,
        \`amenities\` TEXT NOT NULL COMMENT 'JSON stringified array',
        \`image\` VARCHAR(500) NOT NULL,
        \`current_booking\` TEXT NULL COMMENT 'JSON stringified room booking info'
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `),await R(`
      CREATE TABLE IF NOT EXISTS \`staff\` (
        \`id\` VARCHAR(50) NOT NULL PRIMARY KEY,
        \`name\` VARCHAR(250) NOT NULL,
        \`email\` VARCHAR(150) NOT NULL,
        \`role\` VARCHAR(100) NOT NULL,
        \`avatar\` VARCHAR(500) NOT NULL,
        \`status\` VARCHAR(50) NOT NULL,
        \`checked_in_at\` VARCHAR(100) NULL,
        \`checked_out_at\` VARCHAR(100) NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `),await R(`
      CREATE TABLE IF NOT EXISTS \`customers\` (
        \`id\` VARCHAR(50) NOT NULL PRIMARY KEY,
        \`name\` VARCHAR(250) NOT NULL,
        \`email\` VARCHAR(150) NOT NULL,
        \`phone\` VARCHAR(50) NOT NULL,
        \`bookings_count\` INT DEFAULT 0,
        \`status\` VARCHAR(50) NOT NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `),await R(`
      CREATE TABLE IF NOT EXISTS \`reviews\` (
        \`id\` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
        \`tour_id\` VARCHAR(100) NOT NULL,
        \`user_name\` VARCHAR(250) NOT NULL,
        \`rating\` INT NOT NULL,
        \`comment\` TEXT NOT NULL,
        \`date\` DATE NOT NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `),await R(`
      CREATE TABLE IF NOT EXISTS \`transactions\` (
        \`id\` VARCHAR(50) NOT NULL PRIMARY KEY,
        \`date\` DATE NOT NULL,
        \`amount\` INT NOT NULL,
        \`method\` VARCHAR(50) NOT NULL,
        \`status\` VARCHAR(50) NOT NULL,
        \`customer\` VARCHAR(250) NOT NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `),await R(`
      CREATE TABLE IF NOT EXISTS \`audit_logs\` (
        \`id\` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
        \`timestamp\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        \`user\` VARCHAR(150) NOT NULL,
        \`action\` VARCHAR(250) NOT NULL,
        \`details\` TEXT NOT NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `),await R(`
      CREATE TABLE IF NOT EXISTS \`users\` (
        \`id\` VARCHAR(50) NOT NULL PRIMARY KEY,
        \`name\` VARCHAR(250) NOT NULL,
        \`email\` VARCHAR(150) NOT NULL UNIQUE,
        \`password_hash\` VARCHAR(250) NOT NULL,
        \`role\` VARCHAR(50) NOT NULL DEFAULT 'user',
        \`avatar\` VARCHAR(500) NULL,
        \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);let t=await R("SELECT COUNT(*) as count FROM users"),s=t[0]?.count||0;0===s&&(await R(`
        INSERT INTO users (id, name, email, password_hash, role, avatar)
        VALUES 
          ('U-001', 'Gi\xe1m đốc S\xe1ng tạo (Admin)', 'admin@tea.com', '7e26bf49e917d23d8c11e3b6d2cb1e3b2e5a7d760773d57d59cf71490212e3e5', 'admin', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&q=80'),
          ('U-002', 'Aveline Moreau', 'traveler@tea.com', '3be969c3a3b50c05df1176b6a031b26f584b4231bcfbbce86bbba9e65839735d', 'user', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80');
      `),console.log(">>> Seeded default admin and traveler users into MySQL.")),console.log(">>> Database TANTAYDO and all dashboard tables initialized successfully.")}catch(e){console.error(">>> Error initializing database:",e)}}}};var t=require("../../../webpack-runtime.js");t.C(e);var s=e=>t(t.s=e),r=t.X(0,[756],()=>s(7758));module.exports=r})();