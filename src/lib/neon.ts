/**
 * Neon Database Integration (Stub)
 * 
 * Prepared for future database sync but currently uses localStorage.
 * To activate: Add VITE_NEON_DATABASE_URL to .env
 * 
 * Install: npm install @neondatabase/serverless
 */

// Uncomment when ready to use Neon:
// import { neon } from '@neondatabase/serverless';
// export const sql = neon(import.meta.env.VITE_NEON_DATABASE_URL || '');

const NEON_ENABLED = false; // Set to true when database is configured

/**
 * Save a liked tip to database
 * Currently uses localStorage, ready for Neon migration
 */
export const saveLike = async (tipId: string, tipData: any): Promise<boolean> => {
  if (!NEON_ENABLED) {
    // localStorage implementation (current)
    try {
      const stored = localStorage.getItem('zz-liked-tips');
      const likes = stored ? JSON.parse(stored) : {};
      likes[tipId] = {
        ...tipData,
        likedAt: new Date().toISOString(),
      };
      localStorage.setItem('zz-liked-tips', JSON.stringify(likes));
      return true;
    } catch (error) {
      console.error('Error saving like:', error);
      return false;
    }
  }

  // Future Neon implementation:
  /*
  try {
    await sql`
      INSERT INTO likes (tip_id, tip_data, user_id, created_at)
      VALUES (${tipId}, ${JSON.stringify(tipData)}, ${getUserId()}, NOW())
      ON CONFLICT (tip_id, user_id) DO NOTHING
    `;
    return true;
  } catch (error) {
    console.error('Neon error:', error);
    return false;
  }
  */

  return false;
};

/**
 * Get all liked tips for current user
 * Currently uses localStorage, ready for Neon migration
 */
export const getLikes = async (): Promise<Record<string, any>> => {
  if (!NEON_ENABLED) {
    // localStorage implementation (current)
    try {
      const stored = localStorage.getItem('zz-liked-tips');
      return stored ? JSON.parse(stored) : {};
    } catch (error) {
      console.error('Error loading likes:', error);
      return {};
    }
  }

  // Future Neon implementation:
  /*
  try {
    const result = await sql`
      SELECT tip_id, tip_data, created_at
      FROM likes
      WHERE user_id = ${getUserId()}
      ORDER BY created_at DESC
    `;
    
    return result.reduce((acc, row) => {
      acc[row.tip_id] = {
        ...row.tip_data,
        likedAt: row.created_at,
      };
      return acc;
    }, {});
  } catch (error) {
    console.error('Neon error:', error);
    return {};
  }
  */

  return {};
};

/**
 * Remove a like
 */
export const removeLike = async (tipId: string): Promise<boolean> => {
  if (!NEON_ENABLED) {
    // localStorage implementation (current)
    try {
      const stored = localStorage.getItem('zz-liked-tips');
      const likes = stored ? JSON.parse(stored) : {};
      delete likes[tipId];
      localStorage.setItem('zz-liked-tips', JSON.stringify(likes));
      return true;
    } catch (error) {
      console.error('Error removing like:', error);
      return false;
    }
  }

  // Future Neon implementation:
  /*
  try {
    await sql`
      DELETE FROM likes
      WHERE tip_id = ${tipId} AND user_id = ${getUserId()}
    `;
    return true;
  } catch (error) {
    console.error('Neon error:', error);
    return false;
  }
  */

  return false;
};

/**
 * Save user profile data
 * Stub for future implementation
 */
export const saveUser = async (userData: any): Promise<boolean> => {
  if (!NEON_ENABLED) {
    // localStorage implementation (current)
    try {
      localStorage.setItem('zz-user-profile', JSON.stringify({
        ...userData,
        updatedAt: new Date().toISOString(),
      }));
      return true;
    } catch (error) {
      console.error('Error saving user:', error);
      return false;
    }
  }

  // Future Neon implementation:
  /*
  try {
    await sql`
      INSERT INTO users (id, profile_data, updated_at)
      VALUES (${getUserId()}, ${JSON.stringify(userData)}, NOW())
      ON CONFLICT (id) DO UPDATE
      SET profile_data = ${JSON.stringify(userData)}, updated_at = NOW()
    `;
    return true;
  } catch (error) {
    console.error('Neon error:', error);
    return false;
  }
  */

  return false;
};

