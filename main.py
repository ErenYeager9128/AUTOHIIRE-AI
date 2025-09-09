import logging
import os
import time
import textwrap
from src.parser import extract_text_from_pdf
from src.job_matcher import JobMatcher
from src.web_scraper import scrape_linkedin_jobs
from src.ai_analyzer import *
from src.report_generator import generate_pdf_report
from src.email_sender import send_email_with_attachment



def run_single_resume_analysis(resume_path: str):
    job_matcher = JobMatcher()
    print(f"📄 Processing: {os.path.basename(resume_path)}")

    # --- Extract Resume Text ---
    resume_text = extract_text_from_pdf(resume_path)

    # --- AI Analysis ---
    summary, search_keywords = create_knowledge_set(resume_text); time.sleep(1)
    suggestions = generate_resume_suggestions(resume_text); time.sleep(1)
    ats_data = get_ats_score_and_feedback(resume_text); time.sleep(1)

    print_section("AI-Powered Resume Insights")
    print_card("Professional Profile", summary, emoji="👤")
    print_card("Top Suggestions", suggestions, emoji="💡")
    print_ats_chart(ats_data)

    # --- Job Search ---
    print_section("Personalize Your Job Search")
    location_input = input("📍 Enter a location (e.g., Pune, Worldwide) or press Enter for 'India': ").strip() or "India"
    work_model_input = input("💼 Enter work model (e.g., remote) or press Enter for 'hybrid': ").strip() or "hybrid"
    ai_experience_level = analyze_experience_level(resume_text)

    internship_matches, entry_level_matches = [], []
    if ai_experience_level == "Fresher":
        print("\n🤖 AI analysis: No prior work experience detected. Searching for internships first...")
        time.sleep(1)
        print_section(f"Internship Opportunities in '{location_input}'", emoji="🎓")
        internship_matches = perform_job_search(job_matcher, resume_text, search_keywords, work_model_input, "intern", location_input)
        display_job_results(internship_matches, resume_text)

    print_section(f"Entry-Level Opportunities in '{location_input}'", emoji="🚀")
    entry_level_matches = perform_job_search(job_matcher, resume_text, search_keywords, work_model_input, "entry-level", location_input)
    display_job_results(entry_level_matches, resume_text)

    # --- PDF Report Generation ---
    all_matches = internship_matches + entry_level_matches

    # Add rationales for PDF
    jobs_to_rationalize = [match["job"] for match in all_matches]
    rationales = generate_all_rationales_in_batch(resume_text, jobs_to_rationalize)
    for i, match in enumerate(all_matches, 1):
        match["rationale"] = rationales.get(str(i), "N/A")

    student_name = os.path.basename(resume_path).replace(".pdf", "")
    pdf_path = generate_pdf_report(
        student_name=student_name,
        summary=summary,
        skills=search_keywords,
        target_roles=search_keywords,
        ats_data=ats_data,
        job_matches=all_matches,
        suggestions=suggestions,
        filename=f"{student_name}_AI_Report.pdf"
    )
    print(f"\n📄 Report saved as: {pdf_path}")

    # --- Email Send Option ---
    send_it = input("📧 Do you want to email this report? (yes/no): ").strip().lower()
    if send_it in ['y', 'yes']:
        recipient = input("   Enter recipient email: ").strip()
        if recipient:
            subject = f"AI Resume Analysis Report - {student_name}"
            body = f"Hello,\n\nPlease find attached the AI-powered resume analysis and job matching report for {student_name}.\n\nBest regards,\nAutoHire AI"
            success = send_email_with_attachment(recipient, subject, body, pdf_path)
            if success:
                print(f"✅ Report successfully emailed to {recipient}")
            else:
                print("❌ Failed to send email.")

def print_section(title, emoji=""):
    title_text = f" {emoji} {title} " if emoji else f" {title} "
    print(f"\n┌─{'─' * len(title_text)}┐")
    print(f"│{title_text}│")
    print(f"└─{'─' * len(title_text)}┘")

def print_card(title, content, emoji="🔹"):
    print(f"\n{emoji} {title}")
    indented_content = textwrap.indent(content, '   ')
    print(indented_content)

