#!/usr/bin/env python3
"""
AutoHire AI - 3D Interactive Web Application
Main Flask application with modern 3D UI and backend integration.
"""

from flask import Flask, render_template, request, jsonify, session, redirect, url_for
from flask_cors import CORS
import os
import sys
import logging
from datetime import datetime

# Add parent directory to path for backend imports
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Import backend modules
from src.resume_manager import ResumeManager
from src.job_matcher import JobMatcher
from src.resume_optimizer import ResumeOptimizer
from src.parser import extract_text_from_pdf

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize Flask app
app = Flask(__name__)
app.secret_key = 'autohire_ai_secret_key_2025'  # Change in production
CORS(app)

# Initialize backend components
resume_manager = ResumeManager()
job_matcher = JobMatcher()
resume_optimizer = ResumeOptimizer()

# Configuration
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'pdf'}
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB

# Ensure upload folder exists
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def allowed_file(filename):
    """Check if file extension is allowed."""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/')
def index():
    """Main dashboard with 3D interactive elements."""
    return render_template('dashboard.html')

@app.route('/upload')
def upload_page():
    """Resume upload page with 3D drag & drop zone."""
    return render_template('upload.html')

@app.route('/results')
def results_page():
    """Analysis results page with 3D visualizations."""
    return render_template('results.html')

@app.route('/jobs')
def jobs_page():
    """Job matching page with 3D interactive elements."""
    return render_template('jobs.html')

@app.route('/showcase')
def showcase_page():
    """Animation showcase page demonstrating all smooth animations."""
    return render_template('animation-showcase.html')

@app.route('/api/upload-resume', methods=['POST'])
def upload_resume():
    """API endpoint for resume upload with 3D feedback."""
    try:
        if 'resume' not in request.files:
            return jsonify({'error': 'No file provided'}), 400
        
        file = request.files['resume']
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        if not allowed_file(file.filename):
            return jsonify({'error': 'Only PDF files are allowed'}), 400
        
        # Check file size
        file.seek(0, os.SEEK_END)
        file_size = file.tell()
        file.seek(0)
        
        if file_size > MAX_FILE_SIZE:
            return jsonify({'error': 'File too large. Maximum size is 10MB'}), 400
        
        # Save file temporarily
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        temp_filename = f"temp_{timestamp}_{file.filename}"
        temp_path = os.path.join(UPLOAD_FOLDER, temp_filename)
        file.save(temp_path)
        
        # Process with backend
        try:
            result = resume_manager.upload_resume(temp_path, file.filename)
            
            # Clean up temp file
            if os.path.exists(temp_path):
                os.remove(temp_path)
            
            return jsonify({
                'success': True,
                'message': result['message'],
                'resume_id': result['resume_info']['id'],
                'filename': file.filename
            })
            
        except Exception as e:
            # Clean up temp file on error
            if os.path.exists(temp_path):
                os.remove(temp_path)
            raise e
            
    except Exception as e:
        logger.error(f"Upload error: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/analyze-resume/<int:resume_id>')
def analyze_resume(resume_id):
    """API endpoint for resume analysis with 3D data visualization."""
    try:
        # Get resume text
        resume_text = resume_manager.get_resume_text(resume_id)
        if not resume_text:
            return jsonify({'error': 'Resume not found'}), 404
        
        # Get resume info
        resume_info = resume_manager.get_resume(resume_id)
        if not resume_info:
            return jsonify({'error': 'Resume not found'}), 404
        
        # Analyze resume
        analysis = resume_optimizer.analyze_resume(resume_text)
        
        # Get job matches
        job_matches = job_matcher.match_resume_to_jobs(resume_text, top_n=5)
        
        return jsonify({
            'success': True,
            'resume_info': resume_info,
            'analysis': analysis,
            'job_matches': job_matches
        })
        
    except Exception as e:
        logger.error(f"Analysis error: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/jobs')
def get_jobs():
    """API endpoint for job listings with 3D filtering."""
    try:
        query = request.args.get('q', '')
        filters = {}
        
        # Parse filters
        if request.args.get('location'):
            filters['location'] = request.args.get('location')
        if request.args.get('type'):
            filters['type'] = request.args.get('type')
        if request.args.get('experience'):
            filters['experience_level'] = request.args.get('experience')
        
        if query:
            jobs = job_matcher.search_jobs(query, filters)
        else:
            jobs = job_matcher.get_all_jobs()
        
        return jsonify({
            'success': True,
            'jobs': jobs,
            'total': len(jobs)
        })
        
    except Exception as e:
        logger.error(f"Jobs error: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/resumes')
def get_resumes():
    """API endpoint for user's resume list."""
    try:
        resumes = resume_manager.get_resumes()
        return jsonify({
            'success': True,
            'resumes': resumes,
            'count': len(resumes),
            'max_allowed': resume_manager.max_resumes
        })
        
    except Exception as e:
        logger.error(f"Resumes error: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/delete-resume/<int:resume_id>', methods=['DELETE'])
def delete_resume(resume_id):
    """API endpoint for resume deletion."""
    try:
        success = resume_manager.delete_resume(resume_id)
        if success:
            return jsonify({'success': True, 'message': 'Resume deleted successfully'})
        else:
            return jsonify({'error': 'Failed to delete resume'}), 400
            
    except Exception as e:
        logger.error(f"Delete error: {e}")
        return jsonify({'error': str(e)}), 500

@app.errorhandler(404)
def not_found(error):
    """Custom 404 page with 3D elements."""
    return render_template('404.html'), 404

@app.errorhandler(500)
def internal_error(error):
    """Custom 500 page with 3D elements."""
    return render_template('500.html'), 500

if __name__ == '__main__':
    logger.info("🚀 Starting AutoHire AI 3D Interactive Web Application...")
    logger.info("✨ 3D Cyberpunk Career Hub is launching...")
    
    # Development server
    app.run(
        host='0.0.0.0',
        port=5000,
        debug=True,
        threaded=True
    )
