// src/models/Link.js - Link model for database operations
const { query } = require('./db');

class Link {
  // Create a new link
  static async create(code, originalUrl) {
    const result = await query(
      'INSERT INTO links (code, original_url) VALUES ($1, $2) RETURNING *',
      [code, originalUrl]
    );
    return result.rows[0];
  }

  // Find all links
  static async findAll(limit = 100, offset = 0) {
    const result = await query(
      'SELECT * FROM links ORDER BY created_at DESC LIMIT $1 OFFSET $2',
      [limit, offset]
    );
    return result.rows;
  }

  // Find link by code
  static async findByCode(code) {
    const result = await query(
      'SELECT * FROM links WHERE code = $1',
      [code]
    );
    return result.rows[0] || null;
  }

  // Check if code exists
  static async codeExists(code) {
    const result = await query(
      'SELECT EXISTS(SELECT 1 FROM links WHERE code = $1)',
      [code]
    );
    return result.rows[0].exists;
  }

  // Increment click count and update last clicked timestamp
  static async incrementClickCount(code) {
    const result = await query(
      'UPDATE links SET click_count = click_count + 1, last_clicked_at = CURRENT_TIMESTAMP WHERE code = $1 RETURNING *',
      [code]
    );
    return result.rows[0];
  }

  // Delete link by code
  static async deleteByCode(code) {
    const result = await query(
      'DELETE FROM links WHERE code = $1 RETURNING *',
      [code]
    );
    return result.rows[0] || null;
  }

  // Get total count
  static async count() {
    const result = await query('SELECT COUNT(*) FROM links');
    return parseInt(result.rows[0].count);
  }

  // Get stats
  static async getStats() {
    const result = await query(`
      SELECT
        COUNT(*) as total_links,
        SUM(click_count) as total_clicks,
        AVG(click_count) as avg_clicks_per_link,
        MAX(click_count) as max_clicks
      FROM links
    `);
    return result.rows[0];
  }
}

module.exports = Link;
