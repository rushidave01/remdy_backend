module.exports = {
    apps: [
      {
        name: "remdy",
        script: "npm",
        args: "run start",
        watch: false, // Set to true if you want automatic restarts on file changes
        autorestart: true,
        max_memory_restart: "500M",
        env: {
        //   NODE_ENV: "production",
        NODE_ENV: "DEVELOPMENT",
        },
        // Pre-build the project before starting
        post_update: ["npm install", "npm run clean", "npm run build"],
      },
    ],
  };
  