from reportlab.lib.pagesizes import A4
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer,
    ListFlowable, ListItem, Table, TableStyle
)
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.cidfonts import UnicodeCIDFont

# Register Unicode font (supports special chars + multi-lang)
pdfmetrics.registerFont(UnicodeCIDFont('HeiseiMin-W3'))

# Styles
styles = getSampleStyleSheet()
styles.add(ParagraphStyle(name="SectionHeader", fontSize=14, textColor=colors.white,
                          spaceAfter=10, alignment=1, backColor=colors.HexColor("#2E86C1"), leading=16))
styles.add(ParagraphStyle(name="JobHeader", fontSize=12, textColor=colors.black,
                          leading=14, spaceAfter=4, backColor=colors.HexColor("#D5DBDB")))
styles.add(ParagraphStyle(name="NormalBold", fontSize=10, leading=12,
                          textColor=colors.black, spaceAfter=4, fontName="Helvetica-Bold"))

def generate_pdf_report(student_name, summary, skills, target_roles, ats_data, job_matches, suggestions, filename="resume_report.pdf"):
    doc = SimpleDocTemplate(filename, pagesize=A4)
    flow = []

    # Title
    flow.append(Paragraph("AI-Powered Resume & Job Match Report", styles['Title']))
    flow.append(Spacer(1, 12))

    # Candidate
    flow.append(Paragraph(f"<b>Candidate:</b> {student_name}", styles['Normal']))
    flow.append(Spacer(1, 6))

    # Skills Section
    flow.append(Paragraph("Skills & Knowledge Set", styles['SectionHeader']))
    flow.append(ListFlowable([ListItem(Paragraph(skill, styles['Normal'])) for skill in skills]))
    flow.append(Spacer(1, 12))

    # Target Roles
    flow.append(Paragraph("Target Roles", styles['SectionHeader']))
    flow.append(ListFlowable([ListItem(Paragraph(role, styles['Normal'])) for role in target_roles]))
    flow.append(Spacer(1, 12))

    # Suggestions Section
    flow.append(Paragraph("AI Resume Suggestions", styles['SectionHeader']))
    for line in suggestions.split("\n"):
        if line.strip():
            flow.append(Paragraph(f"• {line.strip()}", styles['Normal']))
    flow.append(Spacer(1, 12))

    # ATS Analysis
    flow.append(Paragraph("Gemini ATS Analysis", styles['SectionHeader']))
    overall = ats_data.get("overall_score", "N/A")
    flow.append(Paragraph(f"<b>Overall Score:</b> {overall}/100", styles['Normal']))
    flow.append(Paragraph(f"<b>Summary:</b> {ats_data.get('final_summary', 'N/A')}", styles['Normal']))
    flow.append(Spacer(1, 6))

    score_breakdown = ats_data.get("score_breakdown", {})
    data = [["Category", "Score", "Feedback"]]
    for category, details in score_breakdown.items():
        score = details.get("score", "N/A")
        feedback = details.get("feedback", "No feedback")
        data.append([category, f"{score}/100", feedback])

    ats_table = Table(data, colWidths=[120, 60, 300])
    ats_table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#117A65")),
        ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
        ("GRID", (0, 0), (-1, -1), 0.25, colors.grey),
        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("ALIGN", (1, 1), (1, -1), "CENTER"),
    ]))
    flow.append(ats_table)
    flow.append(Spacer(1, 12))

    # Job Matches
    flow.append(Paragraph("Top Job Matches", styles['SectionHeader']))
    for i, match in enumerate(job_matches, 1):
        job = match["job"]
        job_card = [
            [Paragraph(f"<b>{i}. {job['title']}</b> @ {job['company']}", styles['JobHeader'])],
            [Paragraph(f"📍 {job['location']} | 🎯 Match: {match['match_score']:.1f}%", styles['Normal'])],
            [Paragraph(f"<b>Rationale:</b> {match.get('rationale','N/A')}", styles['Normal'])],
            [Paragraph(f"<a href='{job['link']}'>🔗 Apply on LinkedIn</a>", styles['Normal'])],
        ]
        t = Table(job_card, colWidths=[500])
        t.setStyle(TableStyle([
            ("BOX", (0, 0), (-1, -1), 0.5, colors.HexColor("#AAB7B8")),
            ("INNERPADDING", (0, 0), (-1, -1), 6),
            ("BACKGROUND", (0, 0), (0, 0), colors.HexColor("#D5DBDB")),
        ]))
        flow.append(t)
        flow.append(Spacer(1, 8))

    doc.build(flow)
    return filename
