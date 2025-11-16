# 🍎 MacBook Setup Guide - Porchest Multiportal

Complete step-by-step guide to run the Porchest Multiportal platform on your MacBook with VS Code.

---

## ✅ Prerequisites Check

Before starting, ensure you have these installed on your MacBook:

### 1. **Homebrew** (Package Manager)
```bash
# Check if installed
brew --version

# If not installed, install it:
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

### 2. **Node.js & npm** (v18 or higher)
```bash
# Check versions
node --version  # Should be v18.0.0 or higher
npm --version   # Should be v9.0.0 or higher

# If not installed or outdated:
brew install node@18
```

### 3. **Git**
```bash
# Check if installed
git --version

# If not installed:
brew install git
```

### 4. **Visual Studio Code**
Download from: https://code.visualstudio.com/download
Or install via Homebrew:
```bash
brew install --cask visual-studio-code
```

### 5. **MongoDB** (Choose one option)

#### Option A: MongoDB Compass (Recommended for beginners)
Download from: https://www.mongodb.com/try/download/compass

#### Option B: MongoDB CLI
```bash
brew tap mongodb/brew
brew install mongodb-community@7.0

# Start MongoDB
brew services start mongodb-community@7.0
```

#### Option C: Use Docker (if you have Docker installed)
```bash
docker run -d -p 27017:27017 --name porchest-mongo mongo:7.0
```

#### Option D: Use MongoDB Atlas (Cloud - No local install needed)
Sign up at: https://www.mongodb.com/cloud/atlas/register

---

## 📥 Step 1: Clone the Repository

Open Terminal on your Mac and run:

```bash
# Navigate to where you want the project
cd ~/Desktop  # or any folder you prefer

# Clone the repository
git clone https://github.com/contactporchest-debug/Porchest-Multiportal.git

# Enter the project directory
cd Porchest-Multiportal

# Switch to the feature branch
git checkout claude/implement-multiportal-features-011CV5bAM3u88aso9Dqr9gru
```

---

## 🔧 Step 2: Open in VS Code

```bash
# Open the project in VS Code
code .

# If 'code' command doesn't work:
# 1. Open VS Code manually
# 2. Press Cmd+Shift+P
# 3. Type "Shell Command: Install 'code' command in PATH"
# 4. Then run: code .
```

---

## ⚙️ Step 3: Install Dependencies

In VS Code, open the integrated terminal (`` Ctrl+` `` or View → Terminal):

```bash
# Install all npm packages
npm install

# This will take 2-3 minutes
```

---

## 🔑 Step 4: Configure Environment Variables

### Create .env.local file:

```bash
# Copy the example file
cp .env.local.example .env.local

# Or create it manually in VS Code
```

### Edit .env.local with your values:

**Open `.env.local` in VS Code and add:**

```env
# Generate a secret key (run this in terminal):
# openssl rand -base64 32

NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=YOUR_GENERATED_SECRET_HERE

# MongoDB Connection
# Option 1: Local MongoDB
MONGODB_URI=mongodb://localhost:27017/porchest_db

# Option 2: MongoDB Atlas (if using cloud)
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/porchest_db

# Google OAuth (Optional - for Google login)
# Get from: https://console.cloud.google.com/
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Email (Optional - for magic links)
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=your-email@gmail.com
EMAIL_SERVER_PASSWORD=your-app-password
EMAIL_FROM=noreply@porchest.com

# AI Service (if running separately)
AI_SERVICE_URL=http://localhost:5000
```

### Generate NEXTAUTH_SECRET:
```bash
# In terminal, run:
openssl rand -base64 32

# Copy the output and paste it as NEXTAUTH_SECRET value
```

---

## 🗄️ Step 5: Set Up MongoDB

### Option A: Local MongoDB (If installed)
```bash
# Start MongoDB
brew services start mongodb-community@7.0

# Verify it's running
mongosh

# You should see MongoDB shell
# Type 'exit' to quit
```

### Option B: Docker MongoDB
```bash
# Start MongoDB container
docker run -d -p 27017:27017 --name porchest-mongo mongo:7.0

# Check if running
docker ps
```

### Option C: MongoDB Atlas
1. Go to https://cloud.mongodb.com/
2. Create a free cluster (M0)
3. Create a database user
4. Whitelist your IP (0.0.0.0/0 for development)
5. Get connection string and add to `.env.local`

---

## 🚀 Step 6: Run the Development Server

### Start the Next.js application:

```bash
# In VS Code terminal
npm run dev
```

You should see:
```
   ▲ Next.js 14.2.33
   - Local:        http://localhost:3000
   - Environments: .env.local

 ✓ Ready in 2.3s
```

---

## 🌐 Step 7: Access the Application

Open your browser and go to:
```
http://localhost:3000
```

You should see the Porchest homepage! 🎉

---

## 🧪 Step 8: Test the Application

### Test Authentication:

1. **Go to Sign Up page:**
   ```
   http://localhost:3000/signup
   ```

2. **Create a test account:**
   - Name: Test User
   - Email: test@example.com
   - Password: password123
   - Role: Brand or Influencer

3. **Check if admin approval is required:**
   - Brands and Influencers: Will see "Pending Approval" page
   - Others: Will be automatically active

