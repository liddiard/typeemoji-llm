from flask import Flask, request
from flask_cors import CORS
from openai import OpenAI

client = OpenAI()
app = Flask(__name__)
CORS(app, origins=["http://localhost:5173"])

@app.route("/search", methods=["GET"])
def search():
    query = request.args.get("q", "")
    if len(query) > 100:
        return "Querystring is too long", 400
    completion = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "You are to act as a recommender for emojis based on a query or description input by the user. Respond with up to 10 emojis that most are most fitting for the user's input, each emoji separated by a newline. Respond only with the emojis. Do not include any other text."},
            {
                "role": "user",
                "content": query
            }
        ]
    )
    message = completion.choices[0].message.content
    return {
        "results": list(map(lambda s: s.strip(), message.split('\n')))
    }

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=8080, debug=True)