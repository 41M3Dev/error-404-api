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

        const userExist = await db("users")
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
            message: "Utilisateur développé et enregistré avec succès !",
            userId: newUserId
        });
    } catch (error) {
        console.error("Erreur lors de l'inscription :", error);
        return res.status(500).json({ message: "Erreur interne lors de la création du compte."});
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const users = await db("users")
            .where({ "users.is_active": 1 })
            .select(
                "id",
                "username",
                "first_name",
                "last_name",
                "email",
                "role",
                "users.created_at"
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
            .where({ "users.id": id})
            .andWhere({ "users.is_active": 1 })
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
            return res.status(400).json({ message: "L'email et le mot de passe sont obligatoires."});
        }

        const user = await db("users")
            .leftJoin("bde_members", "users.id", "bde_members.user_id")
            .select(
                "users.id",
                "users.password_hash",
                "users.role",
                "bde_members.position as bde_role"
            )
            .where({ "users.email": email})
            .andWhere({ "users.is_active": 1 })
            .first();

        if (!user) {
            return res.status(401).json({ message: "Identifiant invalide." });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password_hash);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Identifiants invalides." });
        }

        const token = jwt.sign(
            {
                id: user.id,
                role: user.role,
                bde_role: user.bde_role || "aucun"
            },
            process.env.JWT_SECRET,
            { expiresIn: "24h" }
        );

        return res.status(200).json({
            message: "Connexion réussie !",
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
            .leftJoin("bde_members", "users.id", "bde_members.user_id")
            .select(
                "users.id",
                "users.username",
                "users.first_name",
                "users.last_name",
                "users.email",
                "users.role",
                "bde_members.position as bde_role",
                "users.created_at"
            )
            .where({ "users.id": currentUserId })
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

        await db("users").where({ id: id }).update({
            username: username,
            first_name: first_name,
            last_name: last_name
        });

        await db("bde_members").where({ user_id: id }).update({
            full_name: `${first_name} ${last_name}`
        });

        return res.status(200).json({ message: "Profil mis à jour avec succès !" });

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

        await db("users").where({ id: id }).update({
            is_active: 0
        });
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
        const validBdeRoles = ["president", "vice_president", "tresorier", "secretaire", "responsable_evenementiel", "responsable_communication", "membre"];

        if (!role || !validBdeRoles.includes(role)) {
            return res.status(400).json({message: "Rôle BDE invalide. Les Rôles acceptés sont : " + validBdeRoles.join(", ")});
        }

        const userExist = await db("users").where({ id: id }).first();
        if(!userExist) {
            return res.status(404).json({ message: "Utilisateur introuvable. "});
        }

        const isAlreadyInBde = await db("bde_members").where({ user_id: id }).first();

        if (isAlreadyInBde) {
            await db("bde_members").where({ user_id: id }).update({ position: role });
        } else {
            await db("bde_members").insert({
                user_id: id,
                position: role,
                full_name: `${userExist.first_name} ${userExist.last_name}`
            });
        }

        return res.status(200).json({ message: `Le rôle BDE a été mis à jour avec succès en tant que : ${role}.` });

    } catch (error) {
        console.error("Erreur lors de la modification du rôle :", error);
        return res.status(500).json({ message: "Erreur interne lors de la modification du rôle." });
    }
};