const client = require('./client');
const util = require('util');

async function getAllVideoGames() {
  try {
      const queryResult = await client.query('SELECT * FROM video_games');
      const videoGames = queryResult.rows;
      return videoGames;
  } catch (error) {
      throw new Error("An error occurred while fetching video games from the database.");
  }
}

async function getVideoGameById(id) {
    try {
        const { rows: [videoGame] } = await client.query(`
            SELECT * FROM video_games
            WHERE id = $1;
        `, [id]);
        return videoGame;
    } catch (error) {
        throw new Error("An error occurred while fetching the video game from the database.");
    }
}

async function createVideoGame(body) {
    try {
        const { title, release_year, publisher } = body;
        const query = `
            INSERT INTO video_games (title, release_year, publisher)
            VALUES ($1, $2, $3)
            RETURNING *;
        `;
        const { rows: [newVideoGame] } = await client.query(query, [title, release_year, publisher]);
        return newVideoGame;
    } catch (error) {
        throw new Error("An error occurred while creating the new video game.");
    }
}

async function updateVideoGame(id, fields = {}) {
    const { title, release_year, publisher } = fields;
    const setExpressions = [];
    const values = [];

    if (title) {
        setExpressions.push(`title = $${values.push(title)}`);
    }
    if (release_year) {
        setExpressions.push(`release_year = $${values.push(release_year)}`);
    }
    if (publisher) {
        setExpressions.push(`publisher = $${values.push(publisher)}`);
    }

    values.push(id);

    const setClause = setExpressions.join(', ');

    try {
        const query = `
            UPDATE video_games
            SET ${setClause}
            WHERE id = $${values.length}
            RETURNING *;
        `;
        const { rows: [updatedVideoGame] } = await client.query(query, values);
        return updatedVideoGame;
    } catch (error) {
        throw new Error("An error occurred while updating the video game.");
    }
}

async function deleteVideoGame(id) {
    try {
        const query = `
            DELETE FROM video_games
            WHERE id = $1;
        `;
        await client.query(query, [id]);
        return { message: 'Video game deleted successfully.' };
    } catch (error) {
        throw new Error("An error occurred while deleting the video game.");
    }
}

module.exports = {
    getAllVideoGames,
    getVideoGameById,
    createVideoGame,
    updateVideoGame,
    deleteVideoGame
}