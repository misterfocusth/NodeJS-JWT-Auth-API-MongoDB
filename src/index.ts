import * as dotenv from "dotenv";
import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";
import * as http from "http";
import express, { Application, Request, Response } from "express";
import { connect as createDatabaseConn } from "./config/database";
import { User } from "./model/user";
import { verifyToken } from "./middleware/auth";

dotenv.config();

const app: Application = express();
app.use(express.json());
createDatabaseConn();

const server = http.createServer(app);

app.post("/apis/register", async (req: Request, res: Response) => {
   try {
      const { first_name, last_name, email, password } = req.body;

      if (!(first_name && last_name && email && password)) {
         res.status(400).send("Request Body Missing Please Try Again !");
      }

      const existUser = await User.findOne({ email });

      if (existUser) {
         return res
            .status(409)
            .send(
               "This email has been registered, please login instead or try to register with another email address."
            );
      }

      const encryptedPassword = await bcrypt.hash(password, 10);

      const user = await User.create({
         first_name,
         last_name,
         email: email.toLowerCase(),
         password: encryptedPassword
      });

      const token = jwt.sign(
         { user_id: user._id, email },
         process.env.TOKEN_KEY!,
         { expiresIn: "2h" }
      );

      user.token = token;

      res.status(201).json(user);
   } catch (error) {
      console.log(error);
   }
});

app.post("/apis/login", async (req: Request, res: Response) => {
   try {
      const { email, password } = req.body;

      if (!(email && password)) {
         res.status(400).send(
            "Email and Password are required for authentication process !"
         );
      }

      const existUser = await User.findOne({ email });

      if (existUser && (await bcrypt.compare(password, existUser.password))) {
         const token = jwt.sign(
            { user_id: existUser._id, email },
            process.env.TOKEN_KEY!,
            { expiresIn: "2h" }
         );
         existUser.token = token;
         res.status(200).json(existUser);
      } else {
         res.status(400).send(
            "Authentication failed: invalid credential please check your email and password !"
         );
      }
   } catch (error) {
      console.log(error);
   }
});

app.post("/welcome", verifyToken, (req: Request, res: Response) => {
   res.status(200).send("Welcome Back :)");
});

const API_PORT = process.env.PORT || process.env.API_PORT;

server.listen(API_PORT, () => {
   console.log(`Server are now running on port: ${API_PORT}`);
});
