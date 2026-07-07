const db = require("../config/db");

exports.getAllPromos = async (req, res) => {
    try {
        const promos =await db("promos").select("*");
        return res.status(200).json(promos);
        
    } catch (error) {
        console.error("Erreur lors de la récupération des promos :", error);
        return res.status(500).json({ message: "Erreur lors de la récupération des promotions"});
    }
}

exports.createPromo = async (req, res) => {
    try {
        const {name} = req.body;
        if (!name) {
            return res.status(400).json({message: "Le nom de la promotion est obligatoire."});
        }
        const [newPromoId] = await db("promos").insert({
            name: name
        })
        return res.status(201).json({
            message: "Promotion créee avec succès !",
            id: newPromoId
        })
    } catch (error) {
        console.error("Erreur lors de la création de la promo :", error);
        return res.status(500).json({message: "Erreur lors de la création de la promotion"});
    }
}

exports.updatePromo = async (req, res) => {
    try {
        const {id} = req.params;
        const {name, is_active} = req.body;
        const promoExist = await db("promos").where({id: id}).first();

        if (!promoExist) {
            return res.status(404).json({message: "Impossible de modifier : cette promotion n'existe pas."});
        }

        await db("promos").where({id: id}).update({
            name: name,
            is_active: is_active
        });
        return res.status(200).json({message: "Promotion mise à jour avec succès !"});

    } catch (error) {
        console.error("Erreur lors de la modification de la promo :", error);
        return res.status(500).json({message: "Erreur lors de la modification de la promotion."});
    }
}

exports.deletePromo = async (req, res) => {
    try {
        const { id } = req.params;
        const promoExist = await db("promos").where({ id: id }).first();

        if (!promoExist) {
            return res.status(404).json({ message: "Impossible de supprimer : cette promotion n'existe pas." });
        }
        
        await db("promos").where({ id: id }).update({ is_active: 0 });
        return res.status(200).json({ message: "Promotion supprimée avec succès !" });

    } catch (error) {
        console.error("Erreur lors de la suppression de la promo :", error);
        return res.status(500).json({ message: "Erreur interne lors de la suppression de la promotion."});
    }
}