# User Guide: Ikonex Academy SMS

This guide helps you set up, run, and use the Ikonex Academy Student Management System.

---

## 1. Setup (Local Development)

Follow these steps to run the portal on your own computer:

### Prerequisites
- **Git**: A tool to download the system code.
- **Node.js**: A helper program needed to run backend code.
- **MongoDB**: A database system where all student records are stored.

### Installation Steps
1. Open your terminal or command prompt.
2. Download the project code by typing:
   ```bash
   git clone https://github.com/SethKkorir/ikonex-academy.git
   ```
3. Go into the folder:
   ```bash
   cd ikonex-academy
   ```
4. Install the backend software packages:
   ```cmd
   npm install
   ```
5. Create a new text file named `.env` in the main folder.
6. Open `.env` and add the following two lines of setup information:
   ```text
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/ikonex
   ```
7. Start the backend database server:
   ```cmd
   npm run dev
   ```
8. To run the frontend user interface, double-click the file named `index.html` located in the `client` folder. It will open in your web browser.

---

## 2. Deployment

Follow these steps to put both your backend server and frontend client on Vercel:

### Deploying the Backend on Vercel
1. Create a free account on [Vercel.com](https://vercel.com).
2. Click **Add New** and select **Project**.
3. Import the `ikonex-academy` repository.
4. Expand **Environment Variables** in the setup settings.
5. Add a variable named `MONGO_URI` and paste your online MongoDB connection string.
6. Click **Deploy**. Copy the API website link Vercel gives you (for example, `https://my-backend.vercel.app`).

### Deploying the Frontend on Vercel
1. Go to your Vercel Dashboard, click **Add New** and select **Project**.
2. Import the `ikonex-academy` repository again.
3. In the setup settings, find **Root Directory** and click **Edit**. Select the `client` folder.
4. Click **Deploy**. Vercel will give you a public website address for your students and teachers to visit.

### Connecting Frontend to Backend
1. Open the file `client/app.js` on your computer.
2. Change the server link on the very first line:
   ```javascript
   const API_BASE_URL = 'https://my-backend.vercel.app/api';
   ```
   *(Replace `https://my-backend.vercel.app` with the real URL Vercel gave you for the backend project).*
3. Save the file and upload the changes back to your GitHub repository. Vercel will update your live website automatically.

---

## 3. System Usage

This section explains how to perform daily administrative tasks on the portal:

### How to Create a Class Stream
1. Open the portal website in your browser.
2. Click **Class Streams** in the left sidebar menu.
3. Click the **Create New Stream** button.
4. Type the class name (for example, `Form 1A`) and click **Create Stream**.

### How to Register a Student
1. Click **Dashboard** or **Students** in the left sidebar menu.
2. Click the **Register Student** or **Add New Student** button.
3. Type the student's full name.
4. Select their assigned class stream from the dropdown list.
5. Click the submit button to save.

### How to Create a Subject
1. Click **Subjects** in the left sidebar menu.
2. Click the **Create New Subject** button.
3. Type the subject name (for example, `Mathematics`).
4. Click **Create Subject** to save it and link it to all class streams.

### How to Record Exam Scores
1. Click **Input Scores** in the left sidebar menu.
2. Select the student's name from the list.
3. Select the subject name from the dropdown.
4. Type the exam score (between `0` and `100`).
5. Click **Record Score Record** to save the grade.

### How to View Results and Rankings
1. Click **Results & Analytics** in the left sidebar menu.
2. View the **Performance by Subject** bar chart to see overall subject averages.
3. View the **Grade Distribution** chart to see how many students got A, B, C, D, or F.

### How to Generate a PDF Report Card
1. Go to the **Results & Analytics** page.
2. Scroll down to the **Generate PDF Reports** section.
3. Select a student's name under **Select Student**.
4. Click the **Print Report Card** button.
5. A printable page will pop up. Select **Save as PDF** in your browser print options to save the report card.
