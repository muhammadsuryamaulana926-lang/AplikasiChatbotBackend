const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

const CONFIG_FILE = path.join(__dirname, 'active-db.json');
const CONNECTIONS_FILE = path.join(__dirname, 'db-connections.json');

// Get active databases (returns array)
function getActiveDatabases() {
  if (fs.existsSync(CONFIG_FILE)) {
    try {
      console.log(`[DB Helper]: Reading config from ${CONFIG_FILE}`);
      const config = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8'));
      console.log(`[DB Helper]: Found active databases: ${JSON.stringify(config.activeDatabases)}`);
      return config.activeDatabases || [];
    } catch (e) {
      return [];
    }
  }
  return [];
}

// Get active database name (backward compatibility - returns first active)
function getActiveDatabase() {
  const databases = getActiveDatabases();
  return databases[0] || null;
}

// Get all active connection configs
function getAllActiveConnectionConfigs() {
  const activeDbs = getActiveDatabases();

  if (activeDbs.length === 0) return [];

  if (fs.existsSync(CONNECTIONS_FILE)) {
    try {
      const connections = JSON.parse(fs.readFileSync(CONNECTIONS_FILE, 'utf8'));
      return activeDbs.map(dbName => {
        const connection = connections.find(c => c.name === dbName || c.database === dbName);
        if (connection) {
          return {
            host: connection.host,
            user: connection.user,
            password: connection.password,
            database: connection.database,
            port: connection.port
          };
        }
        return null;
      }).filter(c => c !== null);
    } catch (e) {
      console.error('Error loading connection configs:', e);
    }
  }

  return [];
}

// Get connection config for active database (backward compatibility)
function getActiveConnectionConfig() {
  const activeDb = getActiveDatabase();

  if (fs.existsSync(CONNECTIONS_FILE)) {
    try {
      const connections = JSON.parse(fs.readFileSync(CONNECTIONS_FILE, 'utf8'));
      const connection = connections.find(c => c.name === activeDb || c.database === activeDb);

      if (connection) {
        return {
          host: connection.host,
          user: connection.user,
          password: connection.password,
          database: connection.database,
          port: connection.port
        };
      }
    } catch (e) {
      console.error('Error loading connection config:', e);
    }
  }

  // Default fallback
  return {
    host: 'localhost',
    user: 'root',
    password: '',
    database: activeDb,
    port: 3306
  };
}

// Create database connection
async function createConnection() {
  const config = getActiveConnectionConfig();
  return await mysql.createConnection(config);
}

// Get database config object
function getDbConfig() {
  return getActiveConnectionConfig();
}

// Add new database to connections
function addDatabase(dbData) {
  let connections = [];

  if (fs.existsSync(CONNECTIONS_FILE)) {
    try {
      connections = JSON.parse(fs.readFileSync(CONNECTIONS_FILE, 'utf8'));
    } catch (e) {
      connections = [];
    }
  }

  // Check if already exists
  const exists = connections.find(c => c.name === dbData.name || c.database === dbData.database);
  if (!exists) {
    connections.push({
      name: dbData.name,
      host: dbData.host,
      port: dbData.port,
      database: dbData.database,
      user: dbData.username,
      password: dbData.password
    });

    fs.writeFileSync(CONNECTIONS_FILE, JSON.stringify(connections, null, 2));
    console.log('✅ Database added:', dbData.name);
  }
}

module.exports = {
  getActiveDatabases,
  getActiveDatabase,
  getAllActiveConnectionConfigs,
  getActiveConnectionConfig,
  createConnection,
  getDbConfig,
  addDatabase
};
