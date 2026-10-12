"""Generate the submission-ready Chapter 1 PDF from project documentation."""
from pathlib import Path
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Paragraph, ListFlowable, ListItem, PageBreak, Table, TableStyle

ROOT = Path(__file__).resolve().parents[1]
DEST = ROOT / 'docs' / 'Chapter_1.pdf'
styles = getSampleStyleSheet()
styles.add(ParagraphStyle(name='SISTitle', parent=styles['Title'], alignment=TA_CENTER, fontName='Helvetica-Bold', fontSize=17, leading=22, spaceAfter=18))
styles.add(ParagraphStyle(name='SISHeading', parent=styles['Heading2'], fontSize=11, leading=15, spaceBefore=16, spaceAfter=7, textColor=colors.HexColor('#17324d')))
styles.add(ParagraphStyle(name='SISBody', parent=styles['BodyText'], fontSize=10, leading=15, spaceAfter=9))
styles.add(ParagraphStyle(name='SISFlow', parent=styles['BodyText'], fontSize=9, leading=14, leftIndent=15, spaceAfter=4))

story = [Paragraph('CHAPTER 1<br/>INTRODUCTION', styles['SISTitle'])]
def heading(text): story.append(Paragraph(text, styles['SISHeading']))
def body(text): story.append(Paragraph(text, styles['SISBody']))

heading('1.1 Project Context')
body('Schools need dependable student records for identification, enrollment review, and reporting. Paper files and scattered spreadsheets make updates and searches slow and can introduce duplicate entries. The Student Information System (SIS) provides a centralized web application for authorized users to manage those records.')
heading('1.2 Purpose and Description')
body('The SIS is a MERN application with a React frontend, Express API, and MongoDB database. Users register and sign in to manage student records. The application supports secure CRUD operations, search, filters, pagination, a live dashboard, and a personal profile. It is designed for desktop and mobile browsers.')
heading('1.3 Objectives')
body('<b>General Objective.</b> Develop a secure and responsive Student Information System that stores, retrieves, and summarizes student data accurately.')
objectives = [
    'Authenticate users with password hashing, JWTs, and protected routes.',
    'Add, view, edit, and delete validated student records while preventing duplicate IDs.',
    'Search by student ID or name, filter by course or year level, and browse paginated results.',
    'Display current student totals and grouped counts from the database.',
    'Let users view and update their own permitted profile information.',
]
body('<b>Specific Objectives.</b>')
story.append(ListFlowable([ListItem(Paragraph(x, styles['SISBody'])) for x in objectives], bulletType='1', leftIndent=22))
heading('1.4 Scope and Delimitation')
body('The system manages student ID, full name, email, course, and year level. It supports account registration, login, logout, profile name updates, and record summaries. All signed-in users can access and manage student records. Role-based permissions, grades, enrollment workflows, file uploads, and notifications are outside this version. It requires a reachable MongoDB database and an environment-configured JWT secret. This project uses demonstration data and is not connected to any official school registry.')
story.append(PageBreak())
heading('1.5 System Flowchart')
steps = [
    'Open application',
    '↓',
    'Authenticated?',
    'No → Register or log in → Validate credentials',
    'Yes / valid credentials → Dashboard',
    '↓',
    'Browse students ↔ Search / filter / paginate',
    '↕',
    'Add / view / edit / delete student records',
    '↕',
    'View or update own profile',
    '↓',
    'Log out → Login',
]
for step in steps:
    if step in ('↓', '↕'):
        story.append(Paragraph(step, styles['SISFlow']))
    else:
        table = Table([[Paragraph(step, styles['SISBody'])]], colWidths=[4.7*inch])
        table.setStyle(TableStyle([('BOX', (0,0), (-1,-1), 0.8, colors.HexColor('#86a9c5')), ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#f5f8fc')), ('LEFTPADDING', (0,0), (-1,-1), 12), ('RIGHTPADDING', (0,0), (-1,-1), 12), ('TOPPADDING', (0,0), (-1,-1), 8), ('BOTTOMPADDING', (0,0), (-1,-1), 3)]))
        story.append(table)

def footer(canvas, doc):
    canvas.setFont('Helvetica', 8)
    canvas.setFillColor(colors.grey)
    canvas.drawRightString(letter[0] - inch, 0.65 * inch, str(doc.page))

SimpleDocTemplate(str(DEST), pagesize=letter, topMargin=inch, leftMargin=1.5*inch, rightMargin=inch, bottomMargin=inch).build(story, onFirstPage=footer, onLaterPages=footer)
print(DEST)
