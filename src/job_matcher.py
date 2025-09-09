# src/job_matcher.py

import logging
from typing import List, Dict
from sentence_transformers import SentenceTransformer, util

class JobMatcher:
    """Receives a list of jobs and scores them against a resume using semantic search."""
    
    def __init__(self):
        try:
            self.model = SentenceTransformer('all-MiniLM-L6-v2')
            logging.info("SentenceTransformer model loaded successfully.")
        except Exception as e:
            logging.error(f"Failed to load SentenceTransformer model: {e}")
            self.model = None

    def match_resume_to_jobs(self, resume_text: str, jobs_to_score: List[Dict]) -> List[Dict]:
        """
        Scores a pre-fetched list of jobs against the resume using semantic similarity.
        """
        if not self.model:
            logging.error("Semantic model not available. Cannot perform matching.")
            return []
        if not jobs_to_score:
            return []
        
        try:
            resume_embedding = self.model.encode(resume_text, convert_to_tensor=True)
            job_matches = []
            
            for job in jobs_to_score:
                job_text = f"{job['title']}. {job['company']} in {job['location']}"
                job_embedding = self.model.encode(job_text, convert_to_tensor=True)
                
                semantic_score = util.pytorch_cos_sim(resume_embedding, job_embedding)[0][0].item()
                
                job_match = {
                    "job": job,
                    "match_score": semantic_score * 100
                }
                job_matches.append(job_match)
            
            return job_matches
            
        except Exception as e:
            logging.error(f"Error during semantic matching process: {e}", exc_info=True)
            return []