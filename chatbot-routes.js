const express = require('express');
const router = express.Router();
const ChatbotHandler = require('./chatbot-logic');

const chatbotHandler = new ChatbotHandler();

router.post('/query', async (req, res) => {
  const { question } = req.body;

  if (!question || question.trim() === '') {
    return res.json({
      success: false,
      error: 'Pertanyaan tidak boleh kosong'
    });
  }

  try {
    const result = await chatbotHandler.processMessage(question, req.body.userId || "default", null, req.get('host'));

    // Pastikan result memiliki message
    if (!result || !result.message) {
      return res.json({
        success: false,
        error: 'Response tidak valid dari chatbot'
      });
    }

    res.json({
      success: true,
      result: result,
      source: 'chatbot-logic'
    });

  } catch (error) {
    console.error('❌ Query Error:', error);
    res.json({
      success: false,
      error: 'Terjadi kesalahan pada server',
      details: error.message
    });
  }
});

router.post('/confirmation', async (req, res) => {
  const { originalQuestion, action } = req.body;

  if (!originalQuestion || !action) {
    return res.json({
      success: false,
      error: 'Parameter tidak lengkap'
    });
  }

  try {
    const result = await chatbotHandler.handleConfirmation(originalQuestion, action, req.get('host'));

    if (!result || !result.message) {
      return res.json({
        success: false,
        error: 'Response tidak valid dari chatbot'
      });
    }

    res.json({
      success: true,
      result: result,
      source: 'confirmation'
    });

  } catch (error) {
    console.error('❌ Confirmation Error:', error);
    res.json({
      success: false,
      error: 'Terjadi kesalahan pada server',
      details: error.message
    });
  }
});

router.post('/database-selection', async (req, res) => {
  const { originalQuestion, selectedDatabase, allResults } = req.body;

  if (!originalQuestion || !selectedDatabase || !allResults) {
    return res.json({
      success: false,
      error: 'Parameter tidak lengkap'
    });
  }

  try {
    const result = await chatbotHandler.handleDatabaseSelection(originalQuestion, selectedDatabase, allResults);

    if (!result || !result.message) {
      return res.json({
        success: false,
        error: 'Response tidak valid dari chatbot'
      });
    }

    res.json({
      success: true,
      result: result,
      source: 'database-selection'
    });

  } catch (error) {
    console.error('❌ Database Selection Error:', error);
    res.json({
      success: false,
      error: 'Terjadi kesalahan pada server',
      details: error.message
    });
  }
});

// ================================================================
// FEEDBACK — User memberikan rating untuk respons chatbot
// ================================================================
router.post('/feedback', async (req, res) => {
  const { userId, query, database, rating, comment } = req.body;

  if (!query || rating === undefined) {
    return res.json({
      success: false,
      error: 'Parameter query dan rating wajib diisi'
    });
  }

  try {
    const learningV2 = require('./learning-system-v2');
    learningV2.learnFromFeedback(
      userId || 'default',
      query,
      database || 'unknown',
      Number(rating),
      comment || ''
    );

    console.log(`📝 Feedback received: ${rating}/5 for "${query}" ${comment ? `(${comment})` : ''}`);

    res.json({
      success: true,
      message: 'Terima kasih atas feedback Anda!'
    });
  } catch (error) {
    console.error('❌ Feedback Error:', error);
    res.json({ success: false, error: error.message });
  }
});

// ================================================================
// ANALYTICS — Monitor performa chatbot
// ================================================================
router.get('/analytics', async (req, res) => {
  try {
    const queryCache = require('./core/query-cache');
    const errorMemory = require('./core/error-memory');
    const learningV2 = require('./learning-system-v2');

    let queryPatterns = { queries: [] };
    try {
      const fs = require('fs');
      const qpPath = require('path').join(__dirname, 'query-patterns.json');
      if (fs.existsSync(qpPath)) {
        queryPatterns = JSON.parse(fs.readFileSync(qpPath, 'utf8'));
      }
    } catch (e) { /* silent */ }

    const queries = queryPatterns.queries || [];
    const totalQueries = queries.length;
    const successfulQueries = queries.filter(q => q.successCount > 0).length;

    const analytics = {
      overview: {
        totalUniqueQueries: totalQueries,
        successfulQueries,
        successRate: totalQueries > 0 ? ((successfulQueries / totalQueries) * 100).toFixed(1) + '%' : '0%',
      },
      cache: queryCache.getStats(),
      errors: errorMemory.getStats(),
      learning: learningV2.getUserStats('default'),
      topQueries: queries
        .sort((a, b) => b.count - a.count)
        .slice(0, 10)
        .map(q => ({ query: q.query, count: q.count, successRate: q.count > 0 ? ((q.successCount / q.count) * 100).toFixed(0) + '%' : '0%' })),
      failedQueries: queries
        .filter(q => q.successCount === 0)
        .slice(0, 10)
        .map(q => ({ query: q.query, count: q.count }))
    };

    res.json({ success: true, analytics });
  } catch (error) {
    console.error('❌ Analytics Error:', error);
    res.json({ success: false, error: error.message });
  }
});

// ================================================================
// ADAPTIVE REPORT — Laporan lengkap adaptive learning (Layer 4)
// Panggil ini secara berkala untuk melihat chatbot belajar
// ================================================================
router.get('/adaptive-report', async (req, res) => {
  try {
    const adaptiveLearner = require('./core/adaptive-learner');
    const report = adaptiveLearner.generateReport();
    res.json({ success: true, report });
  } catch (error) {
    console.error('❌ Adaptive Report Error:', error);
    res.json({ success: false, error: error.message });
  }
});

// ================================================================
// SLANG SUGGESTIONS — Saran SLANG baru dari data kegagalan
// Gunakan ini untuk update SLANG_MAP secara otomatis
// ================================================================
router.get('/slang-suggestions', async (req, res) => {
  try {
    const adaptiveLearner = require('./core/adaptive-learner');
    const suggestions = adaptiveLearner.getSuggestedSlangMappings();
    const topFailing = adaptiveLearner.getTopFailingPatterns(20);

    res.json({
      success: true,
      data: {
        slangSuggestions: suggestions,
        topFailingQueries: topFailing,
        instructions: 'Tambahkan item dari slangSuggestions ke SLANG_MAP di preprocessors/input-normalizer.js'
      }
    });
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
});

module.exports = router;
