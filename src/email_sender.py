import smtplib, ssl, json, os
from email.mime.multipart import MIMEMultipart
from email.mime.base import MIMEBase
from email.mime.text import MIMEText
from email import encoders

def load_email_config():
    """Load SMTP config from config.json"""
    config_path = os.path.join(os.path.dirname(__file__), "..", "config.json")
    try:
        with open(config_path, "r") as f:
            return json.load(f)
    except Exception as e:
        print(f"❌ Failed to load config.json: {e}")
        return None

def send_email_with_attachment(recipient_email, subject, body, attachment_path):
    config = load_email_config()
    if not config:
        return False

    smtp_server = config["smtp_server"]
    smtp_port = config["smtp_port"]
    sender_email = config["sender_email"]
    sender_password = config["sender_password"]

    try:
        # Create message
        msg = MIMEMultipart()
        msg["From"] = sender_email
        msg["To"] = recipient_email
        msg["Subject"] = subject

        # Body
        msg.attach(MIMEText(body, "plain"))

        # File
        with open(attachment_path, "rb") as attachment:
            part = MIMEBase("application", "octet-stream")
            part.set_payload(attachment.read())
            encoders.encode_base64(part)
            part.add_header("Content-Disposition", f"attachment; filename={os.path.basename(attachment_path)}")
            msg.attach(part)

        # Send email
        context = ssl.create_default_context()
        with smtplib.SMTP(smtp_server, smtp_port) as server:
            server.starttls(context=context)
            server.login(sender_email, sender_password)
            server.sendmail(sender_email, recipient_email, msg.as_string())

        return True
    except Exception as e:
        print(f"❌ Error sending email: {e}")
        return False
