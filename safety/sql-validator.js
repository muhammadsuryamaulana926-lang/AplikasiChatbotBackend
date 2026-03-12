// ================================================================
// SQL VALIDATOR — Validasi SQL terhadap schema sebelum eksekusi
// Anti halusinasi SQL: cek tabel, kolom, keamanan, dan LIMIT
// ================================================================

class SQLValidator {
    constructor() {
        this.schemaCache = null; // Akan di-set dari luar
    }

    /**
     * Set schema cache reference (dari chatbot-logic)
     */
    setSchemaCache(cache) {
        this.schemaCache = cache;
    }

    /**
     * VALIDASI UTAMA — Cek SQL terhadap schema database
     * @returns {{ valid: boolean, errors: string[], warnings: string[], fixedSQL: string|null }}
     */
    validate(sql, database) {
        if (!sql || typeof sql !== 'string') {
            return { valid: false, errors: ['SQL kosong atau tidak valid'], warnings: [], fixedSQL: null };
        }

        const schema = this.schemaCache?.[database];
        if (!schema) {
            return { valid: false, errors: [`Schema untuk database "${database}" tidak ditemukan di cache`], warnings: [], fixedSQL: null };
        }

        const errors = [];
        const warnings = [];
        let fixedSQL = sql;

        // 1. BASIC SAFETY CHECK — harus SELECT, tidak boleh DML
        const safetyResult = this.checkSafety(sql);
        if (!safetyResult.safe) {
            return { valid: false, errors: safetyResult.errors, warnings: [], fixedSQL: null };
        }

        // 2. CEK TABEL — apakah semua tabel yang direferensikan ada di schema?
        const validTables = Object.keys(schema);
        let referencedTables = this.extractTables(sql);

        // Normalize referenced tables (strip db prefix like itb_db.table)
        referencedTables = referencedTables.map(table => {
            if (table.includes('.')) {
                const parts = table.split('.');
                const cleanName = parts.pop();
                // If it matched db.table or public.table, fix it in SQL
                fixedSQL = fixedSQL.replace(new RegExp(`\\b${this.escapeRegex(table)}\\b`, 'g'), cleanName);
                return cleanName;
            }
            return table;
        });

        for (const table of referencedTables) {
            if (!validTables.includes(table)) {
                // Coba fuzzy match
                const closest = this.findClosestMatch(table, validTables);
                if (closest) {
                    warnings.push(`Tabel "${table}" tidak ditemukan, mungkin maksudnya "${closest}"`);
                    fixedSQL = fixedSQL.replace(new RegExp(`\\b${this.escapeRegex(table)}\\b`, 'g'), closest);
                } else {
                    errors.push(`Tabel "${table}" tidak ada di database "${database}". Tabel yang tersedia: ${validTables.join(', ')}`);
                }
            }
        }

        // 3. CEK KOLOM — apakah semua kolom yang direferensikan ada di tabel yang benar?
        for (const table of referencedTables) {
            const actualTable = validTables.includes(table) ? table : this.findClosestMatch(table, validTables);
            if (!actualTable || !schema[actualTable]) continue;

            const validColumns = this.getColumnNames(schema[actualTable].columns);
            const referencedColumns = this.extractColumnsForTable(sql, table);

            for (const col of referencedColumns) {
                if (col === '*' || col.includes('(') || col.includes('.')) continue; // Skip wildcard, functions, qualified names

                if (!validColumns.includes(col)) {
                    const closest = this.findClosestMatch(col, validColumns);
                    if (closest) {
                        warnings.push(`Kolom "${col}" tidak ditemukan di tabel "${actualTable}", diperbaiki ke "${closest}"`);
                        // Fix kolom — hati-hati hanya replace yang bukan bagian dari string/value
                        fixedSQL = this.replaceColumnName(fixedSQL, col, closest);
                    } else {
                        errors.push(`Kolom "${col}" tidak ada di tabel "${actualTable}". Kolom yang tersedia: ${validColumns.join(', ')}`);
                    }
                }
            }
        }

        // 4. CEK LIMIT — query non-aggregate HARUS punya LIMIT
        if (!this.isAggregateOnly(sql) && !sql.match(/LIMIT\s+\d+/i)) {
            warnings.push('Query non-aggregate tanpa LIMIT — ditambahkan LIMIT 10');
            fixedSQL = fixedSQL.replace(/;?\s*$/, '') + ' LIMIT 10';
        }

        // 5. CEK LIMIT BERLEBIHAN
        const limitMatch = fixedSQL.match(/LIMIT\s+(\d+)/i);
        if (limitMatch) {
            const limit = parseInt(limitMatch[1]);
            if (limit > 100 && !this.isAggregateOnly(sql)) {
                warnings.push(`LIMIT ${limit} terlalu besar, diperkecil ke 100`);
                fixedSQL = fixedSQL.replace(/LIMIT\s+\d+/i, 'LIMIT 100');
            }
        }

        // 6. CEK SQL INJECTION PATTERNS
        const injectionResult = this.checkInjection(sql);
        if (!injectionResult.safe) {
            errors.push(...injectionResult.errors);
        }

        // Jika ada error di tabel/kolom yang tidak bisa di-fix, SQL tidak valid
        const hasFixedSQL = fixedSQL !== sql && errors.length === 0;

        return {
            valid: errors.length === 0,
            errors,
            warnings,
            fixedSQL: hasFixedSQL ? fixedSQL : (errors.length === 0 ? sql : null)
        };
    }

