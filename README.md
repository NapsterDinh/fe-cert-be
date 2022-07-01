## ❯ Getting Started

I just implemented swagger for easy to test the APIs: http://localhost:5000/swagger => username: admin  password: 1234
I just wrote simple unit testing using jest. I also include .env file, so you don't need to create one

## ❯ Deployment

Please make sure you installed [Docker](https://www.docker.com/products/docker-desktop)
Open terminal and cd to the project folder, then run the following command:

```bash
docker-compose up -d
```

## ❯ Setup Application

### Step 1: Set up the Development Environment

```bash
npm install --global yarn
```

### Step 2: Create Environment Variables

```bash
npm install or yarn install
```
### Step 4: Run tests

Go to the project dir and test your app with this yarn script.

```bash
yarn test --
```

### Step 3: Serve your App

Before start your project, please make sure you already started docker container

Go to the project dir and start your app with this yarn script.

```bash
npm start dev or yarn dev
```

