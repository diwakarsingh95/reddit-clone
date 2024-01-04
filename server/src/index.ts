import App from "./app";

const main = async () => {
  const app = new App();
  try {
    await app.connect();
    await app.init();
  } catch (error) {
    console.error("📌 Could not connect to the database", error);
  }
};

main();
