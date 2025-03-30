import { Octokit } from 'octokit';
import type { GitHubFollower } from './types';

const API_VERSION = '2022-11-28';
const PER_PAGE_DEFAULT = 100;

export class GitHubAPI {
  private octokit: Octokit;

  constructor(auth: string) {
    this.octokit = new Octokit({ auth });
  }

  private getHeaders() {
    return {
      'X-GitHub-Api-Version': API_VERSION,
      // Prevent caching by adding a timestamp
      'If-None-Match': '',
    };
  }

  async getFollowers(): Promise<GitHubFollower[]> {
    return this.octokit.paginate<GitHubFollower>('GET /user/followers', {
      headers: this.getHeaders(),
      per_page: PER_PAGE_DEFAULT,
    });
  }

  async getFollowing(): Promise<GitHubFollower[]> {
    return this.octokit.paginate<GitHubFollower>('GET /user/following', {
      headers: this.getHeaders(),
      per_page: PER_PAGE_DEFAULT,
    });
  }

  async unfollowUser(username: string) {
    await this.octokit.request('DELETE /user/following/{username}', {
      username,
      headers: this.getHeaders(),
    });
  }

  async followUser(username: string) {
    await this.octokit.request('PUT /user/following/{username}', {
      username,
      headers: this.getHeaders(),
    });
  }
}
