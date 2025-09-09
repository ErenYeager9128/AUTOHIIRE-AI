import spacy
import pandas as pd
import logging

# Load NLP model
try:
    nlp = spacy.load("en_core_web_sm")
    logging.info("Successfully loaded spaCy English model")
except OSError as e:
    logging.error(f"Failed to load spaCy model: {e}")
    logging.error("Please run: python -m spacy download en_core_web_sm")
    raise

# Define keyword sets with weights for better classification
categories = {
    "SDE": {
        "keywords": ["python", "java", "c++", "spring boot", "react", "node.js", "api", "microservices", 
                    "git", "docker", "kubernetes", "aws", "azure", "database", "sql", "mongodb"],
        "weight": 1.0
    },
    "Cybersecurity": {
        "keywords": ["penetration testing", "malware", "firewall", "threat detection", "encryption", 
                    "siem", "vulnerability", "security", "compliance", "audit", "incident response"],
        "weight": 1.0
    },
    "Product": {
        "keywords": ["roadmap", "stakeholder", "product design", "user research", "wireframe", 
                    "agile", "scrum", "kanban", "user experience", "market research", "analytics"],
        "weight": 1.0
    },
    "Data Science": {
        "keywords": ["machine learning", "data analysis", "pandas", "numpy", "deep learning", 
                    "nlp", "statistics", "visualization", "tensorflow", "pytorch", "scikit-learn"],
        "weight": 1.0
    }
}

def classify_resume(text):
    """
    Classify resume text into career categories using keyword matching.
    
    Args:
        text (str): Resume text to classify
        
    Returns:
        tuple: (top_category, scores_dict)
        
    Raises:
        ValueError: If input text is empty or invalid
    """
    if not text or not isinstance(text, str):
        raise ValueError("Input text must be a non-empty string")
    
    if not text.strip():
        raise ValueError("Input text cannot be empty or whitespace only")
    
    # Clean and tokenize text
    doc = nlp(text.lower())
    tokens = [token.text for token in doc if not token.is_stop and not token.is_punct]
    
    logging.info(f"Processing resume with {len(tokens)} meaningful tokens")
    
    # Calculate scores with weights
    scores = {cat: 0.0 for cat in categories}
    
    for cat, config in categories.items():
        for keyword in config["keywords"]:
            # Check for exact matches and partial matches
            if keyword.lower() in text.lower():
                scores[cat] += config["weight"]
                logging.debug(f"Found keyword '{keyword}' for category '{cat}'")
    
    # Find top category
    if all(score == 0 for score in scores.values()):
        logging.warning("No keywords found in any category")
        return "Unknown", scores
    
    top_category = max(scores, key=scores.get)
    logging.info(f"Classified resume as: {top_category} (score: {scores[top_category]})")
    
    return top_category, scores

def get_classification_confidence(scores):
    """
    Calculate confidence level of the classification.
    
    Args:
        scores (dict): Category scores
        
    Returns:
        float: Confidence score between 0 and 1
    """
    if not scores:
        return 0.0
    
    total_score = sum(scores.values())
    if total_score == 0:
        return 0.0
    
    max_score = max(scores.values())
    confidence = max_score / total_score if total_score > 0 else 0.0
    
    return min(confidence, 1.0)
