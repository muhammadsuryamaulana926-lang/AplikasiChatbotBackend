# Hasil Test Chatbot KI ITB

**Tanggal:** 27/2/2026, 14.30.52
**Total Pertanyaan:** 55


## KATEGORI 1: SQL KOMPLEKS & AGREGASI
### 1. Berapa jumlah KI per jenis yang status dokumennya "penerbitan_sertifikat" dan didaftarkan antara 2018 sampai 2023?
**Jawaban:**
Breakdown berdasarkan jenis_ki:

1. Hak Cipta: 366
2. Desain Industri: 151
3. Merek: 31

Total keseluruhan: 548
*Waktu: 1636ms*

### 2. Inventor mana yang punya KI di lebih dari satu jenis (paten sekaligus hak cipta)?
**Jawaban:**
Daftar inventor (1-13 dari 8):

1. Anugrah Adiwilaga, S.ST., M.T. (Universitas Pendidikan Indonesia (Cibiru) - Dosen - 920200819880813101) (2)
2. Dhimas Prabudi Wicaksa (2)
3. Dr. Eng., Ir. Febri Zukhruf S.T, M.T. (2)
4. Dr. Eng., Ir. Febri Zukhruf S.T, M.T. (5)
5. Dr. Muhammad Yusuf Abduh M.T. (2)
6. Dr. Russ Bona Frazila S.T, M.T. (5)
7. Egi Muhammad Idris Hidayat S.T, M.Sc., Ph.D. (2)
8. Prof. Dr. Ir. Bambang Riyanto Trilaksono (2)
9. Prof. Trio Adiono S.T, M.T, Ph.D. (4)
10. Prof. Yusep Rosmansyah S.T, M.Sc., Ph.D. (8)
11. Sapto Adi Nugroho, S.T. (2)
12. Sigit Haryadi (9)
13. Trilaksono Waqi Prasetio (2)
*Waktu: 4920ms*

### 3. Fakultas mana yang paling banyak menghasilkan KI dengan status "Tersertifikasi" dalam 5 tahun terakhir?
**Jawaban:**
Menampilkan 1-10 dari 10 data:

1.    Total Ki: 38

2.    Fakultas: STEI
   Total Ki: 38

3.    Fakultas: FSRD
   Total Ki: 21

4.    Fakultas: STEI, STEI, STEI, STEI, STEI
   Total Ki: 15

5.    Fakultas: STEI, STEI
   Total Ki: 14

6.    Fakultas: FTTM, FTTM
   Total Ki: 9

7.    Fakultas: FTTM
   Total Ki: 9

8.    Fakultas: FITB
   Total Ki: 8

9.    Fakultas: FTI
   Total Ki: 8

10.    Fakultas: STEI, STEI, STEI, STEI, STEI, STEI
   Total Ki: 7
*Waktu: 4746ms*

### 4. Tampilkan KI yang tgl_sertifikasi-nya lebih awal dari tgl_pendaftaran (anomali data)
**Jawaban:**
Jenis anomali yang bisa dideteksi:

1. Duplikasi judul: "ada duplikat judul?"
2. Data kosong: "ki tanpa inventor"
3. Status tidak wajar: "ki status tidak konsisten"
4. Tanggal tidak valid: "ki tanggal tidak valid"

Sebutkan jenis anomali yang ingin diperiksa.
*Waktu: 14ms*

### 5. Berapa rata-rata waktu dari pendaftaran sampai sertifikasi untuk setiap jenis KI?
**Jawaban:**
Menampilkan 1-4 dari 4 data:

1.    Jenis: Hak Cipta
   Rata Rata Hari: -125.5108

2.    Jenis: Merek
   Rata Rata Hari: 367.5250

3.    Jenis: Desain Industri
   Rata Rata Hari: 530.5238

4.    Jenis: Paten
   Rata Rata Hari: 1490.2683
*Waktu: 5064ms*

### 6. Inventor yang punya KI tapi sudah tidak aktif (status perlindungan_berakhir) lebih dari 3 tahun
**Jawaban:**
Maaf, tidak ditemukan data untuk "Inventor yang punya KI tapi sudah tidak aktif (status perlindungan_berakhir) lebih dari 3 tahun".

Mungkin Anda ingin mencoba:
1. Inventor yang punya KI tapi sudah tidak aktif
2. Inventor dengan KI yang sudah berakhir perlindungannya
3. KI yang sudah tidak aktif lebih dari 3 tahun dan status perlindungannya sudah berakhir
*Waktu: 5557ms*

### 7. Tahun berapa puncak pendaftaran KI tertinggi dan berapa jumlahnya?
**Jawaban:**
Menampilkan 1-10 dari 10 data:

1.    Tahun: 2023
   Jumlah Pendaftaran: 229

2.    Tahun: 2019
   Jumlah Pendaftaran: 211

3.    Tahun: 2020
   Jumlah Pendaftaran: 199

4.    Tahun: 2024
   Jumlah Pendaftaran: 181

5.    Tahun: 2022
   Jumlah Pendaftaran: 164

6.    Tahun: 2021
   Jumlah Pendaftaran: 157

7.    Tahun: 2018
   Jumlah Pendaftaran: 83

8.    Tahun: 2017
   Jumlah Pendaftaran: 32

9.    Tahun: 2025
   Jumlah Pendaftaran: 30

10.    Tahun: 2016
   Jumlah Pendaftaran: 21
*Waktu: 4807ms*

### 8. Bandingkan jumlah KI yang didaftarkan sebelum 2015 vs sesudah 2015
**Jawaban:**
Menampilkan 1-2 dari 2 data:

1.    Periode: Sesudah 2015
   Jumlah Pendaftaran: 1316

2.    Periode: Sebelum 2015
   Jumlah Pendaftaran: 37
*Waktu: 549ms*

### 9. Tampilkan 10 judul KI terpanjang beserta inventor dan fakultasnya
**Jawaban:**
[object Object]
*Waktu: 2339ms*

### 10. Berapa persen KI yang berhasil tersertifikasi dari total yang pernah diajukan?
**Jawaban:**
[object Object]
*Waktu: 7263ms*


## KATEGORI 2: PENCARIAN AMBIGU & CONTEXT
### 1. Yang tadi, tapi hanya dari FMIPA
**Jawaban:**
Menampilkan 1-2 dari 2 data:

1.    Periode: 2015 atau setelahnya
   Jumlah Ki: 142

2.    Periode: Sebelum 2015
   Jumlah Ki: 8
*Waktu: 7552ms*

### 2. Tampilkan detailnya nomor 3
**Jawaban:**
Menampilkan 1-10 dari 142 data:

1. **PROSES PRODUKSI BAHAN PEMLASTIS EPOKSIDA MINYAK NABATI DAN TURUNAN ESTERNYA TERKATALISIS KOMPLEKS LOGAM-OKSO DAN LOGAM OKSIDA TANPA PELARUT DAN ASAM MINERAL**
   Id: 18
   Id Ki: 1649
   Jenis: Paten
   Abstrak: Invensi ini berkaitan dengan metode sintesis sulfonat alkil ester (SAE) (Paten No. P00201600324) dan...
   Status: Diberi Paten
   Tanggal: 12 Maret 2019
   No Permohonan: P00201902086
   Tanggal: 29 September 2023
   Id Sertifikat: IDP000089818
   Status: pemeliharaan
   Inventor: Prof. Ir. Doddy Abdassah M.Sc., dkk
   Fakultas: FTTM, FTTM, FMIPA, FTTM
   Pekerjaan Inventor: Dosen, Dosen, Dosen, Dosen
   Nama Instansi Inventor: Institut Teknologi Bandung, Institut Teknologi Bandung, Institut Teknologi Bandung, Institut Teknolo...
   Mitra Kepemilikan: Institut Teknologi Bandung

2. **Perangkat Pengukuran Tomografi Induced Polarization Resistivity Multichannel dengan Multi Array Electrode Potensial dan Electrode yang saling terpisah**
   Id: 22
   Id Ki: 426
   Jenis: Paten
   Abstrak: -...
   Status: Diberi Paten
   Tanggal: 8 Oktober 2020
   No Permohonan: P00202007330
   Tanggal: 14 Januari 2024
   Id Sertifikat: IDP000091612
   Status: pemeliharaan
   Inventor: Prof. Dr. Eng. R. Bagus Endar Bachtiar N. (FMIPA - Dosen - 196803271994021001)
   Fakultas: FMIPA
   Pekerjaan Inventor: Dosen
   Nama Instansi Inventor: Institut Teknologi Bandung
   Mitra Kepemilikan: Institut Teknologi Bandung

3. **MATERIAL BERPENDAR KUANTUM DOT PEROVSKITE HALIDA YANG STABIL DENGAN PENAMBAHAN FUMED SILIKA UNTUK APLIKASI BIDANG FOTOELEKTRONIK SERTA METODE SINTESISNYA**
   Id: 28
   Id Ki: 292
   Jenis: Paten
   Abstrak: Invensi ini adalah tentang material fotoluminesensi yaitu Kuantum Dots (Quantum dots; QDs) perovskit...
   Status: Ajuan Paten
   Tanggal: 25 Juli 2019
   No Permohonan: P00201906362
   Status: pemeriksaan_formalitas
   Inventor: Dr. rer. nat. Akfiny Hasdi Aimon S.Si., dkk
   Fakultas: FMIPA, FMIPA
   Pekerjaan Inventor: Dosen, Dosen
   Nama Instansi Inventor: Institut Teknologi Bandung, Institut Teknologi Bandung
   Mitra Kepemilikan: Institut Teknologi Bandung

4. **SEDIAAN BAHAN BIOSURFAKTAN SEBAGAI INHIBITOR KOROSI DARI BAKTERI HALOFILIK Halomonas meridiana BK-AB4 SERTA PROSES PRODUKSINYA**
   Id: 36
   Id Ki: 581
   Jenis: Paten
   Abstrak: Invensi ini berkaitan dengan sediaan bahan biosurfaktan sebagai inhibitor korosi dan proses produksi...
   Status: Diberi Paten
   Tanggal: 15 Agustus 2018
   No Permohonan: P00201806179
   Tanggal: 21 Agustus 2022
   Id Sertifikat: IDP000082626
   Status: pemeliharaan
   Inventor: Prof. Dr. Rukman Hertadi S.Si., dkk
   Fakultas: FMIPA
   Pekerjaan Inventor: Dosen
   Nama Instansi Inventor: Institut Teknologi Bandung
   Mitra Kepemilikan: Institut Teknologi Bandung

5. **Compo Solver Version 1.0**
   Id: 72
   Id Ki: 1461
   Jenis: Hak Cipta
   Abstrak: Compo Solver Version 1.0 merupakan perangkat lunak berbasis web (web-based software) yang dikembangk...
   Tkt: -
   Status: Tersertifikasi
   Tanggal: 13 Desember 2022
   No Permohonan: EC002022104716
   Tanggal: 13 Desember 2022
   Id Sertifikat: 000420460
   Status: penerbitan_sertifikat
   Inventor: Darmadi (DITSP - Tenaga Kependidikan - 196809162014091002), dkk
   Fakultas: DITSP, FTTM, STEI, FMIPA, FTTM, FTTM
   Pekerjaan Inventor: Tenaga Kependidikan, Alumni, Alumni, Alumni, Dosen, Dosen, Mahasiswa, Dosen, Dosen
   Nama Instansi Inventor: Institut Teknologi Bandung, Institut Teknologi Bandung, Institut Teknologi Bandung, Institut Teknolo...
   Mitra Kepemilikan: Institut Teknologi Bandung

6. **SEDIAAN BAHAN CAIRAN ION 1-ETIL-3-METILIMIDAZOLIUM TETRAFLUOROBORAT YANG MENGANDUNG ION LITIUM SEBAGAI PEMLASTIS DAN SUMBER ION LITIUM PADA PEMBUATAN MEMBRAN POLIMER ELEKTROLIT SEL BATERAI ION LITIUM DAN METODE PEMBUATANNYA**
   Id: 74
   Id Ki: 1653
   Jenis: Paten
   Abstrak: Invensi ini berkaitan dengan sediaan bahan cairan ion 1-etil-3-metilimidazolium tetrafluoroborat yan...
   Status: Diberi Paten
   Tanggal: 27 Maret 2019
   No Permohonan: P00201902191
   Tanggal: 22 Februari 2023
   Id Sertifikat: IDP000085831
   Status: pemeliharaan
   Inventor: Prof. Dr. I Made Arcana M.S. (FMIPA - Dosen - 196408251988101001), dkk
   Fakultas: FMIPA, SITH, FMIPA
   Pekerjaan Inventor: Dosen, Alumni, Dosen
   Nama Instansi Inventor: Institut Teknologi Bandung, Institut Teknologi Bandung, Institut Teknologi Bandung
   Mitra Kepemilikan: Institut Teknologi Bandung

7. **MASKER FILTER UDARA DARI BAHAN LIMBAH STYROFOAM**
   Id: 83
   Id Ki: 566
   Jenis: Paten
   Abstrak: Pada invensi ini dilaporkan mengenai metode sintesis nanoserat dari limbah styrofoam atau dikenal de...
   Status: Ditolak
   Tanggal: 26 September 2018
   No Permohonan: P00201807581
   Status: pengumuman_keputusan
   Inventor: Prof. Dr. Eng. Khairurrijal M.Si. (FMIPA - Dosen - 196502161991031002), dkk
   Fakultas: FMIPA, FMIPA, FMIPA, FMIPA
   Pekerjaan Inventor: Dosen, Alumni, Alumni, Dosen
   Nama Instansi Inventor: Institut Teknologi Bandung, Institut Teknologi Bandung, Institut Teknologi Bandung, Institut Teknolo...
   Mitra Kepemilikan: Institut Teknologi Bandung

8. **PROSES PEMBUATAN HESPERETIN DARI SENYAWA ORGANIK**
   Id: 84
   Id Ki: 113
   Jenis: Paten
   Abstrak: Invensi ini berhubungan dengan proses pembuatan hesperetin dari senyawa organik yang efisien melalui...
   Status: Ajuan Paten
   Tanggal: 26 September 2023
   No Permohonan: S00202309530
   Status: pemeriksaan_substantif
   Inventor: Anita Alni Ph.D. (FMIPA - Dosen - 198301052012122003), dkk
   Fakultas: FMIPA, FMIPA
   Pekerjaan Inventor: Dosen, Dosen
   Nama Instansi Inventor: Institut Teknologi Bandung, Institut Teknologi Bandung
   Mitra Kepemilikan: Institut Teknologi Bandung

9. **ALAT PENGONTROL IRIGASI MENGGUNAKAN TENAGA SURYA BERBASIS IOT**
   Id: 94
   Id Ki: 923
   Jenis: Paten
   Abstrak: Invensi ini berkaitan dengan produk berupa sediaan alat kontrol irigasi pertanian menggunakan tenaga...
   Status: Ajuan Paten
   Tanggal: 11 Desember 2024
   No Permohonan: S00202414911
   Status: pemeriksaan_substantif
   Inventor: Drs. Maman Budiman M.Eng., dkk
   Fakultas: FMIPA, FMIPA, FMIPA, FMIPA
   Pekerjaan Inventor: Dosen, Dosen, Alumni, Alumni
   Nama Instansi Inventor: Institut Teknologi Bandung, Institut Teknologi Bandung, Institut Teknologi Bandung, Institut Teknolo...
   Mitra Kepemilikan: Institut Teknologi Bandung

10. **Sistem Kontrol Volume Cairan Untuk Atomizer**
   Id: 122
   Id Ki: 651
   Jenis: Paten
   Abstrak: Invensi ini adalah tentang sistem kontrol volume cairan di dalam atomizer. Sistem kontrol yang diban...
   Status: Paten Ditarik Kembali
   Tanggal: 26 Juli 2018
   No Permohonan: P00201805604
   Status: perlindungan_berakhir
   Inventor: Dr. Dian Ahmad Hapidin S.Si., dkk
   Fakultas: FMIPA, FMIPA, FMIPA
   Pekerjaan Inventor: Dosen, Dosen, Alumni, Dosen
   Nama Instansi Inventor: Institut Teknologi Bandung, Institut Teknologi Bandung, Institut Teknologi Bandung, Institut Teknolo...
   Mitra Kepemilikan: Institut Teknologi Bandung

Masih ada 132 data lagi. Ketik "lanjut" untuk melihat berikutnya.
*Waktu: 7125ms*

### 3. Sama seperti sebelumnya tapi tahun 2020
**Jawaban:**
Menampilkan 1-10 dari 10 data:

1. **Perangkat Pengukuran Tomografi Induced Polarization Resistivity Multichannel dengan Multi Array Electrode Potensial dan Electrode yang saling terpisah**
   Id: 22
   Id Ki: 426
   Jenis: Paten
   Abstrak: -...
   Status: Diberi Paten
   Tanggal: 8 Oktober 2020
   No Permohonan: P00202007330
   Tanggal: 14 Januari 2024
   Id Sertifikat: IDP000091612
   Status: pemeliharaan
   Inventor: Prof. Dr. Eng. R. Bagus Endar Bachtiar N. (FMIPA - Dosen - 196803271994021001)
   Fakultas: FMIPA
   Pekerjaan Inventor: Dosen
   Nama Instansi Inventor: Institut Teknologi Bandung
   Mitra Kepemilikan: Institut Teknologi Bandung

2. **MEMBRAN POLIMER ELEKTROLIT DARI KARBOKSIMETIL SELULOSA KULIT BUAH KAKAO UNTUK SEL BATERAI ION LITIUM DAN METODE PEMBUATANNYA**
   Id: 123
   Id Ki: 285
   Jenis: Paten
   Abstrak: Invensi ini berkaitan dengan membran polimer elektrolit dan metoda pembuatannya yang disiapkan dari ...
   Status: Ajuan Paten
   Tanggal: 5 Agustus 2020
   No Permohonan: P00202005723
   Status: perbaikan_substantif_diterima
   Inventor: Prof. Dr. I Made Arcana M.S. (FMIPA - Dosen - 196408251988101001)
   Fakultas: FMIPA
   Pekerjaan Inventor: Dosen
   Nama Instansi Inventor: Institut Teknologi Bandung
   Mitra Kepemilikan: Institut Teknologi Bandung

3. **MATERIAL SENSOR PENDETEKSI KONSENTRASI LIMBAH DETERJEN BERBAHAN DASAR KURKUMIN DAN METODE PEMBUATANNYA**
   Id: 271
   Id Ki: 493
   Jenis: Paten
   Abstrak: Invensi ini berkaitan dengan suatu material sensor pendeteksi konsentrasi limbah deterjen dan metode...
   Status: Ajuan Paten
   Tanggal: 10 November 2020
   No Permohonan: P00202008406
   Status: pemeriksaan_substantif
   Inventor: Anna Niska Fauza (FTMD - Alumni - 23718006), dkk
   Fakultas: FTMD, FTI, FMIPA, FTMD, FTMD, FTMD, FTMD
   Pekerjaan Inventor: Alumni, Dosen, Guru Besar, Alumni, Alumni, Dosen, Dosen
   Nama Instansi Inventor: Institut Teknologi Bandung, Institut Teknologi Bandung, Institut Teknologi Bandung, Institut Teknolo...
   Mitra Kepemilikan: Institut Teknologi Bandung

