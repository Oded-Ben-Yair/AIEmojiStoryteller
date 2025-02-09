# AI-Powered Emoji Storyteller

AI-Powered Emoji Storyteller is a creative web application that leverages advanced language models (GPT-4) to generate emoji sequences and engaging short stories. The app offers two modes:

- **Text-to-Story Mode:** Enter a story prompt and have the app translate it into a sequence of emojis, then generate a narrative that explains each emoji.
- **Emoji-to-Story Mode:** Directly input a sequence of emojis and generate a story based on them.

The project features a modern, professional frontend built with Bootstrap 5 and a robust backend powered by FastAPI.

## Features

- **Dual Modes:**  
  - *Text-to-Story:* Converts a text prompt into emojis and then generates a story.  
  - *Emoji-to-Story:* Generates a story directly from an emoji sequence.
- **Advanced Language Generation:** Utilizes OpenAI's GPT-4 for generating creative responses.
- **Professional UI:** Clean, responsive design using Bootstrap 5.
- **API Endpoints:**  
  - `/translate`: Converts a text prompt to an emoji sequence.  
  - `/generate`: Generates a story based on an emoji sequence.  
  - `/reverse`: Generates a story directly from an emoji sequence.
- **CORS Enabled:** Configured to allow cross-origin requests for development.

## Technologies Used

- **Backend:** Python, FastAPI, Uvicorn
- **Frontend:** HTML, CSS (Bootstrap 5), JavaScript
- **AI Integration:** OpenAI GPT-4 API
- **Version Control:** Git, GitHub

## Installation

### Prerequisites

- Python 3.8+
- Git
- An OpenAI API key with access to GPT-4

### Setup Instructions

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/Oded-Ben-Yair/AIEmojiStoryteller.git
   cd AIEmojiStoryteller
   ```

2. **Create and Activate a Virtual Environment:**

   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```

3. **Install the Dependencies:**

   ```bash
   pip install -r requirements.txt
   ```

   *Note: If you don't have a `requirements.txt` file, create one with the following packages:*

   ```txt
   fastapi
   uvicorn
   openai
   ```

4. **Set Up Environment Variables:**

   Make sure to set your OpenAI API key:

   ```bash
   export OPENAI_API_KEY="your_openai_api_key_here"
   ```

   *Consider adding this line to your shell profile (e.g., `~/.bashrc` or `~/.zshrc`) for persistence.*

5. **Run the Backend Server:**

   ```bash
   uvicorn app:app --reload
   ```

6. **Access the Frontend:**

   If you’re serving static files from FastAPI, navigate to:  
   [http://127.0.0.1:8000/static/index.html](http://127.0.0.1:8000/static/index.html)

   Otherwise, open `static/index.html` directly in your browser or serve it via a simple HTTP server:

   ```bash
   cd static
   python3 -m http.server 8001
   ```
   Then open [http://127.0.0.1:8001/index.html](http://127.0.0.1:8001/index.html) in your browser.

## Usage

1. **Text-to-Story Mode:**
   - Enter a story prompt in the provided text area.
   - Click the **Translate to Emojis** button to generate an emoji sequence.
   - Click **Generate Story** to create a narrative that explains each emoji.

2. **Emoji-to-Story Mode:**
   - Switch to the Emoji-to-Story tab.
   - Enter your emoji sequence directly.
   - Click **Generate Story from Emojis** to generate a story.

3. **API Testing:**
   - Access the built-in Swagger UI at [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs) to test the endpoints manually.

## API Endpoints

- **POST `/translate`:**
  - **Request Body:** JSON object containing `prompt` (string)
  - **Response:** JSON object with `emojis` (string)

- **POST `/generate`:**
  - **Request Body:** JSON object containing `emojis` (string)
  - **Response:** JSON object with `story` (string)

- **POST `/reverse`:**
  - **Request Body:** JSON object containing `emojis` (string)
  - **Response:** JSON object with `story` (string)

## Contributing

Contributions are welcome!
