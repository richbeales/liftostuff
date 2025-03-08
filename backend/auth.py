from flask import Blueprint, jsonify, request, redirect, current_app, url_for
from flask_jwt_extended import (
    create_access_token, create_refresh_token, 
    jwt_required, get_jwt_identity, get_jwt
)
from authlib.integrations.flask_client import OAuth
from models import db, User
import json
from datetime import datetime, timezone

auth = Blueprint('auth', __name__)
oauth = OAuth()

# Setup OAuth providers
def setup_oauth(app):
    oauth.init_app(app)
    oauth.register(
        name='google',
        client_id=app.config['GOOGLE_CLIENT_ID'],
        client_secret=app.config['GOOGLE_CLIENT_SECRET'],
        server_metadata_url=app.config['GOOGLE_DISCOVERY_URL'],
        client_kwargs={'scope': 'openid email profile'},
    )

@auth.route('/login/google')
def google_login():
    redirect_uri = url_for('auth.google_authorize', _external=True)
    return oauth.google.authorize_redirect(redirect_uri)

@auth.route('/login/google/callback')
def google_authorize():
    token = oauth.google.authorize_access_token()
    user_info = token.get('userinfo')
    
    if not user_info:
        return jsonify({'error': 'Failed to get user info from Google'}), 400
    
    # Check if user exists
    user = User.query.filter_by(email=user_info['email']).first()
    
    if not user:
        # Create new user
        username = user_info.get('name', '').replace(' ', '_').lower()
        base_username = username
        counter = 1
        
        # Ensure username is unique
        while User.query.filter_by(username=username).first():
            username = f"{base_username}{counter}"
            counter += 1
            
        user = User(
            username=username,
            email=user_info['email'],
            oauth_id=user_info['sub'],
            oauth_provider='google',
            profile_picture=user_info.get('picture')
        )
        db.session.add(user)
        db.session.commit()
    else:
        # Update existing user's OAuth info
        user.oauth_id = user_info['sub']
        user.oauth_provider = 'google'
        user.profile_picture = user_info.get('picture', user.profile_picture)
        db.session.commit()
    
    # Create tokens
    access_token = create_access_token(identity=user.id)
    refresh_token = create_refresh_token(identity=user.id)
    
    # Redirect to frontend with tokens
    frontend_url = current_app.config['FRONTEND_URL']
    redirect_url = f"{frontend_url}/auth/callback?access_token={access_token}&refresh_token={refresh_token}"
    
    return redirect(redirect_url)

@auth.route('/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    current_user_id = get_jwt_identity()
    access_token = create_access_token(identity=current_user_id)
    return jsonify(access_token=access_token)

@auth.route('/me', methods=['GET'])
@jwt_required()
def get_current_user():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    
    if not user:
        return jsonify({'error': 'User not found'}), 404
        
    return jsonify(user.to_dict())

@auth.route('/logout', methods=['POST'])
@jwt_required()
def logout():
    # In a stateless JWT setup, the client is responsible for removing the token
    # This endpoint is mainly for consistency and future token blacklisting if needed
    return jsonify({'message': 'Successfully logged out'})
