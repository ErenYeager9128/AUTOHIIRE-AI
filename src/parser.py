import pdfplumber
import os
import logging

def extract_text_from_pdf(file_path):
    """
    Extract text from a PDF file with error handling and validation.
    
    Args:
        file_path (str): Path to the PDF file
        
    Returns:
        str: Extracted text from the PDF
        
    Raises:
        FileNotFoundError: If the file doesn't exist
        ValueError: If the file is not a valid PDF
        Exception: For other PDF processing errors
    """
    # Validate file exists
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"PDF file not found: {file_path}")
    
    # Validate file extension
    if not file_path.lower().endswith('.pdf'):
        raise ValueError(f"File must be a PDF: {file_path}")
    
    try:
        text = ""
        with pdfplumber.open(file_path) as pdf:
            if not pdf.pages:
                raise ValueError("PDF appears to be empty or corrupted")
                
            for page_num, page in enumerate(pdf.pages):
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"
                else:
                    logging.warning(f"Page {page_num + 1} had no extractable text")
        
        if not text.strip():
            raise ValueError("No text could be extracted from the PDF")
            
        logging.info(f"Successfully extracted {len(text)} characters from {file_path}")
        return text
        
    except pdfplumber.pdfminer.pdfparser.PDFSyntaxError as e:
        raise ValueError(f"Invalid or corrupted PDF file: {e}")
    except Exception as e:
        raise Exception(f"Error processing PDF {file_path}: {e}")
