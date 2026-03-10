// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// LEARNING SYSTEM V2 - ADVANCED
// User-Specific Learning + Confidence Threshold + Conflict Resolution
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const fs = require('fs');
const path = require('path');

const LEARNING_FILE = path.join(__dirname, 'learning-data-v2.json');
const CONFIDENCE_THRESHOLD = 0.80; // 80% minimum untuk shortcut
const TIME_DECAY_DAYS = 30; // Data lebih dari 30 hari mulai decay
const MAX_PATTERNS_PER_USER = 500; // Limit per user

// User-specific learning database
const userLearningDB = new Map(); // userId -> { patterns, shortcuts, preferences }

/**
 * 💾 LOAD USER-SPECIFIC LEARNING DATA
 */
function loadLearningData() {
  try {
    if (fs.existsSync(LEARNING_FILE)) {
      const data = JSON.parse(fs.readFileSync(LEARNING_FILE, 'utf8'));
      
      if (data.users) {
        data.users.forEach(u => {
          userLearningDB.set(u.userId, {
            patterns: new Map(u.patterns || []),
            shortcuts: new Map(u.shortcuts || []),
            preferences: new Map(u.preferences || []),
            feedback: new Map(u.feedback || []),
            errors: new Map(u.errors || [])
          });
        });
      }
      
      console.log('✅ Learning v2 loaded:', userLearningDB.size, 'users');
    }
  } catch (err) {
    console.error('❌ Failed to load learning v2:', err.message);
  }
}

/**
 * 💾 SAVE USER-SPECIFIC LEARNING DATA
 */
function saveLearningData() {
  try {
    const users = [];
    
    for (const [userId, data] of userLearningDB.entries()) {
      users.push({
        userId,
        patterns: Array.from(data.patterns.entries()),
        shortcuts: Array.from(data.shortcuts.entries()),
        preferences: Array.from(data.preferences.entries()),
        feedback: Array.from(data.feedback.entries()),
        errors: Array.from(data.errors.entries())
      });
    }
    
    fs.writeFileSync(LEARNING_FILE, JSON.stringify({ users, lastSaved: Date.now() }, null, 2));
    console.log('💾 Learning v2 saved');
  } catch (err) {
    console.error('❌ Failed to save learning v2:', err.message);
  }
}

/**
 * 🧠 LEARN FROM QUERY (USER-SPECIFIC)
 */
function learnFromQuery(context) {
  const { userId = 'default', userQuery, database, intent, resultCount, executionTime } = context;
  
  if (!userLearningDB.has(userId)) {
    userLearningDB.set(userId, {
      patterns: new Map(),
      shortcuts: new Map(),
      preferences: new Map(),
      feedback: new Map(),
      errors: new Map()
    });
  }
  
  const userData = userLearningDB.get(userId);
  const now = Date.now();
  
  // Learn database preference with time-weighted scoring
  learnDatabasePreference(userData, userQuery, database, now);
  
  // Learn query pattern
  if (resultCount > 0) {
    learnQueryPattern(userData, userQuery, database, intent, resultCount, executionTime, now);
  }
  
  // Detect shortcut (with confidence threshold)
  detectShortcut(userData, userQuery, database, executionTime, now);
  
  // Cleanup old data
  if (userData.patterns.size > MAX_PATTERNS_PER_USER) {
    cleanupOldPatterns(userData, now);
  }
  
  // Auto-save every 10 learnings
  if (userData.patterns.size % 10 === 0) {
    saveLearningData();
  }
}

/**
 * 🎯 LEARN DATABASE PREFERENCE (CONFLICT RESOLUTION)
 */
function learnDatabasePreference(userData, query, database, timestamp) {
  const key = query.toLowerCase().trim();
  
  if (!userData.preferences.has(key)) {
    userData.preferences.set(key, {
      databases: [{ name: database, score: 1, lastUsed: timestamp }],
      totalQueries: 1
    });
  } else {
    const pref = userData.preferences.get(key);
    const dbEntry = pref.databases.find(d => d.name === database);
    
    if (dbEntry) {
      // Time-weighted scoring (recent = more important)
      const timeDiff = timestamp - dbEntry.lastUsed;
      const daysDiff = timeDiff / (1000 * 60 * 60 * 24);
      const recencyBoost = daysDiff < 7 ? 1.5 : 1.0;
      
      dbEntry.score += recencyBoost;
      dbEntry.lastUsed = timestamp;
    } else {
      pref.databases.push({ name: database, score: 1, lastUsed: timestamp });
    }
    
    pref.totalQueries++;
    
    // Sort by score (conflict resolution)
    pref.databases.sort((a, b) => b.score - a.score);
  }
}

