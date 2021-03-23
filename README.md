# Short URL with Serverless + Redis + Netlify
### Create your own "short url" service in minutes, not days.
##### Try it here: https://serverless-url-shortener-upstash.netlify.app
---
This project aims to create a scalable and open-source solution alternative to Bit.ly, Tinyurl, Goo.gl, etc. If you want:

- Create unlimited shorted urls in your own cloud
- Use a custom domain of yours
- Scalable and cheap solution
- ✨Magic ✨

This is **exactly** for you.

## How to install
The installation is simple once you are registered in **Netlify**. Please note that you can easily change this serverless function to work with other alternatives if you are used to serverless functions (basically just change the entry point and the request body).

### Requirements
- Create an account in Netlify (it's free)
- Create an account in Upstash to use a free Redis database (or use your own cloud Redis solution)
- This project was made using Node v14.15.5
- The npm version used to install the packages is v6.14.11

### Installation
- Clone this project
- Run **npm run install** in the projects folder
- Configure your environment variables in **Netlify** (see below how)
- Push your project to **Netlify**  or run **netlify dev --live** (note: you must install netlify-cli before, see how [here.](https://docs.netlify.com/cli/get-started/)

### Configuring Netlify Environment Variables
The good thing about Netlify is that we can use our environment variables in production and local. You must configure the following variables to work with this project without problems when running netlify dev --live:

Environment Variable | Description | Example
--- | --- | ---
REDIS_HOST | Your redis **host** (upstash or other alternative) | 127.0.0.1
REDIS_PORT | Your redis **port** (upstash or other alternative) | 66587
REDIS_PASSWORD | Your redis **password** (upstash or other alternative) | 127.0.0.1
BASE_URL | Your netlify base URL (production or development) | https://serverless-url-shortener-upstash.netlify.app/
RECAPTCHA_PRIVATE_KEY | Your google private recaptcha key | 

All those variables are mandatory and the system won't work without them. They are accessed via proccess.env.

### Good to go?
1. Create account in service providers
2. Setup environment variables
3. Install the project
4. Install netlify-cli
5. Install dependencies with npm install
6. Run the project with **netlify dev --live**
7. Try it free.

If you want to talk, you get find me here: msfbr.00@gmail.com