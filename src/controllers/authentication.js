const {
    createUser,
    getUserByEmail,
    getUserByUsername,
    getUserBySessionToken,

} = require("../models/user");

const {
    randomBase64,
    hashToHex,
    sendCookie,
    decodeSessionJwt,
} = require("../helpers/authentication");

const jwt = require("jsonwebtoken");
const { get } = require("mongoose");

const registerUser = async (req, res) => {
    try
    {
        const { username, email, password } = req.body;

        if (!username || !email || !password)
        {
            return res.status(400).json(
                {
                    message: "Please provide all the required fields",
                });
        }

        const existingEmail = await getUserByEmail(email);
        const existingUsername = await getUserByUsername(username);

        
        if (existingEmail){
            return res.status(400).json({
                message : "Email already exists",
            });
        }

        if (existingUsername){
            return res.status(400).json({
                message : "Username already exists",
            });
        }

        const salt = randomBase64(16);

        await createUser({
            username,
            email,
            authentication: {salt, password: hashToHex(password,salt)},
        });


        return res.status(200).json({
            message: "User created successfully",
        });
        
    }
    catch(error)
    {
        console.log("Error", error);
        return res.status(500).json(
            {
                message: "Something went wrong"
            });
    }
};

const loginUser = async (req,res) => {
    try {

        const { email, password} = req.body;

        if (!email || !password){
            return res.status(400).json({
                Message : "Please provide all the required fields",
            });
        }

        const exitingUser = await getUserByEmail(email).select(
            "+authentication.password +authentication.salt",
        );

        if (!exitingUser){
            return res.status(400).json({
                message : "User does not exist",
            });
        }

        const expectedHash = hashToHex(existingUser.authentication.salt, password);
        const isPassCorrect = expectedHash === existingUser.authentication.password;

        if(!isPassCorrect){
            return res.status(400).json({
                message : "Invalid password",
            });
        }

        const sessionSalt = randomBase64(16);
        existingUser.authentication.sessionToken = hashToHex(
            sessionSalt,
            exitingUser._id.toString(),
        );

        await existingUser.save();

        if(!process.env.JWT_VERIFICATION_SECRET){
            throw new Error("JWT_VERIFICATION_SECRET not found in .env file");
        }

        const sessionJwt = jwt.sign(
            {sessionToken: existingUser.authentication.sessionToken},
            process.env.JWT_VERIFICATION_SECRET,
            { expiresIn: "1d"},
        );

        sendCookie(res, sessionJwt);

        return res.status(200).json({
            message : "Login successfully",
        });
    } catch (error){
        console.log("Error", error);
        return res.status(500).json({
            message : "Something went wrong",
        });
    }
};

const logoutUser = async (req,res) => {
    res.clearCookie("PAW_20", {
        path: "/",
        httpOnly: true,
        sameSite: "none",
        secure: true,
    });

    return res.status(200).json({
        message : "Logout successful",
    });
};

const getUserSession = async (req,res) => {
    try{
        const decodeToken = decodeSessionJwt(req, res);

        const existingUser = await getUserBySessionToken(decodeToken.sessionToken);

        if (!existingUser){
            return res.status(400).json({
                message : "Unauthorized",
            });
        }
    
    const session = {
        username: existingUser.username,
        email: existingUser.email,
    };
        return res.status(200).json({
            session,
        });
    }catch(error){
        console.log(error);
        return res.status(500).json({
            message: error.message,
        });
    }
};

module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    getUserSession,
    logoutUser,
};