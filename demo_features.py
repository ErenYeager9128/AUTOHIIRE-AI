"""
AutoHire AI - Feature Demo Script
Demonstrates individual features for testing and development.
"""

import logging
from src.resume_manager import ResumeManager
from src.job_matcher import JobMatcher
from src.resume_optimizer import ResumeOptimizer
from src.parser import extract_text_from_pdf

def demo_resume_manager():
    """Demo the resume management features."""
    print("\n" + "="*50)
    print("📁 Resume Manager Demo")
    print("="*50)
    
    try:
        manager = ResumeManager()
        
        # Show current status
        print(f"📊 Current resumes: {manager.get_upload_count()}/3")
        print(f"📁 Available slots: {manager.get_remaining_slots()}")
        
        # List existing resumes
        resumes = manager.get_resumes()
        if resumes:
            print("\n📄 Existing Resumes:")
            for resume in resumes:
                print(f"   • {resume['original_filename']} (ID: {resume['id']})")
                print(f"     Size: {resume['file_size']} bytes | Uploaded: {resume['upload_date'][:10]}")
        else:
            print("\n📄 No resumes uploaded yet")
        
        return manager
        
    except Exception as e:
        print(f"❌ Error in resume manager demo: {e}")
        return None

def demo_job_matcher():
    """Demo the job matching features."""
    print("\n" + "="*50)
    print("💼 Job Matcher Demo")
    print("="*50)
    
    try:
        matcher = JobMatcher()
        
        # Show available jobs
        all_jobs = matcher.get_all_jobs()
        print(f"📋 Total jobs available: {len(all_jobs)}")
        
        # Show job categories
        print("\n🎯 Job Categories:")
        categories = {}
        for job in all_jobs:
            job_type = job['title'].split()[0]  # First word of title
            categories[job_type] = categories.get(job_type, 0) + 1
        
        for category, count in categories.items():
            print(f"   • {category}: {count} jobs")
        
        # Demo job search
        print("\n🔍 Job Search Demo:")
        search_results = matcher.search_jobs("python")
        print(f"   Jobs matching 'python': {len(search_results)}")
        for job in search_results[:2]:
            print(f"     - {job['title']} at {job['company']}")
        
        return matcher
        
    except Exception as e:
        print(f"❌ Error in job matcher demo: {e}")
        return None

def demo_resume_optimizer():
    """Demo the resume optimization features."""
    print("\n" + "="*50)
    print("🔧 Resume Optimizer Demo")
    print("="*50)
    
    try:
        optimizer = ResumeOptimizer()
        
        # Show ATS keywords
        print("📝 ATS Keywords by Category:")
        for category, keywords in optimizer.ats_keywords.items():
            print(f"   • {category}: {len(keywords)} keywords")
        
        # Show formatting rules
        print("\n📋 Formatting Rules:")
        for priority, rules in optimizer.formatting_rules.items():
            print(f"   {priority.title()}: {len(rules)} rules")
        
        # Show resume sections
        sections = optimizer.suggest_resume_sections()
        print(f"\n📄 Recommended Resume Sections: {len(sections)}")
        for section, items in list(sections.items())[:3]:
            print(f"   • {section.title()}: {len(items)} items")
        
        return optimizer
        
    except Exception as e:
        print(f"❌ Error in resume optimizer demo: {e}")
        return None

def demo_integration():
    """Demo the integrated features."""
    print("\n" + "="*50)
    print("🚀 Integration Demo")
    print("="*50)
    
    try:
        # Initialize all components
        manager = ResumeManager()
        matcher = JobMatcher()
        optimizer = ResumeOptimizer()
        
        # Check if we have a resume to work with
        resumes = manager.get_resumes()
        if not resumes:
            print("📄 No resumes available for integration demo")
            print("💡 Try uploading a resume first")
            return
        
        # Get first resume
        resume = resumes[0]
        resume_text = manager.get_resume_text(resume['id'])
        
        if not resume_text:
            print("❌ Could not extract text from resume")
            return
        
        print(f"📄 Analyzing resume: {resume['original_filename']}")
        print(f"📊 Text length: {len(resume_text)} characters")
        
        # Analyze resume
        print("\n🔍 Resume Analysis:")
        analysis = optimizer.analyze_resume(resume_text)
        if "error" not in analysis:
            print(f"   📈 Overall Score: {analysis['overall_score']}/100")
            print(f"   🎯 ATS Score: {analysis['ats_compatibility']['formatting_score']}/100")
        
        # Match to jobs
        print("\n💼 Job Matching:")
        matches = matcher.match_resume_to_jobs(resume_text, top_n=2)
        for i, match in enumerate(matches, 1):
            job = match["job"]
            score = match["match_score"]
            print(f"   {i}. {job['title']} - {score:.1f}% match")
        
        print("\n✅ Integration demo completed successfully!")
        
    except Exception as e:
        print(f"❌ Error in integration demo: {e}")

def main():
    """Run all demos."""
    print("🚀 AutoHire AI - Feature Demo Suite")
    print("="*60)
    
    # Configure logging
    logging.basicConfig(level=logging.INFO)
    
    try:
        # Run individual demos
        demo_resume_manager()
        demo_job_matcher()
        demo_resume_optimizer()
        
        # Run integration demo
        demo_integration()
        
        print("\n" + "="*60)
        print("🎉 All Demos Completed Successfully!")
        print("="*60)
        print("\n✨ Features Available:")
        print("   • Resume Management (max 3 uploads)")
        print("   • Job Matching with Scoring")
        print("   • Resume Optimization & ATS Compatibility")
        print("   • Career Classification")
        print("   • Skills Analysis")
        
        print("\n🚀 Next Steps:")
        print("   • Run 'python main.py' for full demo")
        print("   • Upload your own resumes")
        print("   • Customize job database")
        print("   • Integrate with external APIs")
        
    except Exception as e:
        print(f"\n❌ Demo suite failed: {e}")
        logging.error(f"Demo suite error: {e}")

if __name__ == "__main__":
    main()
