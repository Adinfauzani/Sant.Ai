export interface Article {
  title: string;
  slug: string;
  excerpt: string;
  date: string;
  category: string;
  cover: string;
  content: string;
  author: { name: string; role: string };
  readTime: string;
}

const wrap = (text: string) =>
  text
    .split("\n\n")
    .map((p) => `<p class="text-sm leading-[1.8] text-muted">${p.trim()}</p>`)
    .join("\n");

export const articles: Article[] = [
  {
    title: "Panduan Memulai Data Science untuk Pemula",
    slug: "panduan-memulai-data-science",
    excerpt: "Langkah-langkah strategis memulai karir di bidang data science dari nol.",
    date: "Jun 10, 2026",
    category: "Data Science",
    cover: "from-blue-600/30 to-cyan-400/10",
    readTime: "5 min read",
    author: { name: "Aulia Rahman", role: "Data Science Enthusiast" },
    content: wrap(`
      Data Science adalah salah satu bidang yang paling diminati saat ini. Mulai dari industri teknologi, keuangan, hingga kesehatan, semuanya membutuhkan data scientist untuk mengolah data menjadi insight berharga.

      Langkah pertama yang perlu kamu lakukan adalah memahami dasar-dasar statistika dan matematika. Ini adalah fondasi utama dalam data science. Pelajari konsep seperti distribusi, probabilitas, linear algebra, dan kalkulus.

      Selanjutnya, kuasai bahasa pemrograman Python. Python adalah bahasa paling populer di data science karena sintaksnya yang sederhana dan ekosistem library yang lengkap seperti pandas, numpy, scikit-learn, dan matplotlib.

      Setelah itu, pelajari SQL. Data di dunia nyata disimpan di database, dan SQL adalah bahasa yang digunakan untuk mengambil dan memanipulasi data tersebut. Kamu harus bisa menulis query kompleks dengan nyaman.

      Tahap berikutnya adalah mempelajari machine learning. Mulai dari supervised learning (regresi, klasifikasi) hingga unsupervised learning (clustering). Pahami algoritma-algoritma dasarnya terlebih dahulu.

      Jangan lupa untuk belajar data visualization. Kemampuan memvisualisasikan data sangat penting untuk mengkomunikasikan temuanmu. Tools seperti matplotlib, seaborn, dan tableau akan sangat membantu.

      Terakhir, kerjakan proyek nyata. Buat portofolio dengan menyelesaikan case studies dari Kaggle atau data open source lainnya. Pengalaman praktis jauh lebih berharga daripada teori saja.

      Selamat belajar dan semoga sukses di perjalanan data science-mu!
    `),
  },
  {
    title: "Apa Itu Fullstack Developer? Panduan Lengkap",
    slug: "apa-itu-fullstack-developer",
    excerpt: "Memahami peran, skill yang dibutuhkan, dan prospek karir fullstack developer.",
    date: "Jun 5, 2026",
    category: "Career",
    cover: "from-emerald-600/30 to-teal-400/10",
    readTime: "7 min read",
    author: { name: "Dimas Ardiansyah", role: "Fullstack Developer" },
    content: wrap(`
      Fullstack developer adalah developer yang mampu mengerjakan baik sisi frontend (tampilan) maupun backend (logika dan database) dari sebuah aplikasi web. Mereka adalah "serba bisa" dalam dunia pengembangan web.

      Seorang fullstack developer harus menguasai HTML, CSS, dan JavaScript untuk frontend. JavaScript adalah bahasa utama, dan kamu perlu memahami framework populer seperti React, Next.js, atau Vue.js.

      Di sisi backend, kamu perlu menguasai setidaknya satu bahasa pemrograman server-side. Pilihan populer termasuk Node.js (JavaScript/TypeScript), Python (Django/FastAPI), atau Go. Pahami juga konsep REST API dan GraphQL.

      Database adalah komponen penting lainnya. Kamu harus paham database relasional seperti PostgreSQL atau MySQL, serta database NoSQL seperti MongoDB. Pelajari juga cara mendesain skema database yang baik.

      Version control dengan Git adalah skill wajib. Kamu harus nyaman dengan branching, merging, pull request, dan kolaborasi tim menggunakan GitHub atau GitLab.

      DevOps basics juga penting. Pahami deployment, CI/CD, Docker, dan cloud services seperti AWS, Vercel, atau Railway. Ini akan membuatmu lebih mandiri sebagai developer.

      Soft skill seperti komunikasi, problem-solving, dan time management tidak kalah penting. Sebagai fullstack developer, kamu sering menjadi jembatan antara tim desain dan tim backend.

      Prospek karir fullstack developer sangat cerah. Banyak startup dan perusahaan teknologi mencari developer yang bisa bekerja di semua layer aplikasi. Gaji yang ditawarkan juga kompetitif.
    `),
  },
  {
    title: "5 Proyek IoT Sederhana untuk Mahasiswa TI",
    slug: "5-proyek-iot-sederhana",
    excerpt: "Ide proyek IoT yang bisa kamu kerjakan untuk portofolio dan tugas akhir.",
    date: "May 28, 2026",
    category: "IoT",
    cover: "from-purple-600/30 to-violet-400/10",
    readTime: "6 min read",
    author: { name: "Bunga Citra", role: "IoT Researcher" },
    content: wrap(`
      Internet of Things (IoT) adalah konsep di mana perangkat fisik terhubung ke internet dan bisa saling berkomunikasi. Buat mahasiswa TI, proyek IoT adalah cara yang bagus untuk belajar embedded systems, networking, dan software development secara bersamaan.

      Proyek 1: Smart Lampu Kontrol Suara. Gunakan ESP32 atau NodeMCU dengan relay module untuk mengontrol lampu menggunakan perintah suara via Google Assistant atau Alexa. Ini proyek sederhana tapi mengesankan.

      Proyek 2: Monitoring Suhu dan Kelembaban Ruangan. Gunakan sensor DHT22 dengan ESP32 yang mengirim data ke platform seperti Blynk atau ThingsBoard. Data bisa dimonitor real-time dari smartphone.

      Proyek 3: Smart Garden. Buat sistem penyiraman otomatis menggunakan soil moisture sensor dan pompa air mini. Tanaman akan disiram otomatis saat tanah terlalu kering. Bisa ditambah sensor cahaya juga.

      Proyek 4: Sistem Keamanan Rumah dengan Notifikasi. Gunakan sensor PIR (motion detection) dengan ESP32-CAM. Saat ada gerakan mencurigakan, kamera mengambil foto dan dikirim ke Telegram bot.

      Proyek 5: Smart Parking dengan Sensor Ultrasonik. Gunakan sensor HC-SR04 untuk mendeteksi ketersediaan slot parkir. Data dikirim ke server dan ditampilkan di website atau aplikasi mobile.

      Tips: Mulailah dengan platform Arduino IDE atau PlatformIO. Pelajari dasar-dasar elektronika seperti tegangan, arus, dan pull-up resistor. Gunakan breadboard untuk prototyping sebelum membuat PCB permanen.

      Semua proyek di atas bisa dikerjakan dengan budget di bawah 500 ribu rupiah. Komponen bisa dibeli di toko online seperti Tokopedia atau Shopee.
    `),
  },
  {
    title: "Tips Lulus Sertifikasi AWS Cloud Practitioner",
    slug: "tips-lulus-sertifikasi-aws",
    excerpt: "Strategi dan sumber belajar untuk lulus ujian AWS Cloud Practitioner.",
    date: "May 20, 2026",
    category: "Cloud",
    cover: "from-amber-600/30 to-orange-400/10",
    readTime: "4 min read",
    author: { name: "Aulia Rahman", role: "Cloud Enthusiast" },
    content: wrap(`
      AWS Cloud Practitioner (CLF-C02) adalah sertifikasi tingkat fundamental dari Amazon Web Services. Sertifikasi ini cocok untuk pemula yang ingin memulai karir di cloud computing.

      Ujian ini mencakup 4 domain utama: Konsep Cloud (26%), Keamanan dan Kepatuhan (25%), Teknologi dan Layanan AWS (33%), serta Penagihan dan Harga (16%). Kamu perlu paham service-service utama seperti EC2, S3, Lambda, dan RDS.

      Sumber belajar terbaik adalah AWS Skill Builder. Ada kursus gratis "AWS Cloud Practitioner Essentials" yang mencakup semua materi ujian. Lengkapi dengan video dari exampro di YouTube.

      Gunakan practice test dari Tutorials Dojo atau Whizlabs. Kerjakan minimal 3-4 full practice test sampai kamu konsisten mendapat skor di atas 80%. Analisis setiap jawaban yang salah.

      Buat catatan ringkas tentang perbedaan service-service AWS. Misalnya, kapan pakai EC2 vs Lambda, S3 vs EBS, RDS vs DynamoDB. Perbandingan ini sering muncul di ujian.

      Pahami model shared responsibility. AWS bertanggung jawab atas "security OF the cloud", sementara pengguna bertanggung jawab atas "security IN the cloud". Ini konsep kunci yang sering diuji.

      Pelajari juga AWS Well-Architected Framework: Operational Excellence, Security, Reliability, Performance Efficiency, Cost Optimization, dan Sustainability. Ini adalah best practices dalam membangun arsitektur di AWS.

      Harga ujian sekitar 100 USD. Setelah lulus, sertifikat berlaku selama 3 tahun. Siapkan waktu belajar 2-4 minggu dengan konsistensi 1-2 jam per hari.
    `),
  },
  {
    title: "Membangun REST API dengan Node.js dan Express",
    slug: "membangun-rest-api-nodejs",
    excerpt: "Panduan praktis membangun REST API yang scalable menggunakan Node.js dan Express.",
    date: "May 15, 2026",
    category: "Backend",
    cover: "from-sky-600/30 to-blue-400/10",
    readTime: "8 min read",
    author: { name: "Dimas Ardiansyah", role: "Backend Developer" },
    content: wrap(`
      REST API adalah standar arsitektur untuk membangun web service yang memungkinkan komunikasi antara client dan server. Node.js dengan Express adalah kombinasi populer untuk membangun REST API.

      Pertama, inisialisasi proyek Node.js dengan npm init. Install express, dotenv, dan nodemon sebagai dev dependency. Buat struktur folder yang rapi: routes/, controllers/, models/, middleware/.

      Setup Express server di file index.js atau app.js. Gunakan middleware built-in seperti express.json() untuk parsing JSON body. Atur port di environment variable.

      Buat route structure dengan Express Router. Contoh: /api/users, /api/projects, /api/auth. Setiap resource punya file route sendiri. Gunakan HTTP methods sesuai fungsinya: GET, POST, PUT, DELETE.

      Implementasi controller untuk handle business logic. Pisahkan logic dari route handler. Controller akan memproses request, berinteraksi dengan database, dan mengembalikan response.

      Gunakan Prisma atau Sequelize sebagai ORM untuk database. Prisma sangat recommended karena type safety-nya. Schema-first approach memudahkan perubahan model data.

      Implementasi validasi request menggunakan Zod atau Joi. Jangan percaya input dari client. Validasi di middleware layer sebelum mencapai controller.

      Jangan lupa error handling. Buat global error handler middleware yang menangkap semua error dan mengembalikan response JSON yang konsisten. Gunakan custom error classes.

      Untuk production, tambahkan logging (Winston/Pino), rate limiting (express-rate-limit), CORS, helmet untuk security headers, dan compression untuk response.
    `),
  },
  {
    title: "UI/UX Design untuk Pemula: Tools & Workflow",
    slug: "ui-ux-design-untuk-pemula",
    excerpt: "Tools dan workflow yang perlu diketahui oleh UI/UX designer pemula di 2026.",
    date: "May 8, 2026",
    category: "Design",
    cover: "from-pink-600/30 to-rose-400/10",
    readTime: "6 min read",
    author: { name: "Bunga Citra", role: "UI/UX Designer" },
    content: wrap(`
      UI/UX design adalah proses mendesain produk digital yang tidak hanya terlihat bagus, tetapi juga mudah dan menyenangkan digunakan. UX (User Experience) fokus pada bagaimana produk bekerja, UI (User Interface) fokus pada bagaimana produk terlihat.

      Langkah pertama dalam workflow design adalah riset. Pahami user, masalah mereka, dan konteks penggunaan produk. Teknik riset bisa berupa wawancara, survey, atau analisis kompetitor.

      Buat user persona untuk merepresentasikan target user. Persona membantu tim desain dan pengembang untuk selalu ingat untuk siapa mereka mendesain. Sertakan demografi, goals, dan pain points.

      Lanjut ke information architecture dan user flow. Petakan bagaimana user akan menavigasi produk. Buat flowchart dari halaman satu ke halaman lain. Identifikasi potensi bottleneck.

      Wireframing adalah tahap membuat kerangka kasar layout. Fokus pada struktur dan hierarki konten, bukan visual detail. Tools seperti Figma, Balsamiq, atau bahkan kertas dan pensil bisa digunakan.

      Setelah wireframe disetujui, buat high-fidelity mockup. Di sinilah visual design diterapkan: warna, tipografi, icon, spacing, dan komponen UI. Gunakan design system untuk konsistensi.

      Prototyping adalah tahap menghubungkan mockup menjadi interaktif. Figma memiliki fitur prototyping yang powerful. Prototype bisa diuji ke user untuk mendapatkan feedback sebelum development.

      Tools utama untuk UI/UX designer di 2026 adalah Figma (standar industri). Pelajari juga Adobe XD, Penpot (open source alternatif), dan tools pendukung seperti Maze (user testing) dan Zeplin (handoff ke developer).

      Portofolio adalah kunci. Dokumentasikan setiap proyek dengan case study: problem, process, solution, dan hasil. Employer ingin melihat thought process-mu, bukan hanya hasil akhir.
    `),
  },
];
