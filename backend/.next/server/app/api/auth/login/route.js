(()=>{var e={};e.id=873,e.ids=[873],e.modules={2849:e=>{function t(e){var t=Error("Cannot find module '"+e+"'");throw t.code="MODULE_NOT_FOUND",t}t.keys=()=>[],t.resolve=t,t.id=2849,e.exports=t},399:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},517:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},8893:e=>{"use strict";e.exports=require("buffer")},4770:e=>{"use strict";e.exports=require("crypto")},7702:e=>{"use strict";e.exports=require("events")},2048:e=>{"use strict";e.exports=require("fs")},8216:e=>{"use strict";e.exports=require("net")},9801:e=>{"use strict";e.exports=require("os")},5315:e=>{"use strict";e.exports=require("path")},5816:e=>{"use strict";e.exports=require("process")},6162:e=>{"use strict";e.exports=require("stream")},4026:e=>{"use strict";e.exports=require("string_decoder")},5346:e=>{"use strict";e.exports=require("timers")},2452:e=>{"use strict";e.exports=require("tls")},7360:e=>{"use strict";e.exports=require("url")},1764:e=>{"use strict";e.exports=require("util")},1568:e=>{"use strict";e.exports=require("zlib")},2254:e=>{"use strict";e.exports=require("node:buffer")},5714:e=>{"use strict";e.exports=require("node:diagnostics_channel")},4281:(e,t,a)=>{"use strict";a.r(t),a.d(t,{originalPathname:()=>R,patchFetch:()=>E,requestAsyncStorage:()=>L,routeModule:()=>T,serverHooks:()=>c,staticGenerationAsyncStorage:()=>A});var r={};a.r(r),a.d(r,{OPTIONS:()=>N,POST:()=>u});var s=a(9303),i=a(8716),o=a(670),n=a(6182);async function u(e){return n.Q.login(e)}async function N(){return n.Q.login(null)}let T=new s.AppRouteRouteModule({definition:{kind:i.x.APP_ROUTE,page:"/api/auth/login/route",pathname:"/api/auth/login",filename:"route",bundlePath:"app/api/auth/login/route"},resolvedPagePath:"D:\\React\\TOUR\\backend\\app\\api\\auth\\login\\route.ts",nextConfigOutput:"",userland:r}),{requestAsyncStorage:L,staticGenerationAsyncStorage:A,serverHooks:c}=T,R="/api/auth/login/route";function E(){return(0,o.patchFetch)({serverHooks:c,staticGenerationAsyncStorage:A})}},9487:(e,t,a)=>{"use strict";a.d(t,{Dv:()=>R,IO:()=>c});var r=a(3785),s=a(6636),i=a.n(s),o=a(5315),n=a.n(o);i().config({path:n().resolve(process.cwd(),".env")});let u=process.env.DB_HOST||"localhost",N=process.env.DB_USER||"root",T=process.env.DB_PASSWORD||"11032003",L=process.env.DB_NAME||"TANTAYDO",A=r.createPool({host:u,user:N,password:T,database:L,waitForConnections:!0,connectionLimit:10,queueLimit:0});async function c(e,t){let[a]=await A.execute(e,t);return a}async function R(){try{let e=await r.createConnection({host:u,user:N,password:T});await e.query(`CREATE DATABASE IF NOT EXISTS \`${L}\`;`),await e.end(),console.log(">>> Initializing all dashboard tables..."),await c(`
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
    `),await c(`
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
    `),await c(`
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
    `),await c(`
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
    `),await c(`
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
    `),await c(`
      CREATE TABLE IF NOT EXISTS \`customers\` (
        \`id\` VARCHAR(50) NOT NULL PRIMARY KEY,
        \`name\` VARCHAR(250) NOT NULL,
        \`email\` VARCHAR(150) NOT NULL,
        \`phone\` VARCHAR(50) NOT NULL,
        \`bookings_count\` INT DEFAULT 0,
        \`status\` VARCHAR(50) NOT NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `),await c(`
      CREATE TABLE IF NOT EXISTS \`reviews\` (
        \`id\` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
        \`tour_id\` VARCHAR(100) NOT NULL,
        \`user_name\` VARCHAR(250) NOT NULL,
        \`rating\` INT NOT NULL,
        \`comment\` TEXT NOT NULL,
        \`date\` DATE NOT NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `),await c(`
      CREATE TABLE IF NOT EXISTS \`transactions\` (
        \`id\` VARCHAR(50) NOT NULL PRIMARY KEY,
        \`date\` DATE NOT NULL,
        \`amount\` INT NOT NULL,
        \`method\` VARCHAR(50) NOT NULL,
        \`status\` VARCHAR(50) NOT NULL,
        \`customer\` VARCHAR(250) NOT NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `),await c(`
      CREATE TABLE IF NOT EXISTS \`audit_logs\` (
        \`id\` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
        \`timestamp\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        \`user\` VARCHAR(150) NOT NULL,
        \`action\` VARCHAR(250) NOT NULL,
        \`details\` TEXT NOT NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `),await c(`
      CREATE TABLE IF NOT EXISTS \`users\` (
        \`id\` VARCHAR(50) NOT NULL PRIMARY KEY,
        \`name\` VARCHAR(250) NOT NULL,
        \`email\` VARCHAR(150) NOT NULL UNIQUE,
        \`password_hash\` VARCHAR(250) NOT NULL,
        \`role\` VARCHAR(50) NOT NULL DEFAULT 'user',
        \`avatar\` VARCHAR(500) NULL,
        \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);let t=await c("SELECT COUNT(*) as count FROM users"),a=t[0]?.count||0;0===a&&(await c(`
        INSERT INTO users (id, name, email, password_hash, role, avatar)
        VALUES 
          ('U-001', 'Gi\xe1m đốc S\xe1ng tạo (Admin)', 'admin@tea.com', '7e26bf49e917d23d8c11e3b6d2cb1e3b2e5a7d760773d57d59cf71490212e3e5', 'admin', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&q=80'),
          ('U-002', 'Aveline Moreau', 'traveler@tea.com', '3be969c3a3b50c05df1176b6a031b26f584b4231bcfbbce86bbba9e65839735d', 'user', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80');
      `),console.log(">>> Seeded default admin and traveler users into MySQL.")),console.log(">>> Database TANTAYDO and all dashboard tables initialized successfully.")}catch(e){console.error(">>> Error initializing database:",e)}}},6182:(e,t,a)=>{"use strict";a.d(t,{Q:()=>E});var r=a(7070),s=a(9487);class i{static async findByEmail(e){let t=await (0,s.IO)("SELECT * FROM users WHERE email = ?",[e]);return t&&0!==t.length?t[0]:null}static async findById(e){let t=await (0,s.IO)("SELECT * FROM users WHERE id = ?",[e]);return t&&0!==t.length?t[0]:null}static async create(e){let t=`
      INSERT INTO users (id, name, email, password_hash, role, avatar)
      VALUES (?, ?, ?, ?, ?, ?);
    `;await (0,s.IO)(t,[e.id,e.name,e.email,e.password_hash,e.role,e.avatar])}}var o=a(4770),n=a.n(o);let u=process.env.JWT_SECRET||"camellia_tours_jwt_secret_key_11032003_secure";function N(e){return n().createHash("sha256").update(e).digest("hex")}function T(e){return e.toString("base64").replace(/=/g,"").replace(/\+/g,"-").replace(/\//g,"_")}var L=a(359),A=a(3278);class c extends A.e{constructor(e="Unauthorized"){super(e,401)}}class R{static async register(e){let{name:t,email:a,password:r,role:s,avatar:o}=e;if(!t||!a||!r)throw new L.w("Name, email, and password are required");if(await i.findByEmail(a))throw new L.w("Email already registered");let n=`U-${Math.floor(1e3+9e3*Math.random())}`,u=N(r),T="admin"===s?"admin":"user",A=o||`https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(t)}`;return await i.create({id:n,name:t,email:a,password_hash:u,role:T,avatar:A}),{id:n,name:t,email:a,role:T,avatar:A}}static async login(e){let{email:t,password:a}=e;if(!t||!a)throw new L.w("Email and password are required");let r=await i.findByEmail(t);if(!r)throw new c("Invalid email or password");let s=N(a);if(r.password_hash!==s)throw new c("Invalid email or password");let o={id:r.id,name:r.name,email:r.email,role:r.role,avatar:r.avatar};return{accessToken:function(e,t=u,a=86400){let r=Math.floor(Date.now()/1e3),s={...e,iat:r,exp:r+a},i=T(Buffer.from(JSON.stringify({alg:"HS256",typ:"JWT"}))),o=T(Buffer.from(JSON.stringify(s))),N=`${i}.${o}`,L=T(n().createHmac("sha256",t).update(N).digest());return`${i}.${o}.${L}`}(o),user:o}}}class E{static async register(e){try{let t=await e.json(),a=await R.register(t);return r.NextResponse.json({status:"success",message:"User registered successfully",user:a})}catch(e){if(e instanceof A.e)return r.NextResponse.json({error:e.message},{status:e.status});return r.NextResponse.json({error:e.message||e},{status:500})}}static async login(e){try{let t=await e.json(),a=await R.login(t);return r.NextResponse.json({status:"success",message:"Login successful",...a})}catch(e){if(e instanceof A.e)return r.NextResponse.json({error:e.message},{status:e.status});return r.NextResponse.json({error:e.message||e},{status:500})}}}},359:(e,t,a)=>{"use strict";a.d(t,{w:()=>s});var r=a(3278);class s extends r.e{constructor(e="Bad Request"){super(e,400)}}},3278:(e,t,a)=>{"use strict";a.d(t,{e:()=>r});class r extends Error{constructor(e,t){super(e),this.status=t,Object.setPrototypeOf(this,new.target.prototype)}}}};var t=require("../../../../webpack-runtime.js");t.C(e);var a=e=>t(t.s=e),r=t.X(0,[756],()=>a(4281));module.exports=r})();