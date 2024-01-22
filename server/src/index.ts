import App from "./app";

const main = async () => {
  const app = new App();
  try {
    await app.connectDB();
    try {
      await app.connectRedis();
      await app.init();
    } catch (error) {
      console.error("📌 Could not connect to the Redis Client", error);
    }
  } catch (error) {
    console.error("📌 Could not connect to the database", error);
  }
};

main();
