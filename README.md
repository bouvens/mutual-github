# Mutual and Non-Mutual GitHub Followers

A tiny application for managing mutual and non-mutual GitHub followers. This uses GitHub's official API with a personal access token.

![Demo screenshot](https://raw.githubusercontent.com/bouvens/mutual-github/main/screenshot.png)

## [➡️ Try Live Demo](https://bouvens.github.io/mutual-github/)

You can see a live demo
at [<img src="https://raw.githubusercontent.com/bouvens/mutual-github/main/public/favicon.ico" width=16 height=16> https://bouvens.github.io/mutual-github/](https://bouvens.github.io/mutual-github/)

## Features

- **Mutual Following** - users who you follow and who follow you back
- **Non-Mutual Following** - users who you follow but they don't follow you back
  - Ability to mass unfollow selected users
  - Saves selection state between sessions
- **Not Followed Followers** - users who follow you but you don't follow them
  - Ability to follow all such users with a single click

## Getting Started

Clone the project and install dependencies:

```bash
npm install
```

Then run the development server:

```bash
npm run dev
```

Open [http://localhost:3001](http://localhost:3001) with your browser.

## GitHub Token

The application will prompt you to enter your GitHub token on first launch. You can generate a new token in your [GitHub Settings](https://github.com/settings/tokens).

Required token scopes:

- `read:user` - for retrieving follower information
- `user:follow` - for managing follows

The token will be stored only in your browser's local storage and is sent only to GitHub API directly. You can update or change the token at any time using the "Update Token" button.

## Development

The project is built with Next.js and configured for export to static HTML/CSS/JS.

- For development mode: `npm run dev`
- For building static export: `npm run build`
- For code formatting: `npm run format`
- For linting: `npm run lint`

## Links

- GitHub API for [followers](https://docs.github.com/en/rest/users/followers)
- GitHub API for [pagination](https://docs.github.com/en/rest/using-the-rest-api/using-pagination-in-the-rest-api)
- <a target="_blank" href="https://icons8.com/icon/92484/safety-collection-place">Connections</a> icon by <a target="_blank" href="https://icons8.com">Icons8</a>