/**
 * Get user profile data
 */
export const getUser = async (): Promise<any | null> => {
  if (!NEON_ENABLED) {
    // localStorage implementation (current)
    try {
      const stored = localStorage.getItem('zz-user-profile');
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error('Error loading user:', error);
      return null;
    }
  }

  // Future Neon implementation:
  /*
  try {
    const result = await sql`
      SELECT profile_data, updated_at
      FROM users
      WHERE id = ${getUserId()}
      LIMIT 1
    `;
    
    return result[0] ? {
      ...result[0].profile_data,
      updatedAt: result[0].updated_at,
    } : null;
  } catch (error) {
    console.error('Neon error:', error);
    return null;
  }
  */

  return null;
};

/**
 * Save journey result to history
 * Stub for future analytics
 */
export const saveJourneyHistory = async (
  journey: string,
  answers: any,
  results: any
): Promise<boolean> => {
  if (!NEON_ENABLED) {
    // localStorage implementation (current)
    try {
      const stored = localStorage.getItem('zz-journey-history');
      const history = stored ? JSON.parse(stored) : [];
      history.unshift({
        journey,
        answers,
        results,
        completedAt: new Date().toISOString(),
      });
      // Keep last 50 journeys
      localStorage.setItem('zz-journey-history', JSON.stringify(history.slice(0, 50)));
      return true;
    } catch (error) {
      console.error('Error saving journey:', error);
      return false;
    }
  }

  // Future Neon implementation:
  /*
  try {
    await sql`
      INSERT INTO journey_history (user_id, journey_type, answers, results, completed_at)
      VALUES (${getUserId()}, ${journey}, ${JSON.stringify(answers)}, ${JSON.stringify(results)}, NOW())
    `;
    return true;
  } catch (error) {
    console.error('Neon error:', error);
    return false;
  }
  */

  return false;
};

/**
 * Get journey history for user
 */
export const getJourneyHistory = async (): Promise<any[]> => {
  if (!NEON_ENABLED) {
    // localStorage implementation (current)
    try {
      const stored = localStorage.getItem('zz-journey-history');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading history:', error);
      return [];
    }
  }

  // Future Neon implementation:
  /*
  try {
    const result = await sql`
      SELECT journey_type, answers, results, completed_at
      FROM journey_history
      WHERE user_id = ${getUserId()}
      ORDER BY completed_at DESC
      LIMIT 50
    `;
    
    return result.map(row => ({
      journey: row.journey_type,
      answers: row.answers,
      results: row.results,
      completedAt: row.completed_at,
    }));
  } catch (error) {
    console.error('Neon error:', error);
    return [];
  }
  */

  return [];
};

/**
 * Helper: Get current user ID
 * Stub - implement proper auth when needed
 */
function getUserId(): string {
  // For now, use a session-based ID stored in localStorage
  let userId = localStorage.getItem('zz-user-id');
  if (!userId) {
    userId = `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('zz-user-id', userId);
  }
  return userId;
}

/**
 * Database schema for future Neon setup:
 * 
 * CREATE TABLE users (
 *   id TEXT PRIMARY KEY,
 *   profile_data JSONB NOT NULL,
 *   created_at TIMESTAMP DEFAULT NOW(),
 *   updated_at TIMESTAMP DEFAULT NOW()
 * );
 * 
 * CREATE TABLE likes (
 *   id SERIAL PRIMARY KEY,
 *   user_id TEXT REFERENCES users(id),
 *   tip_id TEXT NOT NULL,
 *   tip_data JSONB NOT NULL,
 *   created_at TIMESTAMP DEFAULT NOW(),
 *   UNIQUE(user_id, tip_id)
 * );
 * 
 * CREATE TABLE journey_history (
 *   id SERIAL PRIMARY KEY,
 *   user_id TEXT REFERENCES users(id),
 *   journey_type TEXT NOT NULL,
 *   answers JSONB NOT NULL,
 *   results JSONB NOT NULL,
 *   completed_at TIMESTAMP DEFAULT NOW()
 * );
 * 
 * CREATE INDEX idx_likes_user ON likes(user_id);
 * CREATE INDEX idx_history_user ON journey_history(user_id);
 */