/**
 * 📊 LEARN QUERY PATTERN
 */
function learnQueryPattern(userData, query, database, intent, resultCount, executionTime, timestamp) {
  const key = `${query.toLowerCase()}_${database}`;
  
  if (!userData.patterns.has(key)) {
    userData.patterns.set(key, {
      query,
      database,
      intent,
      frequency: 1,
      avgResultCount: resultCount,
      avgExecutionTime: executionTime,
      lastUsed: timestamp,
      confidence: 0.5
    });
  } else {
    const pattern = userData.patterns.get(key);
    pattern.frequency++;
    pattern.avgResultCount = Math.round(
      (pattern.avgResultCount * (pattern.frequency - 1) + resultCount) / pattern.frequency
    );
    pattern.avgExecutionTime = Math.round(
      (pattern.avgExecutionTime * (pattern.frequency - 1) + executionTime) / pattern.frequency
    );
    pattern.lastUsed = timestamp;
    
    // Increase confidence with frequency
    pattern.confidence = Math.min(0.99, pattern.confidence + 0.05);
  }
}

/**
 * ⚡ DETECT SHORTCUT (WITH CONFIDENCE THRESHOLD)
 */
function detectShortcut(userData, query, database, executionTime, timestamp) {
  const key = query.toLowerCase().trim();
  
  if (!userData.shortcuts.has(key)) {
    userData.shortcuts.set(key, {
      query,
      database,
      frequency: 1,
      avgExecutionTime: executionTime,
      lastUsed: timestamp,
      confidence: 0.3
    });
  } else {
    const shortcut = userData.shortcuts.get(key);
    shortcut.frequency++;
    shortcut.avgExecutionTime = Math.round(
      (shortcut.avgExecutionTime * (shortcut.frequency - 1) + executionTime) / shortcut.frequency
    );
    shortcut.lastUsed = timestamp;
    
    // Increase confidence
    shortcut.confidence = Math.min(0.99, 0.3 + (shortcut.frequency * 0.07));
    
    // Log when shortcut reaches threshold
    if (shortcut.confidence >= CONFIDENCE_THRESHOLD && shortcut.frequency === 10) {
      console.log(`⚡ Shortcut activated: "${query}" (confidence: ${(shortcut.confidence * 100).toFixed(0)}%)`);
    }
  }
}

/**
 * 🔍 GET PREFERRED DATABASE (CONFLICT RESOLUTION)
 */
function getPreferredDatabase(userId, query) {
  if (!userLearningDB.has(userId)) return null;
  
  const userData = userLearningDB.get(userId);
  const key = query.toLowerCase().trim();
  const pref = userData.preferences.get(key);
  
  if (!pref || pref.databases.length === 0) return null;
  
  // Apply time decay
  const now = Date.now();
  const validDatabases = pref.databases.filter(db => {
    const daysSinceUsed = (now - db.lastUsed) / (1000 * 60 * 60 * 24);
    return daysSinceUsed < TIME_DECAY_DAYS * 2; // Keep for 60 days max
  });
  
  if (validDatabases.length === 0) return null;
  
  // Return top preference
  return {
    database: validDatabases[0].name,
    confidence: validDatabases[0].score / pref.totalQueries,
    alternatives: validDatabases.slice(1, 3).map(d => d.name)
  };
}

/**
 * ⚡ GET SHORTCUT (WITH CONFIDENCE CHECK)
 */
function getShortcut(userId, query) {
  if (!userLearningDB.has(userId)) return null;
  
  const userData = userLearningDB.get(userId);
  const key = query.toLowerCase().trim();
  const shortcut = userData.shortcuts.get(key);
  
  if (!shortcut) return null;
  
  // Check confidence threshold
  if (shortcut.confidence < CONFIDENCE_THRESHOLD) {
    return null;
  }
  
  // Check time decay
  const daysSinceUsed = (Date.now() - shortcut.lastUsed) / (1000 * 60 * 60 * 24);
  if (daysSinceUsed > TIME_DECAY_DAYS) {
    return null;
  }
  
  return {
    database: shortcut.database,
    confidence: shortcut.confidence,
    frequency: shortcut.frequency,
    isShortcut: true
  };
}

