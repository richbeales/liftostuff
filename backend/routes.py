from flask import Blueprint, jsonify, request
from models import db, Workout, User
from sqlalchemy.exc import SQLAlchemyError

api = Blueprint('api', __name__)

@api.route('/workouts', methods=['GET'])
def get_workouts():
    workouts = Workout.query.all()
    return jsonify([workout.to_dict() for workout in workouts])

@api.route('/workouts/<int:id>', methods=['GET'])
def get_workout(id):
    workout = Workout.query.get_or_404(id)
    return jsonify(workout.to_dict())

@api.route('/workouts', methods=['POST'])
def create_workout():
    data = request.get_json()
    
    # For demonstration, we're using a default user
    # In a real app, this would come from authentication
    default_user = User.query.first()
    if not default_user:
        default_user = User(username="demo_user", email="demo@example.com")
        db.session.add(default_user)
        db.session.commit()
    
    try:
        new_workout = Workout(
            title=data['title'],
            description=data.get('description', ''),
            content=data['content'],
            user_id=default_user.id
        )
        db.session.add(new_workout)
        db.session.commit()
        return jsonify(new_workout.to_dict()), 201
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400
    
@api.route('/workouts/<int:id>', methods=['PUT'])
def update_workout(id):
    workout = Workout.query.get_or_404(id)
    data = request.get_json()
    
    try:
        if 'title' in data:
            workout.title = data['title']
        if 'description' in data:
            workout.description = data['description']
        if 'content' in data:
            workout.content = data['content']
            
        db.session.commit()
        return jsonify(workout.to_dict())
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400
    
@api.route('/workouts/<int:id>', methods=['DELETE'])
def delete_workout(id):
    workout = Workout.query.get_or_404(id)
    try:
        db.session.delete(workout)
        db.session.commit()
        return jsonify({'message': 'Workout deleted successfully'})
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400
