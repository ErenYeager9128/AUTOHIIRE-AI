import os
import json
import logging
from datetime import datetime
from typing import List, Dict, Optional
from .parser import extract_text_from_pdf

class ResumeManager:
    """Manages multiple resume uploads with a maximum limit of 3."""
    
    def __init__(self, storage_dir: str = "data/resumes"):
        self.storage_dir = storage_dir
        self.max_resumes = 3
        self.metadata_file = os.path.join(storage_dir, "resume_metadata.json")
        self._ensure_storage_dir()
        self._load_metadata()
    
    def _ensure_storage_dir(self):
        """Create storage directory if it doesn't exist."""
        os.makedirs(self.storage_dir, exist_ok=True)
    
    def _load_metadata(self):
        """Load existing resume metadata."""
        if os.path.exists(self.metadata_file):
            try:
                with open(self.metadata_file, 'r') as f:
                    self.metadata = json.load(f)
            except (json.JSONDecodeError, FileNotFoundError):
                self.metadata = []
        else:
            self.metadata = []
    
    def _save_metadata(self):
        """Save resume metadata to file."""
        with open(self.metadata_file, 'w') as f:
            json.dump(self.metadata, f, indent=2)
    
    def upload_resume(self, file_path: str, original_filename: str) -> Dict:
        """
        Upload a new resume file.
        
        Args:
            file_path: Path to the resume file
            original_filename: Original filename from user
            
        Returns:
            Dict with upload status and resume info
            
        Raises:
            ValueError: If max resume limit reached or invalid file
        """
        # Check if max limit reached
        if len(self.metadata) >= self.max_resumes:
            raise ValueError(f"Maximum of {self.max_resumes} resumes allowed. Please delete one before uploading.")
        
        # Validate file
        if not os.path.exists(file_path):
            raise ValueError("Resume file not found")
        
        if not file_path.lower().endswith('.pdf'):
            raise ValueError("Only PDF files are supported")
        
        # Generate unique filename
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        safe_filename = f"resume_{timestamp}_{len(self.metadata) + 1}.pdf"
        new_path = os.path.join(self.storage_dir, safe_filename)
        
        # Copy file to storage
        import shutil
        shutil.copy2(file_path, new_path)
        
        # Extract text and analyze
        try:
            text_content = extract_text_from_pdf(new_path)
            
            # Create resume entry
            resume_info = {
                "id": len(self.metadata) + 1,
                "original_filename": original_filename,
                "stored_filename": safe_filename,
                "file_path": new_path,
                "upload_date": datetime.now().isoformat(),
                "file_size": os.path.getsize(new_path),
                "text_length": len(text_content),
                "status": "uploaded"
            }
            
            # Add to metadata
            self.metadata.append(resume_info)
            self._save_metadata()
            
            logging.info(f"Resume uploaded successfully: {original_filename}")
            return {
                "success": True,
                "resume_info": resume_info,
                "message": f"Resume '{original_filename}' uploaded successfully"
            }
            
        except Exception as e:
            # Clean up on failure
            if os.path.exists(new_path):
                os.remove(new_path)
            raise Exception(f"Failed to process resume: {e}")
    
    def get_resumes(self) -> List[Dict]:
        """Get list of all uploaded resumes."""
        return self.metadata.copy()
    
    def get_resume(self, resume_id: int) -> Optional[Dict]:
        """Get specific resume by ID."""
        for resume in self.metadata:
            if resume["id"] == resume_id:
                return resume
        return None
    
    def delete_resume(self, resume_id: int) -> bool:
        """
        Delete a resume by ID.
        
        Returns:
            True if deleted successfully, False otherwise
        """
        resume = self.get_resume(resume_id)
        if not resume:
            return False
        
        try:
            # Remove file
            if os.path.exists(resume["file_path"]):
                os.remove(resume["file_path"])
            
            # Remove from metadata
            self.metadata = [r for r in self.metadata if r["id"] != resume_id]
            self._save_metadata()
            
            logging.info(f"Resume deleted: {resume['original_filename']}")
            return True
            
        except Exception as e:
            logging.error(f"Failed to delete resume: {e}")
            return False
    
    def get_resume_text(self, resume_id: int) -> Optional[str]:
        """Get the extracted text content of a resume."""
        resume = self.get_resume(resume_id)
        if not resume:
            return None
        
        try:
            return extract_text_from_pdf(resume["file_path"])
        except Exception as e:
            logging.error(f"Failed to extract text from resume {resume_id}: {e}")
            return None
    
    def get_upload_count(self) -> int:
        """Get current number of uploaded resumes."""
        return len(self.metadata)
    
    def get_remaining_slots(self) -> int:
        """Get remaining upload slots."""
        return max(0, self.max_resumes - len(self.metadata))
    
    def clear_all_resumes(self) -> bool:
        """Clear all uploaded resumes (use with caution)."""
        try:
            # Remove all files
            for resume in self.metadata:
                if os.path.exists(resume["file_path"]):
                    os.remove(resume["file_path"])
            
            # Clear metadata
            self.metadata = []
            self._save_metadata()
            
            logging.info("All resumes cleared")
            return True
            
        except Exception as e:
            logging.error(f"Failed to clear resumes: {e}")
            return False
