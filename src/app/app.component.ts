// Import necessary modules and components
import { Component } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { PdfService } from './pdf.service'; // Import PdfService

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  // Declare variables for form fields, API key, and other properties
  title = 'ResumeSelection';
  resumeFiles: File[] = [];
  fileContents: string[] = [];
  chatGptResponse: any; // Store the response from ChatGPT
  errorMessage: string | null = null; // Declare the errorMessage property
  jobDescription: string = ''; // Initialize jobDescription
  apiKey: string = ''; // Initialize apiKey

  minExperience: number = 0; // Initialize minExperience
  maxExperience: number = 10; // Initialize maxExperience
  mandatorySkill: string = ''; // Initialize mandatorySkill
  optionalSkill: string = ''; // Initialize optionalSkill

  loading: boolean = false;

  // Add this property to track file count exceeded status
  fileCountExceeded: boolean = false;

  // Inject HttpClient and PdfService into the constructor
  constructor(private http: HttpClient, private pdfService: PdfService) { }

  // Define a function to format the response content with line breaks
  formatChatGptResponse(responseContent: string): string {
    return responseContent.replace(/\n/g, '<br>');
  }

  // Define a function to handle file selection
  onFileSelected(event: any) {
    // Ensure that the number of selected files is not more than 3
    if (event.target.files.length > 2) {
      // Set the fileCountExceeded flag to true
      this.fileCountExceeded = true;
      // Reset the file input
      event.target.value = null;
      return;
    }
    // If the file count is within the limit, reset the fileCountExceeded flag
    this.fileCountExceeded = false;
    this.resumeFiles = Array.from(event.target.files);

    // Read the file content as text for each file
    this.resumeFiles.forEach((resumeFile, index) => {
      if (resumeFile.type === 'application/pdf' || resumeFile.type === 'application/msword' || resumeFile.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        this.pdfService.extractTextFromPDF(resumeFile).subscribe(
          (response) => {
            const extractedText = response.text.replace(/\s+/g, ' ').trim();
            console.log(`Extracted text for Resume ${index + 1}:`, extractedText);
            this.fileContents[index] = extractedText;
          },
          (error) => {
            console.error(`Error extracting text for Resume ${index + 1}:`, error);
            this.errorMessage = `Error extracting text from PDF for Resume ${index + 1}.`;
          }
        );
      } else if (resumeFile.type.startsWith('text/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.fileContents[index] = reader.result as string;
        };
        reader.readAsText(resumeFile);
      } else {
        this.errorMessage = 'Unsupported file type';
        console.error('Unsupported file type');
      }
    });
  }
  // Function to reset the form
  resetForm() {
    // Optionally, reset the file input field
    const fileInput = document.getElementById('resumeFiles') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }
  // Define a function to handle form submission
  onSubmit() {
    // Check if required fields are filled
    if (this.apiKey && this.resumeFiles.length > 0 && this.minExperience <= this.maxExperience && this.mandatorySkill) {
      this.loading = true;  // Set loading to true
      // Initialize the request string with job description and other details
      let requestString = `
      *Job Description:*
      ${this.jobDescription}

      - Minimum Experience Required: ${this.minExperience} years
      - Maximum Experience Required: ${this.maxExperience} years
      - Mandatory Skill: ${this.mandatorySkill}
      - Optional Skill: ${this.optionalSkill || 'Not specified'}

      Important note -
      Take min and max experience range strictly for calculating percentage
      Optional skill is not mandatory, so don't use it for the percentage calculation if it's empty. But if it's there, then it will be in favor of the candidate

      *Chances of Resume Selection: [Provide a percentage estimate]*

      *Insights and Logic:*
      1. Analyze the alignment of the resume with the job description.
      *keywords*
      2. Highlight relevant *keywords* in both the job description and the resume.
      *experience and skills*
      3. Consider the specified experience and skills, and evaluate how well the resume fulfills these criteria.
      *exceptional achievements*
      4. Comment on any exceptional achievements or experiences that enhance the candidate's suitability.
      *career stability*
      5. Assess the candidate's job-switching frequency. While this does not impact the percentage calculation, it provides context on the candidate's career stability.
      6. Ensure a consistent and thorough evaluation to maintain accuracy.

      Your response should be well-organized and in the above format, providing a clear rationale for the estimated percentage. Please use the above format for displaying the results. Add labels and then explain the insight. Thank you for your attention to detail.

      -------------------------------
    `;

      // Append each resume with a label to the request string
      this.resumeFiles.forEach((resumeFile, index) => {
        requestString += `
        *Resume ${index + 1}:*
        ${this.fileContents[index]}
        -------------------------------
      `;
      });

      // Continue with the rest of your code to make the API request with the updated requestString
      this.makeChatGptRequest(requestString);
    }
  }

  // Function to make the ChatGPT API request
  private makeChatGptRequest(requestString: string) {
    this.loading = true;
    // Replace 'YOUR_CHATGPT_API_ENDPOINT' with the actual ChatGPT API endpoint
    const chatGptApiEndpoint = 'https://api.openai.com/v1/chat/completions';

    // Define your ChatGPT request payload
    const chatGptRequest = {
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'user',
          content: requestString // Use the request string as the user's input
        }
      ],
    };

    const headers = {
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json' // Set the Content-Type header
    };

    // Make an HTTP POST request to the ChatGPT API
    this.http.post(chatGptApiEndpoint, chatGptRequest, { headers: headers })
      .subscribe(
        (response) => {
          this.chatGptResponse = response;
          console.log('ChatGPT response:', response);
          this.loading = false;  // Reset loading to false
          // Reset the form after receiving the response
          this.resetForm();
        },
        (errorResponse: HttpErrorResponse) => {
          if (errorResponse.status === 429) {
            this.errorMessage = 'Rate limit exceeded. Please try again later.';
          } else {
            this.errorMessage = 'An error occurred while communicating with ChatGPT.';
          }
          console.error('Error communicating with ChatGPT:', errorResponse);
          this.loading = true;
        }
      );
  }
}
