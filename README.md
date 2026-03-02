# XSS Lab 2

A note-taking app with a broken sanitizer and an admin bot. The goal is to bypass the sanitization and steal the admin's cookie. Built for the League of Code cybersecurity curriculum.

## Challenge

The app sanitizes input, but only strips lowercase `<script>` tags and a handful of event handlers. The task is to craft a payload that bypasses the filter, submit it as a note, then trigger the `/report/:id` endpoint to have the admin bot (Puppeteer) view it — executing your payload in the admin's browser context.

## Setup

```bash
docker build -t xss-lab2 .
docker run --rm -p 3000:3000 --name xss-lab2 xss-lab2
```

Visit `http://localhost:3000`

## Routes

| Route | Description |
|---|---|
| `GET /notes` | View all notes |
| `POST /notes/create` | Submit a new note |
| `GET /notes/:id` | View a specific note |
| `GET /report/:id` | Trigger admin bot to view note |

## Tech

- Node.js, Express
- EJS templating
- Puppeteer (admin bot simulation)
- Docker

## Warning

Deliberately insecure. Do not deploy publicly.
