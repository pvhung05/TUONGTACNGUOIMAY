const Translator = require('./Translator');
const logger = require('../../logger');

class TranslatorService {
  escapeRegex(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  normalizeVideos({ videos, videoUrl, text }) {
    if (Array.isArray(videos) && videos.length > 0) {
      return videos
        .map((item) => ({
          title: String(item?.title || '').trim(),
          url: String(item?.url || '').trim(),
        }))
        .filter((item) => item.url);
    }

    const fallbackUrl = String(videoUrl || '').trim();
    if (!fallbackUrl) {
      return [];
    }

    return [
      {
        title: String(text || '').trim(),
        url: fallbackUrl,
      },
    ];
  }

  rankWordsByRelevance(words, query) {
    const normalized = query.toLowerCase();

    return words
      .map((word) => {
        const text = String(word.title || word.text || '').toLowerCase();
        let score = 0;

        if (text === normalized) {
          score = 3;
        } else if (text.startsWith(normalized)) {
          score = 2;
        } else if (text.includes(normalized)) {
          score = 1;
        }

        return { word, score };
      })
      .filter((item) => item.score > 0)
      .sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        return a.word.text.localeCompare(b.word.text);
      })
      .map((item) => item.word);
  }

  async addWord({ text, title, videoUrl, videos }) {
    try {
      const normalizedTitle = String(title || text || '').trim();
      const normalizedText = normalizedTitle.toLowerCase();
      const normalizedVideos = this.normalizeVideos({ videos, videoUrl, text: normalizedText });

      if (!normalizedText) {
        throw new Error('Please provide text or title');
      }

      if (normalizedVideos.length === 0) {
        throw new Error('Please provide at least one video url');
      }

      // Check if word exists
      const existingWord = await Translator.findOne({ title: normalizedText });
      if (existingWord) {
        throw new Error('Word already exists');
      }

      const word = new Translator({
        title: normalizedTitle || normalizedText,
        videos: normalizedVideos,
      });

      await word.save();
      return word;
    } catch (error) {
      logger.error('Add word error:', error.message);
      throw error;
    }
  }

  async getAllWords(page = 1, limit = 20) {
    try {
      const skip = (page - 1) * limit;
      const words = await Translator.find({})
        .skip(skip)
        .limit(limit)
        .sort({ title: 1 });

      const total = await Translator.countDocuments({});
      const pages = Math.ceil(total / limit);

      return {
        words,
        total,
        page,
        pages,
        // Keep compatibility with both old and new frontend pagination shape.
        pagination: {
          currentPage: page,
          totalPages: pages,
          totalItems: total,
          itemsPerPage: limit,
        },
      };
    } catch (error) {
      logger.error('Get all words error:', error.message);
      throw error;
    }
  }

  async searchWords(searchText, limit = 30) {
    try {
      const query = String(searchText || '').trim();
      if (!query) {
        return [];
      }

      const escapedQuery = this.escapeRegex(query);
      const words = await Translator.find({
        title: { $regex: escapedQuery, $options: 'i' },
      })
        .sort({ title: 1 })
        .limit(Math.max(limit, 1) * 3);

      return this.rankWordsByRelevance(words, query).slice(0, Math.max(limit, 1));
    } catch (error) {
      logger.error('Search words error:', error.message);
      throw error;
    }
  }

  async getDictionaryEntries(searchText = '', limit = 30) {
    try {
      const normalizedLimit = Math.max(parseInt(limit, 10) || 30, 1);
      const query = String(searchText || '').trim();

      if (!query) {
        return await Translator.find({}).sort({ title: 1 }).limit(normalizedLimit);
      }

      return await this.searchWords(query, normalizedLimit);
    } catch (error) {
      logger.error('Get dictionary entries error:', error.message);
      throw error;
    }
  }

  async getWordById(wordId) {
    try {
      const word = await Translator.findById(wordId);
      if (!word) {
        throw new Error('Word not found');
      }
      return word;
    } catch (error) {
      logger.error('Get word error:', error.message);
      throw error;
    }
  }
}

module.exports = new TranslatorService();
