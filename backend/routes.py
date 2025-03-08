from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
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
@jwt_required()
def create_workout():
    data = request.get_json()
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    try:
        new_workout = Workout(
            title=data['title'],
            description=data.get('description', ''),
            content=data['content'],
            user_id=user.id
        )
        db.session.add(new_workout)
        db.session.commit()
        return jsonify(new_workout.to_dict()), 201
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400
    
@api.route('/workouts/<int:id>', methods=['PUT'])
@jwt_required()
def update_workout(id):
    current_user_id = get_jwt_identity()
    workout = Workout.query.get_or_404(id)
    
    # Check if the user owns this workout
    if workout.user_id != current_user_id:
        return jsonify({'error': 'Not authorized to update this workout'}), 403
        
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
@jwt_required()
def delete_workout(id):
    current_user_id = get_jwt_identity()
    workout = Workout.query.get_or_404(id)
    
    # Check if the user owns this workout
    if workout.user_id != current_user_id:
        return jsonify({'error': 'Not authorized to delete this workout'}), 403
    try:
        db.session.delete(workout)
        db.session.commit()
        return jsonify({'message': 'Workout deleted successfully'})
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400
