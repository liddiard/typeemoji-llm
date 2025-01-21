# [✨ TypeEmoji LLM](https://typeemoji.com/)

Find the best emoji to represent a concept, powered by AI. Learn more in the [blog post](https://harrisonliddiard.com/project/typeemoji-llm/).

## Local development setup

### Client

1. `npm i`
2. `npm run dev`

Build: `npm run build`
Deploy (requires configured [AWS CLI](https://aws.amazon.com/cli/)): `npm run deploy`

### Server

#### Docker (recommended)

1. `cd server/`
2. `cp .env.example .env`
3. Add your OpenAI API key to the `.env` file
4. `docker compose up`

#### No Docker

1. `cd server/`
2. `python3 -m venv venv`
3. `source bin/activate`
4. `pip install -r requirements.txt`
5. `OPENAI_API_KEY=<your API key> python app.py`
