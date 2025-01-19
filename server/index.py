import json
from flask import Flask, request
from flask_cors import CORS
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from flask_caching import Cache
from pydantic import BaseModel
from openai import OpenAI

client = OpenAI()
app = Flask(__name__)

app.config.from_file("config.json", load=json.load)
CORS(app)
limiter = Limiter(get_remote_address, app=app)
cache = Cache(app)


class EmojiResponse(BaseModel):
    emojis: list[str]


@app.route("/search", methods=["GET"])
@cache.cached(timeout=60*60*24, query_string=True) # cache queries for 24 hours
def search():
    query = request.args.get("q", "")
    if len(query) > 100:
        return "Querystring is too long", 400
    # https://platform.openai.com/docs/api-reference/chat/create
    completion = client.beta.chat.completions.parse(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "You are to act as a recommender for emojis based on a query or description input by the user. Respond with up to 10 individual emoji that most are most fitting for the user's input. Do not include any other text."},
            {
                "role": "user",
                "content": query
            }
        ],
        max_completion_tokens=50,
        response_format=EmojiResponse
    )
    message = completion.choices[0].message.parsed
    return {
        "results": message.emojis
    }

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=8080, debug=True)