/**
 * 📝 LEARN FROM FEEDBACK
 */
function learnFromFeedback(userId, query, database, rating, comment = '') {
  if (!userLearningDB.has(userId)) return;
  
  const userData = userLearningDB.get(userId);
  const key = `${query.toLowerCase()}_${database}`;
  
  if (!userData.feedback.has(key)) {
    userData.feedback.set(key, {
      query,
      database,
      ratings: [rating],
      avgRating: rating,
      comments: comment ? [comment] : [],
      timestamp: Date.now()
    });
  } else {
    const feedback = userData.feedback.get(key);
    feedback.ratings.push(rating);
    feedback.avgRating = feedback.ratings.reduce((a, b) => a + b, 0) / feedback.ratings.length;
    if (comment) feedback.comments.push(comment);
    feedback.timestamp = Date.now();
  }
  
  // Adjust confidence based on feedback
  if (rating < 3) {
    // Bad feedback - reduce confidence
    const pattern = userData.patterns.get(key);
    if (pattern) {
      pattern.confidence = Math.max(0.1, pattern.confidence - 0.2);
    }
  }
  
  saveLearningData();
  console.log(`📝 Feedback recorded: ${rating}/5 for "${query}"`);
}

/**
 * ❌ LEARN FROM ERROR
 */
function learnFromError(userId, query, database, errorType, errorMessage) {
  if (!userLearningDB.has(userId)) return;
  
  const userData = userLearningDB.get(userId);
  const key = `${query.toLowerCase()}_${database}`;
  
  if (!userData.errors.has(key)) {
    userData.errors.set(key, {
      query,
      database,
      errors: [{ type: errorType, message: errorMessage, timestamp: Date.now() }],
      frequency: 1
    });
  } else {
    const error = userData.errors.get(key);
    error.errors.push({ type: errorType, message: errorMessage, timestamp: Date.now() });
    error.frequency++;
  }
  
  console.log(`❌ Error logged: ${errorType} for "${query}"`);
}

/**
 * 🧹 CLEANUP OLD PATTERNS (TIME DECAY)
 */
function cleanupOldPatterns(userData, now) {
  const cutoffTime = now - (TIME_DECAY_DAYS * 24 * 60 * 60 * 1000);
  
  // Remove old patterns
  for (const [key, pattern] of userData.patterns.entries()) {
    if (pattern.lastUsed < cutoffTime && pattern.frequency < 5) {
      userData.patterns.delete(key);
    }
  }
  
  // Remove old shortcuts
  for (const [key, shortcut] of userData.shortcuts.entries()) {
    if (shortcut.lastUsed < cutoffTime && shortcut.frequency < 10) {
      userData.shortcuts.delete(key);
    }
  }
  
  console.log(`🧹 Cleaned up old patterns for user`);
}

/**
 * 📊 GET USER STATS
 */
function getUserStats(userId) {
  if (!userLearningDB.has(userId)) {
    return { totalPatterns: 0, totalShortcuts: 0, totalFeedback: 0 };
  }
  
  const userData = userLearningDB.get(userId);
  const now = Date.now();
  const oneWeekAgo = now - (7 * 24 * 60 * 60 * 1000);
  
  let recentPatterns = 0;
  for (const pattern of userData.patterns.values()) {
    if (pattern.lastUsed > oneWeekAgo) recentPatterns++;
  }
  
  const activeShortcuts = Array.from(userData.shortcuts.values())
    .filter(s => s.confidence >= CONFIDENCE_THRESHOLD);
  
  return {
    totalPatterns: userData.patterns.size,
    totalShortcuts: userData.shortcuts.size,
    activeShortcuts: activeShortcuts.length,
    recentPatterns,
    totalFeedback: userData.feedback.size,
    totalErrors: userData.errors.size
  };
}

// Initialize
loadLearningData();

// Auto-save every 10 minutes
setInterval(() => {
  if (userLearningDB.size > 0) {
    saveLearningData();
  }
}, 10 * 60 * 1000);

// Auto-validate every 1 hour
setInterval(() => {
  if (userLearningDB.size > 0) {
    console.log('✅ Running auto-validation...');
    let totalValid = 0;
    let totalInvalid = 0;
    
    for (const [userId] of userLearningDB.entries()) {
      const result = validateLearning(userId);
      totalValid += result.valid;
      totalInvalid += result.invalid;
    }
    
    console.log(`✅ Validation complete: ${totalValid} valid, ${totalInvalid} invalid patterns removed`);
  }
}, 60 * 60 * 1000);

