const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
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

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if(!email || !password) {
            return res.status(400).json({ message: "L'email est le mot de pass sont obligatoire."});
        }
        
        const user = await db("users").where({ email: email }).first();
        if (!user) {
            return res.status(401).json({ message: "Identifiant invalide." });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password_hash);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Identifiants invalide." });
        }

        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET, //aller dans .env
            { expiresIn: "24h" }
        );
        
        return res.status(200).json({
            message: "Connexion réussi !",
            token: token
        });
        
    } catch (error) {
        console.error("Erreur lors de la connexion :", error);
        return res.status(500).json({ message: "Erreur interne lors de la connexion."});
    }
};

exports.getProfile = async (req, res) => {
    try {
        const currentUserId = req.user.id;
        const user = await db("users")
            .where({ id: currentUserId })
            .select("id", "username", "first_name", "last_name", "email", "role", "created_at")
            .first();
        return res.status(200).json(user);

    } catch (error) {
        console.error("Erreur lors de la récupération de mon profil :", error);
        return res.status(500).json({ message: "Erreur lors de la récupération du profil." });
    }
};

exports.updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const currentUserId = req.user.id;
        if (parseInt(id) !== currentUserId) {
            return res.status(403).json({ message: "Action interdite : vous ne pouvez modifier que votre propre profil." });
        }

        const { username, first_name, last_name } = req.body;
        const userExist = await db("users").where({ id: id}).first();
        if (!userExist) {
            return res.status(404).json({ message: "Utilisateur introuvable." });
        }

        await db ("users").where({ id: id }).update({
            username: username,
            first_name: first_name,
            last_name: last_name
        });

        return res.status(200).json({ message: "Profil mis a jour avec succès !" });

    } catch (error) {
        console.error("Erreur lors de la modification :", error);
        return res.status(500).json({ message: "Erreur lors de la modification du profil." });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const currentUserId = req.user.id;
        if (parseInt(id) !== currentUserId) {
            return res.status(403).json({ message: "Action interdite : vous ne pouvez supprimer que votre propre compte."});
        }

        const userExist = await db("users").where({ id: id }).first();
        if (!userExist) {
            return res.status(404).json({ message: "Utilisateur introuvable." });
        }

        await db("users").where({ id: id }).del();
        return res.status(200).json({ message: "Compte supprimé avec succès !" });

    } catch (error) {
        console.error("Erreur lors de la suppression :", error);
        return res.status(500).json({ message: "Erreur lors de la suppression du compte. "});
    }
};

exports.updateRole = async (req, res) => {
    try {
        const { id } = req.params;
        const { role } = req.body;
        const validRoles = [ "president", "vice_president", "tresorier", "secretaire", "responsable_evenementiel", "responsable_communication", "membre"];
        if (!role || !validRoles.includes(role)) {
            return res.status(400).json({ message : "Rôle invalide. Les rôles accepté sont : " + validRoles.join(", ") });
        }

        const userExist = await db("users").where({ id: id }).first();
        if(!userExist) {
            return res.status(404).json({ message: "Utilisateur introuvable." });
        }

        await db("users").where({ id: id }).update({
            role: role
        });

        return res.status(200).json({ message: `le rôle de l'utilisateur a été mis à jour avec succès en tant que : ${role}.` });

    } catch (error) {
        console.error("Erreur lors de la modification du rôle :", error);
        return res.status(500).json({ message: "Erreur interne lors de la modfication du rôle." });
    }
};