import mongoose from "mongoose";

export function connect() {
  mongoose
    .connect(process.env.MONGO_URI!)
    .then(() => {
      console.log("[MongoDB] : Connected to Database.");
    })
    .catch((error) => {
      console.log(
        "[MongoDB] : An error occurred when try to connecting to Database."
      );
      console.log(error);
      process.exit(1);
    });
}
