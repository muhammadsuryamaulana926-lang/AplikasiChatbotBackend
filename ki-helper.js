const fs = require('fs');
const path = require('path');

const KI_FILE = path.join(__dirname, 'kekayaan-intelektual.json');

// Load data kekayaan intelektual
function loadKekayaanIntelektual() {
  if (fs.existsSync(KI_FILE)) {
    try {
      const data = JSON.parse(fs.readFileSync(KI_FILE, 'utf8'));
      return data.data || [];
    } catch (e) {
      console.error('Error loading kekayaan intelektual:', e);
      return [];
    }
  }
  return [];
}

// Query kekayaan intelektual
function queryKekayaanIntelektual(filters = {}) {
  const data = loadKekayaanIntelektual();
  
  let results = data;
  
  // Filter by tahun pendaftaran
  if (filters.tahun_pendaftaran) {
    results = results.filter(item => {
      const tahun = new Date(item.tgl_pendaftaran).getFullYear();
      return tahun === parseInt(filters.tahun_pendaftaran);
    });
  }
  
  // Filter by jenis KI
  if (filters.jenis_ki) {
    results = results.filter(item => 
      item.jenis_ki.toLowerCase().includes(filters.jenis_ki.toLowerCase())
    );
  }
  
  // Filter by inventor
  if (filters.inventor) {
    results = results.filter(item => 
      item.inventor.toLowerCase().includes(filters.inventor.toLowerCase())
    );
  }
  
  // Filter by fakultas
  if (filters.fakultas_inventor) {
    results = results.filter(item => 
      item.fakultas_inventor.toLowerCase().includes(filters.fakultas_inventor.toLowerCase())
    );
  }
  
  return results;
}

// Get statistics
function getKIStatistics() {
  const data = loadKekayaanIntelektual();
  
  const stats = {
    total: data.length,
    byJenis: {},
    byFakultas: {},
    byTahun: {}
  };
  
  data.forEach(item => {
    // By jenis
    stats.byJenis[item.jenis_ki] = (stats.byJenis[item.jenis_ki] || 0) + 1;
    
    // By fakultas
    const fakultas = item.fakultas_inventor.split(',').map(f => f.trim());
    fakultas.forEach(f => {
      stats.byFakultas[f] = (stats.byFakultas[f] || 0) + 1;
    });
    
    // By tahun
    const tahun = new Date(item.tgl_pendaftaran).getFullYear();
    stats.byTahun[tahun] = (stats.byTahun[tahun] || 0) + 1;
  });
  
  return stats;
}

module.exports = {
  loadKekayaanIntelektual,
  queryKekayaanIntelektual,
  getKIStatistics
};
