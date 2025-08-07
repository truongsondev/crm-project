import UserRepo from "../repositories/user.repo.js";
import { generateKeyPairSync } from "crypto";
import { createTokenPair } from "../jwt/token.js";
import { AuthorizedError, NotFoundError } from "../http/error.http.js";

// const mockUsers = [
//   {
//     first_name: "Michael",
//     last_name: "Tran",
//     username: "michael_tran",
//     password: "123456",
//     email: "michael@example.com",
//     address: "789 Oak St",
//     salutation: "Mr.",
//     role: "SALES_MGR",
//     job_title: "Sales Manager",
//     is_active: true,
//     is_manager: true,
//     hired_date: new Date("2023-11-20"),
//   },
//   {
//     first_name: "Emma",
//     last_name: "Le",
//     username: "emma_le",
//     password: "123456",
//     email: "emma@example.com",
//     address: "321 Pine St",
//     salutation: "Ms.",
//     role: "CONTACT_EMP",
//     job_title: "Contact Staff",
//     is_active: true,
//     is_manager: false,
//     hired_date: new Date("2024-03-10"),
//   },
//   {
//     first_name: "David",
//     last_name: "Pham",
//     username: "david_pham",
//     password: "123456",
//     email: "david@example.com",
//     address: "654 Cedar Ave",
//     salutation: "Mr.",
//     role: "CONTACT_MGR",
//     job_title: "Contact Manager",
//     is_active: true,
//     is_manager: true,
//     hired_date: new Date("2022-09-05"),
//   },
//   {
//     first_name: "Sophia",
//     last_name: "Hoang",
//     username: "sophia_hoang",
//     password: "123456",
//     email: "sophia@example.com",
//     address: "987 Birch Blvd",
//     salutation: "Ms.",
//     role: "CONTACT_EMP",
//     job_title: "Course Seller",
//     is_active: true,
//     is_manager: false,
//     hired_date: new Date("2024-06-01"),
//   },
//   {
//     first_name: "Liam",
//     last_name: "Vo",
//     username: "liam_vo",
//     password: "123456",
//     email: "liam@example.com",
//     address: "852 Maple Ln",
//     salutation: "Mr.",
//     role: "USER_READ_ONLY",
//     job_title: "Student",
//     is_active: true,
//     is_manager: false,
//     hired_date: new Date("2025-01-10"),
//   },
//   {
//     first_name: "Olivia",
//     last_name: "Nguyen",
//     username: "olivia_nguyen",
//     password: "123456",
//     email: "olivia@example.com",
//     address: "963 Walnut Dr",
//     salutation: "Ms.",
//     role: "SALES_MGR",
//     job_title: "Learner",
//     is_active: false,
//     is_manager: false,
//     hired_date: new Date("2023-08-25"),
//   },
//   {
//     first_name: "James",
//     last_name: "Bui",
//     username: "james_bui",
//     password: "123456",
//     email: "james@example.com",
//     address: "147 Spruce Ct",
//     salutation: "Mr.",
//     role: "DIR",
//     job_title: "System Admin",
//     is_active: true,
//     is_manager: true,
//     hired_date: new Date("2021-04-17"),
//   },
//   {
//     first_name: "Ava",
//     last_name: "Dang",
//     username: "ava_dang",
//     password: "123456",
//     email: "ava@example.com",
//     address: "258 Cherry Way",
//     salutation: "Ms.",
//     role: "USER_ADMIN",
//     job_title: "Course Creator",
//     is_active: true,
//     is_manager: false,
//     hired_date: new Date("2023-12-05"),
//   },
//   {
//     first_name: "Henry",
//     last_name: "Ngoc",
//     username: "henry_ngoc",
//     password: "123456",
//     email: "henry@example.com",
//     address: "369 Aspen Rd",
//     salutation: "Dr.",
//     role: "CONTACT_EMP",
//     job_title: "Contact Support",
//     is_active: false,
//     is_manager: false,
//     hired_date: new Date("2022-06-12"),
//   },
// ];

class AuthService {
  static async signIn({ user_name, password }) {
    const user = await UserRepo.findUser({ user_name });
    console.log(user);
    if (!user) {
      throw new NotFoundError((message = "User not found"));
    }
    const matchPassword = password === user.password;

    if (!matchPassword) {
      throw new AuthorizedError({ message: "Incorrect password" });
    }

    const { publicKey, privateKey } = generateKeyPairSync("rsa", {
      modulusLength: 2048,
    });
    const publicKeyString = publicKey
      .export({ type: "pkcs1", format: "pem" })
      .toString();
    const { accessToken, refreshToken } = createTokenPair(
      {
        _id: user._id,
      },
      publicKeyString,
      privateKey
    );
    const saveUser = await UserRepo.updateUser({
      _id: user._id,
      accessToken,
      refreshToken,
      publicKeyString,
    });
    if (!saveUser) {
      throw new Error("Internal Server Error");
    }
    return {
      user: user,
      token: {
        accessToken,
        refreshToken,
      },
    };
  }
  static async signUp(user_name = "user", password = "Lson123456@") {
    // const users = await UserRepo.createUsers(mockUsers);
    // const user = await UserRepo.createUser({ user_name, password });
    // console.log("user::::", users);
  }
}

export default AuthService;
