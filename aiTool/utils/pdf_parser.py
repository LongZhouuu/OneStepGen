"""
pdf_parser.py — Extract text from uploaded PDF files.

This module uses PyPDF to read every page of a PDF and combine
the text into a single string.  It handles common edge-cases
(empty files, encrypted / unreadable pages) gracefully.
"""

from pypdf import PdfReader
from io import BytesIO


def extract_text_from_pdf(file_bytes: bytes) -> str:
    """
    Read a PDF from raw bytes and return all text found inside it.

    Parameters
    ----------
    file_bytes : bytes
        The raw content of the uploaded PDF file.

    Returns
    -------
    str
        All text extracted from every page, joined together.

    Raises
    ------
    ValueError
        If the PDF contains no readable text at all.
    Exception
        If the file is corrupted or not a valid PDF.
    """

    try:
        # Wrap the raw bytes in a file-like object so PyPDF can read it
        pdf_stream = BytesIO(file_bytes)
        reader = PdfReader(pdf_stream)

        # Collect text from every page
        all_text_parts: list[str] = []

        for page_number, page in enumerate(reader.pages, start=1):
            page_text = page.extract_text()

            if page_text:                       # skip blank pages
                all_text_parts.append(page_text)

        # Combine everything into one string
        combined_text = "\n".join(all_text_parts).strip()

        # Guard: if we got nothing useful, tell the caller
        if not combined_text:
            raise ValueError(
                "The PDF appears to be empty or contains only images / "
                "scanned content that cannot be read as text."
            )

        return combined_text

    except ValueError:
        # Re-raise our own "empty PDF" error as-is
        raise

    except Exception as error:
        # Catch anything else (corrupt file, wrong format, etc.)
        raise Exception(
            f"Could not read the PDF file. Details: {error}"
        ) from error