    /**
     * CEK KEAMANAN SQL — hanya SELECT yang diizinkan
     */
    checkSafety(sql) {
        const errors = [];
        const lower = sql.toLowerCase().trim();

        // Harus dimulai dengan SELECT atau WITH (CTE)
        if (!lower.startsWith('select') && !lower.startsWith('with')) {
            errors.push('SQL harus dimulai dengan SELECT atau WITH');
        }

        // Tidak boleh mengandung DML/DDL
        const forbidden = [
            { pattern: /\b(INSERT\s+INTO)\b/i, name: 'INSERT' },
            { pattern: /\b(UPDATE\s+\w+\s+SET)\b/i, name: 'UPDATE' },
            { pattern: /\b(DELETE\s+FROM)\b/i, name: 'DELETE' },
            { pattern: /\b(DROP\s+(TABLE|DATABASE|INDEX))\b/i, name: 'DROP' },
            { pattern: /\b(ALTER\s+TABLE)\b/i, name: 'ALTER' },
            { pattern: /\b(TRUNCATE)\b/i, name: 'TRUNCATE' },
            { pattern: /\b(CREATE\s+(TABLE|DATABASE|INDEX))\b/i, name: 'CREATE' },
            { pattern: /\b(GRANT|REVOKE)\b/i, name: 'GRANT/REVOKE' },
            { pattern: /\b(EXEC|EXECUTE)\s*\(/i, name: 'EXEC' },
            { pattern: /\bINTO\s+(OUTFILE|DUMPFILE)\b/i, name: 'FILE EXPORT' },
            { pattern: /\bLOAD_FILE\s*\(/i, name: 'LOAD_FILE' }
        ];

        for (const { pattern, name } of forbidden) {
            if (pattern.test(sql)) {
                errors.push(`Perintah ${name} tidak diizinkan — hanya SELECT yang diperbolehkan`);
            }
        }

        return { safe: errors.length === 0, errors };
    }

    /**
     * CEK SQL INJECTION PATTERNS
     */
    checkInjection(sql) {
        const errors = [];
        const suspicious = [
            { pattern: /;\s*(SELECT|INSERT|UPDATE|DELETE|DROP)/i, name: 'Multiple statements' },
            { pattern: /UNION\s+(ALL\s+)?SELECT/i, name: 'UNION injection' },
            { pattern: /--\s*$/m, name: 'SQL comment injection' },
            { pattern: /\/\*[\s\S]*?\*\//g, name: 'Block comment injection' },
            { pattern: /\bSLEEP\s*\(/i, name: 'Time-based injection (SLEEP)' },
            { pattern: /\bBENCHMARK\s*\(/i, name: 'Time-based injection (BENCHMARK)' },
            { pattern: /\bINFORMATION_SCHEMA\b/i, name: 'Schema enumeration' }
        ];

        for (const { pattern, name } of suspicious) {
            if (pattern.test(sql)) {
                errors.push(`Pola mencurigakan terdeteksi: ${name}`);
            }
        }

        return { safe: errors.length === 0, errors };
    }

    /**
     * EXTRACT nama tabel dari SQL (mendukung db.table)
     */
    extractTables(sql) {
        const tables = new Set();
        // Regex untuk menangkap nama tabel, termasuk yang ada prefix database (misal: itb_db.kekayaan_intelektual)
        const fromMatches = sql.match(/\b(?:FROM|JOIN)\s+(?:`?([\w.]+?)`?)\b/gi) || [];
        
        for (const m of fromMatches) {
            const name = m.replace(/\b(?:FROM|JOIN)\s+`?/i, '').replace(/`/g, '').trim();
            if (name && !this.isSQLKeyword(name)) tables.add(name);
        }

        return Array.from(tables);
    }

    /**
     * EXTRACT kolom yang direferensikan untuk tabel tertentu
     */
    extractColumnsForTable(sql, table) {
        const columns = new Set();

        // Kolom di SELECT clause
        const selectMatch = sql.match(/SELECT\s+([\s\S]+?)\s+FROM/i);
        if (selectMatch) {
            const selectPart = selectMatch[1];
            // Parse setiap item di SELECT
            const items = this.splitSelectItems(selectPart);
            for (const item of items) {
                const cols = this.extractColumnReferences(item);
                cols.forEach(c => columns.add(c));
            }
        }

        // Kolom di WHERE clause
        const whereMatch = sql.match(/WHERE\s+([\s\S]+?)(?:\s+GROUP|\s+ORDER|\s+LIMIT|\s+HAVING|$)/i);
        if (whereMatch) {
            const cols = this.extractColumnReferences(whereMatch[1]);
            cols.forEach(c => columns.add(c));
        }

        // Kolom di ORDER BY
        const orderMatch = sql.match(/ORDER\s+BY\s+([\s\S]+?)(?:\s+LIMIT|$)/i);
        if (orderMatch) {
            const cols = this.extractColumnReferences(orderMatch[1]);
            cols.forEach(c => columns.add(c));
        }

        // Kolom di GROUP BY
        const groupMatch = sql.match(/GROUP\s+BY\s+([\s\S]+?)(?:\s+HAVING|\s+ORDER|\s+LIMIT|$)/i);
        if (groupMatch) {
            const cols = this.extractColumnReferences(groupMatch[1]);
            cols.forEach(c => columns.add(c));
        }

        // Remove SQL keywords, functions, numbers, strings
        const cleaned = new Set();
        for (const col of columns) {
            const c = col.trim().replace(/`/g, '');
            if (c && c !== '*' && !this.isSQLKeyword(c) && !c.match(/^\d+$/) && !c.match(/^['"]/) && c.length > 1) {
                cleaned.add(c);
            }
        }

        return Array.from(cleaned);
    }

    /**
     * Extract column references dari ekspresi SQL
     */
    extractColumnReferences(expr) {
        const columns = [];
        if (!expr) return columns;

        // Remove string literals
        const cleaned = expr.replace(/'[^']*'/g, '').replace(/"[^"]*"/g, '');

        // Match identifiers (bukan di dalam fungsi arguments yang berupa string)
        const matches = cleaned.match(/\b([a-zA-Z_][a-zA-Z0-9_]*)\b/g) || [];

        const sqlFunctions = ['COUNT', 'SUM', 'AVG', 'MIN', 'MAX', 'DISTINCT', 'AS', 'AND', 'OR', 'NOT',
            'NULL', 'IS', 'LIKE', 'IN', 'BETWEEN', 'CASE', 'WHEN', 'THEN', 'ELSE', 'END',
            'ASC', 'DESC', 'YEAR', 'MONTH', 'DAY', 'DATE', 'NOW', 'CONCAT', 'GROUP_CONCAT',
            'UPPER', 'LOWER', 'TRIM', 'SUBSTRING', 'LENGTH', 'COALESCE', 'IFNULL', 'IF',
            'HAVING', 'EXISTS', 'ANY', 'ALL', 'SOME', 'TRUE', 'FALSE', 'SEPARATOR',
            'SELECT', 'FROM', 'WHERE', 'GROUP', 'BY', 'ORDER', 'LIMIT', 'OFFSET',
            'LEFT', 'RIGHT', 'INNER', 'OUTER', 'JOIN', 'ON', 'USING', 'CROSS',
            'UNION', 'EXCEPT', 'INTERSECT', 'WITH', 'RECURSIVE', 'OVER', 'PARTITION',
            'SUBQUERY_COUNT', 'TOTAL', 'JUMLAH', 'TAHUN', 'TKT'];

        for (const m of matches) {
            if (!sqlFunctions.includes(m.toUpperCase()) && !m.match(/^\d/)) {
                columns.push(m);
            }
        }

        return columns;
    }

    /**
     * Split SELECT items dengan awareness terhadap nested parentheses
     */
    splitSelectItems(selectPart) {
        const items = [];
        let depth = 0;
        let current = '';

        for (const char of selectPart) {
            if (char === '(') depth++;
            if (char === ')') depth--;
            if (char === ',' && depth === 0) {
                items.push(current.trim());
                current = '';
            } else {
                current += char;
            }
        }
        if (current.trim()) items.push(current.trim());
        return items;
    }

    /**
     * CEK apakah query hanya aggregate (COUNT, SUM, dll tanpa GROUP BY yg besar)
     */
    isAggregateOnly(sql) {
        const lower = sql.toLowerCase();
        // Query yang murni aggregate: SELECT COUNT/SUM/AVG/MIN/MAX tanpa non-aggregate columns
        if (lower.match(/^\s*select\s+(count|sum|avg|min|max)\s*\(/i)) {
            // Cek apakah tidak ada GROUP BY, atau GROUP BY dengan LIMIT
            if (!lower.includes('group by')) return true;
        }
        return false;
    }

    /**
     * Get nama-nama kolom dari string schema
     * Input: "id (int), judul (varchar(255)), status_ki (varchar(50))"
     * Output: ["id", "judul", "status_ki"]
     */
    getColumnNames(columnsStr) {
        if (!columnsStr) return [];
        return columnsStr.split(',').map(c => {
            const match = c.trim().match(/^(\w+)/);
            return match ? match[1] : null;
        }).filter(Boolean);
    }

    /**
     * FUZZY MATCH — cari nama paling mirip (Levenshtein distance ≤ 3)
     */
    findClosestMatch(input, candidates) {
        if (!input || !candidates.length) return null;

        const inputLower = input.toLowerCase();
        let bestMatch = null;
        let bestDistance = Infinity;

        for (const candidate of candidates) {
            const candidateLower = candidate.toLowerCase();

            // Exact match (case-insensitive)
            if (inputLower === candidateLower) return candidate;

            // Substring match
            if (candidateLower.includes(inputLower) || inputLower.includes(candidateLower)) {
                const dist = Math.abs(candidateLower.length - inputLower.length);
                if (dist < bestDistance) {
                    bestDistance = dist;
                    bestMatch = candidate;
                }
                continue;
            }

            // Levenshtein distance
            const dist = this.levenshtein(inputLower, candidateLower);
            if (dist <= 3 && dist < bestDistance) {
                bestDistance = dist;
                bestMatch = candidate;
            }
        }

        return bestMatch;
    }

    /**
     * Levenshtein Distance
     */
    levenshtein(a, b) {
        const m = a.length, n = b.length;
        const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
        for (let i = 0; i <= m; i++) dp[i][0] = i;
        for (let j = 0; j <= n; j++) dp[0][j] = j;
        for (let i = 1; i <= m; i++) {
            for (let j = 1; j <= n; j++) {
                dp[i][j] = Math.min(
                    dp[i - 1][j] + 1,
                    dp[i][j - 1] + 1,
                    dp[i - 1][j - 1] + (a[i - 1] !== b[j - 1] ? 1 : 0)
                );
            }
        }
        return dp[m][n];
    }

    /**
     * Replace column name di SQL dengan awareness terhadap string literals
     */
    replaceColumnName(sql, oldCol, newCol) {
        // Hanya replace identifier, bukan bagian dari string
        const regex = new RegExp(`(?<!['\"])\\b${this.escapeRegex(oldCol)}\\b(?!['\"])`, 'g');
        return sql.replace(regex, newCol);
    }

    /**
     * CEK apakah kata adalah SQL keyword
     */
    isSQLKeyword(word) {
        const keywords = [
            'SELECT', 'FROM', 'WHERE', 'AND', 'OR', 'NOT', 'IN', 'LIKE', 'BETWEEN',
            'JOIN', 'LEFT', 'RIGHT', 'INNER', 'OUTER', 'ON', 'AS', 'IS', 'NULL',
            'ORDER', 'BY', 'GROUP', 'HAVING', 'LIMIT', 'OFFSET', 'DISTINCT',
            'COUNT', 'SUM', 'AVG', 'MIN', 'MAX', 'UNION', 'ALL', 'EXISTS',
            'CASE', 'WHEN', 'THEN', 'ELSE', 'END', 'ASC', 'DESC', 'SET',
            'TRUE', 'FALSE', 'WITH', 'RECURSIVE', 'OVER', 'PARTITION',
            'SEPARATOR', 'GROUP_CONCAT', 'CONCAT', 'COALESCE', 'IFNULL',
            'YEAR', 'MONTH', 'DAY', 'DATE', 'NOW', 'SUBSTRING', 'TRIM'
        ];
        return keywords.includes(word.toUpperCase());
    }

    escapeRegex(str) {
        return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    /**
     * RINGKASAN VALIDASI — untuk logging
     */
    summarize(result) {
        if (result.valid) {
            const warns = result.warnings.length > 0 ? ` (${result.warnings.length} warning)` : '';
            return `✅ SQL Valid${warns}`;
        }
        return `❌ SQL Invalid: ${result.errors.join('; ')}`;
    }
}

module.exports = new SQLValidator();
