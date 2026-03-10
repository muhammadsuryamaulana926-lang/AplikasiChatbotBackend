const ChatbotHandler = require('./chatbot-logic');
const fs = require('fs');
const path = require('path');

const testQuestions = {
  "KATEGORI 1: SQL KOMPLEKS & AGREGASI": [
    "Berapa jumlah KI per jenis yang status dokumennya \"penerbitan_sertifikat\" dan didaftarkan antara 2018 sampai 2023?",
    "Inventor mana yang punya KI di lebih dari satu jenis (paten sekaligus hak cipta)?",
    "Fakultas mana yang paling banyak menghasilkan KI dengan status \"Tersertifikasi\" dalam 5 tahun terakhir?",
    "Tampilkan KI yang tgl_sertifikasi-nya lebih awal dari tgl_pendaftaran (anomali data)",
    "Berapa rata-rata waktu dari pendaftaran sampai sertifikasi untuk setiap jenis KI?",
    "Inventor yang punya KI tapi sudah tidak aktif (status perlindungan_berakhir) lebih dari 3 tahun",
    "Tahun berapa puncak pendaftaran KI tertinggi dan berapa jumlahnya?",
    "Bandingkan jumlah KI yang didaftarkan sebelum 2015 vs sesudah 2015",
    "Tampilkan 10 judul KI terpanjang beserta inventor dan fakultasnya",
    "Berapa persen KI yang berhasil tersertifikasi dari total yang pernah diajukan?"
  ],
  
  "KATEGORI 2: PENCARIAN AMBIGU & CONTEXT": [
    "Yang tadi, tapi hanya dari FMIPA",
    "Tampilkan detailnya nomor 3",
    "Sama seperti sebelumnya tapi tahun 2020",
    "Siapa inventornya yang paling produktif?",
    "Terus kalau dibandingkan sama tahun lalu gimana?",
    "Yang belum selesai itu berapa?",
    "Coba filter yang statusnya masih proses",
    "Dari data tadi, siapa yang dari luar ITB?",
    "Urutkan yang tadi dari terbaru",
    "Yang mitra kepemilikannya bukan ITB ada berapa?"
  ],
  
  "KATEGORI 3: PERTANYAAN JEBAKAN / EDGE CASE": [
    "Tampilkan semua KI",
    "KI nomor 9999 detail lengkapnya",
    "Inventor bernama \"A\"",
    "Tampilkan KI dari tahun 1800",
    "Berapa KI yang inventor-nya kosong atau null?",
    "Cari KI dengan judul \"asdfjklqwerty\"",
    "Tampilkan KI tahun 2024 bulan 13",
    "Berapa total KI?",
    "KI mana yang no_permohonannya duplikat?",
    "Tampilkan inventor yang namanya mengandung tag HTML"
  ],
  
  "KATEGORI 4: ANALISIS & INSIGHT": [
    "Jenis KI apa yang paling sering ditolak dan apa polanya?",
    "Apakah ada korelasi antara fakultas dan tingkat keberhasilan sertifikasi?",
    "Inventor mana yang paling produktif per dekade (2000-2010, 2010-2020, 2020-sekarang)?",
    "Fakultas mana yang KI-nya paling banyak berstatus \"masa_pengumuman\"?",
    "Berapa persen KI yang mitra kepemilikannya melibatkan instansi luar ITB?",
    "Tren pendaftaran KI dari 2010 sampai 2024 naik atau turun?",
    "Siapa inventor yang punya KI paling tua yang masih aktif?",
    "Bulan apa yang paling banyak digunakan untuk mendaftarkan KI?",
    "Berapa lama rata-rata proses dari ajuan sampai keputusan untuk Paten vs Hak Cipta?",
    "Inventor yang aktif mendaftarkan KI tapi semuanya berstatus gagal/ditolak"
  ],
  
  "KATEGORI 5: MULTI-STEP & FOLLOW-UP CHAIN": [
    "Tampilkan inventor dari FTTM",
    "berapa total mereka",
    "siapa yang paling banyak",
    "detail KI miliknya",
    "Cari KI status \"Ajuan Paten\"",
    "sudah berapa lama diajukan",
    "yang paling lama menunggu siapa?",
    "Tampilkan KI desain industri",
    "dari situ filter yang tersertifikasi",
    "urutkan dari terbaru"
  ],
  
  "KATEGORI 6: PERTANYAAN GABUNGAN / KOMPLEKS": [
    "Tampilkan KI yang inventornya lebih dari 3 orang dan statusnya sudah tersertifikasi",
    "Dari semua KI yang mitra kepemilikannya tidak null, berapa yang jenis Paten dan berapa yang Hak Cipta?",
    "Inventor yang mendaftarkan KI di tahun yang sama lebih dari 5 KI — siapa saja mereka?",
    "Bandingkan KI yang didaftarkan oleh Dosen vs Alumni vs Mahasiswa berdasarkan tingkat keberhasilan sertifikasi",
    "KI mana yang punya no_permohonan tapi tidak punya id_sertifikat padahal status_ki-nya sudah \"Tersertifikasi\"?"
  ]
};

async function runTests() {
  const handler = new ChatbotHandler();
  const results = [];
  const userId = "test_user";
  
  console.log('🚀 Memulai test chatbot...\n');
  
  for (const [category, questions] of Object.entries(testQuestions)) {
    console.log(`\n${'='.repeat(80)}`);
    console.log(`📋 ${category}`);
    console.log('='.repeat(80));
    
    results.push(`\n## ${category}\n`);
    
    for (let i = 0; i < questions.length; i++) {
      const question = questions[i];
      console.log(`\n[${i + 1}/${questions.length}] ❓ ${question}`);
      
      try {
        const startTime = Date.now();
        const response = await handler.processMessage(question, userId);
        const duration = Date.now() - startTime;
        
        const answer = response.message || response.data || 'No response';
        console.log(`✅ ${answer.slice(0, 200)}${answer.length > 200 ? '...' : ''}`);
        console.log(`⏱️  ${duration}ms\n`);
        
        results.push(`### ${i + 1}. ${question}\n`);
        results.push(`**Jawaban:**\n${answer}\n`);
        results.push(`*Waktu: ${duration}ms*\n\n`);
        
        // Delay untuk menghindari rate limit
        await new Promise(resolve => setTimeout(resolve, 1000));
        
      } catch (error) {
        console.error(`❌ Error: ${error.message}\n`);
        results.push(`### ${i + 1}. ${question}\n`);
        results.push(`**Error:** ${error.message}\n\n`);
      }
    }
  }
  
  // Save results to markdown file
  const outputPath = path.join(__dirname, 'test-results.md');
  const markdown = `# Hasil Test Chatbot KI ITB\n\n` +
    `**Tanggal:** ${new Date().toLocaleString('id-ID')}\n` +
    `**Total Pertanyaan:** ${Object.values(testQuestions).flat().length}\n\n` +
    results.join('');
  
  fs.writeFileSync(outputPath, markdown, 'utf8');
  
  console.log('\n' + '='.repeat(80));
  console.log('✅ Test selesai!');
  console.log(`📄 Hasil disimpan di: ${outputPath}`);
  console.log('='.repeat(80));
}

// Run tests
runTests().catch(console.error);
