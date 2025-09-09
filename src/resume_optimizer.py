import re
import logging
from typing import Dict, List, Tuple
from .keyword_classifier import categories

class ResumeOptimizer:
    """Provides resume optimization suggestions for ATS and job matching."""
    
    def __init__(self):
        self.ats_keywords = self._load_ats_keywords()
        self.formatting_rules = self._load_formatting_rules()
    
    def _load_ats_keywords(self) -> Dict[str, List[str]]:
        """Load ATS-friendly keywords for different industries."""
        return {
            "SDE": [
                "software development", "programming", "coding", "development",
                "agile", "scrum", "git", "version control", "testing", "debugging",
                "api", "rest", "microservices", "cloud", "aws", "azure", "docker",
                "kubernetes", "ci/cd", "deployment", "monitoring", "logging"
            ],
            "Cybersecurity": [
                "security", "cybersecurity", "information security", "threat detection",
                "vulnerability assessment", "penetration testing", "incident response",
                "forensics", "compliance", "audit", "risk assessment", "firewall",
                "siem", "ids/ips", "encryption", "authentication", "authorization"
            ],
            "Product": [
                "product management", "product strategy", "roadmap", "stakeholder management",
                "user research", "user experience", "wireframing", "prototyping",
                "agile", "scrum", "kanban", "analytics", "metrics", "kpis",
                "market research", "competitive analysis", "go-to-market", "launch"
            ],
            "Data Science": [
                "data analysis", "machine learning", "deep learning", "statistics",
                "data visualization", "predictive modeling", "nlp", "computer vision",
                "big data", "data mining", "etl", "data warehousing", "sql", "python",
                "r", "tensorflow", "pytorch", "scikit-learn", "pandas", "numpy"
            ]
        }
    
    def _load_formatting_rules(self) -> Dict[str, List[str]]:
        """Load ATS formatting rules and best practices."""
        return {
            "critical": [
                "Use standard fonts (Arial, Calibri, Times New Roman)",
                "Avoid graphics, tables, and images",
                "Use simple bullet points",
                "Include relevant keywords naturally",
                "Keep formatting consistent"
            ],
            "important": [
                "Use clear section headers",
                "Include contact information at top",
                "List experience in reverse chronological order",
                "Use action verbs for achievements",
                "Quantify results when possible"
            ],
            "recommended": [
                "Keep resume to 1-2 pages",
                "Use standard section names",
                "Avoid abbreviations",
                "Include relevant certifications",
                "Proofread for spelling and grammar"
            ]
        }
    
    def analyze_resume(self, resume_text: str, target_job: str = None) -> Dict:
        """
        Analyze resume and provide optimization suggestions.
        
        Args:
            resume_text: Resume text to analyze
            target_job: Target job title for keyword optimization
            
        Returns:
            Dictionary with analysis results and suggestions
        """
        try:
            analysis = {
                "overall_score": 0,
                "keyword_analysis": {},
                "formatting_suggestions": [],
                "optimization_recommendations": [],
                "ats_compatibility": {},
                "missing_keywords": [],
                "strengths": [],
                "areas_for_improvement": []
            }
            
            # Analyze keywords
            keyword_analysis = self._analyze_keywords(resume_text, target_job)
            analysis["keyword_analysis"] = keyword_analysis
            
            # Check formatting
            formatting_score = self._check_formatting(resume_text)
            analysis["ats_compatibility"]["formatting_score"] = formatting_score
            
            # Generate suggestions
            analysis["formatting_suggestions"] = self._generate_formatting_suggestions(resume_text)
            analysis["optimization_recommendations"] = self._generate_optimization_recommendations(
                resume_text, keyword_analysis, target_job
            )
            
            # Calculate overall score
            analysis["overall_score"] = self._calculate_overall_score(keyword_analysis, formatting_score)
            
            # Identify strengths and areas for improvement
            analysis["strengths"] = self._identify_strengths(keyword_analysis, formatting_score)
            analysis["areas_for_improvement"] = self._identify_improvement_areas(keyword_analysis, formatting_score)
            
            return analysis
            
        except Exception as e:
            logging.error(f"Error analyzing resume: {e}")
            return {"error": str(e)}
    
    def _analyze_keywords(self, resume_text: str, target_job: str = None) -> Dict:
        """Analyze keyword presence and relevance."""
        resume_lower = resume_text.lower()
        
        # Analyze by career category
        keyword_scores = {}
        total_keywords = 0
        found_keywords = 0
        
        for category, config in categories.items():
            category_keywords = config["keywords"]
            category_score = 0
            
            for keyword in category_keywords:
                total_keywords += 1
                if keyword.lower() in resume_lower:
                    category_score += 1
                    found_keywords += 1
            
            keyword_scores[category] = {
                "score": category_score,
                "total": len(category_keywords),
                "percentage": (category_score / len(category_keywords)) * 100 if category_keywords else 0
            }
        
        # Overall keyword score
        overall_keyword_score = (found_keywords / total_keywords) * 100 if total_keywords > 0 else 0
        
        return {
            "by_category": keyword_scores,
            "overall_score": overall_keyword_score,
            "total_keywords_found": found_keywords,
            "total_keywords_available": total_keywords
        }
    
    def _check_formatting(self, resume_text: str) -> float:
        """Check resume formatting for ATS compatibility."""
        score = 100.0
        
        # Check for common ATS issues
        issues = []
        
        # Check for special characters
        special_chars = re.findall(r'[^\w\s\-\.\,\;\:\!\?]', resume_text)
        if special_chars:
            score -= 10
            issues.append("Contains special characters that may confuse ATS")
        
        # Check for excessive formatting
        if resume_text.count('\n') > resume_text.count(' ') * 0.1:
            score -= 15
            issues.append("Excessive line breaks may affect ATS parsing")
        
        # Check for consistent formatting
        lines = resume_text.split('\n')
        if len(set(len(line.strip()) for line in lines if line.strip())) > 10:
            score -= 10
            issues.append("Inconsistent line lengths may affect readability")
        
        # Check for proper section headers
        section_headers = ["experience", "education", "skills", "summary", "objective"]
        found_headers = sum(1 for header in section_headers if header in resume_text.lower())
        if found_headers < 3:
            score -= 20
            issues.append("Missing important section headers")
        
        return max(score, 0.0)
    
    def _generate_formatting_suggestions(self, resume_text: str) -> List[str]:
        """Generate formatting improvement suggestions."""
        suggestions = []
        
        # Check section headers
        if "experience" not in resume_text.lower():
            suggestions.append("Add an 'Experience' section to highlight work history")
        
        if "skills" not in resume_text.lower():
            suggestions.append("Add a 'Skills' section to showcase technical abilities")
        
        if "education" not in resume_text.lower():
            suggestions.append("Add an 'Education' section for academic background")
        
        # Check for action verbs
        action_verbs = ["developed", "implemented", "managed", "created", "designed", "led"]
        if not any(verb in resume_text.lower() for verb in action_verbs):
            suggestions.append("Use strong action verbs to describe achievements")
        
        # Check for quantifiable results
        if not re.search(r'\d+%|\d+x|\$\d+', resume_text):
            suggestions.append("Include quantifiable results and metrics when possible")
        
        return suggestions
    
    def _generate_optimization_recommendations(self, resume_text: str, keyword_analysis: Dict, target_job: str = None) -> List[str]:
        """Generate specific optimization recommendations."""
        recommendations = []
        
        # Keyword optimization
        if keyword_analysis["overall_score"] < 60:
            recommendations.append("Increase keyword density by incorporating more relevant technical terms")
        
        # Category-specific recommendations
        for category, data in keyword_analysis["by_category"].items():
            if data["percentage"] < 50:
                recommendations.append(f"Add more {category} related keywords to improve category match")
        
        # Target job optimization
        if target_job:
            target_keywords = self._extract_job_keywords(target_job)
            missing_keywords = [kw for kw in target_keywords if kw.lower() not in resume_text.lower()]
            if missing_keywords:
                recommendations.append(f"Consider adding these keywords for '{target_job}': {', '.join(missing_keywords[:5])}")
        
        return recommendations
    
    def _extract_job_keywords(self, job_title: str) -> List[str]:
        """Extract relevant keywords from job title."""
        # Simple keyword extraction - in production this would use NLP
        common_keywords = {
            "developer": ["programming", "coding", "development", "software"],
            "engineer": ["engineering", "technical", "development", "design"],
            "analyst": ["analysis", "data", "research", "evaluation"],
            "manager": ["management", "leadership", "coordination", "planning"],
            "specialist": ["expertise", "specialization", "knowledge", "skills"]
        }
        
        keywords = []
        job_lower = job_title.lower()
        
        for role, related_keywords in common_keywords.items():
            if role in job_lower:
                keywords.extend(related_keywords)
        
        return keywords
    
    def _calculate_overall_score(self, keyword_analysis: Dict, formatting_score: float) -> float:
        """Calculate overall resume optimization score."""
        keyword_weight = 0.7
        formatting_weight = 0.3
        
        keyword_score = keyword_analysis["overall_score"]
        
        overall_score = (keyword_score * keyword_weight) + (formatting_score * formatting_weight)
        return round(overall_score, 1)
    
    def _identify_strengths(self, keyword_analysis: Dict, formatting_score: float) -> List[str]:
        """Identify resume strengths."""
        strengths = []
        
        if keyword_analysis["overall_score"] > 70:
            strengths.append("Strong keyword presence across multiple categories")
        
        if formatting_score > 80:
            strengths.append("Good ATS formatting and structure")
        
        # Category-specific strengths
        for category, data in keyword_analysis["by_category"].items():
            if data["percentage"] > 80:
                strengths.append(f"Excellent {category} keyword coverage")
        
        return strengths
    
    def _identify_improvement_areas(self, keyword_analysis: Dict, formatting_score: float) -> List[str]:
        """Identify areas for improvement."""
        areas = []
        
        if keyword_analysis["overall_score"] < 50:
            areas.append("Low keyword density - consider adding more relevant terms")
        
        if formatting_score < 70:
            areas.append("ATS formatting needs improvement")
        
        # Category-specific areas
        for category, data in keyword_analysis["by_category"].items():
            if data["percentage"] < 40:
                areas.append(f"Limited {category} keyword presence")
        
        return areas
    
    def get_ats_keywords_for_job(self, job_title: str, industry: str = None) -> List[str]:
        """Get recommended ATS keywords for a specific job."""
        if industry and industry in self.ats_keywords:
            return self.ats_keywords[industry]
        
        # Default to general keywords if industry not specified
        all_keywords = []
        for category_keywords in self.ats_keywords.values():
            all_keywords.extend(category_keywords)
        
        return list(set(all_keywords))  # Remove duplicates
    
    def suggest_resume_sections(self) -> Dict[str, List[str]]:
        """Suggest standard resume sections and content."""
        return {
            "contact": ["Name", "Email", "Phone", "Location", "LinkedIn"],
            "summary": ["Professional summary", "Career objective", "Personal statement"],
            "experience": ["Company name", "Job title", "Duration", "Key achievements", "Technologies used"],
            "education": ["Degree", "Institution", "Graduation year", "GPA (if high)", "Relevant coursework"],
            "skills": ["Technical skills", "Soft skills", "Languages", "Certifications", "Tools"],
            "projects": ["Project name", "Description", "Technologies", "Outcomes", "GitHub link"],
            "achievements": ["Awards", "Certifications", "Publications", "Presentations", "Leadership roles"]
        }
