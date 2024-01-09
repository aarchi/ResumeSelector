from flask import Flask, request, jsonify
from flask_cors import CORS
from PyPDF2 import PdfReader
import docx2txt  # Import docx2txt for extracting text from DOCX files

app = Flask(__name__)
CORS(app)

@app.route('/extract_text', methods=['POST'])
def extract_text():
    try:
        # Ensure the 'file' key exists in the request
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400

        file = request.files['file']

        # Ensure the file is a PDF or DOCX
        if file.filename.endswith('.pdf'):
            # Read the PDF file and extract text
            pdf_reader = PdfReader(file)
            text = ''
            for page_num in range(len(pdf_reader.pages)):
                text += pdf_reader.pages[page_num].extract_text()

        elif file.filename.endswith(('.docx', '.doc')):
            # Use docx2txt to extract text from DOCX files
            text = docx2txt.process(file)

        else:
            return jsonify({'error': 'Unsupported file format'}), 400

        return jsonify({'text': text}), 200

    except Exception as e:
        print(str(e))
        return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    app.run(port=5001)