4. **SEDIAAN BAHAN BIONANOFLUIDA UNTUK DIAPLIKASIKAN PADA ENHANCED OIL RECOVERY (EOR) DAN METODE PRODUKSINYA**
   Id: 288
   Id Ki: 366
   Jenis: Paten
   Abstrak: -...
   Status: Ajuan Paten
   Tanggal: 15 Desember 2020
   No Permohonan: P00202009815
   Status: pemeriksaan_formalitas
   Inventor: Yani Faozani, dkk
   Fakultas: FMIPA, FMIPA, FMIPA
   Pekerjaan Inventor: Mahasiswa, Dosen, Dosen
   Nama Instansi Inventor: Pusat Penelitian dan Pengembangan Teknologi Minyak dan Gas Bumi, Institut Teknologi Bandung, Institu...
   Mitra Kepemilikan: Institut Teknologi Bandung

5. **Shallow Flow 1D, version 1.0**
   Id: 298
   Id Ki: 1146
   Jenis: Hak Cipta
   Abstrak: SF1atau Shallow Flow1 Dimension(1D) versi 1.0 merupakan aplikasi berbasis Python untuk memprediksi f...
   Tkt: -
   Status: Tersertifikasi
   Tanggal: 4 Agustus 2020
   No Permohonan: EC00202024759
   Tanggal: 15 Juli 2020
   Id Sertifikat: 000196725
   Status: penerbitan_sertifikat
   Inventor: Dede Tarwidi (Universitas Telkom - Dosen - 14840039), dkk
   Fakultas: FMIPA
   Pekerjaan Inventor: Dosen, Dosen, Dosen
   Nama Instansi Inventor: Universitas Telkom, Universitas Telkom, Institut Teknologi Bandung
   Mitra Kepemilikan: Institut Teknologi Bandung

6. **MEMBRAN POLIMER ELEKTROLIT DARI SELULOSA NANO KRISTALIN BONGKOL JAGUNG UNTUK SEL BATERAI ION LITIUM DAN METODE PEMBUATANNYA**
   Id: 386
   Id Ki: 615
   Jenis: Paten
   Abstrak: Invensi ini berkaitan dengan sediaan bahan membran komposit sebagai elektrolit padatan dan metoda pe...
   Status: Diberi Paten
   Tanggal: 6 Juli 2020
   No Permohonan: P00202004955
   Tanggal: 20 November 2023
   Id Sertifikat: IDP000090669
   Status: pemeliharaan
   Inventor: Prof. Dr. I Made Arcana M.S. (FMIPA - Dosen - 196408251988101001), dkk
   Fakultas: FMIPA, FMIPA
   Pekerjaan Inventor: Dosen, Alumni
   Nama Instansi Inventor: Institut Teknologi Bandung, Institut Teknologi Bandung
   Mitra Kepemilikan: Institut Teknologi Bandung

7. **PLASMID REKOMBINAN YANG BERFUNGSI SEBAGAI VEKTOR UNTUK MENYISIPKAN GEN PENGKODE PROTEIN PERMUKAAN S SARS-COV-2 SEBAGAI KOMPONEN PADA PEMBUATAN KANDIDAT VAKSIN COVID-19 BERBASIS ADENOVIRUS**
   Id: 404
   Id Ki: 421
   Jenis: Paten
   Abstrak: Invensi ini berkaitan dengan konstruksi vektor rekombinan untuk menyisipkan gen pengkode protein per...
   Status: Diberi Paten
   Tanggal: 2 September 2020
   No Permohonan: P00202006412
   Tanggal: 20 Maret 2025
   Id Sertifikat: IDP000098319
   Status: pemeliharaan
   Inventor: (Alm) Prof. Debbie S. Retnoningrum, dkk
   Fakultas: SF, SITH, SITH, SF, FMIPA, SF
   Pekerjaan Inventor: Dosen, Dosen, Dosen, Alumni, Dosen, Dosen
   Nama Instansi Inventor: Institut Teknologi Bandung, Institut Teknologi Bandung, Institut Teknologi Bandung, Institut Teknolo...
   Mitra Kepemilikan: Institut Teknologi Bandung

8. **PertafloSIM Version 1**
   Id: 554
   Id Ki: 1199
   Jenis: Hak Cipta
   Abstrak: PertafloSIM Version 1 merupakan software untuk simulasi aliran minyak dan gas di jaringan pipa permu...
   Tkt: -
   Status: Tersertifikasi
   Tanggal: 28 Oktober 2020
   No Permohonan: EC00202045118
   Tanggal: 15 April 2019
   Id Sertifikat: 000234169
   Status: penerbitan_sertifikat
   Inventor: Andrey Abymanew (FTTM - Alumni - 12214046), dkk
   Fakultas: FTTM, FTTM, FMIPA, DITSP, FTTM, STEI, FTTM, STEI, FMIPA, FMIPA, FMIPA, FMIPA, FMIPA, FMIPA, FTTM, FTI, FTI, FMIPA
   Pekerjaan Inventor: Alumni, Alumni, Dosen, Tenaga Kependidikan, Dosen, Alumni, Alumni, Alumni, Dosen, Alumni, Alumni, Al...
   Nama Instansi Inventor: Institut Teknologi Bandung, Institut Teknologi Bandung, Institut Teknologi Bandung, Institut Teknolo...
   Mitra Kepemilikan: Institut Teknologi Bandung

9. **MATERIAL SENSOR UNTUK MENDETEKSI GAS AMONIA BERBAHAN KURKUMIN DAN METODE PEMBUATANNYA**
   Id: 555
   Id Ki: 486
   Jenis: Paten
   Abstrak: Invensi ini berkaitan dengan suatu material sensor pendeteksi gas amonia dan metode pembuatannya. Le...
   Status: Ajuan Paten
   Tanggal: 18 November 2020
   No Permohonan: P00202008684
   Status: pemeriksaan_substantif
   Inventor: Anna Niska Fauza (FTMD - Alumni - 23718006), dkk
   Fakultas: FTMD, FTI, FMIPA, FTMD, FTMD, FTMD, FTMD
   Pekerjaan Inventor: Alumni, Dosen, Guru Besar, Alumni, Alumni, Dosen, Dosen
   Nama Instansi Inventor: Institut Teknologi Bandung, Institut Teknologi Bandung, Institut Teknologi Bandung, Institut Teknolo...
   Mitra Kepemilikan: Institut Teknologi Bandung

10. **METODE PEMBUATAN KARBOKSIMETIL SELULOSA DARI SELULOSA KULIT BUAH KAKAO UNTUK BAHAN DASAR PEMBUATAN POLIMER ELEKTROLIT BATERAI ION LITIUM**
   Id: 595
   Id Ki: 379
   Jenis: Paten
   Abstrak: Invensi ini berkaitan dengan suatu sediaan karboksimetil selulosa sebagai bahan dasar pembuatan poli...
   Status: Diberi Paten
   Tanggal: 28 Juli 2020
   No Permohonan: P00202005529
   Tanggal: 22 Januari 2024
   Id Sertifikat: IDP000091763
   Status: pemeliharaan
   Inventor: Dr. Sun Theo Constan Lotebulo Ndruru, dkk
   Fakultas: FMIPA, FMIPA
   Pekerjaan Inventor: Dosen, Dosen
   Nama Instansi Inventor: Badan Riset dan Inovasi Nasional (BRIN), Institut Teknologi Bandung, Institut Teknologi Bandung
   Mitra Kepemilikan: Institut Teknologi Bandung
*Waktu: 2675ms*

### 4. Siapa inventornya yang paling produktif?
**Jawaban:**
Daftar inventor (1-7 dari 1):

1. Anna Niska Fauza (2)
2. Dr. Steven S.T, M.T. (2)
3. Dr. rer. nat. Mardiyati S.Si., M.T. (2)
4. Ir. Ahmad Nuruddin M.Sc., Ph.D. (2)
5. Onny Aulia Rachman (2)
6. Prof. Rachmat Hidayat, S.Si., M.Eng., Ph.D. (2)
7. Silvia Mar'atus Shoimah, S.T., M.T. (2)
*Waktu: 2475ms*

### 5. Terus kalau dibandingkan sama tahun lalu gimana?
**Jawaban:**
Menampilkan 1-10 dari 39 data:

1.    Inventor: (Alm) Prof. Debbie S. Retnoningrum, dkk
   Jumlah Invensi: 1
   Tahun: 2020

2.    Inventor: Andrey Abymanew (FTTM - Alumni - 12214046), dkk
   Jumlah Invensi: 1
   Tahun: 2020

3.    Inventor: Anna Niska Fauza (FTMD - Alumni - 23718006), dkk
   Jumlah Invensi: 2
   Tahun: 2020

4.    Inventor: Dede Tarwidi (Universitas Telkom - Dosen - 14840039), dkk
   Jumlah Invensi: 1
   Tahun: 2020

5.    Inventor: Dr. Deana Wahyuningrum S.Si., dkk
   Jumlah Invensi: 1
   Tahun: 2019

6.    Inventor: Dr. Dian Ahmad Hapidin S.Si., dkk
   Jumlah Invensi: 1
   Tahun: 2019

7.    Inventor: Dr. Eng. Yessi Permana (FMIPA - Dosen - 197511292008121002), dkk
   Jumlah Invensi: 1
   Tahun: 2020

8.    Inventor: Dr. Eng. Yessi Permana (FMIPA - Dosen - 197511292008121002), dkk
   Jumlah Invensi: 1
   Tahun: 2020

9.    Inventor: Dr. Eng. Yessi Permana (FMIPA - Dosen - 197511292008121002), dkk
   Jumlah Invensi: 1
   Tahun: 2020

10.    Inventor: Dr. Hendro, dkk
   Jumlah Invensi: 1
   Tahun: 2019

Masih ada 29 data lagi. Ketik "lanjut" untuk melihat berikutnya.
*Waktu: 2535ms*

### 6. Yang belum selesai itu berapa?
**Jawaban:**
Menampilkan 1-10 dari 847 data:

1. **TURBIN ANGIN KECEPATAN RENDAH DENGAN BILAH YANG MEMILIKI PANGKAL MELEKUK**
   Id: 2
   Id Ki: 122
   Jenis: Paten
   Abstrak: -...
   Status: Ajuan Paten
   Tanggal: 24 Oktober 2024
   No Permohonan: S00202409617
   Status: masa_pengumuman
   Inventor: Dr. Ir. Eko Mursito Budi M.T. (FTI - Dosen - 196710061997021001)
   Fakultas: FTI
   Pekerjaan Inventor: Dosen
   Nama Instansi Inventor: Institut Teknologi Bandung
   Mitra Kepemilikan: Institut Teknologi Bandung

2. **Konverter Mikro Efisiensi Tinggi Untuk Pembangkit Listrik Tenaga Surya**
   Id: 4
   Id Ki: 690
   Jenis: Paten
   Abstrak: Invensi ini berkaitan dengan peralatan yang dapat nengkonversi tegangan DC di sisi masukan menjadi t...
   Status: Diberi Paten
   Tanggal: 29 November 2018
   No Permohonan: P00201809782
   Tanggal: 23 Desember 2022
   Id Sertifikat: IDP000084749
   Status: pemeliharaan
   Inventor: (alm) Pekik Argo Dahono (Institut Teknologi Bandung - Dosen - 196204081987031004)
   Pekerjaan Inventor: Dosen
   Nama Instansi Inventor: Institut Teknologi Bandung
   Mitra Kepemilikan: Institut Teknologi Bandung

