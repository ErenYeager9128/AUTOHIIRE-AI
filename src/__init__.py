# __init__.py
"""
AutoResumeAI - A package to parse resumes, classify skillsets, find jobs, and auto-apply using AI.
"""

import os
import logging

# Try to load dotenv, but don't fail if it's not available
try:
    from dotenv import load_dotenv
    # Load environment variables
    load_dotenv()
    logging.info("Environment variables loaded successfully")
except ImportError:
    logging.warning("python-dotenv not available, skipping environment variable loading")
except Exception as e:
    logging.warning(f"Could not load environment variables: {e}")

# Configure logging
try:
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s [%(levelname)s] %(message)s",
    )
    logging.info("AutoResumeAI package initialized.")
except Exception as e:
    # Fallback logging if basicConfig fails
    print(f"Warning: Could not configure logging: {e}")

# Note: Import statements will be added as modules are implemented
# from .resume_parser import extract_resume_keywords
# from .ai_classifier import classify_student_type
# from .job_scraper import find_jobs
# from .auto_applier import apply_to_jobs
