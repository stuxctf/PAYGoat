# 🚀 Introduction and Setup Tips

Welcome to the **PAYGoat Lessons** section! 

Before diving into the exercises, make sure your environment is properly configured to interact with the application and intercept traffic.

---

## 🌐 Setting up Proxy for Localhost (Mozilla Firefox)

To properly capture and modify requests to `localhost` using **Burp Suite**, you must allow Firefox to proxy local addresses. Follow these steps:

1. Open **Firefox**.
2. Go to `about:config` in the address bar.
3. Search for `network.proxy.allow_localhost`.
4. Set the value to **true**.

This setting ensures that requests to `127.0.0.1` or `localhost` are correctly forwarded through your configured proxy (e.g., Burp Suite).

---

## 🛠️ Running Services Manually

If you encounter issues with the provided `run` scripts, such as:

- Scripts not working on your operating system
- Permission errors
- Environment differences

You can start the services manually:

1. **Backend Service**  
   Navigate to the backend folder and run:
   ```bash
   cd backend
   npm install
   node server.js
   ```

2. **Frontend Service**  
   Navigate to the frontend folder and run:
   ```bash
   npm install
   npm start 
   ```

> ⚡ Remember: Both backend and frontend must be running for the full functionality of the lessons.

---

## ⚙️ Important Tips

- Keep **Burp Suite** or your preferred intercepting proxy **running** while testing.
- Ensure your browser is properly **configured** to route traffic through your proxy.
- Always check the **network tab** if something does not seem to work.
- If using different ports, update the API URLs accordingly in the frontend configuration.

---

Happy hacking! 🎯
