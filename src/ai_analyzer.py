# src/ai_analyzer.py

import google.generativeai as genai
import logging
import os
import re
import json

try:
    API_KEY = os.getenv("GEMINI_API_KEY")
    if not API_KEY:
        raise ValueError("GEMINI_API_KEY not found in environment variables.")
    genai.configure(api_key=API_KEY)
    model = genai.GenerativeModel('gemini-1.5-flash')
    logging.info("Gemini AI model configured successfully.")
except (ValueError, ImportError) as e:
    logging.warning(f"Could not configure Gemini AI: {e}. AI analysis will be disabled.")
    model = None

def create_knowledge_set(resume_text: str) -> (str, list):
    """Uses AI to perform a holistic synthesis of the entire resume."""
    if not model: return "AI analysis disabled.", ["Software Engineer"]
    
    prompt = f"""
    Act as an elite career strategist. Analyze the provided resume.
    Synthesize the profile into two parts:
    1. A concise, one-sentence professional summary.
    2. A Python list of 3-4 simple, searchable, high-level job titles or roles that fit the resume.

    RULES for the list:
    - Each item should be a 2-3 word job title.
    - DO NOT use long descriptive phrases.
    - Bad example: ['Data Scientist with Visualization Skills', 'Entry-Level Software Engineer with Data Science']
    - Good example: ['Data Scientist', 'AI Engineer', 'Python Developer', 'Data Analyst']

    Analyze this resume:
    ---
    {resume_text}
    ---
    """
    try:
        response = model.generate_content(prompt)
        # Fallback to simple extraction if the primary prompt fails to produce a list
        try:
            summary_match = re.search(r"Summary: (.*)", response.text, re.IGNORECASE)
            keywords_match = re.search(r"(\[.*\])", response.text, re.DOTALL)

            summary = summary_match.group(1).strip() if summary_match else "A skilled technology professional with diverse project experience."
            keywords = eval(keywords_match.group(1)) if keywords_match else ["Software Engineer"]
        except (SyntaxError, AttributeError, TypeError):
             keywords = ["Software Engineer", "Data Analyst"]
             summary = "A skilled technology professional with diverse project experience."

        return summary, keywords
    except Exception as e:
        logging.error(f"Error creating holistic knowledge set: {e}")
        return "Could not generate AI profile.", ["Software Engineer"]

def get_ats_score_and_feedback(resume_text: str) -> dict:
    if not model: return {"error": "AI analysis disabled."}
    prompt = f"""
    Act as a cutting-edge ATS. Analyze the resume and return a JSON object with:
    "overall_score": integer (0-100),
    "score_breakdown": an object with three keys ("Clarity & Formatting", "Keyword Relevance", "Impact & Quantification"), each with a "score" (0-100) and "feedback" (one sentence),
    "final_summary": one sentence.
    Resume: --- {resume_text} ---
    """
    try:
        response = model.generate_content(prompt)
        cleaned_response = response.text.strip().replace("```json", "").replace("```", "")
        return json.loads(cleaned_response)
    except Exception as e:
        logging.error(f"Error getting ATS score: {e}")
        return {"overall_score": 0, "score_breakdown": {}, "final_summary": "Could not perform ATS analysis."}

def analyze_experience_level(resume_text: str) -> str:
    if not model: return "Fresher"
    prompt = f"""
    Analyze this resume. If it only contains university projects and no professional internships or full-time jobs, return "Fresher". Otherwise, return "Entry-Level".
    Resume: --- {resume_text} ---
    """
    try:
        response = model.generate_content(prompt)
        level = response.text.strip()
        if level in ["Fresher", "Entry-Level"]: return level
        return "Fresher"
    except Exception as e:
        logging.error(f"Error analyzing experience level: {e}")
        return "Fresher"

def generate_resume_suggestions(resume_text: str) -> str:
    if not model: return "AI analysis disabled."
    prompt = f"""
    You are an expert career coach. Analyze the resume. Provide your top 2 most impactful suggestions as a simple list. Each point must start with an emoji and be one sentence.
    Resume: --- {resume_text} ---
    """
    try:
        response = model.generate_content(prompt)
        return response.text.strip()
    except Exception as e:
        return f"Error generating resume suggestions: {e}"

def generate_all_rationales_in_batch(resume_text: str, jobs: list) -> dict:
    if not model or not jobs: return {}
    job_titles = [f"{i+1}. {job['title']}" for i, job in enumerate(jobs)]
    job_list_str = "\n".join(job_titles)
    prompt = f"""
    For each job title in the list, write a one-sentence rationale explaining why the resume is a good fit. Start with an emoji.
    Return a JSON object where keys are job numbers (e.g., "1", "2") and values are the rationale sentences.
    Resume: --- {resume_text} ---
    Job Titles: --- {job_list_str} ---
    """
    try:
        response = model.generate_content(prompt)
        cleaned_response = response.text.strip().replace("```json", "").replace("```", "")
        return json.loads(cleaned_response)
    except Exception as e:
        logging.error(f"Error generating batch rationales: {e}")
        return {}

def compare_resumes(resume_text_1: str, resume_name_1: str, resume_text_2: str, resume_name_2: str) -> dict:
    if not model: return {"error": "AI analysis disabled."}
    prompt = f"""
    Act as an expert recruiter. Compare Resume 1 ("{resume_name_1}") and Resume 2 ("{resume_name_2}").
    Return a JSON object with keys: "overall_summary", "shared_strengths", "resume_1_unique_strengths", "resume_2_unique_strengths".
    The strengths keys should be Python lists of 2-3 strings each.
    Resume 1: --- {resume_text_1} ---
    Resume 2: --- {resume_text_2} ---
    """
    try:
        response = model.generate_content(prompt)
        cleaned_response = response.text.strip().replace("```json", "").replace("```", "")
        return json.loads(cleaned_response)
    except Exception as e:
        logging.error(f"Error comparing resumes: {e}")
        return {"error": f"Could not perform comparison: {e}"}