def print_ats_chart(ats_data: dict):
    if "error" in ats_data or not ats_data.get("score_breakdown"):
        print("   Could not generate ATS chart."); return
    print_section("Gemini-Powered ATS Analysis")
    overall_score = ats_data.get("overall_score", 0)
    print(f"\n   ATS Score: {overall_score} / 100")
    bar_length = 40; filled_length = int(bar_length * overall_score / 100)
    bar = '█' * filled_length + '░' * (bar_length - filled_length)
    print(f"   [{bar}]")
    print(f"\n   Summary: {ats_data.get('final_summary', 'N/A')}")
    print("\n   Score Breakdown:")
    for category, details in ats_data.get("score_breakdown", {}).items():
        score = details.get("score", 0); feedback = details.get("feedback", "No feedback.")
        cat_bar_len = 20; cat_filled = int(cat_bar_len * score / 100)
        cat_bar = '█' * cat_filled + '░' * (cat_bar_len - cat_filled)
        print(f"   - {category:<25} [{cat_bar}] {score}/100")
        print(f"     └─ {feedback}")

def perform_job_search(job_matcher, resume_text, search_terms, work_model, experience_level, location):
    all_jobs = []; seen_jobs = set()
    print(f"\n🧠 Using your AI-generated profile for a targeted search...")
    for term in search_terms:
        print(f"   - Searching LinkedIn for '{term}' in {location}...")
        scraped_jobs = scrape_linkedin_jobs(term, location, work_model, experience_level)
        for job in scraped_jobs:
            job_key = (job['title'], job['company'])
            if job_key not in seen_jobs:
                all_jobs.append(job); seen_jobs.add(job_key)
    matches = job_matcher.match_resume_to_jobs(resume_text, all_jobs)
    matches.sort(key=lambda x: x['match_score'], reverse=True)
    return [m for m in matches if m["match_score"] >= 30.0]

def display_job_results(matches, resume_text):
    if not matches:
        print("\nCould not find any relevant matches.")
    else:
        jobs_to_rationalize = [match["job"] for match in matches]
        rationales = generate_all_rationales_in_batch(resume_text, jobs_to_rationalize)
        for i, match in enumerate(matches, 1):
            rationale = rationales.get(str(i), "🔹 Rationale could not be generated.")
            print(f"\n{i}. {match['job']['title']} @ {match['job']['company']}")
            print(f"   📍 {match['job']['location']} | 🎯 Match: {match['match_score']:.1f}%")
            print(f"   {rationale}")
            print(f"   🔗 Link: {match['job']['link']}")

def find_all_pdfs(directory: str) -> list:
    pdf_files = []
    try:
        for filename in os.listdir(directory):
            if filename.lower().endswith(".pdf"):
                pdf_files.append(os.path.join(directory, filename))
    except FileNotFoundError:
        return []
    return pdf_files

def select_resume_from_list(pdf_files: list) -> str or None:
    if len(pdf_files) == 1:
        return pdf_files[0]
    print_section("Select a Resume to Analyze")
    print("Multiple resumes found. Please choose one:")
    for i, file in enumerate(pdf_files, 1):
        print(f"  {i}. {os.path.basename(file)}")
    try:
        choice = int(input("\nEnter the number of the resume you want to analyze first: ")) - 1
        if 0 <= choice < len(pdf_files):
            return pdf_files[choice]
        else:
            print("❌ Invalid selection."); return None
    except ValueError:
        print("❌ Invalid input. Please enter a number."); return None

def main():
    try:
        logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
        data_directory = "data"
        pdf_files = find_all_pdfs(data_directory)

        if not pdf_files:
            print("❌ No PDF resumes found in the 'data' folder. Please add one to continue.")
            return

        selected_resume = select_resume_from_list(pdf_files)
        if not selected_resume:
            return

        run_single_resume_analysis(selected_resume)
        print("\n\n✅ Analysis Complete. Report generated.")

    except Exception as e:
        logging.error(f"An unexpected error occurred in main: {e}", exc_info=True)
        print(f"❌ An unexpected error occurred: {e}")

if __name__ == "__main__":
    main()
