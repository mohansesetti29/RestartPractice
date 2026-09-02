


from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

tasks = [
    {
        "id": 1,
        "title": "Learn Git branches"
    },
    {
        "id": 2,
        "title": "Connect frontend to backend"
    }
]


@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({
        "status": "ok",
        "message": "Backend is running"
    })


@app.route("/api/tasks", methods=["GET"])
def get_tasks():
    return jsonify(tasks)


@app.route("/api/tasks", methods=["POST"])
def create_task():

    data = request.get_json()

    if not data or not data.get("title"):
        return jsonify({
            "error": "Task title is required"
        }), 400

    new_task = {
        "id": len(tasks) + 1,
        "title": data["title"]
    }

    tasks.append(new_task)

    return jsonify(new_task), 201


@app.route("/api/tasks/<int:task_id>", methods=["DELETE"])
def delete_task(task_id):

    global tasks

    for task in tasks:

        if task["id"] == task_id:
            tasks.remove(task)

            return jsonify({
                "message": "Task deleted"
            })

    return jsonify({
        "error": "Task not found"
    }), 404


if __name__ == "__main__":
    app.run(
        host="127.0.0.1",
        port=5000,
        debug=True
    )