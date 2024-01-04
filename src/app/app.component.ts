import { Component } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ResumeSelection';
  resumeFile: File | null = null;
  fileContent: string | null = null;
  chatGptResponse: any; // Store the response from ChatGPT
  errorMessage: string | null = null; // Declare the errorMessage property
  jobDescription: string = ''; // Initialize jobDescription
  apiKey: string = ''; // Initialize apiKey

  minExperience: number = 0; // Initialize minExperience
  maxExperience: number = 10; // Initialize maxExperience
  mandatorySkill: string = ''; // Initialize mandatorySkill
  optionalSkill: string = ''; // Initialize optionalSkill

  constructor(private http: HttpClient) { }

  // Define a function to format the response content with line breaks
  formatChatGptResponse(responseContent: string): string {
    return responseContent.replace(/\n/g, '<br>');
  }


  onFileSelected(event: any) {
    this.resumeFile = event.target.files[0];

    // Read the file content as text
    if (this.resumeFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.fileContent = reader.result as string;
      };
      reader.readAsText(this.resumeFile);
    }
  }

  onSubmit() {
    if (this.apiKey && this.fileContent && this.minExperience <= this.maxExperience && this.mandatorySkill) {
      // Replace 'YOUR_CHATGPT_API_ENDPOINT' with the actual ChatGPT API endpoint
      const chatGptApiEndpoint = 'https://api.openai.com/v1/chat/completions';

      const requestString = `
*Job Description and Resume Evaluation*

Given the following job description and resume, your task is to estimate the chances of resume selection for this job in percentage. Provide insights, logical reasoning, and highlight keywords in bold. Ensure accuracy and consistency in your assessment. Follow the specified format:

*Job Description:*
${this.jobDescription}

- Minimum Experience Required: ${this.minExperience} years
- Maximum Experience Required: ${this.maxExperience} years
- Mandatory Skill: ${this.mandatorySkill}
- Optional Skill: ${this.optionalSkill || 'Not specified'}

*Resume:*
${this.fileContent}

Important note -
Take min and max experience range strictly for calculating percentage
Optional skill is not mandatory so don't use it for percentage calculatoion if its empty. But if its there then it will be in favour of candidate

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

Your response should be well-organized and in above format, providing a clear rationale for the estimated percentage. Please use above format for displaying the results. Add labels and then explaing the insight. Thank you for your attention to detail.
`;



      // Define your ChatGPT request payload
      const chatGptRequest = {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'user',
            content: requestString // Use the request string as the user's input
          }
        ]
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
          },
          (errorResponse: HttpErrorResponse) => {
            if (errorResponse.status === 429) {
              this.errorMessage = 'Rate limit exceeded. Please try again later.';
            } else {
              this.errorMessage = 'An error occurred while communicating with ChatGPT.';
            }
            console.error('Error communicating with ChatGPT:', errorResponse);
          }
        );

    }
  }
}