3. **Motif Batik Flowermoon series Ayam Jago Fauna Mataram Kuno**
   Id: 5
   Id Ki: 1539
   Jenis: Desain Industri
   Abstrak: Riset PPMU Lasem 2021 memberi perhatian besar pada kualitas hidup penghuni Lasem (artisan batik, pen...
   Tkt: -
   Status: Diberi Desain Industri
   Tanggal: 27 September 2022
   No Permohonan: A00202203374
   Tanggal: 7 Oktober 2024
   Id Sertifikat: IDD000071786
   Status: penerbitan_sertifikat
   Inventor: Dr. Ing. Erika Yuni Astuti, dkk
   Pekerjaan Inventor: Dosen, Alumni, Alumni
   Nama Instansi Inventor: Institut Teknologi Bandung, Institut Teknologi Bandung, Institut Teknologi Bandung
   Mitra Kepemilikan: Institut Teknologi Bandung

4. **SISTEM PENGOLAHAN LIMBAH PADAT TERSUSPENSI TOTAL (TSS) DAN LIMBAH AIR ASAM TAMBANG (AAT) PADA INDUSTRI PERTAMBANGAN**
   Id: 6
   Id Ki: 965
   Jenis: Paten
   Abstrak: Invensi ini berhubungan dengan suatu sistem pengolahan limbah padat tersuspensi total (TSS) dan limb...
   Status: Ajuan Paten
   Tanggal: 6 Oktober 2023
   No Permohonan: P00202310055
   Status: masa_pengumuman
   Inventor: Prof. Ir. Siti Khodijah M.T, dkk
   Fakultas: FTTM, FTTM
   Pekerjaan Inventor: Dosen, Alumni
   Nama Instansi Inventor: Institut Teknologi Bandung, Institut Teknologi Bandung
   Mitra Kepemilikan: Institut Teknologi Bandung

5. **Sepeda Energi**
   Id: 8
   Id Ki: 1029
   Jenis: Desain Industri
   Abstrak: Sebagai alat transportasi berbentuk sepeda...
   Tkt: -
   Status: Diberi Desain Industri
   Tanggal: 24 Mei 2022
   No Permohonan: A00202101405
   Tanggal: 28 Februari 2022
   Id Sertifikat: IDD0000061657
   Status: penerbitan_sertifikat
   Inventor: Bismo Jelantik Joyodiharjo S.Sn., dkk
   Fakultas: FSRD
   Pekerjaan Inventor: Dosen
   Nama Instansi Inventor: Institut Teknologi Bandung
   Mitra Kepemilikan: Institut Teknologi Bandung

6. **METODE ANALISIS LOGAM TEMBAGA DALAM AIR MINUM MENGGUNAKAN REAGEN SENYAWA TURUNAN PORFIRIN**
   Id: 9
   Id Ki: 434
   Jenis: Paten
   Abstrak: -...
   Status: Ajuan Paten
   Tanggal: 4 Agustus 2020
   No Permohonan: P00202005685
   Status: pemeriksaan_substantif
   Inventor: Dr.apt. Rimadani Pratiwi, dkk
   Fakultas: SF, SF
   Pekerjaan Inventor: Dosen, Guru Besar, Dosen
   Nama Instansi Inventor: Universitas Padjadjaran, Institut Teknologi Bandung, Institut Teknologi Bandung
   Mitra Kepemilikan: Institut Teknologi Bandung

7. **METODE PELEBURAN BIJIH NIKEL LATERIT DENGAN TEKNOLOGI ROTARY KILN – ELECTRIC FURNACE MENGGUNAKAN GAS HIDROGEN SEBAGAI BAHAN BAKAR DI ROTARY DRYER SERTA BAHAN BAKAR DAN REDUKTOR DI ROTARY KILN**
   Id: 10
   Id Ki: 70
   Jenis: Paten
   Abstrak: Gas hidrogen digunakan sebagai bahan bakar dan reduktor pada teknologi rotary kiln – electric furnac...
   Status: Ajuan Paten
   Tanggal: 14 Agustus 2023
   No Permohonan: P00202307464
   Status: pemeriksaan_substantif
   Inventor: Taufiq Hidayat S.T, dkk
   Fakultas: FTTM
   Pekerjaan Inventor: Dosen
   Nama Instansi Inventor: Institut Teknologi Bandung
   Mitra Kepemilikan: Institut Teknologi Bandung

8. **ALAT UNTUK MENYARING DAN MENGUPAS BERBAGAI UKURAN BUAH KOPI YANG TERINTEGRASI**
   Id: 15
   Id Ki: 279
   Jenis: Paten
   Abstrak: Invensi ini berkaitan dengan suatu alat untuk menyortir ukuran buah kopi dan mengupas kulit kopi. Le...
   Status: Paten Ditarik Kembali
   Tanggal: 4 November 2024
   No Permohonan: P00201909677
   Status: perlindungan_berakhir
   Inventor: Fikri Barry Alfian (FTMD - Alumni - 23119006), dkk
   Fakultas: FTMD, FTMD, FTMD, SITH
   Pekerjaan Inventor: Alumni, Alumni, Alumni, Dosen
   Nama Instansi Inventor: Institut Teknologi Bandung, Institut Teknologi Bandung, Institut Teknologi Bandung, Institut Teknolo...
   Mitra Kepemilikan: Institut Teknologi Bandung

9. **ALAT SAMBUNGAN BAMBU BERBASIS TALI DENGAN TEKANAN RADIAL**
   Id: 16
   Id Ki: 1760
   Jenis: Paten
   Abstrak: Invensi ini berhubungan dengan sambungan bambu untuk struktur tarik, bentang lebar dan knock-down. P...
   Status: Diberi Paten
   Tanggal: 25 Agustus 2017
   No Permohonan: P00201705644
   Tanggal: 2 Januari 2024
   Id Sertifikat: IDP000091349
   Status: pemeliharaan
   Inventor: Dr.-Ing. Andry Widyowijatnoko S.T, dkk
   Fakultas: SAPPK
   Pekerjaan Inventor: Dosen
   Nama Instansi Inventor: Institut Teknologi Bandung
   Mitra Kepemilikan: Institut Teknologi Bandung

10. **METODE SINTESIS REAGEN SENYAWA TURUNAN PORFIRIN UNTUK ANALISIS LOGAM TEMBAGA DALAM AIR MINUM**
   Id: 17
   Id Ki: 1761
   Jenis: Paten
   Abstrak: Invensi ini berhubungan dengan suatu metode sintesis reagen senyawa turunan porfirin untuk analisis ...
   Status: Diberi Paten
   Tanggal: 14 Agustus 2017
   No Permohonan: P00201705335
   Tanggal: 16 November 2020
   Id Sertifikat: IDP000072784
   Status: pemeliharaan
   Inventor: Dr.apt. Rimadani Pratiwi, dkk
   Fakultas: SF, SF
   Pekerjaan Inventor: Dosen, Guru Besar, Dosen
   Nama Instansi Inventor: Universitas Padjadjaran, Institut Teknologi Bandung, Institut Teknologi Bandung
   Mitra Kepemilikan: Institut Teknologi Bandung

Masih ada 837 data lagi. Ketik "lanjut" untuk melihat berikutnya.
*Waktu: 7078ms*

### 7. Coba filter yang statusnya masih proses
**Jawaban:**
Maaf, tidak ditemukan data untuk "Coba filter yang statusnya masih proses".

Mungkin Anda ingin mencoba:
1. Filter data berdasarkan status selain proses
2. Cek data dengan tanggal tertentu
3. Lihat data yang belum disetujui
*Waktu: 9724ms*

### 8. Dari data tadi, siapa yang dari luar ITB?
**Jawaban:**
Menampilkan 1-9 dari 9 data:

1.    Inventor: Dr. Tati Kristianti (Institut Pendidikan Indonesia Garut - Dosen - 196507061991012001)
   Jumlah Invensi: 1
   Tahun: 2024

2.    Inventor: Supriyadi (Aware Creative -  - ), dkk
   Jumlah Invensi: 3
   Tahun: 2023

3.    Inventor: Ocktania Bunga Rosova	 (Konsultan Desain Industri. - Lainnya - )
   Jumlah Invensi: 1
   Tahun: 2023

4.    Inventor: ATMOKO PUTRA PRATAMA (- -  - )
   Jumlah Invensi: 1
   Tahun: 2019

5.    Inventor: Mochammad Nurcahyo (Lokapoin Indonesia -  - )
   Jumlah Invensi: 1
   Tahun: 2019

6.    Inventor: Firman Wahyudi (- -  - )
   Jumlah Invensi: 1
   Tahun: 2019

7.    Inventor: Kennedy Simanjuntak, dkk
   Jumlah Invensi: 1
   Tahun: 2018

8.    Inventor: Mustika Manis (PT MUSTIKA MANIS - Lainnya - .)
   Jumlah Invensi: 1
   Tahun: 2005

9.    Inventor: Sukirno, dkk
   Jumlah Invensi: 2
   Tahun: 2000
*Waktu: 4984ms*

### 9. Urutkan yang tadi dari terbaru
**Jawaban:**
Menampilkan 1-10 dari 12 data:

1. **Divsea**
   Id: 173
   Id Ki: 820
   Jenis: Merek
   Abstrak: Agen-agen, reagen-reagen kimia, bahan-bahan pengujian logam (assay), enzim-enzim, nucleotide, buffer...
   Tkt: -
   Status: Tersertifikasi
   Tanggal: 26 Agustus 2024
   No Permohonan: DID2024083359
   Tanggal: 18 Maret 2025
   Id Sertifikat: IDM001307007
   Status: penerbitan_sertifikat
   Inventor: Dr. Tati Kristianti (Institut Pendidikan Indonesia Garut - Dosen - 196507061991012001)
   Pekerjaan Inventor: Dosen
   Nama Instansi Inventor: Institut Pendidikan Indonesia Garut
   Mitra Kepemilikan: Institut Teknologi Bandung

2. **ROGA (Robot Gajah)**
   Id: 1044
   Id Ki: 866
   Jenis: Merek
   Abstrak: Robot Gajah...
   Tkt: -
   Status: Tersertifikasi
   Tanggal: 30 November 2023
   No Permohonan: DID2023113332
   Tanggal: 15 November 2024
   Id Sertifikat: IDM001235320
   Status: penerbitan_sertifikat
   Inventor: Supriyadi (Aware Creative -  - ), dkk
   Nama Instansi Inventor: Aware Creative, Aware Creative
   Mitra Kepemilikan: Institut Teknologi Bandung

3. **Roga (Robot Gajah)**
   Id: 71
   Id Ki: 1357
   Jenis: Hak Cipta
   Abstrak: ROGA merupakan maskot yang dirancang khusus untuk Institut teknologi Bandung. Nama ROGA diambil dari...
   Tkt: -
   Status: Tersertifikasi
   Tanggal: 21 November 2023
   No Permohonan: EC002023115318
   Tanggal: 4 Maret 2023
   Id Sertifikat: 000548273
   Status: penerbitan_sertifikat
   Inventor: Supriyadi (Aware Creative -  - ), dkk
   Nama Instansi Inventor: Aware Creative, Aware Creative
   Mitra Kepemilikan: Institut Teknologi Bandung

4. **MASKOT ROBOT GAJAH (ROGA)**
   Id: 1340
   Id Ki: 1615
   Jenis: Desain Industri
   Abstrak: ROGA merupakan maskot yang dirancang khusus untuk Institut teknologi Bandung. Nama ROGA diambil dari...
   Tkt: -
   Status: Diberi Desain Industri
   Tanggal: 21 November 2023
   No Permohonan: A00202305353
   Tanggal: 30 Desember 2024
   Id Sertifikat: IDD000073842
   Status: penerbitan_sertifikat
   Inventor: Supriyadi (Aware Creative -  - ), dkk
   Nama Instansi Inventor: Aware Creative, Aware Creative
   Mitra Kepemilikan: Institut Teknologi Bandung

5. **PERMAINAN EDUKASI**
   Id: 54
   Id Ki: 1600
   Jenis: Desain Industri
   Abstrak: Sebagai set permainan edukasi untuk membangun harga diri yang sehat. Set ini terdiri dari dua produk...
   Tkt: -
   Status: Diberi Desain Industri
   Tanggal: 24 September 2023
   No Permohonan: A00202304240
   Tanggal: 19 November 2024
   Id Sertifikat: IDD000072520
   Status: penerbitan_sertifikat
   Inventor: Ocktania Bunga Rosova	 (Konsultan Desain Industri. - Lainnya - )
   Pekerjaan Inventor: Lainnya
   Nama Instansi Inventor: Konsultan Desain Industri.
   Mitra Kepemilikan: Institut Teknologi Bandung

6. **ITB Innovation Park - 1**
   Id: 183
   Id Ki: 893
   Jenis: Merek
   Abstrak: Innovation = Inovasi, Park = Ruang Publik...
   Tkt: -
   Status: Tersertifikasi
   Tanggal: 18 Desember 2019
   No Permohonan: JID2019078521
   Tanggal: 25 Juni 2021
   Id Sertifikat: IDM000867288
   Status: penerbitan_sertifikat
   Inventor: ATMOKO PUTRA PRATAMA (- -  - )
   Nama Instansi Inventor: -
   Mitra Kepemilikan: Institut Teknologi Bandung

7. **ITB Innovation Park - 2**
   Id: 916
   Id Ki: 892
   Jenis: Merek
   Abstrak: Innovation = Inovasi, Park = Ruang Publik...
   Tkt: -
   Status: Tersertifikasi
   Tanggal: 18 Desember 2019
   No Permohonan: JID2019078555
   Tanggal: 25 Juni 2021
   Id Sertifikat: IDM000867331
   Status: penerbitan_sertifikat
   Inventor: Firman Wahyudi (- -  - )
   Nama Instansi Inventor: -
   Mitra Kepemilikan: Institut Teknologi Bandung

8. **Lokapoin + Logo**
   Id: 897
   Id Ki: 885
   Jenis: Merek
   Abstrak: -...
   Tkt: -
   Status: Tersertifikasi
   Tanggal: 25 Juli 2019
   No Permohonan: J002019039729
   Tanggal: 4 Februari 2022
   Id Sertifikat: IDM000946176
   Status: penerbitan_sertifikat
   Inventor: Mochammad Nurcahyo (Lokapoin Indonesia -  - )
   Nama Instansi Inventor: Lokapoin Indonesia
   Mitra Kepemilikan: Institut Teknologi Bandung

9. **Metode Pembuatan Produk Pupuk Hayati Sebagai Pembenah Tanah, Peningkat Pertumbuhan Tanaman dan Biopestisida dari Hasil Fermentasi Limbah Organik Menggunakan Maggot Lalat Black Soldier (Hermetia Illucens) Yang Memakan Limbah Organik Tersebut.**
   Id: 1278
   Id Ki: 674
   Jenis: Paten
   Abstrak: Invensi ini berupa metode pembuatan produk pupuk hayati yang dapat berfungsi sebagai pembenah tanah ...
   Status: Paten Ditarik Kembali
   Tanggal: 4 Oktober 2018
   No Permohonan: P00201807882
   Status: perlindungan_berakhir
   Inventor: Kennedy Simanjuntak, dkk
   Nama Instansi Inventor: Badan Perencanaan Pembangunan Nasional
   Mitra Kepemilikan: Institut Teknologi Bandung

10. **" YOSAN "**
   Id: 1221
   Id Ki: 1388
   Jenis: Hak Cipta
   Abstrak: --...
   Tkt: -
   Status: Tersertifikasi
   Tanggal: 15 Juni 2005
   No Permohonan: C00200501601
   Tanggal: 15 Juni 2005
   Id Sertifikat: C00200501601
   Status: penerbitan_sertifikat
   Inventor: Mustika Manis (PT MUSTIKA MANIS - Lainnya - .)
   Pekerjaan Inventor: Lainnya
   Nama Instansi Inventor: PT MUSTIKA MANIS
   Mitra Kepemilikan: Institut Teknologi Bandung

Masih ada 2 data lagi. Ketik "lanjut" untuk melihat berikutnya.
*Waktu: 7698ms*

### 10. Yang mitra kepemilikannya bukan ITB ada berapa?
**Jawaban:**
0
*Waktu: 7036ms*


## KATEGORI 3: PERTANYAAN JEBAKAN / EDGE CASE
### 1. Tampilkan semua KI
**Jawaban:**
0
*Waktu: 2250ms*

### 2. KI nomor 9999 detail lengkapnya
**Jawaban:**
Maaf, tidak ditemukan data untuk "KI nomor 9999 detail lengkapnya".

Mungkin Anda ingin mencoba:
1. Apa itu KI dan apa fungsinya
2. Bagaimana cara mencari data KI di database
3. Apa alternatif lain untuk mencari informasi tentang KI
*Waktu: 21923ms*

### 3. Inventor bernama "A"
**Jawaban:**
Menampilkan 1-10 dari 1.307 data:

1. **Geolini Converter**
   Id: 1
   Id Ki: 1281
   Jenis: Hak Cipta
   Abstrak: Geolini Converter Software merupakan perangkat lunak yang digunakan untuk mengkonversi data rekaman ...
   Tkt: -
   Status: Tersertifikasi
   Tanggal: 4 April 2023
   No Permohonan: EC00202326013
   Tanggal: 30 Maret 2023
   Id Sertifikat: 000458935
   Status: penerbitan_sertifikat
   Inventor: Gunta Akhiri (PT AERING -  - ), dkk
   Fakultas: FTTM, FTTM
   Pekerjaan Inventor: Dosen, Dosen
   Nama Instansi Inventor: PT AERING, PT Geo Stroom, Institut Teknologi Bandung, Institut Teknologi Bandung
   Mitra Kepemilikan: Institut Teknologi Bandung

2. **Program Prediksi dan Optimisasi Kinerja Injeksi Air pada Lapangan Minyak - CRM Data Driven Model**
   Id: 3
   Id Ki: 1420
   Jenis: Hak Cipta
   Abstrak: Program Komputer yang telah diciptakan dapat digunakan untuk memprediksi kinerja produksi sumur (laj...
   Tkt: -
   Status: Tersertifikasi
   Tanggal: 12 Agustus 2022
   No Permohonan: EC00202263757
   Tanggal: 12 Agustus 2022
   Id Sertifikat: 000379490
   Status: penerbitan_sertifikat
   Inventor: Prof. Ir. Taufan Marhaendrajana M.Sc., dkk
   Fakultas: FTTM, FTTM
   Pekerjaan Inventor: Dosen, Dosen, Lainnya
   Nama Instansi Inventor: Institut Teknologi Bandung, Institut Teknologi Bandung, Institut Teknologi Bandung
   Mitra Kepemilikan: Institut Teknologi Bandung

3. **Konverter Mikro Efisiensi Tinggi Untuk Pembangkit Listrik Tenaga Surya**
   Id: 4
   Id Ki: 690
   Jenis: Paten
   Abstrak: Invensi ini berkaitan dengan peralatan yang dapat nengkonversi tegangan DC di sisi masukan menjadi t...
   Status: Diberi Paten
   Tanggal: 29 November 2018
   No Permohonan: P00201809782
   Tanggal: 23 Desember 2022
   Id Sertifikat: IDP000084749
   Status: pemeliharaan
   Inventor: (alm) Pekik Argo Dahono (Institut Teknologi Bandung - Dosen - 196204081987031004)
   Pekerjaan Inventor: Dosen
   Nama Instansi Inventor: Institut Teknologi Bandung
   Mitra Kepemilikan: Institut Teknologi Bandung

4. **Motif Batik Flowermoon series Ayam Jago Fauna Mataram Kuno**
   Id: 5
   Id Ki: 1539
   Jenis: Desain Industri
   Abstrak: Riset PPMU Lasem 2021 memberi perhatian besar pada kualitas hidup penghuni Lasem (artisan batik, pen...
   Tkt: -
   Status: Diberi Desain Industri
   Tanggal: 27 September 2022
   No Permohonan: A00202203374
   Tanggal: 7 Oktober 2024
   Id Sertifikat: IDD000071786
   Status: penerbitan_sertifikat
   Inventor: Dr. Ing. Erika Yuni Astuti, dkk
   Pekerjaan Inventor: Dosen, Alumni, Alumni
   Nama Instansi Inventor: Institut Teknologi Bandung, Institut Teknologi Bandung, Institut Teknologi Bandung
   Mitra Kepemilikan: Institut Teknologi Bandung

5. **SISTEM PENGOLAHAN LIMBAH PADAT TERSUSPENSI TOTAL (TSS) DAN LIMBAH AIR ASAM TAMBANG (AAT) PADA INDUSTRI PERTAMBANGAN**
   Id: 6
   Id Ki: 965
   Jenis: Paten
   Abstrak: Invensi ini berhubungan dengan suatu sistem pengolahan limbah padat tersuspensi total (TSS) dan limb...
   Status: Ajuan Paten
   Tanggal: 6 Oktober 2023
   No Permohonan: P00202310055
   Status: masa_pengumuman
   Inventor: Prof. Ir. Siti Khodijah M.T, dkk
   Fakultas: FTTM, FTTM
   Pekerjaan Inventor: Dosen, Alumni
   Nama Instansi Inventor: Institut Teknologi Bandung, Institut Teknologi Bandung
   Mitra Kepemilikan: Institut Teknologi Bandung

6. **Eksperimen dalam Fisika Bangunan**
   Id: 7
   Id Ki: 1219
   Jenis: Hak Cipta
   Abstrak: Pada konsep desain dan operasional bangunan saat ini, telah diketahui pentingnya pemahaman atas fisi...
   Tkt: -
   Status: Tersertifikasi
   Tanggal: 28 April 2021
   No Permohonan: EC00202121683
   Tanggal: 20 November 2019
   Id Sertifikat: 000249373
   Status: penerbitan_sertifikat
   Inventor: Anugrah Sabdono Sudarsono, dkk
   Fakultas: FTI, FTI, FTI
   Pekerjaan Inventor: Dosen, Dosen, Dosen, Dosen, Alumni, Alumni, Dosen, Dosen, Dosen, Alumni
   Nama Instansi Inventor: Institut Teknologi Bandung, Institut Teknologi Bandung, Institut Teknologi Bandung, Institut Teknolo...
   Mitra Kepemilikan: Institut Teknologi Bandung

7. **Sepeda Energi**
   Id: 8
   Id Ki: 1029
   Jenis: Desain Industri
   Abstrak: Sebagai alat transportasi berbentuk sepeda...
   Tkt: -
   Status: Diberi Desain Industri
   Tanggal: 24 Mei 2022
   No Permohonan: A00202101405
   Tanggal: 28 Februari 2022
   Id Sertifikat: IDD0000061657
   Status: penerbitan_sertifikat
   Inventor: Bismo Jelantik Joyodiharjo S.Sn., dkk
   Fakultas: FSRD
   Pekerjaan Inventor: Dosen
   Nama Instansi Inventor: Institut Teknologi Bandung
   Mitra Kepemilikan: Institut Teknologi Bandung

8. **METODE ANALISIS LOGAM TEMBAGA DALAM AIR MINUM MENGGUNAKAN REAGEN SENYAWA TURUNAN PORFIRIN**
   Id: 9
   Id Ki: 434
   Jenis: Paten
   Abstrak: -...
   Status: Ajuan Paten
   Tanggal: 4 Agustus 2020
   No Permohonan: P00202005685
   Status: pemeriksaan_substantif
   Inventor: Dr.apt. Rimadani Pratiwi, dkk
   Fakultas: SF, SF
   Pekerjaan Inventor: Dosen, Guru Besar, Dosen
   Nama Instansi Inventor: Universitas Padjadjaran, Institut Teknologi Bandung, Institut Teknologi Bandung
   Mitra Kepemilikan: Institut Teknologi Bandung

9. **METODE PELEBURAN BIJIH NIKEL LATERIT DENGAN TEKNOLOGI ROTARY KILN – ELECTRIC FURNACE MENGGUNAKAN GAS HIDROGEN SEBAGAI BAHAN BAKAR DI ROTARY DRYER SERTA BAHAN BAKAR DAN REDUKTOR DI ROTARY KILN**
   Id: 10
   Id Ki: 70
   Jenis: Paten
   Abstrak: Gas hidrogen digunakan sebagai bahan bakar dan reduktor pada teknologi rotary kiln – electric furnac...
   Status: Ajuan Paten
   Tanggal: 14 Agustus 2023
   No Permohonan: P00202307464
   Status: pemeriksaan_substantif
   Inventor: Taufiq Hidayat S.T, dkk
   Fakultas: FTTM
   Pekerjaan Inventor: Dosen
   Nama Instansi Inventor: Institut Teknologi Bandung
   Mitra Kepemilikan: Institut Teknologi Bandung

10. **" PROGRAM KESIAPAN SEKOLAH TERHADAP BAHAYA GEMPA : BUKU PENGAYAAN GURU "**
   Id: 11
   Id Ki: 1387
   Jenis: Hak Cipta
   Abstrak: --...
   Tkt: -
   Status: Tersertifikasi
   Tanggal: 21 April 2005
   No Permohonan: C00200501012
   Tanggal: 21 April 2005
   Id Sertifikat: C00200501012
   Status: penerbitan_sertifikat
   Inventor: Ir. Harkunti Pertiwi Rahayu, dkk
   Pekerjaan Inventor: Dosen
   Nama Instansi Inventor: Institut Teknologi Bandung
   Mitra Kepemilikan: Institut Teknologi Bandung

Masih ada 1.297 data lagi. Ketik "lanjut" untuk melihat berikutnya.
*Waktu: 4667ms*

### 4. Tampilkan KI dari tahun 1800
**Jawaban:**
Maaf, tidak ditemukan data untuk "Tampilkan KI dari tahun 1800".

Mungkin Anda ingin mencoba:
1. Data KI dari tahun 1900
2. Data KI dari tahun 1950
3. Data KI dari tahun 2000
*Waktu: 9672ms*

### 5. Berapa KI yang inventor-nya kosong atau null?
**Jawaban:**
[object Object]
*Waktu: 4624ms*

### 6. Cari KI dengan judul "asdfjklqwerty"
**Jawaban:**
Maaf, tidak ditemukan data untuk "Cari KI dengan judul "asdfjklqwerty"".

Mungkin Anda ingin mencoba:
1. Cari KI dengan judul yang mirip
2. Cari KI yang berhubungan dengan topik tertentu
3. Cari KI yang diterbitkan pada tahun tertentu
*Waktu: 9760ms*

### 7. Tampilkan KI tahun 2024 bulan 13
**Jawaban:**
Maaf, tidak ditemukan data untuk "Tampilkan KI tahun 2024 bulan 13".

Mungkin Anda ingin mencoba:
1. Tampilkan KI tahun 2024 bulan 12
2. Tampilkan KI tahun 2023 bulan 13
3. Tampilkan KI tahun 2024 bulan 1
*Waktu: 7387ms*

### 8. Berapa total KI?
**Jawaban:**
[object Object]
*Waktu: 4632ms*

### 9. KI mana yang no_permohonannya duplikat?
**Jawaban:**
Ditemukan 6 judul dengan pemilik berbeda:

1. **Edunex**
   Pemilik: Prof. Yusep Rosmansyah S.T, M.Sc., Ph.D. (STEI - Dosen - 197111291997021001),<br/>Prof. Dr. Ir. Jaka Sembiring M.Eng. (STEI - Dosen - 196602281991021001),<br/>Yuli Adam Prasetyo (STEI - Alumni - 33217016) | Prof. Yusep Rosmansyah S.T, M.Sc., Ph.D. (STEI - Dosen - 197111291997021001),<br/>Prof. Dr. Ir. Jaka Sembiring M.Eng. (STEI - Dosen - 196602281991021001),<br/>Yuli Adam Prasetyo (STEI - Alumni - 33217016),<br/>Willy Muhammad Rizal Fikri Hermansyah (STEI - Alumni - 23217098)
   Jumlah entri: 2
   Database: Itb

2. **KURSI**
   Pemilik: Bismo Jelantik Joyodiharjo S.Sn., M.Ds. (FSRD - Dosen - 197701082010121002) | Drs. Prabu Wardono, M.Des, PhD. (FSRD - Dosen - 195704131989031001)
   Jumlah entri: 2
   Database: Itb

3. **MEJA**
   Pemilik: Bismo Jelantik Joyodiharjo S.Sn., M.Ds. (FSRD - Dosen - 197701082010121002) | D. Arch. Gregorius Prasetyo Adhitama (Institut Teknologi Bandung - Lainnya - 197006171997031001 ) | Kukuh Rizki Satriaji S.Ds., M.T. (FSRD - Dosen - 117110022),<br/>Mutiara Ayu Larasati S.Ds., M.Ds. (FSRD - Dosen - 198812302020122002),<br/>Dwi Hatmojo Danurdoro (Institut Teknologi Bandung - Lainnya - 19770625201712553),<br/>Kharista Astrini Sakya (Institut Teknologi Bandung - Lainnya - 199104252024062001 ),<br/>Virliany Rizqia (- - Lainnya - )
   Jumlah entri: 3
   Database: Itb

4. **Panangan Prosthetic Hand**
   Pemilik: Wildan Trusaji S.T, M.T. (FTI - Dosen - 118110020) | Wildan Trusaji S.T, M.T. (FTI - Dosen - 118110020),<br/>Syaiful Hammam (FSRD - Alumni - 17514014)
   Jumlah entri: 2
   Database: Itb

5. **VidyaRosi**
   Pemilik: Agus Sukoco, M.Kom (Universitas Bandar Lampung -  - 0216038002),<br/>Aila Gema Safitri, S.T., M.T.	 (Universitas Muhammadiyah Bandung - Dosen - 0416068505),<br/>Denny Chandra (STEI - Alumni - 23216315),<br/>Ir. Mervin Tangguar Hutabarat MSc., PhD. (STEI - Dosen - 196505181990031002),<br/>Dr.techn. Ary Setijadi Prihatmanto S.T, M.T. (STEI - Dosen - 197208271997021003),<br/>Dr. Reza Darmakusuma S.T, M.T. (STEI - Dosen - 117110057) | Agus Sukoco, M.Kom (Universitas Bandar Lampung - Dosen - 0216038002),<br/>Aila Gema Safitri, S.T., M.T.	 (Universitas Muhammadiyah Bandung - Dosen - 0416068505),<br/>Denny Chandra (STEI - Alumni - 23216315),<br/>Ir. Mervin Tangguar Hutabarat MSc., PhD. (STEI - Dosen - 196505181990031002),<br/>Dr.techn. Ary Setijadi Prihatmanto S.T, M.T. (STEI - Dosen - 197208271997021003),<br/>Rifki Wijaya (Universitas Telkom -  - ),<br/>Dr. Reza Darmakusuma S.T, M.T. (STEI - Dosen - 117110057)
   Jumlah entri: 2
   Database: Itb

6. **vidyarossa**
   Pemilik: Agus Sukoco, M.Kom (Universitas Bandar Lampung -  - 0216038002),<br/>Aila Gema Safitri, S.T., M.T.	 (Universitas Muhammadiyah Bandung - Dosen - 0416068505),<br/>Denny Chandra (STEI - Alumni - 23216315),<br/>Ir. Mervin Tangguar Hutabarat MSc., PhD. (STEI - Dosen - 196505181990031002),<br/>Dr.techn. Ary Setijadi Prihatmanto S.T, M.T. (STEI - Dosen - 197208271997021003),<br/>Dr. Reza Darmakusuma S.T, M.T. (STEI - Dosen - 117110057) | Agus Sukoco, M.Kom (Universitas Bandar Lampung -  - 0216038002),<br/>Aila Gema Safitri, S.T., M.T.	 (Universitas Muhammadiyah Bandung - Dosen - 0416068505),<br/>Denny Chandra (STEI - Alumni - 23216315),<br/>Ir. Mervin Tangguar Hutabarat MSc., PhD. (STEI - Dosen - 196505181990031002),<br/>Dr.techn. Ary Setijadi Prihatmanto S.T, M.T. (STEI - Dosen - 197208271997021003),<br/>Rifki Wijaya (Universitas Telkom -  - ),<br/>Dr. Reza Darmakusuma S.T, M.T. (STEI - Dosen - 117110057)
   Jumlah entri: 2
   Database: Itb

Potensi konflik kepemilikan. Disarankan verifikasi lebih lanjut.
*Waktu: 27ms*

### 10. Tampilkan inventor yang namanya mengandung tag HTML
**Jawaban:**
Daftar inventor (1-42 dari 1.034):

1. Anugrah Sabdono Sudarsono, S.T., M.T., Ph.D.
2. Billal Maydika Aslam S.T., M.T.
3. Deddy Priatmodjo Koesrindartoto Ph.D.
4. Dr. Ahmad Faizal S.Si., M.Si.
5. Dr. Indra Wibowo S.Si., M.Sc.
6. Dr. Ing. Erika Yuni Astuti, S.T., M.T.
7. Dr. Ir. Diky Irawan S
8. Dr. Ir. Rizki Armanto Mangkuto, S.T., M.T., Ph.D.
9. Dr. Ir. Zulfakriza S.Si., M.T.
10. Dr. Ni Putu Amanda Nitidara, S.T., M.T.
11. Dr. Rahmat Romadhon S.T, M.T.
12. Dr. apt. Neng Fisheri Kurniati S.Si., M.Si.
13. Dr. apt. Pratiwi Wikaningtyas S.Farm., M.Si.
14. Dr.apt. Rimadani Pratiwi, M.Si
15. Erian Jeremy
16. F.X. Nugroho Soelami, M.BEnv., Ph.D.
17. Fikri Barry Alfian
18. Gunta Akhiri
19. Hinny Herliany S.E., M.Si.
20. IPM.
21. Ir. Miranti Indar Mandasari S.T., M.T., Ph.D.
22. Ir. R. Sugeng Joko Sarwono M.T, Ph.D.
23. Ir. R. Triyogo
24. Ir. Wisnu Hendradjit, M.Sc.E.
25. Leyna Ayushitarum, S.T., M.R.K.
26. MDesSc (Illum.)
27. Muhamad Abdul Aziz
28. Muhammad Fauzan
29. Muhammad Hasto Nugroho
30. Pratomo Aji Krisnugrahanto, S.S., M.PWK.
31. Prof. Dr. Ir. R.M. Soegijanto, M.Sc.
32. Prof. Dr. Slamet Ibrahim Surantaatmadja
33. Prof. Dr. apt. Daryono Hadi Tjahjono M.Sc.
34. Prof. Dr. rer. nat. Apt. Sophi Damayanti, S.Si., M.Si.
35. Prof. Dr.Sc. Ir. Andri Dian Nugraha S.Si., M.Si.
36. Prof. Ir. Siti Khodijah M.T, Ph.D.
37. Prof. Ir. Taufan Marhaendrajana M.Sc., Ph.D.
38. Prof. apt. I Ketut Adnyana M.Si., Ph.D.
39. Rahmawati
40. Ramadhani Eka Putra S.Si., M.Si., Ph.D.
41. Tjokorde Istri Armina Padmasawitri, S.Si., M.Si., Ph.D.
42. Yuzar Arigi

Ketik "lanjut" untuk melihat data berikutnya.
*Waktu: 4926ms*


## KATEGORI 4: ANALISIS & INSIGHT
### 1. Jenis KI apa yang paling sering ditolak dan apa polanya?
**Jawaban:**
Menampilkan 1-2 dari 2 data:

1.    Jenis: Paten
   Total Ditolak: 9

2.    Jenis: Desain Industri
   Total Ditolak: 8
*Waktu: 7328ms*

### 2. Apakah ada korelasi antara fakultas dan tingkat keberhasilan sertifikasi?
**Jawaban:**
Menampilkan 1-10 dari 1 data:

1.    Fakultas: STEI, STEI, STEI, STEI, , STEI, STEI
   Total Ki: 6
   Tersertifikasi: 6
   Ditolak: 0
   Ajuan: 0

2.    Fakultas: STEI, STEI, STEI, STEI, , STEI
   Total Ki: 4
   Tersertifikasi: 4
   Ditolak: 0
   Ajuan: 0

3.    Fakultas: FITB, FITB, FITB, FITB
   Total Ki: 1
   Tersertifikasi: 1
   Ditolak: 0
   Ajuan: 0

4.    Fakultas: SBM, SBM, SBM, SBM, SBM, SBM, SBM, SBM, SBM
   Total Ki: 5
   Tersertifikasi: 5
   Ditolak: 0
   Ajuan: 0

5.    Fakultas: FTTM, FTTM, FTTM, FTTM, FTTM, FITB, SAPPK, FTTM
   Total Ki: 2
   Tersertifikasi: 2
   Ditolak: 0
   Ajuan: 0

6.    Fakultas: DITSP, FTTM, STEI, FMIPA, FTTM, FTTM
   Total Ki: 1
   Tersertifikasi: 1
   Ditolak: 0
   Ajuan: 0

7.    Fakultas: SBM, SBM, SBM, SBM, SBM, SBM, SBM, SBM, SBM, SBM, SBM
   Total Ki: 1
   Tersertifikasi: 1
   Ditolak: 0
   Ajuan: 0

8.    Fakultas: FTTM, FTSL, FTTM, FTTM
   Total Ki: 3
   Tersertifikasi: 3
   Ditolak: 0
   Ajuan: 0

9.    Fakultas: SITH, FTI, Badan Pengelola Usaha dan Dana Lestari, SBM
   Total Ki: 1
   Tersertifikasi: 1
   Ditolak: 0
   Ajuan: 0

10.    Fakultas: FITB, FITB, FTSL
   Total Ki: 1
   Tersertifikasi: 1
   Ditolak: 0
   Ajuan: 0
*Waktu: 7804ms*

### 3. Inventor mana yang paling produktif per dekade (2000-2010, 2010-2020, 2020-sekarang)?
**Jawaban:**
Daftar inventor (1-12 dari 10):

1. Agung Harsoyo (10)
2. Bismo Jelantik Joyodiharjo S.Sn., M.Ds. (23)
3. Dr. Ing. Erika Yuni Astuti, S.T., M.T. (12)
4. Dr. Ir. Eko Mursito Budi M.T. (8)
5. Dr. Ir. Hilwadi Hindersah M.Sc (10)
6. Ir. Akhmad Zainal Abidin M.Sc., Ph.D. (14)
7. Ir. Syarif Hidayat M.T, Ph.D. (7)
8. Leyna Ayushitarum, S.T., M.R.K. (12)
9. Pratomo Aji Krisnugrahanto, S.S., M.PWK. (12)
10. Prof. Ir. Siti Khodijah M.T, Ph.D. (11)
11. Prof. Yusep Rosmansyah S.T, M.Sc., Ph.D. (8)
12. Sigit Haryadi (9)
*Waktu: 5037ms*

### 4. Fakultas mana yang KI-nya paling banyak berstatus "masa_pengumuman"?
**Jawaban:**
Maaf, tidak ditemukan data untuk "Fakultas mana yang KI-nya paling banyak berstatus "masa_pengumuman"?".

Mungkin Anda ingin mencoba:
1. Fakultas dengan KI yang paling sering diumumkan
2. Daftar KI ITB yang sedang dalam masa pengumuman
3. KI ITB dengan status pengumuman terbaru
*Waktu: 11681ms*

### 5. Berapa persen KI yang mitra kepemilikannya melibatkan instansi luar ITB?
**Jawaban:**
[object Object]
*Waktu: 5311ms*

### 6. Tren pendaftaran KI dari 2010 sampai 2024 naik atau turun?
**Jawaban:**
Menampilkan 1-10 dari 15 data:

1.    Tahun: 2010
   Jumlah Ki: 3

2.    Tahun: 2011
   Jumlah Ki: 5

3.    Tahun: 2012
   Jumlah Ki: 4

4.    Tahun: 2013
   Jumlah Ki: 3

5.    Tahun: 2014
   Jumlah Ki: 2

6.    Tahun: 2015
   Jumlah Ki: 6

7.    Tahun: 2016
   Jumlah Ki: 21

8.    Tahun: 2017
   Jumlah Ki: 32

9.    Tahun: 2018
   Jumlah Ki: 83

10.    Tahun: 2019
   Jumlah Ki: 211

Masih ada 5 data lagi. Ketik "lanjut" untuk melihat berikutnya.
*Waktu: 7477ms*

### 7. Siapa inventor yang punya KI paling tua yang masih aktif?
**Jawaban:**
Menampilkan 1-10 dari 10 data:

1. **PENCEGAHAN KEBOCORAN UDARA PADA RODA DENGAN BAN POMPA YANG MUDAH DIBONGKAR PASANG**
   Inventor: Prof. DR. Sulaiman Kamil (Institut Teknologi Bandung - Lainnya - -)
   Tanggal: 6 Agustus 1999

2. **SISTEM REAKTOR GANDA PECVD UNTUK PENUMBUHAN LAPISAN TIPIS MATERIAL SILIKON AMORF (a-Si)**
   Inventor: Prof. Dr. Toto Winata (FMIPA - Dosen - 196312101986031002)
   Tanggal: 15 Maret 2000

3. **SENSOR WARNA BIRU DENGAN STRUKTUR AMORF SILIKON KARBIDA TERHIDROGENASI**
   Inventor: Sukirno, dkk
   Tanggal: 15 Maret 2000

4. **PENUMBUHAN LAPISAN TIPIS SILIKON AMORF NITRIDA TERHIDROGENASI SEBAGAI INSULATOR PATE PADA THIN FILM TRANSISTOR (TFT) DENGAN TEKNIK PECVD**
   Inventor: Sukirno, dkk
   Tanggal: 15 Maret 2000

5. **SEBUAH SISTEM PEMAMPAT CITRA DIGITAL MENGGUNAKAN REGISTER GESER DAN REGISTER PENCACAH UNTUK SISTEM KOMUNIKASI MULTIMEDIA**
   Inventor: Prof. Ir. Armein Z.R. Langi, dkk
   Tanggal: 15 Maret 2000

6. **METODA DAN ALAT BUBBLE POINT UNTUK KARAKTERISASI MEMBRAN MIKROFILTRASI**
   Inventor: Prof. Ir. I Gede Wenten M.Sc., dkk
   Tanggal: 7 Februari 2001

7. **BIOFUNGISIDA MENGGUNAKAN MIKROBA UNTUK PENYAKIT BUSUK AKAR**
   Inventor: Prof. I Nyoman Pugeg Aryantha Ph.D. (SITH - Dosen - 196505221990011002)
   Tanggal: 9 Maret 2001

8. **Kursi Lipat Rotan**
   Inventor: Andar Bagus Sriwarno, dkk
   Tanggal: 1 Agustus 2001

9. **PROSES PEMBUATAN MINUMAN KESEHATAN BERBAHAN AKTIF EKSTRAK FERMENTASI JAMUR GANODERMA**
   Inventor: Prof. I Nyoman Pugeg Aryantha Ph.D. (SITH - Dosen - 196505221990011002)
   Tanggal: 5 November 2003

10. **Si Sigap Kendaraan Angkut**
   Inventor: Bismo Jelantik Joyodiharjo S.Sn., dkk
   Tanggal: 5 Maret 2004
*Waktu: 7387ms*

### 8. Bulan apa yang paling banyak digunakan untuk mendaftarkan KI?
**Jawaban:**
Menampilkan 1-10 dari 10 data:

1.    Bulan: 12
   Jumlah Ki: 217

2.    Bulan: 11
   Jumlah Ki: 198

3.    Bulan: 8
   Jumlah Ki: 158

4.    Bulan: 10
   Jumlah Ki: 155

5.    Bulan: 3
   Jumlah Ki: 122

6.    Bulan: 9
   Jumlah Ki: 113

7.    Bulan: 7
   Jumlah Ki: 82

8.    Bulan: 4
   Jumlah Ki: 78

9.    Bulan: 5
   Jumlah Ki: 76

10.    Bulan: 6
   Jumlah Ki: 65
*Waktu: 7385ms*

### 9. Berapa lama rata-rata proses dari ajuan sampai keputusan untuk Paten vs Hak Cipta?
**Jawaban:**
Menampilkan 1-2 dari 2 data:

1.    Jenis: Hak Cipta
   Rata Rata Hari: -125.5108

2.    Jenis: Paten
   Rata Rata Hari: 1490.2683
*Waktu: 5371ms*

### 10. Inventor yang aktif mendaftarkan KI tapi semuanya berstatus gagal/ditolak
**Jawaban:**
Daftar inventor (1-22 dari 10):

1. Abdul Rajak (1)
2. Akmal Zulfi M (1)
3. Andhita Mustikaningtyas (1)
4. Arif Sugiharto S.T., M.T. (3)
5. Dr. Dian Ahmad Hapidin S.Si., M.Si. (1)
6. Dr. Eng. Sandro Mihradi (3)
7. Dr. Ir. Eko Mursito Budi M.T. (2)
8. Dr. Ir. Yuli Setyo Indartono ST. (1)
9. Dr. Yusuf Kurniawan S.T, M.T. (1)
10. Dr.Eng. Ir. Ferryanto S.T, M.T. (3)
11. Ir. Akhmad Zainal Abidin M.Sc., Ph.D. (1)
12. Karismanto Rahmadika (2)
13. Mukhlis Ali (1)
14. Musfirin (1)
15. Prof. Dr. Eng. Khairurrijal M.Si. (1)
16. Prof. Dr. Eng. Muhammad Miftahul Munir S.Si., M.Si. (1)
17. Prof. Dr. Ir. Tatacipta Dirgantara M.T. (3)
18. Prof. Dr. Toto Winata (1)
19. Prof. Ir. Andi Isra Mahyuddin Ph.D. (3)
20. Prof. Yusep Rosmansyah S.T, M.Sc., Ph.D. (1)
21. Sigit Haryadi (1)
22. Taufik Rahman (1)
*Waktu: 7446ms*


## KATEGORI 5: MULTI-STEP & FOLLOW-UP CHAIN
### 1. Tampilkan inventor dari FTTM
**Jawaban:**
Menampilkan 1-10 dari 10 data:

1.    Inventor: Gunta Akhiri (PT AERING -  - ), dkk
   Fakultas: FTTM, FTTM
   Pekerjaan Inventor: Dosen, Dosen
   Nama Instansi Inventor: PT AERING, PT Geo Stroom, Institut Teknologi Bandung, Institut Teknologi Bandung

2.    Inventor: Prof. Ir. Taufan Marhaendrajana M.Sc., dkk
   Fakultas: FTTM, FTTM
   Pekerjaan Inventor: Dosen, Dosen, Lainnya
   Nama Instansi Inventor: Institut Teknologi Bandung, Institut Teknologi Bandung, Institut Teknologi Bandung

3.    Inventor: Prof. Ir. Siti Khodijah M.T, dkk
   Fakultas: FTTM, FTTM
   Pekerjaan Inventor: Dosen, Alumni
   Nama Instansi Inventor: Institut Teknologi Bandung, Institut Teknologi Bandung

4.    Inventor: Taufiq Hidayat S.T, dkk
   Fakultas: FTTM
   Pekerjaan Inventor: Dosen
   Nama Instansi Inventor: Institut Teknologi Bandung

5.    Inventor: Prof. Ir. Doddy Abdassah M.Sc., dkk
   Fakultas: FTTM, FTTM, FMIPA, FTTM
   Pekerjaan Inventor: Dosen, Dosen, Dosen, Dosen
   Nama Instansi Inventor: Institut Teknologi Bandung, Institut Teknologi Bandung, Institut Teknologi Bandung, Institut Teknolo...

6.    Inventor: Prof. Ir. Siti Khodijah M.T, dkk
   Fakultas: FTTM
   Pekerjaan Inventor: Dosen
   Nama Instansi Inventor: Institut Teknologi Bandung, Hokkaido University

7.    Inventor: Achmad Haerul Yusro (PT Hydrotech Metal Indonesia -  - ), dkk
   Fakultas: FTTM, FTTM, FTTM, FTTM
   Pekerjaan Inventor: Dosen, Alumni, Dosen, Alumni
   Nama Instansi Inventor: PT Hydrotech Metal Indonesia, PT Hydrotech Metal Indonesia, PT Hydrotech Metal Indonesia, Institut T...

8.    Inventor: Prof. Ir. Taufan Marhaendrajana M.Sc., dkk
   Fakultas: FTTM
   Pekerjaan Inventor: Dosen
   Nama Instansi Inventor: Institut Teknologi Bandung

9.    Inventor: Darmadi (DITSP - Tenaga Kependidikan - 196809162014091002), dkk
   Fakultas: DITSP, FTTM, STEI, FMIPA, FTTM, FTTM
   Pekerjaan Inventor: Tenaga Kependidikan, Alumni, Alumni, Alumni, Dosen, Dosen, Mahasiswa, Dosen, Dosen
   Nama Instansi Inventor: Institut Teknologi Bandung, Institut Teknologi Bandung, Institut Teknologi Bandung, Institut Teknolo...

10.    Inventor: Dr. rer. nat. Widodo S.T, dkk
   Fakultas: FTTM, FTTM, FTTM
   Pekerjaan Inventor: Dosen, Dosen, Alumni
   Nama Instansi Inventor: Institut Teknologi Bandung, Institut Teknologi Bandung, Institut Teknologi Bandung
*Waktu: 7158ms*

### 2. berapa total mereka
**Jawaban:**
[object Object]
*Waktu: 7078ms*

### 3. siapa yang paling banyak
**Jawaban:**
Daftar inventor (1-1 dari 1):

1. Prof. Ir. Siti Khodijah M.T, Ph.D. (11)
*Waktu: 2267ms*

### 4. detail KI miliknya
**Jawaban:**
Menampilkan 1-10 dari 114 data:

1. **Geolini Converter**
   Id: 1
   Id Ki: 1281
   Jenis: Hak Cipta
   Abstrak: Geolini Converter Software merupakan perangkat lunak yang digunakan untuk mengkonversi data rekaman ...
   Tkt: -
   Status: Tersertifikasi
   Tanggal: 4 April 2023
   No Permohonan: EC00202326013
   Tanggal: 30 Maret 2023
   Id Sertifikat: 000458935
   Status: penerbitan_sertifikat
   Inventor: Gunta Akhiri (PT AERING -  - ), dkk
   Fakultas: FTTM, FTTM
   Pekerjaan Inventor: Dosen, Dosen
   Nama Instansi Inventor: PT AERING, PT Geo Stroom, Institut Teknologi Bandung, Institut Teknologi Bandung
   Mitra Kepemilikan: Institut Teknologi Bandung

2. **Program Prediksi dan Optimisasi Kinerja Injeksi Air pada Lapangan Minyak - CRM Data Driven Model**
   Id: 3
   Id Ki: 1420
   Jenis: Hak Cipta
   Abstrak: Program Komputer yang telah diciptakan dapat digunakan untuk memprediksi kinerja produksi sumur (laj...
   Tkt: -
   Status: Tersertifikasi
   Tanggal: 12 Agustus 2022
   No Permohonan: EC00202263757
   Tanggal: 12 Agustus 2022
   Id Sertifikat: 000379490
   Status: penerbitan_sertifikat
   Inventor: Prof. Ir. Taufan Marhaendrajana M.Sc., dkk
   Fakultas: FTTM, FTTM
   Pekerjaan Inventor: Dosen, Dosen, Lainnya
   Nama Instansi Inventor: Institut Teknologi Bandung, Institut Teknologi Bandung, Institut Teknologi Bandung
   Mitra Kepemilikan: Institut Teknologi Bandung

3. **SISTEM PENGOLAHAN LIMBAH PADAT TERSUSPENSI TOTAL (TSS) DAN LIMBAH AIR ASAM TAMBANG (AAT) PADA INDUSTRI PERTAMBANGAN**
   Id: 6
   Id Ki: 965
   Jenis: Paten
   Abstrak: Invensi ini berhubungan dengan suatu sistem pengolahan limbah padat tersuspensi total (TSS) dan limb...
   Status: Ajuan Paten
   Tanggal: 6 Oktober 2023
   No Permohonan: P00202310055
   Status: masa_pengumuman
   Inventor: Prof. Ir. Siti Khodijah M.T, dkk
   Fakultas: FTTM, FTTM
   Pekerjaan Inventor: Dosen, Alumni
   Nama Instansi Inventor: Institut Teknologi Bandung, Institut Teknologi Bandung
   Mitra Kepemilikan: Institut Teknologi Bandung

4. **METODE PELEBURAN BIJIH NIKEL LATERIT DENGAN TEKNOLOGI ROTARY KILN – ELECTRIC FURNACE MENGGUNAKAN GAS HIDROGEN SEBAGAI BAHAN BAKAR DI ROTARY DRYER SERTA BAHAN BAKAR DAN REDUKTOR DI ROTARY KILN**
   Id: 10
   Id Ki: 70
   Jenis: Paten
   Abstrak: Gas hidrogen digunakan sebagai bahan bakar dan reduktor pada teknologi rotary kiln – electric furnac...
   Status: Ajuan Paten
   Tanggal: 14 Agustus 2023
   No Permohonan: P00202307464
   Status: pemeriksaan_substantif
   Inventor: Taufiq Hidayat S.T, dkk
   Fakultas: FTTM
   Pekerjaan Inventor: Dosen
   Nama Instansi Inventor: Institut Teknologi Bandung
   Mitra Kepemilikan: Institut Teknologi Bandung

5. **PROSES PRODUKSI BAHAN PEMLASTIS EPOKSIDA MINYAK NABATI DAN TURUNAN ESTERNYA TERKATALISIS KOMPLEKS LOGAM-OKSO DAN LOGAM OKSIDA TANPA PELARUT DAN ASAM MINERAL**
   Id: 18
   Id Ki: 1649
   Jenis: Paten
   Abstrak: Invensi ini berkaitan dengan metode sintesis sulfonat alkil ester (SAE) (Paten No. P00201600324) dan...
   Status: Diberi Paten
   Tanggal: 12 Maret 2019
   No Permohonan: P00201902086
   Tanggal: 29 September 2023
   Id Sertifikat: IDP000089818
   Status: pemeliharaan
   Inventor: Prof. Ir. Doddy Abdassah M.Sc., dkk
   Fakultas: FTTM, FTTM, FMIPA, FTTM
   Pekerjaan Inventor: Dosen, Dosen, Dosen, Dosen
   Nama Instansi Inventor: Institut Teknologi Bandung, Institut Teknologi Bandung, Institut Teknologi Bandung, Institut Teknolo...
   Mitra Kepemilikan: Institut Teknologi Bandung

6. **PROSES PEMBUATAN GEOPOLIMER UNTUK IMOBILISASI LOGAM TOKSIL TIMBAL (Pb)**
   Id: 42
   Id Ki: 991
   Jenis: Paten
   Abstrak: Invensi ini berkaitan dengan suatu proses pembuatan geopolimer menggunakan lumpur Lapindo dan abu te...
   Status: Ajuan Paten
   Tanggal: 28 November 2023
   No Permohonan: S00202312965
   Status: masa_pengumuman
   Inventor: Prof. Ir. Siti Khodijah M.T, dkk
   Fakultas: FTTM
   Pekerjaan Inventor: Dosen
   Nama Instansi Inventor: Institut Teknologi Bandung, Hokkaido University
   Mitra Kepemilikan: Institut Teknologi Bandung

7. **METODE PEMISAHAN SULFUR DAN EKSTRAKSI BESI SECARA SIMULTAN DARI SISA HASIL PENGOLAHAN (SHP) PELINDIAN BIJIH NIKEL LATERIT**
   Id: 59
   Id Ki: 193
   Jenis: Paten
   Abstrak: Sesuai invensi ini disediakan suatu metode pemisahan sulfur dan ekstraksi besi secara simultan dari ...
   Status: Ajuan Paten
   Tanggal: 25 November 2022
   No Permohonan: P00202213521
   Status: masa_pengumuman
   Inventor: Achmad Haerul Yusro (PT Hydrotech Metal Indonesia -  - ), dkk
   Fakultas: FTTM, FTTM, FTTM, FTTM
   Pekerjaan Inventor: Dosen, Alumni, Dosen, Alumni
   Nama Instansi Inventor: PT Hydrotech Metal Indonesia, PT Hydrotech Metal Indonesia, PT Hydrotech Metal Indonesia, Institut T...
   Mitra Kepemilikan: Institut Teknologi Bandung

8. **SURFAKTAN BERBASIS CAMPURAN SODIUM POLIOKSIETILEN ALKIL ETER KARBOKSILAT DAN ALKIL ETER ETOKSILAT UNTUK MENURUNKAN TEGANGAN ANTARMUKA MINYAK-AIR PADA APLIKASI PENINGKATKAN PEROLEHAN MINYAK LANJUT DARI RESERVOIR**
   Id: 69
   Id Ki: 202
   Jenis: Paten
   Abstrak: Invensi ini berkaitan dengan surfaktan untuk peningkatan perolehan minyak lanjut (Enhanced Oil Recov...
   Status: Ajuan Paten
   Tanggal: 24 Oktober 2024
   No Permohonan: P00202401458
   Status: masa_pengumuman
   Inventor: Prof. Ir. Taufan Marhaendrajana M.Sc., dkk
   Fakultas: FTTM
   Pekerjaan Inventor: Dosen
   Nama Instansi Inventor: Institut Teknologi Bandung
   Mitra Kepemilikan: PT Rakhara Chemical Technology, Institut Teknologi Bandung

9. **Compo Solver Version 1.0**
   Id: 72
   Id Ki: 1461
   Jenis: Hak Cipta
   Abstrak: Compo Solver Version 1.0 merupakan perangkat lunak berbasis web (web-based software) yang dikembangk...
   Tkt: -
   Status: Tersertifikasi
   Tanggal: 13 Desember 2022
   No Permohonan: EC002022104716
   Tanggal: 13 Desember 2022
   Id Sertifikat: 000420460
   Status: penerbitan_sertifikat
   Inventor: Darmadi (DITSP - Tenaga Kependidikan - 196809162014091002), dkk
   Fakultas: DITSP, FTTM, STEI, FMIPA, FTTM, FTTM
   Pekerjaan Inventor: Tenaga Kependidikan, Alumni, Alumni, Alumni, Dosen, Dosen, Mahasiswa, Dosen, Dosen
   Nama Instansi Inventor: Institut Teknologi Bandung, Institut Teknologi Bandung, Institut Teknologi Bandung, Institut Teknolo...
   Mitra Kepemilikan: Institut Teknologi Bandung

10. **MTSF (Magnetotelluric Saturation Forward Modeling)**
   Id: 75
   Id Ki: 772
   Jenis: Hak Cipta
   Abstrak: MTSF (Magnetotelluric Saturasi Forward) adalah software pemodelan kedepan yang digunakan untuk pengo...
   Tkt: -
   Status: Tersertifikasi
   Tanggal: 7 Oktober 2019
   No Permohonan: EC00201974597
   Tanggal: 7 Oktober 2019
   Id Sertifikat: 000157426
   Status: penerbitan_sertifikat
   Inventor: Dr. rer. nat. Widodo S.T, dkk
   Fakultas: FTTM, FTTM, FTTM
   Pekerjaan Inventor: Dosen, Dosen, Alumni
   Nama Instansi Inventor: Institut Teknologi Bandung, Institut Teknologi Bandung, Institut Teknologi Bandung
   Mitra Kepemilikan: Institut Teknologi Bandung

Masih ada 104 data lagi. Ketik "lanjut" untuk melihat berikutnya.
*Waktu: 7501ms*

### 5. Cari KI status "Ajuan Paten"
**Jawaban:**
Menampilkan 1-10 dari 312 data:

1. **TURBIN ANGIN KECEPATAN RENDAH DENGAN BILAH YANG MEMILIKI PANGKAL MELEKUK**
   Id: 2
   Id Ki: 122
   Jenis: Paten
   Abstrak: -...
   Status: Ajuan Paten
   Tanggal: 24 Oktober 2024
   No Permohonan: S00202409617
   Status: masa_pengumuman
   Inventor: Dr. Ir. Eko Mursito Budi M.T. (FTI - Dosen - 196710061997021001)
   Fakultas: FTI
   Pekerjaan Inventor: Dosen
   Nama Instansi Inventor: Institut Teknologi Bandung
   Mitra Kepemilikan: Institut Teknologi Bandung

2. **SISTEM PENGOLAHAN LIMBAH PADAT TERSUSPENSI TOTAL (TSS) DAN LIMBAH AIR ASAM TAMBANG (AAT) PADA INDUSTRI PERTAMBANGAN**
   Id: 6
   Id Ki: 965
   Jenis: Paten
   Abstrak: Invensi ini berhubungan dengan suatu sistem pengolahan limbah padat tersuspensi total (TSS) dan limb...
   Status: Ajuan Paten
   Tanggal: 6 Oktober 2023
   No Permohonan: P00202310055
   Status: masa_pengumuman
   Inventor: Prof. Ir. Siti Khodijah M.T, dkk
   Fakultas: FTTM, FTTM
   Pekerjaan Inventor: Dosen, Alumni
   Nama Instansi Inventor: Institut Teknologi Bandung, Institut Teknologi Bandung
   Mitra Kepemilikan: Institut Teknologi Bandung

3. **METODE ANALISIS LOGAM TEMBAGA DALAM AIR MINUM MENGGUNAKAN REAGEN SENYAWA TURUNAN PORFIRIN**
   Id: 9
   Id Ki: 434
   Jenis: Paten
   Abstrak: -...
   Status: Ajuan Paten
   Tanggal: 4 Agustus 2020
   No Permohonan: P00202005685
   Status: pemeriksaan_substantif
   Inventor: Dr.apt. Rimadani Pratiwi, dkk
   Fakultas: SF, SF
   Pekerjaan Inventor: Dosen, Guru Besar, Dosen
   Nama Instansi Inventor: Universitas Padjadjaran, Institut Teknologi Bandung, Institut Teknologi Bandung
   Mitra Kepemilikan: Institut Teknologi Bandung

4. **METODE PELEBURAN BIJIH NIKEL LATERIT DENGAN TEKNOLOGI ROTARY KILN – ELECTRIC FURNACE MENGGUNAKAN GAS HIDROGEN SEBAGAI BAHAN BAKAR DI ROTARY DRYER SERTA BAHAN BAKAR DAN REDUKTOR DI ROTARY KILN**
   Id: 10
   Id Ki: 70
   Jenis: Paten
   Abstrak: Gas hidrogen digunakan sebagai bahan bakar dan reduktor pada teknologi rotary kiln – electric furnac...
   Status: Ajuan Paten
   Tanggal: 14 Agustus 2023
   No Permohonan: P00202307464
   Status: pemeriksaan_substantif
   Inventor: Taufiq Hidayat S.T, dkk
   Fakultas: FTTM
   Pekerjaan Inventor: Dosen
   Nama Instansi Inventor: Institut Teknologi Bandung
   Mitra Kepemilikan: Institut Teknologi Bandung

5. **MATERIAL BERPENDAR KUANTUM DOT PEROVSKITE HALIDA YANG STABIL DENGAN PENAMBAHAN FUMED SILIKA UNTUK APLIKASI BIDANG FOTOELEKTRONIK SERTA METODE SINTESISNYA**
   Id: 28
   Id Ki: 292
   Jenis: Paten
   Abstrak: Invensi ini adalah tentang material fotoluminesensi yaitu Kuantum Dots (Quantum dots; QDs) perovskit...
   Status: Ajuan Paten
   Tanggal: 25 Juli 2019
   No Permohonan: P00201906362
   Status: pemeriksaan_formalitas
   Inventor: Dr. rer. nat. Akfiny Hasdi Aimon S.Si., dkk
   Fakultas: FMIPA, FMIPA
   Pekerjaan Inventor: Dosen, Dosen
   Nama Instansi Inventor: Institut Teknologi Bandung, Institut Teknologi Bandung
   Mitra Kepemilikan: Institut Teknologi Bandung

6. **ALAT YANG BERUPA ARMOR BETON BERBENTUK PENTAPOD-PIRAMIDA SEGI TIGA (PENTAPOD-PST)**
   Id: 31
   Id Ki: 75
   Jenis: Paten
   Abstrak: Invensi ini berkaitan dengan Armor Beton Pentapod Piramida Segi Tiga atau Armor Beton PentaPod-PST, ...
   Status: Ajuan Paten
   Tanggal: 22 Agustus 2023
   No Permohonan: P00202307769
   Status: pemeriksaan_substantif
   Inventor: Ir. Dantje Kardana Natakusumah M.Sc., dkk
   Fakultas: FTSL
   Pekerjaan Inventor: Dosen
   Nama Instansi Inventor: Institut Teknologi Bandung
   Mitra Kepemilikan: Institut Teknologi Bandung

7. **PROSES PEMBUATAN GEOPOLIMER UNTUK IMOBILISASI LOGAM TOKSIL TIMBAL (Pb)**
   Id: 42
   Id Ki: 991
   Jenis: Paten
   Abstrak: Invensi ini berkaitan dengan suatu proses pembuatan geopolimer menggunakan lumpur Lapindo dan abu te...
   Status: Ajuan Paten
   Tanggal: 28 November 2023
   No Permohonan: S00202312965
   Status: masa_pengumuman
   Inventor: Prof. Ir. Siti Khodijah M.T, dkk
   Fakultas: FTTM
   Pekerjaan Inventor: Dosen
   Nama Instansi Inventor: Institut Teknologi Bandung, Hokkaido University
   Mitra Kepemilikan: Institut Teknologi Bandung

8. **ALAT BANTU PENENTU OKLUSI UNTUK MEMBANTU MENINGKATKAN KUALITAS OPERASI ORTOGNATIK DAN METODE PEMBUATANNYA**
   Id: 50
   Id Ki: 185
   Jenis: Paten
   Abstrak: Invensi ini berkaitan dengan suatu alat bantu operasi ortognatik, yaitu alat bantu penentu oklusi an...
   Status: Ajuan Paten
   Tanggal: 29 Desember 2022
   No Permohonan: P00202215785
   Status: masa_pengumuman
   Inventor: Prof. Dr. Ir. Tatacipta Dirgantara M.T. (FTMD - Dosen - 197004242006041018), dkk
   Fakultas: FTMD, FTMD, FTMD, FTMD
   Pekerjaan Inventor: Dosen, Dosen, Dosen, Dosen
   Nama Instansi Inventor: Institut Teknologi Bandung, Institut Teknologi Bandung, Institut Teknologi Bandung, Institut Teknolo...
   Mitra Kepemilikan: Institut Teknologi Bandung

9. **ROBOT ANGKLUNG AKUSTIK**
   Id: 53
   Id Ki: 1683
   Jenis: Paten
   Abstrak: Invensi ini berhubungan dengan robot dengan tenaga elektrik-mekanik untuk memainkan angklung akustik...
   Status: Ajuan Paten
   Tanggal: 30 Desember 2010
   No Permohonan: P00201000929
   Status: perbaikan_substantif_diterima
   Inventor: Krisna Diastama (FTI - Alumni - 13317016), dkk
   Fakultas: FTI, FTI
   Pekerjaan Inventor: Alumni, Dosen, Dosen
   Nama Instansi Inventor: Institut Teknologi Bandung, Institut Teknologi Bandung, Institut Teknologi Bandung
   Mitra Kepemilikan: Institut Teknologi Bandung

10. **PRODUK TES DIAGNOSTIK UNTUK MENDETEKSI SARS-COV-2 BERBASIS TAQMAN PROBE REAL-TIME PCR KUANTITATIF**
   Id: 56
   Id Ki: 399
   Jenis: Paten
   Abstrak: COVID-19 merupakan penyakit yang disebabkan oleh virus SARS-CoV-2. Virus ini menyebar dengan cepat d...
   Status: Ajuan Paten
   Tanggal: 5 Desember 2022
   No Permohonan: P00202214270
   Status: masa_pengumuman
   Inventor: Denti Rizki Kinanti (SITH - Alumni - 10417004), dkk
   Fakultas: SITH, SITH, SITH, SITH
   Pekerjaan Inventor: Alumni, Dosen, Dosen, Alumni
   Nama Instansi Inventor: Institut Teknologi Bandung, Institut Teknologi Bandung, Institut Teknologi Bandung, Institut Teknolo...
   Mitra Kepemilikan: Institut Teknologi Bandung

Masih ada 302 data lagi. Ketik "lanjut" untuk melihat berikutnya.
*Waktu: 7331ms*

### 6. sudah berapa lama diajukan
**Jawaban:**
Menampilkan 1-10 dari 10 data:

1. **ROBOT ANGKLUNG AKUSTIK**
   Id: 53
   Id Ki: 1683
   Jenis: Paten
   Abstrak: Invensi ini berhubungan dengan robot dengan tenaga elektrik-mekanik untuk memainkan angklung akustik...
   Status: Ajuan Paten
   Tanggal: 30 Desember 2010
   No Permohonan: P00201000929
   Status: perbaikan_substantif_diterima
   Inventor: Krisna Diastama (FTI - Alumni - 13317016), dkk
   Fakultas: FTI, FTI
   Pekerjaan Inventor: Alumni, Dosen, Dosen
   Nama Instansi Inventor: Institut Teknologi Bandung, Institut Teknologi Bandung, Institut Teknologi Bandung
   Mitra Kepemilikan: Institut Teknologi Bandung
   Hari Menunggu: 5538

2. **OVER EKSPRESI GEN α2,6 SIALIL TRANSFERASE MACACA FASCICULARIS PADA SEL VERO**
   Id: 559
   Id Ki: 605
   Jenis: Paten
   Abstrak: Invensi ini berhubungan dengan suatu Sel Vero yang membawa gen α2,6 sialyltransferase dari trakea Ma...
   Status: Ajuan Paten
   Tanggal: 12 April 2013
   No Permohonan: P00201300277
   Status: pemeriksaan_substantif
   Inventor: Sony Heru Sumarsono Ph.D. (SITH - Dosen - 196111221987031002), dkk
   Fakultas: SITH, SITH, SITH
   Pekerjaan Inventor: Dosen, Dosen, Dosen
   Nama Instansi Inventor: Institut Teknologi Bandung, Institut Teknologi Bandung, Institut Teknologi Bandung
   Mitra Kepemilikan: Institut Teknologi Bandung
   Hari Menunggu: 4704

3. **ALAT PENGERING BERBASIS SUPER ABSORBAN POLIMER (SAP)**
   Id: 832
   Id Ki: 621
   Jenis: Paten
   Abstrak: Invensi ini memuat tentang suatu alat pengering yang menggunakan super abasorban polimer. Proses pen...
   Status: Ajuan Paten
   Tanggal: 31 Agustus 2015
   No Permohonan: P00201505322
   Status: ajuan_pendaftaran_ke_djki
   Inventor: Ir. Akhmad Zainal Abidin M.Sc., dkk
   Fakultas: FTI
   Pekerjaan Inventor: Dosen
   Nama Instansi Inventor: Institut Teknologi Bandung
   Mitra Kepemilikan: Institut Teknologi Bandung
   Hari Menunggu: 3833

4. **SISTEM MANAJEMEN BATERAI LITIUM UNTUK KENDARAAN LISTRIK MENGGUNAKAN PROTOKOL KOMUNIKASI BUS ONEWIRE DAN METODE ESTIMASI STATE-OF-CHARGE MENGGUNAKAN SUPPORT VECTOR REGRESSION**
   Id: 269
   Id Ki: 1728
   Jenis: Paten
   Abstrak: Invensi yang diajukan ini berkaitan dengan system manajemen baterai litium pada kendaraan listrik ke...
   Status: Ajuan Paten
   Tanggal: 19 Januari 2016
   No Permohonan: P00201600323
   Status: perbaikan_substantif_diterima
   Inventor: Prof. Ir. Edi Leksono M.Eng., dkk
   Fakultas: FTI, FTI
   Pekerjaan Inventor: Dosen, Dosen
   Nama Instansi Inventor: Institut Teknologi Bandung, Institut Teknologi Bandung
   Mitra Kepemilikan: Institut Teknologi Bandung
   Hari Menunggu: 3692

5. **FORMULA GARAM HIDRAT DAN ADITIF SEBAGAI REFRIGERAN SEKUNDER UNTUK MENUNJANG KINERJA SISTEM PENGONDISIAN UDARA JENIS AIR SEJUK**
   Id: 1061
   Id Ki: 1733
   Jenis: Paten
   Abstrak: Penggunaan bahan berubah fasa dalam refrigeran sekunder air sejuk (chilled water) dapat meningkatkan...
   Status: Ajuan Paten
   Tanggal: 13 April 2016
   No Permohonan: P00201602456
   Status: perbaikan_substantif_diterima
   Inventor: Muhammad Irsyad, dkk
   Fakultas: FTMD
   Pekerjaan Inventor: Dosen, Dosen, Lainnya, Lainnya, Lainnya
   Nama Instansi Inventor: Institut Teknologi Bandung, Institut Teknologi Bandung, Institut Teknologi Bandung, Institut Teknolo...
   Mitra Kepemilikan: Institut Teknologi Bandung
   Hari Menunggu: 3607

6. **PAPAN KAYU INTERLOCKING MODULAR SEBAGAI STRUKTUR ATAP BANGUNAN DENGAN SISTEM KONSTRUKSI BONGKAR-PASANG**
   Id: 203
   Id Ki: 1751
   Jenis: Paten
   Abstrak: Invensi papan kayu modular adalah berupa komponen yang berfungsi pembentuk bidang atap terbuat dari ...
   Status: Ajuan Paten
   Tanggal: 27 Desember 2016
   No Permohonan: P00201609045
   Status: perbaikan_substantif_diterima
   Inventor: Gembong Pandu Baskoro (Institut Teknologi Bandung - Lainnya - ), dkk
   Pekerjaan Inventor: Lainnya, Lainnya
   Nama Instansi Inventor: Institut Teknologi Bandung, Institut Teknologi Bandung
   Mitra Kepemilikan: Institut Teknologi Bandung
   Hari Menunggu: 3349

7. **FRAMEWORK PENILAIAN KEAMANAN DNS**
   Id: 1063
   Id Ki: 334
   Jenis: Paten
   Abstrak: Status : Terdaftar

No. Agenda pendaftaran : S00201701362...
   Status: Ajuan Paten
   Tanggal: 1 Maret 2017
   No Permohonan: P00201701362
   Status: masa_pengumuman
   Inventor: Girindro Pringgo Digdo (STEI - Alumni - 23215098), dkk
   Fakultas: STEI, STEI
   Pekerjaan Inventor: Alumni, Lektor Kepala
   Nama Instansi Inventor: Institut Teknologi Bandung, Institut Teknologi Bandung
   Mitra Kepemilikan: Institut Teknologi Bandung
   Hari Menunggu: 3285

8. **METODE TRANSAKSI UANG ELEKTRONIK SECARA PEER-TO-PEER**
   Id: 1279
   Id Ki: 1757
   Jenis: Paten
   Abstrak: Invensi ini berupa metode untuk melakukan transaksi uang elektronik secara peer-to-peer. Transaksi d...
   Status: Ajuan Paten
   Tanggal: 31 Mei 2017
   No Permohonan: P00201703455
   Status: perbaikan_substantif_diterima
   Inventor: Prof. Dr. Ir. Suhono Harso Supangkat M.Eng. (STEI - Dosen - 196212031988111001), dkk
   Fakultas: STEI
   Pekerjaan Inventor: Dosen, Lainnya, Lainnya
   Nama Instansi Inventor: Institut Teknologi Bandung, Institut Teknologi Bandung, Institut Teknologi Bandung
   Mitra Kepemilikan: Institut Teknologi Bandung
   Hari Menunggu: 3194

9. **MANAJEMEN SAMPAH ZERO (MASARO)**
   Id: 1025
   Id Ki: 1781
   Jenis: Paten
   Abstrak: Manajemen Sampah Zero (MASARO) menawarkan suatu solusi terhadap permasalahan tersebut yang bisa meni...
   Status: Ajuan Paten
   Tanggal: 20 Juli 2017
   No Permohonan: P00201704782
   Status: perbaikan_substantif_diterima
   Inventor: Dr. Ir. Ahmad Zainal Abidin, dkk
   Pekerjaan Inventor: Lainnya
   Nama Instansi Inventor: Institut Teknologi Bandung
   Mitra Kepemilikan: Institut Teknologi Bandung
   Hari Menunggu: 3144

10. **METODE DAN DIVAIS UNTUK MENGUKUR SECARA CEPAT EFEK HALL MATERIAL LOGAM DENGAN MEMINIMALISASI EFEK IR-DROP**
   Id: 898
   Id Ki: 1730
   Jenis: Paten
   Abstrak: Invensi ini berkaitan dengan metode dan divais untuk pengukuran Efek Hall dari material logamuntuk m...
   Status: Ajuan Paten
   Tanggal: 4 Agustus 2017
   No Permohonan: P00201601159
   Status: masa_pengumuman
   Inventor: Dr. Daniel Kurnia (FMIPA - Dosen - 196101101985031025), dkk
   Fakultas: FMIPA, FMIPA
   Pekerjaan Inventor: Dosen, Alumni, Dosen
   Nama Instansi Inventor: Institut Teknologi Bandung, Institut Teknologi Bandung, Institut Teknologi Bandung
   Mitra Kepemilikan: Institut Teknologi Bandung
   Hari Menunggu: 3129
*Waktu: 5748ms*

### 7. yang paling lama menunggu siapa?
**Jawaban:**
Menampilkan 1-10 dari 10 data:

1. **POULTRY SALES MODULE IN AVIAN INFLUENZA (BIRD FLU) PARTICIPATORY SURVEILLANCE SYSTEM / RYSALEPAVIZ**
   Id: 591
   Id Ki: 1389
   Jenis: Hak Cipta
   Abstrak: --...
   Tkt: -
   Status: Ajuan Hak Cipta
   Tanggal: 16 April 2007
   No Permohonan: C00200702392
   Status: ajuan_pendaftaran_ke_djki
   Inventor: Prof. Yusep Rosmansyah S.T, dkk
   Fakultas: STEI
   Pekerjaan Inventor: Dosen, Lainnya, Lainnya
   Nama Instansi Inventor: Institut Teknologi Bandung, Universitas Sanata Dharma, Institut Teknologi Bandung
   Mitra Kepemilikan: Institut Teknologi Bandung
   Hari Menunggu: 6892

2. **ROBOT ANGKLUNG AKUSTIK**
   Id: 53
   Id Ki: 1683
   Jenis: Paten
   Abstrak: Invensi ini berhubungan dengan robot dengan tenaga elektrik-mekanik untuk memainkan angklung akustik...
   Status: Ajuan Paten
   Tanggal: 30 Desember 2010
   No Permohonan: P00201000929
   Status: perbaikan_substantif_diterima
   Inventor: Krisna Diastama (FTI - Alumni - 13317016), dkk
   Fakultas: FTI, FTI
   Pekerjaan Inventor: Alumni, Dosen, Dosen
   Nama Instansi Inventor: Institut Teknologi Bandung, Institut Teknologi Bandung, Institut Teknologi Bandung
   Mitra Kepemilikan: Institut Teknologi Bandung
   Hari Menunggu: 5538

3. **OVER EKSPRESI GEN α2,6 SIALIL TRANSFERASE MACACA FASCICULARIS PADA SEL VERO**
   Id: 559
   Id Ki: 605
   Jenis: Paten
   Abstrak: Invensi ini berhubungan dengan suatu Sel Vero yang membawa gen α2,6 sialyltransferase dari trakea Ma...
   Status: Ajuan Paten
   Tanggal: 12 April 2013
   No Permohonan: P00201300277
   Status: pemeriksaan_substantif
   Inventor: Sony Heru Sumarsono Ph.D. (SITH - Dosen - 196111221987031002), dkk
   Fakultas: SITH, SITH, SITH
   Pekerjaan Inventor: Dosen, Dosen, Dosen
   Nama Instansi Inventor: Institut Teknologi Bandung, Institut Teknologi Bandung, Institut Teknologi Bandung
   Mitra Kepemilikan: Institut Teknologi Bandung
   Hari Menunggu: 4704

4. **ALAT PENGERING BERBASIS SUPER ABSORBAN POLIMER (SAP)**
   Id: 832
   Id Ki: 621
   Jenis: Paten
   Abstrak: Invensi ini memuat tentang suatu alat pengering yang menggunakan super abasorban polimer. Proses pen...
   Status: Ajuan Paten
   Tanggal: 31 Agustus 2015
   No Permohonan: P00201505322
   Status: ajuan_pendaftaran_ke_djki
   Inventor: Ir. Akhmad Zainal Abidin M.Sc., dkk
   Fakultas: FTI
   Pekerjaan Inventor: Dosen
   Nama Instansi Inventor: Institut Teknologi Bandung
   Mitra Kepemilikan: Institut Teknologi Bandung
   Hari Menunggu: 3833

5. **SISTEM MANAJEMEN BATERAI LITIUM UNTUK KENDARAAN LISTRIK MENGGUNAKAN PROTOKOL KOMUNIKASI BUS ONEWIRE DAN METODE ESTIMASI STATE-OF-CHARGE MENGGUNAKAN SUPPORT VECTOR REGRESSION**
   Id: 269
   Id Ki: 1728
   Jenis: Paten
   Abstrak: Invensi yang diajukan ini berkaitan dengan system manajemen baterai litium pada kendaraan listrik ke...
   Status: Ajuan Paten
   Tanggal: 19 Januari 2016
   No Permohonan: P00201600323
   Status: perbaikan_substantif_diterima
   Inventor: Prof. Ir. Edi Leksono M.Eng., dkk
   Fakultas: FTI, FTI
   Pekerjaan Inventor: Dosen, Dosen
   Nama Instansi Inventor: Institut Teknologi Bandung, Institut Teknologi Bandung
   Mitra Kepemilikan: Institut Teknologi Bandung
   Hari Menunggu: 3692

6. **FORMULA GARAM HIDRAT DAN ADITIF SEBAGAI REFRIGERAN SEKUNDER UNTUK MENUNJANG KINERJA SISTEM PENGONDISIAN UDARA JENIS AIR SEJUK**
   Id: 1061
   Id Ki: 1733
   Jenis: Paten
   Abstrak: Penggunaan bahan berubah fasa dalam refrigeran sekunder air sejuk (chilled water) dapat meningkatkan...
   Status: Ajuan Paten
   Tanggal: 13 April 2016
   No Permohonan: P00201602456
   Status: perbaikan_substantif_diterima
   Inventor: Muhammad Irsyad, dkk
   Fakultas: FTMD
   Pekerjaan Inventor: Dosen, Dosen, Lainnya, Lainnya, Lainnya
   Nama Instansi Inventor: Institut Teknologi Bandung, Institut Teknologi Bandung, Institut Teknologi Bandung, Institut Teknolo...
   Mitra Kepemilikan: Institut Teknologi Bandung
   Hari Menunggu: 3607

7. **PAPAN KAYU INTERLOCKING MODULAR SEBAGAI STRUKTUR ATAP BANGUNAN DENGAN SISTEM KONSTRUKSI BONGKAR-PASANG**
   Id: 203
   Id Ki: 1751
   Jenis: Paten
   Abstrak: Invensi papan kayu modular adalah berupa komponen yang berfungsi pembentuk bidang atap terbuat dari ...
   Status: Ajuan Paten
   Tanggal: 27 Desember 2016
   No Permohonan: P00201609045
   Status: perbaikan_substantif_diterima
   Inventor: Gembong Pandu Baskoro (Institut Teknologi Bandung - Lainnya - ), dkk
   Pekerjaan Inventor: Lainnya, Lainnya
   Nama Instansi Inventor: Institut Teknologi Bandung, Institut Teknologi Bandung
   Mitra Kepemilikan: Institut Teknologi Bandung
   Hari Menunggu: 3349

8. **FRAMEWORK PENILAIAN KEAMANAN DNS**
   Id: 1063
   Id Ki: 334
   Jenis: Paten
   Abstrak: Status : Terdaftar

No. Agenda pendaftaran : S00201701362...
   Status: Ajuan Paten
   Tanggal: 1 Maret 2017
   No Permohonan: P00201701362
   Status: masa_pengumuman
   Inventor: Girindro Pringgo Digdo (STEI - Alumni - 23215098), dkk
   Fakultas: STEI, STEI
   Pekerjaan Inventor: Alumni, Lektor Kepala
   Nama Instansi Inventor: Institut Teknologi Bandung, Institut Teknologi Bandung
   Mitra Kepemilikan: Institut Teknologi Bandung
   Hari Menunggu: 3285

9. **METODE TRANSAKSI UANG ELEKTRONIK SECARA PEER-TO-PEER**
   Id: 1279
   Id Ki: 1757
   Jenis: Paten
   Abstrak: Invensi ini berupa metode untuk melakukan transaksi uang elektronik secara peer-to-peer. Transaksi d...
   Status: Ajuan Paten
   Tanggal: 31 Mei 2017
   No Permohonan: P00201703455
   Status: perbaikan_substantif_diterima
   Inventor: Prof. Dr. Ir. Suhono Harso Supangkat M.Eng. (STEI - Dosen - 196212031988111001), dkk
   Fakultas: STEI
   Pekerjaan Inventor: Dosen, Lainnya, Lainnya
   Nama Instansi Inventor: Institut Teknologi Bandung, Institut Teknologi Bandung, Institut Teknologi Bandung
   Mitra Kepemilikan: Institut Teknologi Bandung
   Hari Menunggu: 3194

10. **MANAJEMEN SAMPAH ZERO (MASARO)**
   Id: 1025
   Id Ki: 1781
   Jenis: Paten
   Abstrak: Manajemen Sampah Zero (MASARO) menawarkan suatu solusi terhadap permasalahan tersebut yang bisa meni...
   Status: Ajuan Paten
   Tanggal: 20 Juli 2017
   No Permohonan: P00201704782
   Status: perbaikan_substantif_diterima
   Inventor: Dr. Ir. Ahmad Zainal Abidin, dkk
   Pekerjaan Inventor: Lainnya
   Nama Instansi Inventor: Institut Teknologi Bandung
   Mitra Kepemilikan: Institut Teknologi Bandung
   Hari Menunggu: 3144
*Waktu: 7247ms*

### 8. Tampilkan KI desain industri
**Jawaban:**
Menampilkan 1-10 dari 10 data:

1. **Desain Kursi Sengkarut Dalam Keteraturan (Orderly Chaos)**
   Id: 723
   Id Ki: 138
   Jenis: Desain Industri
   Abstrak: Desain Kursi Sengkarut Dalam Keteraturan (Orderly Chaos)...
   Tkt: -
   Status: Ajuan Desain Industri
   Tanggal: 2 September 2024
   No Permohonan: A00202404277
   Status: masa_pengumuman
   Inventor: Deny Willy Junaidy S.Sn., dkk
   Fakultas: FSRD, FSRD, FSRD, FSRD, SITH, FSRD
   Pekerjaan Inventor: Dosen, Alumni, Alumni, Dosen, Dosen, Alumni
   Nama Instansi Inventor: Institut Teknologi Bandung, Institut Teknologi Bandung, Institut Teknologi Bandung, Institut Teknolo...
   Mitra Kepemilikan: Institut Teknologi Bandung
   Hari Menunggu: 543

2. **Desain Industri Sistem Aeroponik Modular Terintegrasi Otomasi (SAMTO)**
   Id: 303
   Id Ki: 1575
   Jenis: Desain Industri
   Abstrak: Sebagai desain perangkat aeroponik dengan sistem penyemprotan dari pipa bawah yang mudah dipindah-pi...
   Tkt: -
   Status: Ajuan Desain Industri
   Tanggal: 12 November 2024
   No Permohonan: A00202406251
   Status: pemeriksaan_formalitas
   Inventor: Rizky Pratama Rusdiana, dkk
   Fakultas: FTI, SITH, FTI, SITH
   Pekerjaan Inventor: Alumni, Dosen, Dosen, Dosen, Alumni, Mahasiswa, Dosen
   Nama Instansi Inventor: Universitas Jenderal Achmad Yani, Institut Teknologi Bandung, Institut Teknologi Bandung, Institut T...
   Mitra Kepemilikan: Institut Teknologi Bandung
   Hari Menunggu: 472

3. **Desain Kursi Santai (easy chair) dengan Modul Sandaran dan Armrest Berlapis/Bertangkup (overlay) dengan Lengkung Kurva yang Halus, Dikomposisikan Menjadi Kesatuan untuk Mendukung Postur Tubuh Pengguna**
   Id: 25
   Id Ki: 1563
   Jenis: Desain Industri
   Abstrak: Sebuah kursi yang memiliki desain sandaran berlapis, terinspirasi dari bentuk punggung udang yang di...
   Tkt: -
   Status: Ajuan Desain Industri
   Tanggal: 14 November 2024
   No Permohonan: A00202406318
   Status: pemeriksaan_formalitas
   Inventor: Deny Willy Junaidy S.Sn., dkk
   Fakultas: FSRD, FSRD, FSRD, FSRD, FSRD
   Pekerjaan Inventor: Dosen, Alumni, Alumni, Dosen, Alumni
   Nama Instansi Inventor: Institut Teknologi Bandung, Institut Teknologi Bandung, Institut Teknologi Bandung, Institut Teknolo...
   Mitra Kepemilikan: Institut Teknologi Bandung
   Hari Menunggu: 470

4. **DESAIN LAMPU MULTIGUNA MENGGUNAKAN RANGKA 2 LAPIS ANYAMAN BAMBU DAN BAMBOO-COILING CUP**
   Id: 158
   Id Ki: 1574
   Jenis: Desain Industri
   Abstrak: Lampu multiguna sebagai alat penerang ruangan / lampu multiguna yang dapat diletakkan di atas lantai...
   Tkt: -
   Status: Ajuan Desain Industri
   Tanggal: 15 November 2024
   No Permohonan: A00202406367
   Status: pemeriksaan_formalitas
   Inventor: Achmad Syarief S.Sn., dkk
   Fakultas: FSRD, FSRD, FSRD
   Pekerjaan Inventor: Dosen, Dosen, Dosen
   Nama Instansi Inventor: Institut Teknologi Bandung, Institut Teknologi Bandung, Institut Teknologi Bandung
   Mitra Kepemilikan: Institut Teknologi Bandung
   Hari Menunggu: 469

5. **Sepeda Gerobak Jahit**
   Id: 337
   Id Ki: 1093
   Jenis: Desain Industri
   Abstrak: Profesi penjahit keliling merupakan pekerjaan di sektor informal yang banyak ditemui di kota-kota be...
   Tkt: -
   Status: Ajuan Desain Industri
   Tanggal: 5 Agustus 2025
   No Permohonan: A00202504450
   Status: ajuan_pendaftaran_ke_djki
   Inventor: Dr. Yannes Martinus Pasaribu M.Sn. (FSRD - Dosen - 196301291988111001), dkk
   Fakultas: FSRD, FSRD, FSRD, FSRD
   Pekerjaan Inventor: Dosen, Dosen, Dosen, Alumni
   Nama Instansi Inventor: Institut Teknologi Bandung, Institut Teknologi Bandung, Institut Teknologi Bandung, Institut Teknolo...
   Mitra Kepemilikan: Institut Teknologi Bandung
   Hari Menunggu: 206

6. **Rak Penyimpanan Fleksibel (Flexirack)**
   Id: 1140
   Id Ki: 1095
   Jenis: Desain Industri
   Abstrak: Produk rak penyimpanan modular ini merespon permasalahan keterbatasan ruang pada hunian vertikal, ya...
   Tkt: -
   Status: Ajuan Desain Industri
   Tanggal: 11 Agustus 2025
   No Permohonan: A00202504553
   Status: ajuan_pendaftaran_ke_djki
   Inventor: Etika Vidyarini S.Ds., dkk
   Fakultas: FSRD, FSRD, FSRD, FSRD
   Pekerjaan Inventor: Dosen, Dosen, Dosen, Alumni
   Nama Instansi Inventor: Institut Teknologi Bandung, Institut Teknologi Bandung, Institut Teknologi Bandung, Institut Teknolo...
   Mitra Kepemilikan: Institut Teknologi Bandung
   Hari Menunggu: 200

7. **Drone Air Untuk Pemantauan dan Pengukuran Radiasi Lingkungan**
   Id: 1246
   Id Ki: 1096
   Jenis: Desain Industri
   Abstrak: Dalam suatu kawasan instalasi nuklir, bahan radioaktif seperti sejumlah kecil limbah gas dan partiku...
   Tkt: -
   Status: Ajuan Desain Industri
   Tanggal: 20 Agustus 2025
   No Permohonan: A00202504829
   Status: pemeriksaan_formalitas
   Inventor: Dr. Ir. Djarot Widagdo Ph.D. (FTMD - Dosen - 197009272006041007), dkk
   Fakultas: FTMD
   Pekerjaan Inventor: Dosen, Alumni, Alumni, Dosen, Alumni
   Nama Instansi Inventor: Institut Teknologi Bandung, PT Robo Marine Indonesia, PT Robo Marine Indonesia, Sheffield Hallam Uni...
   Mitra Kepemilikan: PT Robo Marine Indonesia, BRIN Indonesia, Institut Teknologi Bandung
   Hari Menunggu: 191

8. **Motor Listrik Modultrax V3**
   Id: 1266
   Id Ki: 1459
   Jenis: Desain Industri
   Abstrak: Motor Listrik Modultrax V3 adalah sarana transportasi roda dua yang memiliki fitur mudular. Kendaraa...
   Tkt: -
   Status: Ajuan Desain Industri
   Tanggal: 29 September 2025
   No Permohonan: A00202505768
   Status: persiapan_pendaftaran_ke_djki
   Inventor: Bismo Jelantik Joyodiharjo S.Sn., dkk
   Fakultas: FSRD
   Pekerjaan Inventor: Dosen
   Nama Instansi Inventor: Institut Teknologi Bandung
   Mitra Kepemilikan: Institut Teknologi Bandung
   Hari Menunggu: 151

9. **Kendaraan Listrik Roda Tiga (eTrike) Pengangkut Limbah Baterai**
   Id: 70
   Id Ki: 1373
   Jenis: Desain Industri
   Abstrak: E-trike adalah kendaraan listrik roda tiga yang dirancang untuk mendukung logistik perkotaan ramah l...
   Tkt: -
   Status: Ajuan Desain Industri
   Tanggal: 29 September 2025
   No Permohonan: A00202505765
   Status: ajuan_pendaftaran_ke_djki
   Inventor: Poetro Lebdo Sambegoro M.Sc., dkk
   Fakultas: FTMD, FTMD
   Pekerjaan Inventor: Dosen, Dosen, Lainnya
   Nama Instansi Inventor: Institut Teknologi Bandung, Institut Teknologi Bandung, PPTTB
   Mitra Kepemilikan: Institut Teknologi Bandung
   Hari Menunggu: 151

10. **Desain Transportable Medium Range Radar**
   Id: 865
   Id Ki: 1466
   Jenis: Desain Industri
   Abstrak: Desain Transportable  Medium Range Radar ini merupakan rancangan sistem radar taktis jarak menengah ...
   Tkt: -
   Status: Ajuan Desain Industri
   Tanggal: 1 Oktober 2025
   No Permohonan: A00202505852
   Status: ajuan_pendaftaran_ke_djki
   Inventor: Wilma Eka Nurfitriana (PT LAPI ITB - Lainnya - ), dkk
   Fakultas: STEI, STEI, STEI
   Pekerjaan Inventor: Lainnya, Dosen, Alumni, Dosen, Lainnya
   Nama Instansi Inventor: PT LAPI ITB, Institut Teknologi Bandung, Institut Teknologi Bandung, Institut Teknologi Bandung, PT ...
   Mitra Kepemilikan: Institut Teknologi Bandung
   Hari Menunggu: 149
*Waktu: 3205ms*

### 9. dari situ filter yang tersertifikasi
**Jawaban:**
Maaf, tidak ditemukan data untuk "dari situ filter yang tersertifikasi".

Mungkin Anda ingin mencoba:
1. Mencari filter tersertifikasi di database lain
2. Meminta data filter tersertifikasi dari sumber lain
3. Menanyakan tipe filter yang tersedia di database KI ITB
*Waktu: 9617ms*

### 10. urutkan dari terbaru
**Jawaban:**
Menampilkan 1-10 dari 1.353 data:

1. **Tutup atas tabung pressure casting (Pcast) dengan mekanisme clamping**
   Id: 1150
   Id Ki: 1917
   Jenis: Desain Industri
   Abstrak: Penutup dan pengencang dari tabung Pressure Casting (Pcast) untuk membentuk cetakan plester pada tun...
   Tkt: -
   Status: Ajuan Desain Industri
   Tanggal: 19 Februari 2026
   No Permohonan: A00202601100
   Status: ajuan_pendaftaran_ke_djki
   Inventor: Dr. Eng. Sandro Mihradi (FTMD - Dosen - 197707142008011012), dkk
   Fakultas: FTMD, FTMD, FTMD
   Pekerjaan Inventor: Dosen, Dosen, Dosen
   Nama Instansi Inventor: Institut Teknologi Bandung, Institut Teknologi Bandung, Institut Teknologi Bandung
   Mitra Kepemilikan: Institut Teknologi Bandung

2. **Kemasan pakan kucing yang dapat digunakan kembali dengan berbentuk bola**
   Id: 30
   Id Ki: 1909
   Jenis: Desain Industri
   Abstrak: Merupakan kemasan pakan kucing yang dapat dirubah menjadi berbentuk mangkuk wadah pakan kucing....
   Tkt: -
   Status: Ajuan Desain Industri
   Tanggal: 29 Januari 2026
   No Permohonan: A00202600601
   Status: ajuan_pendaftaran_ke_djki
   Inventor: Deny Willy Junaidy S.Sn., dkk
   Fakultas: FSRD, FSRD, SITH
   Pekerjaan Inventor: Dosen, Dosen, Alumni, Dosen
   Nama Instansi Inventor: Institut Teknologi Bandung, UIN Sunan Gunung Djati Bandung, Institut Teknologi Bandung, Institut Tek...
   Mitra Kepemilikan: Institut Teknologi Bandung

3. **Pengembangan Purwarupa Perangkat Tracking dan Theft Prevention Berbasis Internet of Things (IoT) untuk Kendaraan dan Produk Perkebunan Kelapa Sawit**
   Id: 194
   Id Ki: 1135
   Jenis: Desain Industri
   Abstrak: Penelitian ini mengembangkan prototipe untuk monitoring pada kendaraan pengangkut Tandan Buah Segar ...
   Tkt: -
   Status: Ajuan Desain Industri
   Tanggal: 12 Januari 2026
   No Permohonan: A00202600203
   Status: ajuan_pendaftaran_ke_djki
   Inventor: Dharma Favitri Hariyanto, dkk
   Fakultas: FTI, FTI, FTI, FTI, FTI
   Pekerjaan Inventor: Dosen, Dosen, Alumni, Dosen, Dosen, Lainnya, Lainnya, Lainnya, Dosen, Lainnya, Lainnya
   Nama Instansi Inventor: PT Kreasi Rekayasa Indonesia, Institut Teknologi Bandung, Institut Teknologi Bandung, Institut Tekno...
   Mitra Kepemilikan: Badan Pengelola Dana Perkebunan Kelapa Sawit (BPDPKS), PT Kreasi Rekayasa Indonesia, Institut Teknol...

4. **InerCharge**
   Id: 1242
   Id Ki: 1885
   Jenis: Merek
   Abstrak: InerCharge merupakan sistem manajemen cerdas untuk Stasiun Pengisian Kendaraan Listrik yang berbasis...
   Tkt: -
   Status: Ajuan Merek
   Tanggal: 9 Desember 2025
   No Permohonan: DID2025135440
   Status: ajuan_pendaftaran_ke_djki
   Inventor: Dr.-Ing. Justin Pradipta S.T., dkk
   Fakultas: FTI, FTI, FTI, FTI
   Pekerjaan Inventor: Dosen, Dosen, Dosen, Dosen
   Nama Instansi Inventor: Institut Teknologi Bandung, Institut Teknologi Bandung, Institut Teknologi Bandung, Institut Teknolo...
   Mitra Kepemilikan: Institut Teknologi Bandung

5. **Penerapan Ilmu Kimia dalam Bidang Kosmetik:  Panduan Praktikum Analisis Kualitatif, Kuantitatif  dan Visualisasi Struktur Senyawa Rhodamin B  untuk Siswa SMA**
   Id: 437
   Id Ki: 1814
   Jenis: Hak Cipta
   Abstrak: Modul “Penerapan Ilmu Kimia dalam Bidang Kosmetik: 
Panduan Praktikum Analisis Kualitatif, Kuantita...
   Tkt: -
   Status: Tersertifikasi
   Tanggal: 2 Desember 2025
   No Permohonan: EC002025200037
   Tanggal: 2 Desember 2025
   Id Sertifikat: 001040297
   Status: penerbitan_sertifikat
   Inventor: Dr. apt. Wiwit Nurhidayah S.Farm., dkk
   Fakultas: FMIPA, FMIPA, FMIPA, FMIPA, FMIPA, FMIPA, FMIPA, FMIPA
   Pekerjaan Inventor: Dosen, Alumni, Dosen, Alumni, Alumni, Alumni, Dosen, Dosen, Dosen
   Nama Instansi Inventor: Institut Teknologi Bandung, Institut Teknologi Bandung, Institut Teknologi Bandung, Institut Teknolo...
   Mitra Kepemilikan: Institut Teknologi Bandung

6. **Brown Megamendung Executive Chair**
   Id: 802
   Id Ki: 1866
   Jenis: Desain Industri
   Abstrak: Desain Brown Megamendung Executive Chair 2 diklaim atas karakter visual khas berupa sandaran tinggi ...
   Tkt: -
   Status: Ajuan Desain Industri
   Tanggal: 28 November 2025
   No Permohonan: A00202507579
   Status: pemeriksaan_formalitas
   Inventor: Deny Willy Junaidy S.Sn., dkk
   Fakultas: FSRD, FSRD, FSRD, FSRD
   Pekerjaan Inventor: Dosen, Alumni, Lainnya, Dosen, Dosen
   Nama Instansi Inventor: Institut Teknologi Bandung, Institut Teknologi Bandung, Institut Teknologi Bandung, Institut Teknolo...
   Mitra Kepemilikan: Institut Teknologi Bandung

7. **Blue Megamendung Executive Chair**
   Id: 1225
   Id Ki: 1867
   Jenis: Desain Industri
   Abstrak: Desain Megamendung Executive Chair 1 diklaim atas karakter visual khas berupa sandaran dan dudukan b...
   Tkt: -
   Status: Ajuan Desain Industri
   Tanggal: 28 November 2025
   No Permohonan: A00202507578
   Status: pemeriksaan_formalitas
   Inventor: Deny Willy Junaidy S.Sn., dkk
   Fakultas: FSRD, FSRD, FSRD, FSRD
   Pekerjaan Inventor: Dosen, Alumni, Lainnya, Dosen, Dosen
   Nama Instansi Inventor: Institut Teknologi Bandung, Institut Teknologi Bandung, Institut Teknologi Bandung, Institut Teknolo...
   Mitra Kepemilikan: Institut Teknologi Bandung

8. **Nuve Chair**
   Id: 646
   Id Ki: 1948
   Jenis: Desain Industri
   Abstrak: Kursi santai dengan bentuk lembut terinspirasi harmoni piano, memadukan kayu dan kain bertekstur lem...
   Tkt: -
   Status: Ajuan Desain Industri
   Tanggal: 19 November 2025
   No Permohonan: A00202507272
   Status: pemeriksaan_formalitas
   Inventor: Deny Willy Junaidy S.Sn., dkk
   Fakultas: FSRD, FSRD, FSRD
   Pekerjaan Inventor: Dosen, Alumni, Mahasiswa, Alumni
   Nama Instansi Inventor: Institut Teknologi Bandung, Institut Teknologi Bandung, Institut Teknologi Bandung, Homeware Interna...
   Mitra Kepemilikan: Institut Teknologi Bandung

9. **Blóma Chair**
   Id: 696
   Id Ki: 1949
   Jenis: Desain Industri
   Abstrak: Kursi santai rotan dengan bantalan yang menghadirkan kenyamanan dan estetika bunga bermekaran....
   Tkt: -
   Status: Ajuan Desain Industri
   Tanggal: 19 November 2025
   No Permohonan: A00202507270
   Status: pemeriksaan_formalitas
   Inventor: Deny Willy Junaidy S.Sn., dkk
   Fakultas: FSRD, FSRD, FSRD
   Pekerjaan Inventor: Dosen, Alumni, Alumni, Mahasiswa
   Nama Instansi Inventor: Institut Teknologi Bandung, Institut Teknologi Bandung, Homeware International Indonesia, Institut T...
   Mitra Kepemilikan: Institut Teknologi Bandung

10. **Desain Kursi Santai (easy chair) dengan Modul Ramping, Armrest Terbuka Seperti Melayang, dan Sandaran Punggung dengan Bentuk Lengkung Halus**
   Id: 40
   Id Ki: 1776
   Jenis: Desain Industri
   Abstrak: Sebuah kursi yang memiliki desain ringan dan simpel namun memiliki poin utama pada bagian armrest ya...
   Tkt: -
   Status: Diberi Desain Industri
   Tanggal: 14 November 2025
   No Permohonan: A00202406328
   Tanggal: 14 November 2024
   Id Sertifikat: IDD000080490
   Status: penerbitan_sertifikat
   Inventor: Deny Willy Junaidy S.Sn., dkk
   Fakultas: FSRD, FSRD, FSRD, FSRD, FSRD, SITH
   Pekerjaan Inventor: Dosen, Alumni, Alumni, Alumni, Dosen, Dosen
   Nama Instansi Inventor: Institut Teknologi Bandung, Institut Teknologi Bandung, Institut Teknologi Bandung, Institut Teknolo...
   Mitra Kepemilikan: Institut Teknologi Bandung

Masih ada 1.343 data lagi. Ketik "lanjut" untuk melihat berikutnya.
*Waktu: 5310ms*


## KATEGORI 6: PERTANYAAN GABUNGAN / KOMPLEKS
### 1. Tampilkan KI yang inventornya lebih dari 3 orang dan statusnya sudah tersertifikasi
**Jawaban:**
Menampilkan 1-10 dari 383 data:

1. **Geolini Converter**
   Id: 1
   Id Ki: 1281
   Jenis: Hak Cipta
   Abstrak: Geolini Converter Software merupakan perangkat lunak yang digunakan untuk mengkonversi data rekaman ...
   Tkt: -
   Status: Tersertifikasi
   Tanggal: 4 April 2023
   No Permohonan: EC00202326013
   Tanggal: 30 Maret 2023
   Id Sertifikat: 000458935
   Status: penerbitan_sertifikat
   Inventor: Gunta Akhiri (PT AERING -  - ), dkk
   Fakultas: FTTM, FTTM
   Pekerjaan Inventor: Dosen, Dosen
   Nama Instansi Inventor: PT AERING, PT Geo Stroom, Institut Teknologi Bandung, Institut Teknologi Bandung
   Mitra Kepemilikan: Institut Teknologi Bandung

2. **Program Prediksi dan Optimisasi Kinerja Injeksi Air pada Lapangan Minyak - CRM Data Driven Model**
   Id: 3
   Id Ki: 1420
   Jenis: Hak Cipta
   Abstrak: Program Komputer yang telah diciptakan dapat digunakan untuk memprediksi kinerja produksi sumur (laj...
   Tkt: -
   Status: Tersertifikasi
   Tanggal: 12 Agustus 2022
   No Permohonan: EC00202263757
   Tanggal: 12 Agustus 2022
   Id Sertifikat: 000379490
   Status: penerbitan_sertifikat
   Inventor: Prof. Ir. Taufan Marhaendrajana M.Sc., dkk
   Fakultas: FTTM, FTTM
   Pekerjaan Inventor: Dosen, Dosen, Lainnya
   Nama Instansi Inventor: Institut Teknologi Bandung, Institut Teknologi Bandung, Institut Teknologi Bandung
   Mitra Kepemilikan: Institut Teknologi Bandung

3. **Eksperimen dalam Fisika Bangunan**
   Id: 7
   Id Ki: 1219
   Jenis: Hak Cipta
   Abstrak: Pada konsep desain dan operasional bangunan saat ini, telah diketahui pentingnya pemahaman atas fisi...
   Tkt: -
   Status: Tersertifikasi
   Tanggal: 28 April 2021
   No Permohonan: EC00202121683
   Tanggal: 20 November 2019
   Id Sertifikat: 000249373
   Status: penerbitan_sertifikat
   Inventor: Anugrah Sabdono Sudarsono, dkk
   Fakultas: FTI, FTI, FTI
   Pekerjaan Inventor: Dosen, Dosen, Dosen, Dosen, Alumni, Alumni, Dosen, Dosen, Dosen, Alumni
   Nama Instansi Inventor: Institut Teknologi Bandung, Institut Teknologi Bandung, Institut Teknologi Bandung, Institut Teknolo...
   Mitra Kepemilikan: Institut Teknologi Bandung

4. **Toksisitas in vivo dan in silico: Prinsip dan Aplikasi**
   Id: 12
   Id Ki: 1216
   Jenis: Hak Cipta
   Abstrak: Buku ini disusun untuk memberikan gambaran mengenai prinsip toksisitas, pengantar pengujian secara i...
   Tkt: -
   Status: Tersertifikasi
   Tanggal: 12 April 2021
   No Permohonan: EC00202119609
   Tanggal: 17 Agustus 2020
   Id Sertifikat: 000246644
   Status: penerbitan_sertifikat
   Inventor: Dr. apt. Neng Fisheri Kurniati S.Si., dkk
   Fakultas: SF, SITH
   Pekerjaan Inventor: Dosen, Alumni, Dosen
   Nama Instansi Inventor: Institut Teknologi Bandung, Institut Teknologi Bandung, Institut Teknologi Bandung
   Mitra Kepemilikan: Institut Teknologi Bandung

5. **PLATFORM INSPIRASIBERBAGI**
   Id: 13
   Id Ki: 1604
   Jenis: Hak Cipta
   Abstrak: InspirasiBerbagi dikembangkan untuk menjadi jembatan bagi para filantropi untuk bergotong royong mem...
   Tkt: -
   Status: Tersertifikasi
   Tanggal: 13 April 2022
   No Permohonan: EC00202224959
   Tanggal: 31 Juli 2021
   Id Sertifikat: 000340441
   Status: penerbitan_sertifikat
   Inventor: Dr. Ahmad Faizal S.Si., dkk
   Fakultas: SITH, FTI, Badan Pengelola Usaha dan Dana Lestari, SBM
   Pekerjaan Inventor: Dosen, Alumni, Tenaga Kependidikan, Dosen
   Nama Instansi Inventor: Institut Teknologi Bandung, Institut Teknologi Bandung, Institut Teknologi Bandung, Institut Teknolo...
   Mitra Kepemilikan: Institut Teknologi Bandung

6. **Kuesioner Pengetahuan Polifarmasi dan Caregiver Geriatri pada Mahasiswa Farmasi (FORGIVER 19)**
   Id: 14
   Id Ki: 894
   Jenis: Hak Cipta
   Abstrak: Kuesioner Pengetahuan Polifarmasi dan Caregiver Geriatri pada Mahasiswa Farmasi (FORGIVER 19)...
   Tkt: -
   Status: Tersertifikasi
   Tanggal: 3 Mei 2024
   No Permohonan: EC00202435044
   Tanggal: 26 April 2024
   Id Sertifikat: 000610401
   Status: penerbitan_sertifikat
   Inventor: Prof. apt. I Ketut Adnyana M.Si., dkk
   Fakultas: SF, SF
   Pekerjaan Inventor: Dosen, Dosen
   Nama Instansi Inventor: Institut Teknologi Bandung, Institut Teknologi Bandung, Institut Teknologi Bandung, Institut Teknolo...
   Mitra Kepemilikan: Institut Teknologi Bandung

7. **ANTAR MUKA PEMANTAU PENGGUNAAN ENERGI LISTRIK PADA MESIN PERKAKAS KONVENSIONAL**
   Id: 23
   Id Ki: 1186
   Jenis: Hak Cipta
   Abstrak: Modul pemantau penggunaan energi listrik menghasilkan informasi yang berbasis pada pengukuran penggu...
   Tkt: -
   Status: Tersertifikasi
   Tanggal: 22 Desember 2020
   No Permohonan: 000233853
   Tanggal: 9 Desember 2020
   Id Sertifikat: 000233853
   Status: penerbitan_sertifikat
   Inventor: Harry Prayoga Setyawan (FTMD - Alumni - 23119013), dkk
   Fakultas: FTMD, FTMD
   Pekerjaan Inventor: Alumni, Dosen
   Nama Instansi Inventor: Institut Teknologi Bandung, Institut Teknologi Bandung
   Mitra Kepemilikan: Institut Teknologi Bandung

8. **IWK Robotic Flex Sensor**
   Id: 24
   Id Ki: 1788
   Jenis: Hak Cipta
   Abstrak: IWK Robotic Flex Sensor Trainerkit adalah sebuah aplikasi untuk menyatukan data yang diambil dari se...
   Tkt: -
   Status: Tersertifikasi
   Tanggal: 18 November 2022
   No Permohonan: EC00202290783
   Tanggal: 15 November 2022
   Id Sertifikat: 000406527
   Status: penerbitan_sertifikat
   Inventor: Nina Lestari, dkk
   Fakultas: STEI, STEI, STEI, STEI, , STEI
   Pekerjaan Inventor: Dosen, Dosen, Dosen, Dosen, Dosen, Dosen, Dosen, Dosen, Lainnya
   Nama Instansi Inventor: Universitas Sangga Buana, Universitas Bandar Lampung, Universitas Bandar Lampung, Institut Teknologi...
   Mitra Kepemilikan: Institut Teknologi Bandung

9. **Soda Game**
   Id: 27
   Id Ki: 1391
   Jenis: Hak Cipta
   Abstrak: Permainan SODA adalah bagian dari Program Systems Thinking for Entrepreneurship untuk pelajar atau m...
   Tkt: -
   Status: Tersertifikasi
   Tanggal: 14 November 2024
   No Permohonan: EC002024225676
   Tanggal: 17 Oktober 2024
   Id Sertifikat: 000798108
   Status: penerbitan_sertifikat
   Inventor: Khrisna Ariyanto S.T., dkk
   Fakultas: SBM, SBM, SBM, SBM, SBM, SBM, SBM, SBM, SBM, SBM, SBM
   Pekerjaan Inventor: Dosen, Dosen, Dosen, Dosen, Dosen, Dosen, Dosen, Dosen, Alumni, Alumni, Alumni, Lainnya, Alumni
   Nama Instansi Inventor: Institut Teknologi Bandung, Institut Teknologi Bandung, Institut Teknologi Bandung, Institut Teknolo...
   Mitra Kepemilikan: Institut Teknologi Bandung

10. **Pembuatan Minuman Herbal Berbasis Cascara dan Propolis**
   Id: 34
   Id Ki: 908
   Jenis: Hak Cipta
   Abstrak: Pembuatan Minuman Herbal Berbasis Cascara dan Propolis...
   Tkt: -
   Status: Tersertifikasi
   Tanggal: 26 Agustus 2024
   No Permohonan: EC00202491319
   Tanggal: 7 Agustus 2024
   Id Sertifikat: 000666637
   Status: penerbitan_sertifikat
   Inventor: Amieruddin Rizqi Ghazali (SITH - Alumni - 11919035), dkk
   Fakultas: SITH, SITH
   Pekerjaan Inventor: Alumni, Dosen
   Nama Instansi Inventor: Institut Teknologi Bandung, Institut Teknologi Bandung, Institut Teknologi Bandung, Institut Teknolo...
   Mitra Kepemilikan: Institut Teknologi Bandung

Masih ada 373 data lagi. Ketik "lanjut" untuk melihat berikutnya.
*Waktu: 7147ms*

### 2. Dari semua KI yang mitra kepemilikannya tidak null, berapa yang jenis Paten dan berapa yang Hak Cipta?
**Jawaban:**
[object Object]
*Waktu: 5101ms*

### 3. Inventor yang mendaftarkan KI di tahun yang sama lebih dari 5 KI — siapa saja mereka?
**Jawaban:**
Daftar inventor (1-18 dari 10):

1. ASEAN Eng. (7)
2. Arif Sugiharto S.T., M.T. (7)
3. Bismo Jelantik Joyodiharjo S.Sn., M.Ds. (23)
4. D. Arch. Gregorius Prasetyo Adhitama (6)
5. Dr. Eng. Sandro Mihradi (7)
6. Dr. Ing. Erika Yuni Astuti, S.T., M.T. (12)
7. Dr. Ir. Agung Wahyu Setiawan M.T. (7)
8. Dr. Ir. Eko Mursito Budi M.T. (8)
9. Dr.Eng. Ir. Ferryanto S.T, M.T. (7)
10. I.P.M. (7)
11. Ir. Akhmad Zainal Abidin M.Sc., Ph.D. (14)
12. Ir. Syarif Hidayat M.T, Ph.D. (7)
13. Leyna Ayushitarum, S.T., M.R.K. (12)
14. Pratomo Aji Krisnugrahanto, S.S., M.PWK. (12)
15. Prof. Dr. Ir. Tatacipta Dirgantara M.T. (7)
16. Prof. Ir. Andi Isra Mahyuddin Ph.D. (7)
17. Syaiful Hammam (7)
18. Wildan Trusaji S.T, M.T. (7)
*Waktu: 4773ms*

### 4. Bandingkan KI yang didaftarkan oleh Dosen vs Alumni vs Mahasiswa berdasarkan tingkat keberhasilan sertifikasi
**Jawaban:**
Menampilkan 1-4 dari 4 data:

1.    Kategori Inventor: Mahasiswa
   Total Ki: 5
   Tersertifikasi: 4
   Persentase Keberhasilan: 80.00

2.    Kategori Inventor: Alumni
   Total Ki: 29
   Tersertifikasi: 16
   Persentase Keberhasilan: 55.17

3.    Kategori Inventor: Dosen
   Total Ki: 1237
   Tersertifikasi: 437
   Persentase Keberhasilan: 35.33

4.    Kategori Inventor: Lainnya
   Total Ki: 34
   Tersertifikasi: 5
   Persentase Keberhasilan: 14.71
*Waktu: 5967ms*

### 5. KI mana yang punya no_permohonan tapi tidak punya id_sertifikat padahal status_ki-nya sudah "Tersertifikasi"?
**Jawaban:**
Maaf, tidak ditemukan data untuk "KI mana yang punya no_permohonan tapi tidak punya id_sertifikat padahal status_ki-nya sudah "Tersertifikasi"?".

Mungkin Anda ingin mencoba:
1. Apakah ada data yang hilang atau tidak tercatat di database KI ITB
2. Apakah ada kesalahan dalam proses pencatatan data sertifikasi
3. Apakah ada data yang belum diproses atau terlambat diupdate
*Waktu: 7934ms*

