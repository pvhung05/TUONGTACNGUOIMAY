const cloudinary = require('cloudinary').v2;
const logger = require('../../logger');

const MAX_SCAN_ITEMS = 500;

class VideoService {
  constructor() {
    this.isConfigured = false;
  }

  configureCloudinary() {
    if (this.isConfigured) return;

    const {
      CLOUDINARY_URL,
      CLOUDINARY_CLOUD_NAME,
      CLOUDINARY_API_KEY,
      CLOUDINARY_API_SECRET,
    } = process.env;

    if (CLOUDINARY_URL) {
      cloudinary.config(CLOUDINARY_URL);
      this.isConfigured = true;
      return;
    }

    if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
      throw new Error('Missing Cloudinary configuration: provide CLOUDINARY_URL or CLOUDINARY_CLOUD_NAME/CLOUDINARY_API_KEY/CLOUDINARY_API_SECRET');
    }

    cloudinary.config({
      cloud_name: CLOUDINARY_CLOUD_NAME,
      api_key: CLOUDINARY_API_KEY,
      api_secret: CLOUDINARY_API_SECRET,
      secure: true,
    });

    this.isConfigured = true;
  }

  async fetchResourcesByPrefix(prefix, resourceType = 'video') {
    this.configureCloudinary();

    const resources = [];
    let nextCursor;

    do {
      const response = await cloudinary.api.resources({
        resource_type: resourceType,
        type: 'upload',
        prefix,
        max_results: 100,
        next_cursor: nextCursor,
      });

      resources.push(...(response.resources || []));
      nextCursor = response.next_cursor;
    } while (nextCursor);

    return resources;
  }

  async fetchAllUploadedVideos(limit = MAX_SCAN_ITEMS) {
    this.configureCloudinary();

    const resources = [];
    let nextCursor;

    do {
      const response = await cloudinary.api.resources({
        resource_type: 'video',
        type: 'upload',
        max_results: 100,
        next_cursor: nextCursor,
      });

      resources.push(...(response.resources || []));
      nextCursor = response.next_cursor;
    } while (nextCursor && resources.length < limit);

    return resources.slice(0, limit);
  }

  getDisplayName(resource) {
    const publicId = String(resource.public_id || '').trim();
    const leafName = String(publicId.split('/').pop() || publicId).trim();
    const rawName = String(resource.display_name || leafName).trim();

    // Remove Cloudinary-style random suffix segment after the last underscore.
    if (!rawName.includes('_')) {
      return rawName;
    }

    return rawName.replace(/_[^_]*$/, '');
  }

  inferNumberGroup(resource) {
    const candidate = this.getDisplayName(resource).toLowerCase();
    const numberAtStart = candidate.match(/^(\d{1,2})/);
    if (numberAtStart) {
      const parsed = parseInt(numberAtStart[1], 10);
      if (parsed >= 1 && parsed <= 20) {
        return String(parsed);
      }
    }

    const numberAnyWhere = candidate.match(/(?:^|[^0-9])(1\d|20|[1-9])(?:[^0-9]|$)/);
    if (!numberAnyWhere) return null;

    const parsed = parseInt(numberAnyWhere[1], 10);
    if (parsed < 1 || parsed > 20) return null;

    return String(parsed);
  }

  inferLetterGroup(resource) {
    const candidate = this.getDisplayName(resource).toLowerCase();
    const letter = candidate.match(/[a-z]/);
    return letter ? letter[0] : null;
  }

  normalizeResource(resource, group) {
    const publicId = String(resource.public_id || '').trim();
    const displayName = this.getDisplayName(resource);

    return {
      id: publicId,
      url: resource.secure_url,
      group: String(group),
      name: displayName,
    };
  }

  async getNumbersVideos() {
    try {
      const resources = await this.fetchAllUploadedVideos();

      return resources
        .map((resource) => {
          const group = this.inferNumberGroup(resource);
          if (!group) return null;
          return this.normalizeResource(resource, group);
        })
        .filter(Boolean)
        .sort((left, right) => {
          const groupDiff = Number(left.group) - Number(right.group);
          if (groupDiff !== 0) return groupDiff;
          return left.name.localeCompare(right.name);
        });
    } catch (error) {
      logger.error('Get numbers videos error:', error.message);
      throw error;
    }
  }

  async getNumberVideos(number) {
    try {
      const normalizedNumber = parseInt(String(number || '').trim(), 10);
      if (!Number.isInteger(normalizedNumber) || normalizedNumber < 1 || normalizedNumber > 20) {
        const validationError = new Error('number must be between 1 and 20');
        validationError.statusCode = 400;
        throw validationError;
      }

      const allNumberVideos = await this.getNumbersVideos();
      return allNumberVideos.filter((item) => Number(item.group) === normalizedNumber);
    } catch (error) {
      logger.error('Get number videos error:', error.message);
      throw error;
    }
  }

  async getAlphabetVideos(letter) {
    try {
      const normalizedLetter = String(letter || '').trim().toLowerCase();

      if (!/^[a-z]$/.test(normalizedLetter)) {
        const validationError = new Error('letter must be a-z');
        validationError.statusCode = 400;
        throw validationError;
      }

      const resources = await this.fetchAllUploadedVideos();

      return resources
        .map((resource) => {
          const group = this.inferLetterGroup(resource);
          if (group !== normalizedLetter) return null;
          return this.normalizeResource(resource, normalizedLetter);
        })
        .filter(Boolean)
        .sort((left, right) => left.name.localeCompare(right.name));
    } catch (error) {
      logger.error('Get alphabet videos error:', error.message);
      throw error;
    }
  }

  async getDebugResources(prefix = '', limit = 20) {
    try {
      const normalizedPrefix = String(prefix || '').trim();
      const normalizedLimit = Math.max(Math.min(parseInt(limit, 10) || 20, 100), 1);

      this.configureCloudinary();

      const [video, raw] = await Promise.all([
        cloudinary.api.resources({
          resource_type: 'video',
          type: 'upload',
          prefix: normalizedPrefix || undefined,
          max_results: normalizedLimit,
        }),
        cloudinary.api.resources({
          resource_type: 'raw',
          type: 'upload',
          prefix: normalizedPrefix || undefined,
          max_results: normalizedLimit,
        }),
      ]);

      const toPreview = (resource) => ({
        publicId: resource.public_id,
        resourceType: resource.resource_type,
        format: resource.format,
        secureUrl: resource.secure_url,
      });

      return {
        prefix: normalizedPrefix,
        limit: normalizedLimit,
        videoCount: Array.isArray(video.resources) ? video.resources.length : 0,
        rawCount: Array.isArray(raw.resources) ? raw.resources.length : 0,
        video: Array.isArray(video.resources) ? video.resources.map(toPreview) : [],
        raw: Array.isArray(raw.resources) ? raw.resources.map(toPreview) : [],
      };
    } catch (error) {
      logger.error('Get debug resources error:', error.message);
      throw error;
    }
  }
}

module.exports = new VideoService();