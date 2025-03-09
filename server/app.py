import json
import logging
from flask import Flask, request
from flask_cors import CORS
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from flask_caching import Cache
from pydantic import BaseModel
from openai import OpenAI
from datetime import datetime

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

client = OpenAI()
app = Flask(__name__)

app.config.from_file("config.json", load=json.load)
CORS(app)
limiter = Limiter(
    # In an Nginx reverse proxy configuration, X-Real-IP will contain the real
    # client's forwarded IP address.
    # Important: X-Real-IP should NOT be used in production if the application
    # is NOT deployed behind a reverse proxy as a bad actor could set the
    # header value to whatever they want.
    lambda: request.headers.get("X-Real-IP") or get_remote_address(),
    app=app
)
cache = Cache(app)

class EmojiResponse(BaseModel):
    emojis: list[str]

@app.route("/search", methods=["GET"])
@cache.cached(timeout=60*60*24, query_string=True) # cache queries for 24 hours
def search():
    query = request.args.get("q", "")
    if len(query) == 0:
        return "Query string is empty", 400
    if len(query) > 100:
        return "Query string is too long", 400
    try:
        completion = client.beta.chat.completions.parse(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are to act as a recommender for emojis based on a query or description input by the user. Respond with up to 10 emoji that most are most fitting for the user's input. Do not include any other text. Each emoji should be unique; don't repeat the same ones."},
                {"role": "user", "content": query}
            ],
            max_completion_tokens=100,
            response_format=EmojiResponse
        )
        message = completion.choices[0].message.parsed
        results = list(dict.fromkeys(message.emojis))[:10]
    except Exception as e:
        logger.error(f"Error processing query '{query}': {e}")
        return "Internal server error", 500
    timestamp = datetime.now().isoformat()
    logger.info(f"[{timestamp}] Query: '{query}', Results: {results}")
    return {"results": results}

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5919, debug=True)