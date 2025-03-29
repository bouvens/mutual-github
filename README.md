# Mutual GitHub Followers and Non-Mutual

It is a micro project to help you find mutual and not mutual followers on GitHub. This uses GitHub's official API with a personal access token.

![Demo screenshot](https://raw.githubusercontent.com/bouvens/mutual-github/main/screenshot.png)

## Getting Started

First, clone the project and install dependencies:

```bash
npm install
```

Then run the development server:

```bash
npm run dev
```

Open [http://localhost:3001](http://localhost:3001) with your browser to see the result.

## GitHub Token

The application will prompt you to enter your GitHub token on first launch. You can generate a new token in your [GitHub Settings](https://github.com/settings/tokens).

Required token scopes:

- `read:user`
- `user:follow`

The token will be stored only in your browser's local storage and is sent only to GitHub API directly. You can update or change the token at any time using the "Update Token" button.

## Development

Start editing the page by modifying files in `app` directory. The page auto-updates as you edit the files.

## Links

- GitHub API for [followers](https://docs.github.com/en/rest/users/followers)
- GitHub API for [pagination](https://docs.github.com/en/rest/using-the-rest-api/using-pagination-in-the-rest-api)
- <a target="_blank" href="https://icons8.com/icon/92484/safety-collection-place">Connections</a> icon by <a target="_blank" href="https://icons8.com">Icons8</a>
