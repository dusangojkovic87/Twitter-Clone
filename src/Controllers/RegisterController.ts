import { Request, Response } from "express";
import User from "../Models/User";
import validator from "validator";
import bcrypt from "bcrypt";

export function getRegisterPage(req: Request, res: Response) {
  res.render("register");
}

export async function postRegister(req: Request, res: Response) {
  const { name, surname, email, password } = req.body;
  if (
    validator.isEmpty(name) ||
    validator.isEmpty(surname) ||
    validator.isEmpty(email) ||
    validator.isEmpty(password)
  ) {
    res.render("register", { errorMessage: "Fields cannot be empty!" });
    return;
  }

  if (!validator.isEmail(email)) {
    res.render("register", { errorMessage: "Email is not valid!" });
    return;
  }

  let user = await User.findOne({ email: email });

  if (user) {
    res.render("register", { errorMessage: "User already exists!" });
    return;
  }
  let salt = await bcrypt.genSalt(10);

  let hashedPass = await bcrypt.hash(password, salt);

  let newUser = new User({
    name: name,
    surname: surname,
    email: email,
    password: hashedPass,
  });

  newUser
    .save()
    .then(() => {
      res.redirect("login");
      return;
    })
    .catch(() => {
      res.render("register", { errorMessage: "Error,user not saved!" });
      return;
    });
}
