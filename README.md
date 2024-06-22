# Mutual GitHub Followers and Non-Mutual

It is a micro project to help you find mutual and not mutual followers on GitHub. This uses an official API with a token (not included).

![Demo screenshot](https://raw.githubusercontent.com/bouvens/mutual-github/main/screenshot.png)

## Getting Started

First, clone the project.

Then add `.env` file with content similar to `.env.example` with

```dotenv
GITHUB_TOKEN=xxxyyyzzz
```

Where `xxxyyyzzz` should be your token that you can take from [settings](https://github.com/settings/tokens).

And you are ready to run the development server:

```bash
npm run dev
```

Open [http://localhost:3001](http://localhost:3001) with your browser to see the result.

Start editing the page by modifying `app/page.jsx`. The page auto-updates as you edit the file.

## Links
* GitHub API for [followers](https://docs.github.com/en/rest/users/followers)
* GitHub API for [pagination](https://docs.github.com/en/rest/using-the-rest-api/using-pagination-in-the-rest-api)
* <a target="_blank" href="https://icons8.com/icon/92484/safety-collection-place">Connections</a> icon by <a target="_blank" href="https://icons8.com">Icons8</a>