module.exports = {
  learnFromQuery,
  learnFromFeedback,
  learnFromError,
  getPreferredDatabase,
  getShortcut,
  getUserStats,
  saveLearningData
};


/**
 * 🧠 CONTEXT-AWARE LEARNING
 */
function learnFromContext(userId, currentQuery, previousQuery, database, linkedIntent) {
  if (!userLearningDB.has(userId)) return;
  
  const userData = userLearningDB.get(userId);
  const key = `${previousQuery.toLowerCase()}_${currentQuery.toLowerCase()}`;
  
  if (!userData.patterns.has(key)) {
    userData.patterns.set(key, {
      previousQuery,
      currentQuery,
      database,
      linkedIntent,
      frequency: 1,
      lastUsed: Date.now(),
      confidence: 0.5,
      type: 'context_chain'
    });
  } else {
    const pattern = userData.patterns.get(key);
    pattern.frequency++;
    pattern.lastUsed = Date.now();
    pattern.confidence = Math.min(0.95, pattern.confidence + 0.05);
  }
  
  console.log(`🔗 Context learned: "${previousQuery}" → "${currentQuery}"`);
}

/**
 * 🎯 MULTI-INTENT DETECTION
 */
function learnMultiIntent(userId, query, intents, databases) {
  if (!userLearningDB.has(userId)) return;
  
  const userData = userLearningDB.get(userId);
  const key = query.toLowerCase().trim();
  
  if (!userData.patterns.has(key)) {
    userData.patterns.set(key, {
      query,
      intents,
      databases,
      frequency: 1,
      lastUsed: Date.now(),
      confidence: 0.6,
      type: 'multi_intent'
    });
  } else {
    const pattern = userData.patterns.get(key);
    pattern.frequency++;
    pattern.lastUsed = Date.now();
    pattern.confidence = Math.min(0.95, pattern.confidence + 0.05);
  }
  
  console.log(`🎯 Multi-intent learned: "${query}" → ${intents.join(', ')}`);
}

/**
 * ✅ VALIDATE LEARNING
 */
function validateLearning(userId) {
  if (!userLearningDB.has(userId)) return { valid: 0, invalid: 0 };
  
  const userData = userLearningDB.get(userId);
  const now = Date.now();
  let validCount = 0;
  let invalidCount = 0;
  
  // Validate patterns based on feedback
  for (const [key, pattern] of userData.patterns.entries()) {
    const feedback = userData.feedback.get(key);
    
    if (feedback) {
      if (feedback.avgRating >= 4) {
        validCount++;
      } else if (feedback.avgRating < 3) {
        invalidCount++;
        // Remove bad patterns
        if (pattern.confidence < 0.5) {
          userData.patterns.delete(key);
          console.log(`🗑️ Removed invalid pattern: ${key}`);
        }
      }
    }
  }
  
  return { valid: validCount, invalid: invalidCount };
}

/**
 * 🔍 GET CONTEXT SUGGESTION
 */
function getContextSuggestion(userId, currentQuery, previousQuery) {
  if (!userLearningDB.has(userId)) return null;
  
  const userData = userLearningDB.get(userId);
  const key = `${previousQuery.toLowerCase()}_${currentQuery.toLowerCase()}`;
  const pattern = userData.patterns.get(key);
  
  if (pattern && pattern.type === 'context_chain' && pattern.confidence > 0.7) {
    return {
      database: pattern.database,
      linkedIntent: pattern.linkedIntent,
      confidence: pattern.confidence
    };
  }
  
  return null;
}

/**
 * 🎯 DETECT MULTI-INTENT
 */
function detectMultiIntent(userId, query) {
  if (!userLearningDB.has(userId)) return null;
  
  const userData = userLearningDB.get(userId);
  const key = query.toLowerCase().trim();
  const pattern = userData.patterns.get(key);
  
  if (pattern && pattern.type === 'multi_intent' && pattern.confidence > 0.7) {
    return {
      intents: pattern.intents,
      databases: pattern.databases,
      confidence: pattern.confidence
    };
  }
  
  return null;
}

module.exports = {
  learnFromQuery,
  learnFromFeedback,
  learnFromError,
  learnFromContext,
  learnMultiIntent,
  getPreferredDatabase,
  getShortcut,
  getContextSuggestion,
  detectMultiIntent,
  validateLearning,
  getUserStats,
  saveLearningData
};