4. **Create an admin account manually (via MongoDB):**
   ```bash
   # Connect to MongoDB
   mongosh porchest_db

   # Create admin user
   db.users.insertOne({
     full_name: "Admin User",
     email: "admin@porchest.com",
     password_hash: "$2a$10$YourHashedPasswordHere",
     role: "admin",
     status: "ACTIVE",
     verified: true,
     created_at: new Date()
   })
   ```

---

## 🐍 Step 9: Run AI Microservice (Optional)

If you want to run the AI features:

```bash
# Open a new terminal tab in VS Code (Cmd+T)

# Navigate to AI service
cd ai-microservice

# Create virtual environment
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run the Flask server
python app.py

# Or with Gunicorn:
gunicorn --bind 0.0.0.0:5000 app:app
```

AI service will run on: `http://localhost:5000`

---

## 🎯 Step 10: Explore the Portals

### Access Different Portals:

1. **Homepage:** http://localhost:3000
2. **Login:** http://localhost:3000/login
3. **Sign Up:** http://localhost:3000/signup

**After logging in (based on role):**
- **Brand Portal:** http://localhost:3000/brand
- **Influencer Portal:** http://localhost:3000/influencer
- **Client Portal:** http://localhost:3000/client
- **Employee Portal:** http://localhost:3000/employee
- **Admin Portal:** http://localhost:3000/admin

### Brand Portal Features:
- **AI Discovery:** http://localhost:3000/brand/discover
- **Campaigns:** http://localhost:3000/brand/campaigns
- **Analytics:** http://localhost:3000/brand/analytics

---

## 🔧 VS Code Recommended Extensions

Install these extensions for better development experience:

1. **ES7+ React/Redux/React-Native snippets**
2. **Tailwind CSS IntelliSense**
3. **Prettier - Code formatter**
4. **ESLint**
5. **MongoDB for VS Code**
6. **Docker** (if using Docker)

Install via:
1. Press `Cmd+Shift+X` to open Extensions
2. Search and install each extension

---

## 🧪 Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

---

## 📝 Useful VS Code Shortcuts (macOS)

- **Open Terminal:** `` Ctrl+` ``
- **Command Palette:** `Cmd+Shift+P`
- **Quick File Open:** `Cmd+P`
- **Find in Files:** `Cmd+Shift+F`
- **Format Document:** `Shift+Option+F`
- **Split Editor:** `Cmd+\`
- **New Terminal Tab:** `Cmd+T` (in terminal)

---

## 🐛 Troubleshooting

### Issue 1: Port 3000 already in use
```bash
# Find process using port 3000
lsof -ti:3000

# Kill the process
kill -9 $(lsof -ti:3000)

# Or use a different port
PORT=3001 npm run dev
```

### Issue 2: MongoDB connection error
```bash
# Check if MongoDB is running
brew services list | grep mongodb

# Restart MongoDB
brew services restart mongodb-community@7.0
```

### Issue 3: Module not found errors
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Issue 4: Permission errors
```bash
# Fix npm permissions (if needed)
sudo chown -R $(whoami) ~/.npm
```

### Issue 5: Python/AI service issues
```bash
# Make sure Python 3.11+ is installed
python3 --version

# Recreate virtual environment
cd ai-microservice
rm -rf venv
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

---

## 🔄 Updating the Code

If you make changes and want to pull updates:

```bash
# Save your current work
git add .
git commit -m "Your changes"

# Pull latest changes
git pull origin claude/implement-multiportal-features-011CV5bAM3u88aso9Dqr9gru

# Reinstall dependencies if package.json changed
npm install
```

---

## 🛑 Stopping the Application

### Stop Next.js:
- Press `Ctrl+C` in the terminal where it's running

### Stop MongoDB:
```bash
# If using Homebrew
brew services stop mongodb-community@7.0

# If using Docker
docker stop porchest-mongo
```

### Stop AI Service:
- Press `Ctrl+C` in the AI service terminal
- Deactivate virtual environment: `deactivate`

---

## 📊 Project Structure Quick Reference

```
Porchest-Multiportal/
├── app/                    # Next.js pages & API routes
│   ├── (auth)/            # Auth pages (login, signup)
│   ├── api/               # API endpoints
│   ├── brand/             # Brand portal pages
│   ├── influencer/        # Influencer portal pages
│   ├── admin/             # Admin portal pages
│   └── ...
├── components/            # React components
├── lib/                   # Utilities and helpers
├── db/                    # Database models
├── ai-microservice/       # Python AI service
├── .env.local            # Your environment variables
└── package.json          # Dependencies
```

---

## ✅ Quick Start Checklist

- [ ] Prerequisites installed (Node.js, MongoDB, VS Code)
- [ ] Repository cloned
- [ ] Dependencies installed (`npm install`)
- [ ] `.env.local` configured
- [ ] MongoDB running
- [ ] Development server started (`npm run dev`)
- [ ] Application accessible at http://localhost:3000
- [ ] Test account created
- [ ] All portals accessible

---

## 🎉 You're All Set!

Your Porchest Multiportal is now running locally on your MacBook!

### Next Steps:
1. Explore the different portals
2. Test the AI features
3. Create campaigns and collaborations
4. Customize the platform for your needs

### Need Help?
- Check DEPLOYMENT.md for production deployment
- Review README.md for feature documentation
- Open an issue on GitHub if you encounter problems

Happy coding! 🚀
