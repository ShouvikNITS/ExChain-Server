import pkg from "@prisma/client";
const { PrismaClient } = pkg;

import validator from "validator";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

const getUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany();
        return res.status(200).send(users);
    } catch (e) {
        console.error("Error fetching users:", e);
        return res.status(500).send("An error occurred.");
    }
};

const addUser = async (req, res) => {
    try {
        const { username, email, password, age } = req.body;

        if (!username || validator.isEmpty(username.trim())) {
            return res.status(400).send("Name cannot be empty");
        }
        if (!email || validator.isEmpty(email.trim())) {
            return res.status(400).send("Email Address cannot be empty");
        }
        if (!password || validator.isEmpty(password)) {
            return res.status(400).send("Password cannot be empty");
        }

        if(!age || validator.isEmpty(age.toString().trim())) {
            return res.status(400).send("Age cannot be empty");
        }

        if (!validator.isEmail(email)) {
            return res.status(400).send("Invalid email");
        }

        if (!validator.isStrongPassword(password, { minLength: 8 })) {
            return res
                .status(400)
                .send(
                    "Password is not strong enough. It should be at least 8 characters and include uppercase, lowercase, number, and symbol."
                );
        }

        const existingUser = await prisma.user.findUnique({
            where: { email: email },
        });

        if (existingUser) {
            return res.status(400).send("User already exists");
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await prisma.user.create({
            data: {
                username: username,
                email: email.toLowerCase(),
                password: hashedPassword,
                age: age,
                points: 10
            },
        });

        res.status(200).send(newUser);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        if (!email) {
            return res.send("Email cannot be empty");
        }

        if (!password) {
            return res.send("Password cannot be empty");
        }

        const existingUser = await prisma.user.findUnique({
            where: { email: email.toLowerCase() },
        });

        if (!existingUser) {
            return res.send("User does not exists, Sign Up");
        }

        const isPasswordValid = await bcrypt.compare(
            password,
            existingUser.password
        );
        if (!isPasswordValid) {
            return res.status(401).send("Invalid password");
        }

        return res.status(200).json({
            message: "Login successful",
            user: {
                id: existingUser.id,
                email: existingUser.email,
                name: existingUser.name,
            },
        });
    } catch (e) {
        return res.json({ error: e.message });
    }
};

export { getUsers, addUser, loginUser };