const db = require("../config/db");
const bcrypt = require("bcrypt");
const SALT_ROUNDS = 10;

exports.register = async (req, res) => {
    try {
        const { username, first_name, last_name, email, password, birth_date, promo_id } = req.body;
        
        if (!username || !first_name || !last_name || !email || !password) {
            return res.status(400).json({ message: "Tous les champs obligatoires doivent être remplis. "});
        }
        
        const  userExist = await db("users")
            .where({email: email})
            .orWhere({username: username })
            .first();
        
        if (userExist) {
            return res.status(409).json({ message: "L'identifiant ou l'adresse email est déjà utilisé." });
        }
        
        const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
        const [newUserId] = await db("users").insert({
            username,
            first_name,
            last_name,
            email,
            password_hash: passwordHash,
            birth_date: birth_date || null,
            promo_id: promo_id || null
        });
        
        return res.status(201).json({
            message: "Utilisateur dévelopé et enregistré avec succés !",
            userId: newUserId
        });
    } catch (error) {
        console.error("Erreur lors de l'inscription :", error);
        return res.status(500).json({ message: "Erreur interne lors de la création du compte."});
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const users = await db("users").select(
            "id",
            "username",
            "first_name",
            "last_name",
            "email",
            "role",
            "created_at"
        );
        return res.status(200).json(users);
        
    } catch (error) {
        console.error("Erreur lors de la récupération des utilisateurs :", error);
        return res.status(500).json({message: "Erreur lors de la récupération des utilisateurs"});
    }
};

exports.getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await db("users")
            .where({ id: id})
            .select("id", "username", "first_name", "last_name", "email", "role", "birth_date", "promo_id", "created_at")
            .first();
        if (!user) {
            return res.status(404).json({ message: "Utilisateur introuvable." });
        }
        return res.status(200).json(user);
    } catch (error) {
        console.error("Erreur lors de la récupération du profil :", error);
        return res.status(500).json({ message: "Erreur lors de la récupération du profil" });
    }
};